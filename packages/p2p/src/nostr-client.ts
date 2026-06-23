import {
  generateSecretKey,
  getPublicKey,
  finalizeEvent,
} from "nostr-tools/pure";
import { Relay, SimplePool } from "nostr-tools";
import * as nip04 from "nostr-tools/nip04";
import type { Filter } from "nostr-tools/filter";
import type { ILogger, NostrEvent } from "./types";
import {
  InitializationError,
  NotInitializedError,
  PublishError,
  SubscribeError,
  CryptographyError,
} from "./errors";

export interface NostrConfig {
  relays?: string[];
  reconnect?: {
    maxRetries?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
  };
}

export class NostrClient {
  private secretKey: Uint8Array | null = null;
  publicKey: string | null = null;
  private relays: Relay[] = [];
  private pool: SimplePool | null = null;
  private state: "disconnected" | "connected" | "reconnecting" = "disconnected";
  private logger: ILogger;
  private storedRelayUrls: string[] = [];
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private stopped = false;

  constructor(
    private config: NostrConfig = {},
    logger?: ILogger,
  ) {
    this.logger = logger ?? consoleLogger;
  }

  get isConnected(): boolean {
    return this.state === "connected";
  }

  async initialize(secretKey?: Uint8Array): Promise<void> {
    if (this.state === "connected") return;

    try {
      if (secretKey !== undefined) {
        this.secretKey = secretKey;
      } else {
        this.secretKey = generateSecretKey();
      }
      this.publicKey = getPublicKey(this.secretKey);

      this.storedRelayUrls = this.config.relays ?? [
        "wss://relay.damus.io",
        "wss://relay.nostr.bg",
        "wss://nos.lol",
      ];

      this.pool = new SimplePool();

      for (const url of this.storedRelayUrls) {
        const relay = await Relay.connect(url);
        this.relays.push(relay);
        this.logger.info(`Connected to relay: ${url}`);
      }

      this.state = "connected";
      this.logger.info(
        `Nostr client initialized with pubkey: ${this.publicKey}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Nostr initialization failed: ${message}`);
      throw new InitializationError(
        `Failed to initialize Nostr client: ${message}`,
      );
    }
  }

  async stop(): Promise<void> {
    this.stopped = true;

    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.state === "disconnected") return;

    try {
      this.pool?.destroy();
      this.pool = null;

      for (const relay of this.relays) {
        relay.close();
      }
      this.relays = [];
      this.state = "disconnected";
      this.reconnectAttempts = 0;
      this.logger.info("Nostr client stopped");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Nostr stop error: ${message}`);
      throw new InitializationError(`Failed to stop Nostr client: ${message}`);
    }
  }

  async reconnect(): Promise<void> {
    if (this.stopped) return;

    const maxRetries = this.config.reconnect?.maxRetries ?? 10;
    const baseDelay = this.config.reconnect?.baseDelayMs ?? 1000;
    const maxDelay = this.config.reconnect?.maxDelayMs ?? 30000;

    if (this.reconnectAttempts >= maxRetries) {
      this.logger.error(`Max reconnect attempts (${maxRetries}) reached`);
      this.state = "disconnected";
      return;
    }

    this.state = "reconnecting";
    const delay = Math.min(
      baseDelay * Math.pow(2, this.reconnectAttempts),
      maxDelay,
    );
    this.reconnectAttempts++;

    this.logger.info(
      `Reconnecting relays in ${delay}ms (attempt ${this.reconnectAttempts}/${maxRetries})`,
    );

    this.reconnectTimer = setTimeout(async () => {
      try {
        this.relays = [];
        this.pool = new SimplePool();

        for (const url of this.storedRelayUrls) {
          const relay = await Relay.connect(url);
          this.relays.push(relay);
          this.logger.info(`Reconnected to relay: ${url}`);
        }

        this.state = "connected";
        this.reconnectAttempts = 0;
        this.logger.info("Nostr relays reconnected successfully");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        this.logger.error(`Relay reconnect failed: ${message}`);
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

  private ensureInitialized(): void {
    if (this.state !== "connected" || this.secretKey === null) {
      throw new NotInitializedError("Nostr client");
    }
  }

  private relayUrls(): string[] {
    return this.storedRelayUrls;
  }

  getPrivateKey(): Uint8Array {
    this.ensureInitialized();
    return this.secretKey!;
  }

  getPublicKeyString(): string {
    if (this.publicKey === null) {
      throw new NotInitializedError("Nostr client");
    }
    return this.publicKey;
  }

  async publishEvent(
    kind: number,
    content: string,
    tags: string[][] = [],
  ): Promise<NostrEvent> {
    this.ensureInitialized();

    try {
      const eventTemplate = {
        kind,
        content,
        tags,
        created_at: Math.floor(Date.now() / 1000),
      };

      const signedEvent = finalizeEvent(eventTemplate, this.secretKey!);

      const event: NostrEvent = {
        id: signedEvent.id,
        pubkey: signedEvent.pubkey,
        created_at: signedEvent.created_at,
        kind: signedEvent.kind,
        tags: signedEvent.tags as string[][],
        content: signedEvent.content,
        sig: signedEvent.sig,
      };

      const promises = this.relays.map((relay) => relay.publish(event));
      await Promise.all(promises);

      this.logger.debug(`Published event kind ${kind}`);
      return event;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Nostr publish failed: ${message}`);
      throw new PublishError(`Failed to publish event: ${message}`);
    }
  }

  async subscribeToEvents(
    filter: Filter,
    callback: (event: NostrEvent) => void,
  ): Promise<() => void> {
    this.ensureInitialized();

    try {
      const subscriptions: { close: (reason?: string) => void }[] = [];

      for (const relay of this.relays) {
        const sub = relay.subscribe([filter], {
          onevent: (event) => {
            const nostrEvent: NostrEvent = {
              id: event.id,
              pubkey: event.pubkey,
              created_at: event.created_at,
              kind: event.kind,
              tags: event.tags as string[][],
              content: event.content,
              sig: event.sig,
            };
            callback(nostrEvent);
          },
        });
        subscriptions.push(sub);
      }

      return () => {
        for (const sub of subscriptions) {
          sub.close();
        }
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Nostr subscribe failed: ${message}`);
      throw new SubscribeError(`Failed to subscribe to events: ${message}`);
    }
  }

  async fetchEvents(filter: Filter): Promise<NostrEvent[]> {
    this.ensureInitialized();

    try {
      const relayUrls = this.relayUrls();

      if (relayUrls.length === 0) return [];

      const results = await this.pool!.querySync(relayUrls, filter);

      const events: NostrEvent[] = results.map((result) => ({
        id: result.id,
        pubkey: result.pubkey,
        created_at: result.created_at,
        kind: result.kind,
        tags: result.tags as string[][],
        content: result.content,
        sig: result.sig,
      }));

      const seen = new Set<string>();
      return events.filter((event) => {
        if (seen.has(event.id)) return false;
        seen.add(event.id);
        return true;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`Nostr fetch failed: ${message}`);
      throw new SubscribeError(`Failed to fetch events: ${message}`);
    }
  }

  async publishProfile(profile: {
    name?: string;
    about?: string;
    picture?: string;
    lud16?: string;
  }): Promise<NostrEvent> {
    const content = JSON.stringify(profile);
    return this.publishEvent(0, content);
  }

  async publishTextNote(
    content: string,
    replyTo?: string,
  ): Promise<NostrEvent> {
    const tags = replyTo !== undefined ? [["e", replyTo]] : [];
    return this.publishEvent(1, content, tags);
  }

  async publishDirectMessage(
    content: string,
    recipientPubkey: string,
  ): Promise<NostrEvent> {
    this.ensureInitialized();

    try {
      const encrypted = await nip04.encrypt(
        this.secretKey!,
        recipientPubkey,
        content,
      );
      const tags = [["p", recipientPubkey]];
      return this.publishEvent(4, encrypted, tags);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`NIP-04 encryption failed: ${message}`);
      throw new CryptographyError(`Failed to encrypt DM: ${message}`);
    }
  }

  async decryptDirectMessage(
    encryptedContent: string,
    senderPubkey: string,
  ): Promise<string> {
    this.ensureInitialized();

    try {
      return await nip04.decrypt(
        this.secretKey!,
        senderPubkey,
        encryptedContent,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`NIP-04 decryption failed: ${message}`);
      throw new CryptographyError(`Failed to decrypt DM: ${message}`);
    }
  }

  async fetchProfile(pubkey: string): Promise<Record<string, unknown> | null> {
    const filter: Filter = {
      kinds: [0],
      authors: [pubkey],
      limit: 1,
    };

    const events = await this.fetchEvents(filter);
    if (events.length === 0) return null;

    return JSON.parse(events[0].content) as Record<string, unknown>;
  }

  async fetchEventsFromUser(
    pubkey: string,
    kinds: number[] = [1],
  ): Promise<NostrEvent[]> {
    const filter: Filter = {
      kinds,
      authors: [pubkey],
    };

    return this.fetchEvents(filter);
  }
}

const consoleLogger: ILogger = {
  info: (message, ...args) => console.log(`[Nostr] ${message}`, ...args),
  warn: (message, ...args) => console.warn(`[Nostr] ${message}`, ...args),
  error: (message, ...args) => console.error(`[Nostr] ${message}`, ...args),
  debug: (message, ...args) => console.debug(`[Nostr] ${message}`, ...args),
};
