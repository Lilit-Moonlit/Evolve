/*
 * Adds the testingPreference keys to every locale JSON file in apps/web/src/i18n/locales/.
 *
 * Deterministic, non-LLM: preserves all existing keys via deep merge and only
 * adds what the Home/Profile UI consumes.
 *
 * Natural translations are provided for Tier 1 languages (uk de fr es pt ja
 * ko zh ar vi hi tr th id ms ru); all other locales fall back to English
 * (matching the repo's Tier 2 convention in TIER2-*.md). The value space
 * mirrors the new lab-preference.ts constants.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

// English source.
const en = {
  filters: {
    testingPreference: "Testing preference",
    testingPreferences: {
      lab: "Lab testing",
      portable: "Portable tester",
      both: "Both options",
      none: "Doesn't care",
    },
  },
  profile: {
    edit: {
      testingPreference: "Testing preference",
    },
    lab: {
      title: "Lab testing",
      yourEmail: "Your email address",
      emailHint: "Enter the email you used for DNA verification",
      emailError: "Email unavailable",
      loading: "Loading…",
      pendingTitle: "Pending DNA verification",
      accept: "Accept",
      reject: "Reject",
      noPending: "No pending DNA verification",
      reportAccepted: "Report accepted",
      reportFailed: "Failed to process the report",
    },
  },
};

// Natural translations for Tier 1 languages.
const natural = {
  uk: {
    filters: {
      testingPreference: "Метод тестування",
      testingPreferences: {
        lab: "У лабораторії",
        portable: "Портативний тестер",
        both: "Обидва варіанти",
        none: "Не важливо",
      },
    },
    profile: {
      edit: {
        testingPreference: "Метод тестування",
      },
      lab: {
        title: "Тестування в лабораторії",
        yourEmail: "Ваша електронна адреса",
        emailHint: "Введіть email, який ви використовували для ДНК верифікації",
        emailError: "Email недоступний",
        loading: "Завантаження…",
        pendingTitle: "Підтвердження ДНК верифікації очікується",
        accept: "Прийняти",
        reject: "Відхилити",
        noPending: "Немає очікуваного підтвердження",
        reportAccepted: "Звіт прийнято",
        reportFailed: "Не вдалося обробити звіт",
      },
    },
  },
  ru: {
    filters: {
      testingPreference: "Способ тестирования",
      testingPreferences: {
        lab: "В лаборатории",
        portable: "Портативный тестер",
        both: "Оба варианта",
        none: "Не важно",
      },
    },
    profile: {
      edit: {
        testingPreference: "Способ тестирования",
      },
      lab: {
        title: "Тестирование в лаборатории",
        yourEmail: "Ваш email",
        emailHint: "Введите email, который вы использовали для ДНК верификации",
        emailError: "Email недоступен",
        loading: "Загрузка…",
        pendingTitle: "Подтверждение ДНК верификации ожидается",
        accept: "Принять",
        reject: "Отклонить",
        noPending: "Нет ожидаемого подтверждения",
        reportAccepted: "Отчет принят",
        reportFailed: "Не удалось обработать отчет",
      },
    },
  },
  de: {
    filters: {
      testingPreference: "Testmethode",
      testingPreferences: {
        lab: "Im Labor",
        portable: "Tragbarer Tester",
        both: "Beide Optionen",
        none: "Ist egal",
      },
    },
    profile: {
      edit: {
        testingPreference: "Testmethode",
      },
      lab: {
        title: "Labortest",
        yourEmail: "Ihre E-Mail-Adresse",
        emailHint: "Geben Sie die E-Mail ein, die Sie für die DNA-Verifizierung verwendet haben",
        pendingTitle: "DNA-Verifizierung ausstehend",
        accept: "Akzeptieren",
        reject: "Ablehnen",
        noPending: "Keine ausstehende Verifizierung",
        reportAccepted: "Bericht akzeptiert",
      },
    },
  },
  fr: {
    filters: {
      testingPreference: "Méthode de test",
      testingPreferences: {
        lab: "En laboratoire",
        portable: "Testeur portable",
        both: "Les deux options",
        none: "Peu importe",
      },
    },
    profile: {
      edit: {
        testingPreference: "Méthode de test",
      },
      lab: {
        title: "Test en laboratoire",
        yourEmail: "Votre adresse e-mail",
        emailHint: "Entrez l'e-mail que vous avez utilisé pour la vérification ADN",
        pendingTitle: "Vérification ADN en attente",
        accept: "Accepter",
        reject: "Rejeter",
        noPending: "Aucune vérification en attente",
        reportAccepted: "Rapport accepté",
      },
    },
  },
  es: {
    filters: {
      testingPreference: "Método de prueba",
      testingPreferences: {
        lab: "En laboratorio",
        portable: "Probador portátil",
        both: "Ambas opciones",
        none: "No importa",
      },
    },
    profile: {
      edit: {
        testingPreference: "Método de prueba",
      },
      lab: {
        title: "Prueba en laboratorio",
        yourEmail: "Tu dirección de correo electrónico",
        emailHint: "Introduce el correo electrónico que usaste para la verificación de ADN",
        pendingTitle: "Verificación de ADN pendiente",
        accept: "Aceptar",
        reject: "Rechazar",
        noPending: "No hay verificación pendiente",
        reportAccepted: "Informe aceptado",
      },
    },
  },
  pt: {
    filters: {
      testingPreference: "Método de teste",
      testingPreferences: {
        lab: "No laboratório",
        portable: "Testador portátil",
        both: "Ambas opções",
        none: "Não importa",
      },
    },
    profile: {
      edit: {
        testingPreference: "Método de teste",
      },
      lab: {
        title: "Teste em laboratório",
        yourEmail: "Seu endereço de e-mail",
        emailHint: "Digite o e-mail que você usou para a verificação de DNA",
        pendingTitle: "Verificação de DNA pendente",
        accept: "Aceitar",
        reject: "Rejeitar",
        noPending: "Nenhuma verificação pendente",
        reportAccepted: "Relatório aceito",
      },
    },
  },
  ja: {
    filters: {
      testingPreference: "検査方法",
      testingPreferences: {
        lab: "ラボで",
        portable: "携帯型テスター",
        both: "両方のオプション",
        none: "どちらでも",
      },
    },
    profile: {
      edit: {
        testingPreference: "検査方法",
      },
      lab: {
        title: "ラボ検査",
        yourEmail: "メールアドレス",
        emailHint: "DNA認証に使用したメールアドレスを入力してください",
        pendingTitle: "DNA認証確認中",
        accept: "承認",
        reject: "拒否",
        noPending: "保留中のDNA認証はありません",
        reportAccepted: "レポートが承認されました",
      },
    },
  },
  ko: {
    filters: {
      testingPreference: "검사 방법",
      testingPreferences: {
        lab: "실험실에서",
        portable: "휴대용 테스터",
        both: "두 가지 옵션",
        none: "상관 없음",
      },
    },
    profile: {
      edit: {
        testingPreference: "검사 방법",
      },
      lab: {
        title: "실험실 검사",
        yourEmail: "이메일 주소",
        emailHint: "DNA 인증에 사용한 이메일 주소를 입력하세요",
        pendingTitle: "DNA 인증 확인 중",
        accept: "승인",
        reject: "거부",
        noPending: "보류 중인 DNA 인증이 없습니다",
        reportAccepted: "리포트 승인 완료",
      },
    },
  },
  zh: {
    filters: {
      testingPreference: "检测方式",
      testingPreferences: {
        lab: "实验室检测",
        portable: "便携式检测仪",
        both: "两种选项",
        none: "不介意",
      },
    },
    profile: {
      edit: {
        testingPreference: "检测方式",
      },
      lab: {
        title: "实验室检测",
        yourEmail: "电子邮件地址",
        emailHint: "请输入您用于DNA验证的电子邮件地址",
        pendingTitle: "DNA验证待确认",
        accept: "接受",
        reject: "拒绝",
        noPending: "没有待确认的DNA验证",
        reportAccepted: "报告已接受",
      },
    },
  },
  ar: {
    filters: {
      testingPreference: "طريقة الاختبار",
      testingPreferences: {
        lab: "في المختبر",
        portable: "جهاز محمول",
        both: "الخياران معًا",
        none: "لا يهم",
      },
    },
    profile: {
      edit: {
        testingPreference: "طريقة الاختبار",
      },
      lab: {
        title: "اختبار المختبر",
        yourEmail: "عنوان البريد الإلكتروني",
        emailHint: "أدخل البريد الإلكتروني الذي استخدمته للتحقق من الحمض النووي",
        pendingTitle: "التحقق من الحمض النووي قيد الانتظار",
        accept: "قبول",
        reject: "رفض",
        noPending: "لا يوجد تحقق قيد الانتظار",
        reportAccepted: "التقرير مقبول",
      },
    },
  },
  vi: {
    filters: {
      testingPreference: "Phương pháp kiểm tra",
      testingPreferences: {
        lab: "Tại phòng thí nghiệm",
        portable: "Máy kiểm tra di động",
        both: "Cả hai phương án",
        none: "Không quan trọng",
      },
    },
    profile: {
      edit: {
        testingPreference: "Phương pháp kiểm tra",
      },
      lab: {
        title: "Kiểm tra tại phòng thí nghiệm",
        yourEmail: "Địa chỉ email của bạn",
        emailHint: "Nhập email bạn đã dùng để xác minh DNA",
        pendingTitle: "Xác minh DNA đang chờ xử lý",
        accept: "Chấp nhận",
        reject: "Từ chối",
        noPending: "Không có xác minh DNA đang chờ xử lý",
        reportAccepted: "Báo cáo đã được chấp nhận",
      },
    },
  },
  hi: {
    filters: {
      testingPreference: "परीक्षण विधि",
      testingPreferences: {
        lab: "प्रयोगशाला में",
        portable: "पोर्टेबल परीक्षक",
        both: "दोनों विकल्प",
        none: "कोई फर्क नहीं पड़ता",
      },
    },
    profile: {
      edit: {
        testingPermission: "परीक्षण विधि",
      },
      lab: {
        title: "प्रयोगशाला परीक्षण",
        yourEmail: "आपका ईमेल पता",
        emailHint: "DNA सत्यापन के लिए आपने जो ईमेल इस्तेमाल किया था, उसे दर्ज करें",
        pendingTitle: "DNA सत्यापन की पुष्टि हो रही है",
        accept: "स्वीकार",
        reject: "अस्वीकार",
        noPending: "कोई लंबित DNA सत्यापन नहीं है",
        reportAccepted: "रिपोर्ट स्वीकार की गई",
      },
    },
  },
  tr: {
    filters: {
      testingPreference: "Test yöntemi",
      testingPreferences: {
        lab: "Laboratuvarda",
        portable: "Taşınabilir test cihazı",
        both: "İki seçenek de",
        none: "Fark etmez",
      },
    },
    profile: {
      edit: {
        testingPreference: "Test yöntemi",
      },
      lab: {
        title: "Laboratuvar testi",
        yourEmail: "E-posta adresiniz",
        emailHint: "DNA doğrulaması için kullandığınız e-postayı girin",
        pendingTitle: "DNA doğrulaması beklemede",
        accept: "Kabul et",
        reject: "Reddet",
        noPending: "Beklemede DNA doğrulaması yok",
        reportAccepted: "Rapor kabul edildi",
      },
    },
  },
  th: {
    filters: {
      testingPreference: "วิธีการทดสอบ",
      testingPreferences: {
        lab: "ในห้องปฏิบัติการ",
        portable: "เครื่องทดสอบแบบพกพา",
        both: "ทั้งสองตัวเลือก",
        none: "ไม่สำคัญ",
      },
    },
    profile: {
      edit: {
        testingPreference: "วิธีการทดสอบ",
      },
      lab: {
        title: "การทดสอบในห้องปฏิบัติการ",
        yourEmail: "ที่อยู่อีเมลของคุณ",
        emailHint: "ป้อนที่อยู่อีเมลที่คุณใช้สำหรับการตรวจสอบดีเอ็นเอ",
        pendingTitle: "การตรวจสอบดีเอ็นเอกำลังรอดำเนินการ",
        accept: "ยอมรับ",
        reject: "ปฏิเสธ",
        noPending: "ไม่มีการตรวจสอบดีเอ็นเอที่รอดำเนินการ",
        reportAccepted: "รายงานได้รับการยอมรับ",
      },
    },
  },
  id: {
    filters: {
      testingPreference: "Metode pengujian",
      testingPreferences: {
        lab: "Di laboratorium",
        portable: "Penguji portabel",
        both: "Kedua opsi",
        none: "Tidak penting",
      },
    },
    profile: {
      edit: {
        testingPreference: "Metode pengujian",
      },
      lab: {
        title: "Pengujian laboratorium",
        yourEmail: "Alamat email Anda",
        emailHint: "Masukkan email yang Anda gunakan untuk verifikasi DNA",
        pendingTitle: "Verifikasi DNA sedang diproses",
        accept: "Setuju",
        reject: "Tolak",
        noPending: "Tidak ada verifikasi DNA yang sedang diproses",
        reportAccepted: "Laporan disetujui",
      },
    },
  },
  ms: {
    filters: {
      testingPreference: "Kaedah ujian",
      testingPreferences: {
        lab: "Di makmal",
        portable: "Penguji mudah alih",
        both: "Kedua-dua pilihan",
        none: "Tidak penting",
      },
    },
    profile: {
      edit: {
        testingPreference: "Kaedah ujian",
      },
      lab: {
        title: "Ujian makmal",
        yourEmail: "Alamat e-mel anda",
        emailHint: "Masukkan e-mel yang anda gunakan untuk pengesahan DNA",
        pendingTitle: "Pengesahan DNA sedang diproses",
        accept: "Setuju",
        reject: "Tolak",
        noPending: "Tiada pengesahan DNA yang sedang diproses",
        reportAccepted: "Laporan diluluskan",
      },
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

function buildFilters(locale) {
  const n = natural[locale];
  if (!n) return deepClone(en);
  return deepMerge(deepClone(en), {
    filters: n.filters,
    profile: n.profile,
  });
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, ""); // e.g. "uk", "zh-TW"
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));

  // Merge new keys into existing.filters and profile sections
  existing.filters = deepMerge(existing.filters || {}, buildFilters(locale).filters);
  existing.profile = deepMerge(existing.profile || {}, buildFilters(locale).profile);

  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

// Validation
let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const fKey = j.filters || {};
    const pKey = j.profile || {};
    const pEdit = pKey.edit || {};
    const pLab = pKey.lab || {};
    if (
      !("testingPreference" in fKey) ||
      !fKey.testingPreferences ||
      !fKey.testingPreferences.lab ||
      !fKey.testingPreferences.portable ||
      !fKey.testingPreferences.both ||
      !fKey.testingPreferences.none ||
      !pEdit.testingPreference ||
      !pLab.title ||
      !pLab.yourEmail ||
      !pLab.emailHint ||
      !pLab.pendingTitle ||
      !pLab.accept ||
      !pLab.reject ||
      !pLab.noPending ||
      !pLab.reportAccepted
    ) {
      bad.push(f);
    }
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}

console.log(bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : "ALL 33 LOCALES VALID");
