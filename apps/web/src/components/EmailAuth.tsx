import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../store/AppContext";
import { setSecurityQuestion } from "../lib/question-recovery";

/**
 * Email + password sign-in / sign-up.
 *
 * After a successful REGISTRATION the user immediately creates their own
 * secret question + answer (free text — any language, any symbols). The
 * question doubles as a passwordless login option later ("Секретне питання"
 * on the auth landing), so it is required, not optional.
 */
export default function EmailAuth({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const { loginWithEmail, registerWithEmail } = useAppState();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Secret-question step (after registration).
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [step, setStep] = useState<"form" | "question">("form");

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError(t("auth.emailAuth.errorRequired"));
      return;
    }
    if (mode === "register" && password !== confirm) {
      setError(t("auth.emailAuth.errorPasswordsDiffer"));
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await loginWithEmail(email.trim().toLowerCase(), password);
        onDone();
      } else {
        await registerWithEmail(email.trim().toLowerCase(), password);
        setStep("question");
      }
    } catch (e: any) {
      const msg = String(e?.message || "");
      setError(
        msg.includes("exists")
          ? t("auth.emailAuth.errorExists")
          : msg.includes("credentials")
            ? t("auth.emailAuth.errorCredentials")
            : t("auth.emailAuth.errorFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  const onDone = () => {
    // Session cookie is set — reload so ProtectedRoute picks it up.
    window.location.reload();
  };

  const handleSaveQuestion = async () => {
    setError("");
    if (!question.trim() || !answer.trim()) {
      setError(t("auth.emailAuth.errorQuestionRequired"));
      return;
    }
    setLoading(true);
    try {
      const result = await setSecurityQuestion(question, answer);
      if (!result.success) {
        setError(t("auth.emailAuth.errorFailed"));
        return;
      }
      onDone();
    } catch {
      setError(t("auth.emailAuth.errorFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (step === "question") {
    return (
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl space-y-5">
        <button onClick={onBack} className="text-blue-400 hover:text-blue-300 text-sm">
          ← {t("common.back")}
        </button>
        <h2 className="text-2xl font-bold text-white">{t("auth.emailAuth.questionTitle")}</h2>
        <p className="text-gray-400 text-sm">{t("auth.emailAuth.questionHint")}</p>

        {error && (
          <div className="bg-red-900/40 border border-red-500/30 rounded-lg p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <label className="block">
          <span className="text-gray-300 text-sm">{t("auth.emailAuth.questionLabel")}</span>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t("auth.emailAuth.questionPlaceholder")}
            className="mt-1 w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            autoFocus
          />
        </label>
        <label className="block">
          <span className="text-gray-300 text-sm">{t("auth.emailAuth.answerLabel")}</span>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={t("auth.emailAuth.answerPlaceholder")}
            className="mt-1 w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </label>
        <button
          onClick={() => void handleSaveQuestion()}
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? t("auth.loading") : t("auth.emailAuth.questionSave")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl space-y-5">
      <button onClick={onBack} className="text-blue-400 hover:text-blue-300 text-sm">
        ← {t("common.back")}
      </button>
      <h2 className="text-2xl font-bold text-white">
        {mode === "login" ? t("auth.emailAuth.loginTitle") : t("auth.emailAuth.registerTitle")}
      </h2>

      {/* Mode switch */}
      <div className="flex gap-2 text-sm">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 py-2 rounded-lg font-medium transition ${
            mode === "login" ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-300"
          }`}
        >
          {t("auth.emailAuth.modeLogin")}
        </button>
        <button
          onClick={() => setMode("register")}
          className={`flex-1 py-2 rounded-lg font-medium transition ${
            mode === "register" ? "bg-blue-600 text-white" : "bg-slate-700 text-gray-300"
          }`}
        >
          {t("auth.emailAuth.modeRegister")}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/40 border border-red-500/30 rounded-lg p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <label className="block">
        <span className="text-gray-300 text-sm">{t("auth.emailAuth.emailLabel")}</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="mt-1 w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          autoFocus
        />
      </label>
      <label className="block">
        <span className="text-gray-300 text-sm">{t("auth.emailAuth.passwordLabel")}</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1 w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </label>
      {mode === "register" && (
        <label className="block">
          <span className="text-gray-300 text-sm">{t("auth.emailAuth.confirmLabel")}</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            className="mt-1 w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </label>
      )}

      <button
        onClick={() => void handleSubmit()}
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 min-h-[48px]"
      >
        {loading
          ? t("auth.loading")
          : mode === "login"
            ? t("auth.emailAuth.loginButton")
            : t("auth.emailAuth.registerButton")}
      </button>
    </div>
  );
}
