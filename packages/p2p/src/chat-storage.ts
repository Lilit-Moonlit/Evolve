import type { Chat } from "@evolve/core";
import type { ExtendedMessage } from "./types";
import type { ILogger } from "./types";

export interface ChatStorageConfig {
  ipfsUrl?: string;
  encryptionEnabled?: boolean;
}

export interface StoredChat {
  id: string;
  participants: string[];
  messages: ExtendedMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface StorageAdapter {
  save(key: string, data: object): Promise<string>;
  load(key: string): Promise<object | null>;
}

export class ChatStorage {
  private chats: Map<string, StoredChat> = new Map();
  private logger: ILogger;
  private adapter: StorageAdapter | null = null;

  constructor(
    private config: ChatStorageConfig = {},
    logger?: ILogger,
  ) {
    this.logger = logger ?? consoleLogger;
  }

  setAdapter(adapter: StorageAdapter): void {
    this.adapter = adapter;
  }

  async initialize(): Promise<void> {
    this.logger.info("ChatStorage initialized (in-memory)");
  }

  async saveChat(chat: Chat): Promise<void> {
    const stored: StoredChat = {
      id: chat.id,
      participants: chat.participants,
      messages: chat.messages as ExtendedMessage[],
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };

    this.chats.set(chat.id, stored);

    if (this.adapter !== null) {
      try {
        const key = `chat/${chat.id}`;
        await this.adapter.save(key, stored);
        this.logger.debug(`Chat ${chat.id} saved via adapter`);
      } catch {
        this.logger.warn(`Failed to save chat ${chat.id} via adapter`);
      }
    }
  }

  async loadChat(chatId: string): Promise<StoredChat | null> {
    const local = this.chats.get(chatId);
    if (local !== undefined) return local;

    if (this.adapter !== null) {
      try {
        const key = `chat/${chatId}`;
        const data = await this.adapter.load(key);
        if (data !== null) {
          const parsed = data as StoredChat;
          this.chats.set(chatId, parsed);
          return parsed;
        }
      } catch {
        this.logger.warn(`Failed to load chat ${chatId} via adapter`);
      }
    }

    return null;
  }

  async loadAllChats(): Promise<StoredChat[]> {
    return Array.from(this.chats.values());
  }

  async deleteChat(chatId: string): Promise<void> {
    this.chats.delete(chatId);
  }

  async saveMessage(chatId: string, message: ExtendedMessage): Promise<void> {
    const chat = this.chats.get(chatId);
    if (chat === undefined) return;

    chat.messages.push(message);
    chat.updatedAt = message.timestamp;
    await this.saveChat(chat);
  }

  async updateMessageStatus(
    messageId: string,
    status: import("./types").ChatMessageStatus,
  ): Promise<void> {
    for (const chat of this.chats.values()) {
      const message = chat.messages.find((m) => m.id === messageId);
      if (message !== undefined) {
        message.status = status;
        await this.saveChat(chat);
        break;
      }
    }
  }
}

const consoleLogger: ILogger = {
  info: (message, ...args) => console.log(`[ChatStorage] ${message}`, ...args),
  warn: (message, ...args) => console.warn(`[ChatStorage] ${message}`, ...args),
  error: (message, ...args) =>
    console.error(`[ChatStorage] ${message}`, ...args),
  debug: (message, ...args) =>
    console.debug(`[ChatStorage] ${message}`, ...args),
};
