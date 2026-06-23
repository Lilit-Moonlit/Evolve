import { createLibp2p } from "libp2p";
import { webSockets } from "@libp2p/websockets";
import { webTransport } from "@libp2p/webtransport";
import { mplex } from "@libp2p/mplex";
import { noise } from "@libp2p/noise";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { bootstrap } from "@libp2p/bootstrap";
import { kadDHT } from "@libp2p/kad-dht";
import { identify } from "@libp2p/identify";
import { ping } from "@libp2p/ping";
import { uPnPNAT } from "@libp2p/upnp-nat";
import { peerIdFromString } from "@libp2p/peer-id";
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
  enableDHT?: boolean;
  enableGossipsub?: boolean;
  listenAddresses?: string[];
  reconnect?: {
    maxRetries?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
  };
}

export class Libp2pNode {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private node: any = null;
  private state: ConnectionState = ConnectionState.Disconnected;
  private logger: ILogger;
  private subscribedTopics: Set<string> = new Set();
  private topicHandlers: Map<string, Set<(data: Uint8Array) => void>> =
    new Map();
  private globalMessageListener: ((event: Event) => void) | null = null;
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
      const listenAddresses = this.config.listenAddresses ?? [
        "/ip4/0.0.0.0/tcp/0",
        "/ip4/0.0.0.0/tcp/0/ws",
      ];

      const services: Record<string, unknown> = {
        identify: identify(),
        ping: ping(),
        upnp: uPnPNAT(),
      };

      if (this.config.enableGossipsub !== false) {
        services.pubsub = gossipsub();
      }

      if (this.config.enableDHT !== false) {
        services.dht = kadDHT();
      }

      const peerDiscovery =
        this.config.bootstrapPeers !== undefined &&
        this.config.bootstrapPeers.length > 0
          ? [bootstrap({ list: this.config.bootstrapPeers! })]
          : undefined;

      this.node = await createLibp2p({
        addresses: { listen: listenAddresses },
        transports: [webSockets(), webTransport()],
        streamMuxers: [mplex()],
        connectionEncryption: [noise()],
        peerDiscovery,
        services,
      } as never); // Gossipsub@14 uses @libp2p/interface@^2.0.0, rest uses ^3.2.3 — cast bypasses version mismatch. Runtime works fine.

      await this.node.start();
      this.state = ConnectionState.Connected;
      this.logger.info(`Libp2p node started with peer ID: ${this.getPeerId()}`);
    } catch (error) {
      this.state = ConnectionState.Disconnected;
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Libp2p initialization failed: ${message}`);
      throw new InitializationError(
        `Failed to initialize Libp2p node: ${message}`,
      );
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
    const delay = Math.min(
      baseDelay * Math.pow(2, this.reconnectAttempts),
      maxDelay,
    );
    this.reconnectAttempts++;

    this.logger.info(
      `Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${maxRetries})`,
    );

    this.reconnectTimer = setTimeout(async () => {
      try {
        await this.initialize();
        this.reconnectAttempts = 0;
        this.logger.info("Reconnected successfully");

        for (const topic of this.subscribedTopics) {
          this.node.services.pubsub.subscribe(topic);
          this.logger.debug(`Re-subscribed to topic: ${topic}`);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        this.logger.error(`Reconnect failed: ${message}`);
        await this.reconnect();
      }
    }, delay);
  }

  withRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelayMs = 500,
  ): Promise<T> {
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

  private ensureNode() {
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
      .map((ma: { toString(): string }) => ma.toString());
  }

  async connect(peerMultiaddr: string): Promise<void> {
    try {
      const { multiaddr } = await import("@multiformats/multiaddr");
      await this.ensureNode().dial(multiaddr(peerMultiaddr));
      this.logger.info(`Connected to peer: ${peerMultiaddr}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Connect to ${peerMultiaddr} failed: ${message}`);
      throw new ConnectionError(
        `Failed to connect to peer ${peerMultiaddr}: ${message}`,
      );
    }
  }

  async disconnect(peerId: string): Promise<void> {
    try {
      await this.ensureNode().hangUp(peerIdFromString(peerId));
      this.logger.info(`Disconnected from peer: ${peerId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Disconnect from ${peerId} failed: ${message}`);
      throw new ConnectionError(
        `Failed to disconnect from peer ${peerId}: ${message}`,
      );
    }
  }

  getPeers(): { id: string; address: string; lastSeen: number }[] {
    const node = this.ensureNode();
    return node.getPeers().map((peer: { toString(): string }) => ({
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

  async subscribe(
    topic: string,
    handler: (data: Uint8Array) => void,
  ): Promise<void> {
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
      throw new SubscribeError(
        `Failed to subscribe to topic ${topic}: ${msg}`,
        error,
      );
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
      throw new SubscribeError(
        `Failed to unsubscribe from topic ${topic}: ${msg}`,
        error,
      );
    }
  }

  private attachGlobalMessageListener(): void {
    if (this.globalMessageListener !== null) return;
    const node = this.ensureNode();
    const listener = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      const messageTopic = detail.msg.topic;
      const handlers = this.topicHandlers.get(messageTopic);
      if (handlers !== undefined) {
        for (const handler of handlers) {
          handler(detail.msg.data as Uint8Array);
        }
      }
    };
    node.services.pubsub.addEventListener("gossipsub:message", listener);
    this.globalMessageListener = listener;
  }

  private detachGlobalMessageListener(): void {
    if (this.globalMessageListener === null) return;
    const node = this.ensureNode();
    node.services.pubsub.removeEventListener(
      "gossipsub:message",
      this.globalMessageListener,
    );
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
