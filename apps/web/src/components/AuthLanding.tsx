import { useTranslation } from "react-i18next";

interface AuthLandingProps {
  onSelectEmail: () => void;
  onSelectPhone: () => void;
  onSelectWallet: () => void;
}

export default function AuthLanding({
  onSelectEmail,
  onSelectPhone,
  onSelectWallet,
}: AuthLandingProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-xl p-10 shadow-xl text-center">
      <h1 className="text-3xl font-bold text-white mb-2">
        {t("auth.landing.title")}
      </h1>
      <p className="text-gray-400 mb-8">{t("app.tagline")}</p>

      <div className="space-y-4">
        <button
          onClick={onSelectEmail}
          className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-blue-500 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] min-h-[48px]"
        >
          {t("auth.landing.email")}
        </button>

        <button
          onClick={onSelectPhone}
          className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-blue-500 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] min-h-[48px]"
        >
          {t("auth.landing.phone")}
        </button>

        <button
          onClick={onSelectWallet}
          className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-blue-500 text-white font-semibold rounded-lg transition-all transform hover:scale-[1.02] min-h-[48px]"
        >
          {t("auth.landing.wallet")}
        </button>
      </div>
    </div>
  );
}
