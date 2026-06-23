import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";

interface MobileProfileStakingCardProps {
  stakedAmount?: string;
  stakingPeriod?: string;
  style?: ViewStyle;
}

export function MobileProfileStakingCard({
  stakedAmount = "1,000",
  stakingPeriod = "30 days",
  style,
}: MobileProfileStakingCardProps) {
  const { t } = useTranslation();
  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("staking.title")}</Text>
        <View style={styles.infoCircle}>
          <Text style={styles.infoIcon}>i</Text>
        </View>
      </View>
      <Text style={styles.amount}>{stakedAmount}</Text>
      <Text style={styles.tokenLabel}>{t("staking.tokenLabel")}</Text>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>{t("staking.period")}</Text>
        <Text style={styles.value}>{stakingPeriod}</Text>
      </View>
      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>{t("staking.status")}</Text>
        <View style={styles.statusRow}>
          <View style={styles.greenDot} />
          <Text style={styles.statusText}>{t("staking.active")}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#7c3aed",
    borderRadius: 16,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  infoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  tokenLabel: {
    fontSize: 14,
    color: "#c4b5fd",
    marginBottom: 16,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#c4b5fd",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  statusBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    color: "#c4b5fd",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34d399",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
});
