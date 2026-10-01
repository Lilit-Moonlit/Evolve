/**
 * Adds the whatSearch, whoSearch, and stdTests keys to the 'filters' namespace
 * in every locale JSON file in apps/web/src/i18n/locales/.
 *
 * Deterministic, non-LLM: preserves all existing keys via deep merge.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

// English source.
const en = {
  whatSearch: "What are you looking for",
  whoSearch: "Who are you looking for",
  stdTests: "Take STD tests",
};

// Natural translations for Tier 1 languages.
const natural = {
  uk: { whatSearch: "Що шукаєте", whoSearch: "Кого шукаєте", stdTests: "Здати ІПСШ тести" },
  ru: { whatSearch: "Что ищете", whoSearch: "Кого ищете", stdTests: "Сдать ИППП тесты" },
  de: { whatSearch: "Was suchst du?", whoSearch: "Wen suchst du?", stdTests: "STD-Tests machen" },
  fr: {
    whatSearch: "Que cherchez-vous ?",
    whoSearch: "Qui cherchez-vous ?",
    stdTests: "Passer des tests IST",
  },
  es: { whatSearch: "Qué buscas", whoSearch: "A quién buscas", stdTests: "Hacer pruebas de ITS" },
  pt: { whatSearch: "O que procura", whoSearch: "Quem procura", stdTests: "Fazer testes de IST" },
  ja: {
    whatSearch: "何をお探しですか",
    whoSearch: "どなたをお探しですか",
    stdTests: "性感染症の検査を受ける",
  },
  ko: {
    whatSearch: "무엇을 찾으시나요",
    whoSearch: "어떤 분을 찾으시나요",
    stdTests: "성병 검사 받기",
  },
  zh: { whatSearch: "您在寻找什么", whoSearch: "您在寻找谁", stdTests: "进行性病检测" },
  ar: {
    whatSearch: "ما الذي تبحث عنه",
    whoSearch: "من تبحث عنه",
    stdTests: "إجراء اختبارات الأمراض المنقولة جنسياً",
  },
  vi: {
    whatSearch: "Bạn tìm gì",
    whoSearch: "Bạn tìm ai",
    stdTests: "Xét nghiệm bệnh lây qua đường tình dục",
  },
  hi: {
    whatSearch: "आप क्या ढूंढ रहे हैं",
    whoSearch: "आप किसे ढूंढ रहे हैं",
    stdTests: "एसटीडी टेस्ट कराएं",
  },
  tr: {
    whatSearch: "Neyi arıyorsunuz",
    whoSearch: "Kimi arıyorsunuz",
    stdTests: "Cinsel yolla bulaşan hastalık testi yaptırın",
  },
  th: {
    whatSearch: "คุณกำลังมองหาอะไร",
    whoSearch: "คุณกำลังมองหาใคร",
    stdTests: "ตรวจโรคติดต่อทางเพศ",
  },
  id: {
    whatSearch: "Apa yang Anda cari",
    whoSearch: "Siapa yang Anda cari",
    stdTests: "Lakukan tes IMS",
  },
  ms: {
    whatSearch: "Apa yang anda cari",
    whoSearch: "Siapa yang anda cari",
    stdTests: "Buat ujian STD",
  },
};

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
  return n ? { ...en, ...n } : { ...en };
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, "");
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));

  // Add keys inside the filters object (preserve existing).
  existing.filters = deepMerge(existing.filters || {}, buildFilters(locale));

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
    if (!("whatSearch" in fKey) || !("whoSearch" in fKey) || !("stdTests" in fKey)) {
      bad.push(f);
    }
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(
  bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : `ALL ${files.length} LOCALES VALID`,
);
