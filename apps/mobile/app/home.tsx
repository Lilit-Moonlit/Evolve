import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useApp } from "../store/AppContext";
import { MobileProfileCard } from "../components/MobileProfileCard";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const { profiles, loading } = useApp();

  const currentProfile = profiles[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("app.name")}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{t("home.hero.title")}</Text>
        <Text style={styles.subtitle}>{t("home.hero.subtitle")}</Text>

        {loading ? (
          <Text style={styles.loadingText}>{t("home.loading")}</Text>
        ) : currentProfile ? (
          <MobileProfileCard
            name={currentProfile.name}
            age={currentProfile.age}
            location=""
            bio={currentProfile.bio}
            onConnect={() => {}}
            onViewProfile={() => router.push("/profile")}
          />
        ) : (
          <Text style={styles.loadingText}>{t("home.filters.noProfiles")}</Text>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.passButton}>
            <Text style={styles.buttonText}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.likeButton}>
            <Text style={styles.buttonText}>♥</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={[styles.tabText, styles.activeTab]}>
            {t("navigation.swipe")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/chat")}
        >
          <Text style={styles.tabText}>{t("navigation.messages")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.tabText}>{t("navigation.profile")}</Text>
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#999",
  },
  actions: {
    flexDirection: "row",
    gap: 20,
  },
  passButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#34c759",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 24,
    color: "#fff",
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
