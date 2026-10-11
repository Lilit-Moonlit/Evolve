/**
 * chat-transport — P2P-first transport adapter for 1:1 chat.
 *
 * Primary transport: `@evolve/p2p` `ChatManager` (libp2p gossipsub, plus the
 * Nostr inbox when a real pubkey mapping exists). HTTP `/api/messages` is a
 * FALLBACK MIRROR only — Ban Resistance §23 rule 2 (chat must survive a central
 * API takedown) and DECENTRALIZED-SCALING §9 (P2P default; HTTP never primary).
 *
 * Design notes
 * ------------
 * - The heavy `@evolve/p2p` graph (libp2p + nostr-tools) is loaded through a
 *   DYNAMIC import inside the default bridge factory. It therefore never enters
 *   the main bundle and never loads in the jsdom unit-test process — tests inject
 *   a fake bridge instead.
 * - Sending tries P2P first; on success it opportunistically mirrors the message
 *   to the HTTP API (kept for clients/history that are not yet on P2P). If P2P
 *   is unavailable or fails, HTTP becomes the required path.
 * - Rich chat metadata (STD/DNA/PHOTO/LIVENESS/GIFT flags) cannot travel in a
 *   bare P2P `content` string, so the whole payload is JSON-encoded behind a
 *   marker and decoded on receipt. Non-marked content is treated as plain text.
 */

export type ChatRequestType = "STD" | "DNA" | "PHOTO" | "LIVENESS" | "GIFT";

/** Message payload shape — mirrors the `POST /api/messages` body exactly. */
export interface ChatTransportPayload {
  senderId: string;
  receiverId: string;
  text: string;
  time: string;
  isRequest?: boolean;
  requestType?: ChatRequestType;
  requestStatus?: "pending" | "approved" | "declined";
  photoGrantKind?: "temporary" | "permanent";
  photoAction?: "approve" | "deny" | "offer";
  giftKind?: "rose" | "cactus";
  giftMode?: "public" | "anon-except-recipient" | "anon";
  voucherPrivateKey?: string;
}

/** A message as returned by any transport (payload + transport id). */
export interface ChatTransportMessage extends ChatTransportPayload {
  id: string;
}

/** A single message held by the P2P bridge (in-memory chat history). */
export interface P2pHistoryEntry {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
}

/**
 * Minimal structural view of the pieces of `@evolve/p2p` we consume. Keeping it
 * structural (instead of importing the package types statically) keeps this
 * module dependency-free for tests while still type-checking the dynamic import.
 */
export interface P2pBridge {
  send(from: string, to: string, content: string): Promise<void>;
  onMessage(from: string, to: string, handler: (content: string) => void): void;
  offMessage(from: string, to: string): void;
  getHistory(from: string, to: string): P2pHistoryEntry[];
  stop(): Promise<void>;
}

export type P2pBridgeFactory = () => Promise<P2pBridge>;

export interface ChatTransportOptions {
  /** Injectable P2P bridge factory (defaults to the real `@evolve/p2p`). */
  bridgeFactory?: P2pBridgeFactory;
  /** `fetch` implementation for the HTTP fallback/mirror. */
  fetchImpl?: typeof fetch;
  /** Optional base URL for the HTTP API (default: same origin). */
  httpBase?: string;
  /** Mirror P2P sends to HTTP when the API is reachable (default: true). */
  mirrorToHttp?: boolean;
}

export interface ChatTransport {
  /** Sends a message P2P-first, falling back to HTTP. Returns the persisted message. */
  send(payload: ChatTransportPayload): Promise<ChatTransportMessage>;
  /** Subscribes to incoming P2P messages for a peer. Returns an unsubscribe fn. */
  subscribe(myId: string, peerId: string, cb: (msg: ChatTransportMessage) => void): () => void;
  /** Loads the conversation history (HTTP mirror merged with live P2P). */
  history(myId: string, peerId: string): Promise<ChatTransportMessage[]>;
  /** True once the P2P bridge has initialized successfully. */
  isP2pActive(): boolean;
  /** Tears down the P2P bridge (used on logout/tests). */
  dispose(): Promise<void>;
}

export const P2P_CONTENT_MARKER = "evolve-p2p/v1:";

/** Encodes a rich chat payload into a P2P `content` string. */
export function encodeChatPayload(payload: ChatTransportPayload): string {
  return P2P_CONTENT_MARKER + JSON.stringify(payload);
}

/** Decodes a P2P `content` string; returns null for plain (non-marked) text. */
export function decodeChatPayload(content: string): ChatTransportPayload | null {
  if (typeof content !== "string" || !content.startsWith(P2P_CONTENT_MARKER)) {
    return null;
  }
  try {
    const parsed = JSON.parse(content.slice(P2P_CONTENT_MARKER.length));
    if (parsed && typeof parsed === "object" && typeof parsed.senderId === "string") {
      return parsed as ChatTransportPayload;
    }
  } catch {
    /* malformed payload — treat as plain text */
  }
  return null;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

/** Normalizes an arbitrary server/bridge message into the transport shape. */
function normalizeMessage(
  raw: Record<string, unknown>,
  fallback: Partial<ChatTransportPayload>,
): ChatTransportMessage {
  const time =
    typeof raw.time === "string" && raw.time
      ? raw.time
      : typeof raw.timestamp === "string"
        ? formatTime(raw.timestamp)
        : typeof raw.timestamp === "number"
          ? formatTime(new Date(raw.timestamp).toISOString())
          : (fallback.time ?? "");

  return {
    id: String(raw.id ?? fallback.time ?? Date.now()),
    senderId: String(raw.senderId ?? fallback.senderId ?? ""),
    receiverId: String(raw.receiverId ?? fallback.receiverId ?? ""),
    text: String(raw.text ?? fallback.text ?? ""),
    time,
    isRequest: (raw.isRequest as boolean | undefined) ?? fallback.isRequest,
    requestType: (raw.requestType as ChatRequestType | undefined) ?? fallback.requestType,
    requestStatus:
      (raw.requestStatus as ChatTransportPayload["requestStatus"]) ?? fallback.requestStatus,
    photoGrantKind:
      (raw.photoGrantKind as ChatTransportPayload["photoGrantKind"]) ?? fallback.photoGrantKind,
    photoAction: (raw.photoAction as ChatTransportPayload["photoAction"]) ?? fallback.photoAction,
    giftKind: (raw.giftKind as ChatTransportPayload["giftKind"]) ?? fallback.giftKind,
    giftMode: (raw.giftMode as ChatTransportPayload["giftMode"]) ?? fallback.giftMode,
    voucherPrivateKey: (raw.voucherPrivateKey as string | undefined) ?? fallback.voucherPrivateKey,
  };
}

/** Converts one P2P history entry into a transport message. */
function fromP2pHistory(entry: P2pHistoryEntry, myId: string): ChatTransportMessage {
  const decoded = decodeChatPayload(entry.content);
  if (decoded) {
    return { ...decoded, id: entry.id, senderId: entry.from, receiverId: entry.to };
  }
  return {
    id: entry.id,
    senderId: entry.from,
    receiverId: entry.to,
    text: entry.content,
    time: formatTime(new Date(entry.timestamp).toISOString()),
  };
}

/** Dedupe key that collapses an HTTP mirror copy of a P2P message. */
function dedupeKey(m: ChatTransportMessage): string {
  return [m.senderId, m.receiverId, m.text, m.time, m.requestType ?? ""].join("|");
}

/** Merges two history lists, HTTP first (canonical ids), dropping duplicates. */
export function mergeHistory(
  primary: ChatTransportMessage[],
  secondary: ChatTransportMessage[],
): ChatTransportMessage[] {
  const seen = new Set<string>();
  const out: ChatTransportMessage[] = [];
  for (const m of [...primary, ...secondary]) {
    const key = dedupeKey(m);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(m);
  }
  return out;
}

/**
 * Structural view of the parts of `@evolve/p2p` we consume. A structural
 * interface (rather than a static `import type`) keeps this module decoupled
 * from the p2p workspace at build time.
 */
interface P2pChatManager {
  initialize(): Promise<void>;
  stop(): Promise<void>;
  sendMessage(from: string, to: string, content: string, encrypted?: boolean): Promise<unknown>;
  onMessage(a: string, b: string, cb: (m: { content: string }) => void): void;
  offMessage(a: string, b: string): void;
  getChat(
    a: string,
    b: string,
  ): {
    messages: { id: string; from: string; to: string; content: string; timestamp: number }[];
  } | null;
}
interface P2pModule {
  ChatManager: new (config?: unknown, logger?: unknown) => P2pChatManager;
}

/**
 * Real P2P bridge backed by `@evolve/p2p` `ChatManager`.
 *
 * The module is loaded with a STATIC specifier (`import("@evolve/p2p")`) so
 * Vite resolves and bundles the `@evolve/p2p` graph — this is what makes the
 * P2P runtime active. The `@evolve/p2p` entry is browser-pure (WebSockets +
 * Noise + yamux + gossipsub; no Node-only transports) and its dependency tree is
 * a coherent `libp2p@3.3.12` set. If the graph ever fails to load (e.g. libp2p
 * unavailable), the adapter rejects and falls back to HTTP.
 *
 * NOTE: chat participants here are application userIds. `ChatManager.sendMessage`
 * routes over a single shared gossipsub topic (`evolve-chat`) using the from/to
 * fields in the payload, so userId addressing works for the libp2p path. Nostr
 * NIP-04 DMs require real secp256k1 pubkeys; since userIds are not pubkeys, the
 * Nostr path is disabled by default (it would throw and abort every send).
 */
export async function defaultP2pBridgeFactory(): Promise<P2pBridge> {
  const mod = (await import("@evolve/p2p")) as P2pModule;

  const bootstrapPeers = (import.meta.env?.VITE_P2P_BOOTSTRAP_PEERS as string | undefined)
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const manager = new mod.ChatManager({
    useLibp2p: true,
    // userIds are not Nostr pubkeys → NIP-04 publish would throw and abort the
    // whole send. Nostr stays off until a userId↔pubkey mapping exists.
    useNostr: false,
    libp2pConfig: {
      enableDHT: false, // DHT is unreliable in browsers
      enableGossipsub: true,
      // Browsers are dial-only — empty listen addresses. The shared bootstrap
      // node (relay) provides the gossipsub mesh via VITE_P2P_BOOTSTRAP_PEERS.
      listenAddresses: [],
      ...(bootstrapPeers && bootstrapPeers.length > 0 ? { bootstrapPeers } : {}),
    },
    heartbeat: { enabled: true, interval: 30000, timeout: 90000 },
    peerDiscovery: { enabled: true, peerTimeout: 120000 },
  });

  await manager.initialize();

  return {
    send: async (from, to, content) => {
      await manager.sendMessage(from, to, content);
    },
    onMessage: (from, to, handler) => {
      manager.onMessage(from, to, (m) => handler(m.content));
    },
    offMessage: (from, to) => {
      manager.offMessage(from, to);
    },
    getHistory: (from, to) => {
      const chat = manager.getChat(from, to);
      const messages = chat?.messages ?? [];
      return messages.map((m) => ({
        id: m.id,
        from: m.from,
        to: m.to,
        content: m.content,
        timestamp: m.timestamp,
      }));
    },
    stop: () => manager.stop(),
  };
}

/**
 * Creates a P2P-first chat transport. All heavy dependencies are injected so the
 * adapter is fully unit-testable in jsdom.
 */
export function createChatTransport(opts: ChatTransportOptions = {}): ChatTransport {
  const factory = opts.bridgeFactory ?? defaultP2pBridgeFactory;
  const fetchImpl =
    opts.fetchImpl ?? (typeof fetch !== "undefined" ? fetch.bind(globalThis) : undefined);
  const httpBase = opts.httpBase ?? "";
  const mirrorToHttp = opts.mirrorToHttp !== false;

  let bridge: P2pBridge | null = null;
  let bridgePromise: Promise<P2pBridge | null> | null = null;
  let disposed = false;

  const ensureBridge = async (): Promise<P2pBridge | null> => {
    if (disposed) return null;
    if (bridge) return bridge;
    if (!bridgePromise) {
      bridgePromise = factory()
        .then((b) => {
          if (disposed) return null;
          bridge = b;
          return b;
        })
        .catch((err) => {
          console.warn("[chat-transport] P2P unavailable — HTTP fallback active", err);
          return null;
        });
    }
    return bridgePromise;
  };

  const httpPost = async (payload: ChatTransportPayload): Promise<ChatTransportMessage> => {
    if (!fetchImpl) throw new Error("chat-transport: no fetch implementation");
    const res = await fetchImpl(`${httpBase}/api/messages`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`chat-transport: HTTP ${res.status}`);
    const saved = (await res.json()) as Record<string, unknown>;
    return normalizeMessage(saved, payload);
  };

  const httpHistory = async (myId: string, peerId: string): Promise<ChatTransportMessage[]> => {
    if (!fetchImpl) return [];
    const res = await fetchImpl(
      `${httpBase}/api/messages?senderId=${encodeURIComponent(myId)}&receiverId=${encodeURIComponent(peerId)}`,
      { credentials: "include" },
    );
    if (!res.ok) throw new Error(`chat-transport: HTTP ${res.status}`);
    const data = (await res.json()) as unknown;
    const list = Array.isArray(data) ? data : [];
    return list.map((m) => normalizeMessage(m as Record<string, unknown>, { senderId: myId }));
  };

  return {
    async send(payload) {
      const b = await ensureBridge();
      if (b) {
        try {
          await b.send(payload.senderId, payload.receiverId, encodeChatPayload(payload));
          if (mirrorToHttp) {
            // Fire-and-forget mirror: a stopped/absent API must not block P2P.
            void httpPost(payload).catch(() => undefined);
          }
          return { id: `p2p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ...payload };
        } catch (err) {
          console.warn("[chat-transport] P2P send failed — using HTTP fallback", err);
        }
      }
      return httpPost(payload);
    },

    subscribe(myId, peerId, cb) {
      let unsub: (() => void) | null = null;
      let localDisposed = false;
      void ensureBridge().then((b) => {
        if (!b || localDisposed) return;
        b.onMessage(myId, peerId, (content) => {
          const decoded = decodeChatPayload(content);
          if (decoded) {
            cb({
              ...decoded,
              id: `p2p-in-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            });
          } else {
            cb({
              id: `p2p-in-${Date.now()}`,
              senderId: peerId,
              receiverId: myId,
              text: content,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            });
          }
        });
        unsub = () => b.offMessage(myId, peerId);
      });

      return () => {
        localDisposed = true;
        unsub?.();
      };
    },

    async history(myId, peerId) {
      const b = await ensureBridge();
      let httpList: ChatTransportMessage[] = [];
      try {
        httpList = await httpHistory(myId, peerId);
      } catch {
        httpList = [];
      }
      if (b) {
        const p2pList = b.getHistory(myId, peerId).map((e) => fromP2pHistory(e, myId));
        return mergeHistory(httpList, p2pList);
      }
      return httpList;
    },

    isP2pActive() {
      return bridge !== null;
    },

    async dispose() {
      disposed = true;
      const b = bridge;
      bridge = null;
      bridgePromise = null;
      if (b) {
        try {
          await b.stop();
        } catch {
          /* best-effort teardown */
        }
      }
    },
  };
}

let singleton: ChatTransport | null = null;

/** Process-wide transport (one app instance = one P2P node). */
export function getChatTransport(): ChatTransport {
  if (!singleton) singleton = createChatTransport();
  return singleton;
}

/** Overrides the singleton (used by tests); pass null to reset. */
export function setChatTransport(transport: ChatTransport | null): void {
  singleton = transport;
}
