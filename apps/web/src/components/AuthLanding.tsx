import { useTranslation } from "react-i18next";

export default function AuthLanding({
  onSelectWallet,
  onSelectEmail,
  onSelectDnaRecovery,
  onSelectQuestionRecovery,
}: {
  onSelectWallet: () => void;
  onSelectEmail: () => void;
  onSelectDnaRecovery: () => void;
  onSelectQuestionRecovery: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-10 shadow-xl text-center">
      <h1 className="text-3xl font-bold text-white mb-6">{t("auth.landing.title")}</h1>

      <div className="bg-blue-950/40 border border-blue-500/30 rounded-lg p-4 mb-6 text-xs text-blue-200 text-left">
        🔒 <strong className="text-white">{t("auth.landing.securityTitle")}:</strong>{" "}
        {t("auth.landing.securityDescription")}
      </div>

      <div className="space-y-4">
        <button
          onClick={onSelectWallet}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] min-h-[48px] shadow-lg shadow-blue-600/20"
        >
          {t("auth.landing.wallet")} (SIWE)
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-slate-800 px-2 text-gray-500">{t("common.or")}</span>
          </div>
        </div>

        <button
          onClick={onSelectDnaRecovery}
          className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 border border-slate-500 text-gray-300 font-medium rounded-lg transition-all min-h-[44px] text-sm"
        >
          {t("auth.landing.dnaRecovery")}
        </button>

        <button
          onClick={onSelectEmail}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] min-h-[48px] shadow-lg shadow-blue-600/20"
        >
          {t("auth.landing.email")}
        </button>

        <button
          onClick={onSelectQuestionRecovery}
          className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 border border-slate-500 text-gray-300 font-medium rounded-lg transition-all min-h-[44px] text-sm"
        >
          {t("auth.landing.questionRecovery")}
        </button>
      </div>
    </div>
  );
}
