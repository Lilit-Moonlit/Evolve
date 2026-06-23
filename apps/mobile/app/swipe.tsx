import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export default function Swipe() {
  const router = useRouter();
  const { t } = useTranslation();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        setPosition({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 100) {
          // Swipe right - like
          setPosition({ x: 0, y: 0 });
        } else if (gesture.dx < -100) {
          // Swipe left - pass
          setPosition({ x: 0, y: 0 });
        } else {
          // Reset position
          setPosition({ x: 0, y: 0 });
        }
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("swipe.title")}</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.cardImage}>
            <Text style={styles.cardImageText}>{t("swipe.photo")}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>Alice, 28</Text>
            <Text style={styles.cardBio}>
              Looking for meaningful connections
            </Text>
          </View>
        </View>

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
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.tabText}>{t("navigation.home")}</Text>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    height: 500,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  cardImage: {
    flex: 2,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  cardImageText: {
    fontSize: 18,
    color: "#999",
  },
  cardInfo: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  cardName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardBio: {
    fontSize: 16,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    gap: 20,
    marginTop: 40,
  },
  passButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
  },
  likeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#34c759",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 32,
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
});
