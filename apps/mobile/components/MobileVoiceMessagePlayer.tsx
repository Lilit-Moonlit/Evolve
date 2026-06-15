import { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

interface MobileVoiceMessagePlayerProps {
  audioUrl?: string;
  duration?: number;
}

export function MobileVoiceMessagePlayer({
  audioUrl,
  duration = 30,
}: MobileVoiceMessagePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={togglePlay}
        style={styles.playButton}
        disabled={!audioUrl}
      >
        <Text style={styles.playIcon}>{isPlaying ? "⏸" : "▶"}</Text>
      </TouchableOpacity>
      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: isPlaying ? "60%" : "0%" }]}
        />
      </View>
      <Text style={styles.duration}>{formatTime(duration)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    color: "#fff",
    fontSize: 14,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#d1d5db",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 2,
  },
  duration: {
    fontSize: 12,
    color: "#6b7280",
    fontVariant: ["tabular-nums"],
  },
});
