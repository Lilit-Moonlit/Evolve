import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../store/AppContext";
import { useNavigate } from "react-router-dom";
import SmartAccountInfo from "../components/SmartAccountInfo";
import PaymasterDeposit from "../components/PaymasterDeposit";

export default function ProfileSettings() {
  const { t } = useTranslation();
  const { authMode, myProfile, toggleHideProfile } = useAppState();
  const navigate = useNavigate();

  return (
    <div className="max-w-full sm:max-w-2xl mx-auto p-4 sm:p-6 space-y-8">
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

      {/* Mode Dashboard section */}
      {authMode !== "normal" && (
        <section className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            {t("settings.modeDashboard.title")}
          </h2>
          <p className="text-gray-400 text-center mb-8">
            {t("settings.modeDashboard.description")}
          </p>
          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-xl mb-4">
            <div>
              <p className="text-white font-medium">
                {authMode === "pregnancy-bond"
                  ? t("settings.modeDashboard.mode2Label")
                  : t("settings.modeDashboard.mode3Label")}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {authMode === "pregnancy-bond"
                  ? t("settings.modeDashboard.mode2Description")
                  : t("settings.modeDashboard.mode3Description")}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(authMode === "pregnancy-bond" ? "/mode2" : "/mode3")}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-[1.02]"
          >
            {authMode === "pregnancy-bond"
              ? t("settings.modeDashboard.openMode2")
              : t("settings.modeDashboard.openMode3")}
          </button>
        </section>
      )}

      {/* DNA Recovery section */}
      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          {t("settings.dnaRecovery.title")}
        </h2>
        <p className="text-gray-400 text-center mb-4">
          {t("settings.dnaRecovery.description")}
        </p>
        {myProfile?.isDnaVerified ? (
          <div className="text-center py-4">
            <span className="text-green-400 text-lg">✅</span>
            <p className="text-green-300 mt-2">{t("settings.dnaRecovery.active")}</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <span className="text-yellow-400 text-lg">⚠️</span>
            <p className="text-yellow-300 mt-2">{t("settings.dnaRecovery.notVerified")}</p>
          </div>
        )}
      </section>

      {/* Smart Account section */}
      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
        <SmartAccountInfo />
      </section>

      {/* Paymaster section */}
      <section className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
        <PaymasterDeposit />
      </section>
    </div>
  );
}
