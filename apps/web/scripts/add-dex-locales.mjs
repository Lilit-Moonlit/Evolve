/**
 * Adds the 'dex' namespace (Swap EVOLVE UI, 18 keys) to every locale JSON
 * file in apps/web/src/i18n/locales/.
 *
 * Deterministic, non-LLM: preserves all existing keys via deep merge.
 * Tier-1 languages get natural translations; zh-TW inherits zh.
 * Idempotent: running twice produces identical files.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

const DEX_KEYS = [
  "title",
  "subtitle",
  "chain",
  "from",
  "to",
  "amount",
  "slippage",
  "getQuote",
  "swap",
  "swapping",
  "bestRate",
  "estimatedOutput",
  "insufficientBalance",
  "notAvailable",
  "quoteError",
  "swapSuccess",
  "swapFailed",
  "proxyNotConfigured",
];

// English source (Tier 2 fallback).
const en = {
  title: "Swap EVOLVE",
  subtitle: "Swap tokens via a DEX on Arbitrum or Avalanche.",
  chain: "Network",
  from: "From",
  to: "To",
  amount: "Amount",
  slippage: "Slippage",
  getQuote: "Get quote",
  swap: "Swap",
  swapping: "Swapping…",
  bestRate: "Best rate",
  estimatedOutput: "You receive",
  insufficientBalance: "Insufficient balance",
  notAvailable: "Not available on this network yet",
  quoteError: "Could not fetch a quote",
  swapSuccess: "Swap submitted",
  swapFailed: "Swap failed",
  proxyNotConfigured: "Swap service is not configured",
};

// Natural translations for Tier 1 languages (zh-TW inherits zh).
const natural = {
  uk: {
    title: "Обмін EVOLVE",
    subtitle: "Обмінюйте токени через DEX на Arbitrum або Avalanche.",
    chain: "Мережа",
    from: "З",
    to: "На",
    amount: "Кількість",
    slippage: "Прослизання",
    getQuote: "Отримати курс",
    swap: "Обміняти",
    swapping: "Обмін…",
    bestRate: "Найкращий курс",
    estimatedOutput: "Ви отримаєте",
    insufficientBalance: "Недостатньо коштів",
    notAvailable: "Ще недоступно в цій мережі",
    quoteError: "Не вдалося отримати курс",
    swapSuccess: "Обмін надіслано",
    swapFailed: "Обмін не вдався",
    proxyNotConfigured: "Сервіс обміну не налаштовано",
  },
  ru: {
    title: "Обмен EVOLVE",
    subtitle: "Обменивайте токены через DEX на Arbitrum или Avalanche.",
    chain: "Сеть",
    from: "Отдаёте",
    to: "Получаете",
    amount: "Количество",
    slippage: "Проскальзывание",
    getQuote: "Получить курс",
    swap: "Обменять",
    swapping: "Обмен…",
    bestRate: "Лучший курс",
    estimatedOutput: "Вы получите",
    insufficientBalance: "Недостаточно средств",
    notAvailable: "Пока недоступно в этой сети",
    quoteError: "Не удалось получить курс",
    swapSuccess: "Обмен отправлен",
    swapFailed: "Обмен не удался",
    proxyNotConfigured: "Сервис обмена не настроен",
  },
  de: {
    title: "EVOLVE tauschen",
    subtitle: "Tausche Token über einen DEX auf Arbitrum oder Avalanche.",
    chain: "Netzwerk",
    from: "Von",
    to: "Nach",
    amount: "Betrag",
    slippage: "Slippage",
    getQuote: "Kurs abrufen",
    swap: "Tauschen",
    swapping: "Tausche…",
    bestRate: "Bester Kurs",
    estimatedOutput: "Du erhältst",
    insufficientBalance: "Unzureichendes Guthaben",
    notAvailable: "In diesem Netzwerk noch nicht verfügbar",
    quoteError: "Kurs konnte nicht abgerufen werden",
    swapSuccess: "Tausch übermittelt",
    swapFailed: "Tausch fehlgeschlagen",
    proxyNotConfigured: "Tauschdienst ist nicht konfiguriert",
  },
  fr: {
    title: "Échanger EVOLVE",
    subtitle: "Échangez des tokens via un DEX sur Arbitrum ou Avalanche.",
    chain: "Réseau",
    from: "De",
    to: "Vers",
    amount: "Montant",
    slippage: "Slippage",
    getQuote: "Obtenir un devis",
    swap: "Échanger",
    swapping: "Échange…",
    bestRate: "Meilleur taux",
    estimatedOutput: "Vous recevez",
    insufficientBalance: "Solde insuffisant",
    notAvailable: "Pas encore disponible sur ce réseau",
    quoteError: "Impossible d'obtenir un devis",
    swapSuccess: "Échange envoyé",
    swapFailed: "Échec de l'échange",
    proxyNotConfigured: "Le service d'échange n'est pas configuré",
  },
  es: {
    title: "Intercambiar EVOLVE",
    subtitle: "Intercambia tokens a través de un DEX en Arbitrum o Avalanche.",
    chain: "Red",
    from: "De",
    to: "A",
    amount: "Cantidad",
    slippage: "Deslizamiento",
    getQuote: "Obtener cotización",
    swap: "Intercambiar",
    swapping: "Intercambiando…",
    bestRate: "Mejor tasa",
    estimatedOutput: "Recibes",
    insufficientBalance: "Saldo insuficiente",
    notAvailable: "Aún no disponible en esta red",
    quoteError: "No se pudo obtener la cotización",
    swapSuccess: "Intercambio enviado",
    swapFailed: "Intercambio fallido",
    proxyNotConfigured: "El servicio de intercambio no está configurado",
  },
  pt: {
    title: "Trocar EVOLVE",
    subtitle: "Troque tokens através de um DEX no Arbitrum ou Avalanche.",
    chain: "Rede",
    from: "De",
    to: "Para",
    amount: "Quantia",
    slippage: "Deslizamento",
    getQuote: "Obter cotação",
    swap: "Trocar",
    swapping: "Trocando…",
    bestRate: "Melhor taxa",
    estimatedOutput: "Você recebe",
    insufficientBalance: "Saldo insuficiente",
    notAvailable: "Ainda não disponível nesta rede",
    quoteError: "Não foi possível obter a cotação",
    swapSuccess: "Troca enviada",
    swapFailed: "Falha na troca",
    proxyNotConfigured: "O serviço de troca não está configurado",
  },
  ja: {
    title: "EVOLVEをスワップ",
    subtitle: "ArbitrumまたはAvalancheのDEXでトークンをスワップします。",
    chain: "ネットワーク",
    from: "支払い",
    to: "受取",
    amount: "数量",
    slippage: "スリッページ",
    getQuote: "レートを取得",
    swap: "スワップ",
    swapping: "スワップ中…",
    bestRate: "最良レート",
    estimatedOutput: "受け取る数量",
    insufficientBalance: "残高が不足しています",
    notAvailable: "このネットワークではまだ利用できません",
    quoteError: "レートを取得できませんでした",
    swapSuccess: "スワップを送信しました",
    swapFailed: "スワップに失敗しました",
    proxyNotConfigured: "スワップサービスが設定されていません",
  },
  ko: {
    title: "EVOLVE 스왑",
    subtitle: "Arbitrum 또는 Avalanche의 DEX에서 토큰을 스왑합니다.",
    chain: "네트워크",
    from: "보내기",
    to: "받기",
    amount: "수량",
    slippage: "슬리피지",
    getQuote: "시세 조회",
    swap: "스왑",
    swapping: "스왑 중…",
    bestRate: "최고 시세",
    estimatedOutput: "받게 될 금액",
    insufficientBalance: "잔액이 부족합니다",
    notAvailable: "아직 이 네트워크에서는 이용할 수 없습니다",
    quoteError: "시세를 가져오지 못했습니다",
    swapSuccess: "스왑이 제출되었습니다",
    swapFailed: "스왑에 실패했습니다",
    proxyNotConfigured: "스왑 서비스가 구성되어 있지 않습니다",
  },
  zh: {
    title: "兑换 EVOLVE",
    subtitle: "通过 Arbitrum 或 Avalanche 上的 DEX 兑换代币。",
    chain: "网络",
    from: "从",
    to: "到",
    amount: "数量",
    slippage: "滑点",
    getQuote: "获取报价",
    swap: "兑换",
    swapping: "兑换中…",
    bestRate: "最优汇率",
    estimatedOutput: "您将收到",
    insufficientBalance: "余额不足",
    notAvailable: "该网络暂不支持",
    quoteError: "无法获取报价",
    swapSuccess: "兑换已提交",
    swapFailed: "兑换失败",
    proxyNotConfigured: "兑换服务未配置",
  },
  ar: {
    title: "تبديل EVOLVE",
    subtitle: "بدّل الرموز عبر DEX على Arbitrum أو Avalanche.",
    chain: "الشبكة",
    from: "من",
    to: "إلى",
    amount: "الكمية",
    slippage: "الانزلاق السعري",
    getQuote: "الحصول على السعر",
    swap: "تبديل",
    swapping: "جارٍ التبديل…",
    bestRate: "أفضل سعر",
    estimatedOutput: "ستتلقى",
    insufficientBalance: "الرصيد غير كافٍ",
    notAvailable: "غير متاح على هذه الشبكة بعد",
    quoteError: "تعذّر الحصول على السعر",
    swapSuccess: "تم إرسال التبديل",
    swapFailed: "فشل التبديل",
    proxyNotConfigured: "خدمة التبديل غير مهيأة",
  },
  vi: {
    title: "Hoán đổi EVOLVE",
    subtitle: "Hoán đổi token qua DEX trên Arbitrum hoặc Avalanche.",
    chain: "Mạng",
    from: "Từ",
    to: "Đến",
    amount: "Số lượng",
    slippage: "Độ trượt giá",
    getQuote: "Nhận báo giá",
    swap: "Hoán đổi",
    swapping: "Đang hoán đổi…",
    bestRate: "Tỷ giá tốt nhất",
    estimatedOutput: "Bạn nhận được",
    insufficientBalance: "Số dư không đủ",
    notAvailable: "Chưa khả dụng trên mạng này",
    quoteError: "Không thể lấy báo giá",
    swapSuccess: "Đã gửi lệnh hoán đổi",
    swapFailed: "Hoán đổi thất bại",
    proxyNotConfigured: "Dịch vụ hoán đổi chưa được cấu hình",
  },
  hi: {
    title: "EVOLVE स्वैप करें",
    subtitle: "Arbitrum या Avalanche पर DEX के ज़रिए टोकन स्वैप करें।",
    chain: "नेटवर्क",
    from: "से",
    to: "को",
    amount: "राशि",
    slippage: "स्लिपेज",
    getQuote: "कोटेशन प्राप्त करें",
    swap: "स्वैप करें",
    swapping: "स्वैप हो रहा है…",
    bestRate: "सर्वोत्तम दर",
    estimatedOutput: "आपको प्राप्त होगा",
    insufficientBalance: "अपर्याप्त बैलेंस",
    notAvailable: "यह नेटवर्क अभी उपलब्ध नहीं है",
    quoteError: "कोटेशन प्राप्त नहीं हो सका",
    swapSuccess: "स्वैप भेज दिया गया",
    swapFailed: "स्वैप विफल रहा",
    proxyNotConfigured: "स्वैप सेवा कॉन्फ़िगर नहीं है",
  },
  tr: {
    title: "EVOLVE Takas Et",
    subtitle: "Arbitrum veya Avalanche üzerindeki bir DEX ile token takası yapın.",
    chain: "Ağ",
    from: "Gönderilen",
    to: "Alınan",
    amount: "Miktar",
    slippage: "Kayma",
    getQuote: "Fiyat al",
    swap: "Takas Et",
    swapping: "Takas ediliyor…",
    bestRate: "En iyi kur",
    estimatedOutput: "Alacağınız",
    insufficientBalance: "Yetersiz bakiye",
    notAvailable: "Bu ağda henüz mevcut değil",
    quoteError: "Fiyat alınamadı",
    swapSuccess: "Takas gönderildi",
    swapFailed: "Takas başarısız oldu",
    proxyNotConfigured: "Takas servisi yapılandırılmamış",
  },
  th: {
    title: "สลับ EVOLVE",
    subtitle: "สลับโทเคนผ่าน DEX บน Arbitrum หรือ Avalanche",
    chain: "เครือข่าย",
    from: "จาก",
    to: "ไปยัง",
    amount: "จำนวน",
    slippage: "ส่วนต่างราคา",
    getQuote: "รับราคา",
    swap: "สลับ",
    swapping: "กำลังสลับ…",
    bestRate: "ราคาที่ดีที่สุด",
    estimatedOutput: "คุณจะได้รับ",
    insufficientBalance: "ยอดเงินไม่เพียงพอ",
    notAvailable: "ยังไม่พร้อมใช้งานบนเครือข่ายนี้",
    quoteError: "ไม่สามารถดึงราคาได้",
    swapSuccess: "ส่งคำสั่งสลับแล้ว",
    swapFailed: "การสลับล้มเหลว",
    proxyNotConfigured: "บริการสลับยังไม่ได้ตั้งค่า",
  },
  id: {
    title: "Tukar EVOLVE",
    subtitle: "Tukar token melalui DEX di Arbitrum atau Avalanche.",
    chain: "Jaringan",
    from: "Dari",
    to: "Ke",
    amount: "Jumlah",
    slippage: "Selisih harga",
    getQuote: "Dapatkan kutipan",
    swap: "Tukar",
    swapping: "Menukar…",
    bestRate: "Kurs terbaik",
    estimatedOutput: "Anda terima",
    insufficientBalance: "Saldo tidak cukup",
    notAvailable: "Belum tersedia di jaringan ini",
    quoteError: "Gagal mengambil kutipan",
    swapSuccess: "Penukaran dikirim",
    swapFailed: "Penukaran gagal",
    proxyNotConfigured: "Layanan penukaran belum dikonfigurasi",
  },
  ms: {
    title: "Tukar EVOLVE",
    subtitle: "Tukar token melalui DEX pada Arbitrum atau Avalanche.",
    chain: "Rangkaian",
    from: "Daripada",
    to: "Kepada",
    amount: "Jumlah",
    slippage: "Slip harga",
    getQuote: "Dapatkan sebut harga",
    swap: "Tukar",
    swapping: "Menukar…",
    bestRate: "Kadar terbaik",
    estimatedOutput: "Anda terima",
    insufficientBalance: "Baki tidak mencukupi",
    notAvailable: "Belum tersedia di rangkaian ini",
    quoteError: "Gagal mendapatkan sebut harga",
    swapSuccess: "Penukaran dihantar",
    swapFailed: "Penukaran gagal",
    proxyNotConfigured: "Perkhidmatan penukaran tidak dikonfigurasi",
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

// zh-TW inherits the zh translations; other locales use their own entry.
function naturalKeyFor(locale) {
  return locale === "zh-TW" ? "zh" : locale;
}

function buildDex(locale) {
  const n = natural[naturalKeyFor(locale)];
  return n ? { ...en, ...n } : { ...en };
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, "");
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));

  // Add the dex object (preserve existing keys).
  existing.dex = deepMerge(existing.dex || {}, buildDex(locale));

  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

// Validate every file parses and has all required keys.
let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const dex = j.dex || {};
    const missing = DEX_KEYS.filter((k) => !(k in dex));
    if (missing.length) {
      bad.push(`${f}: missing ${missing.join(",")}`);
    }
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(
  bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : `ALL ${files.length} LOCALES VALID`,
);
