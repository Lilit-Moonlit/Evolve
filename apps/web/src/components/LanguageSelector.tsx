import React from "react";
import { useTranslation } from "react-i18next";
import { LOCAL_STORAGE_KEYS } from "@evolve/core/browser";
import { LANGUAGES } from "../lib/languages";

interface LanguageSelectorProps {
  onLanguageChange?: (lang: string) => void;
  showLabel?: boolean;
  className?: string;
  selectClassName?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
  showLabel = true,
  className = "",
  selectClassName,
}) => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, langCode);
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
  };

  const defaultSelectClass =
    "p-2 border border-slate-600 rounded-md bg-slate-900 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className={`language-selector ${className}`}>
      {showLabel && (
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          {t("language.select")}
        </label>
      )}
      <select
        value={i18n.language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className={selectClassName || defaultSelectClass}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
