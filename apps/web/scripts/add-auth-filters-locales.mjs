/**
 * Adds auth (email sign-in) + minimalist-filters + medical-card keys to every
 * locale. Ukrainian gets natural translations; all other locales fall back to
 * English (Tier-2 convention). Deterministic deep-merge.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

const en = {
  filters: {
    searchTarget: "Search for",
    searchTargets: { man: "Man", woman: "Woman", laboratory: "Laboratory" },
    stdCompatible: "STD compatible",
    noLabs: "No laboratories found",
  },
  profile: {
    tabs: { medical: "Medical card" },
    medical: {
      title: "My medical card",
      subtitle: "Your patient card with a QR code for in-person lab visits",
      labTitle: "Laboratory",
      labSubtitle: "Run a lab? Register it to scan patient QR codes and add results",
    },
  },
  companion: {
    lab: {
      nameLabel: "Laboratory name",
      namePlaceholder: "Enter laboratory name",
      descriptionPlaceholder: "Describe your laboratory",
      addressPlaceholder: "Enter address",
      phonePlaceholder: "Enter phone number",
      emailLabel: "Email",
      emailPlaceholder: "Enter email",
      registerButton: "Register",
    },
  },
  auth: {
    emailAuth: {
      loginTitle: "Sign in with email",
      registerTitle: "Create account",
      modeLogin: "Sign in",
      modeRegister: "Register",
      emailLabel: "Email",
      passwordLabel: "Password",
      confirmLabel: "Confirm password",
      loginButton: "Sign in",
      registerButton: "Create account",
      errorRequired: "Email and password are required",
      errorPasswordsDiffer: "Passwords do not match",
      errorExists: "This email is already registered",
      errorCredentials: "Invalid email or password",
      errorFailed: "Something went wrong. Try again",
      questionTitle: "Create your secret question",
      questionHint:
        "Invent the question and answer yourself — any language, any symbols. It is your passwordless login method.",
      questionLabel: "Your question",
      questionPlaceholder: "e.g. What was the name of my first pet?",
      answerLabel: "Your answer",
      answerPlaceholder: "Your answer",
      questionSave: "Save and continue",
      errorQuestionRequired: "Question and answer are required",
    },
  },
};

const uk = {
  filters: {
    searchTarget: "Шукаю",
    searchTargets: { man: "Чоловіка", woman: "Жінку", laboratory: "Лабораторію" },
    stdCompatible: "ІПСШ сумісні",
    noLabs: "Лабораторій не знайдено",
  },
  profile: {
    tabs: { medical: "Медична картка" },
    medical: {
      title: "Моя медична картка",
      subtitle: "Ваша картка пацієнта з QR-кодом для візиту в лабораторію",
      labTitle: "Лабораторія",
      labSubtitle:
        "Керуєте лабораторією? Зареєструйте її, щоб сканувати QR-коди пацієнтів і додавати результати",
    },
  },
  companion: {
    lab: {
      nameLabel: "Назва лабораторії",
      namePlaceholder: "Введіть назву лабораторії",
      descriptionPlaceholder: "Опишіть вашу лабораторію",
      addressPlaceholder: "Введіть адресу",
      phonePlaceholder: "Введіть номер телефону",
      emailLabel: "Електронна пошта",
      emailPlaceholder: "Введіть email",
      registerButton: "Зареєструвати",
    },
  },
  auth: {
    emailAuth: {
      loginTitle: "Вхід за електронною поштою",
      registerTitle: "Створити акаунт",
      modeLogin: "Увійти",
      modeRegister: "Зареєструватися",
      emailLabel: "Електронна пошта",
      passwordLabel: "Пароль",
      confirmLabel: "Підтвердьте пароль",
      loginButton: "Увійти",
      registerButton: "Створити акаунт",
      errorRequired: "Введіть email і пароль",
      errorPasswordsDiffer: "Паролі не збігаються",
      errorExists: "Цей email вже зареєстрований",
      errorCredentials: "Невірний email або пароль",
      errorFailed: "Щось пішло не так. Спробуйте ще раз",
      questionTitle: "Створіть ваше секретне питання",
      questionHint:
        "Ви самостійно вигадуєте питання та відповідь — будь-якою мовою, з будь-якими символами. Це ваш спосіб входу без пароля.",
      questionLabel: "Ваше питання",
      questionPlaceholder: "напр. Як звали мого першого улюбленця?",
      answerLabel: "Ваша відповідь",
      answerPlaceholder: "Ваша відповідь",
      questionSave: "Зберегти та продовжити",
      errorQuestionRequired: "Введіть питання та відповідь",
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

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, "");
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));
  const patch = locale === "uk" ? uk : en;

  existing.filters = deepMerge(existing.filters || {}, patch.filters);
  existing.profile = deepMerge(existing.profile || {}, patch.profile);
  existing.companion = deepMerge(existing.companion || {}, patch.companion);
  existing.auth = deepMerge(existing.auth || {}, patch.auth);

  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}
console.log(`Updated ${changed} locale files.`);

let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const ok =
      j.filters?.searchTarget &&
      j.filters?.searchTargets?.laboratory &&
      j.filters?.stdCompatible &&
      j.profile?.tabs?.medical &&
      j.profile?.medical?.title &&
      j.companion?.lab?.nameLabel &&
      j.auth?.emailAuth?.loginTitle;
    if (!ok) bad.push(f);
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : `ALL ${files.length} LOCALES VALID`);
