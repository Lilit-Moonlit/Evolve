/**
 * Insert dnaRecovery + common.or + auth.landing.dnaRecovery keys into all 33 locales.
 * Tier 1 languages get natural translations; Tier 2 get English fallback.
 * Run: node scripts/i18n-dna-recovery-insert.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const LOCALES_DIR = join(
  process.cwd(),
  "apps/web/src/i18n/locales",
);

const TIER1_DNA = {
  uk: {
    dnaRecovery: {
      title: "Відновлення акаунту через ДНК-тест",
      description:
        "Підтвердіть свою особу за допомогою зареєстрованого ДНК-профілю. Введіть електронну пошту, пов'язану з вашим акаунтом, та вставте результат ДНК-тесту.",
      emailLabel: "Електронна пошта",
      emailPlaceholder: "you@example.com",
      next: "Далі",
      emailEntered: "Електронна пошта",
      dnaLabel: "Результат ДНК-тесту",
      dnaPlaceholder: "Вставте текст результату вашого ДНК-тесту тут…",
      recover: "Відновити акаунт",
      recovering: "Перевірка ДНК…",
      error: {
        emailRequired: "Будь ласка, введіть електронну пошту",
        dnaRequired: "Будь ласка, вставте результат ДНК-тесту",
        failed:
          "Помилка перевірки ДНК. Перевірте введені дані та спробуйте ще раз.",
        network: "Помилка мережі. Спробуйте ще раз.",
      },
    },
    authLandingDnaRecovery: "🧬 Відновити акаунт через ДНК-тест",
    commonOr: "або",
  },
  de: {
    dnaRecovery: {
      title: "Konto über DNA-Test wiederherstellen",
      description:
        "Bestätigen Sie Ihre Identität mit Ihrem registrierten DNA-Profil. Geben Sie die mit Ihrem Konto verknüpfte E-Mail-Adresse ein und fügen Sie Ihr DNA-Ergebnis ein.",
      emailLabel: "E-Mail-Adresse",
      emailPlaceholder: "you@example.com",
      next: "Weiter",
      emailEntered: "E-Mail",
      dnaLabel: "DNA-Testergebnis",
      dnaPlaceholder: "Fügen Sie hier Ihr DNA-Testergebnis ein…",
      recover: "Konto wiederherstellen",
      recovering: "DNA wird überprüft…",
      error: {
        emailRequired: "Bitte geben Sie Ihre E-Mail-Adresse ein",
        dnaRequired: "Bitte fügen Sie Ihr DNA-Testergebnis ein",
        failed:
          "DNA-Überprüfung fehlgeschlagen. Überprüfen Sie Ihre Eingabe und versuchen Sie es erneut.",
        network: "Netzwerkfehler. Bitte versuchen Sie es erneut.",
      },
    },
    authLandingDnaRecovery: "🧬 Konto über DNA-Test wiederherstellen",
    commonOr: "oder",
  },
  fr: {
    dnaRecovery: {
      title: "Récupérer le compte via un test ADN",
      description:
        "Vérifiez votre identité à l'aide de votre profil ADN enregistré. Entrez l'adresse e-mail associée à votre compte et collez votre résultat de test ADN.",
      emailLabel: "Adresse e-mail",
      emailPlaceholder: "you@example.com",
      next: "Suivant",
      emailEntered: "E-mail",
      dnaLabel: "Résultat du test ADN",
      dnaPlaceholder: "Collez le texte du résultat de votre test ADN ici…",
      recover: "Récupérer le compte",
      recovering: "Vérification de l'ADN…",
      error: {
        emailRequired: "Veuillez saisir votre adresse e-mail",
        dnaRequired: "Veuillez coller votre résultat de test ADN",
        failed:
          "Échec de la vérification ADN. Vérifiez vos informations et réessayez.",
        network: "Erreur réseau. Veuillez réessayer.",
      },
    },
    authLandingDnaRecovery: "🧬 Récupérer le compte via un test ADN",
    commonOr: "ou",
  },
  es: {
    dnaRecovery: {
      title: "Recuperar cuenta mediante test de ADN",
      description:
        "Verifique su identidad usando su perfil de ADN registrado. Ingrese el correo electrónico vinculado a su cuenta y pegue su resultado del test de ADN.",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "you@example.com",
      next: "Siguiente",
      emailEntered: "Correo",
      dnaLabel: "Resultado del test de ADN",
      dnaPlaceholder: "Pegue aquí el texto del resultado de su test de ADN…",
      recover: "Recuperar cuenta",
      recovering: "Verificando ADN…",
      error: {
        emailRequired: "Por favor ingrese su correo electrónico",
        dnaRequired: "Por favor pegue su resultado del test de ADN",
        failed:
          "Fallo en la verificación de ADN. Verifique sus datos e inténtelo de nuevo.",
        network: "Error de red. Por favor inténtelo de nuevo.",
      },
    },
    authLandingDnaRecovery: "🧬 Recuperar cuenta mediante test de ADN",
    commonOr: "o",
  },
  pt: {
    dnaRecovery: {
      title: "Recuperar conta via teste de DNA",
      description:
        "Verifique sua identidade usando seu perfil de DNA registrado. Digite o e-mail vinculado à sua conta e cole o resultado do teste de DNA.",
      emailLabel: "E-mail",
      emailPlaceholder: "you@example.com",
      next: "Próximo",
      emailEntered: "E-mail",
      dnaLabel: "Resultado do teste de DNA",
      dnaPlaceholder: "Cole o texto do resultado do seu teste de DNA aqui…",
      recover: "Recuperar conta",
      recovering: "Verificando DNA…",
      error: {
        emailRequired: "Por favor, digite seu e-mail",
        dnaRequired: "Por favor, cole o resultado do teste de DNA",
        failed:
          "Falha na verificação de DNA. Verifique seus dados e tente novamente.",
        network: "Erro de rede. Por favor, tente novamente.",
      },
    },
    authLandingDnaRecovery: "🧬 Recuperar conta via teste de DNA",
    commonOr: "ou",
  },
  ja: {
    dnaRecovery: {
      title: "DNAテストでアカウントを復元",
      description:
        "登録されたDNAプロファイルを使用して本人確認を行います。アカウントに関連付けられたメールアドレスを入力し、DNAテストの結果を貼り付けてください。",
      emailLabel: "メールアドレス",
      emailPlaceholder: "you@example.com",
      next: "次へ",
      emailEntered: "メール",
      dnaLabel: "DNAテスト結果",
      dnaPlaceholder: "DNAテストの結果テキストをここに貼り付けてください…",
      recover: "アカウントを復元",
      recovering: "DNA検証中…",
      error: {
        emailRequired: "メールアドレスを入力してください",
        dnaRequired: "DNAテストの結果を貼り付けてください",
        failed:
          "DNA検証に失敗しました。入力内容を確認して再試行してください。",
        network: "ネットワークエラー。再試行してください。",
      },
    },
    authLandingDnaRecovery: "🧬 DNAテストでアカウントを復元",
    commonOr: "または",
  },
  ko: {
    dnaRecovery: {
      title: "DNA 테스트로 계정 복구",
      description:
        "등록된 DNA 프로필을 사용하여 본인을 확인합니다. 계정에 연결된 이메일을 입력하고 DNA 테스트 결과를 붙여넣으세요.",
      emailLabel: "이메일 주소",
      emailPlaceholder: "you@example.com",
      next: "다음",
      emailEntered: "이메일",
      dnaLabel: "DNA 테스트 결과",
      dnaPlaceholder: "DNA 테스트 결과 텍스트를 여기에 붙여넣으세요…",
      recover: "계정 복구",
      recovering: "DNA 확인 중…",
      error: {
        emailRequired: "이메일 주소를 입력하세요",
        dnaRequired: "DNA 테스트 결과를 붙여넣으세요",
        failed:
          "DNA 확인 실패. 입력 내용을 확인하고 다시 시도하세요.",
        network: "네트워크 오류. 다시 시도하세요.",
      },
    },
    authLandingDnaRecovery: "🧬 DNA 테스트로 계정 복구",
    commonOr: "또는",
  },
  zh: {
    dnaRecovery: {
      title: "通过DNA测试恢复账户",
      description:
        "使用您注册的DNA档案验证身份。输入与账户关联的电子邮件并粘贴DNA测试结果。",
      emailLabel: "电子邮件",
      emailPlaceholder: "you@example.com",
      next: "下一步",
      emailEntered: "电子邮件",
      dnaLabel: "DNA测试结果",
      dnaPlaceholder: "在此粘贴DNA测试结果文本…",
      recover: "恢复账户",
      recovering: "正在验证DNA…",
      error: {
        emailRequired: "请输入您的电子邮件地址",
        dnaRequired: "请粘贴DNA测试结果",
        failed: "DNA验证失败。请检查输入并重试。",
        network: "网络错误。请重试。",
      },
    },
    authLandingDnaRecovery: "🧬 通过DNA测试恢复账户",
    commonOr: "或",
  },
  ar: {
    dnaRecovery: {
      title: "استرداد الحساب عبر اختبار الحمض النووي (DNA)",
      description:
        "تحقق من هويتك باستخدام ملف DNA المسجل. أدخل البريد الإلكتروني المرتبط بحسابك والصق نتيجة اختبار الحمض النووي.",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "you@example.com",
      next: "التالي",
      emailEntered: "البريد الإلكتروني",
      dnaLabel: "نتيجة اختبار الحمض النووي",
      dnaPlaceholder: "الصق نص نتيجة اختبار الحمض النووي هنا…",
      recover: "استرداد الحساب",
      recovering: "جاري التحقق من DNA…",
      error: {
        emailRequired: "يرجى إدخال بريدك الإلكتروني",
        dnaRequired: "يرجى لصق نتيجة اختبار الحمض النووي",
        failed: "فشل التحقق من DNA. تحقق من المدخلات وحاول مرة أخرى.",
        network: "خطأ في الشبكة. يرجى المحاولة مرة أخرى.",
      },
    },
    authLandingDnaRecovery: "🧬 استرداد الحساب عبر اختبار الحمض النووي",
    commonOr: "أو",
  },
  vi: {
    dnaRecovery: {
      title: "Khôi phục tài khoản qua xét nghiệm DNA",
      description:
        "Xác minh danh tính bằng hồ sơ DNA đã đăng ký. Nhập email liên kết với tài khoản và dán kết quả xét nghiệm DNA.",
      emailLabel: "Địa chỉ email",
      emailPlaceholder: "you@example.com",
      next: "Tiếp theo",
      emailEntered: "Email",
      dnaLabel: "Kết quả xét nghiệm DNA",
      dnaPlaceholder: "Dán văn bản kết quả xét nghiệm DNA của bạn vào đây…",
      recover: "Khôi phục tài khoản",
      recovering: "Đang xác minh DNA…",
      error: {
        emailRequired: "Vui lòng nhập địa chỉ email",
        dnaRequired: "Vui lòng dán kết quả xét nghiệm DNA",
        failed: "Xác minh DNA thất bại. Vui lòng kiểm tra và thử lại.",
        network: "Lỗi mạng. Vui lòng thử lại.",
      },
    },
    authLandingDnaRecovery: "🧬 Khôi phục tài khoản qua xét nghiệm DNA",
    commonOr: "hoặc",
  },
  hi: {
    dnaRecovery: {
      title: "DNA परीक्षण से खाता पुनर्प्राप्त करें",
      description:
        "अपने पंजीकृत DNA प्रोफ़ाइल का उपयोग करके अपनी पहचान सत्यापित करें। अपने खाते से जुड़ा ईमेल दर्ज करें और अपना DNA परीक्षण परिणाम पेस्ट करें।",
      emailLabel: "ईमेल पता",
      emailPlaceholder: "you@example.com",
      next: "अगला",
      emailEntered: "ईमेल",
      dnaLabel: "DNA परीक्षण परिणाम",
      dnaPlaceholder: "अपना DNA परीक्षण परिणाम यहां पेस्ट करें…",
      recover: "खाता पुनर्प्राप्त करें",
      recovering: "DNA सत्यापन हो रहा है…",
      error: {
        emailRequired: "कृपया अपना ईमेल पता दर्ज करें",
        dnaRequired: "कृपया अपना DNA परीक्षण परिणाम पेस्ट करें",
        failed: "DNA सत्यापन विफल। कृपया जांचें और फिर से प्रयास करें।",
        network: "नेटवर्क त्रुटि। कृपया फिर से प्रयास करें।",
      },
    },
    authLandingDnaRecovery: "🧬 DNA परीक्षण से खाता पुनर्प्राप्त करें",
    commonOr: "या",
  },
  tr: {
    dnaRecovery: {
      title: "DNA Testi ile Hesabı Kurtar",
      description:
        "Kayıtlı DNA profilinizi kullanarak kimliğinizi doğrulayın. Hesabınızla ilişkili e-posta adresini girin ve DNA test sonucunuzu yapıştırın.",
      emailLabel: "E-posta adresi",
      emailPlaceholder: "you@example.com",
      next: "İleri",
      emailEntered: "E-posta",
      dnaLabel: "DNA test sonucu",
      dnaPlaceholder: "DNA test sonucunuzun metnini buraya yapıştırın…",
      recover: "Hesabı Kurtar",
      recovering: "DNA doğrulanıyor…",
      error: {
        emailRequired: "Lütfen e-posta adresinizi girin",
        dnaRequired: "Lütfen DNA test sonucunuzu yapıştırın",
        failed:
          "DNA doğrulama başarısız oldu. Lütfen girdiğinizi kontrol edin ve tekrar deneyin.",
        network: "Ağ hatası. Lütfen tekrar deneyin.",
      },
    },
    authLandingDnaRecovery: "🧬 DNA Testi ile Hesabı Kurtar",
    commonOr: "veya",
  },
  th: {
    dnaRecovery: {
      title: "กู้คืนบัญชีผ่านการทดสอบ DNA",
      description:
        "ยืนยันตัวตนโดยใช้โปรไฟล์ DNA ที่ลงทะเบียนไว้ อีเมลที่เชื่อมโยงกับบัญชีของคุณและวางผลการทดสอบ DNA",
      emailLabel: "ที่อยู่อีเมล",
      emailPlaceholder: "you@example.com",
      next: "ถัดไป",
      emailEntered: "อีเมล",
      dnaLabel: "ผลการทดสอบ DNA",
      dnaPlaceholder: "วางข้อความผลการทดสอบ DNA ของคุณที่นี่…",
      recover: "กู้คืนบัญชี",
      recovering: "กำลังตรวจสอบ DNA…",
      error: {
        emailRequired: "กรุณากรอกที่อยู่อีเมลของคุณ",
        dnaRequired: "กรุณาวางผลการทดสอบ DNA",
        failed: "การตรวจสอบ DNA ล้มเหลว กรุณาตรวจสอบและลองอีกครั้ง",
        network: "เครือข่ายผิดพลาด กรุณาลองอีกครั้ง",
      },
    },
    authLandingDnaRecovery: "🧬 กู้คืนบัญชีผ่านการทดสอบ DNA",
    commonOr: "หรือ",
  },
  id: {
    dnaRecovery: {
      title: "Pulihkan Akun melalui Tes DNA",
      description:
        "Verifikasi identitas Anda menggunakan profil DNA yang terdaftar. Masukkan email yang terkait dengan akun Anda dan tempel hasil tes DNA.",
      emailLabel: "Alamat email",
      emailPlaceholder: "you@example.com",
      next: "Selanjutnya",
      emailEntered: "Email",
      dnaLabel: "Hasil tes DNA",
      dnaPlaceholder: "Tempel teks hasil tes DNA Anda di sini…",
      recover: "Pulihkan Akun",
      recovering: "Memverifikasi DNA…",
      error: {
        emailRequired: "Masukkan alamat email Anda",
        dnaRequired: "Tempel hasil tes DNA Anda",
        failed:
          "Verifikasi DNA gagal. Periksa input Anda dan coba lagi.",
        network: "Jaringan error. Silakan coba lagi.",
      },
    },
    authLandingDnaRecovery: "🧬 Pulihkan Akun melalui Tes DNA",
    commonOr: "atau",
  },
  ms: {
    dnaRecovery: {
      title: "Pulihkan Akaun melalui Ujian DNA",
      description:
        "Sahkan identiti anda menggunakan profil DNA yang didaftarkan. Masukkan e-mel yang berkaitan dengan akaun anda dan tampal hasil ujian DNA.",
      emailLabel: "Alamat e-mel",
      emailPlaceholder: "you@example.com",
      next: "Seterusnya",
      emailEntered: "E-mel",
      dnaLabel: "Hasil ujian DNA",
      dnaPlaceholder: "Tampal teks hasil ujian DNA anda di sini…",
      recover: "Pulihkan Akaun",
      recovering: "Menyahkan DNA…",
      error: {
        emailRequired: "Sila masukkan alamat e-mel anda",
        dnaRequired: "Sila tampal hasil ujian DNA anda",
        failed:
          "Pengesahan DNA gagal. Semak input anda dan cuba lagi.",
        network: "Rangkaian ralat. Sila cuba lagi.",
      },
    },
    authLandingDnaRecovery: "🧬 Pulihkan Akaun melalui Ujian DNA",
    commonOr: "atau",
  },
  ru: {
    dnaRecovery: {
      title: "Восстановление аккаунта через ДНК-тест",
      description:
        "Подтвердите свою личность с помощью зарегистрированного ДНК-профиля. Введите электронную почту, привязанную к аккаунту, и вставьте результат ДНК-теста.",
      emailLabel: "Электронная почта",
      emailPlaceholder: "you@example.com",
      next: "Далее",
      emailEntered: "Электронная почта",
      dnaLabel: "Результат ДНК-теста",
      dnaPlaceholder: "Вставьте текст результата вашего ДНК-теста сюда…",
      recover: "Восстановить аккаунт",
      recovering: "Проверка ДНК…",
      error: {
        emailRequired: "Пожалуйста, введите электронную почту",
        dnaRequired: "Пожалуйста, вставьте результат ДНК-теста",
        failed:
          "Ошибка проверки ДНК. Проверьте введённые данные и попробуйте снова.",
        network: "Ошибка сети. Попробуйте снова.",
      },
    },
    authLandingDnaRecovery: "🧬 Восстановить аккаунт через ДНК-тест",
    commonOr: "или",
  },
};

// Tier 2 — English with local descriptor
const TIER2_LOCALES = [
  "bg", "cs", "da", "el", "et", "fi", "ga", "hu", "is",
  "it", "lt", "lv", "ne", "nl", "no", "pl", "ro", "sk", "sl", "sv", "sw", "fil", "he", "hr", "zh-TW",
];

const EN_DNA_KEYS = {
  dnaRecovery: {
    title: "Recover Account via DNA Test",
    description:
      "Verify your identity using your registered DNA profile. Enter the email linked to your account and paste your DNA test result.",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    next: "Next",
    emailEntered: "Email",
    dnaLabel: "DNA test result",
    dnaPlaceholder: "Paste your DNA test result text here…",
    recover: "Recover Account",
    recovering: "Verifying DNA…",
    error: {
      emailRequired: "Please enter your email address",
      dnaRequired: "Please paste your DNA test result",
      failed:
        "DNA verification failed. Please check your input and try again.",
      network: "Network error. Please try again.",
    },
  },
  authLandingDnaRecovery: "🧬 Recover account via DNA test",
  commonOr: "or",
};

function patch(locale, data) {
  const filePath = join(LOCALES_DIR, `${locale}.json`);
  let raw;
  try {
    raw = readFileSync(filePath, "utf-8");
  } catch {
    console.warn(`[skip] ${locale}.json not found`);
    return;
  }

  const json = JSON.parse(raw);

  // 1. Add auth.landing.dnaRecovery if missing
  if (!json.auth) json.auth = {};
  if (!json.auth.landing) json.auth.landing = {};
  if (!json.auth.landing.dnaRecovery) {
    json.auth.landing.dnaRecovery = data.authLandingDnaRecovery;
  }

  // 2. Add common.or if missing
  if (!json.common) json.common = {};
  if (!json.common.or) {
    json.common.or = data.commonOr;
  }

  // 3. Add dnaRecovery.* if missing
  if (!json.dnaRecovery) {
    json.dnaRecovery = data.dnaRecovery;
  }

  writeFileSync(filePath, JSON.stringify(json, null, 2) + "\n", "utf-8");
  console.log(`✅ ${locale}.json`);
}

// Tier 1
for (const [locale, data] of Object.entries(TIER1_DNA)) {
  patch(locale, data);
}

// Tier 2 — English
for (const locale of TIER2_LOCALES) {
  patch(locale, EN_DNA_KEYS);
}

console.log(`\nDone — patched ${Object.keys(TIER1_DNA).length + TIER2_LOCALES.length} locales`);
