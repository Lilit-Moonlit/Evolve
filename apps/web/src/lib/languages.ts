/**
 * Supported spoken languages (shared by LanguageSelector + onboarding).
 * `code` is the BCP-47-ish code, `name` is the language's display name,
 * `flag` is an emoji for UI chips.
 */
export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
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

export function languageName(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.name ?? code;
}

export function languageFlag(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.flag ?? "🌐";
}
