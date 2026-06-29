import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../store/AuthContext";
import { useAccount, useBalance, useSendTransaction } from "wagmi";
import { CONTRACT_ADDRESSES } from "../lib/addresses";

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useAuth();

  const { address, isConnected } = useAccount();
  const [selectedNetwork, setSelectedNetwork] = useState<string>("arbitrumSepolia");
  const evolveAddress = CONTRACT_ADDRESSES[selectedNetwork]?.EVOLVE ?? "";

  // Отримуємо баланс EVOLVE токену
  const { data: evolveBalance, isLoading: balanceLoading } = useBalance({
    address,
    token: evolveAddress,
    watch: true,
  });

  // Стан транзакції (placeholder – реальна логіка буде залежати від вашого UI)
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "failed">(
    "idle"
  );

  // Приклад відправки транзакції (можна викликати з UI)
  const { sendTransaction, isLoading: txSending } = useSendTransaction({
    request: {
      to: evolveAddress,
      value: BigInt(0), // нульова ETH, лише для прикладу
    },
    onSuccess: () => setTxStatus("pending"),
    onSettled: (data, error) => {
      if (error) {
        setTxStatus("failed");
      } else {
        setTxStatus("success");
      }
    },
  });

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      router.replace("/home");
    } else {
      router.replace("/auth");
    }
  }, [isAuthenticated, loading, router]);

  // Показати індикатор завантаження, доки не визначено статус автентифікації
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.marginTop}>{t("app.loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Інформація про підключений гаманець */}
      {isConnected && address ? (
        <>
          <Text style={styles.label}>Wallet: {address}</Text>
          <Text style={styles.label}>
            {t("app.balance")} (EVOLVE):
            {balanceLoading
              ? " ..."
              : `${evolveBalance?.formatted ?? "0"} ${evolveBalance?.symbol ?? ""}`}
          </Text>
          <Text style={styles.label}>Tx status: {txStatus}</Text>
        </>
      ) : (
        <Text style={styles.label}>{t("app.connect_wallet_prompt")}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  marginTop: {
    marginTop: 20,
  },
});
