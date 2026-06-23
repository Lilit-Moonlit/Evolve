import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useApp } from "../store/AppContext";

export default function Chat() {
  const router = useRouter();
  const { t } = useTranslation();
  const { chats, loading } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("chat.title")}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>{t("chat.loading")}</Text>
        ) : chats.length === 0 ? (
          <Text style={styles.loadingText}>{t("chat.noMatches")}</Text>
        ) : (
          chats.map((chat) => (
            <TouchableOpacity key={chat.profile.userId} style={styles.chatItem}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{chat.profile.name[0]}</Text>
              </View>
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{chat.profile.name}</Text>
                <Text style={styles.chatMessage}>
                  {chat.lastMessage?.text || t("chat.selectChat")}
                </Text>
              </View>
              <Text style={styles.chatTime}>
                {chat.lastMessage?.time || ""}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.tabText}>{t("navigation.swipe")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={[styles.tabText, styles.activeTab]}>
            {t("navigation.messages")}
          </Text>
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
  loadingText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  chatMessage: {
    fontSize: 14,
    color: "#666",
  },
  chatTime: {
    fontSize: 12,
    color: "#999",
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
