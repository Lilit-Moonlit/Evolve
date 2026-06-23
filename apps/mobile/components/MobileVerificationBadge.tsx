import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

type VerificationType = "std" | "genetic";

interface MobileVerificationBadgeProps {
  type: VerificationType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const sizeMap = { sm: 20, md: 24, lg: 32 };
const iconSizeMap = { sm: 12, md: 14, lg: 16 };
const labelSizeMap = { sm: 12, md: 14, lg: 16 };

export function MobileVerificationBadge({
  type,
  size = "md",
  showLabel = false,
}: MobileVerificationBadgeProps) {
  const { t } = useTranslation();
  const isStd = type === "std";
  const badgeSize = sizeMap[size];
  const iconSz = iconSizeMap[size];
  const labelSz = labelSizeMap[size];
  const bgColor = isStd ? "#10b981" : "#8b5cf6";
  const textColor = isStd ? "#059669" : "#7c3aed";
  const icon = isStd ? "🛡" : "🧬";
  const label = isStd ? t("verification.std") : t("verification.dna");

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badge,
          { width: badgeSize, height: badgeSize, backgroundColor: bgColor },
        ]}
      >
        <Text style={[styles.icon, { fontSize: iconSz }]}>{icon}</Text>
      </View>
      {showLabel && (
        <Text style={[styles.label, { fontSize: labelSz, color: textColor }]}>
          {label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badge: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    color: "#fff",
    fontWeight: "bold",
  },
  label: {
    fontWeight: "600",
  },
});
