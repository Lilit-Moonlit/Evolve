import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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

vi.mock("@libp2p/webtransport", () => ({
  webTransport: vi.fn(),
}));

vi.mock("@libp2p/mplex", () => ({
  mplex: vi.fn(),
}));

vi.mock("@libp2p/noise", () => ({
  noise: vi.fn(),
}));

vi.mock("@chainsafe/libp2p-gossipsub", () => ({
  gossipsub: vi.fn(),
}));

vi.mock("@libp2p/bootstrap", () => ({
  bootstrap: vi.fn(),
}));

vi.mock("@libp2p/kad-dht", () => ({
  kadDHT: vi.fn(),
}));

vi.mock("@libp2p/identify", () => ({
  identify: vi.fn(),
}));

vi.mock("@libp2p/ping", () => ({
  ping: vi.fn(),
}));

vi.mock("@libp2p/upnp-nat", () => ({
  uPnPNAT: vi.fn(),
}));

vi.mock("@libp2p/peer-id", () => ({
  peerIdFromString: vi.fn().mockReturnValue({ toString: () => "test-peer-id" }),
}));

import { Libp2pNode } from "./libp2p-node";

describe("Libp2pNode", () => {
  let node: Libp2pNode;

  beforeEach(() => {
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
      expect(() => node.getMultiaddrs()).toThrow(
        "Libp2p node is not initialized",
      );
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

      await expect(node.withRetry(fn, 2, 10)).rejects.toThrow(
        "Persistent failure",
      );
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
});
