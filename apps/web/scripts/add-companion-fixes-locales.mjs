/**
 * Adds the Companion-mode fixes keys (photo-verification gating hint + empty
 * list states) to every locale JSON file in apps/web/src/i18n/locales/.
 *
 * Deterministic, non-LLM: preserves all existing keys via deep merge and only
 * adds what the LabVerifyPatient / Search / LabDashboard UI consumes.
 *
 * Natural translations for Tier 1 languages (uk ru de fr es pt ja ar vi zh-TW);
 * all other locales fall back to English (repo Tier 2 convention).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

// English source (under the `companion` namespace).
const en = {
  lab: {
    verifyAllPhotos: "Please evaluate every photo before confirming.",
    noPatients: "No patients found",
  },
  profile: {
    noUsers: "No users found",
  },
};

// Natural translations for Tier 1 languages.
const natural = {
  uk: {
    lab: {
      verifyAllPhotos: "Будь ласка, оцініть кожне фото перед підтвердженням.",
      noPatients: "Пацієнтів не знайдено",
    },
    profile: { noUsers: "Користувачів не знайдено" },
  },
  ru: {
    lab: {
      verifyAllPhotos: "Пожалуйста, оцените каждое фото перед подтверждением.",
      noPatients: "Пациенты не найдены",
    },
    profile: { noUsers: "Пользователи не найдены" },
  },
  de: {
    lab: {
      verifyAllPhotos: "Bitte bewerten Sie jedes Foto, bevor Sie bestätigen.",
      noPatients: "Keine Patienten gefunden",
    },
    profile: { noUsers: "Keine Nutzer gefunden" },
  },
  fr: {
    lab: {
      verifyAllPhotos: "Veuillez évaluer chaque photo avant de confirmer.",
      noPatients: "Aucun patient trouvé",
    },
    profile: { noUsers: "Aucun utilisateur trouvé" },
  },
  es: {
    lab: {
      verifyAllPhotos: "Evalúe cada foto antes de confirmar.",
      noPatients: "No se encontraron pacientes",
    },
    profile: { noUsers: "No se encontraron usuarios" },
  },
  pt: {
    lab: {
      verifyAllPhotos: "Avalie cada foto antes de confirmar.",
      noPatients: "Nenhum paciente encontrado",
    },
    profile: { noUsers: "Nenhum usuário encontrado" },
  },
  ja: {
    lab: {
      verifyAllPhotos: "確認する前に各写真を評価してください。",
      noPatients: "患者が見つかりません",
    },
    profile: { noUsers: "ユーザーが見つかりません" },
  },
  ar: {
    lab: {
      verifyAllPhotos: "يرجى تقييم كل صورة قبل التأكيد.",
      noPatients: "لم يتم العثور على مرضى",
    },
    profile: { noUsers: "لم يتم العثور على مستخدمين" },
  },
  vi: {
    lab: {
      verifyAllPhotos: "Vui lòng đánh giá từng ảnh trước khi xác nhận.",
      noPatients: "Không tìm thấy bệnh nhân",
    },
    profile: { noUsers: "Không tìm thấy người dùng" },
  },
  "zh-TW": {
    lab: {
      verifyAllPhotos: "請在確認前評估每張照片。",
      noPatients: "未找到患者",
    },
    profile: { noUsers: "未找到使用者" },
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

function buildCompanionPatch(locale) {
  const n = natural[locale];
  if (!n) return deepClone(en);
  return {
    lab: deepMerge(deepClone(en.lab), n.lab),
    profile: deepMerge(deepClone(en.profile), n.profile),
  };
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, "");
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));

  const patch = buildCompanionPatch(locale);
  existing.companion = deepMerge(existing.companion || {}, {
    lab: patch.lab,
    profile: patch.profile,
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
    const c = j.companion || {};
    if (!c.lab || !c.lab.verifyAllPhotos || !c.lab.noPatients || !c.profile || !c.profile.noUsers) {
      bad.push(f);
    }
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(
  bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : `ALL ${files.length} LOCALES VALID`,
);
