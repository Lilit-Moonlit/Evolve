import { useEffect, useRef, useState, useCallback } from "react";

export interface WsMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
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

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({
        type: "join",
        userId,
        targetUserId,
        username: username || "Anonymous",
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "message":
            onMessage?.({
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
  }, [userId, targetUserId, username, onMessage, onTyping, onUserJoined, onUserLeft]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  const sendMessage = useCallback((text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "message",
        text,
        targetUserId,
      }));
    }
  }, [targetUserId]);

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