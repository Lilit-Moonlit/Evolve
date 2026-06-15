import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has completed onboarding
    // For now, redirect to onboarding
    setTimeout(() => {
      router.replace("/onboarding");
    }, 1000);
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 20 }}>Loading Evolve...</Text>
    </View>
  );
}
