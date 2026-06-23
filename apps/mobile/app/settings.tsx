import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../store/AuthContext";
import { MobileModeSelector } from "../components/MobileModeSelector";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { formatEther } from "viem";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getPrivacyLevel,
  setPrivacyLevel,
  PrivacyLevel,
  PRIVACY_LEVELS,
} from "../lib/privacy";

export default function Settings() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [privacyLevel, setPrivacyLevelState] = useState<PrivacyLevel>(1);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  useEffect(() => {
    loadPrivacyLevel();
    loadNotificationSettings();
  }, []);

  const loadPrivacyLevel = async () => {
    const level = await getPrivacyLevel();
    setPrivacyLevelState(level);
  };

  const loadNotificationSettings = async () => {
    const enabled = await AsyncStorage.getItem("evolve_notifications");
    setNotificationsEnabled(enabled === "true");
  };

  const handlePrivacyLevelChange = async (level: PrivacyLevel) => {
    setPrivacyLevelState(level);
    await setPrivacyLevel(level);
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem("evolve_notifications", value.toString());
    // TODO: Request notification permissions and register for push notifications
    if (value) {
      Alert.alert(t("notifications.title"), t("notifications.enable"), [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.ok"),
          onPress: () => {
            // Request notification permissions here
          },
        },
      ]);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/auth");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("navigation.settings")}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.datingMode")}</Text>
          <Text style={styles.sectionDescription}>
            {t("settings.currentMode")}
          </Text>
          <MobileModeSelector
            defaultMode="normal"
            onModeChange={(mode) => console.log("Mode changed:", mode)}
            style={styles.modeSelector}
          />
          <Text style={styles.autoSaved}>{t("settings.autoSaved")}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("language.select")}</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              router.push("/language-selector"); // Navigate to a new screen/modal for language selection
            }}
          >
            <Text style={styles.settingText}>{t("settings.language")}</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.privacy")}</Text>
          {[1, 2, 3].map((level) => (
            <TouchableOpacity
              key={level}
              style={styles.privacyOption}
              onPress={() => handlePrivacyLevelChange(level as PrivacyLevel)}
            >
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radio,
                    privacyLevel === level && {
                      backgroundColor:
                        PRIVACY_LEVELS[level as PrivacyLevel].color,
                      borderColor: PRIVACY_LEVELS[level as PrivacyLevel].color,
                    },
                  ]}
                >
                  {privacyLevel === level && (
                    <Text style={styles.radioCheck}>✓</Text>
                  )}
                </View>
                <View style={styles.privacyInfo}>
                  <Text style={styles.privacyName}>
                    {PRIVACY_LEVELS[level as PrivacyLevel].name}
                  </Text>
                  <Text style={styles.privacyDescription}>
                    {PRIVACY_LEVELS[level as PrivacyLevel].description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings.account")}</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              if (isConnected) {
                Alert.alert(
                  t("profile.wallet.title"),
                  `${t("profile.wallet.address")}: ${address}\n${t(
                    "profile.wallet.balance",
                  )}: ${balance ? formatEther(balance.value) : "0.0"} ETH`,
                  [
                    {
                      text: t("common.cancel"),
                      style: "cancel",
                    },
                    {
                      text: t("auth.logout"), // Assuming logout can be used for wallet disconnect
                      onPress: () => disconnect(),
                      style: "destructive",
                    },
                  ],
                );
              } else {
                router.push("/auth");
              }
            }}
          >
            <Text style={styles.settingText}>{t("settings.wallet")}</Text>
            {isConnected && address ? (
              <Text style={styles.connectedWalletText}>
                {address.slice(0, 6)}...{address.slice(-4)}
              </Text>
            ) : (
              <Text style={styles.settingArrow}>→</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {
              router.push("/documents");
            }}
          >
            <Text style={styles.settingText}>{t("settings.documents")}</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>
              {t("settings.notifications")}
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t("auth.logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  connectedWalletText: {
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    fontSize: 24,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  modeSelector: {
    marginBottom: 10,
  },
  autoSaved: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  settingText: {
    fontSize: 16,
  },
  connectedWalletText: {
    fontSize: 16,
    color: "#666",
  },
  settingArrow: {
    fontSize: 20,
    color: "#999",
  },
  privacyOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  radioCheck: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  privacyInfo: {
    flex: 1,
  },
  privacyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  privacyDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  logoutButton: {
    margin: 20,
    padding: 16,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
