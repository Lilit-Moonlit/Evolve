import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Outlet,
} from "react-router-dom";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  getDefaultConfig,
  ConnectButton,
} from "@rainbow-me/rainbowkit";
import { useTranslation } from "react-i18next";

// Import CSS
import "@rainbow-me/rainbowkit/styles.css";
import "./index.css";

// Import i18n
import "./i18n/config";

// Import Pages & Layout
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import Chat from "./pages/Chat";
import InitialSetup from "./components/InitialSetup";

import { AppStateProvider } from "./store/AppContext";

// Initialize React Query
const queryClient = new QueryClient();

// Configure Wagmi & RainbowKit
const config = getDefaultConfig({
  appName: "Evolve",
  projectId: "YOUR_PROJECT_ID_PLACEHOLDER",
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const rainbowKitLocales: Record<string, string> = {
  en: "en",
  de: "de",
  fr: "fr",
  es: "es-419",
  pt: "pt-BR",
  ja: "ja",
  ar: "ar",
  vi: "vi",
  ru: "ru",
  uk: "uk-UA",
  ko: "ko",
  zh: "zh-TW",
  fi: "fi",
};

function AppInner() {
  const { i18n } = useTranslation();
  const [setupComplete, setSetupComplete] = useState(false);
  const handleSetupComplete = () => setSetupComplete(true);
  const lang = i18n.language?.split("-")[0] || "en";
  const rkLocale = (rainbowKitLocales[lang] || "en") as any;

  return (
    <RainbowKitProvider locale={rkLocale}>
      <AppStateProvider>
        {!setupComplete && <InitialSetup onComplete={handleSetupComplete} />}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route element={<ProtectedRoute />}>
                <Route index element={<Home />} />
                <Route path="profile" element={<Profile />} />
                <Route path="profile/settings" element={<ProfileSettings />} />
                <Route path="chat" element={<Chat />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AppStateProvider>
    </RainbowKitProvider>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppInner />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
