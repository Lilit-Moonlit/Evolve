/**
 * Adds the `privacy.wallet.*` keys (Private Wallet UI — shield, unshield,
 * private transfer, balances, status/error states) to EVERY locale JSON file in
 * apps/web/src/i18n/locales/.
 *
 * Deterministic and idempotent: preserves all existing keys via deep merge
 * and only adds/overwrites the `privacy.wallet` subtree below.
 *
 * Natural translations are provided for Tier 1 languages (uk de fr es pt ja
 * ko zh ar vi hi tr th id ms ru) plus zh-TW (Traditional Chinese); every
 * other locale falls back to English (repo Tier 2 convention).
 *
 * The locale directory is enumerated DYNAMICALLY — any new locale file is
 * picked up automatically; nothing about the count is hardcoded.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

// ─── English source (fallback for every locale without a natural entry) ───
const en = {
  title: "Private Wallet (Railgun)",
  shield: "Shield EVOLVE",
  unshield: "Unshield EVOLVE",
  sendPrivate: "Private Transfer",
  balance: "Shielded Balance",
  amount: "Amount (EVOLVE)",
  recipient: "Recipient Address (ETH)",
  recipient0zkPlaceholder: "0zk1q...",
  sdkMissing: "Railgun SDK not installed",
  txSent: "Transaction submitted",
  error: "Operation failed",
};

// ─── Natural translations (Tier 1 + zh-TW) ───
const natural = {
  uk: {
    title: "Приватний гаманець (Railgun)",
    shield: "Захистити (Shield) EVOLVE",
    unshield: "Розшифрувати (Unshield) EVOLVE",
    sendPrivate: "Приватний переказ",
    balance: "Приватний баланс",
    amount: "Сума (EVOLVE)",
    recipient: "Адреса отримувача (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "Railgun SDK не встановлено",
    txSent: "Транзакцію відправлено",
    error: "Помилка операції",
  },
  ru: {
    title: "Приватный кошелёк (Railgun)",
    shield: "Защитить (Shield) EVOLVE",
    unshield: "Расшифровать (Unshield) EVOLVE",
    sendPrivate: "Приватный перевод",
    balance: "Приватный баланс",
    amount: "Сумма (EVOLVE)",
    recipient: "Адрес получателя (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "Railgun SDK не установлен",
    txSent: "Транзакция отправлена",
    error: "Ошибка операции",
  },
  de: {
    title: "Privates Wallet (Railgun)",
    shield: "EVOLVE schützen (Shield)",
    unshield: "EVOLVE entsperren (Unshield)",
    sendPrivate: "Private Überweisung",
    balance: "Geschütztes Guthaben",
    amount: "Betrag (EVOLVE)",
    recipient: "Empfängeradresse (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "Railgun SDK nicht installiert",
    txSent: "Transaktion gesendet",
    error: "Vorgang fehlgeschlagen",
  },
  fr: {
    title: "Portefeuille privé (Railgun)",
    shield: "Protéger (Shield) EVOLVE",
    unshield: "Débloquer (Unshield) EVOLVE",
    sendPrivate: "Transfert privé",
    balance: "Solde protégé",
    amount: "Montant (EVOLVE)",
    recipient: "Adresse du destinataire (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "SDK Railgun non installé",
    txSent: "Transaction envoyée",
    error: "Échec de l'opération",
  },
  es: {
    title: "Billetera privada (Railgun)",
    shield: "Proteger (Shield) EVOLVE",
    unshield: "Desproteger (Unshield) EVOLVE",
    sendPrivate: "Transferencia privada",
    balance: "Saldo protegido",
    amount: "Monto (EVOLVE)",
    recipient: "Dirección del destinatario (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "SDK de Railgun no instalado",
    txSent: "Transacción enviada",
    error: "Operación fallida",
  },
  pt: {
    title: "Carteira privada (Railgun)",
    shield: "Proteger (Shield) EVOLVE",
    unshield: "Desproteger (Unshield) EVOLVE",
    sendPrivate: "Transferência privada",
    balance: "Saldo protegido",
    amount: "Valor (EVOLVE)",
    recipient: "Endereço do destinatário (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "SDK do Railgun não instalado",
    txSent: "Transação enviada",
    error: "Falha na operação",
  },
  ja: {
    title: "プライベートウォレット (Railgun)",
    shield: "EVOLVEを保護 (Shield)",
    unshield: "EVOLVEの保護を解除 (Unshield)",
    sendPrivate: "プライベート送金",
    balance: "シールド残高",
    amount: "金額 (EVOLVE)",
    recipient: "受取人アドレス (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "Railgun SDKがインストールされていません",
    txSent: "トランザクションを送信しました",
    error: "操作に失敗しました",
  },
  ko: {
    title: "개인 지갑 (Railgun)",
    shield: "EVOLVE 보호 (Shield)",
    unshield: "EVOLVE 보호 해제 (Unshield)",
    sendPrivate: "비공개 전송",
    balance: "보호된 잔액",
    amount: "수량 (EVOLVE)",
    recipient: "받는 사람 주소 (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "Railgun SDK가 설치되지 않았습니다",
    txSent: "트랜잭션이 전송되었습니다",
    error: "작업 실패",
  },
  zh: {
    title: "隐私钱包 (Railgun)",
    shield: "屏蔽 (Shield) EVOLVE",
    unshield: "解蔽 (Unshield) EVOLVE",
    sendPrivate: "隐私转账",
    balance: "隐私余额",
    amount: "数量 (EVOLVE)",
    recipient: "接收人地址 (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "未安装 Railgun SDK",
    txSent: "交易已发送",
    error: "操作失败",
  },
  "zh-TW": {
    title: "隱私錢包 (Railgun)",
    shield: "屏蔽 (Shield) EVOLVE",
    unshield: "解蔽 (Unshield) EVOLVE",
    sendPrivate: "隱私轉帳",
    balance: "隱私餘額",
    amount: "數量 (EVOLVE)",
    recipient: "接收人地址 (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "未安裝 Railgun SDK",
    txSent: "交易已發送",
    error: "操作失敗",
  },
  ar: {
    title: "المحفظة الخاصة (Railgun)",
    shield: "حماية (Shield) EVOLVE",
    unshield: "إلغاء حماية (Unshield) EVOLVE",
    sendPrivate: "تحويل خاص",
    balance: "الرصيد المحمي",
    amount: "المبلغ (EVOLVE)",
    recipient: "عنوان المستلم (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "حزمة Railgun SDK غير مثبّتة",
    txSent: "تم إرسال المعاملة",
    error: "فشلت العملية",
  },
  vi: {
    title: "Ví riêng tư (Railgun)",
    shield: "Bảo vệ (Shield) EVOLVE",
    unshield: "Bỏ bảo vệ (Unshield) EVOLVE",
    sendPrivate: "Chuyển khoản riêng tư",
    balance: "Số dư đã bảo vệ",
    amount: "Số lượng (EVOLVE)",
    recipient: "Địa chỉ người nhận (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "Chưa cài đặt Railgun SDK",
    txSent: "Đã gửi giao dịch",
    error: "Thao tác thất bại",
  },
  hi: {
    title: "निजी वॉलेट (Railgun)",
    shield: "EVOLVE को सुरक्षित (Shield) करें",
    unshield: "EVOLVE अनशील्ड (Unshield) करें",
    sendPrivate: "निजी स्थानांतरण",
    balance: "सुरक्षित शेष",
    amount: "मात्रा (EVOLVE)",
    recipient: "प्राप्तकर्ता पता (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "Railgun SDK इंस्टॉल नहीं है",
    txSent: "लेन-देन भेजा गया",
    error: "ऑपरेशन विफल रहा",
  },
  tr: {
    title: "Gizli Cüzdan (Railgun)",
    shield: "EVOLVE Gizle (Shield)",
    unshield: "EVOLVE Çıkar (Unshield)",
    sendPrivate: "Gizli Transfer",
    balance: "Gizli Bakiye",
    amount: "Miktar (EVOLVE)",
    recipient: "Alıcı Adresi (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "Railgun SDK yüklü değil",
    txSent: "İşlem gönderildi",
    error: "İşlem başarısız",
  },
  th: {
    title: "กระเป๋าเงินส่วนตัว (Railgun)",
    shield: "ปกป้อง (Shield) EVOLVE",
    unshield: "ยกเลิกการปกป้อง (Unshield) EVOLVE",
    sendPrivate: "โอนเงินส่วนตัว",
    balance: "ยอดเงินที่ปกป้องไว้",
    amount: "จำนวน (EVOLVE)",
    recipient: "ที่อยู่ผู้รับ (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "ยังไม่ได้ติดตั้ง Railgun SDK",
    txSent: "ส่งรายการแล้ว",
    error: "การดำเนินการล้มเหลว",
  },
  id: {
    title: "Dompet Pribadi (Railgun)",
    shield: "Lindungi (Shield) EVOLVE",
    unshield: "Buka (Unshield) EVOLVE",
    sendPrivate: "Transfer Pribadi",
    balance: "Saldo Terlindungi",
    amount: "Jumlah (EVOLVE)",
    recipient: "Alamat Penerima (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "Railgun SDK belum terinstal",
    txSent: "Transaksi dikirim",
    error: "Operasi gagal",
  },
  ms: {
    title: "Dompet Peribadi (Railgun)",
    shield: "Lindungi (Shield) EVOLVE",
    unshield: "Nyah-lindungi (Unshield) EVOLVE",
    sendPrivate: "Pindahan Peribadi",
    balance: "Baki Dilindungi",
    amount: "Jumlah (EVOLVE)",
    recipient: "Alamat Penerima (ETH)",
    recipient0zkPlaceholder: "0zk1q...",
    sdkMissing: "Railgun SDK tidak dipasang",
    txSent: "Transaksi dihantar",
    error: "Operasi gagal",
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

function buildWallet(locale) {
  const n = natural[locale];
  if (!n) return deepClone(en);
  return deepMerge(deepClone(en), n);
}

const REQUIRED = [
  "title",
  "shield",
  "unshield",
  "sendPrivate",
  "balance",
  "amount",
  "recipient",
  "recipient0zkPlaceholder",
  "sdkMissing",
  "txSent",
  "error",
];

function hasKey(obj, dottedPath) {
  let cur = obj;
  for (const part of dottedPath.split(".")) {
    if (cur == null || typeof cur !== "object" || !(part in cur)) return false;
    cur = cur[part];
  }
  return typeof cur === "string" && cur.length > 0;
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, "");
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));
  existing.privacy = existing.privacy || {};
  existing.privacy.wallet = deepMerge(existing.privacy.wallet || {}, buildWallet(locale));
  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

const bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const missing = REQUIRED.filter((k) => !hasKey(j.privacy?.wallet, k));
    if (missing.length > 0) bad.push(`${f}: missing ${missing.join(", ")}`);
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}

console.log(
  bad.length ? `VALIDATION FAILED: ${bad.join(" | ")}` : `ALL ${files.length} LOCALES VALID`,
);
