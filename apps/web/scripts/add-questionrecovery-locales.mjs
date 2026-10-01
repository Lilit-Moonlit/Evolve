/**
 * Adds `common.back` and the `questionRecovery` object to every locale.
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

const template = {
  title: "Security question recovery",
  description:
    "Recover your account by answering the security question you set during registration.",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  next: "Next",
  nextLoading: "Looking up…",
  emailEntered: "Recovering for",
  questionLabel: "Security question",
  answerLabel: "Your answer",
  answerPlaceholder: "Type your answer",
  recover: "Recover account",
  recovering: "Verifying…",
  error: {
    emailRequired: "Please enter your email.",
    lookupFailed: "No account found with that email.",
    network: "Network error. Please try again.",
    answerRequired: "Please enter your answer.",
    failed: "Incorrect answer. Please try again.",
    noQuestion: "No security question is set for this account.",
  },
};

const lang = {
  uk: {
    back: "Назад",
    q: {
      title: "Відновлення за секретним питанням",
      description:
        "Відновіть свій обліковий запис, відповівши на секретне питання, яке ви встановили під час реєстрації.",
      emailLabel: "Електронна пошта",
      emailPlaceholder: "you@example.com",
      next: "Далі",
      nextLoading: "Пошук…",
      emailEntered: "Відновлення для",
      questionLabel: "Секретне питання",
      answerLabel: "Ваша відповідь",
      answerPlaceholder: "Введіть відповідь",
      recover: "Відновити обліковий запис",
      recovering: "Перевірка…",
      error: {
        emailRequired: "Введіть вашу електронну пошту.",
        lookupFailed: "Обліковий запис із такою поштою не знайдено.",
        network: "Помилка мережі. Спробуйте ще раз.",
        answerRequired: "Введіть вашу відповідь.",
        failed: "Неправильна відповідь. Спробуйте ще раз.",
        noQuestion: "Для цього облікового запису секретне питання не встановлено.",
      },
    },
  },
  de: {
    back: "Zurück",
    q: {
      title: "Wiederherstellung per Sicherheitsfrage",
      description:
        "Stellen Sie Ihr Konto wieder her, indem Sie die Sicherheitsfrage beantworten, die Sie bei der Registrierung festgelegt haben.",
      emailLabel: "E-Mail",
      emailPlaceholder: "you@example.com",
      next: "Weiter",
      nextLoading: "Suche…",
      emailEntered: "Wiederherstellung für",
      questionLabel: "Sicherheitsfrage",
      answerLabel: "Ihre Antwort",
      answerPlaceholder: "Antwort eingeben",
      recover: "Konto wiederherstellen",
      recovering: "Prüfung…",
      error: {
        emailRequired: "Bitte E-Mail eingeben.",
        lookupFailed: "Kein Konto mit dieser E-Mail gefunden.",
        network: "Netzwerkfehler. Bitte erneut versuchen.",
        answerRequired: "Bitte Antwort eingeben.",
        failed: "Falsche Antwort. Bitte erneut versuchen.",
        noQuestion: "Für dieses Konto ist keine Sicherheitsfrage festgelegt.",
      },
    },
  },
  fr: {
    back: "Retour",
    q: {
      title: "Récupération par question de sécurité",
      description:
        "Récupérez votre compte en répondant à la question de sécurité définie lors de l'inscription.",
      emailLabel: "E-mail",
      emailPlaceholder: "you@example.com",
      next: "Suivant",
      nextLoading: "Recherche…",
      emailEntered: "Récupération pour",
      questionLabel: "Question de sécurité",
      answerLabel: "Votre réponse",
      answerPlaceholder: "Saisissez votre réponse",
      recover: "Récupérer le compte",
      recovering: "Vérification…",
      error: {
        emailRequired: "Veuillez saisir votre e-mail.",
        lookupFailed: "Aucun compte trouvé avec cet e-mail.",
        network: "Erreur réseau. Veuillez réessayer.",
        answerRequired: "Veuillez saisir votre réponse.",
        failed: "Réponse incorrecte. Veuillez réessayer.",
        noQuestion: "Aucune question de sécurité définie pour ce compte.",
      },
    },
  },
  es: {
    back: "Atrás",
    q: {
      title: "Recuperación por pregunta de seguridad",
      description:
        "Recupera tu cuenta respondiendo la pregunta de seguridad que configuraste al registrarte.",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "you@example.com",
      next: "Siguiente",
      nextLoading: "Buscando…",
      emailEntered: "Recuperando para",
      questionLabel: "Pregunta de seguridad",
      answerLabel: "Tu respuesta",
      answerPlaceholder: "Escribe tu respuesta",
      recover: "Recuperar cuenta",
      recovering: "Verificando…",
      error: {
        emailRequired: "Introduce tu correo electrónico.",
        lookupFailed: "No se encontró ninguna cuenta con ese correo.",
        network: "Error de red. Inténtalo de nuevo.",
        answerRequired: "Introduce tu respuesta.",
        failed: "Respuesta incorrecta. Inténtalo de nuevo.",
        noQuestion: "No hay ninguna pregunta de seguridad configurada para esta cuenta.",
      },
    },
  },
  pt: {
    back: "Voltar",
    q: {
      title: "Recuperação por pergunta de segurança",
      description:
        "Recupere a sua conta respondendo à pergunta de segurança definida durante o registo.",
      emailLabel: "E-mail",
      emailPlaceholder: "you@example.com",
      next: "Seguinte",
      nextLoading: "A procurar…",
      emailEntered: "A recuperar para",
      questionLabel: "Pergunta de segurança",
      answerLabel: "A sua resposta",
      answerPlaceholder: "Escreva a sua resposta",
      recover: "Recuperar conta",
      recovering: "A verificar…",
      error: {
        emailRequired: "Introduza o seu e-mail.",
        lookupFailed: "Nenhuma conta encontrada com esse e-mail.",
        network: "Erro de rede. Tente novamente.",
        answerRequired: "Introduza a sua resposta.",
        failed: "Resposta incorreta. Tente novamente.",
        noQuestion: "Nenhuma pergunta de segurança definida para esta conta.",
      },
    },
  },
  ja: {
    back: "戻る",
    q: {
      title: "秘密の質問によるアカウント回復",
      description: "登録時に設定した秘密の質問に答えてアカウントを回復します。",
      emailLabel: "メールアドレス",
      emailPlaceholder: "you@example.com",
      next: "次へ",
      nextLoading: "検索中…",
      emailEntered: "回復対象",
      questionLabel: "秘密の質問",
      answerLabel: "あなたの回答",
      answerPlaceholder: "回答を入力",
      recover: "アカウントを回復",
      recovering: "確認中…",
      error: {
        emailRequired: "メールアドレスを入力してください。",
        lookupFailed: "そのメールアドレスのアカウントが見つかりません。",
        network: "ネットワークエラーです。もう一度お試しください。",
        answerRequired: "回答を入力してください。",
        failed: "回答が正しくありません。もう一度お試しください。",
        noQuestion: "このアカウントには秘密の質問が設定されていません。",
      },
    },
  },
  ar: {
    back: "رجوع",
    q: {
      title: "استعادة الحساب بسؤال الأمان",
      description: "استعد حسابك بالإجابة على سؤال الأمان الذي حددته أثناء التسجيل.",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "you@example.com",
      next: "التالي",
      nextLoading: "جارٍ البحث…",
      emailEntered: "الاستعادة لـ",
      questionLabel: "سؤال الأمان",
      answerLabel: "إجابتك",
      answerPlaceholder: "اكتب إجابتك",
      recover: "استعادة الحساب",
      recovering: "جارٍ التحقق…",
      error: {
        emailRequired: "يرجى إدخال بريدك الإلكتروني.",
        lookupFailed: "لم يتم العثور على حساب بهذا البريد الإلكتروني.",
        network: "خطأ في الشبكة. حاول مرة أخرى.",
        answerRequired: "يرجى إدخال إجابتك.",
        failed: "إجابة غير صحيحة. حاول مرة أخرى.",
        noQuestion: "لا يوجد سؤال أمان محدد لهذا الحساب.",
      },
    },
  },
  vi: {
    back: "Quay lại",
    q: {
      title: "Khôi phục bằng câu hỏi bảo mật",
      description: "Khôi phục tài khoản bằng cách trả lời câu hỏi bảo mật bạn đã đặt khi đăng ký.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      next: "Tiếp tục",
      nextLoading: "Đang tìm…",
      emailEntered: "Đang khôi phục cho",
      questionLabel: "Câu hỏi bảo mật",
      answerLabel: "Câu trả lời của bạn",
      answerPlaceholder: "Nhập câu trả lời",
      recover: "Khôi phục tài khoản",
      recovering: "Đang xác minh…",
      error: {
        emailRequired: "Vui lòng nhập email của bạn.",
        lookupFailed: "Không tìm thấy tài khoản với email đó.",
        network: "Lỗi mạng. Vui lòng thử lại.",
        answerRequired: "Vui lòng nhập câu trả lời.",
        failed: "Câu trả lời không đúng. Vui lòng thử lại.",
        noQuestion: "Chưa đặt câu hỏi bảo mật cho tài khoản này.",
      },
    },
  },
  ru: {
    back: "Назад",
    q: {
      title: "Восстановление по секретному вопросу",
      description:
        "Восстановите свой аккаунт, ответив на секретный вопрос, заданный при регистрации.",
      emailLabel: "Электронная почта",
      emailPlaceholder: "you@example.com",
      next: "Далее",
      nextLoading: "Поиск…",
      emailEntered: "Восстановление для",
      questionLabel: "Секретный вопрос",
      answerLabel: "Ваш ответ",
      answerPlaceholder: "Введите ответ",
      recover: "Восстановить аккаунт",
      recovering: "Проверка…",
      error: {
        emailRequired: "Введите вашу электронную почту.",
        lookupFailed: "Аккаунт с такой почтой не найден.",
        network: "Ошибка сети. Попробуйте ещё раз.",
        answerRequired: "Введите ваш ответ.",
        failed: "Неверный ответ. Попробуйте ещё раз.",
        noQuestion: "Для этого аккаунта секретный вопрос не задан.",
      },
    },
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
  const back = bucket ? bucket.back : "Back";
  const q = bucket ? bucket.q : JSON.parse(JSON.stringify(template));

  existing.common = existing.common || {};
  existing.common.back = back;

  existing.questionRecovery = deepMerge(existing.questionRecovery || {}, q);

  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    if (!(j.common && "back" in j.common)) bad.push(`${f}: no common.back`);
    const qr = j.questionRecovery || {};
    const missing = ["title", "error"].filter((k) => !(k in qr));
    if (missing.length) bad.push(`${f}: questionRecovery missing ${missing.join(",")}`);
    const err = qr.error || {};
    if (!["emailRequired", "noQuestion"].every((k) => k in err)) bad.push(`${f}: qr.error incomplete`);
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(bad.length ? `VALIDATION ISSUES:\n${bad.join("\n")}` : "ALL 33 LOCALES VALID (common.back + questionRecovery)");
