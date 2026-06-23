import React from "react";

export interface ChatMessageProps {
  message: string;
  isOwn: boolean;
  timestamp?: Date;
  avatar?: string;
}

export function ChatMessage({
  message,
  isOwn,
  timestamp,
  avatar,
}: ChatMessageProps) {
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`flex mb-4 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[70%] gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
      >
        {avatar && (
          <img
            src={avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        )}
        <div
          className={`rounded-lg px-4 py-2 ${
            isOwn
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-gray-100 text-gray-900 rounded-bl-sm"
          }`}
        >
          <p className="text-sm">{message}</p>
          {timestamp && (
            <p
              className={`text-xs mt-1 ${isOwn ? "text-blue-200" : "text-gray-500"}`}
            >
              {formatTime(timestamp)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
