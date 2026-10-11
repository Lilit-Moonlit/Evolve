import { WebSocket, WebSocketServer, type RawData } from "ws";

/**
 * Minimal NIP-01 Nostr relay for EVOLVE's city-scoped local chat.
 *
 * This is a deliberately "dumb" store-and-forward relay: it accepts `EVENT`
 * messages, stores them in memory, answers `REQ` queries with matching stored
 * events, and forwards freshly stored events to active matching subscriptions.
 *
 * All NIP-29 group semantics (admins, members, join approval, deletion) are
 * enforced CLIENT-SIDE by `apps/web/src/lib/local-chat-nostr.ts` — the relay
 * never interprets kinds or tags. Local-dev reference only; see README.md.
 */

/** NIP-01 event shape used by EVOLVE clients. `sig` is stored, never verified. */
export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

/** NIP-01 filter subset supported by this relay. */
export interface NostrFilter {
  ids?: string[];
  authors?: string[];
  kinds?: number[];
  since?: number;
  until?: number;
  limit?: number;
  /** `#<tag-name>` filters, keyed by tag name without the leading `#`. */
  tags?: Record<string, string[]>;
}

export interface NostrCityRelayOptions {
  /** Port to listen on. Default 7000. */
  port?: number;
  /** Bind host. Default "0.0.0.0". */
  host?: string;
  /** Maximum number of stored events; oldest are evicted first. Default 100_000. */
  maxEvents?: number;
  /** Server-level error handler (e.g. EADDRINUSE). */
  onError?: (error: Error) => void;
}

interface Subscription {
  filters: NostrFilter[];
}

const DEFAULT_PORT = 7000;
const DEFAULT_HOST = "0.0.0.0";
const DEFAULT_MAX_EVENTS = 100_000;

export class NostrCityRelay {
  readonly server: WebSocketServer;

  private readonly maxEvents: number;
  /** Stored events keyed by id; Map iteration order = insertion order. */
  private readonly events = new Map<string, NostrEvent>();
  /** Active subscriptions per socket, keyed by subscription id. */
  private readonly subscriptions = new Map<WebSocket, Map<string, Subscription>>();

  constructor(options: NostrCityRelayOptions = {}) {
    this.maxEvents = options.maxEvents ?? DEFAULT_MAX_EVENTS;
    this.server = new WebSocketServer({
      port: options.port ?? DEFAULT_PORT,
      host: options.host ?? DEFAULT_HOST,
    });
    if (options.onError) this.server.on("error", options.onError);
    this.server.on("connection", (socket, request) =>
      this.handleConnection(socket, request.socket.remoteAddress),
    );
  }

  /** Number of stored events. */
  get eventCount(): number {
    return this.events.size;
  }

  /** Total number of active subscriptions across all sockets. */
  get subscriptionCount(): number {
    let total = 0;
    for (const subs of this.subscriptions.values()) total += subs.size;
    return total;
  }

  close(callback?: () => void): void {
    for (const socket of this.subscriptions.keys()) socket.terminate();
    this.subscriptions.clear();
    this.server.close(callback);
  }

  private handleConnection(socket: WebSocket, remoteAddress: string | undefined): void {
    this.log(`client connected (${remoteAddress ?? "unknown address"})`);
    this.subscriptions.set(socket, new Map());
    socket.on("message", (data: RawData) => this.handleMessage(socket, data));
    socket.on("close", () => {
      this.subscriptions.delete(socket);
      this.log("client disconnected");
    });
    socket.on("error", (error: Error) => this.log(`socket error: ${error.message}`));
  }

  private handleMessage(socket: WebSocket, data: RawData): void {
    let message: unknown;
    try {
      message = JSON.parse(decodeRawData(data));
    } catch {
      this.log("ignored malformed JSON message");
      return;
    }
    if (!Array.isArray(message) || message.length === 0) {
      this.log("ignored non-array message");
      return;
    }
    const [type, ...payload]: unknown[] = message;
    if (type === "EVENT") {
      this.handleEventMessage(socket, payload[0]);
    } else if (type === "REQ") {
      this.handleReqMessage(socket, payload);
    } else if (type === "CLOSE") {
      this.handleCloseMessage(socket, payload[0]);
    } else {
      this.send(socket, ["NOTICE", `unsupported message type: ${String(type)}`]);
    }
  }

  private handleEventMessage(socket: WebSocket, value: unknown): void {
    const event = parseEvent(value);
    if (!event) {
      this.send(socket, ["OK", "", false, "invalid: malformed event"]);
      return;
    }
    if (this.events.has(event.id)) {
      this.send(socket, ["OK", event.id, true, "duplicate: event already stored"]);
      return;
    }
    this.events.set(event.id, event);
    this.evictOldEvents();
    this.send(socket, ["OK", event.id, true, ""]);
    this.log(`stored event ${event.id} (kind ${event.kind}, total ${this.events.size})`);
    this.broadcast(event);
  }

  private handleReqMessage(socket: WebSocket, payload: unknown[]): void {
    const subscriptionId = payload[0];
    if (typeof subscriptionId !== "string" || subscriptionId.length === 0) {
      this.send(socket, ["NOTICE", "invalid REQ: subscription id must be a non-empty string"]);
      return;
    }
    const filters = payload
      .slice(1)
      .map((value) => parseFilter(value))
      .filter((filter): filter is NostrFilter => filter !== null);
    // A new REQ with an existing subscription id replaces the previous one (NIP-01).
    this.subscriptions.get(socket)?.set(subscriptionId, { filters });

    // Initial query: each filter's `limit` applies to that filter only, events
    // are deduplicated by id across filters and delivered in ascending
    // created_at order, followed by EOSE.
    const selected = new Map<string, NostrEvent>();
    for (const filter of filters) {
      for (const event of this.query(filter)) {
        if (!selected.has(event.id)) selected.set(event.id, event);
      }
    }
    const events = [...selected.values()].sort((a, b) => a.created_at - b.created_at);
    for (const event of events) this.send(socket, ["EVENT", subscriptionId, event]);
    this.send(socket, ["EOSE", subscriptionId]);
  }

  private handleCloseMessage(socket: WebSocket, subscriptionId: unknown): void {
    if (typeof subscriptionId !== "string") return;
    if (this.subscriptions.get(socket)?.delete(subscriptionId)) {
      this.log(`subscription ${subscriptionId} closed`);
    }
  }

  /** All stored events matching one filter, newest first, truncated to `filter.limit`. */
  private query(filter: NostrFilter): NostrEvent[] {
    const matched: NostrEvent[] = [];
    for (const event of this.events.values()) {
      if (eventMatchesFilter(event, filter)) matched.push(event);
    }
    matched.sort((a, b) => b.created_at - a.created_at);
    return filter.limit !== undefined && filter.limit >= 0
      ? matched.slice(0, filter.limit)
      : matched;
  }

  /** Forward a freshly stored event to every active subscription whose filters match. */
  private broadcast(event: NostrEvent): void {
    for (const [socket, subs] of this.subscriptions) {
      for (const [subscriptionId, subscription] of subs) {
        const matches = subscription.filters.some((filter) => eventMatchesFilter(event, filter));
        if (matches) this.send(socket, ["EVENT", subscriptionId, event]);
      }
    }
  }

  private evictOldEvents(): void {
    while (this.events.size > this.maxEvents) {
      const oldest = this.events.keys().next().value;
      if (oldest === undefined) break;
      this.events.delete(oldest);
    }
  }

  private send(socket: WebSocket, message: unknown[]): void {
    if (socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(message));
  }

  private log(message: string): void {
    console.log(`[nostr-relay] ${message}`);
  }
}

/** Convenience factory. */
export function startNostrCityRelay(options: NostrCityRelayOptions = {}): NostrCityRelay {
  return new NostrCityRelay(options);
}

function decodeRawData(data: RawData): string {
  if (Array.isArray(data)) return Buffer.concat(data).toString();
  if (data instanceof ArrayBuffer) return Buffer.from(data).toString();
  return data.toString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Structural validation only — no id-format or signature checks (dev relay). */
export function parseEvent(value: unknown): NostrEvent | null {
  if (!isRecord(value)) return null;
  if (!Array.isArray(value.tags)) return null;
  const tags: string[][] = [];
  for (const tag of value.tags) {
    if (!Array.isArray(tag) || !tag.every((item) => typeof item === "string")) return null;
    tags.push(tag);
  }
  if (typeof value.id !== "string" || value.id.length === 0) return null;
  if (typeof value.pubkey !== "string") return null;
  if (typeof value.created_at !== "number" || !Number.isFinite(value.created_at)) return null;
  if (typeof value.kind !== "number" || !Number.isInteger(value.kind)) return null;
  if (typeof value.content !== "string") return null;
  if (typeof value.sig !== "string") return null;
  return {
    id: value.id,
    pubkey: value.pubkey,
    created_at: value.created_at,
    kind: value.kind,
    tags,
    content: value.content,
    sig: value.sig,
  };
}

function parseStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  if (!value.every((item) => typeof item === "string")) return undefined;
  return value as string[];
}

function parseNumberArray(value: unknown): number[] | undefined {
  if (!Array.isArray(value)) return undefined;
  if (!value.every((item) => typeof item === "number" && Number.isFinite(item))) return undefined;
  return value as number[];
}

/**
 * Parse an unknown NIP-01 filter. Unknown fields are ignored for forward
 * compatibility. Returns null when a recognized field has the wrong type.
 */
export function parseFilter(value: unknown): NostrFilter | null {
  if (!isRecord(value)) return null;
  const filter: NostrFilter = {};
  if (value.ids !== undefined) {
    const ids = parseStringArray(value.ids);
    if (ids === undefined) return null;
    filter.ids = ids;
  }
  if (value.authors !== undefined) {
    const authors = parseStringArray(value.authors);
    if (authors === undefined) return null;
    filter.authors = authors;
  }
  if (value.kinds !== undefined) {
    const kinds = parseNumberArray(value.kinds);
    if (kinds === undefined) return null;
    filter.kinds = kinds;
  }
  if (value.since !== undefined) {
    if (typeof value.since !== "number" || !Number.isFinite(value.since)) return null;
    filter.since = value.since;
  }
  if (value.until !== undefined) {
    if (typeof value.until !== "number" || !Number.isFinite(value.until)) return null;
    filter.until = value.until;
  }
  if (value.limit !== undefined) {
    if (typeof value.limit !== "number" || !Number.isFinite(value.limit)) return null;
    filter.limit = value.limit;
  }
  for (const [key, raw] of Object.entries(value)) {
    if (!key.startsWith("#") || key.length < 2) continue;
    const values = parseStringArray(raw);
    if (values === undefined) continue;
    filter.tags = { ...(filter.tags ?? {}), [key.slice(1)]: values };
  }
  return filter;
}

/** Pure NIP-01 subset matcher (nostr-tools semantics: since is exclusive, until inclusive). */
export function eventMatchesFilter(event: NostrEvent, filter: NostrFilter): boolean {
  if (filter.ids !== undefined && !filter.ids.includes(event.id)) return false;
  if (filter.authors !== undefined && !filter.authors.includes(event.pubkey)) return false;
  if (filter.kinds !== undefined && !filter.kinds.includes(event.kind)) return false;
  if (filter.since !== undefined && event.created_at <= filter.since) return false;
  if (filter.until !== undefined && event.created_at > filter.until) return false;
  for (const [name, values] of Object.entries(filter.tags ?? {})) {
    const hasTag = event.tags.some(
      (tag) => tag.length >= 2 && tag[0] === name && values.includes(tag[1]),
    );
    if (!hasTag) return false;
  }
  return true;
}
