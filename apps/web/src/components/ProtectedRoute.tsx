import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTranslation } from "react-i18next";
import { useAppState } from "../store/AppContext";
import AuthLanding from "./AuthLanding";
import PhoneAuthForm from "./PhoneAuthForm";

type AuthView = "landing" | "email" | "phone" | "wallet";

export default function ProtectedRoute() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isConnected,
    loading,
    signInWithEthereum,
    authMode,
    loginWithEmail,
    registerWithEmail,
    emailUser,
  } = useAppState();

  const [authView, setAuthView] = useState<AuthView>("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState("");

  // Already authenticated but no mode selected → redirect to settings
  if (isAuthenticated && !authMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <h2 className="text-2xl font-bold text-white">
          {t("auth.noMode.title")}
        </h2>
        <p className="text-gray-400">{t("auth.noMode.description")}</p>
        <button
          onClick={() => navigate("/profile/settings")}
          className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-[1.02]"
        >
          {t("auth.noMode.button")}
        </button>
      </div>
    );
  }

  // Authenticated and mode selected → render children
  if (isAuthenticated && authMode) {
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed");
    }
  };

  // Email form
  if (authView === "email") {
    if (!emailUser) {
      return (
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl space-y-6">
          <div className="flex items-center">
            <button
              onClick={() => setAuthView("landing")}
              className="text-blue-400 hover:text-blue-300 text-sm mr-4"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold text-white">
              {t("auth.email.title")}
            </h2>
          </div>
          <p className="text-gray-400 text-center">
            {t("auth.email.description")}
          </p>

          {authError && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {t("auth.email.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {t("auth.email.password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-[1.02]"
            >
              {isRegistering ? t("auth.email.register") : t("auth.email.login")}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              {isRegistering
                ? t("auth.email.switchToLogin")
                : t("auth.email.switchToRegister")}
            </button>
          </div>
        </div>
      );
    }
    return <Outlet />;
  }

  // Phone form
  if (authView === "phone") {
    return <PhoneAuthForm onBack={() => setAuthView("landing")} />;
  }

  // Wallet flow — merged Connect Wallet + SIWE into one seamless flow
  if (authView === "wallet") {
    if (!isConnected) {
      return (
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl space-y-6">
          <div className="flex items-center mb-4">
            <button
              onClick={() => setAuthView("landing")}
              className="text-blue-400 hover:text-blue-300 text-sm mr-4"
            >
              ← Back
            </button>
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">
              {t("auth.landing.wallet")}
            </h2>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-8 text-center shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-white">
            {t("auth.signIn.title")}
          </h2>
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
    return <Outlet />;
  }

  // Default: landing page
  return (
    <AuthLanding
      onSelectEmail={() => setAuthView("email")}
      onSelectPhone={() => setAuthView("phone")}
      onSelectWallet={() => setAuthView("wallet")}
    />
  );
}
