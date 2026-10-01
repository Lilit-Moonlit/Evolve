/**
 * Adds `auth.landing.securityTitle` and `auth.landing.securityDescription` to
 * every locale. These keys were referenced by AuthLanding but never defined,
 * so users saw raw keys (auth.landing.securityTitle) instead of readable text.
 *
 * Deterministic, non-LLM. Natural translations for Tier 1 languages; Tier 2
 * locales fall back to English (per repo TIER2 convention).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

const fallback = {
  securityTitle: "Your data stays private",
  securityDescription:
    "Profiles are encrypted and stored on decentralized networks — your personal information is never shared without your consent.",
  questionRecovery: "🔐 Recover account via security question",
};

// Natural translations for the major Tier 1 languages present in this repo.
// Any language not listed here falls back to English (Tier 2 convention).
const lang = {
  uk: {
    securityTitle: "Ваші дані під захистом",
    securityDescription:
      "Профілі зашифровані та зберігаються в децентралізованих мережах — ваша особиста інформація ніколи не передається без вашої згоди.",
    questionRecovery: "🔐 Відновити акаунт через секретне питання",
  },
  de: {
    securityTitle: "Ihre Daten bleiben privat",
    securityDescription:
      "Profile sind verschlüsselt und werden in dezentralen Netzwerken gespeichert — Ihre persönlichen Daten werden nie ohne Ihre Zustimmung weitergegeben.",
    questionRecovery: "🔐 Konto per Sicherheitsfrage wiederherstellen",
  },
  fr: {
    securityTitle: "Vos données restent privées",
    securityDescription:
      "Les profils sont chiffrés et stockés sur des réseaux décentralisés — vos informations personnelles ne sont jamais partagées sans votre consentement.",
    questionRecovery: "🔐 Récupérer le compte via une question de sécurité",
  },
  es: {
    securityTitle: "Tus datos permanecen privados",
    securityDescription:
      "Los perfiles están cifrados y se almacenan en redes descentralizadas — tu información personal nunca se comparte sin tu consentimiento.",
    questionRecovery: "🔐 Recuperar cuenta con pregunta de seguridad",
  },
  pt: {
    securityTitle: "Os seus dados continuam privados",
    securityDescription:
      "Os perfis são encriptados e armazenados em redes descentralizadas — a sua informação pessoal nunca é partilhada sem o seu consentimento.",
    questionRecovery: "🔐 Recuperar conta com pergunta de segurança",
  },
  ja: {
    securityTitle: "あなたのデータは非公開のままです",
    securityDescription:
      "プロフィールは暗号化され、分散ネットワークに保存されます。あなたの個人情報が、あなたの同意なしに共有されることはありません。",
    questionRecovery: "🔐 秘密の質問でアカウントを回復",
  },
  zh: {
    securityTitle: "您的数据保持私密",
    securityDescription:
      "个人资料经过加密并存储在去中心化网络中——未经您的同意，您的个人信息绝不会被共享。",
    questionRecovery: "🔐 通过安全问题恢复账户",
  },
  ar: {
    securityTitle: "تظل بياناتك خاصة",
    securityDescription:
      "يتم تشفير الملفات الشخصية وتخزينها على شبكات لامركزية — لا تتم مشاركة معلوماتك الشخصية أبدًا دون موافقتك.",
    questionRecovery: "🔐 استعادة الحساب عبر سؤال الأمان",
  },
  vi: {
    securityTitle: "Dữ liệu của bạn luôn được bảo mật",
    securityDescription:
      "Hồ sơ được mã hóa và lưu trữ trên các mạng phi tập trung — thông tin cá nhân của bạn không bao giờ bị chia sẻ mà không có sự đồng ý.",
    questionRecovery: "🔐 Khôi phục tài khoản bằng câu hỏi bảo mật",
  },
  ru: {
    securityTitle: "Ваши данные остаются приватными",
    securityDescription:
      "Профили зашифрованы и хранятся в децентрализованных сетях — ваша личная информация никогда не передаётся без вашего согласия.",
    questionRecovery: "🔐 Восстановить аккаунт через секретный вопрос",
  },
};

function deepMerge(target, source) {
  const out = { ...target };
  for (const k of Object.keys(source)) {
    if (source[k] && typeof source[k] === "object" && !Array.isArray(source[k])) {
      out[k] = deepMerge(out[k] || {}, source[k]);
    } else {
      out[k] = source[k];
    }
  }
  return out;
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, "");
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));

  const bucket = lang[locale];
  const notice = bucket || fallback;

  existing.auth = existing.auth || {};
  existing.auth.landing = existing.auth.landing || {};
  existing.auth.landing.securityTitle = notice.securityTitle;
  existing.auth.landing.securityDescription = notice.securityDescription;

  // We only add questionRecovery as a button LABEL if the landing block does
  // not already define one (top-level `questionRecovery` is the form object).
  if (!existing.auth.landing.questionRecovery) {
    existing.auth.landing.questionRecovery = notice.questionRecovery;
  }

  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const landing = (j.auth || {}).landing || {};
    if (!(landing.securityTitle && landing.securityDescription && landing.questionRecovery)) {
      bad.push(`${f}: missing securityTitle/securityDescription/questionRecovery`);
    }
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(
  bad.length
    ? `VALIDATION ISSUES:\n${bad.join("\n")}`
    : "ALL 33 LOCALES VALID (auth.landing security keys)",
);
