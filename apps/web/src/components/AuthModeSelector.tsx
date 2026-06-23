import { useTranslation } from "react-i18next";

interface AuthModeSelectorProps {
  onModeSelect: (mode: "normal" | "pregnancy-bond" | "cryptic-choice") => void;
}

export default function AuthModeSelector({
  onModeSelect,
}: AuthModeSelectorProps) {
  const { t } = useTranslation();

  const modes = [
    {
      id: "normal" as const,
      icon: "💜",
      label: t("auth.modeSelector.normal.label"),
      description: t("auth.modeSelector.normal.description"),
      authType: t("auth.modeSelector.normal.authType"),
    },
    {
      id: "pregnancy-bond" as const,
      icon: "🤰",
      label: t("auth.modeSelector.pregnancyBond.label"),
      description: t("auth.modeSelector.pregnancyBond.description"),
      authType: t("auth.modeSelector.pregnancyBond.authType"),
    },
    {
      id: "cryptic-choice" as const,
      icon: "🎭",
      label: t("auth.modeSelector.crypticChoice.label"),
      description: t("auth.modeSelector.crypticChoice.description"),
      authType: t("auth.modeSelector.crypticChoice.authType"),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          {t("auth.modeSelector.title")}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          {t("auth.modeSelector.description")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onModeSelect(mode.id)}
              className="flex flex-col items-center p-6 bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-blue-500 rounded-xl transition-all transform hover:scale-[1.02] text-left"
            >
              <span className="text-4xl mb-4">{mode.icon}</span>
              <h3 className="text-xl font-bold text-white mb-2">
                {mode.label}
              </h3>
              <p className="text-blue-400 text-sm font-medium mb-1">
                {mode.authType}
              </p>
              <p className="text-gray-400 text-xs text-center">
                {mode.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
