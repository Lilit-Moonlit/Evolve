/**
 * Adds the dashboard.roses.* (birth roses) + dashboard.mode3.deposit.*
 * keys to every locale JSON file in apps/web/src/i18n/locales/.
 *
 * Deterministic, non-LLM: preserves all existing keys via deep merge.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

// English source (Tier 2 fallback).
const rosesEn = {
  title: "Birth roses",
  hint: "1 EVOLVE = 1 rose from your EvolveFund deposit. Roses are gifted to the mother only after paternity is confirmed, together with the stake. If paternity is not confirmed, the EVOLVE returns to you.",
  cost: "Roses cost: {{count}} EVOLVE",
  total: "Total to transfer: {{total}} EVOLVE",
  fixed: "1 rose 🌹 (1 EVOLVE) — fixed for this mode",
  escrowed: "In escrow: {{count}} 🌹",
  withdraw: "Return {{count}} 🌹 ({{amount}} EVOLVE)",
};
const depositEn = {
  prompt:
    "Men need an active deposit to join (min 15 EVOLVE, 30+ days lock). This deposit is of the Postcopulation type and includes 1 fixed birth rose.",
};

// Natural translations for Tier 1 languages.
const natural = {
  uk: {
    roses: {
      title: "Троянди за народження дитини",
      hint: "1 EVOLVE = 1 троянда з вашого депозиту EvolveFund. Троянди даруються матері лише після підтвердження батьківства — одночасно зі стейком. Якщо батьківство не підтверджено, EVOLVE повертається вам.",
      cost: "Вартість троянд: {{count}} EVOLVE",
      total: "Разом до переведення: {{total}} EVOLVE",
      fixed: "1 троянда 🌹 (1 EVOLVE) — фіксовано для цього режиму",
      escrowed: "У резерві: {{count}} 🌹",
      withdraw: "Повернути {{count}} 🌹 ({{amount}} EVOLVE)",
    },
    deposit: {
      prompt:
        "Для участі потрібен активний депозит (мін 15 EVOLVE, блокування 30+ днів) типу «Посткопуляція» + 1 фіксована троянда за народження дитини.",
    },
  },
  ru: {
    roses: {
      title: "Розы за рождение ребёнка",
      hint: "1 EVOLVE = 1 роза из вашего депозита EvolveFund. Розы даруются матери только после подтверждения отцовства — одновременно со стейком. Если отцовство не подтверждено, EVOLVE возвращается вам.",
      cost: "Стоимость роз: {{count}} EVOLVE",
      total: "Всего к переводу: {{total}} EVOLVE",
      fixed: "1 роза 🌹 (1 EVOLVE) — фиксировано для этого режима",
      escrowed: "В резерве: {{count}} 🌹",
      withdraw: "Вернуть {{count}} 🌹 ({{amount}} EVOLVE)",
    },
    deposit: {
      prompt:
        "Для участия нужен активный депозит (мин 15 EVOLVE, блокировка 30+ дней) типа «Посткопуляция» + 1 фиксированная роза за рождение ребёнка.",
    },
  },
  de: {
    roses: {
      title: "Rosen zur Geburt",
      hint: "1 EVOLVE = 1 Rose aus Ihrer EvolveFund-Einzahlung. Rosen werden der Mutter erst nach bestätigter Vaterschaft geschenkt — zusammen mit dem Einsatz. Wird die Vaterschaft nicht bestätigt, erhalten Sie die EVOLVE zurück.",
      cost: "Rosen kosten: {{count}} EVOLVE",
      total: "Insgesamt zu überweisen: {{total}} EVOLVE",
      fixed: "1 Rose 🌹 (1 EVOLVE) — für diesen Modus festgelegt",
      escrowed: "Im Rückhalt: {{count}} 🌹",
      withdraw: "{{count}} 🌹 zurückholen ({{amount}} EVOLVE)",
    },
    deposit: {
      prompt:
        "Für die Teilnahme ist eine aktive Einzahlung nötig (mind. 15 EVOLVE, 30+ Tage gesperrt) vom Typ „Postkopulation“ + 1 feste Rose zur Geburt.",
    },
  },
  fr: {
    roses: {
      title: "Roses de naissance",
      hint: "1 EVOLVE = 1 rose prélevée sur votre dépôt EvolveFund. Les roses sont offertes à la mère uniquement après confirmation de la paternité, en même temps que la mise. Si la paternité n'est pas confirmée, les EVOLVE vous sont restitués.",
      cost: "Coût des roses : {{count}} EVOLVE",
      total: "Total à transférer : {{total}} EVOLVE",
      fixed: "1 rose 🌹 (1 EVOLVE) — fixe pour ce mode",
      escrowed: "En réserve : {{count}} 🌹",
      withdraw: "Récupérer {{count}} 🌹 ({{amount}} EVOLVE)",
    },
    deposit: {
      prompt:
        "Une mise active est requise pour participer (min 15 EVOLVE, verrouillée 30+ jours), de type « Postcopulation », + 1 rose de naissance fixe.",
    },
  },
  es: {
    roses: {
      title: "Rosas por el nacimiento",
      hint: "1 EVOLVE = 1 rosa de tu depósito EvolveFund. Las rosas se regalan a la madre solo cuando se confirma la paternidad, junto con la apuesta. Si la paternidad no se confirma, el EVOLVE te es devuelto.",
      cost: "Coste de las rosas: {{count}} EVOLVE",
      total: "Total a transferir: {{total}} EVOLVE",
      fixed: "1 rosa 🌹 (1 EVOLVE) — fijo para este modo",
      escrowed: "En reserva: {{count}} 🌹",
      withdraw: "Recuperar {{count}} 🌹 ({{amount}} EVOLVE)",
    },
    deposit: {
      prompt:
        "Para participar se necesita un depósito activo (mín. 15 EVOLVE, bloqueado 30+ días) del tipo «Postcopulación» + 1 rosa de nacimiento fija.",
    },
  },
  pt: {
    roses: {
      title: "Rosas de nascimento",
      hint: "1 EVOLVE = 1 rosa do seu depósito EvolveFund. As rosas são oferecidas à mãe somente após a confirmação da paternidade, junto com a aposta. Se a paternidade não for confirmada, o EVOLVE retorna para você.",
      cost: "Custo das rosas: {{count}} EVOLVE",
      total: "Total a transferir: {{total}} EVOLVE",
      fixed: "1 rosa 🌹 (1 EVOLVE) — fixo para este modo",
      escrowed: "Em reserva: {{count}} 🌹",
      withdraw: "Devolver {{count}} 🌹 ({{amount}} EVOLVE)",
    },
    deposit: {
      prompt:
        "Para participar é necessário um depósito ativo (mín. 15 EVOLVE, bloqueado por 30+ dias) do tipo «Póscópula» + 1 rosa de nascimento fixa.",
    },
  },
  ja: {
    roses: {
      title: "出産のバラ",
      hint: "1 EVOLVE = EvolveFundデポジットからのバラ1輪。バラは父性確認後にのみ、ステークと同時に母へ贈られます。父性が確認されなかった場合、EVOLVEはあなたに返却されます。",
      cost: "バラの費用：{{count}} EVOLVE",
      total: "合計送金額：{{total}} EVOLVE",
      fixed: "バラ1輪 🌹（1 EVOLVE）— このモードでは固定",
      escrowed: "保有中：{{count}} 🌹",
      withdraw: "{{count}} 🌹 を返却する（{{amount}} EVOLVE）",
    },
    deposit: {
      prompt:
        "参加には有効なデポジットが必要です（最低15 EVOLVE、30日以上ロック）。「交尾後」タイプ + 出産のバラ1輪（固定）。",
    },
  },
  ko: {
    roses: {
      title: "출생 장미",
      hint: "1 EVOLVE = EvolveFund 입금액에서 차감되는 장미 1송이. 장미는 친자 확인 후에만 스테이크와 함께 어머니에게 선물됩니다. 친자가 확인되지 않으면 EVOLVE는 당신에게 반환됩니다.",
      cost: "장미 비용: {{count}} EVOLVE",
      total: "총 이체 금액: {{total}} EVOLVE",
      fixed: "장미 1송이 🌹 (1 EVOLVE) — 이 모드에서는 고정",
      escrowed: "예치 중: {{count}} 🌹",
      withdraw: "{{count}} 🌹 돌려받기 ({{amount}} EVOLVE)",
    },
    deposit: {
      prompt:
        "참여에는 활성 입금이 필요합니다(최소 15 EVOLVE, 30일 이상 잠금). «성교 후» 유형 + 고정 출생 장미 1송이.",
    },
  },
  zh: {
    roses: {
      title: "新生玫瑰",
      hint: "1 EVOLVE = 从您的 EvolveFund 存款中扣除的 1 朵玫瑰。玫瑰仅在父权确认后与保证金一起赠送给母亲。若父权未获确认，EVOLVE 将退还给您。",
      cost: "玫瑰费用：{{count}} EVOLVE",
      total: "合计转入：{{total}} EVOLVE",
      fixed: "1 朵玫瑰 🌹（1 EVOLVE）— 此模式下固定",
      escrowed: "托管中：{{count}} 🌹",
      withdraw: "取回 {{count}} 🌹（{{amount}} EVOLVE）",
    },
    deposit: {
      prompt:
        "参与需要有效存款（最少 15 EVOLVE，锁定 30 天以上），类型为«交配后» + 1 朵固定的新生玫瑰。",
    },
  },
  "zh-TW": {
    roses: {
      title: "新生玫瑰",
      hint: "1 EVOLVE = 從您的 EvolveFund 存款中扣除的 1 朵玫瑰。玫瑰僅在父權確認後與保證金一起贈送給母親。若父權未獲確認，EVOLVE 將退還給您。",
      cost: "玫瑰費用：{{count}} EVOLVE",
      total: "合計轉入：{{total}} EVOLVE",
      fixed: "1 朵玫瑰 🌹（1 EVOLVE）— 此模式下固定",
      escrowed: "託管中：{{count}} 🌹",
      withdraw: "取回 {{count}} 🌹（{{amount}} EVOLVE）",
    },
    deposit: {
      prompt:
        "參與需要有效存款（最少 15 EVOLVE，鎖定 30 天以上），類型為«交配後» + 1 朵固定的新生玫瑰。",
    },
  },
  ar: {
    roses: {
      title: "ورود المولود",
      hint: "1 EVOLVE = وردة واحدة من وديعتك في EvolveFund. تُهدى الورود للأم فقط بعد تأكيد الأبوة، مع الحصة في الوقت نفسه. إذا لم تُؤكد الأبوة، تُعاد لك عملات EVOLVE.",
      cost: "تكلفة الورود: {{count}} EVOLVE",
      total: "الإجمالي للتحويل: {{total}} EVOLVE",
      fixed: "وردة واحدة 🌹 (1 EVOLVE) — ثابتة في هذا الوضع",
      escrowed: "محجوزة: {{count}} 🌹",
      withdraw: "استرجاع {{count}} 🌹 ({{amount}} EVOLVE)",
    },
    deposit: {
      prompt:
        "تتطلب المشاركة وديعة نشطة (15 EVOLVE كحد أدنى، مقيدة 30+ يومًا) من نوع «ما بعد الجماع» + وردة مولود واحدة ثابتة.",
    },
  },
  vi: {
    roses: {
      title: "Hoa hồng chào đời",
      hint: "1 EVOLVE = 1 hoa hồng từ khoản gửi EvolveFund của bạn. Hoa hồng chỉ được tặng cho người mẹ sau khi xác nhận cha, cùng với tiền đặt cọc. Nếu cha không được xác nhận, EVOLVE được hoàn lại cho bạn.",
      cost: "Chi phí hoa hồng: {{count}} EVOLVE",
      total: "Tổng chuyển: {{total}} EVOLVE",
      fixed: "1 hoa hồng 🌹 (1 EVOLVE) — cố định cho chế độ này",
      escrowed: "Đang giữ: {{count}} 🌹",
      withdraw: "Nhận lại {{count}} 🌹 ({{amount}} EVOLVE)",
    },
    deposit: {
      prompt:
        "Để tham gia cần khoản gửi hoạt động (tối thiểu 15 EVOLVE, khóa 30+ ngày) loại «Hậu giao hợp» + 1 hoa hồng chào đời cố định.",
    },
  },
  hi: {
    roses: {
      title: "जन्म गुलाब",
      hint: "1 EVOLVE = आपकी EvolveFund जमा से 1 गुलाब। गुलाब केवल पितृत्व की पुष्टि के बाद, दांव के साथ माँ को भेंट किए जाते हैं। यदि पितृत्व की पुष्टि नहीं होती, तो EVOLVE आपको वापस मिल जाता है।",
      cost: "गुलाब की लागत: {{count}} EVOLVE",
      total: "कुल स्थानांतरित: {{total}} EVOLVE",
      fixed: "1 गुलाब 🌹 (1 EVOLVE) — इस मोड के लिए निश्चित",
      escrowed: "इस्क्रो में: {{count}} 🌹",
      withdraw: "{{count}} 🌹 वापस लें ({{amount}} EVOLVE)",
    },
    deposit: {
      prompt:
        "भागीदारी के लिए सक्रिय जमा आवश्यक है (न्यूनतम 15 EVOLVE, 30+ दिन लॉक) «संभोग के बाद» प्रकार + 1 निश्चित जन्म गुलाब।",
    },
  },
  tr: {
    roses: {
      title: "Doğum gülleri",
      hint: "1 EVOLVE = EvolveFund mevduatınızdan 1 gül. Güller yalnızca babalık onaylandıktan sonra, stake ile birlikte anneye hediye edilir. Babalık onaylanmazsa EVOLVE size iade edilir.",
      cost: "Gül maliyeti: {{count}} EVOLVE",
      total: "Toplam aktarım: {{total}} EVOLVE",
      fixed: "1 gül 🌹 (1 EVOLVE) — bu mod için sabit",
      escrowed: "Emanette: {{count}} 🌹",
      withdraw: "{{count}} 🌹 geri al ({{amount}} EVOLVE)",
    },
    deposit: {
      prompt:
        "Katılım için aktif bir mevduat gerekir (en az 15 EVOLVE, 30+ gün kilitli), «Postkopülasyon» türü + 1 sabit doğum gülü.",
    },
  },
  th: {
    roses: {
      title: "กุหลาบประสูติ",
      hint: "1 EVOLVE = กุหลาบ 1 ดอกจากเงินฝาก EvolveFund ของคุณ กุหลาบจะมอบให้แม่เฉพาะเมื่อยืนยันความเป็นพ่อแล้ว พร้อมกับเงินเดิมพัน หากไม่ได้รับการยืนยัน EVOLVE จะคืนให้คุณ",
      cost: "ค่ากุหลาบ: {{count}} EVOLVE",
      total: "ยอดโอนรวม: {{total}} EVOLVE",
      fixed: "กุหลาบ 1 ดอก 🌹 (1 EVOLVE) — คงที่สำหรับโหมดนี้",
      escrowed: "อยู่ในการเก็บรักษา: {{count}} 🌹",
      withdraw: "รับคืน {{count}} 🌹 ({{amount}} EVOLVE)",
    },
    deposit: {
      prompt:
        "การเข้าร่วมต้องมีเงินฝากที่ใช้งาน (ขั้นต่ำ 15 EVOLVE ล็อก 30+ วัน) ประเภท «หลังร่วมประเวณี» + กุหลาบประสูติคงที่ 1 ดอก",
    },
  },
  id: {
    roses: {
      title: "Mawar kelahiran",
      hint: "1 EVOLVE = 1 mawar dari setoran EvolveFund Anda. Mawar diberikan kepada ibu hanya setelah keayahannya dikonfirmasi, bersamaan dengan taruhannya. Jika keayahannya tidak dikonfirmasi, EVOLVE dikembalikan kepada Anda.",
      cost: "Biaya mawar: {{count}} EVOLVE",
      total: "Total transfer: {{total}} EVOLVE",
      fixed: "1 mawar 🌹 (1 EVOLVE) — tetap untuk mode ini",
      escrowed: "Ditahan: {{count}} 🌹",
      withdraw: "Kembalikan {{count}} 🌹 ({{amount}} EVOLVE)",
    },
    deposit: {
      prompt:
        "Untuk berpartisipasi diperlukan setoran aktif (min 15 EVOLVE, terkunci 30+ hari) jenis «Pascakopulasi» + 1 mawar kelahiran tetap.",
    },
  },
  ms: {
    roses: {
      title: "Ros kelahiran",
      hint: "1 EVOLVE = 1 ros daripada deposit EvolveFund anda. Ros diberikan kepada ibu hanya selepas keibubapaan disahkan, bersama stake. Jika keibubapaan tidak disahkan, EVOLVE dipulangkan kepada anda.",
      cost: "Kos ros: {{count}} EVOLVE",
      total: "Jumlah pindahan: {{total}} EVOLVE",
      fixed: "1 ros 🌹 (1 EVOLVE) — tetap untuk mod ini",
      escrowed: "Ditahan: {{count}} 🌹",
      withdraw: "Pulangkan {{count}} 🌹 ({{amount}} EVOLVE)",
    },
    deposit: {
      prompt:
        "Penyertaan memerlukan deposit aktif (min 15 EVOLVE, berkunci 30+ hari) jenis «Pasca-sanggama» + 1 ros kelahiran tetap.",
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

function buildRoses(locale) {
  const n = natural[locale];
  return n ? { ...rosesEn, ...n.roses } : { ...rosesEn };
}

function buildDeposit(locale) {
  const n = natural[locale];
  return n ? { ...depositEn, ...n.deposit } : { ...depositEn };
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, "");
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));

  // Add keys under dashboard.roses / dashboard.mode3.deposit (preserve existing).
  existing.dashboard = deepMerge(existing.dashboard || {}, {
    roses: buildRoses(locale),
  });
  existing.dashboard = deepMerge(existing.dashboard, {
    mode3: deepMerge(existing.dashboard.mode3 || {}, {
      deposit: buildDeposit(locale),
    }),
  });

  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

// Validate every file parses and has the required keys.
let bad = [];
const requiredRoses = ["title", "hint", "cost", "total", "fixed", "escrowed", "withdraw"];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const r = (j.dashboard || {}).roses || {};
    const d = ((j.dashboard || {}).mode3 || {}).deposit || {};
    const missing = requiredRoses
      .filter((k) => !(k in r))
      .concat(!("prompt" in d) ? ["prompt"] : []);
    if (missing.length) bad.push(`${f}: ${missing.join(",")}`);
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(
  bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : `ALL ${files.length} LOCALES VALID`,
);
