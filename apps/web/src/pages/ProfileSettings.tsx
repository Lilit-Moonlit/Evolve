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
  const { authMode, setAuthMode, myProfile, toggleHideProfile } = useAppState();
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
          className="text-blue-400 hover:text-blue-300"
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
              <span className="text-blue-400 font-semibold">
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
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-slate-700 hover:bg-slate-600 border-slate-600 hover:border-blue-500 text-white"
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
                <span className="mt-3 w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm font-bold text-blue-600">
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

      {/* Privacy section */}
      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          {t("settings.privacy")}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          {t("settings.hideProfileFromLowerLevels")}
        </p>

        <div className="flex items-center justify-between p-4 bg-slate-700 rounded-xl">
          <div>
            <p className="text-white font-medium">
              {t("settings.hideProfileFromLowerLevels")}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {authMode === "normal" && "Level 1 — all profiles visible"}
              {authMode === "pregnancy-bond" && "Level 2 — hide from Level 1"}
              {authMode === "cryptic-choice" &&
                "Level 3 — hide from Level 1 & 2"}
            </p>
          </div>
          <button
            onClick={toggleHideProfile}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              myProfile.hideProfileFromLowerLevels
                ? "bg-blue-600"
                : "bg-gray-600"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                myProfile.hideProfileFromLowerLevels ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        <p className="text-gray-500 text-xs text-center mt-6">
          {t("settings.autoSaved")}
        </p>
      </section>
    </div>
  );
}
