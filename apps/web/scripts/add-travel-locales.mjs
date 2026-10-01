/**
 * Adds the canTravel (profile declaration) and canTravelOnly (search filter)
 * keys to the 'filters' namespace in every locale JSON file in
 * apps/web/src/i18n/locales/.
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
  canTravel: "I can travel to your country",
  canTravelOnly: "Can travel to my country",
};

// Natural translations for Tier 1 languages.
const natural = {
  uk: {
    canTravel: "Можу прибути до вашої країни",
    canTravelOnly: "Може прибути до моєї країни",
  },
  ru: {
    canTravel: "Могу приехать в вашу страну",
    canTravelOnly: "Может приехать в мою страну",
  },
  de: {
    canTravel: "Ich kann in Ihr Land kommen",
    canTravelOnly: "Kann in mein Land kommen",
  },
  fr: {
    canTravel: "Je peux me rendre dans votre pays",
    canTravelOnly: "Peut se rendre dans mon pays",
  },
  es: {
    canTravel: "Puedo viajar a tu país",
    canTravelOnly: "Puede viajar a mi país",
  },
  pt: {
    canTravel: "Posso deslocar-me ao seu país",
    canTravelOnly: "Pode deslocar-se ao meu país",
  },
  ja: {
    canTravel: "あなたの国に伺えます",
    canTravelOnly: "私の国に来られる方",
  },
  ko: {
    canTravel: "당신의 국가로 갈 수 있어요",
    canTravelOnly: "제 국가에 올 수 있는 분",
  },
  zh: {
    canTravel: "我可以前往您的国家",
    canTravelOnly: "可以来我的国家",
  },
  ar: {
    canTravel: "يمكنني السفر إلى بلدك",
    canTravelOnly: "يمكنه السفر إلى بلدي",
  },
  vi: {
    canTravel: "Tôi có thể đến quốc gia của bạn",
    canTravelOnly: "Có thể đến quốc gia của tôi",
  },
  hi: {
    canTravel: "मैं आपके देश आ सकता हूँ",
    canTravelOnly: "मेरे देश आ सकता है",
  },
  tr: {
    canTravel: "Ülkenize gelebilirim",
    canTravelOnly: "Ülkeme gelebilir",
  },
  th: {
    canTravel: "ฉันเดินทางไปประเทศของคุณได้",
    canTravelOnly: "เดินทางมาประเทศของฉันได้",
  },
  id: {
    canTravel: "Saya bisa datang ke negara Anda",
    canTravelOnly: "Bisa datang ke negara saya",
  },
  ms: {
    canTravel: "Saya boleh datang ke negara anda",
    canTravelOnly: "Boleh datang ke negara saya",
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
    if (!("canTravel" in fKey) || !("canTravelOnly" in fKey)) {
      bad.push(f);
    }
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(
  bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : `ALL ${files.length} LOCALES VALID`,
);
