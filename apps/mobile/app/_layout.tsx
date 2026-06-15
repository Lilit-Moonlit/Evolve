import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { WagmiProviderWrapper } from "../lib/wagmi";
import { AuthProvider } from "../store/AuthContext";
import { AppProvider } from "../store/AppContext";
import "../i18n/config";

export default function RootLayout() {
  return (
    <WagmiProviderWrapper>
      <AuthProvider>
        <AppProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen name="auth" options={{ title: "Auth" }} />
            <Stack.Screen name="onboarding" options={{ title: "Onboarding" }} />
            <Stack.Screen name="home" options={{ title: "Home" }} />
            <Stack.Screen name="swipe" options={{ title: "Swipe" }} />
            <Stack.Screen name="chat" options={{ title: "Chat" }} />
            <Stack.Screen name="profile" options={{ title: "Profile" }} />
            <Stack.Screen name="settings" options={{ title: "Settings" }} />
          </Stack>
        </AppProvider>
      </AuthProvider>
    </WagmiProviderWrapper>
  );
}
