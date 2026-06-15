import { View, Text, StyleSheet, Image } from "react-native";

interface MobileChatMessageProps {
  message: string;
  isOwn: boolean;
  timestamp?: Date;
  avatar?: string;
}

export function MobileChatMessage({
  message,
  isOwn,
  timestamp,
  avatar,
}: MobileChatMessageProps) {
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <View
      style={[
        styles.container,
        isOwn ? styles.ownContainer : styles.otherContainer,
      ]}
    >
      <View
        style={[
          styles.wrapper,
          isOwn ? styles.ownWrapper : styles.otherWrapper,
        ]}
      >
        {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
        <View
          style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}
        >
          <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
            {message}
          </Text>
          {timestamp && (
            <Text
              style={[
                styles.timestamp,
                isOwn ? styles.ownTimestamp : styles.otherTimestamp,
              ]}
            >
              {formatTime(timestamp)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  ownContainer: {
    alignItems: "flex-end",
  },
  otherContainer: {
    alignItems: "flex-start",
  },
  wrapper: {
    flexDirection: "row",
    maxWidth: "70%",
    gap: 8,
  },
  ownWrapper: {
    flexDirection: "row-reverse",
  },
  otherWrapper: {
    flexDirection: "row",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  bubble: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  ownBubble: {
    backgroundColor: "#2563eb",
  },
  otherBubble: {
    backgroundColor: "#f3f4f6",
  },
  messageText: {
    fontSize: 14,
    color: "#111827",
  },
  ownMessageText: {
    color: "#fff",
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  ownTimestamp: {
    color: "#bfdbfe",
  },
  otherTimestamp: {
    color: "#6b7280",
  },
});
