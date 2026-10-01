import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

type Step = "entry" | "upload" | "result";

export const CompanionScreen: React.FC = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>("entry");
  const [testText, setTestText] = useState("");
  const [isSafe, setIsSafe] = useState(true);

  const handleStart = () => {
    setStep("upload");
  };

  const handleSubmit = () => {
    if (!testText.trim()) return;
    // Basic detection: if contains positive keywords
    const lower = testText.toLowerCase();
    const hasPositive =
      lower.includes("positive") ||
      lower.includes("позитив") ||
      lower.includes("положительн") ||
      lower.includes("виявлено") ||
      lower.includes("обнаружен");
    setIsSafe(!hasPositive);
    setStep("result");
  };

  const handleReset = () => {
    setTestText("");
    setStep("entry");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {step === "entry" && (
        <View style={styles.card}>
          <Text style={styles.icon}>🛡️</Text>
          <Text style={styles.title}>{t("companion.title")}</Text>
          <Text style={styles.description}>{t("companion.intro")}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleStart}>
            <Text style={styles.primaryButtonText}>{t("companion.startButton")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === "upload" && (
        <View style={styles.card}>
          <Text style={styles.title}>{t("companion.uploadPrompt")}</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={6}
            placeholder="HIV: Negative&#10;Syphilis: Negative..."
            placeholderTextColor="#64748b"
            value={testText}
            onChangeText={setTestText}
          />
          <TouchableOpacity
            style={[styles.primaryButton, !testText.trim() && styles.disabledButton]}
            disabled={!testText.trim()}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryButtonText}>{t("companion.uploadButton")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleReset}>
            <Text style={styles.secondaryButtonText}>← {t("companion.title")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === "result" && (
        <View style={styles.card}>
          <View style={[styles.badgeCircle, isSafe ? styles.badgeSafe : styles.badgeRisk]}>
            <Text style={styles.badgeIcon}>{isSafe ? "✓" : "!"}</Text>
          </View>
          <Text style={styles.title}>{t("companion.result.title")}</Text>
          <View style={[styles.statusPill, isSafe ? styles.pillSafe : styles.pillRisk]}>
            <Text
              style={[styles.statusText, isSafe ? styles.statusSafeText : styles.statusRiskText]}
            >
              {isSafe ? t("companion.result.safe") : t("companion.result.risk")}
            </Text>
          </View>
          <Text style={styles.description}>{t("companion.result.description")}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleReset}>
            <Text style={styles.primaryButtonText}>{t("companion.startButton")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f8fafc",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    width: "100%",
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#94a3b8",
    fontSize: 14,
  },
  textInput: {
    width: "100%",
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    padding: 12,
    color: "#f8fafc",
    textAlignVertical: "top",
    minHeight: 120,
    marginBottom: 16,
  },
  badgeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 2,
  },
  badgeSafe: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    borderColor: "#22c55e",
  },
  badgeRisk: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "#ef4444",
  },
  badgeIcon: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f8fafc",
  },
  statusPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
    borderWidth: 1,
  },
  pillSafe: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  pillRisk: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusSafeText: {
    color: "#4ade80",
  },
  statusRiskText: {
    color: "#f87171",
  },
});

export default CompanionScreen;
