import { describe, it, expect, vi, beforeEach } from "vitest";
import { PeerDiscoveryProtocol } from "./peer-discovery";

describe("PeerDiscoveryProtocol", () => {
  let protocol: PeerDiscoveryProtocol;

  beforeEach(() => {
    protocol = new PeerDiscoveryProtocol({ peerTimeout: 5000 });
  });

  describe("announce", () => {
    it("should send peer announcement", async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined);

      await protocol.announce(
        sendMessage,
        "peer-1",
        ["/ip4/127.0.0.1/tcp/4001"],
        { version: "1.0" },
      );

      expect(sendMessage).toHaveBeenCalledWith("peer-discovery", {
        type: "peer-announce",
        payload: expect.objectContaining({
          id: "peer-1",
          multiaddrs: ["/ip4/127.0.0.1/tcp/4001"],
          lastSeen: expect.any(Number),
          metadata: { version: "1.0" },
        }),
      });
    });
  });

  describe("requestPeers", () => {
    it("should send peer request", async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined);

      await protocol.requestPeers(sendMessage, "peer-1");

      expect(sendMessage).toHaveBeenCalledWith("peer-discovery", {
        type: "peer-request",
        payload: expect.objectContaining({
          from: "peer-1",
          timestamp: expect.any(Number),
        }),
      });
    });
  });

  describe("receive", () => {
    it("should add peer to known peers on announce", async () => {
      const result = await protocol.receive({
        type: "peer-announce",
        payload: {
          id: "peer-2",
          multiaddrs: ["/ip4/192.168.1.1/tcp/4001"],
          lastSeen: Date.now(),
        },
      });

      expect(result).not.toBeNull();
      expect(result?.id).toBe("peer-2");

      const peers = protocol.getKnownPeers();
      expect(peers).toHaveLength(1);
      expect(peers[0].id).toBe("peer-2");
    });

    it("should ignore non-peer messages", async () => {
      const result = await protocol.receive({ type: "other", payload: {} });
      expect(result).toBeNull();
    });

    it("should ignore peer-request messages", async () => {
      const result = await protocol.receive({
        type: "peer-request",
        payload: { from: "peer-1", timestamp: Date.now() },
      });
      expect(result).toBeNull();
    });
  });

  describe("getKnownPeers", () => {
    it("should return all known peers", async () => {
      await protocol.receive({
        type: "peer-announce",
        payload: { id: "peer-1", multiaddrs: [], lastSeen: Date.now() },
      });

      await protocol.receive({
        type: "peer-announce",
        payload: { id: "peer-2", multiaddrs: [], lastSeen: Date.now() },
      });

      const peers = protocol.getKnownPeers();
      expect(peers).toHaveLength(2);
    });

    it("should remove stale peers", async () => {
      const oldTime = Date.now() - 10000;

      await protocol.receive({
        type: "peer-announce",
        payload: { id: "peer-1", multiaddrs: [], lastSeen: oldTime },
      });

      const peers = protocol.getKnownPeers();
      expect(peers).toHaveLength(0);
    });
  });

  describe("getPeer", () => {
    it("should return specific peer", async () => {
      await protocol.receive({
        type: "peer-announce",
        payload: { id: "peer-1", multiaddrs: [], lastSeen: Date.now() },
      });

      const peer = protocol.getPeer("peer-1");
      expect(peer).not.toBeUndefined();
      expect(peer?.id).toBe("peer-1");
    });

    it("should return undefined for unknown peer", () => {
      const peer = protocol.getPeer("unknown");
      expect(peer).toBeUndefined();
    });
  });

  describe("removePeer", () => {
    it("should remove peer from known peers", async () => {
      await protocol.receive({
        type: "peer-announce",
        payload: { id: "peer-1", multiaddrs: [], lastSeen: Date.now() },
      });

      protocol.removePeer("peer-1");

      const peers = protocol.getKnownPeers();
      expect(peers).toHaveLength(0);
    });
  });
});
