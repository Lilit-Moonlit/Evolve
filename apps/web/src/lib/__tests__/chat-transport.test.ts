import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createChatTransport,
  encodeChatPayload,
  decodeChatPayload,
  mergeHistory,
  P2P_CONTENT_MARKER,
  type P2pBridge,
  type ChatTransportMessage,
} from "../chat-transport";

/** Minimal in-memory P2P bridge used to exercise the adapter without libp2p. */
function makeFakeBridge(): P2pBridge & {
  sent: { from: string; to: string; content: string }[];
  handlers: Map<string, (content: string) => void>;
  history: Map<string, ReturnType<P2pBridge["getHistory"]>>;
  failNextSend?: boolean;
} {
  const sent: { from: string; to: string; content: string }[] = [];
  const handlers = new Map<string, (content: string) => void>();
  const history = new Map<string, ReturnType<P2pBridge["getHistory"]>>();
  const key = (a: string, b: string) => [a, b].sort().join("|");
  return {
    sent,
    handlers,
    history,
    async send(from, to, content) {
      if (this.failNextSend) {
        this.failNextSend = false;
        throw new Error("bridge offline");
      }
      sent.push({ from, to, content });
    },
    onMessage(from, to, handler) {
      handlers.set(key(from, to), handler);
    },
    offMessage(from, to) {
      handlers.delete(key(from, to));
    },
    getHistory(from, to) {
      return history.get(key(from, to)) ?? [];
    },
    async stop() {
      /* no-op */
    },
  };
}

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as unknown as Response;
}

describe("chat-transport — payload codec", () => {
  it("round-trips a rich payload", () => {
    const payload = {
      senderId: "1",
      receiverId: "2",
      text: "hi",
      time: "10:00",
      requestType: "PHOTO" as const,
      photoGrantKind: "temporary" as const,
    };
    const encoded = encodeChatPayload(payload);
    expect(encoded.startsWith(P2P_CONTENT_MARKER)).toBe(true);
    expect(decodeChatPayload(encoded)).toEqual(payload);
  });

  it("returns null for plain text and malformed payloads", () => {
    expect(decodeChatPayload("just a message")).toBeNull();
    expect(decodeChatPayload(P2P_CONTENT_MARKER + "{not json")).toBeNull();
    expect(decodeChatPayload(P2P_CONTENT_MARKER + '{"noSender":true}')).toBeNull();
  });
});

describe("chat-transport — mergeHistory", () => {
  const msg = (over: Partial<ChatTransportMessage>): ChatTransportMessage => ({
    id: "x",
    senderId: "1",
    receiverId: "2",
    text: "t",
    time: "10:00",
    ...over,
  });

  it("drops duplicate mirror copies and keeps HTTP ids first", () => {
    const http = [msg({ id: "server-1", text: "a" })];
    const p2p = [msg({ id: "p2p-1", text: "a" }), msg({ id: "p2p-2", text: "b" })];
    const merged = mergeHistory(http, p2p);
    expect(merged.map((m) => m.id)).toEqual(["server-1", "p2p-2"]);
  });
});

describe("chat-transport — routing", () => {
  let bridge: ReturnType<typeof makeFakeBridge>;

  beforeEach(() => {
    bridge = makeFakeBridge();
  });

  it("starts with P2P inactive until the bridge initializes", async () => {
    const transport = createChatTransport({
      bridgeFactory: async () => bridge,
      fetchImpl: vi.fn(),
    });
    expect(transport.isP2pActive()).toBe(false);
    await transport.send({ senderId: "1", receiverId: "2", text: "x", time: "10:00" });
    expect(transport.isP2pActive()).toBe(true);
  });

  it("sends over P2P first and mirrors to HTTP when reachable", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ id: "server-1" }));
    const transport = createChatTransport({
      bridgeFactory: async () => bridge,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const out = await transport.send({ senderId: "1", receiverId: "2", text: "hi", time: "10:00" });

    expect(out.id.startsWith("p2p-")).toBe(true);
    expect(bridge.sent).toHaveLength(1);
    expect(decodeChatPayload(bridge.sent[0].content)?.text).toBe("hi");

    // Mirror is fire-and-forget — let the microtask flush.
    await new Promise((r) => setTimeout(r, 0));
    expect(fetchImpl).toHaveBeenCalledWith(
      "/api/messages",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("falls back to HTTP when the P2P bridge fails to initialize", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ id: "server-9", text: "hi" }));
    const transport = createChatTransport({
      bridgeFactory: async () => {
        throw new Error("no libp2p");
      },
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const out = await transport.send({ senderId: "1", receiverId: "2", text: "hi", time: "10:00" });

    expect(out.id).toBe("server-9");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(transport.isP2pActive()).toBe(false);
  });

  it("falls back to HTTP when the P2P send throws", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ id: "server-2", text: "hi" }));
    const transport = createChatTransport({
      bridgeFactory: async () => bridge,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    bridge.failNextSend = true;
    const out = await transport.send({ senderId: "1", receiverId: "2", text: "hi", time: "10:00" });

    expect(out.id).toBe("server-2");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("delivers decoded incoming P2P messages via subscribe", async () => {
    const transport = createChatTransport({
      bridgeFactory: async () => bridge,
      fetchImpl: vi.fn(),
    });
    const received: ChatTransportMessage[] = [];
    const unsub = transport.subscribe("1", "2", (m) => received.push(m));

    // Wait for the async bridge init + handler registration.
    await vi.waitFor(() => expect(bridge.handlers.size).toBe(1));

    const handler = [...bridge.handlers.values()][0];
    handler(encodeChatPayload({ senderId: "2", receiverId: "1", text: "hey", time: "11:00" }));
    expect(received).toHaveLength(1);
    expect(received[0].text).toBe("hey");
    expect(received[0].senderId).toBe("2");

    // Plain text (e.g. from an HTTP-origin peer) is still surfaced.
    handler("plain reply");
    expect(received[1].text).toBe("plain reply");

    unsub();
    expect(bridge.handlers.size).toBe(0);
  });

  it("merges HTTP history with live P2P history, deduping mirror copies", async () => {
    const p2pHistory = [
      {
        id: "p2p-1",
        from: "2",
        to: "1",
        content: encodeChatPayload({ senderId: "2", receiverId: "1", text: "a", time: "10:00" }),
        timestamp: Date.now(),
      },
      {
        id: "p2p-2",
        from: "1",
        to: "2",
        content: encodeChatPayload({ senderId: "1", receiverId: "2", text: "b", time: "10:01" }),
        timestamp: Date.now(),
      },
    ];
    bridge.history.set(["1", "2"].sort().join("|"), p2pHistory);

    const fetchImpl = vi.fn(async () =>
      jsonResponse([{ id: "server-1", senderId: "2", receiverId: "1", text: "a", time: "10:00" }]),
    );
    const transport = createChatTransport({
      bridgeFactory: async () => bridge,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const history = await transport.history("1", "2");
    // "a" appears in both → deduped; "b" is P2P-only.
    expect(history.map((m) => m.text).sort()).toEqual(["a", "b"]);
  });

  it("uses HTTP-only history when P2P is unavailable", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse([{ id: "server-1", senderId: "2", receiverId: "1", text: "a", time: "10:00" }]),
    );
    const transport = createChatTransport({
      bridgeFactory: async () => {
        throw new Error("down");
      },
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    const history = await transport.history("1", "2");
    expect(history.map((m) => m.text)).toEqual(["a"]);
  });
});
