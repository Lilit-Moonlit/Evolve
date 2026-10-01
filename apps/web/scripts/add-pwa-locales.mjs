/**
 * Adds the `pwa.*` install-prompt keys to every locale JSON file.
 * Deterministic deep-merge; natural translations for Tier 1 languages,
 * English fallback for the rest.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

const en = {
  installTitle: "Install Evolve",
  installHint: "Install the app on your device for a faster experience",
  iosHint: "Tap Share, then 'Add to Home Screen' to install",
  install: "Install",
  dismiss: "Dismiss",
};

const natural = {
  uk: {
    installTitle: "Завантажити Evolve",
    installHint: "Встановіть додаток на свій пристрій для швидшої роботи",
    iosHint: "Натисніть «Поділитися», потім «На початковий екран»",
    install: "Завантажити",
    dismiss: "Закрити",
  },
  ru: {
    installTitle: "Установить Evolve",
    installHint: "Установите приложение на устройство для более быстрой работы",
    iosHint: "Нажмите «Поделиться», затем «На экран домой»",
    install: "Установить",
    dismiss: "Закрыть",
  },
  de: {
    installTitle: "Evolve installieren",
    installHint: "Installieren Sie die App für ein schnelleres Erlebnis",
    iosHint: "Tippen Sie auf „Teilen“, dann „Zum Home-Bildschirm“",
    install: "Installieren",
    dismiss: "Schließen",
  },
  fr: {
    installTitle: "Installer Evolve",
    installHint: "Installez l'application pour une expérience plus rapide",
    iosHint: "Touchez « Partager », puis « Sur l'écran d'accueil »",
    install: "Installer",
    dismiss: "Fermer",
  },
  es: {
    installTitle: "Instalar Evolve",
    installHint: "Instala la app para una experiencia más rápida",
    iosHint: "Pulse « Compartir » y luego « Añadir a pantalla de inicio »",
    install: "Instalar",
    dismiss: "Cerrar",
  },
  pt: {
    installTitle: "Instalar Evolve",
    installHint: "Instale o app para uma experiência mais rápida",
    iosHint: "Toque em « Partilhar » e depois « Adicionar ao ecrã principal »",
    install: "Instalar",
    dismiss: "Fechar",
  },
  ja: {
    installTitle: "Evolveをインストール",
    installHint: "より速い体験のためにアプリをインストールしてください",
    iosHint: "「共有」→「ホーム画面に追加」をタップ",
    install: "インストール",
    dismiss: "閉じる",
  },
  ar: {
    installTitle: "تثبيت Evolve",
    installHint: "ثبّت التطبيق للحصول على تجربة أسرع",
    iosHint: "اضغط على «مشاركة» ثم «إضافة إلى الشاشة الرئيسية»",
    install: "تثبيت",
    dismiss: "إغلاق",
  },
  vi: {
    installTitle: "Cài đặt Evolve",
    installHint: "Cài ứng dụng để có trải nghiệm nhanh hơn",
    iosHint: "Chạm «Chia sẻ», rồi «Thêm vào màn hình chính»",
    install: "Cài đặt",
    dismiss: "Đóng",
  },
  "zh-TW": {
    installTitle: "安裝 Evolve",
    installHint: "安裝應用程式以獲得更快的體驗",
    iosHint: "點擊「分享」，然後「加入主畫面」",
    install: "安裝",
    dismiss: "關閉",
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

function buildPwa(locale) {
  const n = natural[locale];
  if (!n) return deepClone(en);
  return deepMerge(deepClone(en), n);
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, "");
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));
  existing.pwa = deepMerge(existing.pwa || {}, buildPwa(locale));
  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const p = j.pwa || {};
    if (!p.installTitle || !p.installHint || !p.iosHint || !p.install || !p.dismiss) bad.push(f);
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(
  bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : `ALL ${files.length} LOCALES VALID`,
);
