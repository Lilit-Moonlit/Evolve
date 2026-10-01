/**
 * Adds the profileKind and onboarding.kind keys to every locale JSON file
 * in apps/web/src/i18n/locales/.
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
  profileKind: {
    title: "Who you are",
    woman: "Woman",
    man: "Man",
    couple_man_woman: "Couple (M+F)",
    couple_man_man: "Couple (M+M)",
    couple_woman_woman: "Couple (F+F)",
    laboratory: "Laboratory",
  },
  onboarding: {
    kind: {
      title: "Who you are",
    },
  },
};

// Natural translations.
const natural = {
  uk: {
    profileKind: {
      title: "Ким ви є",
      woman: "Жінка",
      man: "Чоловік",
      couple_man_woman: "Пара (М+Ж)",
      couple_man_man: "Пара (М+М)",
      couple_woman_woman: "Пара (Ж+Ж)",
      laboratory: "Лабораторія",
    },
    onboarding: { kind: { title: "Ким ви є" } },
  },
  ru: {
    profileKind: {
      title: "Кто вы",
      woman: "Женщина",
      man: "Мужчина",
      couple_man_woman: "Пара (М+Ж)",
      couple_man_man: "Пара (М+М)",
      couple_woman_woman: "Пара (Ж+Ж)",
      laboratory: "Лаборатория",
    },
    onboarding: { kind: { title: "Кто вы" } },
  },
  de: {
    profileKind: {
      title: "Wer Sie sind",
      woman: "Frau",
      man: "Mann",
      couple_man_woman: "Paar (M+F)",
      couple_man_man: "Paar (M+M)",
      couple_woman_woman: "Paar (F+F)",
      laboratory: "Labor",
    },
    onboarding: { kind: { title: "Wer Sie sind" } },
  },
  fr: {
    profileKind: {
      title: "Qui vous êtes",
      woman: "Femme",
      man: "Homme",
      couple_man_woman: "Couple (H+F)",
      couple_man_man: "Couple (H+H)",
      couple_woman_woman: "Couple (F+F)",
      laboratory: "Laboratoire",
    },
    onboarding: { kind: { title: "Qui vous êtes" } },
  },
  es: {
    profileKind: {
      title: "Quién eres",
      woman: "Mujer",
      man: "Hombre",
      couple_man_woman: "Pareja (H+M)",
      couple_man_man: "Pareja (H+H)",
      couple_woman_woman: "Pareja (M+M)",
      laboratory: "Laboratorio",
    },
    onboarding: { kind: { title: "Quién eres" } },
  },
  pt: {
    profileKind: {
      title: "Quem você é",
      woman: "Mulher",
      man: "Homem",
      couple_man_woman: "Casal (H+M)",
      couple_man_man: "Casal (H+H)",
      couple_woman_woman: "Casal (M+M)",
      laboratory: "Laboratório",
    },
    onboarding: { kind: { title: "Quem você é" } },
  },
  ja: {
    profileKind: {
      title: "あなたについて",
      woman: "女性",
      man: "男性",
      couple_man_woman: "カップル（男+女）",
      couple_man_man: "カップル（男+男）",
      couple_woman_woman: "カップル（女+女）",
      laboratory: "検査機関",
    },
    onboarding: { kind: { title: "あなたについて" } },
  },
  ko: {
    profileKind: {
      title: "당신은 누구인가요",
      woman: "여성",
      man: "남성",
      couple_man_woman: "커플(남+여)",
      couple_man_man: "커플(남+남)",
      couple_woman_woman: "커플(여+여)",
      laboratory: "검사소",
    },
    onboarding: { kind: { title: "당신은 누구인가요" } },
  },
  zh: {
    profileKind: {
      title: "你是谁",
      woman: "女性",
      man: "男性",
      couple_man_woman: "情侣（男+女）",
      couple_man_man: "情侣（男+男）",
      couple_woman_woman: "情侣（女+女）",
      laboratory: "实验室",
    },
    onboarding: { kind: { title: "你是谁" } },
  },
  ar: {
    profileKind: {
      title: "من أنت",
      woman: "امرأة",
      man: "رجل",
      couple_man_woman: "زوجان (رجل+امرأة)",
      couple_man_man: "زوجان (رجل+رجل)",
      couple_woman_woman: "زوجان (امرأة+امرأة)",
      laboratory: "مختبر",
    },
    onboarding: { kind: { title: "من أنت" } },
  },
  vi: {
    profileKind: {
      title: "Bạn là ai",
      woman: "Phụ nữ",
      man: "Đàn ông",
      couple_man_woman: "Cặp đôi (Nam+Nữ)",
      couple_man_man: "Cặp đôi (Nam+Nam)",
      couple_woman_woman: "Cặp đôi (Nữ+Nữ)",
      laboratory: "Phòng xét nghiệm",
    },
    onboarding: { kind: { title: "Bạn là ai" } },
  },
  hi: {
    profileKind: {
      title: "आप कौन हैं",
      woman: "महिला",
      man: "पुरुष",
      couple_man_woman: "जोड़ी (पु+स्त्री)",
      couple_man_man: "जोड़ी (पु+पु)",
      couple_woman_woman: "जोड़ी (स्त्री+स्त्री)",
      laboratory: "प्रयोगशाला",
    },
    onboarding: { kind: { title: "आप कौन हैं" } },
  },
  tr: {
    profileKind: {
      title: "Kimsiniz",
      woman: "Kadın",
      man: "Erkek",
      couple_man_woman: "Çift (E+K)",
      couple_man_man: "Çift (E+E)",
      couple_woman_woman: "Çift (K+K)",
      laboratory: "Laboratuvar",
    },
    onboarding: { kind: { title: "Kimsiniz" } },
  },
  th: {
    profileKind: {
      title: "คุณคือใคร",
      woman: "หญิง",
      man: "ชาย",
      couple_man_woman: "คู่ (ช+ห)",
      couple_man_man: "คู่ (ช+ช)",
      couple_woman_woman: "คู่ (ห+ห)",
      laboratory: "ห้องปฏิบัติการ",
    },
    onboarding: { kind: { title: "คุณคือใคร" } },
  },
  id: {
    profileKind: {
      title: "Siapa Anda",
      woman: "Wanita",
      man: "Pria",
      couple_man_woman: "Pasangan (P+W)",
      couple_man_man: "Pasangan (P+P)",
      couple_woman_woman: "Pasangan (W+W)",
      laboratory: "Laboratorium",
    },
    onboarding: { kind: { title: "Siapa Anda" } },
  },
  ms: {
    profileKind: {
      title: "Siapa anda",
      woman: "Wanita",
      man: "Lelaki",
      couple_man_woman: "Pasangan (L+P)",
      couple_man_man: "Pasangan (L+L)",
      couple_woman_woman: "Pasangan (P+P)",
      laboratory: "Makmal",
    },
    onboarding: { kind: { title: "Siapa anda" } },
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

function buildData(locale) {
  const n = natural[locale];
  return n ? deepMerge(en, n) : en;
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, "");
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));

  const data = buildData(locale);
  existing.profileKind = deepMerge(existing.profileKind || {}, data.profileKind);
  existing.onboarding = deepMerge(existing.onboarding || {}, data.onboarding);

  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

// Validate every file parses and has the required keys.
let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const pk = j.profileKind || {};
    const ob = j.onboarding?.kind || {};
    if (
      !("title" in pk) ||
      !("woman" in pk) ||
      !("man" in pk) ||
      !("couple_man_woman" in pk) ||
      !("couple_man_man" in pk) ||
      !("couple_woman_woman" in pk) ||
      !("laboratory" in pk) ||
      !("title" in ob)
    ) {
      bad.push(f);
    }
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(
  bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : `ALL ${files.length} LOCALES VALID`,
);
