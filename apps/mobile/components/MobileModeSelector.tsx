import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SearchMode = "normal" | "pregnancy-bond" | "cryptic-choice";

interface MobileModeSelectorProps {
  onModeChange?: (mode: SearchMode) => void;
  defaultMode?: SearchMode;
  style?: ViewStyle;
}

const modeConfig: Record<SearchMode, { icon: string; color: string }> = {
  normal: {
    icon: "💜",
    color: "#8b5cf6",
  },
  "pregnancy-bond": {
    icon: "🤰",
    color: "#ec4899",
  },
  "cryptic-choice": {
    icon: "🎭",
    color: "#6366f1",
  },
};

const MODE_STORAGE_KEY = "evolve_auth_mode";

export function MobileModeSelector({
  onModeChange,
  defaultMode = "normal",
  style,
}: MobileModeSelectorProps) {
  const { t } = useTranslation();
  const [selectedMode, setSelectedMode] = useState<SearchMode>(defaultMode);

  useEffect(() => {
    loadMode();
  }, []);

  const loadMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(MODE_STORAGE_KEY);
      if (savedMode) {
        setSelectedMode(savedMode as SearchMode);
      }
    } catch (error) {
      console.error("Failed to load mode:", error);
    }
  };

  const handleModeChange = (mode: SearchMode) => {
    setSelectedMode(mode);
    saveMode(mode);
    onModeChange?.(mode);
  };

  const saveMode = async (mode: SearchMode) => {
    try {
      await AsyncStorage.setItem(MODE_STORAGE_KEY, mode);
    } catch (error) {
      console.error("Failed to save mode:", error);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{t("auth.modeSelector.title")}</Text>
      {(Object.keys(modeConfig) as SearchMode[]).map((mode) => {
        const config = modeConfig[mode];
        const isSelected = selectedMode === mode;
        return (
          <TouchableOpacity
            key={mode}
            onPress={() => handleModeChange(mode)}
            style={[
              styles.card,
              isSelected && { backgroundColor: config.color },
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={styles.icon}>{config.icon}</Text>
              <View style={styles.textBlock}>
                <Text
                  style={[styles.modeLabel, isSelected && styles.selectedText]}
                >
                  {t("auth.modeSelector." + mode + ".label")}
                </Text>
                <Text
                  style={[styles.modeDesc, isSelected && styles.selectedDesc]}
                >
                  {t("auth.modeSelector." + mode + ".description")}
                </Text>
              </View>
            </View>
            {isSelected && (
              <View style={[styles.check, { borderColor: config.color }]}>
                <Text style={[styles.checkMark, { color: config.color }]}>
                  ✓
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
      <Text style={styles.footer}>
        {t("auth.modeSelector.currentMode", {
          mode: t("auth.modeSelector." + selectedMode + ".label"),
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    fontSize: 24,
  },
  textBlock: {
    flexShrink: 1,
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  modeDesc: {
    fontSize: 13,
    color: "#6b7280",
  },
  selectedText: {
    color: "#fff",
  },
  selectedDesc: {
    color: "rgba(255,255,255,0.8)",
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkMark: {
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    textAlign: "center",
    fontSize: 13,
    color: "#6b7280",
  },
  footerMode: {
    fontWeight: "600",
    color: "#111827",
  },
});
