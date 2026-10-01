/**
 * Insert Mode2/Mode3 i18n keys into all 33 locale files.
 * Tier 1 = natural translations, Tier 2 = English.
 *
 * Run from project root: node scripts/i18n-mode2-3-insert.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const localesDir = join(__dirname, "..", "apps", "web", "src", "i18n", "locales");

// Tier 1 languages with natural translations
const translations = {
  uk: {
    navigationMode2: "Панель",
    navigationMode3: "Панель",
    dashboardCtaMode2: "Відкрити панель Зачаття",
    dashboardCtaMode3: "Відкрити панель Посткопуляції",
    modeDashboardTitle: "Панель режиму",
    modeDashboardDesc: "Керуйте налаштуваннями активного режиму та діяльністю в мережі",
    mode2Label: "Зачаття",
    mode2Desc: "Режим зачаття — верифіковані учасники, зв'язки в блокчейні",
    mode3Label: "Посткопуляція",
    mode3Desc: "Режим посткопуляції — анонімні сесії, резолюція в блокчейні",
    openMode2: "Відкрити панель Зачаття",
    openMode3: "Відкрити панель Посткопуляції",
  },
  de: {
    navigationMode2: "Dashboard",
    navigationMode3: "Dashboard",
    dashboardCtaMode2: "Empfängnis-Dashboard öffnen",
    dashboardCtaMode3: "Postkopulations-Dashboard öffnen",
    modeDashboardTitle: "Modus-Dashboard",
    modeDashboardDesc: "Verwalten Sie Ihre aktiven Modus-Einstellungen und On-Chain-Aktivitäten",
    mode2Label: "Empfängnis",
    mode2Desc: "Empfängnis-Modus — verifizierte Teilnehmer, On-Chain-Bonds",
    mode3Label: "Postkopulation",
    mode3Desc: "Postkopulations-Modus — anonyme Sitzungen, On-Chain-Auflösung",
    openMode2: "Empfängnis-Dashboard öffnen",
    openMode3: "Postkopulations-Dashboard öffnen",
  },
  fr: {
    navigationMode2: "Tableau de bord",
    navigationMode3: "Tableau de bord",
    dashboardCtaMode2: "Ouvrir le tableau de bord Conception",
    dashboardCtaMode3: "Ouvrir le tableau de bord Post-copulation",
    modeDashboardTitle: "Tableau de bord du mode",
    modeDashboardDesc: "Gérez vos paramètres de mode actif et votre activité on-chain",
    mode2Label: "Conception",
    mode2Desc: "Mode Conception — participants vérifiés, liens on-chain",
    mode3Label: "Post-copulation",
    mode3Desc: "Mode Post-copulation — sessions anonymes, résolution on-chain",
    openMode2: "Ouvrir le tableau de bord Conception",
    openMode3: "Ouvrir le tableau de bord Post-copulation",
  },
  es: {
    navigationMode2: "Panel",
    navigationMode3: "Panel",
    dashboardCtaMode2: "Abrir panel de Concepción",
    dashboardCtaMode3: "Abrir panel de Postcopulación",
    modeDashboardTitle: "Panel del modo",
    modeDashboardDesc: "Gestiona la configuración de tu modo activo y la actividad en cadena",
    mode2Label: "Concepción",
    mode2Desc: "Modo Concepción — participantes verificados, vínculos en cadena",
    mode3Label: "Postcopulación",
    mode3Desc: "Modo Postcopulación — sesiones anónimas, resolución en cadena",
    openMode2: "Abrir panel de Concepción",
    openMode3: "Abrir panel de Postcopulación",
  },
  pt: {
    navigationMode2: "Painel",
    navigationMode3: "Painel",
    dashboardCtaMode2: "Abrir painel de Concepção",
    dashboardCtaMode3: "Abrir painel de Pós-copulação",
    modeDashboardTitle: "Painel do modo",
    modeDashboardDesc: "Gerencie as configurações do seu modo ativo e a atividade on-chain",
    mode2Label: "Concepção",
    mode2Desc: "Modo Concepção — participantes verificados, vínculos on-chain",
    mode3Label: "Pós-copulação",
    mode3Desc: "Modo Pós-copulação — sessões anônimas, resolução on-chain",
    openMode2: "Abrir painel de Concepção",
    openMode3: "Abrir painel de Pós-copulação",
  },
  ja: {
    navigationMode2: "ダッシュボード",
    navigationMode3: "ダッシュボード",
    dashboardCtaMode2: "コンセプションダッシュボードを開く",
    dashboardCtaMode3: "ポストコピュレーションダッシュボードを開く",
    modeDashboardTitle: "モードダッシュボード",
    modeDashboardDesc: "アクティブなモード設定とオンチェーンアクティビティを管理",
    mode2Label: "コンセプション",
    mode2Desc: "コンセプションモード — 検証済み参加者、オンチェーンボンド",
    mode3Label: "ポストコピュレーション",
    mode3Desc: "ポストコピュレーションモード — 匿名セッション、オンチェーン解決",
    openMode2: "コンセプションダッシュボードを開く",
    openMode3: "ポストコピュレーションダッシュボードを開く",
  },
  ko: {
    navigationMode2: "대시보드",
    navigationMode3: "대시보드",
    dashboardCtaMode2: "수정 대시보드 열기",
    dashboardCtaMode3: "수정 후 대시보드 열기",
    modeDashboardTitle: "모드 대시보드",
    modeDashboardDesc: "활성 모드 설정과 온체인 활동을 관리하세요",
    mode2Label: "수정",
    mode2Desc: "수정 모드 — 검증된 참여자, 온체인 본드",
    mode3Label: "수정 후",
    mode3Desc: "수정 후 모드 — 익명 세션, 온체인 해결",
    openMode2: "수정 대시보드 열기",
    openMode3: "수정 후 대시보드 열기",
  },
  "zh-TW": {
    navigationMode2: "儀表板",
    navigationMode3: "儀表板",
    dashboardCtaMode2: "打開受孕儀表板",
    dashboardCtaMode3: "打開後交配儀表板",
    modeDashboardTitle: "模式儀表板",
    modeDashboardDesc: "管理您的活躍模式設定和鏈上活動",
    mode2Label: "受孕",
    mode2Desc: "受孕模式 — 驗證參與者，鏈上綁定",
    mode3Label: "後交配",
    mode3Desc: "後交配模式 — 匿名會話，鏈上解決",
    openMode2: "打開受孕儀表板",
    openMode3: "打開後交配儀表板",
  },
  ar: {
    navigationMode2: "لوحة التحكم",
    navigationMode3: "لوحة التحكم",
    dashboardCtaMode2: "فتح لوحة التحكم الإنجابية",
    dashboardCtaMode3: "فتح لوحة التحكم ما بعد التلقيح",
    modeDashboardTitle: "لوحة التحكم الوضعية",
    modeDashboardDesc: "إدارة إعدادات وضعك النشط والأنشطة على السلسلة",
    mode2Label: "الإنجاب",
    mode2Desc: "وضع الإنجاب — مشاركون موثقون، روابط على السلسلة",
    mode3Label: "ما بعد التلقيح",
    mode3Desc: "وضع ما بعد التلقيح — جلسات مجهولة الهوية، حل على السلسلة",
    openMode2: "فتح لوحة التحكم الإنجابية",
    openMode3: "فتح لوحة التحكم ما بعد التلقيح",
  },
  vi: {
    navigationMode2: "Bảng điều khiển",
    navigationMode3: "Bảng điều khiển",
    dashboardCtaMode2: "Mở bảng điều khiển Thụ thai",
    dashboardCtaMode3: "Mở bảng điều khiển Sau giao hợp",
    modeDashboardTitle: "Bảng điều khiển chế độ",
    modeDashboardDesc: "Quản lý cài đặt chế độ hoạt động và hoạt động trên chuỗi",
    mode2Label: "Thụ thai",
    mode2Desc: "Chế độ Thụ thai — người tham gia đã xác minh, liên kết trên chuỗi",
    mode3Label: "Sau giao hợp",
    mode3Desc: "Chế độ Sau giao hợp — phiên ẩn danh, giải quyết trên chuỗi",
    openMode2: "Mở bảng điều khiển Thụ thai",
    openMode3: "Mở bảng điều khiển Sau giao hợp",
  },
  ru: {
    navigationMode2: "Панель",
    navigationMode3: "Панель",
    dashboardCtaMode2: "Открыть панель Зачатия",
    dashboardCtaMode3: "Открыть панель Посткопуляции",
    modeDashboardTitle: "Панель режима",
    modeDashboardDesc: "Управляйте настройками активного режима и активностью в сети",
    mode2Label: "Зачатие",
    mode2Desc: "Режим Зачатия — верифицированные участники, связи в блокчейне",
    mode3Label: "Посткопуляция",
    mode3Desc: "Режим Посткопуляции — анонимные сессии, резолюция в блокчейне",
    openMode2: "Открыть панель Зачатия",
    openMode3: "Открыть панель Посткопуляции",
  },
  hi: {
    navigationMode2: "डैशबोर्ड",
    navigationMode3: "डैशबोर्ड",
    dashboardCtaMode2: "गर्भाधान डैशबोर्ड खोलें",
    dashboardCtaMode3: "सहवास-पश्चात् डैशबोर्ड खोलें",
    modeDashboardTitle: "मोड डैशबोर्ड",
    modeDashboardDesc: "अपनी सक्रिय मोड सेटिंग्स और ऑन-चेन गतिविधियों का प्रबंधन करें",
    mode2Label: "गर्भाधान",
    mode2Desc: "गर्भाधान मोड — सत्यापित प्रतिभागी, ऑन-चेन बॉन्ड",
    mode3Label: "सहवास-पश्चात्",
    mode3Desc: "सहवास-पश्चात् मोड — अनाम सत्र, ऑन-चेन समाधान",
    openMode2: "गर्भाधान डैशबोर्ड खोलें",
    openMode3: "सहवास-पश्चात् डैशबोर्ड खोलें",
  },
  tr: {
    navigationMode2: "Panel",
    navigationMode3: "Panel",
    dashboardCtaMode2: "Döllenme Panelini Aç",
    dashboardCtaMode3: "Sonrası Eşleşme Panelini Aç",
    modeDashboardTitle: "Mod Paneli",
    modeDashboardDesc: "Aktif mod ayarlarınızı ve zincir üstü etkinliklerinizi yönetin",
    mode2Label: "Döllenme",
    mode2Desc: "Döllenme Modu — doğrulanmış katılımcılar, zincir üstü bağlar",
    mode3Label: "Sonrası Eşleşme",
    mode3Desc: "Sonrası Eşleşme Modu — anonim oturumlar, zincir üstü çözüm",
    openMode2: "Döllenme Panelini Aç",
    openMode3: "Sonrası Eşleşme Panelini Aç",
  },
  th: {
    navigationMode2: "แดชบอร์ด",
    navigationMode3: "แดชบอร์ด",
    dashboardCtaMode2: "เปิดแดชบอร์ดการปฏิสนธิ",
    dashboardCtaMode3: "เปิดแดชบอร์ดหลังการผสมพันธุ์",
    modeDashboardTitle: "แดชบอร์ดโหมด",
    modeDashboardDesc: "จัดการการตั้งค่าโหมดที่ใช้งานและกิจกรรมบนเครือข่าย",
    mode2Label: "การปฏิสนธิ",
    mode2Desc: "โหมดการปฏิสนธิ — ผู้เข้าร่วมที่ผ่านการตรวจสอบ บอนด์บนเครือข่าย",
    mode3Label: "หลังการผสมพันธุ์",
    mode3Desc: "โหมดหลังการผสมพันธุ์ — เซสชันนิรนาม การแก้ไขบนเครือข่าย",
    openMode2: "เปิดแดชบอร์ดการปฏิสนธิ",
    openMode3: "เปิดแดชบอร์ดหลังการผสมพันธุ์",
  },
  id: {
    navigationMode2: "Dasbor",
    navigationMode3: "Dasbor",
    dashboardCtaMode2: "Buka Dasbor Konsepsi",
    dashboardCtaMode3: "Buka Dasbor Pasca-Berkopulasi",
    modeDashboardTitle: "Dasbor Mode",
    modeDashboardDesc: "Kelola pengaturan mode aktif dan aktivitas on-chain Anda",
    mode2Label: "Konsepsi",
    mode2Desc: "Mode Konsepsi — peserta terverifikasi, ikatan on-chain",
    mode3Label: "Pasca-Berkopulasi",
    mode3Desc: "Mode Pasca-Berkopulasi — sesi anonim, penyelesaian on-chain",
    openMode2: "Buka Dasbor Konsepsi",
    openMode3: "Buka Dasbor Pasca-Berkopulasi",
  },
  ms: {
    navigationMode2: "Papan Pemuka",
    navigationMode3: "Papan Pemuka",
    dashboardCtaMode2: "Buka Papan Pemuka Persenyawaan",
    dashboardCtaMode3: "Buka Papan Pemuka Pasca-Kopulasi",
    modeDashboardTitle: "Papan Pemuka Mod",
    modeDashboardDesc: "Urus tetapan mod aktif dan aktiviti rantaian anda",
    mode2Label: "Persenyawaan",
    mode2Desc: "Mod Persenyawaan — peserta disahkan, ikatan rantaian",
    mode3Label: "Pasca-Kopulasi",
    mode3Desc: "Mod Pasca-Kopulasi — sesi tanpa nama, penyelesaian rantaian",
    openMode2: "Buka Papan Pemuka Persenyawaan",
    openMode3: "Buka Papan Pemuka Pasca-Kopulasi",
  },
};

// Tier 2 (English defaults)
const enDefaults = {
  navigationMode2: "Dashboard",
  navigationMode3: "Dashboard",
  dashboardCtaMode2: "Open Pregnancy Bond Dashboard",
  dashboardCtaMode3: "Open Cryptic Choice Dashboard",
  modeDashboardTitle: "Mode Dashboard",
  modeDashboardDesc: "Manage your active mode settings and on-chain activity",
  mode2Label: "Pregnancy Bond",
  mode2Desc: "Pregnancy Bond mode — verified participants, on-chain bonds",
  mode3Label: "Cryptic Choice",
  mode3Desc: "Cryptic Choice mode — anonymous sessions, on-chain resolution",
  openMode2: "Open Pregnancy Bond Dashboard",
  openMode3: "Open Cryptic Choice Dashboard",
};

const tier1 = new Set(Object.keys(translations));

function addKeys(obj, tr) {
  // Add navigation.mode2 and navigation.mode3
  if (obj.navigation) {
    obj.navigation.mode2 = tr.navigationMode2;
    obj.navigation.mode3 = tr.navigationMode3;
  }

  // Add home.dashboardCta
  if (obj.home) {
    obj.home.dashboardCta = {
      mode2: tr.dashboardCtaMode2,
      mode3: tr.dashboardCtaMode3,
    };
  }

  // Add settings.modeDashboard
  if (obj.settings) {
    obj.settings.modeDashboard = {
      title: tr.modeDashboardTitle,
      description: tr.modeDashboardDesc,
      mode2Label: tr.mode2Label,
      mode2Description: tr.mode2Desc,
      mode3Label: tr.mode3Label,
      mode3Description: tr.mode3Desc,
      openMode2: tr.openMode2,
      openMode3: tr.openMode3,
    };
  }

  return obj;
}

// Actual locale files on disk (33 total)
const files = [
  "ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fi", "fil", "fr",
  "he", "hr", "hu", "is", "it", "ja", "lt", "lv", "nb", "ne", "nl", "pl",
  "pt", "ro", "sk", "sl", "sv", "sw", "uk", "vi", "zh-TW",
];

let updated = 0;
let skipped = 0;

for (const locale of files) {
  const filePath = join(localesDir, `${locale}.json`);
  try {
    const raw = readFileSync(filePath, "utf-8");
    const obj = JSON.parse(raw);

    // Skip if keys already exist
    if (obj.navigation?.mode2 && obj.home?.dashboardCta && obj.settings?.modeDashboard) {
      console.log(`⏭  ${locale}.json — already has keys, skipping`);
      skipped++;
      continue;
    }

    const tr = tier1.has(locale) ? translations[locale] : enDefaults;
    addKeys(obj, tr);

    writeFileSync(filePath, JSON.stringify(obj, null, 2) + "\n", "utf-8");
    console.log(`✅ ${locale}.json — updated`);
    updated++;
  } catch (err) {
    console.error(`❌ ${locale}.json — ${err.message}`);
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped, ${files.length} total`);
