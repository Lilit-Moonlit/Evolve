import { describe, it, expect, vi, beforeEach } from "vitest";
import { ChatManager } from "./chat-manager";
import { ChatMessageStatus } from "./types";

vi.mock("./libp2p-node", () => ({
  Libp2pNode: class MockLibp2pNode {
    connectionState = "connected";
    initialize = vi.fn().mockResolvedValue(undefined);
    stop = vi.fn().mockResolvedValue(undefined);
    subscribe = vi.fn().mockResolvedValue(undefined);
    publish = vi.fn().mockResolvedValue(undefined);
    getMultiaddrs = vi.fn().mockReturnValue(["/ip4/127.0.0.1/tcp/4001"]);
    getPeerId = vi.fn().mockReturnValue("mock-peer-id");
  },
}));

vi.mock("./nostr-client", () => ({
  NostrClient: class MockNostrClient {
    isConnected = true;
    publicKey = "mock-pubkey";
    initialize = vi.fn().mockResolvedValue(undefined);
    stop = vi.fn().mockResolvedValue(undefined);
    subscribeToEvents = vi.fn().mockResolvedValue(vi.fn());
    publishDirectMessage = vi.fn().mockResolvedValue({ id: "event-id" });
    publishEvent = vi.fn().mockResolvedValue({ id: "event-id", kind: 1 });
    decryptDirectMessage = vi.fn().mockResolvedValue("decrypted");
    getPublicKeyString = vi.fn().mockReturnValue("mock-pubkey");
  },
}));

describe("ChatManager", () => {
  let manager: ChatManager;

  beforeEach(() => {
    manager = new ChatManager({
      useLibp2p: false,
      useNostr: false,
    });
  });

  describe("initialize", () => {
    it("should initialize without libp2p and nostr", async () => {
      await manager.initialize();
      expect(manager.isInitialized).toBe(true);
    });

    it("should not reinitialize", async () => {
      await manager.initialize();
      await manager.initialize();
      expect(manager.isInitialized).toBe(true);
    });

    it("should initialize with libp2p and wire protocols", async () => {
      const mgr = new ChatManager({
        useLibp2p: true,
        useNostr: false,
        heartbeat: { enabled: true, interval: 100, timeout: 300 },
      });
      await mgr.initialize();
      expect(mgr.isInitialized).toBe(true);

      const statuses = mgr.getAllPeerStatuses();
      expect(Array.isArray(statuses)).toBe(true);

      await mgr.stop();
    });
  });

  describe("stop", () => {
    it("should stop the manager", async () => {
      await manager.initialize();
      await manager.stop();
      expect(manager.isInitialized).toBe(false);
    });

    it("should not fail if not initialized", async () => {
      await manager.stop();
      expect(manager.isInitialized).toBe(false);
    });
  });

  describe("sendMessage", () => {
    it("should send a message", async () => {
      const managerWithTransport = new ChatManager({
        useLibp2p: true,
        useNostr: false,
      });
      await managerWithTransport.initialize();
      const message = await managerWithTransport.sendMessage(
        "user1",
        "user2",
        "Hello",
      );
      expect(message.content).toBe("Hello");
      expect(message.from).toBe("user1");
      expect(message.to).toBe("user2");
      expect(message.status).toBe(ChatMessageStatus.Sent);
    });

    it("should throw if not initialized", async () => {
      await expect(
        manager.sendMessage("user1", "user2", "Hello"),
      ).rejects.toThrow("ChatManager is not initialized");
    });
  });

  describe("getChat", () => {
    it("should return null for non-existent chat", async () => {
      await manager.initialize();
      const chat = manager.getChat("user1", "user2");
      expect(chat).toBeNull();
    });

    it("should return chat after sending message", async () => {
      await manager.initialize();
      await manager.sendMessage("user1", "user2", "Hello");
      const chat = manager.getChat("user1", "user2");
      expect(chat).not.toBeNull();
      expect(chat?.participants).toContain("user1");
      expect(chat?.participants).toContain("user2");
    });
  });

  describe("getAllChats", () => {
    it("should return empty array initially", async () => {
      await manager.initialize();
      expect(manager.getAllChats()).toEqual([]);
    });

    it("should return all chats", async () => {
      await manager.initialize();
      await manager.sendMessage("user1", "user2", "Hello");
      await manager.sendMessage("user1", "user3", "Hi");
      expect(manager.getAllChats()).toHaveLength(2);
    });
  });

  describe("getChatsForUser", () => {
    it("should return chats for specific user", async () => {
      await manager.initialize();
      await manager.sendMessage("user1", "user2", "Hello");
      await manager.sendMessage("user1", "user3", "Hi");
      await manager.sendMessage("user2", "user3", "Hey");

      const user1Chats = manager.getChatsForUser("user1");
      expect(user1Chats).toHaveLength(2);

      const user2Chats = manager.getChatsForUser("user2");
      expect(user2Chats).toHaveLength(2);
    });
  });

  describe("markMessageAsRead", () => {
    it("should mark message as read", async () => {
      await manager.initialize();
      const message = await manager.sendMessage("user1", "user2", "Hello");
      manager.markMessageAsRead(message.id);

      const chat = manager.getChat("user1", "user2");
      const msg = chat?.messages.find((m) => m.id === message.id);
      expect(msg?.read).toBe(true);
    });
  });

  describe("deleteChat", () => {
    it("should delete chat", async () => {
      await manager.initialize();
      await manager.sendMessage("user1", "user2", "Hello");
      await manager.deleteChat("user1", "user2");
      expect(manager.getChat("user1", "user2")).toBeNull();
    });
  });

  describe("deleteMessage", () => {
    it("should delete message", async () => {
      await manager.initialize();
      const message = await manager.sendMessage("user1", "user2", "Hello");
      await manager.deleteMessage(message.id);

      const chat = manager.getChat("user1", "user2");
      expect(chat?.messages).toHaveLength(0);
    });
  });

  describe("onMessage", () => {
    it("should register message callback", async () => {
      await manager.initialize();
      const callback = vi.fn();
      manager.onMessage("user1", "user2", callback);

      const chatId = ["user1", "user2"].sort().join("-");
      expect(manager.getChat("user1", "user2")).toBeNull();
    });
  });

  describe("protocols", () => {
    it("should return empty known peers when libp2p disabled", async () => {
      await manager.initialize();
      expect(manager.getKnownPeers()).toEqual([]);
    });

    it("should return empty peer statuses when heartbeat disabled", async () => {
      await manager.initialize();
      expect(manager.getAllPeerStatuses()).toEqual([]);
    });

    it("should return undefined for unknown peer status", async () => {
      await manager.initialize();
      expect(manager.getPeerStatus("unknown")).toBeUndefined();
    });

    it("should return empty direct message history", async () => {
      await manager.initialize();
      expect(manager.getDirectMessageHistory("peer1")).toEqual([]);
    });

    it("should register and unregister peer down callback", async () => {
      await manager.initialize();
      const callback = vi.fn();
      manager.onPeerDown(callback);
      manager.offPeerDown(callback);
    });
  });

  describe("getQueueSize", () => {
    it("should return 0 initially", async () => {
      await manager.initialize();
      expect(manager.getQueueSize()).toBe(0);
    });
  });

  describe("sendMedia", () => {
    it("should send a media message via libp2p", async () => {
      const managerWithLibp2p = new ChatManager({
        useLibp2p: true,
        useNostr: false,
        libp2pConfig: { listenAddresses: [] },
      });
      await managerWithLibp2p.initialize();

      const msg = await managerWithLibp2p.sendMedia(
        "alice",
        "bob",
        "QmCid",
        "image/png",
        "photo.png",
        1024,
      );

      expect(msg.id).toBeDefined();
      expect(msg.from).toBe("alice");
      expect(msg.to).toBe("bob");
      expect(msg.cid).toBe("QmCid");
      expect(msg.mimeType).toBe("image/png");
      expect(msg.fileName).toBe("photo.png");
      expect(msg.size).toBe(1024);
      expect(msg.expiresAt).toBeGreaterThan(Date.now());
      await managerWithLibp2p.stop();
    });

    it("should throw if not initialized", async () => {
      await expect(
        manager.sendMedia(
          "alice",
          "bob",
          "QmCid",
          "image/png",
          "photo.png",
          1024,
        ),
      ).rejects.toThrow();
    });
  });

  describe("onMedia / offMedia", () => {
    it("should register and unregister without error", () => {
      const cb = vi.fn();
      manager.onMedia("alice", "bob", cb);
      manager.offMedia("alice", "bob");
    });
  });

  describe("call management", () => {
    it("should throw NotInitializedError if libp2p is not available", async () => {
      await manager.initialize();
      await expect(manager.offerCall("bob")).rejects.toThrow(/requires libp2p/);
    });

    it("should create a call offer", async () => {
      const managerWithLibp2p = new ChatManager({
        useLibp2p: true,
        useNostr: false,
        libp2pConfig: { listenAddresses: [] },
      });
      await managerWithLibp2p.initialize();

      const callId = await managerWithLibp2p.offerCall("bob");
      expect(callId).toBeDefined();
      expect(managerWithLibp2p.getCallState(callId)).toBeDefined();
      await managerWithLibp2p.stop();
    });

    it("should register call event callbacks", () => {
      const offerCb = vi.fn();
      const acceptCb = vi.fn();
      const hangupCb = vi.fn();

      manager.onCallOffer(offerCb);
      manager.onCallAccept(acceptCb);
      manager.onCallHangup(hangupCb);
    });
  });
});
