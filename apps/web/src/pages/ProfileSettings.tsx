import { useTranslation } from "react-i18next";
import { useAppState } from "../store/AppContext";
import { useNavigate } from "react-router-dom";

const modes = [
  {
    id: "normal" as const,
    icon: "💜",
    labelKey: "auth.modeSelector.normal.label",
    descKey: "auth.modeSelector.normal.description",
  },
  {
    id: "pregnancy-bond" as const,
    icon: "🤰",
    labelKey: "auth.modeSelector.pregnancyBond.label",
    descKey: "auth.modeSelector.pregnancyBond.description",
  },
  {
    id: "cryptic-choice" as const,
    icon: "🎭",
    labelKey: "auth.modeSelector.crypticChoice.label",
    descKey: "auth.modeSelector.crypticChoice.description",
  },
];

export default function ProfileSettings() {
  const { t } = useTranslation();
  const { authMode, setAuthMode } = useAppState();
  const navigate = useNavigate();

  const handleModeChange = (
    mode: "normal" | "pregnancy-bond" | "cryptic-choice",
  ) => {
    setAuthMode(mode);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/profile")}
          className="text-pink-400 hover:text-pink-300"
        >
          ← {t("navigation.profile")}
        </button>
        <h1 className="text-3xl font-bold text-white">
          {t("navigation.settings")}
        </h1>
      </div>

      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          {t("auth.modeSelector.title")}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          {t("auth.modeSelector.description")}
        </p>

        {authMode && (
          <div className="text-center mb-6">
            <span className="text-sm text-gray-400">
              {t("settings.currentMode")}:{" "}
              <span className="text-pink-400 font-semibold">
                {t(modes.find((m) => m.id === authMode)?.labelKey || "")}
              </span>
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={`flex flex-col items-center p-6 border rounded-xl transition-all transform hover:scale-[1.02] text-left min-h-[180px] ${
                authMode === mode.id
                  ? "bg-pink-600 border-pink-500 text-white"
                  : "bg-slate-700 hover:bg-slate-600 border-slate-600 hover:border-pink-500 text-white"
              }`}
            >
              <span className="text-4xl mb-4">{mode.icon}</span>
              <h3 className="text-xl font-bold mb-2">{t(mode.labelKey)}</h3>
              <p
                className={`text-xs text-center ${authMode === mode.id ? "text-white/80" : "text-gray-400"}`}
              >
                {t(mode.descKey)}
              </p>
              {authMode === mode.id && (
                <span className="mt-3 w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm font-bold text-pink-600">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>

        <p className="text-gray-500 text-xs text-center mt-6">
          {t("settings.autoSaved")}
        </p>
      </section>
    </div>
  );
}
