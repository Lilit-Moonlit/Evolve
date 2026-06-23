import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NostrClient } from "./nostr-client";

vi.mock("nostr-tools/pure", () => ({
  generateSecretKey: vi.fn().mockReturnValue(new Uint8Array(32)),
  getPublicKey: vi.fn().mockReturnValue("test-pubkey"),
  finalizeEvent: vi
    .fn()
    .mockImplementation(
      (template: { kind: number; content: string; tags: string[][] }) => ({
        id: "event-id",
        pubkey: "test-pubkey",
        created_at: Math.floor(Date.now() / 1000),
        kind: template.kind,
        tags: template.tags,
        content: template.content,
        sig: "test-sig",
      }),
    ),
}));

vi.mock("nostr-tools", () => ({
  Relay: {
    connect: vi.fn().mockResolvedValue({
      publish: vi.fn().mockResolvedValue(undefined),
      subscribe: vi.fn().mockReturnValue({ close: vi.fn() }),
      close: vi.fn(),
    }),
  },
  SimplePool: class MockSimplePool {
    querySync = vi.fn().mockResolvedValue([]);
    destroy = vi.fn();
  },
}));

vi.mock("nostr-tools/nip04", () => ({
  encrypt: vi.fn().mockResolvedValue("encrypted-content"),
  decrypt: vi.fn().mockResolvedValue("decrypted-content"),
}));

describe("NostrClient", () => {
  let client: NostrClient;

  beforeEach(() => {
    client = new NostrClient({
      relays: ["wss://relay.test"],
      reconnect: {
        maxRetries: 3,
        baseDelayMs: 100,
        maxDelayMs: 500,
      },
    });
  });

  afterEach(async () => {
    if (client.isConnected) {
      await client.stop();
    }
  });

  describe("initialize", () => {
    it("should initialize with new keys", async () => {
      await client.initialize();
      expect(client.isConnected).toBe(true);
      expect(client.publicKey).toBe("test-pubkey");
    });

    it("should initialize with provided keys", async () => {
      const secretKey = new Uint8Array(32);
      await client.initialize(secretKey);
      expect(client.isConnected).toBe(true);
    });

    it("should not reinitialize if already connected", async () => {
      await client.initialize();
      await client.initialize();
      expect(client.isConnected).toBe(true);
    });
  });

  describe("stop", () => {
    it("should stop the client", async () => {
      await client.initialize();
      await client.stop();
      expect(client.isConnected).toBe(false);
    });

    it("should not fail if already stopped", async () => {
      await client.stop();
      expect(client.isConnected).toBe(false);
    });
  });

  describe("getPublicKeyString", () => {
    it("should return public key", async () => {
      await client.initialize();
      expect(client.getPublicKeyString()).toBe("test-pubkey");
    });

    it("should throw if not initialized", () => {
      expect(() => client.getPublicKeyString()).toThrow(
        "Nostr client is not initialized",
      );
    });
  });

  describe("publishEvent", () => {
    it("should publish an event", async () => {
      await client.initialize();
      const event = await client.publishEvent(1, "Hello");
      expect(event).toHaveProperty("id");
      expect(event).toHaveProperty("pubkey");
    });

    it("should throw if not initialized", async () => {
      await expect(client.publishEvent(1, "Hello")).rejects.toThrow(
        "Nostr client is not initialized",
      );
    });
  });

  describe("publishProfile", () => {
    it("should publish profile event", async () => {
      await client.initialize();
      const event = await client.publishProfile({ name: "Test" });
      expect(event.kind).toBe(0);
    });
  });

  describe("publishTextNote", () => {
    it("should publish text note", async () => {
      await client.initialize();
      const event = await client.publishTextNote("Hello");
      expect(event.kind).toBe(1);
    });

    it("should publish reply with e tag", async () => {
      await client.initialize();
      const event = await client.publishTextNote("Reply", "original-id");
      expect(event.tags).toContainEqual(["e", "original-id"]);
    });
  });

  describe("publishDirectMessage", () => {
    it("should publish encrypted DM", async () => {
      await client.initialize();
      const event = await client.publishDirectMessage(
        "Secret",
        "recipient-pubkey",
      );
      expect(event.kind).toBe(4);
    });
  });

  describe("decryptDirectMessage", () => {
    it("should decrypt a DM", async () => {
      await client.initialize();
      const result = await client.decryptDirectMessage(
        "encrypted",
        "sender-pubkey",
      );
      expect(result).toBe("decrypted-content");
    });
  });

  describe("fetchProfile", () => {
    it("should return null for no profile", async () => {
      await client.initialize();
      const profile = await client.fetchProfile("some-pubkey");
      expect(profile).toBeNull();
    });
  });

  describe("connection state", () => {
    it("should start disconnected", () => {
      expect(client.isConnected).toBe(false);
    });
  });
});
