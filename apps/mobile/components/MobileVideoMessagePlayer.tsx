import { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

interface MobileVideoMessagePlayerProps {
  videoUrl?: string;
  thumbnailUrl?: string;
}

export function MobileVideoMessagePlayer({
  videoUrl,
  thumbnailUrl,
}: MobileVideoMessagePlayerProps) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoUrl) return;
    setIsPlaying((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <View style={styles.thumbnail}>
        <Text style={styles.thumbnailIcon}>🎬</Text>
        <TouchableOpacity
          onPress={togglePlay}
          style={styles.playOverlay}
          disabled={!videoUrl}
        >
          <Text style={styles.playIcon}>{isPlaying ? "⏸" : "▶"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.status}>
        {isPlaying ? t("video.playing") : t("video.tapToPlay")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1f2937",
  },
  thumbnail: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#374151",
  },
  thumbnailIcon: {
    fontSize: 48,
  },
  playOverlay: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(37,99,235,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    color: "#fff",
    fontSize: 20,
  },
  status: {
    color: "#9ca3af",
    fontSize: 12,
    textAlign: "center",
    paddingVertical: 8,
  },
});
