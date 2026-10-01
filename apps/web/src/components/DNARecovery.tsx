import { useState } from "react";
import { useTranslation } from "react-i18next";
import { requestDnaRecovery } from "../lib/dna-recovery";

/**
 * Two-step DNA account recovery:
 *   Step 1 – enter the email linked to the Evolve account
 *   Step 2 – paste DNA test result text
 *
 * On success the server issues a session cookie and the parent
 * component can redirect to the home page.
 */
export default function DNARecovery({
  onRecovered,
  onBack,
}: {
  onRecovered: () => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [dnaText, setDnaText] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = () => {
    if (!email.trim()) {
      setError(t("dnaRecovery.error.emailRequired"));
      return;
    }
    setError("");
    setStep(2);
  };

  const handleDnaSubmit = async () => {
    if (!dnaText.trim()) {
      setError(t("dnaRecovery.error.dnaRequired"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await requestDnaRecovery(email, dnaText);
      if (result.success) {
        onRecovered();
      } else {
        setError(result.error || t("dnaRecovery.error.failed"));
      }
    } catch {
      setError(t("dnaRecovery.error.network"));
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

      <h2 className="text-2xl font-bold text-white mb-2">{t("dnaRecovery.title")}</h2>
      <p className="text-gray-400 mb-6 text-sm">{t("dnaRecovery.description")}</p>

      {error && (
        <div className="bg-red-900/40 border border-red-500/30 rounded-lg p-3 mb-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 text-left">
          <label className="block">
            <span className="text-gray-300 text-sm">{t("dnaRecovery.emailLabel")}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("dnaRecovery.emailPlaceholder")}
              className="mt-1 w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </label>
          <button
            onClick={handleEmailSubmit}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white font-semibold rounded-lg transition-all"
          >
            {t("dnaRecovery.next")}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 text-left">
          <p className="text-xs text-gray-500">
            {t("dnaRecovery.emailEntered")}: <span className="text-gray-300">{email}</span>
          </p>
          <label className="block">
            <span className="text-gray-300 text-sm">{t("dnaRecovery.dnaLabel")}</span>
            <textarea
              value={dnaText}
              onChange={(e) => setDnaText(e.target.value)}
              placeholder={t("dnaRecovery.dnaPlaceholder")}
              rows={8}
              className="mt-1 w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono text-xs"
              autoFocus
            />
          </label>
          <button
            onClick={handleDnaSubmit}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("dnaRecovery.recovering") : t("dnaRecovery.recover")}
          </button>
        </div>
      )}
    </div>
  );
}
