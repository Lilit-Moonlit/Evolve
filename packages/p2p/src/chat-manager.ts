import type { Chat, P2PMessage } from "@evolve/core";
import { generateId } from "@evolve/core";
import type { Libp2pConfig } from "./libp2p-node";
import { Libp2pNode } from "./libp2p-node";
import type { NostrConfig } from "./nostr-client";
import { NostrClient } from "./nostr-client";
import { ChatStorage, type ChatStorageConfig } from "./chat-storage";
import {
  DirectMessagingProtocol,
  type DirectMessage,
} from "./protocols/direct-messaging";
import {
  PeerDiscoveryProtocol,
  type DiscoveredPeer,
} from "./protocols/peer-discovery";
import { HeartbeatProtocol, type PeerStatus } from "./protocols/heartbeat";
import { CallManager } from "./protocols/call-manager";
import type {
  ILogger,
  ExtendedMessage,
  MessageHandler,
  MediaMessage,
  CallSignal,
} from "./types";
import { ChatMessageStatus, ConnectionState, CallState } from "./types";
import { InitializationError, NotInitializedError } from "./errors";

export interface ChatManagerConfig {
  useLibp2p?: boolean;
  useNostr?: boolean;
  libp2pConfig?: Libp2pConfig;
  nostrConfig?: NostrConfig;
  storage?: ChatStorageConfig;
  heartbeat?: {
    enabled?: boolean;
    interval?: number;
    timeout?: number;
  };
  peerDiscovery?: {
    enabled?: boolean;
    peerTimeout?: number;
  };
}

export class ChatManager {
  private libp2pNode: Libp2pNode | null = null;
  private nostrClient: NostrClient | null = null;
  private storage: ChatStorage | null = null;
  private directMessaging: DirectMessagingProtocol | null = null;
  private peerDiscovery: PeerDiscoveryProtocol | null = null;
  private heartbeat: HeartbeatProtocol | null = null;
  private chats: Map<string, Chat> = new Map();
  private messageCallbacks: Map<string, MessageHandler> = new Map();
  private typingCallbacks: Map<string, (user: string) => void> = new Map();
  private mediaCallbacks: Map<string, (msg: MediaMessage) => void> = new Map();
  private callManager: CallManager | null = null;
  private peerDownCallbacks: ((peerId: string) => void)[] = [];
  private messageQueue: ExtendedMessage[] = [];
  private readonly MAX_QUEUE_SIZE = 1000;
  private initialized: boolean = false;
  private logger: ILogger;

  constructor(
    private config: ChatManagerConfig = {},
    logger?: ILogger,
  ) {
    this.logger = logger ?? consoleLogger;
  }

  get isInitialized(): boolean {
    return this.initialized;
  }

  private libp2pSendAdapter = async (
    topic: string,
    data: unknown,
  ): Promise<void> => {
    if (this.libp2pNode === null) {
      throw new NotInitializedError("Libp2p node");
    }
    await this.libp2pNode.publish(topic, data);
  };

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      if (this.config.storage !== undefined) {
        this.storage = new ChatStorage(this.config.storage, this.logger);
        await this.storage.initialize();

        const storedChats = await this.storage.loadAllChats();
        for (const stored of storedChats) {
          this.chats.set(stored.id, {
            id: stored.id,
            participants: stored.participants,
            messages: stored.messages,
            createdAt: stored.createdAt,
            updatedAt: stored.updatedAt,
          });
        }
        this.logger.info(`Loaded ${storedChats.length} chats from storage`);
      }

      if (this.config.useLibp2p !== false) {
        this.libp2pNode = new Libp2pNode(this.config.libp2pConfig, this.logger);
        await this.libp2pNode.initialize();

        await this.libp2pNode.subscribe("evolve-chat", (data: Uint8Array) => {
          try {
            const messageStr = new TextDecoder().decode(data);
            const p2pMessage = JSON.parse(messageStr) as P2PMessage;
            this.handleIncomingP2pMessage(p2pMessage);
          } catch (error) {
            const msg =
              error instanceof Error ? error.message : "Unknown error";
            this.logger.error(`Failed to handle evolve-chat message: ${msg}`);
          }
        });

        this.directMessaging = new DirectMessagingProtocol(this.logger);
        this.directMessaging.setHandler((msg) => this.handleDirectMessage(msg));

        await this.libp2pNode.subscribe(
          "direct-message",
          async (data: Uint8Array) => {
            try {
              const parsed = JSON.parse(new TextDecoder().decode(data));
              await this.directMessaging!.receive(parsed);
            } catch (error) {
              const msg =
                error instanceof Error ? error.message : "Unknown error";
              this.logger.error(`Failed to handle direct-message: ${msg}`);
            }
          },
        );

        this.peerDiscovery = new PeerDiscoveryProtocol(
          { peerTimeout: this.config.peerDiscovery?.peerTimeout },
          this.logger,
        );

        await this.libp2pNode.subscribe(
          "peer-discovery",
          async (data: Uint8Array) => {
            try {
              const parsed = JSON.parse(new TextDecoder().decode(data));
              await this.peerDiscovery!.receive(parsed);
            } catch (error) {
              const msg =
                error instanceof Error ? error.message : "Unknown error";
              this.logger.error(
                `Failed to handle peer-discovery message: ${msg}`,
              );
            }
          },
        );

        const peerId = this.libp2pNode.getPeerId();
        const multiaddrs = this.libp2pNode.getMultiaddrs();
        await this.peerDiscovery.announce(
          this.libp2pSendAdapter,
          peerId,
          multiaddrs,
        );

        if (this.config.heartbeat?.enabled !== false) {
          this.heartbeat = new HeartbeatProtocol(
            peerId,
            {
              interval: this.config.heartbeat?.interval,
              timeout: this.config.heartbeat?.timeout,
            },
            this.logger,
          );

          await this.libp2pNode.subscribe(
            "heartbeat",
            async (data: Uint8Array) => {
              try {
                const parsed = JSON.parse(new TextDecoder().decode(data));
                await this.heartbeat!.receive(parsed);
              } catch (error) {
                const msg =
                  error instanceof Error ? error.message : "Unknown error";
                this.logger.error(`Failed to handle heartbeat message: ${msg}`);
              }
            },
          );

          this.heartbeat.start((stalePeerId) => {
            this.peerDiscovery?.removePeer(stalePeerId);
            this.logger.debug(
              `Peer ${stalePeerId} went down, removed from discovery`,
            );
            for (const cb of this.peerDownCallbacks) {
              cb(stalePeerId);
            }
          });

          await this.heartbeat.send(this.libp2pSendAdapter);
        }

        await this.libp2pNode.subscribe(
          "evolve-media",
          async (data: Uint8Array) => {
            try {
              const parsed = JSON.parse(
                new TextDecoder().decode(data),
              ) as MediaMessage;
              await this.handleIncomingMedia(parsed);
            } catch (error) {
              const msg =
                error instanceof Error ? error.message : "Unknown error";
              this.logger.error(`Failed to handle media message: ${msg}`);
            }
          },
        );

        this.callManager = new CallManager(this.logger);

        this.callManager.onOffer((callId, from, to) => {
          this.logger.info(`Incoming call ${callId} from ${from}`);
        });

        this.callManager.onAccept((callId, from, to) => {
          this.logger.info(`Call ${callId} accepted by ${from}`);
        });

        this.callManager.onHangup((callId, from, reason) => {
          this.logger.info(
            `Call ${callId} ended by ${from}: ${reason ?? "unknown"}`,
          );
        });

        await this.libp2pNode.subscribe(
          "evolve-call",
          async (data: Uint8Array) => {
            try {
              const parsed = JSON.parse(
                new TextDecoder().decode(data),
              ) as CallSignal;
              await this.callManager!.receive(parsed);
            } catch (error) {
              const msg =
                error instanceof Error ? error.message : "Unknown error";
              this.logger.error(`Failed to handle call signal: ${msg}`);
            }
          },
        );

        this.logger.info("Libp2p chat subscription active");
      }

      if (this.config.useNostr !== false) {
        this.nostrClient = new NostrClient(
          this.config.nostrConfig,
          this.logger,
        );
        await this.nostrClient.initialize();

        await this.nostrClient.subscribeToEvents(
          { kinds: [4] },
          async (event) => {
            await this.handleIncomingNostrMessage(event);
          },
        );

        this.logger.info("Nostr DM subscription active");
      }

      this.initialized = true;
      this.logger.info("ChatManager initialized");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`ChatManager initialization failed: ${message}`);
      throw new InitializationError(
        `Failed to initialize ChatManager: ${message}`,
      );
    }
  }

  async stop(): Promise<void> {
    if (!this.initialized) return;

    try {
      this.heartbeat?.stop();

      if (
        this.libp2pNode !== null &&
        this.libp2pNode.connectionState !== ConnectionState.Disconnected
      ) {
        await this.libp2pNode.stop();
      }
      if (this.nostrClient !== null && this.nostrClient.isConnected) {
        await this.nostrClient.stop();
      }
      this.initialized = false;
      this.chats.clear();
      this.messageCallbacks.clear();
      this.peerDownCallbacks = [];
      this.logger.info("ChatManager stopped");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`ChatManager stop error: ${message}`);
      throw new InitializationError(`Failed to stop ChatManager: ${message}`);
    }
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new NotInitializedError("ChatManager");
    }
  }

  private handleDirectMessage(msg: DirectMessage): void {
    const message: ExtendedMessage = {
      id: msg.id,
      from: msg.from,
      to: msg.to,
      content: msg.content,
      timestamp: msg.timestamp,
      encrypted: false,
      read: false,
      status: ChatMessageStatus.Delivered,
    };

    this.addToChat(message);
    this.notifyMessageListeners(message);
  }

  private handleIncomingP2pMessage(p2pMessage: P2PMessage): void {
    if (p2pMessage.type !== "chat") return;

    const message: ExtendedMessage = {
      id: generateId(),
      from: p2pMessage.from,
      to: p2pMessage.to,
      content:
        typeof p2pMessage.data === "string"
          ? p2pMessage.data
          : (((p2pMessage.data as Record<string, unknown>)
              ?.content as string) ?? ""),
      timestamp: p2pMessage.timestamp,
      encrypted:
        typeof p2pMessage.data === "object" && p2pMessage.data !== null
          ? (p2pMessage.data as Record<string, unknown>).encrypted === true
          : false,
      read: false,
      status: ChatMessageStatus.Delivered,
    };

    this.addToChat(message);
    this.notifyMessageListeners(message);
  }

  private async handleIncomingNostrMessage(event: {
    id: string;
    pubkey: string;
    created_at: number;
    content: string;
    tags: string[][];
  }): Promise<void> {
    const recipientTag = event.tags.find((tag: string[]) => tag[0] === "p");
    if (
      recipientTag === undefined ||
      recipientTag.length < 2 ||
      recipientTag[1] === undefined ||
      recipientTag[1] === ""
    )
      return;

    let content = event.content;
    if (this.nostrClient !== null) {
      try {
        content = await this.nostrClient.decryptDirectMessage(
          event.content,
          event.pubkey,
        );
      } catch (error) {
        this.logger.warn(
          `Failed to decrypt Nostr DM from ${event.pubkey}, using raw content`,
        );
      }
    }

    const message: ExtendedMessage = {
      id: event.id,
      from: event.pubkey,
      to: recipientTag[1],
      content,
      timestamp: event.created_at * 1000,
      encrypted: true,
      read: false,
      status: ChatMessageStatus.Delivered,
    };

    this.addToChat(message);
    this.notifyMessageListeners(message);
  }

  private addToChat(message: ExtendedMessage): void {
    const chatId = this.getChatId(message.from, message.to);

    let chat = this.chats.get(chatId);
    if (chat === undefined) {
      chat = {
        id: chatId,
        participants: [message.from, message.to],
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      this.chats.set(chatId, chat);
    }

    chat.messages.push(message);
    chat.lastMessage = message;
    chat.updatedAt = message.timestamp;
  }

  private notifyMessageListeners(message: ExtendedMessage): void {
    const chatId = this.getChatId(message.from, message.to);
    const callback = this.messageCallbacks.get(chatId);
    if (callback !== undefined) {
      callback(message);
    }
  }

  private getChatId(user1: string, user2: string): string {
    const sorted = [user1, user2].sort();
    return `${sorted[0]}-${sorted[1]}`;
  }

  async sendMessage(
    from: string,
    to: string,
    content: string,
    encrypted: boolean = false,
  ): Promise<ExtendedMessage> {
    this.ensureInitialized();

    const message: ExtendedMessage = {
      id: generateId(),
      from,
      to,
      content,
      timestamp: Date.now(),
      encrypted,
      read: false,
      status: ChatMessageStatus.Pending,
    };

    try {
      if (this.libp2pNode !== null) {
        const p2pMessage: P2PMessage = {
          type: "chat",
          data: { content, encrypted },
          from,
          to,
          timestamp: message.timestamp,
        };
        await this.libp2pNode.publish("evolve-chat", p2pMessage);
        message.status = ChatMessageStatus.Sent;
      }

      if (this.nostrClient !== null) {
        await this.nostrClient.publishDirectMessage(content, to);
        if (message.status === ChatMessageStatus.Pending) {
          message.status = ChatMessageStatus.Sent;
        }
      }

      this.addToChat(message);

      if (this.storage !== null) {
        const chatId = this.getChatId(from, to);
        const chat = this.chats.get(chatId);
        if (chat !== undefined) {
          await this.storage.saveChat(chat);
        }
      }

      this.logger.debug(`Message ${message.id} sent from ${from} to ${to}`);
    } catch (error) {
      message.status = ChatMessageStatus.Failed;
      if (this.messageQueue.length >= this.MAX_QUEUE_SIZE) {
        const dropped = this.messageQueue.shift();
        this.logger.warn(
          `Message queue full (${this.MAX_QUEUE_SIZE}), dropped oldest message ${dropped?.id ?? "unknown"}`,
        );
      }
      this.messageQueue.push(message);
      const errMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Failed to send message: ${errMessage}`);
      throw error;
    }

    return message;
  }

  async sendDirectMessage(
    from: string,
    to: string,
    content: string,
  ): Promise<void> {
    this.ensureInitialized();
    if (this.directMessaging === null || this.libp2pNode === null) {
      throw new NotInitializedError("Direct messaging requires libp2p");
    }

    await this.directMessaging.send(this.libp2pSendAdapter, {
      id: generateId(),
      from,
      to,
      content,
    });
  }

  getDirectMessageHistory(peerId: string): DirectMessage[] {
    return this.directMessaging?.getMessageHistory(peerId) ?? [];
  }

  getKnownPeers(): DiscoveredPeer[] {
    return this.peerDiscovery?.getKnownPeers() ?? [];
  }

  getPeerStatus(peerId: string): PeerStatus | undefined {
    return this.heartbeat?.getPeerStatus(peerId);
  }

  getAllPeerStatuses(): PeerStatus[] {
    return this.heartbeat?.getAllPeerStatuses() ?? [];
  }

  async requestPeers(): Promise<void> {
    this.ensureInitialized();
    if (this.peerDiscovery === null || this.libp2pNode === null) {
      throw new NotInitializedError("Peer discovery requires libp2p");
    }

    const peerId = this.libp2pNode.getPeerId();
    await this.peerDiscovery.requestPeers(this.libp2pSendAdapter, peerId);
  }

  onPeerDown(callback: (peerId: string) => void): void {
    this.peerDownCallbacks.push(callback);
  }

  offPeerDown(callback: (peerId: string) => void): void {
    const index = this.peerDownCallbacks.indexOf(callback);
    if (index !== -1) {
      this.peerDownCallbacks.splice(index, 1);
    }
  }

  getChat(user1: string, user2: string): Chat | null {
    const chatId = this.getChatId(user1, user2);
    return this.chats.get(chatId) ?? null;
  }

  getAllChats(): Chat[] {
    return Array.from(this.chats.values());
  }

  getChatsForUser(userAddress: string): Chat[] {
    return this.getAllChats().filter((chat) =>
      chat.participants.includes(userAddress),
    );
  }

  markMessageAsRead(messageId: string): void {
    for (const chat of this.chats.values()) {
      const message = chat.messages.find((m) => m.id === messageId);
      if (message !== undefined) {
        message.read = true;
        (message as ExtendedMessage).status = ChatMessageStatus.Read;
        break;
      }
    }
  }

  markChatAsRead(user1: string, user2: string): void {
    const chat = this.getChat(user1, user2);
    if (chat !== null) {
      for (const message of chat.messages) {
        message.read = true;
        (message as ExtendedMessage).status = ChatMessageStatus.Read;
      }
    }
  }

  onMessage(user1: string, user2: string, callback: MessageHandler): void {
    const chatId = this.getChatId(user1, user2);
    this.messageCallbacks.set(chatId, callback);
  }

  offMessage(user1: string, user2: string): void {
    const chatId = this.getChatId(user1, user2);
    this.messageCallbacks.delete(chatId);
  }

  async deleteChat(user1: string, user2: string): Promise<void> {
    const chatId = this.getChatId(user1, user2);
    this.chats.delete(chatId);
    this.offMessage(user1, user2);
  }

  async deleteMessage(messageId: string): Promise<void> {
    for (const chat of this.chats.values()) {
      const index = chat.messages.findIndex((m) => m.id === messageId);
      if (index !== -1) {
        chat.messages.splice(index, 1);

        if (chat.messages.length > 0) {
          chat.lastMessage = chat.messages[chat.messages.length - 1];
        } else {
          delete chat.lastMessage;
        }

        chat.updatedAt = Date.now();
        break;
      }
    }
  }

  async sendTypingIndicator(from: string, to: string): Promise<void> {
    this.ensureInitialized();

    if (this.libp2pNode !== null) {
      try {
        await this.libp2pNode.publish("evolve-chat", {
          type: "typing",
          from,
          to,
          timestamp: Date.now(),
        });
      } catch {
        this.logger.debug("Failed to send typing indicator via libp2p");
      }
    }

    if (this.nostrClient !== null) {
      try {
        await this.nostrClient.publishEvent(20001, "", [
          ["p", to],
          ["typing", from],
        ]);
      } catch {
        this.logger.debug("Failed to send typing indicator via Nostr");
      }
    }
  }

  async sendMedia(
    from: string,
    to: string,
    cid: string,
    mimeType: string,
    fileName: string,
    size: number,
    ttlMs: number = 24 * 60 * 60 * 1000,
    duration?: number,
  ): Promise<MediaMessage> {
    this.ensureInitialized();

    const msg: MediaMessage = {
      id: generateId(),
      from,
      to,
      cid,
      mimeType,
      fileName,
      size,
      duration,
      expiresAt: Date.now() + ttlMs,
    };

    if (this.libp2pNode !== null) {
      try {
        await this.libp2pNode.publish("evolve-media", msg);
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        this.logger.error(`Failed to publish media message: ${errMsg}`);
        throw error;
      }
    }

    this.logger.debug(
      `Media message ${msg.id} (${fileName}) sent from ${from} to ${to}`,
    );
    return msg;
  }

  private async handleIncomingMedia(msg: MediaMessage): Promise<void> {
    const chatId = this.getChatId(msg.from, msg.to);
    const callback = this.mediaCallbacks.get(chatId);
    if (callback !== undefined) {
      callback(msg);
    }

    if (msg.expiresAt < Date.now()) {
      this.logger.warn(`Media message ${msg.id} has already expired`);
    }
  }

  onMedia(
    user1: string,
    user2: string,
    callback: (msg: MediaMessage) => void,
  ): void {
    const chatId = this.getChatId(user1, user2);
    this.mediaCallbacks.set(chatId, callback);
  }

  offMedia(user1: string, user2: string): void {
    const chatId = this.getChatId(user1, user2);
    this.mediaCallbacks.delete(chatId);
  }

  // WebRTC signaling
  async offerCall(to: string): Promise<string> {
    this.ensureInitialized();
    if (this.callManager === null || this.libp2pNode === null) {
      throw new NotInitializedError("Call manager requires libp2p");
    }

    const offer = this.callManager.createCall(this.libp2pNode.getPeerId(), to);

    await this.libp2pNode.publish("evolve-call", {
      type: "offer",
      callId: offer.callId,
      from: offer.from,
      to: offer.to,
      sdp: offer.sdp,
      timestamp: offer.timestamp,
    });

    return offer.callId;
  }

  async acceptCall(callId: string): Promise<void> {
    this.ensureInitialized();
    if (this.callManager === null || this.libp2pNode === null) {
      throw new NotInitializedError("Call manager requires libp2p");
    }

    const accept = this.callManager.acceptCall(callId);

    await this.libp2pNode.publish("evolve-call", {
      type: "accept",
      callId: accept.callId,
      from: accept.from,
      to: accept.to,
      sdp: accept.sdp,
      timestamp: accept.timestamp,
    });
  }

  async rejectCall(callId: string): Promise<void> {
    this.ensureInitialized();
    if (this.callManager === null || this.libp2pNode === null) {
      throw new NotInitializedError("Call manager requires libp2p");
    }

    const hangup = this.callManager.hangupCall(callId);
    await this.libp2pNode.publish("evolve-call", {
      type: "hangup",
      callId: hangup.callId,
      from: hangup.from,
      to: hangup.to,
      reason: "rejected",
      timestamp: hangup.timestamp,
    });
  }

  async hangupCall(callId: string): Promise<void> {
    this.ensureInitialized();
    if (this.callManager === null || this.libp2pNode === null) {
      throw new NotInitializedError("Call manager requires libp2p");
    }

    const hangup = this.callManager.hangupCall(callId);
    await this.libp2pNode.publish("evolve-call", {
      type: "hangup",
      callId: hangup.callId,
      from: hangup.from,
      to: hangup.to,
      reason: hangup.reason,
      timestamp: hangup.timestamp,
    });
  }

  onCallOffer(
    callback: (callId: string, from: string, to: string) => void,
  ): void {
    this.callManager?.onOffer(callback);
  }

  onCallAccept(
    callback: (callId: string, from: string, to: string) => void,
  ): void {
    this.callManager?.onAccept(callback);
  }

  onCallHangup(
    callback: (callId: string, from: string, reason?: string) => void,
  ): void {
    this.callManager?.onHangup(callback);
  }

  getCallState(callId: string): CallState | undefined {
    return this.callManager?.getState(callId);
  }

  getActiveCalls(): Map<string, CallState> {
    return this.callManager?.getActiveCalls() ?? new Map();
  }

  onTyping(
    user1: string,
    user2: string,
    callback: (user: string) => void,
  ): void {
    const chatId = this.getChatId(user1, user2);
    this.typingCallbacks.set(chatId, callback);
  }

  offTyping(user1: string, user2: string): void {
    const chatId = this.getChatId(user1, user2);
    this.typingCallbacks.delete(chatId);
  }

  async flushQueue(): Promise<void> {
    const pending = [...this.messageQueue];
    this.messageQueue = [];

    for (const message of pending) {
      if (
        message.status === ChatMessageStatus.Failed ||
        message.status === ChatMessageStatus.Pending
      ) {
        try {
          await this.sendMessage(
            message.from,
            message.to,
            message.content,
            message.encrypted,
          );
          this.logger.debug(`Flushed queued message ${message.id}`);
        } catch (error) {
          this.messageQueue.push(message);
          const errMessage =
            error instanceof Error ? error.message : "Unknown error";
          this.logger.warn(
            `Failed to flush message ${message.id}: ${errMessage}, re-queued`,
          );
        }
      }
    }
  }

  getQueueSize(): number {
    return this.messageQueue.length;
  }
}

const consoleLogger: ILogger = {
  info: (message, ...args) => console.log(`[ChatManager] ${message}`, ...args),
  warn: (message, ...args) => console.warn(`[ChatManager] ${message}`, ...args),
  error: (message, ...args) =>
    console.error(`[ChatManager] ${message}`, ...args),
  debug: (message, ...args) =>
    console.debug(`[ChatManager] ${message}`, ...args),
};
