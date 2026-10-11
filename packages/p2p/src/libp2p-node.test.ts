import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { ConnectionState } from "./types";

vi.mock("libp2p", () => ({
  createLibp2p: vi.fn().mockResolvedValue({
    peerId: { toString: () => "test-peer-id" },
    getMultiaddrs: () => [{ toString: () => "/ip4/127.0.0.1/tcp/4001" }],
    getPeers: () => [],
    start: vi.fn(),
    stop: vi.fn(),
    dial: vi.fn(),
    hangUp: vi.fn(),
    services: {
      pubsub: {
        subscribe: vi.fn(),
        unsubscribe: vi.fn(),
        publish: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
      ping: {
        ping: vi.fn().mockResolvedValue(undefined),
      },
    },
  }),
}));

vi.mock("@libp2p/websockets", () => ({
  webSockets: vi.fn(),
}));

vi.mock("@libp2p/noise", () => ({
  noise: vi.fn(),
}));

vi.mock("@libp2p/yamux", () => ({
  yamux: vi.fn(),
}));

vi.mock("@libp2p/gossipsub", () => ({
  gossipsub: vi.fn(),
}));

vi.mock("@libp2p/bootstrap", () => ({
  bootstrap: vi.fn(),
}));

vi.mock("@libp2p/identify", () => ({
  identify: vi.fn(),
}));

vi.mock("@libp2p/ping", () => ({
  ping: vi.fn(),
}));

vi.mock("@libp2p/peer-id", () => ({
  peerIdFromString: vi.fn().mockReturnValue({ toString: () => "test-peer-id" }),
}));

import { createLibp2p } from "libp2p";
import { Libp2pNode } from "./libp2p-node";

type MockPubsub = {
  subscribe: Mock;
  unsubscribe: Mock;
  publish: Mock;
  addEventListener: Mock;
  removeEventListener: Mock;
};

type MockNode = {
  peerId: { toString(): string };
  getMultiaddrs: () => { toString(): string }[];
  getPeers: () => unknown[];
  start: Mock;
  stop: Mock;
  dial: Mock;
  hangUp: Mock;
  services: {
    pubsub: MockPubsub;
    ping: { ping: Mock };
  };
};

/**
 * The mocked `createLibp2p` resolves with a single shared fake node instance,
 * so calling it again in a test returns the exact object `Libp2pNode` holds.
 */
async function getMockNode(): Promise<MockNode> {
  return (await createLibp2p()) as unknown as MockNode;
}

describe("Libp2pNode", () => {
  let node: Libp2pNode;

  beforeEach(() => {
    vi.clearAllMocks();
    node = new Libp2pNode({
      reconnect: {
        maxRetries: 3,
        baseDelayMs: 100,
        maxDelayMs: 500,
      },
    });
  });

  afterEach(async () => {
    if (node.connectionState !== ConnectionState.Disconnected) {
      await node.stop();
    }
  });

  describe("initialize", () => {
    it("should initialize and start the node", async () => {
      await node.initialize();
      expect(node.connectionState).toBe(ConnectionState.Connected);
    });

    it("should not reinitialize if already connected", async () => {
      await node.initialize();
      await node.initialize();
      expect(node.connectionState).toBe(ConnectionState.Connected);
    });

    it("should build a dial-only libp2p@3 config (WebSockets + noise + yamux)", async () => {
      await node.initialize();
      const options = vi.mocked(createLibp2p).mock.calls[0]?.[0];

      expect(options?.start).toBe(false);
      expect(options?.addresses?.listen).toEqual([]);
      expect(options?.addresses?.announce).toBeUndefined();
      expect(options?.transports).toHaveLength(1);
      expect(options?.connectionEncrypters).toHaveLength(1);
      expect(options?.streamMuxers).toHaveLength(1);
      expect(options?.peerDiscovery).toBeUndefined();
      expect(Object.keys(options?.services ?? {}).sort()).toEqual(["identify", "ping", "pubsub"]);

      const mockNode = await getMockNode();
      expect(mockNode.start).toHaveBeenCalledTimes(1);
    });

    it("should pass bootstrap peers and announce addresses when configured", async () => {
      const bootstrapped = new Libp2pNode({
        bootstrapPeers: ["/ip4/10.0.0.1/tcp/4001/ws/p2p/12D3Foo"],
        listenAddresses: ["/ip4/127.0.0.1/tcp/4002/ws"],
        announceAddresses: ["/dns4/relay.example.com/tcp/443/wss/p2p/12D3Bar"],
      });
      await bootstrapped.initialize();

      const options = vi.mocked(createLibp2p).mock.calls.at(-1)?.[0];
      expect(options?.addresses?.listen).toEqual(["/ip4/127.0.0.1/tcp/4002/ws"]);
      expect(options?.addresses?.announce).toEqual([
        "/dns4/relay.example.com/tcp/443/wss/p2p/12D3Bar",
      ]);
      expect(options?.peerDiscovery).toHaveLength(1);
    });
  });

  describe("stop", () => {
    it("should stop the node", async () => {
      await node.initialize();
      await node.stop();
      expect(node.connectionState).toBe(ConnectionState.Disconnected);
    });

    it("should not fail if already stopped", async () => {
      await node.stop();
      expect(node.connectionState).toBe(ConnectionState.Disconnected);
    });
  });

  describe("getPeerId", () => {
    it("should return peer ID", async () => {
      await node.initialize();
      expect(node.getPeerId()).toBe("test-peer-id");
    });

    it("should throw if not initialized", () => {
      expect(() => node.getPeerId()).toThrow("Libp2p node is not initialized");
    });
  });

  describe("getMultiaddrs", () => {
    it("should return multiaddrs", async () => {
      await node.initialize();
      const addrs = node.getMultiaddrs();
      expect(addrs).toEqual(["/ip4/127.0.0.1/tcp/4001"]);
    });

    it("should throw if not initialized", () => {
      expect(() => node.getMultiaddrs()).toThrow("Libp2p node is not initialized");
    });
  });

  describe("getPeers", () => {
    it("should return empty array when no peers", async () => {
      await node.initialize();
      const peers = node.getPeers();
      expect(peers).toEqual([]);
    });
  });

  describe("withRetry", () => {
    it("should retry on failure", async () => {
      await node.initialize();
      let attempts = 0;
      const fn = vi.fn().mockImplementation(async () => {
        attempts++;
        if (attempts < 3) throw new Error("Temporary failure");
        return "success";
      });

      const result = await node.withRetry(fn, 3, 10);
      expect(result).toBe("success");
      expect(attempts).toBe(3);
    });

    it("should throw after max retries", async () => {
      await node.initialize();
      const fn = vi.fn().mockRejectedValue(new Error("Persistent failure"));

      await expect(node.withRetry(fn, 2, 10)).rejects.toThrow("Persistent failure");
    });
  });

  describe("connection state", () => {
    it("should start in disconnected state", () => {
      expect(node.connectionState).toBe(ConnectionState.Disconnected);
    });

    it("should transition to connected after initialize", async () => {
      await node.initialize();
      expect(node.connectionState).toBe(ConnectionState.Connected);
    });
  });

  describe("subscribe", () => {
    it("should attach one typed 'message' listener and dispatch to every handler of the topic", async () => {
      await node.initialize();
      const mockNode = await getMockNode();

      const handlerA = vi.fn();
      const handlerB = vi.fn();
      const handlerOtherTopic = vi.fn();

      await node.subscribe("chat:a", handlerA);
      await node.subscribe("chat:a", handlerB);
      await node.subscribe("chat:b", handlerOtherTopic);

      // one pubsub.subscribe per distinct topic, not per handler
      expect(mockNode.services.pubsub.subscribe).toHaveBeenCalledTimes(2);
      expect(mockNode.services.pubsub.subscribe).toHaveBeenCalledWith("chat:a");
      expect(mockNode.services.pubsub.subscribe).toHaveBeenCalledWith("chat:b");

      // a single global listener on the NEW gossipsub event name
      expect(mockNode.services.pubsub.addEventListener).toHaveBeenCalledTimes(1);
      expect(mockNode.services.pubsub.addEventListener).toHaveBeenCalledWith(
        "message",
        expect.any(Function),
      );

      const listener = mockNode.services.pubsub.addEventListener.mock.calls[0]?.[1] as (event: {
        detail: { topic: string; data: Uint8Array };
      }) => void;

      const payloadA = new Uint8Array([1, 2, 3]);
      const payloadB = new Uint8Array([4, 5, 6]);

      listener({ detail: { topic: "chat:a", data: payloadA } });
      listener({ detail: { topic: "chat:b", data: payloadB } });
      listener({ detail: { topic: "chat:unknown", data: payloadB } });

      expect(handlerA).toHaveBeenCalledTimes(1);
      expect(handlerA).toHaveBeenCalledWith(payloadA);
      expect(handlerB).toHaveBeenCalledTimes(1);
      expect(handlerB).toHaveBeenCalledWith(payloadA);
      expect(handlerOtherTopic).toHaveBeenCalledTimes(1);
      expect(handlerOtherTopic).toHaveBeenCalledWith(payloadB);
    });
  });

  describe("publish", () => {
    it("should publish JSON-encoded payloads via gossipsub", async () => {
      await node.initialize();
      await node.publish("chat:a", { hello: "world" });

      const mockNode = await getMockNode();
      expect(mockNode.services.pubsub.publish).toHaveBeenCalledWith(
        "chat:a",
        new TextEncoder().encode(JSON.stringify({ hello: "world" })),
      );
    });
  });

  describe("ping", () => {
    it("should measure round-trip time via the ping service", async () => {
      await node.initialize();
      const rtt = await node.ping("test-peer-id", 1000);

      expect(typeof rtt).toBe("number");
      expect(rtt).toBeGreaterThanOrEqual(0);

      const mockNode = await getMockNode();
      expect(mockNode.services.ping.ping).toHaveBeenCalledTimes(1);
    });
  });
});
