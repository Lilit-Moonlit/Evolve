import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { clearUserData, clearLabData } from "./lib/companion-storage";

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

export const WelcomeScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(
    () => localStorage.getItem("companion_language") || i18n.language,
  );
  const [selectedRegion, setSelectedRegion] = useState(
    () => localStorage.getItem("companion_region") || "US",
  );
  const [selectedRole, setSelectedRole] = useState<"user" | "lab">(
    () => (localStorage.getItem("companion_role") as "user" | "lab") || "user",
  );

  // Apply the previously chosen language (but never auto-navigate away — the
  // user must explicitly confirm their role so switching roles never "sticks").
  useEffect(() => {
    const savedLanguage = localStorage.getItem("companion_language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleContinue = () => {
    // Reset the *opposite* role's data so stale lab/user state never leaks in.
    if (selectedRole === "user") {
      clearLabData();
    } else {
      clearUserData();
    }

    localStorage.setItem("companion_language", selectedLanguage);
    localStorage.setItem("companion_region", selectedRegion);
    localStorage.setItem("companion_role", selectedRole);

    // Перенаправляємо на відповідний екран авторизації
    if (selectedRole === "lab") {
      navigate("/companion/lab/auth");
    } else {
      navigate("/companion/auth");
    }
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

          <div>
            <label className="block text-xs text-slate-400 mb-2 text-left">
              {t("companion.roleSelect")}
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedRole === "user"
                    ? "bg-blue-600/20 border border-blue-500"
                    : "bg-slate-700/50 border border-slate-600 hover:border-slate-500"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={selectedRole === "user"}
                  onChange={() => setSelectedRole("user")}
                  className="w-4 h-4 accent-blue-500"
                />
                <div className="text-left">
                  <p className="text-white text-sm font-medium">{t("companion.role.user")}</p>
                  <p className="text-slate-400 text-xs">{t("companion.role.userHint")}</p>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedRole === "lab"
                    ? "bg-blue-600/20 border border-blue-500"
                    : "bg-slate-700/50 border border-slate-600 hover:border-slate-500"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="lab"
                  checked={selectedRole === "lab"}
                  onChange={() => setSelectedRole("lab")}
                  className="w-4 h-4 accent-blue-500"
                />
                <div className="text-left">
                  <p className="text-white text-sm font-medium">{t("companion.role.lab")}</p>
                  <p className="text-slate-400 text-xs">{t("companion.role.labHint")}</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98]"
        >
          {t("companion.startButton")}
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
