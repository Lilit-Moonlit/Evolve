import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../store/AuthContext";
import { useApp } from "../store/AppContext";
import { MobileButton } from "../components/MobileButton";
import { MobileProfileStakingCard } from "../components/MobileProfileStakingCard";
import { MobileVerificationBadge } from "../components/MobileVerificationBadge";
import { MobileModeSelector } from "../components/MobileModeSelector";

export default function Profile() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { profiles, documents } = useApp();

  const stdUploaded = documents.some((d) => d.type === "STD");
  const dnaUploaded = documents.some((d) => d.type === "DNA");

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
        <Text style={styles.headerTitle}>{t("navigation.profile")}</Text>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Text style={styles.settingsButton}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.name}>
            {user?.email || user?.phoneNumber || "User"}
          </Text>
          <Text style={styles.bio}>Decentralized dating enthusiast</Text>
          {stdUploaded && (
            <MobileVerificationBadge type="std" showLabel size="md" />
          )}
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profiles.length}</Text>
            <Text style={styles.statLabel}>{t("navigation.swipe")}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>{t("navigation.messages")}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {stdUploaded || dnaUploaded ? "100%" : "0%"}
            </Text>
            <Text style={styles.statLabel}>Reputation</Text>
          </View>
        </View>

        <MobileProfileStakingCard
          stakedAmount="0"
          stakingPeriod="0 days"
          style={styles.stakingCard}
        />

        <MobileButton
          onPress={() => router.push("/settings")}
          style={styles.editButton}
        >
          {t("navigation.settings")}
        </MobileButton>

        <MobileModeSelector
          defaultMode="normal"
          onModeChange={(mode) => console.log("Mode changed:", mode)}
          style={styles.modeSelector}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("navigation.settings")}</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Wallet</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Privacy</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Documents</Text>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t("auth.logout")}</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.tabText}>{t("navigation.swipe")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/chat")}
        >
          <Text style={styles.tabText}>{t("navigation.messages")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={[styles.tabText, styles.activeTab]}>
            {t("navigation.profile")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  settingsButton: {
    fontSize: 24,
    color: "#007AFF",
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    padding: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  editButton: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  stakingCard: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  modeSelector: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
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
  settingArrow: {
    fontSize: 20,
    color: "#999",
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
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 10,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: "#999",
  },
  activeTab: {
    color: "#007AFF",
  },
});
