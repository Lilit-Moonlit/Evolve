import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTranslation } from "react-i18next";
import { useAppState } from "../store/AppContext";
import AuthLanding from "./AuthLanding";
import EmailVerification from "./EmailVerification";
import PhoneAuthForm from "./PhoneAuthForm";
import WorldIDVerify from "./WorldIDVerify";

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
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Already authenticated but no mode selected → redirect to settings
  if (isAuthenticated && !authMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <h2 className="text-2xl font-bold text-white">
          {t("auth.noMode.title")}
        </h2>
        <p className="text-gray-400">{t("auth.noMode.description")}</p>
        <button
          onClick={() => navigate("/profile")}
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
        await registerWithEmail(email, password, name || email.split("@")[0]);
        setJustRegistered(true);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (error: unknown) {
      setAuthError(t("auth.error.failed"));
    }
  };

  // Registration success — step 1: email verification
  if (
    authView === "email" &&
    emailUser &&
    justRegistered &&
    isAuthenticated &&
    !emailVerified
  ) {
    return (
      <EmailVerification
        email={email}
        onVerified={() => setEmailVerified(true)}
        onBack={() => {
          // Allow skipping verification — mark as done and proceed to WorldID
          setEmailVerified(true);
        }}
      />
    );
  }

  // Registration success — step 2: offer World ID verification
  if (
    authView === "email" &&
    emailUser &&
    justRegistered &&
    isAuthenticated &&
    emailVerified
  ) {
    return (
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {t("auth.email.registered")}
          </h2>
          <p className="text-gray-400">{t("auth.email.worldIdPrompt")}</p>
        </div>

        <WorldIDVerify
          onVerified={() => {
            setJustRegistered(false);
          }}
        />

        <button
          onClick={() => setJustRegistered(false)}
          className="w-full py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          {t("common.skipForNow")}
        </button>
      </div>
    );
  }

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
              ← {t("common.back")}
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
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t("auth.email.name")}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder={t("auth.email.namePlaceholder")}
                  required
                />
              </div>
            )}
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 text-sm"
                  aria-label={
                    showPassword ? t("password.hide") : t("password.show")
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
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
              ← {t("common.back")}
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
