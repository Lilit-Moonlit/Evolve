/**
 * Adds the `skinColor` filter label and the `skinColors` value map to the
 * `filters` object in every locale JSON file in apps/web/src/i18n/locales/.
 *
 * Deterministic, non-LLM: preserves all existing keys via deep merge and only
 * adds what the Home/Profile UI consumes.
 *
 * Natural translations are provided for Tier 1 languages; all other locales
 * fall back to English (matching the repo's Tier 2 convention in TIER2-*.md).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

// profile.tabs.settings label per language code.
const settingsTabLabel = {
  uk: "Налаштування",
  de: "Einstellungen",
  fr: "Paramètres",
  es: "Ajustes",
  pt: "Configurações",
  ja: "設定",
  ko: "설정",
  zh: "设置",
  ar: "الإعدادات",
  vi: "Cài đặt",
  hi: "सेटिंग्स",
  tr: "Ayarlar",
  th: "การตั้งค่า",
  id: "Pengaturan",
  ms: "Tetapan",
  ru: "Настройки",
};

// navigation.communications label per language code (replaces navigation.messages).
const communicationsLabel = {
  uk: "Комунікації",
  de: "Kommunikation",
  fr: "Communications",
  es: "Comunicaciones",
  pt: "Comunicações",
  ja: "コミュニケーション",
  ko: "커뮤니케이션",
  zh: "通讯",
  ar: "التواصل",
  vi: "Giao tiếp",
  hi: "संचार",
  tr: "İletişim",
  th: "การสื่อสาร",
  id: "Komunikasi",
  ms: "Komunikasi",
  ru: "Коммуникации",
};

// English source for the skin color keys.
const skinEn = {
  skinColor: "Skin color",
  skinColors: {
    fair: "Fair",
    light: "Light",
    medium: "Medium",
    tan: "Tan",
    dark: "Dark",
    deep: "Deep",
  },
};

// Natural translations for Tier 1 languages (label + each value).
const natural = {
  uk: {
    skinColor: "Колір шкіри",
    skinColors: {
      fair: "Світла",
      light: "Світло-біла",
      medium: "Середня",
      tan: "Загоріла",
      dark: "Темна",
      deep: "Дуже темна",
    },
  },
  de: {
    skinColor: "Hautfarbe",
    skinColors: {
      fair: "Hell",
      light: "Licht",
      medium: "Mittel",
      tan: "Gebräunt",
      dark: "Dunkel",
      deep: "Sehr dunkel",
    },
  },
  fr: {
    skinColor: "Couleur de peau",
    skinColors: {
      fair: "Clair",
      light: "Lumineux",
      medium: "Moyen",
      tan: "Halé",
      dark: "Foncé",
      deep: "Très foncé",
    },
  },
  es: {
    skinColor: "Color de piel",
    skinColors: {
      fair: "Clara",
      light: "Blanca",
      medium: "Media",
      tan: "Bronceada",
      dark: "Oscura",
      deep: "Muy oscura",
    },
  },
  pt: {
    skinColor: "Cor da pele",
    skinColors: {
      fair: "Clara",
      light: "Branca",
      medium: "Média",
      tan: "Bronzeada",
      dark: "Escura",
      deep: "Muito escura",
    },
  },
  ja: {
    skinColor: "肌の色",
    skinColors: {
      fair: "明るい",
      light: "白い",
      medium: "中程度",
      tan: "日焼けした",
      dark: "濃い",
      deep: "とても濃い",
    },
  },
  ko: {
    skinColor: "피부색",
    skinColors: {
      fair: "연한",
      light: "밝은",
      medium: "중간",
      tan: "구릿빛",
      dark: "어두운",
      deep: "매우 어두운",
    },
  },
  zh: {
    skinColor: "肤色",
    skinColors: {
      fair: "白皙",
      light: "浅色",
      medium: "中等",
      tan: "古铜",
      dark: "深色",
      deep: "很深",
    },
  },
  ar: {
    skinColor: "لون البشرة",
    skinColors: {
      fair: "فاتح جدا",
      light: "فاتح",
      medium: "متوسط",
      tan: "أسمر",
      dark: "داكن",
      deep: "داكن جدا",
    },
  },
  vi: {
    skinColor: "Màu da",
    skinColors: {
      fair: "Rất sáng",
      light: "Sáng",
      medium: "Trung bình",
      tan: "Rám nắng",
      dark: "Tối",
      deep: "Rất tối",
    },
  },
  hi: {
    skinColor: "त्वचा का रंग",
    skinColors: {
      fair: "गोरा",
      light: "हल्का",
      medium: "मध्यम",
      tan: "साँवला",
      dark: "गहरा",
      deep: "बहुत गहरा",
    },
  },
  tr: {
    skinColor: "Cilt rengi",
    skinColors: {
      fair: "Pek açık",
      light: "Açık",
      medium: "Orta",
      tan: "Bronz",
      dark: "Koyu",
      deep: "Çok koyu",
    },
  },
  th: {
    skinColor: "สีผิว",
    skinColors: {
      fair: "ขาวมาก",
      light: "ขาว",
      medium: "ปานกลาง",
      tan: "แทน",
      dark: "เข้ม",
      deep: "เข้มมาก",
    },
  },
  id: {
    skinColor: "Warna kulit",
    skinColors: {
      fair: "Sangat cerah",
      light: "Cerah",
      medium: "Sedang",
      tan: "Kecokelatan",
      dark: "Gelap",
      deep: "Sangat gelap",
    },
  },
  ms: {
    skinColor: "Warna kulit",
    skinColors: {
      fair: "Sangat cerah",
      light: "Cerah",
      medium: "Sederhana",
      tan: "Kecokelatan",
      dark: "Gelap",
      deep: "Sangat gelap",
    },
  },
  ru: {
    skinColor: "Цвет кожи",
    skinColors: {
      fair: "Светлая",
      light: "Белая",
      medium: "Средняя",
      tan: "Загорелая",
      dark: "Тёмная",
      deep: "Очень тёмная",
    },
  },
};

// English source for the communications (Proposals panel) keys.
const communicationsEn = {
  proposalsTitle: "Proposals",
  proposalsSubtitle: "Community initiatives — votes are weighted by reputation",
  proposalTitlePlaceholder: "Proposal title",
  proposalDescPlaceholder: "Short description (optional)",
  createProposal: "Create proposal",
  votesFor: "For",
  votesAgainst: "Against",
  voteWeightHint: "Your vote weight: {{weight}} (reputation)",
  noProposals: "No proposals yet. Create the first one!",
  yes: "Yes",
  no: "No",
  youVotedWeight: "You voted — weight {{weight}}",
};

// Natural translations for the communications keys (Tier 1 languages).
const communicationsNatural = {
  uk: {
    proposalsTitle: "Пропозиції",
    proposalsSubtitle: "Ініціативи спільноти — вага голосу залежить від рейтингу",
    proposalTitlePlaceholder: "Назва пропозиції",
    proposalDescPlaceholder: "Короткий опис (необов'язково)",
    createProposal: "Створити пропозицію",
    votesFor: "За",
    votesAgainst: "Проти",
    voteWeightHint: "Вага вашого голосу: {{weight}} (рейтинг)",
    noProposals: "Пропозицій ще немає. Створіть першу!",
    yes: "Так",
    no: "Ні",
    youVotedWeight: "Ви проголосували — вага {{weight}}",
  },
  ru: {
    proposalsTitle: "Предложения",
    proposalsSubtitle: "Инициативы сообщества — вес голоса зависит от рейтинга",
    proposalTitlePlaceholder: "Название предложения",
    proposalDescPlaceholder: "Краткое описание (необязательно)",
    createProposal: "Создать предложение",
    votesFor: "За",
    votesAgainst: "Против",
    voteWeightHint: "Вес вашего голоса: {{weight}} (рейтинг)",
    noProposals: "Предложений пока нет. Создайте первое!",
    yes: "Да",
    no: "Нет",
    youVotedWeight: "Вы проголосовали — вес {{weight}}",
  },
  de: {
    proposalsTitle: "Vorschläge",
    proposalsSubtitle: "Community-Initiativen — Stimmen werden nach Reputation gewichtet",
    proposalTitlePlaceholder: "Titel des Vorschlags",
    proposalDescPlaceholder: "Kurze Beschreibung (optional)",
    createProposal: "Vorschlag erstellen",
    votesFor: "Dafür",
    votesAgainst: "Dagegen",
    voteWeightHint: "Ihr Stimmgewicht: {{weight}} (Reputation)",
    noProposals: "Noch keine Vorschläge. Erstellen Sie den ersten!",
    yes: "Ja",
    no: "Nein",
    youVotedWeight: "Sie haben abgestimmt — Gewicht {{weight}}",
  },
  fr: {
    proposalsTitle: "Propositions",
    proposalsSubtitle: "Initiatives communautaires — votes pondérés par la réputation",
    proposalTitlePlaceholder: "Titre de la proposition",
    proposalDescPlaceholder: "Brève description (facultatif)",
    createProposal: "Créer une proposition",
    votesFor: "Pour",
    votesAgainst: "Contre",
    voteWeightHint: "Poids de votre vote : {{weight}} (réputation)",
    noProposals: "Aucune proposition pour l'instant. Créez la première !",
    yes: "Oui",
    no: "Non",
    youVotedWeight: "Vous avez voté — poids {{weight}}",
  },
  es: {
    proposalsTitle: "Propuestas",
    proposalsSubtitle: "Iniciativas comunitarias — los votos se ponderan por reputación",
    proposalTitlePlaceholder: "Título de la propuesta",
    proposalDescPlaceholder: "Breve descripción (opcional)",
    createProposal: "Crear propuesta",
    votesFor: "A favor",
    votesAgainst: "En contra",
    voteWeightHint: "El peso de su voto: {{weight}} (reputación)",
    noProposals: "Aún no hay propuestas. ¡Cree la primera!",
    yes: "Sí",
    no: "No",
    youVotedWeight: "Ha votado — peso {{weight}}",
  },
  pt: {
    proposalsTitle: "Propostas",
    proposalsSubtitle: "Iniciativas comunitárias — votos ponderados pela reputação",
    proposalTitlePlaceholder: "Título da proposta",
    proposalDescPlaceholder: "Breve descrição (opcional)",
    createProposal: "Criar proposta",
    votesFor: "A favor",
    votesAgainst: "Contra",
    voteWeightHint: "Peso do seu voto: {{weight}} (reputação)",
    noProposals: "Ainda não há propostas. Crie a primeira!",
    yes: "Sim",
    no: "Não",
    youVotedWeight: "Você votou — peso {{weight}}",
  },
  ja: {
    proposalsTitle: "提案",
    proposalsSubtitle: "コミュニティの取り組み — 投票は評価で重み付けされます",
    proposalTitlePlaceholder: "提案タイトル",
    proposalDescPlaceholder: "簡単な説明（任意）",
    createProposal: "提案を作成",
    votesFor: "賛成",
    votesAgainst: "反対",
    voteWeightHint: "あなたの投票の重み: {{weight}}（評価）",
    noProposals: "まだ提案はありません。最初の提案を作成しましょう!",
    yes: "はい",
    no: "いいえ",
    youVotedWeight: "投票しました — 重み {{weight}}",
  },
  ko: {
    proposalsTitle: "제안",
    proposalsSubtitle: "커뮤니티 이니셔티브 — 평판에 따라 가중치가 부여된 투표",
    proposalTitlePlaceholder: "제안 제목",
    proposalDescPlaceholder: "간단한 설명(선택 사항)",
    createProposal: "제안 만들기",
    votesFor: "찬성",
    votesAgainst: "반대",
    voteWeightHint: "내 투표 가중치: {{weight}} (평판)",
    noProposals: "아직 제안이 없습니다. 첫 제안을 만들어 보세요!",
    yes: "예",
    no: "아니오",
    youVotedWeight: "투표하셨습니다 — 가중치 {{weight}}",
  },
  zh: {
    proposalsTitle: "提案",
    proposalsSubtitle: "社区倡议——票数按声望加权",
    proposalTitlePlaceholder: "提案标题",
    proposalDescPlaceholder: "简短描述（可选）",
    createProposal: "创建提案",
    votesFor: "赞成",
    votesAgainst: "反对",
    voteWeightHint: "您的投票权重：{{weight}}（声望）",
    noProposals: "暂无提案。创建第一个吧！",
    yes: "是",
    no: "否",
    youVotedWeight: "您已投票 — 权重 {{weight}}",
  },
  ar: {
    proposalsTitle: "المقترحات",
    proposalsSubtitle: "مبادرات المجتمع — يتم وزن الأصوات حسب السمعة",
    proposalTitlePlaceholder: "عنوان المقترح",
    proposalDescPlaceholder: "وصف مختصر (اختياري)",
    createProposal: "إنشاء مقترح",
    votesFor: "مع",
    votesAgainst: "ضد",
    voteWeightHint: "وزن صوتك: {{weight}} (السمعة)",
    noProposals: "لا توجد مقترحات بعد. أنشئ الأول!",
    yes: "نعم",
    no: "لا",
    youVotedWeight: "لقد صوّت — الوزن {{weight}}",
  },
  vi: {
    proposalsTitle: "Đề xuất",
    proposalsSubtitle: "Sáng kiến cộng đồng — phiếu được tính theo uy tín",
    proposalTitlePlaceholder: "Tiêu đề đề xuất",
    proposalDescPlaceholder: "Mô tả ngắn (tùy chọn)",
    createProposal: "Tạo đề xuất",
    votesFor: "Đồng ý",
    votesAgainst: "Phản đối",
    voteWeightHint: "Trọng số phiếu của bạn: {{weight}} (uy tín)",
    noProposals: "Chưa có đề xuất nào. Hãy tạo đề xuất đầu tiên!",
    yes: "Có",
    no: "Không",
    youVotedWeight: "Bạn đã bỏ phiếu — trọng số {{weight}}",
  },
  hi: {
    proposalsTitle: "प्रस्ताव",
    proposalsSubtitle: "समुदाय की पहल — वोट प्रतिष्ठा के आधार पर भारित होते हैं",
    proposalTitlePlaceholder: "प्रस्ताव का शीर्षक",
    proposalDescPlaceholder: "संक्षिप्त विवरण (वैकल्पिक)",
    createProposal: "प्रस्ताव बनाएं",
    votesFor: "पक्ष में",
    votesAgainst: "विरोध में",
    voteWeightHint: "आपके वोट का भार: {{weight}} (प्रतिष्ठा)",
    noProposals: "अभी कोई प्रस्ताव नहीं है। पहला बनाएं!",
    yes: "हाँ",
    no: "नहीं",
    youVotedWeight: "आपने मत दिया — भार {{weight}}",
  },
  tr: {
    proposalsTitle: "Öneriler",
    proposalsSubtitle: "Topluluk girişimleri — oylar itibara göre ağırlıklandırılır",
    proposalTitlePlaceholder: "Öneri başlığı",
    proposalDescPlaceholder: "Kısa açıklama (isteğe bağlı)",
    createProposal: "Öneri oluştur",
    votesFor: "Lehte",
    votesAgainst: "Aleyhte",
    voteWeightHint: "Oy ağırlığınız: {{weight}} (itibar)",
    noProposals: "Henüz öneri yok. İlkini oluşturun!",
    yes: "Evet",
    no: "Hayır",
    youVotedWeight: "Oy verdiniz — ağırlık {{weight}}",
  },
  th: {
    proposalsTitle: "ข้อเสนอ",
    proposalsSubtitle: "ความคิดริเริ่มของชุมชน — คะแนนเสียงถ่วงน้ำหนักตามชื่อเสียง",
    proposalTitlePlaceholder: "หัวข้อข้อเสนอ",
    proposalDescPlaceholder: "คำอธิบายสั้น ๆ (ไม่บังคับ)",
    createProposal: "สร้างข้อเสนอ",
    votesFor: "เห็นด้วย",
    votesAgainst: "ไม่เห็นด้วย",
    voteWeightHint: "น้ำหนักเสียงของคุณ: {{weight}} (ชื่อเสียง)",
    noProposals: "ยังไม่มีข้อเสนอ สร้างข้อเสนอแรก!",
    yes: "ใช่",
    no: "ไม่",
    youVotedWeight: "คุณโหวตแล้ว — น้ำหนัก {{weight}}",
  },
  id: {
    proposalsTitle: "Proposal",
    proposalsSubtitle: "Inisiatif komunitas — suara dibobot berdasarkan reputasi",
    proposalTitlePlaceholder: "Judul proposal",
    proposalDescPlaceholder: "Deskripsi singkat (opsional)",
    createProposal: "Buat proposal",
    votesFor: "Setuju",
    votesAgainst: "Tidak setuju",
    voteWeightHint: "Bobot suara Anda: {{weight}} (reputasi)",
    noProposals: "Belum ada proposal. Buat yang pertama!",
    yes: "Ya",
    no: "Tidak",
    youVotedWeight: "Anda telah memilih — bobot {{weight}}",
  },
  ms: {
    proposalsTitle: "Cadangan",
    proposalsSubtitle: "Inisiatif komuniti — undian diberatkan mengikut reputasi",
    proposalTitlePlaceholder: "Tajuk cadangan",
    proposalDescPlaceholder: "Penerangan ringkas (pilihan)",
    createProposal: "Cipta cadangan",
    votesFor: "Setuju",
    votesAgainst: "Tidak setuju",
    voteWeightHint: "Berat undi anda: {{weight}} (reputasi)",
    noProposals: "Tiada cadangan lagi. Cipta yang pertama!",
    yes: "Ya",
    no: "Tidak",
    youVotedWeight: "Anda telah mengundi — berat {{weight}}",
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

function buildSkin(locale) {
  const n = natural[locale];
  if (!n) return deepClone(skinEn);
  return deepMerge(deepClone(skinEn), n);
}

function buildCommunications(locale) {
  const n = communicationsNatural[locale];
  if (!n) return deepClone(communicationsEn);
  return deepMerge(deepClone(communicationsEn), n);
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, ""); // e.g. "uk", "zh-TW"
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));

  // Add skin color keys inside the filters object (preserve existing filters).
  existing.filters = deepMerge(existing.filters || {}, buildSkin(locale));

  // Add navigation.communications (replaces navigation.messages).
  existing.navigation = existing.navigation || {};
  existing.navigation.communications = communicationsLabel[locale] || "Communications";

  // Add profile.tabs.settings (Settings moved into Profile tabs).
  existing.profile = existing.profile || {};
  existing.profile.tabs = existing.profile.tabs || {};
  existing.profile.tabs.settings = settingsTabLabel[locale] || "Settings";

  // Add communications.* (Proposals panel module).
  existing.communications = deepMerge(existing.communications || {}, buildCommunications(locale));

  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

// Validate every file parses and has the required keys.
let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const fKey = j.filters || {};
    const coms = j.communications || {};
    if (
      !("skinColor" in fKey) ||
      !fKey.skinColors ||
      !fKey.skinColors.fair ||
      !fKey.skinColors.deep ||
      !coms.proposalsTitle ||
      !coms.createProposal
    ) {
      bad.push(f);
    }
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : "ALL 33 LOCALES VALID");
