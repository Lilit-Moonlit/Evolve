import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { HeartbeatProtocol } from "./heartbeat";
import { PeerDiscoveryProtocol } from "./peer-discovery";
import { DirectMessagingProtocol } from "./direct-messaging";

describe("Protocol Integration", () => {
  let heartbeat: HeartbeatProtocol;
  let peerDiscovery: PeerDiscoveryProtocol;
  let directMessaging: DirectMessagingProtocol;

  beforeEach(() => {
    heartbeat = new HeartbeatProtocol("local-peer", {
      interval: 100,
      timeout: 300,
    });
    peerDiscovery = new PeerDiscoveryProtocol({ peerTimeout: 500 });
    directMessaging = new DirectMessagingProtocol();
  });

  afterEach(() => {
    heartbeat.stop();
  });

  describe("heartbeat + peer-discovery", () => {
    it("should integrate heartbeat with peer discovery via shared peer state", async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined);

      // Simulate two peers in a network
      const peerA = "peer-a";
      const peerB = "peer-b";

      // Peer A announces itself (we receive the announcement to simulate network)
      await peerDiscovery.receive({
        type: "peer-announce",
        payload: {
          id: peerA,
          multiaddrs: ["/ip4/127.0.0.1/tcp/4001"],
          lastSeen: Date.now(),
        },
      });

      // Peer B announces itself
      await peerDiscovery.receive({
        type: "peer-announce",
        payload: {
          id: peerB,
          multiaddrs: ["/ip4/127.0.0.1/tcp/4002"],
          lastSeen: Date.now(),
        },
      });

      // Both peers should be known
      const knownPeers = peerDiscovery.getKnownPeers();
      expect(knownPeers).toHaveLength(2);
      expect(knownPeers.map((p) => p.id).sort()).toEqual([peerA, peerB].sort());
    });

    it("should remove peers from discovery when heartbeat detects them as stale", async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined);
      const onPeerDown = vi.fn();

      // Simulate receiving a peer's announcement
      await peerDiscovery.receive({
        type: "peer-announce",
        payload: {
          id: "remote-peer",
          multiaddrs: ["/ip4/127.0.0.1/tcp/4001"],
          lastSeen: Date.now(),
        },
      });
      expect(peerDiscovery.getKnownPeers()).toHaveLength(1);

      // Start heartbeat with stale peer detection
      heartbeat.start((stalePeerId) => {
        peerDiscovery.removePeer(stalePeerId);
        onPeerDown(stalePeerId);
      });

      // Wait for heartbeat to detect the peer as stale
      await new Promise((resolve) => setTimeout(resolve, 600));

      heartbeat.stop();

      // The peer should have been removed
      expect(peerDiscovery.getKnownPeers()).toHaveLength(0);
    });
  });

  describe("direct-messaging + peer-discovery", () => {
    it("should allow direct messaging between known peers", async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined);

      // Announce a peer
      await peerDiscovery.announce(sendMessage, "remote-peer", [
        "/ip4/127.0.0.1/tcp/4001",
      ]);

      // Send a direct message
      await directMessaging.send(sendMessage, {
        id: "msg-1",
        from: "local-peer",
        to: "remote-peer",
        content: "Hello!",
      });

      expect(sendMessage).toHaveBeenCalledWith("remote-peer", {
        type: "direct-message",
        payload: expect.objectContaining({
          id: "msg-1",
          from: "local-peer",
          to: "remote-peer",
          content: "Hello!",
        }),
      });

      // Message should be in history
      const history = directMessaging.getMessageHistory("remote-peer");
      expect(history).toHaveLength(1);
      expect(history[0].content).toBe("Hello!");
    });

    it("should handle incoming direct messages", async () => {
      const handler = vi.fn();
      directMessaging.setHandler(handler);

      await directMessaging.receive({
        type: "direct-message",
        payload: {
          id: "msg-2",
          from: "remote-peer",
          to: "local-peer",
          content: "Hi back!",
          timestamp: Date.now(),
        },
      });

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "msg-2",
          content: "Hi back!",
        }),
      );
    });
  });

  describe("all three protocols together", () => {
    it("should support a full peer interaction flow", async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined);
      const onPeerDown = vi.fn();

      // 1. Peer discovery: announce ourselves
      await peerDiscovery.announce(sendMessage, "local-peer", [
        "/ip4/127.0.0.1/tcp/4001",
      ]);

      // 2. Heartbeat: start sending heartbeats
      heartbeat.start((stalePeerId) => {
        peerDiscovery.removePeer(stalePeerId);
        onPeerDown(stalePeerId);
      });

      // 3. Simulate receiving a peer's heartbeat announcement
      await peerDiscovery.receive({
        type: "peer-announce",
        payload: {
          id: "remote-peer",
          multiaddrs: ["/ip4/127.0.0.1/tcp/4002"],
          lastSeen: Date.now(),
        },
      });
      expect(peerDiscovery.getKnownPeers()).toHaveLength(1);

      // 4. Send a direct message
      await directMessaging.send(sendMessage, {
        id: "msg-1",
        from: "local-peer",
        to: "remote-peer",
        content: "Hello from local!",
      });

      // 5. Simulate receiving a direct message
      const handler = vi.fn();
      directMessaging.setHandler(handler);
      await directMessaging.receive({
        type: "direct-message",
        payload: {
          id: "msg-2",
          from: "remote-peer",
          to: "local-peer",
          content: "Hello from remote!",
          timestamp: Date.now(),
        },
      });

      // Verify all interactions worked
      expect(peerDiscovery.getKnownPeers()).toHaveLength(1);
      // 1 sent + 1 received = 2 messages involving remote-peer
      expect(directMessaging.getMessageHistory("remote-peer")).toHaveLength(2);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          content: "Hello from remote!",
        }),
      );

      heartbeat.stop();
    });
  });
});
