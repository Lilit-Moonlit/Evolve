import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LOCAL_STORAGE_KEYS } from "@evolve/core/browser";
import LanguageSelector from "./LanguageSelector";
import CountrySelector from "./CountrySelector";

interface InitialSetupProps {
  onComplete: () => void;
}

const InitialSetup: React.FC<InitialSetupProps> = ({ onComplete }) => {
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    () => localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) || i18n.language || "uk",
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(
    () => localStorage.getItem(LOCAL_STORAGE_KEYS.COUNTRY) || "",
  );
  const [step, setStep] = useState<"language" | "country" | "complete">("language");

  useEffect(() => {
    // Check if setup was already completed
    const setupComplete = localStorage.getItem(LOCAL_STORAGE_KEYS.SETUP_COMPLETE);
    if (setupComplete) {
      onComplete();
    }
  }, [onComplete]);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
  };

  const handleConfirmLanguage = () => {
    const lang = selectedLanguage || i18n.language || "uk";
    i18n.changeLanguage(lang);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, lang);
    setStep("country");
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  const handleConfirmCountry = () => {
    if (selectedCountry) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.COUNTRY, selectedCountry);
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETUP_COMPLETE, "true");
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETUP_COMPLETE, "true");
    onComplete();
  };

  const selectStyle =
    "w-full p-3 border border-slate-600 rounded-xl bg-slate-900 text-white text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="flex justify-center mb-6">
          <img src="/logo.jpg" alt={t("app.name")} className="h-20 w-20 object-contain mx-auto" />
        </div>

        {step === "language" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t("language.title")}</h2>
              <p className="text-gray-600">{t("language.description")}</p>
            </div>

            <LanguageSelector
              onLanguageChange={handleLanguageChange}
              showLabel={false}
              className="w-full"
              selectClassName={selectStyle}
            />

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmLanguage}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98]"
              >
                {t("common.confirm")}
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {t("common.skip")}
              </button>
            </div>
          </div>
        )}

        {step === "country" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t("country.title")}</h2>
              <p className="text-gray-600">{t("country.description")}</p>
            </div>

            <CountrySelector
              value={selectedCountry}
              onCountryChange={handleCountryChange}
              showLabel={false}
              className="w-full"
              selectClassName={selectStyle}
            />

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmCountry}
                disabled={!selectedCountry}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98]"
              >
                {t("common.confirm")}
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {t("common.skip")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InitialSetup;
