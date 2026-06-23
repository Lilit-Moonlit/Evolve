import React from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "nb", name: "Norsk Bokmål", flag: "🇳🇴" },
  { code: "da", name: "Dansk", flag: "🇩🇰" },
  { code: "fi", name: "Suomi", flag: "🇫🇮" },
  { code: "cs", name: "Čeština", flag: "🇨🇿" },
  { code: "ro", name: "Română", flag: "🇷🇴" },
  { code: "hu", name: "Magyar", flag: "🇭🇺" },
  { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
  { code: "hr", name: "Hrvatski", flag: "🇭🇷" },
  { code: "sk", name: "Slovenčina", flag: "🇸🇰" },
  { code: "sl", name: "Slovenščina", flag: "🇸🇮" },
  { code: "bg", name: "Български", flag: "🇧🇬" },
  { code: "et", name: "Eesti", flag: "🇪🇪" },
  { code: "lv", name: "Latviešu", flag: "🇱🇻" },
  { code: "lt", name: "Lietuvių", flag: "🇱🇹" },
  { code: "is", name: "Íslenska", flag: "🇮🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "he", name: "עברית", flag: "🇮🇱" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "zh-TW", name: "繁體中文", flag: "🇹🇼" },
  { code: "ne", name: "नेपाली", flag: "🇳🇵" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
  { code: "fil", name: "Filipino", flag: "🇵🇭" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
];

interface LanguageSelectorProps {
  onLanguageChange?: (lang: string) => void;
  showLabel?: boolean;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
  showLabel = true,
  className = "",
}) => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("evolve-language", langCode);
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
  };

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
        className="p-2 border border-slate-600 rounded-md bg-slate-900 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
