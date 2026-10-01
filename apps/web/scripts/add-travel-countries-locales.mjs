/**
 * Adds the profile.canTravel.* keys (countries panel title, select-all,
 * loading hint) to every locale JSON file in apps/web/src/i18n/locales/.
 *
 * Deterministic, non-LLM: preserves all existing keys via deep merge.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

// English source (Tier 2 fallback).
const en = {
  countriesTitle: "Countries I can travel to",
  selectAll: "Select all",
  loadingCountries: "Loading countries…",
};

// Natural translations for Tier 1 languages.
const natural = {
  uk: {
    countriesTitle: "Країни, до яких я можу прибути",
    selectAll: "Відмітити усі",
    loadingCountries: "Завантаження списку країн…",
  },
  ru: {
    countriesTitle: "Страны, в которые я могу приехать",
    selectAll: "Отметить все",
    loadingCountries: "Загрузка списка стран…",
  },
  de: {
    countriesTitle: "Länder, in die ich reisen kann",
    selectAll: "Alle auswählen",
    loadingCountries: "Länder werden geladen…",
  },
  fr: {
    countriesTitle: "Pays où je peux me rendre",
    selectAll: "Tout sélectionner",
    loadingCountries: "Chargement des pays…",
  },
  es: {
    countriesTitle: "Países a los que puedo viajar",
    selectAll: "Seleccionar todos",
    loadingCountries: "Cargando países…",
  },
  pt: {
    countriesTitle: "Países para onde posso viajar",
    selectAll: "Selecionar todos",
    loadingCountries: "A carregar países…",
  },
  ja: {
    countriesTitle: "渡航できる国",
    selectAll: "すべて選択",
    loadingCountries: "国リストを読み込み中…",
  },
  ko: {
    countriesTitle: "갈 수 있는 국가",
    selectAll: "모두 선택",
    loadingCountries: "국가 목록 불러오는 중…",
  },
  zh: {
    countriesTitle: "我可以前往的国家",
    selectAll: "全选",
    loadingCountries: "正在加载国家列表…",
  },
  ar: {
    countriesTitle: "الدول التي يمكنني السفر إليها",
    selectAll: "تحديد الكل",
    loadingCountries: "جارٍ تحميل قائمة الدول…",
  },
  vi: {
    countriesTitle: "Các quốc gia tôi có thể đến",
    selectAll: "Chọn tất cả",
    loadingCountries: "Đang tải danh sách quốc gia…",
  },
  hi: {
    countriesTitle: "वे देश जहाँ मैं आ सकता हूँ",
    selectAll: "सभी चुनें",
    loadingCountries: "देशों की सूची लोड हो रही है…",
  },
  tr: {
    countriesTitle: "Gidebileceğim ülkeler",
    selectAll: "Tümünü seç",
    loadingCountries: "Ülke listesi yükleniyor…",
  },
  th: {
    countriesTitle: "ประเทศที่ฉันเดินทางไปได้",
    selectAll: "เลือกทั้งหมด",
    loadingCountries: "กำลังโหลดรายชื่อประเทศ…",
  },
  id: {
    countriesTitle: "Negara yang bisa saya tuju",
    selectAll: "Pilih semua",
    loadingCountries: "Memuat daftar negara…",
  },
  ms: {
    countriesTitle: "Negara yang boleh saya pergi",
    selectAll: "Pilih semua",
    loadingCountries: "Memuatkan senarai negara…",
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

function buildCanTravel(locale) {
  const n = natural[locale];
  return n ? { ...en, ...n } : { ...en };
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, "");
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));

  // Add keys under profile.canTravel (preserve existing).
  existing.profile = deepMerge(existing.profile || {}, {
    canTravel: buildCanTravel(locale),
  });

  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

// Validate every file parses and has the required keys.
let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const c = (j.profile || {}).canTravel || {};
    if (!("countriesTitle" in c) || !("selectAll" in c) || !("loadingCountries" in c)) {
      bad.push(f);
    }
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(
  bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : `ALL ${files.length} LOCALES VALID`,
);
