import { useEffect, useRef, useState, useCallback } from "react";
import { getChatTransport } from "./chat-transport";

export interface WsMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  /** Optional rich metadata — carried by the P2P transport, absent on WS. */
  isRequest?: boolean;
  requestType?: "STD" | "DNA" | "PHOTO" | "LIVENESS" | "GIFT";
  requestStatus?: "pending" | "approved" | "declined";
  photoGrantKind?: "temporary" | "permanent";
  photoAction?: "approve" | "deny" | "offer";
  giftKind?: "rose" | "cactus";
  giftMode?: "public" | "anon-except-recipient" | "anon";
  voucherPrivateKey?: string;
}

interface UseWebSocketOptions {
  userId: string;
  targetUserId: string;
  username?: string;
  onMessage?: (msg: WsMessage) => void;
  onTyping?: (userId: string, username: string) => void;
  onUserJoined?: (userId: string, username: string) => void;
  onUserLeft?: (userId: string, username: string) => void;
}

/**
 * Real-time 1:1 chat hook.
 *
 * Receive is P2P-FIRST: the `chat-transport` adapter subscribes to inbound
 * messages over libp2p gossipsub (DECENTRALIZED-SCALING §6.1). The WebSocket is
 * retained purely as a fallback/convenience path (§23 rule 2) — it still handles
 * typing indicators and legacy delivery when the P2P node is unavailable.
 *
 * Send-side is owned by `AppContext.addMessage` → `chat-transport`; this hook
 * only forwards typing over WS (best-effort) and never transmits chat messages.
 */
export function useWebSocket({
  userId,
  targetUserId,
  username,
  onMessage,
  onTyping,
  onUserJoined,
  onUserLeft,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // Keep the latest callback without re-subscribing the P2P transport on every
  // render (the callback identity changes frequently in Chat.tsx).
  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    // No counterpart selected (e.g. the local chat view is active): the
    // server would reject the join and we would reconnect-loop. Stay idle.
    if (!userId || !targetUserId) {
      setIsConnected(false);
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(
        JSON.stringify({
          type: "join",
          userId,
          targetUserId,
          username: username || "Anonymous",
        }),
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "message":
            onMessageRef.current?.({
              id: data.id,
              senderId: data.senderId,
              senderName: data.senderName,
              text: data.text,
              timestamp: data.timestamp,
            });
            break;
          case "typing":
            onTyping?.(data.userId, data.username);
            break;
          case "user_joined":
            setOnlineUsers((prev) => new Set(prev).add(data.userId));
            onUserJoined?.(data.userId, data.username);
            break;
          case "user_left":
            setOnlineUsers((prev) => {
              const next = new Set(prev);
              next.delete(data.userId);
              return next;
            });
            onUserLeft?.(data.userId, data.username);
            break;
          case "joined":
            break;
        }
      } catch (e) {
        console.error("WS parse error:", e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setTimeout(() => connect(), 3000); // auto-reconnect
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [userId, targetUserId, username, onTyping, onUserJoined, onUserLeft]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  // P2P-first receive: subscribe to inbound messages for this peer. Inert until
  // a counterpart is selected, so it never spins up the node while idle.
  useEffect(() => {
    if (!userId || !targetUserId) return;
    const unsubscribe = getChatTransport().subscribe(userId, targetUserId, (m) => {
      if (m.senderId === userId) return; // ignore our own echo
      onMessageRef.current?.({
        id: m.id,
        senderId: m.senderId,
        senderName: "",
        text: m.text,
        timestamp: m.time,
        isRequest: m.isRequest,
        requestType: m.requestType,
        requestStatus: m.requestStatus,
        photoGrantKind: m.photoGrantKind,
        photoAction: m.photoAction,
        giftKind: m.giftKind,
        giftMode: m.giftMode,
        voucherPrivateKey: m.voucherPrivateKey,
      });
    });
    return unsubscribe;
  }, [userId, targetUserId]);

  const sendMessage = useCallback(
    (text: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "message",
            text,
            targetUserId,
          }),
        );
      }
    },
    [targetUserId],
  );

  const sendTyping = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "typing" }));
    }
  }, []);

  return {
    isConnected,
    onlineUsers,
    sendMessage,
    sendTyping,
  };
}
