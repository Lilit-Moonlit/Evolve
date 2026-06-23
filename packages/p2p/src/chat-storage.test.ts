import { describe, it, expect, beforeEach } from "vitest";
import { ChatStorage } from "./chat-storage";
import { ChatMessageStatus } from "./types";
import type { ExtendedMessage } from "./types";

function createMessage(
  overrides: Partial<ExtendedMessage> = {},
): ExtendedMessage {
  return {
    id: "msg-1",
    from: "alice",
    to: "bob",
    content: "Hello!",
    timestamp: Date.now(),
    encrypted: false,
    read: false,
    status: ChatMessageStatus.Sent,
    ...overrides,
  };
}

describe("ChatStorage", () => {
  let storage: ChatStorage;

  beforeEach(() => {
    storage = new ChatStorage();
  });

  it("should save and load a chat", async () => {
    const chat = {
      id: "chat-1",
      participants: ["alice", "bob"],
      messages: [createMessage()],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await storage.saveChat(chat);
    const loaded = await storage.loadChat("chat-1");

    expect(loaded).not.toBeNull();
    expect(loaded!.id).toBe("chat-1");
    expect(loaded!.participants).toEqual(["alice", "bob"]);
    expect(loaded!.messages).toHaveLength(1);
  });

  it("should return null for non-existent chat", async () => {
    const loaded = await storage.loadChat("non-existent");
    expect(loaded).toBeNull();
  });

  it("should delete a chat", async () => {
    const chat = {
      id: "chat-to-delete",
      participants: ["alice", "bob"],
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await storage.saveChat(chat);
    await storage.deleteChat("chat-to-delete");
    const loaded = await storage.loadChat("chat-to-delete");
    expect(loaded).toBeNull();
  });

  it("should load all chats", async () => {
    const chat1 = {
      id: "chat-1",
      participants: ["alice", "bob"],
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const chat2 = {
      id: "chat-2",
      participants: ["alice", "charlie"],
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await storage.saveChat(chat1);
    await storage.saveChat(chat2);

    const allChats = await storage.loadAllChats();
    expect(allChats).toHaveLength(2);
  });

  it("should save a message to a chat", async () => {
    const chat = {
      id: "chat-1",
      participants: ["alice", "bob"],
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await storage.saveChat(chat);
    const message = createMessage({ id: "msg-new" });
    await storage.saveMessage("chat-1", message);

    const loaded = await storage.loadChat("chat-1");
    expect(loaded!.messages).toHaveLength(1);
    expect(loaded!.messages[0].id).toBe("msg-new");
  });

  it("should update message status", async () => {
    const chat = {
      id: "chat-1",
      participants: ["alice", "bob"],
      messages: [createMessage({ id: "msg-1" })],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await storage.saveChat(chat);
    await storage.updateMessageStatus("msg-1", ChatMessageStatus.Read);

    const loaded = await storage.loadChat("chat-1");
    expect(loaded!.messages[0].status).toBe(ChatMessageStatus.Read);
  });

  it("should use adapter when set", async () => {
    const adapter = {
      save: async () => "cid-123",
      load: async () => ({
        id: "chat-from-adapter",
        participants: ["alice", "bob"],
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
    };

    storage.setAdapter(adapter);
    const chat = {
      id: "chat-adapter",
      participants: ["alice", "bob"],
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await storage.saveChat(chat);
    const loaded = await storage.loadChat("chat-from-adapter");
    expect(loaded!.id).toBe("chat-from-adapter");
  });
});
