import { describe, it, expect, vi, beforeEach } from "vitest";
import { CallManager } from "./call-manager";
import { CallState } from "../types";

vi.mock("@evolve/core", () => ({
  generateId: vi.fn(() => "test-call-id"),
}));

describe("CallManager", () => {
  let cm: CallManager;

  beforeEach(() => {
    vi.clearAllMocks();
    cm = new CallManager();
  });

  describe("createCall", () => {
    it("should create a call and set state to Calling", () => {
      const offer = cm.createCall("alice", "bob");
      expect(offer.callId).toBe("test-call-id");
      expect(offer.from).toBe("alice");
      expect(offer.to).toBe("bob");
      expect(cm.getState("test-call-id")).toBe(CallState.Calling);
    });

    it("should fire onOffer callbacks", () => {
      const cb = vi.fn();
      cm.onOffer(cb);
      cm.createCall("alice", "bob");
      expect(cb).toHaveBeenCalledWith("test-call-id", "alice", "bob");
    });
  });

  describe("acceptCall", () => {
    it("should set state to Connected", () => {
      cm.createCall("alice", "bob");
      cm.acceptCall("test-call-id");
      expect(cm.getState("test-call-id")).toBe(CallState.Connected);
    });

    it("should fire onAccept callbacks", () => {
      const cb = vi.fn();
      cm.onAccept(cb);
      cm.createCall("alice", "bob");
      cm.acceptCall("test-call-id");
      expect(cb).toHaveBeenCalledWith("test-call-id", "", "");
    });

    it("should throw if call not found", () => {
      expect(() => cm.acceptCall("nonexistent")).toThrow(
        "Call nonexistent not found",
      );
    });
  });

  describe("hangupCall", () => {
    it("should remove the call", () => {
      cm.createCall("alice", "bob");
      cm.hangupCall("test-call-id");
      expect(cm.getState("test-call-id")).toBeUndefined();
    });

    it("should fire onHangup callbacks", () => {
      const cb = vi.fn();
      cm.onHangup(cb);
      cm.createCall("alice", "bob");
      cm.hangupCall("test-call-id", "user hung up");
      expect(cb).toHaveBeenCalledWith("test-call-id", "", "user hung up");
    });

    it("should throw if call not found", () => {
      expect(() => cm.hangupCall("nonexistent")).toThrow(
        "Call nonexistent not found",
      );
    });
  });

  describe("receive (incoming signaling)", () => {
    it("should handle an incoming offer", () => {
      const cb = vi.fn();
      cm.onOffer(cb);

      cm.receive({
        type: "offer",
        callId: "call-1",
        from: "bob",
        to: "alice",
        sdp: "sdp-offer",
        timestamp: 100,
      });

      expect(cm.getState("call-1")).toBe(CallState.Ringing);
      expect(cb).toHaveBeenCalledWith("call-1", "bob", "alice");
    });

    it("should handle an incoming accept", () => {
      cm.createCall("alice", "bob");
      const cb = vi.fn();
      cm.onAccept(cb);

      cm.receive({
        type: "accept",
        callId: "test-call-id",
        from: "bob",
        to: "alice",
        sdp: "sdp-answer",
        timestamp: 200,
      });

      expect(cm.getState("test-call-id")).toBe(CallState.Connected);
      expect(cb).toHaveBeenCalledWith("test-call-id", "bob", "alice");
    });

    it("should handle an incoming hangup", () => {
      cm.createCall("alice", "bob");
      const cb = vi.fn();
      cm.onHangup(cb);

      cm.receive({
        type: "hangup",
        callId: "test-call-id",
        from: "bob",
        to: "alice",
        reason: "busy",
        timestamp: 300,
      });

      expect(cm.getState("test-call-id")).toBeUndefined();
      expect(cb).toHaveBeenCalledWith("test-call-id", "bob", "busy");
    });

    it("should handle an incoming ICE candidate", () => {
      const cb = vi.fn();
      cm.onICECandidate(cb);

      cm.receive({
        type: "ice",
        callId: "call-1",
        from: "bob",
        to: "alice",
        candidate: "candidate-1",
        sdpMid: "0",
        sdpMLineIndex: 0,
        timestamp: 400,
      });

      expect(cb).toHaveBeenCalledWith("call-1", "bob", "candidate-1");
    });
  });

  describe("getActiveCalls", () => {
    it("should return only active calls", () => {
      cm.createCall("alice", "bob");
      const active = cm.getActiveCalls();
      expect(active.size).toBe(1);
    });

    it("should not include ended calls", () => {
      cm.createCall("alice", "bob");
      cm.hangupCall("test-call-id");
      expect(cm.getActiveCalls().size).toBe(0);
    });
  });

  describe("integration: full lifecycle", () => {
    it("should complete offer→accept→hangup flow", () => {
      const offerCb = vi.fn();
      const acceptCb = vi.fn();
      const hangupCb = vi.fn();
      cm.onOffer(offerCb);
      cm.onAccept(acceptCb);
      cm.onHangup(hangupCb);

      cm.createCall("alice", "bob");
      expect(cm.getState("test-call-id")).toBe(CallState.Calling);

      cm.receive({
        type: "accept",
        callId: "test-call-id",
        from: "bob",
        to: "alice",
        sdp: "sdp-answer",
        timestamp: 200,
      });
      expect(cm.getState("test-call-id")).toBe(CallState.Connected);
      expect(acceptCb).toHaveBeenCalledWith("test-call-id", "bob", "alice");

      cm.receive({
        type: "hangup",
        callId: "test-call-id",
        from: "bob",
        to: "alice",
        reason: "done",
        timestamp: 300,
      });
      expect(cm.getState("test-call-id")).toBeUndefined();
      expect(hangupCb).toHaveBeenCalledWith("test-call-id", "bob", "done");
      expect(cm.getActiveCalls().size).toBe(0);
    });

    it("should handle caller-initiated hangup", () => {
      cm.createCall("alice", "bob");
      cm.receive({
        type: "accept",
        callId: "test-call-id",
        from: "bob",
        to: "alice",
        sdp: "sdp-answer",
        timestamp: 200,
      });
      cm.hangupCall("test-call-id", "alice hung up");
      expect(cm.getState("test-call-id")).toBeUndefined();
    });

    it("should reject call via hangup with rejected reason", () => {
      cm.createCall("alice", "bob");
      const hangupCb = vi.fn();
      cm.onHangup(hangupCb);

      cm.receive({
        type: "hangup",
        callId: "test-call-id",
        from: "bob",
        to: "alice",
        reason: "rejected",
        timestamp: 200,
      });
      expect(cm.getState("test-call-id")).toBeUndefined();
      expect(hangupCb).toHaveBeenCalledWith("test-call-id", "bob", "rejected");
    });

    it("should handle ICE candidates during an active call", () => {
      cm.createCall("alice", "bob");
      const iceCb = vi.fn();
      cm.onICECandidate(iceCb);

      cm.receive({
        type: "ice",
        callId: "test-call-id",
        from: "bob",
        to: "alice",
        candidate: "candidate-1",
        sdpMid: "0",
        sdpMLineIndex: 0,
        timestamp: 150,
      });
      expect(iceCb).toHaveBeenCalledWith("test-call-id", "bob", "candidate-1");
    });
  });
});
