/**
 * Adds the profile.qr and profile.searchGoals keys to every locale JSON file
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
  profile: {
    qr: {
      title: "Your QR code",
      hint: "Show this QR code to a laboratory worker to confirm your photo and add the STD test result to your account — or show it to another user to check STD compatibility.",
    },
    searchGoals: {
      title: "What and who you are looking for",
      hint: "These marks work with search: users whose search matches what you marked here will find you.",
    },
  },
};

// Natural translations.
const natural = {
  uk: {
    profile: {
      qr: {
        title: "Ваш QR-код",
        hint: "Надайте цей QR-код працівнику лабораторії для підтвердження фото та додавання результату ІПСШ-тесту до акаунта — або покажіть його іншому користувачу для перевірки ІПСШ-сумісності.",
      },
      searchGoals: {
        title: "Що і кого ви шукаєте",
        hint: "Ці позначки працюють із пошуком: вас знайдуть користувачі, у яких в пошуку вказано те саме, що ви відмітили тут.",
      },
    },
  },
  ru: {
    profile: {
      qr: {
        title: "Ваш QR-код",
        hint: "Предоставьте этот QR-код сотруднику лаборатории для подтверждения фото и добавления результата ИППП-теста в аккаунт — или покажите его другому пользователю для проверки ИППП-совместимости.",
      },
      searchGoals: {
        title: "Что и кого вы ищете",
        hint: "Эти отметки работают с поиском: вас найдут пользователи, у которых в поиске указано то же самое, что вы отметили здесь.",
      },
    },
  },
  de: {
    profile: {
      qr: {
        title: "Ihr QR-Code",
        hint: "Zeigen Sie diesen QR-Code einem Labormitarbeiter, um Ihr Foto zu bestätigen und das STD-Testergebnis zu Ihrem Konto hinzuzufügen — oder zeigen Sie ihn einem anderen Benutzer, um die STD-Kompatibilität zu überprüfen.",
      },
      searchGoals: {
        title: "Was und wen Sie suchen",
        hint: "Diese Markierungen funktionieren mit der Suche: Benutzer, deren Suche mit dem übereinstimmt, was Sie hier markiert haben, werden Sie finden.",
      },
    },
  },
  fr: {
    profile: {
      qr: {
        title: "Votre code QR",
        hint: "Montrez ce code QR à un employé de laboratoire pour confirmer votre photo et ajouter le résultat du test MST à votre compte — ou montrez-le à un autre utilisateur pour vérifier la compatibilité MST.",
      },
      searchGoals: {
        title: "Ce que vous recherchez",
        hint: "Ces marques fonctionnent avec la recherche : les utilisateurs dont la recherche correspond à ce que vous avez marqué ici vous trouveront.",
      },
    },
  },
  es: {
    profile: {
      qr: {
        title: "Tu código QR",
        hint: "Muestra este código QR a un trabajador del laboratorio para confirmar tu foto y añadir el resultado de la prueba de ETS a tu cuenta — o muéstralo a otro usuario para comprobar la compatibilidad de ETS.",
      },
      searchGoals: {
        title: "Qué y a quién buscas",
        hint: "Estas marcas funcionan con la búsqueda: los usuarios cuya búsqueda coincida con lo que has marcado aquí te encontrarán.",
      },
    },
  },
  pt: {
    profile: {
      qr: {
        title: "Seu código QR",
        hint: "Mostre este código QR a um funcionário do laboratório para confirmar sua foto e adicionar o resultado do teste de DST à sua conta — ou mostre-o a outro usuário para verificar a compatibilidade de DST.",
      },
      searchGoals: {
        title: "O que e quem você procura",
        hint: "Estas marcas funcionam com a pesquisa: usuários cuja pesquisa corresponda ao que você marcou aqui encontrarão você.",
      },
    },
  },
  ja: {
    profile: {
      qr: {
        title: "QRコード",
        hint: "このQRコードを検査機関のスタッフに見せて写真を認証し、STD検査結果をアカウントに追加してください。または、他のユーザーに見せてSTD適合性を確認してください。",
      },
      searchGoals: {
        title: "何を探しているか",
        hint: "これらのマークは検索機能と連動しています。あなたがここでマークしたものと検索条件が一致するユーザーがあなたを見つけます。",
      },
    },
  },
  ko: {
    profile: {
      qr: {
        title: "QR 코드",
        hint: "이 QR 코드를 검사소 직원에게 보여주어 사진을 인증하고 STD 검사 결과를 계정에 추가하세요. 또는 다른 사용자에게 보여주어 STD 호환성을 확인하세요.",
      },
      searchGoals: {
        title: "무엇을 찾고 있나요",
        hint: "이 표시는 검색 기능과 연동됩니다. 여기서 표시한 내용과 검색 조건이 일치하는 사용자가 당신을 찾을 것입니다.",
      },
    },
  },
  zh: {
    profile: {
      qr: {
        title: "二维码",
        hint: "向实验室工作人员出示此二维码以确认您的照片并将 STD 测试结果添加到您的帐户 — 或向其他用户出示以检查 STD 兼容性。",
      },
      searchGoals: {
        title: "您在寻找什么",
        hint: "这些标记与搜索功能配合使用：搜索条件与您在此处标记的内容相匹配的用户将会找到您。",
      },
    },
  },
  ar: {
    profile: {
      qr: {
        title: "رمز الاستجابة السريعة الخاص بك",
        hint: "أظهر رمز الاستجابة السريعة هذا لموظف المختبر لتأكيد صورتك وإضافة نتيجة اختبار الأمراض المنقولة جنسياً إلى حسابك — أو أظهره لمستخدم آخر للتحقق من التوافق.",
      },
      searchGoals: {
        title: "ماذا ومن تبحث",
        hint: "تعمل هذه العلامات مع البحث: سيجدك المستخدمون الذين يتطابق بحثهم مع ما حددته هنا.",
      },
    },
  },
  vi: {
    profile: {
      qr: {
        title: "Mã QR của bạn",
        hint: "Đưa mã QR này cho nhân viên phòng xét nghiệm để xác nhận ảnh của bạn và thêm kết quả xét nghiệm STD vào tài khoản — hoặc đưa cho người dùng khác để kiểm tra tính tương thích STD.",
      },
      searchGoals: {
        title: "Bạn đang tìm kiếm gì",
        hint: "Các dấu hiệu này hoạt động với tìm kiếm: những người dùng có tìm kiếm khớp với những gì bạn đã đánh dấu ở đây sẽ tìm thấy bạn.",
      },
    },
  },
  hi: {
    profile: {
      qr: {
        title: "आपका QR कोड",
        hint: "अपनी फोटो की पुष्टि करने और STD परीक्षण परिणाम को अपने खाते में जोड़ने के लिए इस QR कोड को प्रयोगशाला कर्मचारी को दिखाएं — या STD अनुकूलता की जांच करने के लिए इसे किसी अन्य उपयोगकर्ता को दिखाएं।",
      },
      searchGoals: {
        title: "आप क्या और किसे ढूंढ रहे हैं",
        hint: "ये निशान खोज के साथ काम करते हैं: जिन उपयोगकर्ताओं की खोज आपके द्वारा यहां चिह्नित की गई चीज़ों से मेल खाती है, वे आपको ढूंढ लेंगे।",
      },
    },
  },
  tr: {
    profile: {
      qr: {
        title: "QR kodunuz",
        hint: "Fotoğrafınızı doğrulamak ve STD test sonucunu hesabınıza eklemek için bu QR kodunu bir laboratuvar çalışanına gösterin — veya STD uyumluluğunu kontrol etmek için başka bir kullanıcıya gösterin.",
      },
      searchGoals: {
        title: "Ne ve kimi arıyorsunuz",
        hint: "Bu işaretler arama ile çalışır: araması burada işaretlediklerinizle eşleşen kullanıcılar sizi bulacaktır.",
      },
    },
  },
  th: {
    profile: {
      qr: {
        title: "รหัส QR ของคุณ",
        hint: "แสดงรหัส QR นี้แก่เจ้าหน้าที่ห้องปฏิบัติการเพื่อยืนยันรูปถ่ายของคุณและเพิ่มผลการทดสอบ STD ลงในบัญชีของคุณ — หรือแสดงให้ผู้ใช้อื่นดูเพื่อตรวจสอบความเข้ากันได้ของ STD",
      },
      searchGoals: {
        title: "คุณกำลังมองหาอะไรและใคร",
        hint: "เครื่องหมายเหล่านี้ทำงานร่วมกับการค้นหา: ผู้ใช้ที่มีการค้นหาตรงกับสิ่งที่คุณทำเครื่องหมายไว้ที่นี่จะพบคุณ",
      },
    },
  },
  id: {
    profile: {
      qr: {
        title: "Kode QR Anda",
        hint: "Tunjukkan kode QR ini kepada petugas laboratorium untuk mengonfirmasi foto Anda dan menambahkan hasil tes STD ke akun Anda — atau tunjukkan kepada pengguna lain untuk memeriksa kompatibilitas STD.",
      },
      searchGoals: {
        title: "Apa dan siapa yang Anda cari",
        hint: "Tanda ini berfungsi dengan pencarian: pengguna yang pencariannya cocok dengan apa yang Anda tandai di sini akan menemukan Anda.",
      },
    },
  },
  ms: {
    profile: {
      qr: {
        title: "Kod QR anda",
        hint: "Tunjukkan kod QR ini kepada kakitangan makmal untuk mengesahkan foto anda dan menambah keputusan ujian STD ke akaun anda — atau tunjukkan kepada pengguna lain untuk menyemak keserasian STD.",
      },
      searchGoals: {
        title: "Apa dan siapa yang anda cari",
        hint: "Tanda ini berfungsi dengan carian: pengguna yang carian mereka sepadan dengan apa yang anda tandakan di sini akan menemui anda.",
      },
    },
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
  existing.profile = deepMerge(existing.profile || {}, data.profile);

  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

// Validate every file parses and has the required keys.
let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const p = j.profile || {};
    const qr = p.qr || {};
    const sg = p.searchGoals || {};
    if (!("title" in qr) || !("hint" in qr) || !("title" in sg) || !("hint" in sg)) {
      bad.push(f);
    }
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(
  bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : `ALL ${files.length} LOCALES VALID`,
);
