import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import CountrySelector from "./CountrySelector";

interface InitialSetupProps {
  onComplete: () => void;
}

const InitialSetup: React.FC<InitialSetupProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [step, setStep] = useState<"language" | "country" | "complete">(
    "language",
  );

  useEffect(() => {
    // Check if setup was already completed
    const setupComplete = localStorage.getItem("evolve-setup-complete");
    if (setupComplete) {
      onComplete();
    }
  }, [onComplete]);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    // Auto-advance to country selection after language selection
    setTimeout(() => {
      setStep("country");
    }, 500);
  };

  const handleCountryChange = (country: string, language: string) => {
    setSelectedCountry(country);
    // Mark setup as complete and proceed
    localStorage.setItem("evolve-setup-complete", "true");
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const handleSkip = () => {
    localStorage.setItem("evolve-setup-complete", "true");
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💖 Evolve</h1>
          <p className="text-gray-600">{t("app.tagline")}</p>
        </div>

        {step === "language" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {t("language.title")}
              </h2>
              <p className="text-gray-600">{t("language.description")}</p>
            </div>

            <LanguageSelector
              onLanguageChange={handleLanguageChange}
              showLabel={false}
              className="w-full"
            />

            <button
              onClick={handleSkip}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}

        {step === "country" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {t("country.title")}
              </h2>
              <p className="text-gray-600">{t("country.description")}</p>
            </div>

            <CountrySelector
              onCountryChange={handleCountryChange}
              showLabel={false}
              className="w-full"
            />

            <button
              onClick={handleSkip}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InitialSetup;
