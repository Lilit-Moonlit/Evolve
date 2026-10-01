import React from "react";
import { useTranslation } from "react-i18next";
import { LOCAL_STORAGE_KEYS } from "@evolve/core/browser";

// Countries with STD testing and ENFSI/CODIS DNA testing capabilities
const countries = [
  { code: "US", name: "United States", flag: "🇺🇸", language: "en" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", language: "en" },
  { code: "DE", name: "Germany", flag: "🇩🇪", language: "de" },
  { code: "FR", name: "France", flag: "🇫🇷", language: "fr" },
  { code: "ES", name: "Spain", flag: "🇪🇸", language: "es" },
  { code: "IT", name: "Italy", flag: "🇮🇹", language: "it" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", language: "pt" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", language: "pt" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", language: "nl" },
  { code: "PL", name: "Poland", flag: "🇵🇱", language: "pl" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦", language: "uk" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", language: "sv" },
  { code: "NO", name: "Norway", flag: "🇳🇴", language: "nb" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", language: "da" },
  { code: "FI", name: "Finland", flag: "🇫🇮", language: "fi" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", language: "cs" },
  { code: "RO", name: "Romania", flag: "🇷🇴", language: "ro" },
  { code: "HU", name: "Hungary", flag: "🇭🇺", language: "hu" },
  { code: "GR", name: "Greece", flag: "🇬🇷", language: "el" },
  { code: "HR", name: "Croatia", flag: "🇭🇷", language: "hr" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰", language: "sk" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮", language: "sl" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", language: "bg" },
  { code: "EE", name: "Estonia", flag: "🇪🇪", language: "et" },
  { code: "LV", name: "Latvia", flag: "🇱🇻", language: "lv" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹", language: "lt" },
  { code: "IS", name: "Iceland", flag: "🇮🇸", language: "is" },
  { code: "AT", name: "Austria", flag: "🇦🇹", language: "de" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", language: "de" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", language: "nl" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", language: "en" },
  { code: "CA", name: "Canada", flag: "🇨🇦", language: "en" },
  { code: "AU", name: "Australia", flag: "🇦🇺", language: "en" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", language: "en" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", language: "en" },
  { code: "JP", name: "Japan", flag: "🇯🇵", language: "ja" },
  { code: "IL", name: "Israel", flag: "🇮🇱", language: "he" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", language: "ar" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼", language: "zh-TW" },
  { code: "NP", name: "Nepal", flag: "🇳🇵", language: "ne" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", language: "sw" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", language: "fil" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", language: "vi" },
];

interface CountrySelectorProps {
  onCountryChange?: (country: string, language: string) => void;
  showLabel?: boolean;
  className?: string;
  selectClassName?: string;
  value?: string;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  onCountryChange,
  showLabel = true,
  className = "",
  selectClassName,
  value,
}) => {
  const { i18n, t } = useTranslation();
  const [currentCountry, setCurrentCountry] = React.useState<string>(
    () => value ?? localStorage.getItem(LOCAL_STORAGE_KEYS.COUNTRY) ?? "",
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setCurrentCountry(value);
    }
  }, [value]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    setCurrentCountry(countryCode);
    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      // Auto-switch language based on country
      i18n.changeLanguage(country.language);
      localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, country.language);
      localStorage.setItem(LOCAL_STORAGE_KEYS.COUNTRY, countryCode);
      if (onCountryChange) {
        onCountryChange(countryCode, country.language);
      }
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.COUNTRY);
      if (onCountryChange) {
        onCountryChange("", "");
      }
    }
  };

  const defaultSelectClass =
    "p-2 border border-slate-600 rounded-md bg-slate-900 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className={`country-selector ${className}`}>
      {showLabel && (
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          {t("country.select")}
        </label>
      )}
      <select
        value={currentCountry}
        onChange={handleCountryChange}
        className={selectClassName || defaultSelectClass}
      >
        <option value="">{t("country.select")}</option>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelector;
