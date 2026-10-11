import { createLibp2p, type Libp2p } from "libp2p";
import { webSockets } from "@libp2p/websockets";
import { noise } from "@libp2p/noise";
import { yamux } from "@libp2p/yamux";
import { gossipsub, type GossipSub, type Message } from "@libp2p/gossipsub";
import { bootstrap } from "@libp2p/bootstrap";
import { identify, type Identify } from "@libp2p/identify";
import { ping, type Ping } from "@libp2p/ping";
import { peerIdFromString } from "@libp2p/peer-id";
import { multiaddr } from "@multiformats/multiaddr";
import { ConnectionState, type ILogger } from "./types";
import {
  InitializationError,
  NotInitializedError,
  ConnectionError,
  PublishError,
  SubscribeError,
} from "./errors";

export interface Libp2pConfig {
  bootstrapPeers?: string[];
  /**
   * Back-compat no-op: the DHT service is no longer part of this node. Kept
   * so existing callers (ChatManager, browser config) keep compiling.
   */
  enableDHT?: boolean;
  /**
   * Back-compat no-op: gossipsub is always enabled — chat runs on it.
   */
  enableGossipsub?: boolean;
  /**
   * Multiaddrs to listen on. Defaults to `[]` (dial-only) which is the only
   * mode browsers support; relays/Node.js servers pass explicit addresses.
   */
  listenAddresses?: string[];
  /**
   * Multiaddrs to advertise to the network instead of the observed ones
   * (e.g. a public relay address for a Node.js host behind NAT).
   */
  announceAddresses?: string[];
  reconnect?: {
    maxRetries?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
  };
}

/**
 * The service map this node always installs: identify + ping + gossipsub.
 * `enableDHT` / `enableGossipsub` are accepted as no-ops for back-compat.
 */
type Libp2pNodeServices = {
  identify: Identify;
  ping: Ping;
  pubsub: GossipSub;
};

export class Libp2pNode {
  private node: Libp2p<Libp2pNodeServices> | null = null;
  private state: ConnectionState = ConnectionState.Disconnected;
  private logger: ILogger;
  private subscribedTopics: Set<string> = new Set();
  private topicHandlers: Map<string, Set<(data: Uint8Array) => void>> = new Map();
  private globalMessageListener: ((event: CustomEvent<Message>) => void) | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private stopped = false;

  constructor(
    private config: Libp2pConfig = {},
    logger?: ILogger,
  ) {
    this.logger = logger ?? consoleLogger;
  }

  get connectionState(): ConnectionState {
    return this.state;
  }

  async initialize(): Promise<void> {
    if (this.state === ConnectionState.Connected) return;

    this.state = ConnectionState.Connecting;
    this.logger.info("Initializing Libp2p node...");

    try {
      const bootstrapPeers = this.config.bootstrapPeers;

      this.node = await createLibp2p<Libp2pNodeServices>({
        start: false,
        addresses: {
          listen: this.config.listenAddresses ?? [],
          ...(this.config.announceAddresses?.length
            ? { announce: this.config.announceAddresses }
            : {}),
        },
        transports: [webSockets()],
        connectionEncrypters: [noise()],
        streamMuxers: [yamux()],
        ...(bootstrapPeers !== undefined && bootstrapPeers.length > 0
          ? { peerDiscovery: [bootstrap({ list: bootstrapPeers })] }
          : {}),
        services: {
          identify: identify(),
          ping: ping(),
          pubsub: gossipsub({
            emitSelf: false,
            floodPublish: true,
            allowPublishToZeroTopicPeers: true,
          }),
        },
      });

      await this.node.start();
      this.state = ConnectionState.Connected;
      this.logger.info(`Libp2p node started with peer ID: ${this.getPeerId()}`);
    } catch (error) {
      this.state = ConnectionState.Disconnected;
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Libp2p initialization failed: ${message}`);
      throw new InitializationError(`Failed to initialize Libp2p node: ${message}`);
    }
  }

  async stop(): Promise<void> {
    this.stopped = true;

    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.state === ConnectionState.Disconnected) return;

    try {
      await this.node?.stop();
      this.node = null;
      this.state = ConnectionState.Disconnected;
      this.subscribedTopics.clear();
      this.globalMessageListener = null;
      this.reconnectAttempts = 0;
      this.logger.info("Libp2p node stopped");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Libp2p stop error: ${message}`);
      throw new InitializationError(`Failed to stop Libp2p node: ${message}`);
    }
  }

  async reconnect(): Promise<void> {
    if (this.stopped) return;

    const maxRetries = this.config.reconnect?.maxRetries ?? 10;
    const baseDelay = this.config.reconnect?.baseDelayMs ?? 1000;
    const maxDelay = this.config.reconnect?.maxDelayMs ?? 30000;

    if (this.reconnectAttempts >= maxRetries) {
      this.logger.error(`Max reconnect attempts (${maxRetries}) reached`);
      this.state = ConnectionState.Disconnected;
      return;
    }

    this.state = ConnectionState.Reconnecting;
    const delay = Math.min(baseDelay * Math.pow(2, this.reconnectAttempts), maxDelay);
    this.reconnectAttempts++;

    this.logger.info(
      `Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${maxRetries})`,
    );

    this.reconnectTimer = setTimeout(async () => {
      try {
        await this.initialize();
        this.reconnectAttempts = 0;
        this.logger.info("Reconnected successfully");

        const node = this.node;
        if (node !== null) {
          for (const topic of this.subscribedTopics) {
            node.services.pubsub.subscribe(topic);
            this.logger.debug(`Re-subscribed to topic: ${topic}`);
          }
          if (this.topicHandlers.size > 0) {
            this.attachGlobalMessageListener();
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        this.logger.error(`Reconnect failed: ${message}`);
        await this.reconnect();
      }
    }, delay);
  }

  withRetry<T>(fn: () => Promise<T>, maxRetries = 3, baseDelayMs = 500): Promise<T> {
    return fn().catch(async (error) => {
      for (let attempt = 1; attempt < maxRetries; attempt++) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        this.logger.debug(`Retry ${attempt}/${maxRetries} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        try {
          return await fn();
        } catch (retryError) {
          if (attempt === maxRetries - 1) throw retryError;
        }
      }
      throw error;
    });
  }

  private ensureNode(): Libp2p<Libp2pNodeServices> {
    if (this.node === null || this.state !== ConnectionState.Connected) {
      throw new NotInitializedError("Libp2p node");
    }
    return this.node;
  }

  getPeerId(): string {
    return this.ensureNode().peerId.toString();
  }

  getMultiaddrs(): string[] {
    return this.ensureNode()
      .getMultiaddrs()
      .map((ma) => ma.toString());
  }

  async connect(peerMultiaddr: string): Promise<void> {
    try {
      await this.ensureNode().dial(multiaddr(peerMultiaddr));
      this.logger.info(`Connected to peer: ${peerMultiaddr}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Connect to ${peerMultiaddr} failed: ${message}`);
      throw new ConnectionError(`Failed to connect to peer ${peerMultiaddr}: ${message}`);
    }
  }

  async disconnect(peerId: string): Promise<void> {
    try {
      await this.ensureNode().hangUp(peerIdFromString(peerId));
      this.logger.info(`Disconnected from peer: ${peerId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Disconnect from ${peerId} failed: ${message}`);
      throw new ConnectionError(`Failed to disconnect from peer ${peerId}: ${message}`);
    }
  }

  getPeers(): { id: string; address: string; lastSeen: number }[] {
    const node = this.ensureNode();
    return node.getPeers().map((peer) => ({
      id: peer.toString(),
      address: peer.toString(),
      lastSeen: Date.now(),
    }));
  }

  async publish(topic: string, message: unknown): Promise<void> {
    try {
      const messageBytes = new TextEncoder().encode(JSON.stringify(message));
      await this.ensureNode().services.pubsub.publish(topic, messageBytes);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Publish to ${topic} failed: ${msg}`);
      throw new PublishError(`Failed to publish message to ${topic}: ${msg}`);
    }
  }

  async subscribe(topic: string, handler: (data: Uint8Array) => void): Promise<void> {
    try {
      const node = this.ensureNode();
      const isFirstSubscriber = !this.topicHandlers.has(topic);

      let handlers = this.topicHandlers.get(topic);
      if (handlers === undefined) {
        handlers = new Set();
        this.topicHandlers.set(topic, handlers);
      }
      handlers.add(handler);

      if (isFirstSubscriber) {
        node.services.pubsub.subscribe(topic);
        this.subscribedTopics.add(topic);
        this.attachGlobalMessageListener();
      }

      this.logger.info(`Subscribed to topic: ${topic}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Subscribe to ${topic} failed: ${msg}`);
      throw new SubscribeError(`Failed to subscribe to topic ${topic}: ${msg}`, error);
    }
  }

  async unsubscribe(topic: string): Promise<void> {
    try {
      const node = this.ensureNode();
      const handlers = this.topicHandlers.get(topic);
      if (handlers !== undefined && handlers.size === 0) {
        this.topicHandlers.delete(topic);
        node.services.pubsub.unsubscribe(topic);
        this.subscribedTopics.delete(topic);

        if (this.topicHandlers.size === 0) {
          this.detachGlobalMessageListener();
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Unsubscribe from ${topic} failed: ${msg}`);
      throw new SubscribeError(`Failed to unsubscribe from topic ${topic}: ${msg}`, error);
    }
  }

  private attachGlobalMessageListener(): void {
    if (this.globalMessageListener !== null) return;
    const node = this.ensureNode();
    const listener = (event: CustomEvent<Message>): void => {
      const messageTopic = event.detail.topic;
      const handlers = this.topicHandlers.get(messageTopic);
      if (handlers !== undefined) {
        for (const handler of handlers) {
          handler(event.detail.data);
        }
      }
    };
    node.services.pubsub.addEventListener("message", listener);
    this.globalMessageListener = listener;
  }

  private detachGlobalMessageListener(): void {
    if (this.globalMessageListener === null) return;
    const node = this.ensureNode();
    node.services.pubsub.removeEventListener("message", this.globalMessageListener);
    this.globalMessageListener = null;
  }

  async ping(peerId: string, timeout: number = 10000): Promise<number> {
    try {
      const abortController = new AbortController();
      const timer = setTimeout(() => abortController.abort(), timeout);
      const startTime = Date.now();

      await this.ensureNode().services.ping.ping(peerIdFromString(peerId), {
        signal: abortController.signal,
      });

      clearTimeout(timer);
      return Date.now() - startTime;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Ping ${peerId} failed: ${msg}`);
      throw new ConnectionError(`Failed to ping peer ${peerId}: ${msg}`);
    }
  }
}

const consoleLogger: ILogger = {
  info: (message, ...args) => console.log(`[Libp2p] ${message}`, ...args),
  warn: (message, ...args) => console.warn(`[Libp2p] ${message}`, ...args),
  error: (message, ...args) => console.error(`[Libp2p] ${message}`, ...args),
  debug: (message, ...args) => console.debug(`[Libp2p] ${message}`, ...args),
};
