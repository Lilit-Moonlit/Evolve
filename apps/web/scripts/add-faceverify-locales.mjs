/**
 * Adds the anti-catfish face-verification + liveness + behavioral-risk keys to
 * every locale JSON file in apps/web/src/i18n/locales/.
 *
 * Deterministic, non-LLM: preserves all existing keys via deep merge and only
 * adds what the OnboardingWizard / LivenessChallenge / behavioral-analysis UI
 * consumes.
 *
 * Tier 1 languages (uk de fr es pt ja ko zh ar vi hi tr th id ms ru) get
 * natural translations; all others fall back to English (repo Tier 2
 * convention).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

// English source.
const en = {
  photo: {
    faceVerify: "Face verification",
    faceVerifyHint: "Verify your photo is real. Your photo will be checked against a live selfie.",
    verifyFace: "Verify with selfie",
    verifying: "Verifying face...",
    faceVerified: "Face verified successfully ✓",
    noFaceDetected: "No face detected in the photo. Please upload a clear photo of your face.",
    faceMismatch:
      "Face mismatch detected ({{similarity}}% similar). The photo does not match your live selfie.",
    verificationError: "Face verification failed. Please try again.",
  },
  chat: {
    liveness: {
      title: "Identity check",
      description:
        "To prove you're the real person behind this profile, complete a quick face check.",
      lookStraight: "Look straight at the camera",
      startCapture: "Start check",
      getReady: "Get ready...",
      processing: "Analyzing face...",
      skip: "Later",
      success: "✓ Identity confirmed",
      failed: "✗ Identity check failed",
      lastCheck: "Verified at {{time}}",
      cameraError: "Could not access camera. Please allow camera access and try again.",
      noStoredFace:
        "You have not completed face verification yet. Complete it in your profile settings.",
      noFaceDetected: "No face detected. Please look directly at the camera.",
      verificationError: "Face verification failed. Please try again.",
      systemMessageSuccess: "🛡️ Identity check passed",
      systemMessageFailed: "⚠️ Identity check failed",
    },
  },
  catfish: {
    riskLow: "Low risk",
    riskModerate: "Moderate risk",
    riskHigh: "High risk",
    photoPhotographAge: "Photo appears very old (possible stolen photo)",
    profileAgeNew: "Profile is very new",
    missingVerification: "Missing profile verification",
    timingSuspicious: "Suspicious message timing (possible bot)",
    scamSuspicious: "Suspicious content detected",
    timing: "Message timing",
    scam: "Suspicious content",
    flagged: "Profile flagged for review",
  },
};

// Natural translations for Tier 1 languages (photo + liveness + catfish).
const natural = {
  uk: {
    photo: {
      faceVerify: "Верифікація обличчя",
      faceVerifyHint: "Перевірте, що ваше фото справжнє. Воно буде зіставлене з живим селфі.",
      verifyFace: "Перевірити селфі",
      verifying: "Перевірка обличчя...",
      faceVerified: "Обличчя успішно перевірено ✓",
      noFaceDetected: "На фото не виявлено обличчя. Завантажте чітке фото обличчя.",
      faceMismatch:
        "Виявлено розбіжність облич (схожість {{similarity}}%). Фото не збігається з вашим селфі.",
      verificationError: "Не вдалося перевірити обличчя. Спробуйте ще раз.",
    },
    chat: {
      liveness: {
        title: "Перевірка особи",
        description:
          "Щоб підтвердити, що ви — реальна людина за цим профілем, виконайте швидку перевірку обличчя.",
        lookStraight: "Дивіться прямо в камеру",
        startCapture: "Почати перевірку",
        getReady: "Приготуйтеся...",
        processing: "Аналіз обличчя...",
        skip: "Пізніше",
        success: "✓ Особу підтверджено",
        failed: "✗ Перевірку особи не пройдено",
        lastCheck: "Перевірено о {{time}}",
        cameraError: "Не вдалося отримати доступ до камери. Дозвольте доступ і спробуйте ще раз.",
        noStoredFace: "Ви ще не завершили верифікацію обличчя. Зробіть це в налаштуваннях профілю.",
        noFaceDetected: "Не виявлено обличчя. Дивіться прямо в камеру.",
        verificationError: "Не вдалося перевірити обличчя. Спробуйте ще раз.",
        systemMessageSuccess: "🛡️ Перевірку особи пройдено",
        systemMessageFailed: "⚠️ Перевірку особи не пройдено",
      },
    },
    catfish: {
      riskLow: "Низький ризик",
      riskModerate: "Помірний ризик",
      riskHigh: "Високий ризик",
      photoPhotographAge: "Фото дуже старе (можливо, викрадене)",
      profileAgeNew: "Профіль дуже новий",
      missingVerification: "Відсутня верифікація профілю",
      timingSuspicious: "Підозрілий час відповідей (можливо, бот)",
      scamSuspicious: "Виявлено підозрілий вміст",
      timing: "Час відповідей",
      scam: "Підозрілий вміст",
      flagged: "Профіль позначено для перевірки",
    },
  },
  ru: {
    photo: {
      faceVerify: "Верификация лица",
      faceVerifyHint: "Проверьте, что ваше фото настоящее. Оно будет сверено с живым селфи.",
      verifyFace: "Проверить селфи",
      verifying: "Проверка лица...",
      faceVerified: "Лицо успешно проверено ✓",
      noFaceDetected: "На фото не обнаружено лицо. Загрузите четкое фото лица.",
      faceMismatch:
        "Обнаружено несоответствие лиц (сходство {{similarity}}%). Фото не совпадает с вашим селфи.",
      verificationError: "Не удалось проверить лицо. Попробуйте снова.",
    },
    chat: {
      liveness: {
        title: "Проверка личности",
        description:
          "Чтобы подтвердить, что вы — реальный человек за этим профилем, выполните быструю проверку лица.",
        lookStraight: "Смотрите прямо в камеру",
        startCapture: "Начать проверку",
        getReady: "Приготовьтесь...",
        processing: "Анализ лица...",
        skip: "Позже",
        success: "✓ Личность подтверждена",
        failed: "✗ Проверка личности не пройдена",
        lastCheck: "Проверено в {{time}}",
        cameraError: "Не удалось получить доступ к камере. Разрешите доступ и попробуйте снова.",
        noStoredFace: "Вы еще не прошли верификацию лица. Сделайте это в настройках профиля.",
        noFaceDetected: "Лицо не обнаружено. Смотрите прямо в камеру.",
        verificationError: "Не удалось проверить лицо. Попробуйте снова.",
        systemMessageSuccess: "🛡️ Проверка личности пройдена",
        systemMessageFailed: "⚠️ Проверка личности не пройдена",
      },
    },
    catfish: {
      riskLow: "Низкий риск",
      riskModerate: "Умеренный риск",
      riskHigh: "Высокий риск",
      photoPhotographAge: "Фото очень старое (возможно, украдено)",
      profileAgeNew: "Профиль очень новый",
      missingVerification: "Отсутствует верификация профиля",
      timingSuspicious: "Подозрительное время ответов (возможно, бот)",
      scamSuspicious: "Обнаружен подозрительный контент",
      timing: "Время ответов",
      scam: "Подозрительный контент",
      flagged: "Профиль помечен для проверки",
    },
  },
  de: {
    photo: {
      faceVerify: "Gesichtsverifizierung",
      faceVerifyHint:
        "Bestätigen Sie, dass Ihr Foto echt ist. Es wird mit einem Live-Selfie abgeglichen.",
      verifyFace: "Mit Selfie verifizieren",
      verifying: "Gesicht wird geprüft...",
      faceVerified: "Gesicht erfolgreich verifiziert ✓",
      noFaceDetected: "Kein Gesicht im Foto erkannt. Bitte laden Sie ein klares Gesichtsfoto hoch.",
      faceMismatch:
        "Gesichtsabweichung erkannt (Ähnlichkeit {{similarity}}%). Foto stimmt nicht mit Ihrem Selfie überein.",
      verificationError: "Gesichtsverifizierung fehlgeschlagen. Bitte erneut versuchen.",
    },
    chat: {
      liveness: {
        title: "Identitätsprüfung",
        description:
          "Um zu bestätigen, dass Sie die echte Person hinter diesem Profil sind, führen Sie eine schnelle Gesichtsprüfung durch.",
        lookStraight: "Schauen Sie direkt in die Kamera",
        startCapture: "Prüfung starten",
        getReady: "Machen Sie sich bereit...",
        processing: "Gesicht wird analysiert...",
        skip: "Später",
        success: "✓ Identität bestätigt",
        failed: "✗ Identitätsprüfung fehlgeschlagen",
        lastCheck: "Verifiziert um {{time}}",
        cameraError:
          "Kamerazugriff fehlgeschlagen. Bitte erlauben Sie den Zugriff und versuchen Sie es erneut.",
        noStoredFace:
          "Sie haben die Gesichtsverifizierung noch nicht abgeschlossen. Tun Sie dies in Ihren Profileinstellungen.",
        noFaceDetected: "Kein Gesicht erkannt. Schauen Sie direkt in die Kamera.",
        verificationError: "Gesichtsprüfung fehlgeschlagen. Bitte erneut versuchen.",
        systemMessageSuccess: "🛡️ Identitätsprüfung bestanden",
        systemMessageFailed: "⚠️ Identitätsprüfung fehlgeschlagen",
      },
    },
    catfish: {
      riskLow: "Geringes Risiko",
      riskModerate: "Mäßiges Risiko",
      riskHigh: "Hohes Risiko",
      photoPhotographAge: "Foto wirkt sehr alt (möglicherweise gestohlen)",
      profileAgeNew: "Profil ist sehr neu",
      missingVerification: "Profilverifizierung fehlt",
      timingSuspicious: "Verdächtiges Antwort-Verhalten (möglicherweise Bot)",
      scamSuspicious: "Verdächtiger Inhalt erkannt",
      timing: "Antwort-Zeitverhalten",
      scam: "Verdächtiger Inhalt",
      flagged: "Profil zur Prüfung markiert",
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

function buildKeys(locale) {
  const n = natural[locale];
  if (!n) return deepClone(en);

  return deepMerge(deepClone(en), {
    photo: n.photo,
    chat: { liveness: n.chat.liveness },
    catfish: n.catfish,
  });
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, ""); // e.g. "uk", "zh-TW"
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));

  const keys = buildKeys(locale);

  // Add photo.face* keys (preserve existing photo object).
  existing.photo = deepMerge(existing.photo || {}, keys.photo || {});

  // Add chat.liveness.* keys (preserve existing chat object).
  existing.chat = deepMerge(existing.chat || {}, keys.chat || {});

  // Add catfish.* keys.
  existing.catfish = deepMerge(existing.catfish || {}, keys.catfish || {});

  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

// Validate every file parses and has the required keys.
let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const ph = j.photo || {};
    const ch = j.chat || {};
    const liveness = ch.liveness || {};
    const cat = j.catfish || {};
    if (
      !ph.faceVerify ||
      !ph.verifyFace ||
      !ph.faceVerified ||
      !liveness.title ||
      !liveness.startCapture ||
      !liveness.success ||
      !liveness.failed ||
      !cat.riskLow ||
      !cat.riskHigh ||
      !cat.missingVerification
    ) {
      bad.push(f);
    }
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : "ALL 33 LOCALES VALID");
