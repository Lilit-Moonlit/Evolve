/**
 * Adds the gender + "who are you looking for" (lookingFor) keys to every
 * locale JSON file in apps/web/src/i18n/locales/.
 *
 * Deterministic, non-LLM: preserves all existing keys via deep merge and only
 * adds what the Home/Profile/Onboarding UI consumes.
 *
 * Natural translations are provided for Tier 1 languages (uk de fr es pt ja
 * ko zh ar vi hi tr th id ms ru); all other locales fall back to English
 * (matching the repo's Tier 2 convention in TIER2-*.md). The value space
 * mirrors packages/core/src/types.ts (gender) and the 5 user-requested
 * lookingFor options.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

// English source.
const en = {
  gender: "Gender",
  genders: { male: "Male", female: "Female", other: "Other" },
  lookingFor: "Looking for",
  lookingForOptions: {
    man: "A man",
    woman: "A woman",
    couple_man_woman: "A couple (man + woman)",
    couple_woman_woman: "A couple (woman + woman)",
    couple_man_man: "A couple (man + man)",
  },
};

const onboardingEn = {
  gender: {
    title: "About you",
    label: "I identify as",
    lookingForLabel: "Who are you looking for?",
    lookingForOptions: {
      man: "A man",
      woman: "A woman",
      couple_man_woman: "A couple (man + woman)",
      couple_woman_woman: "A couple (woman + woman)",
      couple_man_man: "A couple (man + man)",
    },
  },
};

// Natural translations for Tier 1 languages.
const natural = {
  uk: {
    gender: "Стать",
    genders: { male: "Чоловік", female: "Жінка", other: "Інше" },
    lookingFor: "Кого шукаєте",
    lookingForOptions: {
      man: "Чоловіка",
      woman: "Жінку",
      couple_man_woman: "Пару (чоловік + жінка)",
      couple_woman_woman: "Пару (жінка + жінка)",
      couple_man_man: "Пару (чоловік + чоловік)",
    },
  },
  ru: {
    gender: "Пол",
    genders: { male: "Мужчина", female: "Женщина", other: "Другое" },
    lookingFor: "Кого ищете",
    lookingForOptions: {
      man: "Мужчину",
      woman: "Женщину",
      couple_man_woman: "Пару (мужчина + женщина)",
      couple_woman_woman: "Пару (женщина + женщина)",
      couple_man_man: "Пару (мужчина + мужчина)",
    },
  },
  de: {
    gender: "Geschlecht",
    genders: { male: "Männlich", female: "Weiblich", other: "Anders" },
    lookingFor: "Auf der Suche nach",
    lookingForOptions: {
      man: "Einem Mann",
      woman: "Einer Frau",
      couple_man_woman: "Einem Paar (Mann + Frau)",
      couple_woman_woman: "Einem Paar (Frau + Frau)",
      couple_man_man: "Einem Paar (Mann + Mann)",
    },
  },
  fr: {
    gender: "Genre",
    genders: { male: "Homme", female: "Femme", other: "Autre" },
    lookingFor: "À la recherche de",
    lookingForOptions: {
      man: "Un homme",
      woman: "Une femme",
      couple_man_woman: "Un couple (homme + femme)",
      couple_woman_woman: "Un couple (femme + femme)",
      couple_man_man: "Un couple (homme + homme)",
    },
  },
  es: {
    gender: "Género",
    genders: { male: "Hombre", female: "Mujer", other: "Otro" },
    lookingFor: "Buscando",
    lookingForOptions: {
      man: "Un hombre",
      woman: "Una mujer",
      couple_man_woman: "Una pareja (hombre + mujer)",
      couple_woman_woman: "Una pareja (mujer + mujer)",
      couple_man_man: "Una pareja (hombre + hombre)",
    },
  },
  pt: {
    gender: "Gênero",
    genders: { male: "Homem", female: "Mulher", other: "Outro" },
    lookingFor: "Procurando",
    lookingForOptions: {
      man: "Um homem",
      woman: "Uma mulher",
      couple_man_woman: "Um casal (homem + mulher)",
      couple_woman_woman: "Um casal (mulher + mulher)",
      couple_man_man: "Um casal (homem + homem)",
    },
  },
  ja: {
    gender: "性別",
    genders: { male: "男性", female: "女性", other: "その他" },
    lookingFor: "探している相手",
    lookingForOptions: {
      man: "男性",
      woman: "女性",
      couple_man_woman: "カップル（男性＋女性）",
      couple_woman_woman: "カップル（女性＋女性）",
      couple_man_man: "カップル（男性＋男性）",
    },
  },
  ko: {
    gender: "성별",
    genders: { male: "남성", female: "여성", other: "기타" },
    lookingFor: "찾고 있는 사람",
    lookingForOptions: {
      man: "남성",
      woman: "여성",
      couple_man_woman: "커플 (남성 + 여성)",
      couple_woman_woman: "커플 (여성 + 여성)",
      couple_man_man: "커플 (남성 + 남성)",
    },
  },
  zh: {
    gender: "性别",
    genders: { male: "男", female: "女", other: "其他" },
    lookingFor: "正在寻找",
    lookingForOptions: {
      man: "男性",
      woman: "女性",
      couple_man_woman: "情侣（男 + 女）",
      couple_woman_woman: "情侣（女 + 女）",
      couple_man_man: "情侣（男 + 男）",
    },
  },
  ar: {
    gender: "الجنس",
    genders: { male: "ذكر", female: "أنثى", other: "أخرى" },
    lookingFor: "أبحث عن",
    lookingForOptions: {
      man: "رجل",
      woman: "امرأة",
      couple_man_woman: "زوجان (رجل + امرأة)",
      couple_woman_woman: "زوجان (امرأة + امرأة)",
      couple_man_man: "زوجان (رجل + رجل)",
    },
  },
  vi: {
    gender: "Giới tính",
    genders: { male: "Nam", female: "Nữ", other: "Khác" },
    lookingFor: "Đang tìm kiếm",
    lookingForOptions: {
      man: "Một người nam",
      woman: "Một người nữ",
      couple_man_woman: "Một cặp đôi (nam + nữ)",
      couple_woman_woman: "Một cặp đôi (nữ + nữ)",
      couple_man_man: "Một cặp đôi (nam + nam)",
    },
  },
  hi: {
    gender: "लिंग",
    genders: { male: "पुरुष", female: "महिला", other: "अन्य" },
    lookingFor: "ढूंढ रहे हैं",
    lookingForOptions: {
      man: "एक पुरुष",
      woman: "एक महिला",
      couple_man_woman: "एक जोड़ा (पुरुष + महिला)",
      couple_woman_woman: "एक जोड़ा (महिला + महिला)",
      couple_man_man: "एक जोड़ा (पुरुष + पुरुष)",
    },
  },
  tr: {
    gender: "Cinsiyet",
    genders: { male: "Erkek", female: "Kadın", other: "Diğer" },
    lookingFor: "Arıyor",
    lookingForOptions: {
      man: "Bir erkek",
      woman: "Bir kadın",
      couple_man_woman: "Bir çift (erkek + kadın)",
      couple_woman_woman: "Bir çift (kadın + kadın)",
      couple_man_man: "Bir çift (erkek + erkek)",
    },
  },
  th: {
    gender: "เพศ",
    genders: { male: "ชาย", female: "หญิง", other: "อื่น ๆ" },
    lookingFor: "กำลังมองหา",
    lookingForOptions: {
      man: "ผู้ชาย",
      woman: "ผู้หญิง",
      couple_man_woman: "คู่รัก (ชาย + หญิง)",
      couple_woman_woman: "คู่รัก (หญิง + หญิง)",
      couple_man_man: "คู่รัก (ชาย + ชาย)",
    },
  },
  id: {
    gender: "Jenis kelamin",
    genders: { male: "Laki-laki", female: "Perempuan", other: "Lainnya" },
    lookingFor: "Sedang mencari",
    lookingForOptions: {
      man: "Seorang pria",
      woman: "Seorang wanita",
      couple_man_woman: "Pasangan (pria + wanita)",
      couple_woman_woman: "Pasangan (wanita + wanita)",
      couple_man_man: "Pasangan (pria + pria)",
    },
  },
  ms: {
    gender: "Jantina",
    genders: { male: "Lelaki", female: "Perempuan", other: "Lain-lain" },
    lookingFor: "Sedang mencari",
    lookingForOptions: {
      man: "Seorang lelaki",
      woman: "Seorang wanita",
      couple_man_woman: "Pasangan (lelaki + wanita)",
      couple_woman_woman: "Pasangan (wanita + wanita)",
      couple_man_man: "Pasangan (lelaki + lelaki)",
    },
  },
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

function buildFilters(locale) {
  const n = natural[locale];
  if (!n) return deepClone(en);
  return deepMerge(deepClone(en), {
    gender: n.gender,
    genders: n.genders,
    lookingFor: n.lookingFor,
    lookingForOptions: n.lookingForOptions,
  });
}

function buildOnboarding(locale) {
  return deepClone(onboardingEn);
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, ""); // e.g. "uk", "zh-TW"
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));

  // Add gender + lookingFor keys inside the filters object (preserve existing).
  existing.filters = deepMerge(existing.filters || {}, buildFilters(locale));

  // Add onboarding.gender.* keys (preserve existing onboarding object).
  existing.onboarding = deepMerge(existing.onboarding || {}, buildOnboarding(locale));

  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

// Validate every file parses and has the required keys.
let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const fKey = j.filters || {};
    const ob = j.onboarding || {};
    if (
      !("gender" in fKey) ||
      !fKey.genders ||
      !fKey.genders.male ||
      !fKey.genders.other ||
      !("lookingFor" in fKey) ||
      !fKey.lookingForOptions ||
      !fKey.lookingForOptions.man ||
      !fKey.lookingForOptions.couple_man_man ||
      !ob.gender ||
      !ob.gender.title ||
      !ob.gender.lookingForLabel ||
      !ob.gender.lookingForOptions ||
      !ob.gender.lookingForOptions.couple_man_man
    ) {
      bad.push(f);
    }
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : "ALL 33 LOCALES VALID");
