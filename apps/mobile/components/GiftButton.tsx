import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

interface GiftButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export function GiftButton({ onPress, disabled = false }: GiftButtonProps) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.icon}>🎁</Text>
      <Text style={styles.text}>{t("gift.sendGift")}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    fontSize: 20,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
