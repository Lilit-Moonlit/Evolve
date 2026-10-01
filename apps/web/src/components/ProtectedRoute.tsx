import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTranslation } from "react-i18next";
import { useAppState } from "../store/AppContext";
import type { ChatMessage, STRProfile } from "../store/AppContext";
import type { StdTestParseResult } from "../lib/std-parser";
import AuthLanding from "./AuthLanding";
import DNARecovery from "./DNARecovery";
import QuestionRecovery from "./QuestionRecovery";
import EmailAuth from "./EmailAuth";

export interface ProfileData {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  imageUrl?: string;
  verifiedStd: boolean;
  verifiedDna: boolean;
  reputationScore: number;
  voters: { name: string; weight: number; relation: string }[];
  chatHistory: ChatMessage[];
  accessPermissions: {
    stdRequested: boolean;
    stdApproved: boolean;
    dnaRequested: boolean;
    dnaApproved: boolean;
    myStdApprovedToThem: boolean;
    myDnaApprovedToThem: boolean;
  };
  dnaTestDetails?: STRProfile;
  stdTestResult?: string;
  parsedStd?: StdTestParseResult;
  authMode?: "normal" | "pregnancy-bond" | "cryptic-choice";
  hideProfileFromLowerLevels?: boolean;
}

type AuthView = "landing" | "wallet" | "email" | "dna-recovery" | "question-recovery";

export default function ProtectedRoute() {
  const { t } = useTranslation();

  const { isAuthenticated, isConnected, loading, signInWithEthereum } = useAppState();

  const [authView, setAuthView] = useState<AuthView>("landing");

  // Debug: log auth view and wallet connection state
  useEffect(() => {
    console.log("[ProtectedRoute] authView:", authView);
    console.log("[ProtectedRoute] isConnected:", isConnected, "isAuthenticated:", isAuthenticated);
  }, [authView, isConnected, isAuthenticated]);

  // Authenticated → render children
  if (isAuthenticated) {
    return <Outlet />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        <p className="text-gray-400">{t("auth.loading")}</p>
      </div>
    );
  }

  // Wallet flow — unified view
  if (authView === "wallet") {
    return (
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl space-y-6 text-center">
        <button
          onClick={() => setAuthView("landing")}
          className="text-blue-400 hover:text-blue-300 text-sm mr-4"
        >
          ← {t("common.back")}
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">{t("auth.landing.wallet")}</h2>
        <div className="flex justify-center mb-4">
          <ConnectButton />
        </div>
        {/* If user connects but not authenticated, show sign‑in button */}
        {isConnected && !isAuthenticated && (
          <button
            onClick={signInWithEthereum}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all"
          >
            {t("auth.signIn.button")}
          </button>
        )}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-8 text-center shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-white">{t("auth.signIn.title")}</h2>
        <p className="text-gray-400">{t("auth.signIn.description")}</p>
        <button
          onClick={signInWithEthereum}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-[1.02]"
        >
          {t("auth.signIn.button")}
        </button>
      </div>
    );
  }

  // Email + password sign-in (with secret-question setup on registration)
  if (authView === "email") {
    return <EmailAuth onBack={() => setAuthView("landing")} />;
  }

  // DNA recovery view
  if (authView === "dna-recovery") {
    return (
      <DNARecovery
        onRecovered={() => {
          // After DNA recovery, the page will reload via session cookie
          window.location.reload();
        }}
        onBack={() => setAuthView("landing")}
      />
    );
  }

  // Security-question recovery view
  if (authView === "question-recovery") {
    return (
      <QuestionRecovery
        onRecovered={() => {
          // After question recovery, reload to pick up the session cookie
          window.location.reload();
        }}
        onBack={() => setAuthView("landing")}
      />
    );
  }

  // Default: landing page
  return (
    <AuthLanding
      onSelectWallet={() => setAuthView("wallet")}
      onSelectEmail={() => setAuthView("email")}
      onSelectDnaRecovery={() => setAuthView("dna-recovery")}
      onSelectQuestionRecovery={() => setAuthView("question-recovery")}
    />
  );
}
