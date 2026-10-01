import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

function toMessage(message: Partial<Message> & { time?: string; createdAt?: string }): Message {
  return {
    id: message.id || `${message.senderId}-${message.timestamp || message.time}`,
    senderId: message.senderId || "",
    senderName: message.senderName || "",
    text: message.text || "",
    timestamp: message.timestamp || message.time || message.createdAt || new Date().toISOString(),
  };
}

export const Chat: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [myUserId, setMyUserId] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [userStatus, setUserStatus] = useState<"new" | "pending" | "previous">("new");
  const [testInfo, setTestInfo] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isLabChat = searchParams.get("as") === "lab";
    const labId = localStorage.getItem("lab_id");
    const myId = (isLabChat ? labId : localStorage.getItem("companion_user_id")) || "";
    const storedLabData = localStorage.getItem("lab_data");
    const labName = storedLabData ? JSON.parse(storedLabData).name : "";
    setMyUserId(myId);

    // Визначення статусу користувача (тільки для лабораторії)
    if (isLabChat && labId && userId) {
      // Перевіряємо чи є пацієнт у списку лабораторії
      const labPatients = JSON.parse(localStorage.getItem(`lab_${labId}_patients`) || "[]");
      const patient = labPatients.find((p: any) => p.id === userId);

      if (patient) {
        // Якщо є результати - спілкувались раніше
        if (patient.hasResult) {
          setUserStatus("previous");
          setTestInfo(patient.testInfo || "");
        } else {
          // Якщо немає результатів - в очікуванні
          setUserStatus("pending");
          setTestInfo(patient.testInfo || "");
        }
      } else {
        // Новий користувач
        setUserStatus("new");
        setTestInfo("");
      }
    }

    if (userId && myId) {
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        ws.send(
          JSON.stringify({
            type: "join",
            userId: myId,
            targetUserId: userId,
            username: isLabChat
              ? labName || t("companion.lab.profile")
              : t("companion.profile.title"),
          }),
        );
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "history") {
          setMessages((msg.messages || []).map(toMessage));
        } else if (msg.type === "message") {
          setMessages((prev) => {
            if (prev.some((message) => message.id === msg.id)) return prev;
            return [...prev, toMessage(msg)];
          });
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      return () => {
        ws.close();
      };
    }
  }, [searchParams, t, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !userId || !myUserId || !wsRef.current) return;

    wsRef.current.send(
      JSON.stringify({
        type: "message",
        userId: myUserId,
        targetUserId: userId,
        text: newMessage,
      }),
    );
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-6">
      <div className="max-w-2xl w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl flex flex-col h-[calc(100vh-3rem)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{t("companion.profile.chat")}</h1>
            {searchParams.get("as") === "lab" && (
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    userStatus === "new"
                      ? "bg-blue-500/20 text-blue-400"
                      : userStatus === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {userStatus === "new"
                    ? t("companion.chat.userStatus.new")
                    : userStatus === "pending"
                      ? t("companion.chat.userStatus.pending")
                      : t("companion.chat.userStatus.previous")}
                </span>
                {testInfo && userStatus === "pending" && (
                  <span className="text-xs text-slate-400">{testInfo}</span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${isConnected ? "text-green-400" : "text-red-400"}`}>
              {isConnected ? "●" : "○"}
            </span>
            <button
              onClick={() => navigate("/companion/search")}
              className="text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === myUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  message.senderId === myUserId
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-100"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t("chat.inputPlaceholder")}
            disabled={!isConnected}
            className="flex-1 px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
          >
            {t("chat.send")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
