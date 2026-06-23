import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { HeartbeatProtocol } from "./heartbeat";

describe("HeartbeatProtocol", () => {
  let protocol: HeartbeatProtocol;

  beforeEach(() => {
    protocol = new HeartbeatProtocol("local-peer", {
      interval: 100,
      timeout: 300,
    });
  });

  afterEach(() => {
    protocol.stop();
  });

  describe("send", () => {
    it("should send heartbeat message", async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined);

      await protocol.send(sendMessage);

      expect(sendMessage).toHaveBeenCalledWith("heartbeat", {
        type: "heartbeat",
        payload: expect.objectContaining({
          peerId: "local-peer",
          timestamp: expect.any(Number),
          sequence: 0,
        }),
      });
    });
  });

  describe("receive", () => {
    it("should add peer to status on heartbeat", async () => {
      const result = await protocol.receive({
        type: "heartbeat",
        payload: {
          peerId: "remote-peer",
          timestamp: Date.now(),
          sequence: 1,
        },
      });

      expect(result).not.toBeNull();
      expect(result?.id).toBe("remote-peer");
      expect(result?.isAlive).toBe(true);
    });

    it("should ignore non-heartbeat messages", async () => {
      const result = await protocol.receive({ type: "other", payload: {} });
      expect(result).toBeNull();
    });
  });

  describe("handleResponse", () => {
    it("should update peer status on response", async () => {
      await protocol.receive({
        type: "heartbeat",
        payload: { peerId: "remote-peer", timestamp: Date.now(), sequence: 1 },
      });

      const result = await protocol.handleResponse({
        type: "heartbeat-response",
        payload: { peerId: "remote-peer", timestamp: Date.now(), sequence: 2 },
      });

      expect(result).not.toBeNull();
      expect(result?.sequence).toBe(2);
    });
  });

  describe("getPeerStatus", () => {
    it("should return peer status", async () => {
      await protocol.receive({
        type: "heartbeat",
        payload: { peerId: "remote-peer", timestamp: Date.now(), sequence: 1 },
      });

      const status = protocol.getPeerStatus("remote-peer");
      expect(status).not.toBeUndefined();
      expect(status?.id).toBe("remote-peer");
    });

    it("should return undefined for unknown peer", () => {
      const status = protocol.getPeerStatus("unknown");
      expect(status).toBeUndefined();
    });
  });

  describe("getAllPeerStatuses", () => {
    it("should return all peer statuses", async () => {
      await protocol.receive({
        type: "heartbeat",
        payload: { peerId: "peer-1", timestamp: Date.now(), sequence: 1 },
      });

      await protocol.receive({
        type: "heartbeat",
        payload: { peerId: "peer-2", timestamp: Date.now(), sequence: 1 },
      });

      const statuses = protocol.getAllPeerStatuses();
      expect(statuses).toHaveLength(2);
    });
  });

  describe("start/stop", () => {
    it("should start and stop heartbeat", () => {
      const onPeerDown = vi.fn();
      protocol.start(onPeerDown);

      protocol.stop();

      expect(onPeerDown).not.toHaveBeenCalled();
    });

    it("should detect stale peers", async () => {
      const onPeerDown = vi.fn();

      await protocol.receive({
        type: "heartbeat",
        payload: {
          peerId: "remote-peer",
          timestamp: Date.now() - 500,
          sequence: 1,
        },
      });

      protocol.start(onPeerDown);

      await new Promise((resolve) => setTimeout(resolve, 400));

      protocol.stop();

      expect(onPeerDown).toHaveBeenCalledWith("remote-peer");
    });
  });
});
