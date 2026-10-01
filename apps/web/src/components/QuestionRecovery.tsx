import { useState } from "react";
import { useTranslation } from "react-i18next";
import { requestQuestionRecovery } from "../lib/question-recovery";

/**
 * Security-question account recovery.
 *
 *   Step 1 – enter the email linked to the Evolve account
 *   Step 2 – fetch & show the stored question, then answer it
 *
 * On success the server issues a session cookie and the parent component
 * redirects (window.location.reload picks up the cookie).
 */
export default function QuestionRecovery({
  onRecovered,
  onBack,
}: {
  onRecovered: () => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [accountQuestion, setAccountQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      setError(t("questionRecovery.error.emailRequired"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Fetch the stored question for this email, so we can show what to answer.
      const res = await fetch(
        `/api/auth/question?email=${encodeURIComponent(email.trim().toLowerCase())}`,
        { credentials: "include" },
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || t("questionRecovery.error.lookupFailed"));
        return;
      }
      setAccountQuestion(data.question as string);
      setStep(2);
    } catch {
      setError(t("questionRecovery.error.network"));
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!answer.trim()) {
      setError(t("questionRecovery.error.answerRequired"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await requestQuestionRecovery(email, answer);
      if (result.success) {
        onRecovered();
      } else {
        setError(result.error || t("questionRecovery.error.failed"));
      }
    } catch {
      setError(t("questionRecovery.error.network"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-10 shadow-xl text-center">
      <button
        onClick={onBack}
        className="text-blue-400 hover:text-blue-300 text-sm mb-6 self-start"
      >
        &larr; {t("common.back")}
      </button>

      <h2 className="text-2xl font-bold text-white mb-2">
        {t("questionRecovery.title")}
      </h2>
      <p className="text-gray-400 mb-6 text-sm">{t("questionRecovery.description")}</p>

      {error && (
        <div className="bg-red-900/40 border border-red-500/30 rounded-lg p-3 mb-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 text-left">
          <label className="block">
            <span className="text-gray-300 text-sm">{t("questionRecovery.emailLabel")}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("questionRecovery.emailPlaceholder")}
              className="mt-1 w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </label>
          <button
            onClick={handleEmailSubmit}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("questionRecovery.nextLoading") : t("questionRecovery.next")}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 text-left">
          <p className="text-xs text-gray-500">
            {t("questionRecovery.emailEntered")}:{" "}
            <span className="text-gray-300">{email}</span>
          </p>
          {accountQuestion ? (
            <>
              <div className="p-3 bg-slate-700 rounded-lg">
                <p className="text-sm text-gray-400">{t("questionRecovery.questionLabel")}</p>
                <p className="text-white font-medium mt-1">{accountQuestion}</p>
              </div>
              <label className="block">
                <span className="text-gray-300 text-sm">
                  {t("questionRecovery.answerLabel")}
                </span>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={t("questionRecovery.answerPlaceholder")}
                  className="mt-1 w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              </label>
              <button
                onClick={handleAnswerSubmit}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("questionRecovery.recovering") : t("questionRecovery.recover")}
              </button>
            </>
          ) : (
            <p className="text-sm text-yellow-300">{t("questionRecovery.error.noQuestion")}</p>
          )}
        </div>
      )}
    </div>
  );
}
