import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink, Outlet, Navigate } from "react-router-dom";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
  sepolia,
  arbitrum,
  avalanche,
  polygon,
  optimism,
  zksync,
  base,
  bsc,
  fantom,
  aurora,
  celo,
  cronos,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig, ConnectButton } from "@rainbow-me/rainbowkit";
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
import UserProfile from "./pages/UserProfile";
import Chat from "./pages/Chat";
import InitialSetup from "./components/InitialSetup";
import Mode2Dashboard from "./components/Mode2Dashboard";
import Mode3Dashboard from "./components/Mode3Dashboard";
import EmojiGift from "./components/EmojiGift";
import GovernancePanel from "./components/GovernancePanel";
import { loadFeatureFlags, DEFAULT_FLAGS } from "@evolve/config";
import CompanionRoutes from "./routes/CompanionRoutes";
import StakingPanel from "./components/StakingPanel";
import LabPortal from "./pages/LabPortal";
import SafetyDashboard from "./pages/SafetyDashboard";
import PublicProfile from "./pages/PublicProfile";
import Scan from "./pages/Scan";
import LabDashboard from "./pages/LabDashboard";
import { isSafetyMode } from "./lib/config";

import { AppStateProvider, useAppState } from "./store/AppContext";
import OnboardingWizard from "./components/OnboardingWizard";

// Initialize React Query
const queryClient = new QueryClient();

// Configure Wagmi & RainbowKit
// WalletConnect Project ID — create one at https://cloud.walletconnect.com
// and set VITE_WALLETCONNECT_PROJECT_ID in apps/web/.env
const WC_PROJECT_ID =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID_PLACEHOLDER";

const config = getDefaultConfig({
  appName: "Evolve",
  projectId: WC_PROJECT_ID,
  // Sepolia FIRST: all Evolve contracts are deployed there (lib/addresses.ts)
  // and wagmi defaults un-parameterized contract hooks to chains[0].
  chains: [
    sepolia,
    arbitrum,
    avalanche,
    polygon,
    optimism,
    zksync,
    base,
    bsc,
    fantom,
    aurora,
    celo,
    cronos,
  ],
  transports: {
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
    [avalanche.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [zksync.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
    [fantom.id]: http(),
    [aurora.id]: http(),
    [celo.id]: http(),
    [cronos.id]: http(),
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

/**
 * Shows the profile onboarding wizard after authentication while the user's
 * profile is incomplete (new registrations get `onboardingComplete: false`).
 */
function OnboardingGate() {
  const { isAuthenticated, myProfile } = useAppState();
  const [dismissed, setDismissed] = useState(false);

  if (!isAuthenticated || dismissed || !myProfile.id) return null;
  if (myProfile.onboardingComplete) return null;

  return <OnboardingWizard onComplete={() => setDismissed(true)} />;
}

function AppInner() {
  const { i18n } = useTranslation();
  const [setupComplete, setSetupComplete] = useState(false);
  const handleSetupComplete = () => setSetupComplete(true);
  const lang = i18n.language?.split("-")[0] || "en";
  const rkLocale = (rainbowKitLocales[lang] || "en") as any;

  const [flags, setFlags] = useState(DEFAULT_FLAGS);

  useEffect(() => {
    const remoteUrl = "/feature-flags.json";
    loadFeatureFlags(remoteUrl).then(setFlags);
  }, []);

  return (
    <>
      <RainbowKitProvider locale={rkLocale}>
        <AppStateProvider>
          <OnboardingGate />
          {!setupComplete && <InitialSetup onComplete={handleSetupComplete} />}
          {/* Feature flag based routing: COMPANION_MODE=true renders the
             companion flow as the WHOLE app (kiosk mode). Otherwise the main
             app runs with the companion flow still reachable at /companion. */}
          {flags.COMPANION_MODE ? (
            <BrowserRouter>
              <Routes>
                <Route path="companion/*" element={<CompanionRoutes />} />
                <Route path="*" element={<Navigate to="/companion" replace />} />
              </Routes>
            </BrowserRouter>
          ) : (
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  {/* Public profile page — inside the app shell but OUTSIDE
                    ProtectedRoute: logged-out visitors see only the public
                    photo + check-request entry point. */}
                  <Route path="p/:username" element={<PublicProfile />} />
                  <Route element={<ProtectedRoute />}>
                    <Route index element={isSafetyMode() ? <SafetyDashboard /> : <Home />} />
                    <Route path="profile" element={<Profile />} />
                    {/* Dating-mode pages — hidden behind the safety facade. */}
                    {!isSafetyMode() && (
                      <>
                        <Route path="profile/:id" element={<UserProfile />} />
                        <Route path="chat" element={<Chat />} />
                        <Route path="mode2" element={<Mode2Dashboard />} />
                        <Route path="mode3" element={<Mode3Dashboard />} />
                        <Route path="gifts" element={<EmojiGift />} />
                        <Route path="governance" element={<GovernancePanel />} />
                        <Route path="staking" element={<StakingPanel />} />
                      </>
                    )}
                    {/* Person→person QR compatibility check ("Check" nav item). */}
                    <Route path="scan" element={<Scan />} />
                  </Route>
                </Route>
                {/* Public lab routes — no user session: the lab authenticates
                  with its own credentials (API key for /lab-portal,
                  partner_session for /lab-dashboard). */}
                <Route path="/lab-portal" element={<LabPortal />} />
                <Route path="/lab-dashboard" element={<LabDashboard />} />
                {/* Companion flow (patient/lab) — its own full-screen app,
                  mounted inside the main router so everything is reachable
                  from one deployment. */}
                <Route path="companion/*" element={<CompanionRoutes />} />
              </Routes>
            </BrowserRouter>
          )}
        </AppStateProvider>
      </RainbowKitProvider>
    </>
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
