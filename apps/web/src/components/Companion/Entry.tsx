import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AVAILABLE_LANGUAGES = [
  { code: "uk", name: "Українська" },
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "ja", name: "日本語" },
  { code: "zh-TW", name: "繁體中文" },
  { code: "ru", name: "Русский" },
  { code: "ar", name: "العربية" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "hi", name: "हिन्दी" },
  { code: "tr", name: "Türkçe" },
  { code: "th", name: "ไทย" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "ms", name: "Bahasa Melayu" },
  { code: "ko", name: "한국어" },
];

const AVAILABLE_REGIONS = [
  { code: "UA", name: "Ukraine" },
  { code: "US", name: "United States" },
  { code: "EU", name: "Europe" },
  { code: "AS", name: "Asia" },
  { code: "AF", name: "Africa" },
  { code: "SA", name: "South America" },
  { code: "NA", name: "North America" },
  { code: "OC", name: "Oceania" },
];

export const Entry: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [selectedRegion, setSelectedRegion] = useState("US");

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleStart = () => {
    localStorage.setItem("companion_language", selectedLanguage);
    localStorage.setItem("companion_region", selectedRegion);
    navigate("/companion/upload");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl text-center">
        <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold border border-blue-500/30">
          🛡️
        </div>
        <h1 className="text-2xl font-bold mb-3 text-white">{t("companion.title")}</h1>
        <p className="text-slate-300 mb-6 text-sm leading-relaxed">{t("companion.intro")}</p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs text-slate-400 mb-2 text-left">
              {t("companion.languageSelect")}
            </label>
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              {AVAILABLE_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-2 text-left">
              {t("companion.regionSelect")}
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              {AVAILABLE_REGIONS.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98]"
        >
          {t("companion.startButton")}
        </button>
      </div>
    </div>
  );
};

export default Entry;
