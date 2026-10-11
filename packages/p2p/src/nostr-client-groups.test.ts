import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NostrClient } from "./nostr-client";

vi.mock("nostr-tools/pure", () => ({
  generateSecretKey: vi.fn().mockReturnValue(new Uint8Array(32)),
  getPublicKey: vi.fn().mockReturnValue("test-pubkey"),
  finalizeEvent: vi
    .fn()
    .mockImplementation((template: { kind: number; content: string; tags: string[][] }) => ({
      id: "event-id",
      pubkey: "test-pubkey",
      created_at: Math.floor(Date.now() / 1000),
      kind: template.kind,
      tags: template.tags,
      content: template.content,
      sig: "test-sig",
    })),
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

describe("NostrClient NIP-29 Groups", () => {
  let client: NostrClient;

  beforeEach(async () => {
    client = new NostrClient({
      relays: ["wss://relay.test"],
    });
    await client.initialize();
  });

  afterEach(async () => {
    if (client.isConnected) {
      await client.stop();
    }
  });

  describe("createGroup", () => {
    it("should create a public group", async () => {
      const event = await client.createGroup("test-group", {
        name: "Test Group",
        description: "A test group",
      });

      expect(event.kind).toBe(34550);
      expect(event.tags).toContainEqual(["d", "test-group"]);
      expect(event.tags).toContainEqual(["closed", "false"]);
    });

    it("should create a closed group", async () => {
      const event = await client.createGroup("test-group", { name: "Test Group" }, true);

      expect(event.kind).toBe(34550);
      expect(event.tags).toContainEqual(["closed", "true"]);
    });

    it("should throw if not initialized", async () => {
      const newClient = new NostrClient();
      await expect(newClient.createGroup("test-group", { name: "Test" })).rejects.toThrow(
        "Nostr client is not initialized",
      );
    });
  });

  describe("requestJoinGroup", () => {
    it("should request to join a group", async () => {
      const event = await client.requestJoinGroup("test-group", "Please let me in");

      expect(event.kind).toBe(34553);
      expect(event.tags).toContainEqual(["d", "test-group"]);
      expect(event.tags).toContainEqual(["reason", "Please let me in"]);
    });

    it("should request without reason", async () => {
      const event = await client.requestJoinGroup("test-group");

      expect(event.kind).toBe(34553);
      expect(event.tags).toContainEqual(["d", "test-group"]);
      expect(event.tags).not.toContainEqual(["reason", ""]);
    });
  });

  describe("approveJoinGroup", () => {
    it("should approve a join request", async () => {
      const event = await client.approveJoinGroup("test-group", "user-pubkey");

      expect(event.kind).toBe(34552);
      expect(event.tags).toContainEqual(["d", "test-group"]);
      expect(event.tags).toContainEqual(["p", "user-pubkey"]);
    });
  });

  describe("leaveGroup", () => {
    it("should leave a group", async () => {
      const event = await client.leaveGroup("test-group");

      expect(event.kind).toBe(34552);
      expect(event.tags).toContainEqual(["d", "test-group"]);
      expect(event.tags).toContainEqual(["p", "test-pubkey"]);
      expect(event.tags).toContainEqual(["remove", "true"]);
    });
  });

  describe("publishGroupMessage", () => {
    it("should publish a group message", async () => {
      const event = await client.publishGroupMessage("test-group", "Hello");

      expect(event.kind).toBe(34554);
      expect(event.tags).toContainEqual(["d", "test-group"]);
      expect(event.content).toBe("Hello");
    });

    it("should publish a reply", async () => {
      const event = await client.publishGroupMessage("test-group", "Reply", "original-event-id");

      expect(event.kind).toBe(34554);
      expect(event.tags).toContainEqual(["d", "test-group"]);
      expect(event.tags).toContainEqual(["e", "original-event-id"]);
    });
  });

  describe("fetchGroupMetadata", () => {
    it("should return null for non-existent group", async () => {
      const metadata = await client.fetchGroupMetadata("non-existent");
      expect(metadata).toBeNull();
    });
  });

  describe("fetchGroupMembers", () => {
    it("should return empty array for non-existent group", async () => {
      const members = await client.fetchGroupMembers("non-existent");
      expect(members).toEqual([]);
    });
  });

  describe("fetchGroupJoinRequests", () => {
    it("should return empty array for non-existent group", async () => {
      const requests = await client.fetchGroupJoinRequests("non-existent");
      expect(requests).toEqual([]);
    });
  });
});
