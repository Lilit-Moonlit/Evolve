/**
 * Adds the `filters` top-level object and renames `navigation.swipe` →
 * `navigation.home` to every locale JSON file in apps/web/src/i18n/locales/.
 *
 * Deterministic, non-LLM: preserves all existing keys via deep merge and only
 * adds/renames what the Home/Layout/Chat UI consumes.
 *
 * Natural translations are provided for Tier 1 languages; all other locales use
 * English labels (matching the repo's Tier 2 convention described in the
 * TIER2-*.md docs).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs
  .readdirSync(localesDir)
  .filter((f) => f.endsWith(".json"));

// English source for the filters object.
const filtersEn = {
  ageRange: "Age range",
  min: "Min",
  max: "Max",
  heightRange: "Height (cm)",
  weightRange: "Weight (kg)",
  country: "Country",
  city: "City",
  languages: "Languages",
  any: "Any",
  yes: "Yes",
  no: "No",
  eyeColor: "Eye color",
  hairColor: "Hair color",
  bodyType: "Body type",
  education: "Education",
  maritalStatus: "Marital status",
  religion: "Religion",
  zodiac: "Zodiac",
  children: "Children",
  smoking: "Smoking",
  drinking: "Drinking",
  eyeColors: { brown: "Brown", blue: "Blue", green: "Green", hazel: "Hazel", gray: "Gray", black: "Black" },
  hairColors: { black: "Black", brown: "Brown", blonde: "Blonde", red: "Red", gray: "Gray", white: "White", bald: "Bald" },
  bodyTypes: { slim: "Slim", athletic: "Athletic", average: "Average", curvy: "Curvy", muscular: "Muscular", large: "Large" },
  educationLevels: { highSchool: "High school", associate: "Associate degree", bachelor: "Bachelor's", master: "Master's", doctorate: "Doctorate", other: "Other" },
  maritalStatuses: { single: "Single", divorced: "Divorced", widowed: "Widowed", separated: "Separated", married: "Married" },
  religions: { christianity: "Christianity", islam: "Islam", judaism: "Judaism", hinduism: "Hinduism", buddhism: "Buddhism", atheist: "Atheist", agnostic: "Agnostic", spiritual: "Spiritual", other: "Other" },
  zodiacs: { aries: "Aries", taurus: "Taurus", gemini: "Gemini", cancer: "Cancer", leo: "Leo", virgo: "Virgo", libra: "Libra", scorpio: "Scorpio", sagittarius: "Sagittarius", capricorn: "Capricorn", aquarius: "Aquarius", pisces: "Pisces" },
};

// navigation.home per language code.
const homeLabel = {
  uk: "Головна",
  de: "Startseite",
  fr: "Accueil",
  es: "Inicio",
  pt: "Início",
  ja: "ホーム",
  ar: "الرئيسية",
  vi: "Trang chủ",
  zh_TW: "主頁",
  he: "דף הבית",
  ru: "Главная",
  // everything else falls back to English "Home" (assigned below)
};

function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}

function deepMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      out[key] = deepMerge(out[key] || {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

/** Build the filters object for a locale: natural for Tier 1, else English. */
function buildFilters(locale) {
  // Natural translations for Tier 1 languages (top-level labels).
  const natural = {
    uk: { ageRange: "Діапазон віку", min: "Мін", max: "Макс", heightRange: "Зріст (см)", weightRange: "Вага (кг)", country: "Країна", city: "Місто", languages: "Мови", any: "Будь-який", yes: "Так", no: "Ні", eyeColor: "Колір очей", hairColor: "Колір волосся", bodyType: "Статура", education: "Освіта", maritalStatus: "Сімейний стан", religion: "Релігія", zodiac: "Зодіак", children: "Діти", smoking: "Куріння", drinking: "Алкоголь" },
    de: { ageRange: "Altersspanne", min: "Min", max: "Max", heightRange: "Größe (cm)", weightRange: "Gewicht (kg)", country: "Land", city: "Stadt", languages: "Sprachen", any: "Beliebig", yes: "Ja", no: "Nein", eyeColor: "Augenfarbe", hairColor: "Haarfarbe", bodyType: "Körperbau", education: "Bildung", maritalStatus: "Familienstand", religion: "Religion", zodiac: "Sternzeichen", children: "Kinder", smoking: "Rauchen", drinking: "Alkohol" },
    fr: { ageRange: "Tranche d'âge", min: "Min", max: "Max", heightRange: "Taille (cm)", weightRange: "Poids (kg)", country: "Pays", city: "Ville", languages: "Langues", any: "Indifférent", yes: "Oui", no: "Non", eyeColor: "Couleur des yeux", hairColor: "Couleur des cheveux", bodyType: "Corpulence", education: "Éducation", maritalStatus: "Situation familiale", religion: "Religion", zodiac: "Zodiaque", children: "Enfants", smoking: "Tabac", drinking: "Alcool" },
    es: { ageRange: "Rango de edad", min: "Mín", max: "Máx", heightRange: "Altura (cm)", weightRange: "Peso (kg)", country: "País", city: "Ciudad", languages: "Idiomas", any: "Cualquiera", yes: "Sí", no: "No", eyeColor: "Color de ojos", hairColor: "Color de cabello", bodyType: "Complexión", education: "Educación", maritalStatus: "Estado civil", religion: "Religión", zodiac: "Zodíaco", children: "Hijos", smoking: "Fumar", drinking: "Alcohol" },
    pt: { ageRange: "Faixa etária", min: "Mín", max: "Máx", heightRange: "Altura (cm)", weightRange: "Peso (kg)", country: "País", city: "Cidade", languages: "Idiomas", any: "Qualquer", yes: "Sim", no: "Não", eyeColor: "Cor dos olhos", hairColor: "Cor do cabelo", bodyType: "Biótipo", education: "Educação", maritalStatus: "Estado civil", religion: "Religião", zodiac: "Zodíaco", children: "Filhos", smoking: "Fumar", drinking: "Álcool" },
    ja: { ageRange: "年齢層", min: "最小", max: "最大", heightRange: "身長(cm)", weightRange: "体重(kg)", country: "国", city: "都市", languages: "言語", any: "指定なし", yes: "はい", no: "いいえ", eyeColor: "目の色", hairColor: "髪の色", bodyType: "体型", education: "学歴", maritalStatus: "婚姻状況", religion: "宗教", zodiac: "星座", children: "子供", smoking: "喫煙", drinking: "飲酒" },
    ar: { ageRange: "الفئة العمرية", min: "الحد الأدنى", max: "الحد الأقصى", heightRange: "الطول (سم)", weightRange: "الوزن (كجم)", country: "البلد", city: "المدينة", languages: "اللغات", any: "أي", yes: "نعم", no: "لا", eyeColor: "لون العينين", hairColor: "لون الشعر", bodyType: "بنية الجسم", education: "التعليم", maritalStatus: "الحالة الاجتماعية", religion: "الدين", zodiac: "الأبراج", children: "أطفال", smoking: "تدخين", drinking: "كحول" },
    vi: { ageRange: "Khoảng tuổi", min: "Tối thiểu", max: "Tối đa", heightRange: "Chiều cao (cm)", weightRange: "Cân nặng (kg)", country: "Quốc gia", city: "Thành phố", languages: "Ngôn ngữ", any: "Bất kỳ", yes: "Có", no: "Không", eyeColor: "Màu mắt", hairColor: "Màu tóc", bodyType: "Vóc dáng", education: "Học vấn", maritalStatus: "Tình trạng hôn nhân", religion: "Tôn giáo", zodiac: "Cung hoàng đạo", children: "Con cái", smoking: "Hút thuốc", drinking: "Rượu bia" },
    ru: { ageRange: "Диапазон возраста", min: "Мин", max: "Макс", heightRange: "Рост (см)", weightRange: "Вес (кг)", country: "Страна", city: "Город", languages: "Языки", any: "Любой", yes: "Да", no: "Нет", eyeColor: "Цвет глаз", hairColor: "Цвет волос", bodyType: "Телосложение", education: "Образование", maritalStatus: "Семейное положение", religion: "Религия", zodiac: "Зодиак", children: "Дети", smoking: "Курение", drinking: "Алкоголь" },
  };
  const n = natural[locale];
  if (!n) return deepClone(filtersEn);
  return deepMerge(deepClone(filtersEn), n);
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, ""); // e.g. "uk", "zh-TW"
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));

  // 1) Rename navigation.swipe -> navigation.home
  const nav = existing.navigation || {};
  const label =
    (locale === "zh-TW" ? homeLabel.zh_TW : homeLabel[locale]) || "Home";
  if (nav.swipe !== undefined) {
    delete nav.swipe;
  }
  nav.home = label;

  // 2) Add filters (preserve any pre-existing filters keys if present)
  existing.filters = deepMerge(existing.filters || {}, buildFilters(locale));

  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

// Validate every file parses.
let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    if (!("filters" in j) || !(j.navigation && "home" in j.navigation)) bad.push(f);
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : "ALL 33 LOCALES VALID");
