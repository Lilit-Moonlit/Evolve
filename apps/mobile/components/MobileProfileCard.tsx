import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

interface MobileProfileCardProps {
  name: string;
  age?: number;
  location?: string;
  bio?: string;
  avatar?: string;
  onConnect?: () => void;
  onViewProfile?: () => void;
}

export function MobileProfileCard({
  name,
  age,
  location,
  bio,
  avatar,
  onConnect,
  onViewProfile,
}: MobileProfileCardProps) {
  return (
    <View style={styles.card}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarPlaceholderText}>{name.charAt(0)}</Text>
        </View>
      )}
      <Text style={styles.name}>
        {name}
        {age ? `, ${age}` : ""}
      </Text>
      {location && <Text style={styles.location}>📍 {location}</Text>}
      {bio && <Text style={styles.bio}>{bio}</Text>}
      <View style={styles.actions}>
        {onConnect && (
          <TouchableOpacity style={styles.primaryButton} onPress={onConnect}>
            <Text style={styles.buttonText}>Connect</Text>
          </TouchableOpacity>
        )}
        {onViewProfile && (
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={onViewProfile}
          >
            <Text style={styles.outlineButtonText}>View Profile</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarPlaceholderText: {
    fontSize: 36,
    color: "#6b7280",
    fontWeight: "600",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  outlineButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#2563eb",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  outlineButtonText: {
    color: "#2563eb",
    fontWeight: "600",
  },
});
