import { describe, it, expect, vi, beforeEach } from "vitest";
import { DirectMessagingProtocol } from "./direct-messaging";

describe("DirectMessagingProtocol", () => {
  let protocol: DirectMessagingProtocol;

  beforeEach(() => {
    protocol = new DirectMessagingProtocol();
  });

  describe("send", () => {
    it("should send a message via the provided function", async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined);
      const message = {
        id: "msg-1",
        from: "peer-1",
        to: "peer-2",
        content: "Hello!",
      };

      await protocol.send(sendMessage, message);

      expect(sendMessage).toHaveBeenCalledWith("peer-2", {
        type: "direct-message",
        payload: expect.objectContaining({
          id: "msg-1",
          from: "peer-1",
          to: "peer-2",
          content: "Hello!",
          timestamp: expect.any(Number),
        }),
      });
    });

    it("should store message in history", async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined);
      const message = {
        id: "msg-1",
        from: "peer-1",
        to: "peer-2",
        content: "Hello!",
      };

      await protocol.send(sendMessage, message);

      const history = protocol.getMessageHistory("peer-1");
      expect(history).toHaveLength(1);
      expect(history[0].id).toBe("msg-1");
    });
  });

  describe("receive", () => {
    it("should call handler when message is received", async () => {
      const handler = vi.fn();
      protocol.setHandler(handler);

      await protocol.receive({
        type: "direct-message",
        payload: {
          id: "msg-1",
          from: "peer-2",
          to: "peer-1",
          content: "Hi!",
          timestamp: Date.now(),
        },
      });

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "msg-1",
          from: "peer-2",
          content: "Hi!",
        }),
      );
    });

    it("should ignore non-direct-message types", async () => {
      const handler = vi.fn();
      protocol.setHandler(handler);

      await protocol.receive({ type: "other", payload: {} });

      expect(handler).not.toHaveBeenCalled();
    });

    it("should store received message in history", async () => {
      await protocol.receive({
        type: "direct-message",
        payload: {
          id: "msg-1",
          from: "peer-2",
          to: "peer-1",
          content: "Hi!",
          timestamp: Date.now(),
        },
      });

      const history = protocol.getMessageHistory("peer-2");
      expect(history).toHaveLength(1);
    });
  });

  describe("getMessageHistory", () => {
    it("should return messages for a specific peer", async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined);

      await protocol.send(sendMessage, {
        id: "msg-1",
        from: "peer-1",
        to: "peer-2",
        content: "Hello!",
      });

      await protocol.receive({
        type: "direct-message",
        payload: {
          id: "msg-2",
          from: "peer-2",
          to: "peer-1",
          content: "Hi!",
          timestamp: Date.now(),
        },
      });

      const history = protocol.getMessageHistory("peer-1");
      expect(history).toHaveLength(2);
    });

    it("should return empty array for unknown peer", () => {
      const history = protocol.getMessageHistory("unknown");
      expect(history).toHaveLength(0);
    });
  });

  describe("clearHistory", () => {
    it("should clear all message history", async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined);

      await protocol.send(sendMessage, {
        id: "msg-1",
        from: "peer-1",
        to: "peer-2",
        content: "Hello!",
      });

      protocol.clearHistory();

      const history = protocol.getMessageHistory("peer-1");
      expect(history).toHaveLength(0);
    });
  });
});
