/**
 * Adds the `gift.*` keys (private gifting UI — dialog, claim card, rose
 * garden, "my roses" card, EmojiGift intro) to EVERY locale JSON file in
 * apps/web/src/i18n/locales/.
 *
 * Deterministic and idempotent: preserves all existing keys via deep merge
 * and only adds/overwrites the `gift` subtree below.
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
  title: "Send a gift",
  give: "Give a gift",
  close: "Close",
  kindLabel: "Choose a gift",
  kind: { rose: "Rose", cactus: "Cactus" },
  modeLabel: "Who can see the sender",
  mode: {
    public: "Public — everyone sees your name",
    anonExcept: "Only the recipient sees your name",
    anon: "Fully anonymous",
  },
  send: "Send gift",
  approveFirst: "Approve EVOLVE first",
  funding: "Preparing the voucher…",
  sent: "Gift sent!",
  noAddress: "The recipient has no wallet address — choose an anonymous mode instead.",
  walletRequired: "Connect your wallet to continue",
  error: "Something went wrong. Please try again.",
  chatMessage: "You received a gift!",
  claimTitle: "A gift is waiting for you",
  claimHint: "Claiming moves the gifted EVOLVE to you and registers the gift in your name.",
  claim: "Claim",
  claiming: "Claiming…",
  claimed: "Gifts claimed",
  garden: "Gift garden",
  anonymous: "Anonymous",
  from: "from {{sender}}",
  myRoses: "My roses",
  giftsOwned: "Gifts owned on-chain",
  marketShare: "Revenue share",
  noRoses: "No gifts yet",
  explainerIntro:
    "Gifts are private by default: your name can be public, visible only to the recipient, or fully anonymous — your choice.",
};

// ─── Natural translations (Tier 1 + zh-TW) ───
const natural = {
  uk: {
    title: "Зробити подарунок",
    give: "Подарувати",
    close: "Закрити",
    kindLabel: "Оберіть подарунок",
    kind: { rose: "Троянда", cactus: "Кактус" },
    modeLabel: "Хто бачить відправника",
    mode: {
      public: "Публічно — усі бачать ваше ім'я",
      anonExcept: "Лише отримувач бачить ваше ім'я",
      anon: "Повністю анонімно",
    },
    send: "Подарувати",
    approveFirst: "Спочатку дозвольте EVOLVE",
    funding: "Підготовка ваучера…",
    sent: "Подарунок надіслано!",
    noAddress: "У отримувача немає адреси гаманця — оберіть анонімний режим.",
    walletRequired: "Підключіть гаманець, щоб продовжити",
    error: "Щось пішло не так. Спробуйте ще раз.",
    chatMessage: "Ви отримали подарунок!",
    claimTitle: "Вас чекає подарунок",
    claimHint: "Отримання переводить подаровані EVOLVE вам і реєструє подарунок на ваше ім'я.",
    claim: "Отримати",
    claiming: "Отримання…",
    claimed: "Подарунків отримано",
    garden: "Сад подарунків",
    anonymous: "Анонім",
    from: "від {{sender}}",
    myRoses: "Мої троянди",
    giftsOwned: "Подарунків у блокчейні",
    marketShare: "Частка доходу",
    noRoses: "Подарунків ще немає",
    explainerIntro:
      "Подарунки приватні за замовчуванням: ваше ім'я може бути публічним, видимим лише отримувачу або повністю анонімним — на ваш вибір.",
  },
  ru: {
    title: "Сделать подарок",
    give: "Подарить",
    close: "Закрыть",
    kindLabel: "Выберите подарок",
    kind: { rose: "Роза", cactus: "Кактус" },
    modeLabel: "Кто видит отправителя",
    mode: {
      public: "Публично — все видят ваше имя",
      anonExcept: "Только получатель видит ваше имя",
      anon: "Полностью анонимно",
    },
    send: "Подарить",
    approveFirst: "Сначала разрешите EVOLVE",
    funding: "Подготовка ваучера…",
    sent: "Подарок отправлен!",
    noAddress: "У получателя нет адреса кошелька — выберите анонимный режим.",
    walletRequired: "Подключите кошелёк, чтобы продолжить",
    error: "Что-то пошло не так. Попробуйте ещё раз.",
    chatMessage: "Вы получили подарок!",
    claimTitle: "Вас ждёт подарок",
    claimHint: "Получение переводит подаренные EVOLVE вам и регистрирует подарок на ваше имя.",
    claim: "Получить",
    claiming: "Получение…",
    claimed: "Подарков получено",
    garden: "Сад подарков",
    anonymous: "Аноним",
    from: "от {{sender}}",
    myRoses: "Мои розы",
    giftsOwned: "Подарков в блокчейне",
    marketShare: "Доля дохода",
    noRoses: "Подарков пока нет",
    explainerIntro:
      "Подарки приватны по умолчанию: ваше имя может быть публичным, видимым только получателю или полностью анонимным — на ваш выбор.",
  },
  de: {
    title: "Ein Geschenk senden",
    give: "Schenken",
    close: "Schließen",
    kindLabel: "Geschenk auswählen",
    kind: { rose: "Rose", cactus: "Kaktus" },
    modeLabel: "Wer sieht den Absender",
    mode: {
      public: "Öffentlich — alle sehen deinen Namen",
      anonExcept: "Nur der Empfänger sieht deinen Namen",
      anon: "Vollständig anonym",
    },
    send: "Geschenk senden",
    approveFirst: "Zuerst EVOLVE freigeben",
    funding: "Gutschein wird vorbereitet…",
    sent: "Geschenk gesendet!",
    noAddress: "Der Empfänger hat keine Wallet-Adresse — wähle einen anonymen Modus.",
    walletRequired: "Verbinde deine Wallet, um fortzufahren",
    error: "Etwas ist schiefgelaufen. Bitte erneut versuchen.",
    chatMessage: "Du hast ein Geschenk erhalten!",
    claimTitle: "Ein Geschenk wartet auf dich",
    claimHint:
      "Beim Einlösen werden die geschenkten EVOLVE zu dir verschoben und das Geschenk auf deinen Namen registriert.",
    claim: "Einlösen",
    claiming: "Einlösen…",
    claimed: "Eingelöste Geschenke",
    garden: "Geschenkergarten",
    anonymous: "Anonym",
    from: "von {{sender}}",
    myRoses: "Meine Rosen",
    giftsOwned: "Geschenke on-chain",
    marketShare: "Umsatzbeteiligung",
    noRoses: "Noch keine Geschenke",
    explainerIntro:
      "Geschenke sind standardmäßig privat: Dein Name kann öffentlich, nur für den Empfänger sichtbar oder vollständig anonym sein — du entscheidest.",
  },
  fr: {
    title: "Envoyer un cadeau",
    give: "Offrir",
    close: "Fermer",
    kindLabel: "Choisissez un cadeau",
    kind: { rose: "Rose", cactus: "Cactus" },
    modeLabel: "Qui voit l'expéditeur",
    mode: {
      public: "Public — tout le monde voit votre nom",
      anonExcept: "Seule la personne qui reçoit voit votre nom",
      anon: "Totalement anonyme",
    },
    send: "Envoyer le cadeau",
    approveFirst: "Autorisez d'abord les EVOLVE",
    funding: "Préparation du bon…",
    sent: "Cadeau envoyé !",
    noAddress: "Le destinataire n'a pas d'adresse de portefeuille — choisissez un mode anonyme.",
    walletRequired: "Connectez votre portefeuille pour continuer",
    error: "Une erreur est survenue. Veuillez réessayer.",
    chatMessage: "Vous avez reçu un cadeau !",
    claimTitle: "Un cadeau vous attend",
    claimHint:
      "En le récupérant, les EVOLVE offerts vous sont transférés et le cadeau est enregistré à votre nom.",
    claim: "Récupérer",
    claiming: "Récupération…",
    claimed: "Cadeaux récupérés",
    garden: "Jardin des cadeaux",
    anonymous: "Anonyme",
    from: "de {{sender}}",
    myRoses: "Mes roses",
    giftsOwned: "Cadeaux on-chain",
    marketShare: "Part des revenus",
    noRoses: "Pas encore de cadeaux",
    explainerIntro:
      "Les cadeaux sont privés par défaut : votre nom peut être public, visible uniquement du destinataire ou totalement anonyme — à vous de choisir.",
  },
  es: {
    title: "Enviar un regalo",
    give: "Regalar",
    close: "Cerrar",
    kindLabel: "Elige un regalo",
    kind: { rose: "Rosa", cactus: "Cactus" },
    modeLabel: "Quién ve al remitente",
    mode: {
      public: "Público: todos ven tu nombre",
      anonExcept: "Solo quien recibe ve tu nombre",
      anon: "Totalmente anónimo",
    },
    send: "Enviar regalo",
    approveFirst: "Primero autoriza EVOLVE",
    funding: "Preparando el cupón…",
    sent: "¡Regalo enviado!",
    noAddress: "El destinatario no tiene dirección de cartera: elige un modo anónimo.",
    walletRequired: "Conecta tu cartera para continuar",
    error: "Algo salió mal. Inténtalo de nuevo.",
    chatMessage: "¡Recibiste un regalo!",
    claimTitle: "Un regalo te espera",
    claimHint:
      "Al reclamarlo, los EVOLVE regalados se transfieren a ti y el regalo se registra a tu nombre.",
    claim: "Reclamar",
    claiming: "Reclamando…",
    claimed: "Regalos reclamados",
    garden: "Jardín de regalos",
    anonymous: "Anónimo",
    from: "de {{sender}}",
    myRoses: "Mis rosas",
    giftsOwned: "Regalos on-chain",
    marketShare: "Parte de ingresos",
    noRoses: "Aún no hay regalos",
    explainerIntro:
      "Los regalos son privados por defecto: tu nombre puede ser público, visible solo para quien lo recibe o totalmente anónimo: tú eliges.",
  },
  pt: {
    title: "Enviar um presente",
    give: "Presentear",
    close: "Fechar",
    kindLabel: "Escolha um presente",
    kind: { rose: "Rosa", cactus: "Cacto" },
    modeLabel: "Quem vê o remetente",
    mode: {
      public: "Público — todos veem seu nome",
      anonExcept: "Apenas quem recebe vê seu nome",
      anon: "Totalmente anônimo",
    },
    send: "Enviar presente",
    approveFirst: "Primeiro autorize EVOLVE",
    funding: "Preparando o voucher…",
    sent: "Presente enviado!",
    noAddress: "O destinatário não tem endereço de carteira — escolha um modo anônimo.",
    walletRequired: "Conecte sua carteira para continuar",
    error: "Algo deu errado. Tente novamente.",
    chatMessage: "Você recebeu um presente!",
    claimTitle: "Um presente espera por você",
    claimHint:
      "Ao resgatar, os EVOLVE presenteados são transferidos para você e o presente é registrado em seu nome.",
    claim: "Resgatar",
    claiming: "Resgatando…",
    claimed: "Presentes resgatados",
    garden: "Jardim de presentes",
    anonymous: "Anônimo",
    from: "de {{sender}}",
    myRoses: "Minhas rosas",
    giftsOwned: "Presentes on-chain",
    marketShare: "Parte da receita",
    noRoses: "Ainda não há presentes",
    explainerIntro:
      "Presentes são privados por padrão: seu nome pode ser público, visível apenas para quem recebe ou totalmente anônimo — você escolhe.",
  },
  ja: {
    title: "ギフトを送る",
    give: "ギフトを贈る",
    close: "閉じる",
    kindLabel: "ギフトを選ぶ",
    kind: { rose: "バラ", cactus: "サボテン" },
    modeLabel: "送り主を見られる人",
    mode: {
      public: "公開 — 全員に名前が見えます",
      anonExcept: "受取人だけが名前を見られます",
      anon: "完全に匿名",
    },
    send: "ギフトを送る",
    approveFirst: "まずEVOLVEを承認してください",
    funding: "バウチャーを準備中…",
    sent: "ギフトを送りました！",
    noAddress: "受取人にウォレットアドレスがありません — 匿名モードを選んでください。",
    walletRequired: "続けるにはウォレットを接続してください",
    error: "問題が発生しました。もう一度お試しください。",
    chatMessage: "ギフトが届きました！",
    claimTitle: "ギフトが待っています",
    claimHint: "受け取ると、贈られたEVOLVEがあなたに移され、ギフトがあなたの名義で登録されます。",
    claim: "受け取る",
    claiming: "受け取り中…",
    claimed: "受け取ったギフト",
    garden: "ギフトガーデン",
    anonymous: "匿名",
    from: "{{sender}} から",
    myRoses: "私のバラ",
    giftsOwned: "オンチェーンのギフト数",
    marketShare: "収益シェア",
    noRoses: "まだギフトがありません",
    explainerIntro:
      "ギフトは既定でプライベートです。名前を公開する、受取人だけに見せる、完全に匿名にする — 自由に選べます。",
  },
  ko: {
    title: "선물 보내기",
    give: "선물하기",
    close: "닫기",
    kindLabel: "선물을 선택하세요",
    kind: { rose: "장미", cactus: "선인장" },
    modeLabel: "보낸 사람을 볼 수 있는 사람",
    mode: {
      public: "공개 — 모두가 이름을 볼 수 있습니다",
      anonExcept: "받는 사람만 이름을 볼 수 있습니다",
      anon: "완전 익명",
    },
    send: "선물 보내기",
    approveFirst: "먼저 EVOLVE 사용을 승인하세요",
    funding: "바우처 준비 중…",
    sent: "선물을 보냈습니다!",
    noAddress: "받는 사람에게 지갑 주소가 없습니다 — 익명 모드를 선택하세요.",
    walletRequired: "계속하려면 지갑을 연결하세요",
    error: "문제가 발생했습니다. 다시 시도해 주세요.",
    chatMessage: "선물이 도착했습니다!",
    claimTitle: "선물이 기다리고 있어요",
    claimHint: "받으면 선물된 EVOLVE가 내게 이전되고 선물이 내 이름으로 등록됩니다.",
    claim: "받기",
    claiming: "받는 중…",
    claimed: "받은 선물",
    garden: "선물 정원",
    anonymous: "익명",
    from: "{{sender}}님부터",
    myRoses: "나의 장미",
    giftsOwned: "온체인 선물 수",
    marketShare: "수익 배분",
    noRoses: "아직 선물이 없습니다",
    explainerIntro:
      "선물은 기본적으로 비공개입니다. 이름을 공개하거나, 받는 사람에게만 보이거나, 완전히 익명으로 할 수 있습니다.",
  },
  zh: {
    title: "发送礼物",
    give: "送礼物",
    close: "关闭",
    kindLabel: "选择礼物",
    kind: { rose: "玫瑰", cactus: "仙人掌" },
    modeLabel: "谁能看到发送者",
    mode: {
      public: "公开 — 所有人都能看到你的名字",
      anonExcept: "仅收礼人能看到你的名字",
      anon: "完全匿名",
    },
    send: "发送礼物",
    approveFirst: "请先授权 EVOLVE",
    funding: "正在准备凭证…",
    sent: "礼物已送出！",
    noAddress: "收礼人没有钱包地址 — 请选择匿名模式。",
    walletRequired: "请连接钱包以继续",
    error: "出了点问题，请重试。",
    chatMessage: "你收到一份礼物！",
    claimTitle: "有一份礼物在等你",
    claimHint: "领取后，获赠的 EVOLVE 将转到你的名下并以你的名义登记礼物。",
    claim: "领取",
    claiming: "领取中…",
    claimed: "已领取礼物",
    garden: "礼物花园",
    anonymous: "匿名",
    from: "来自 {{sender}}",
    myRoses: "我的玫瑰",
    giftsOwned: "链上礼物数",
    marketShare: "收益份额",
    noRoses: "还没有礼物",
    explainerIntro: "礼物默认私密：你的名字可以公开、仅收礼人可见，或完全匿名 — 由你选择。",
  },
  "zh-TW": {
    title: "發送禮物",
    give: "送禮物",
    close: "關閉",
    kindLabel: "選擇禮物",
    kind: { rose: "玫瑰", cactus: "仙人掌" },
    modeLabel: "誰能看到寄件人",
    mode: {
      public: "公開 — 所有人都能看到你的名字",
      anonExcept: "僅收禮人能看到你的名字",
      anon: "完全匿名",
    },
    send: "發送禮物",
    approveFirst: "請先授權 EVOLVE",
    funding: "正在準備憑證…",
    sent: "禮物已送出！",
    noAddress: "收禮人沒有錢包地址 — 請選擇匿名模式。",
    walletRequired: "請連接錢包以繼續",
    error: "出了點問題，請重試。",
    chatMessage: "你收到一份禮物！",
    claimTitle: "有一份禮物在等你",
    claimHint: "領取後，獲贈的 EVOLVE 將轉到你的名下並以你的名義登記禮物。",
    claim: "領取",
    claiming: "領取中…",
    claimed: "已領取禮物",
    garden: "禮物花園",
    anonymous: "匿名",
    from: "來自 {{sender}}",
    myRoses: "我的玫瑰",
    giftsOwned: "鏈上禮物數",
    marketShare: "收益份額",
    noRoses: "還沒有禮物",
    explainerIntro: "禮物預設私密：你的名字可以公開、僅收禮人可見，或完全匿名 — 由你選擇。",
  },
  ar: {
    title: "إرسال هدية",
    give: "إهداء",
    close: "إغلاق",
    kindLabel: "اختر هديتك",
    kind: { rose: "وردة", cactus: "صبار" },
    modeLabel: "من يمكنه رؤية المُرسِل",
    mode: {
      public: "علني — الجميع يرى اسمك",
      anonExcept: "المستلم وحده يرى اسمك",
      anon: "مجهول تمامًا",
    },
    send: "إرسال الهدية",
    approveFirst: "قم بتفويض EVOLVE أولًا",
    funding: "جارٍ تحضير القسيمة…",
    sent: "تم إرسال الهدية!",
    noAddress: "لا يوجد عنوان محفظة للمستلم — اختر وضعًا مجهولًا.",
    walletRequired: "اتصل بمحفظتك للمتابعة",
    error: "حدث خطأ ما. حاول مرة أخرى.",
    chatMessage: "لقد وصلتك هدية!",
    claimTitle: "هدية تنتظرك",
    claimHint: "عند الاستلام، تُحوَّل عملات EVOLVE المُهداة إليك وتُسجَّل الهدية باسمك.",
    claim: "استلام",
    claiming: "جارٍ الاستلام…",
    claimed: "الهدايا المستلمة",
    garden: "حديقة الهدايا",
    anonymous: "مجهول",
    from: "من {{sender}}",
    myRoses: "ورودي",
    giftsOwned: "الهدايا على السلسلة",
    marketShare: "حصة الإيرادات",
    noRoses: "لا هدايا بعد",
    explainerIntro:
      "الهدايا خاصة افتراضيًا: يمكن أن يكون اسمك علنيًا، أو مرئيًا للمستلم فقط، أو مجهولً تمامًا — الخيار لك.",
  },
  vi: {
    title: "Gửi quà",
    give: "Tặng quà",
    close: "Đóng",
    kindLabel: "Chọn một món quà",
    kind: { rose: "Hoa hồng", cactus: "Xương rồng" },
    modeLabel: "Ai nhìn thấy người gửi",
    mode: {
      public: "Công khai — ai cũng thấy tên bạn",
      anonExcept: "Chỉ người nhận thấy tên bạn",
      anon: "Hoàn toàn ẩn danh",
    },
    send: "Gửi quà",
    approveFirst: "Hãy phê duyệt EVOLVE trước",
    funding: "Đang chuẩn bị phiếu quà…",
    sent: "Đã gửi quà!",
    noAddress: "Người nhận không có địa chỉ ví — hãy chọn chế độ ẩn danh.",
    walletRequired: "Kết nối ví để tiếp tục",
    error: "Đã xảy ra lỗi. Vui lòng thử lại.",
    chatMessage: "Bạn đã nhận được một món quà!",
    claimTitle: "Một món quà đang chờ bạn",
    claimHint: "Khi nhận, số EVOLVE được tặng sẽ chuyển đến bạn và món quà được đăng ký tên bạn.",
    claim: "Nhận",
    claiming: "Đang nhận…",
    claimed: "Quà đã nhận",
    garden: "Vườn quà",
    anonymous: "Ẩn danh",
    from: "từ {{sender}}",
    myRoses: "Hoa hồng của tôi",
    giftsOwned: "Số quà on-chain",
    marketShare: "Phần doanh thu",
    noRoses: "Chưa có quà",
    explainerIntro:
      "Quà tặng mặc định là riêng tư: tên bạn có thể công khai, chỉ người nhận thấy, hoặc hoàn toàn ẩn danh — bạn chọn.",
  },
  hi: {
    title: "उपहार भेजें",
    give: "उपहार दें",
    close: "बंद करें",
    kindLabel: "एक उपहार चुनें",
    kind: { rose: "गुलाब", cactus: "कैक्टस" },
    modeLabel: "भेजने वाले को कौन देख सकता है",
    mode: {
      public: "सार्वजनिक — सभी आपका नाम देखते हैं",
      anonExcept: "केवल प्राप्तकर्ता आपका नाम देखता है",
      anon: "पूरी तरह गुमनाम",
    },
    send: "उपहार भेजें",
    approveFirst: "पहले EVOLVE को अनुमति दें",
    funding: "वाउचर तैयार हो रहा है…",
    sent: "उपहार भेज दिया गया!",
    noAddress: "प्राप्तकर्ता के पास वॉलेट पता नहीं है — गुमनाम मोड चुनें।",
    walletRequired: "जारी रखने के लिए अपना वॉलेट जोड़ें",
    error: "कुछ गलत हो गया। कृपया फिर प्रयास करें।",
    chatMessage: "आपको एक उपहार मिला है!",
    claimTitle: "एक उपहार आपका इंतज़ार कर रहा है",
    claimHint:
      "प्राप्त करने पर उपहार में मिले EVOLVE आपको चले जाते हैं और उपहार आपके नाम पर दर्ज होता है।",
    claim: "प्राप्त करें",
    claiming: "प्राप्त किया जा रहा है…",
    claimed: "प्राप्त उपहार",
    garden: "उपहार बगीचा",
    anonymous: "गुमनाम",
    from: "{{sender}} की ओर से",
    myRoses: "मेरे गुलाब",
    giftsOwned: "ऑन-चेन उपहार",
    marketShare: "राजस्व हिस्सा",
    noRoses: "अभी कोई उपहार नहीं",
    explainerIntro:
      "उपहार डिफ़ॉल्ट रूप से निजी हैं: आपका नाम सार्वजनिक हो सकता है, केवल प्राप्तकर्ता को दिखे, या पूरी तरह गुमनाम रहे — आपका चुनाव।",
  },
  tr: {
    title: "Hediye gönder",
    give: "Hediye et",
    close: "Kapat",
    kindLabel: "Bir hediye seç",
    kind: { rose: "Gül", cactus: "Kaktüs" },
    modeLabel: "Göndereni kim görebilir",
    mode: {
      public: "Herkese açık — herkes adını görür",
      anonExcept: "Sadece alan kişi adını görür",
      anon: "Tamamen anonim",
    },
    send: "Hediye gönder",
    approveFirst: "Önce EVOLVE'e izin ver",
    funding: "Kupon hazırlanıyor…",
    sent: "Hediye gönderildi!",
    noAddress: "Alıcının cüzdan adresi yok — anonim bir mod seçin.",
    walletRequired: "Devam etmek için cüzdanınızı bağlayın",
    error: "Bir şeyler ters gitti. Lütfen tekrar deneyin.",
    chatMessage: "Bir hediye aldınız!",
    claimTitle: "Bir hediye sizi bekliyor",
    claimHint:
      "Teslim alındığında, hediye edilen EVOLVE size aktarılır ve hediye adınıza kaydedilir.",
    claim: "Teslim al",
    claiming: "Teslim alınıyor…",
    claimed: "Teslim alınan hediyeler",
    garden: "Hediye bahçesi",
    anonymous: "Anonim",
    from: "{{sender}} tarafından",
    myRoses: "Güllerim",
    giftsOwned: "Zincirdeki hediyeler",
    marketShare: "Gelir payı",
    noRoses: "Henüz hediye yok",
    explainerIntro:
      "Hediyeler varsayılan olarak özeldir: adınız herkese açık, yalnızca alan kişiye görünür veya tamamen anonim olabilir — siz seçersiniz.",
  },
  th: {
    title: "ส่งของขวัญ",
    give: "มอบของขวัญ",
    close: "ปิด",
    kindLabel: "เลือกของขวัญ",
    kind: { rose: "กุหลาบ", cactus: "กระบองเพชร" },
    modeLabel: "ใครเห็นผู้ส่งได้บ้าง",
    mode: {
      public: "สาธารณะ — ทุกคนเห็นชื่อของคุณ",
      anonExcept: "มีแต่ผู้รับเท่านั้นที่เห็นชื่อของคุณ",
      anon: "ไม่ระบุตัวตนโดยสมบูรณ์",
    },
    send: "ส่งของขวัญ",
    approveFirst: "อนุมัติ EVOLVE ก่อน",
    funding: "กำลังเตรียมบัตรกำนัล…",
    sent: "ส่งของขวัญแล้ว!",
    noAddress: "ผู้รับไม่มีที่อยู่กระเป๋าเงิน — เลือกโหมดไม่ระบุตัวตน",
    walletRequired: "เชื่อมต่อกระเป๋าเงินเพื่อดำเนินการต่อ",
    error: "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง",
    chatMessage: "คุณได้รับของขวัญ!",
    claimTitle: "มีของขวัญรอคุณอยู่",
    claimHint: "เมื่อรับแล้ว EVOLVE ที่ได้รับจะถูกโอนให้คุณและลงทะเบียนของขวัญในชื่อของคุณ",
    claim: "รับ",
    claiming: "กำลังรับ…",
    claimed: "ของขวัญที่รับแล้ว",
    garden: "สวนของขวัญ",
    anonymous: "ไม่ระบุชื่อ",
    from: "จาก {{sender}}",
    myRoses: "กุหลาบของฉัน",
    giftsOwned: "ของขวัญบนเชน",
    marketShare: "ส่วนแบ่งรายได้",
    noRoses: "ยังไม่มีของขวัญ",
    explainerIntro:
      "ของขวัญเป็นส่วนตัวโดยค่าเริ่มต้น: ชื่อของคุณอาจเปิดเผยต่อสาธารณะ ให้เฉพาะผู้รับเห็น หรือไม่ระบุตัวตนโดยสมบูรณ์ — คุณเลือกได้",
  },
  id: {
    title: "Kirim hadiah",
    give: "Beri hadiah",
    close: "Tutup",
    kindLabel: "Pilih hadiah",
    kind: { rose: "Mawar", cactus: "Kaktus" },
    modeLabel: "Siapa yang bisa melihat pengirim",
    mode: {
      public: "Publik — semua orang melihat namamu",
      anonExcept: "Hanya penerima yang melihat namamu",
      anon: "Sepenuhnya anonim",
    },
    send: "Kirim hadiah",
    approveFirst: "Setujui EVOLVE terlebih dahulu",
    funding: "Menyiapkan voucher…",
    sent: "Hadiah terkirim!",
    noAddress: "Penerima tidak memiliki alamat dompet — pilih mode anonim.",
    walletRequired: "Hubungkan dompetmu untuk melanjutkan",
    error: "Terjadi kesalahan. Silakan coba lagi.",
    chatMessage: "Kamu menerima hadiah!",
    claimTitle: "Ada hadiah menantimu",
    claimHint:
      "Saat diklaim, EVOLVE yang dihadiahkan dipindahkan kepadamu dan hadiah terdaftar atas namamu.",
    claim: "Klaim",
    claiming: "Mengklaim…",
    claimed: "Hadiah diklaim",
    garden: "Taman hadiah",
    anonymous: "Anonim",
    from: "dari {{sender}}",
    myRoses: "Mawarku",
    giftsOwned: "Hadiah on-chain",
    marketShare: "Bagian pendapatan",
    noRoses: "Belum ada hadiah",
    explainerIntro:
      "Hadiah bersifat pribadi secara bawaan: namamu bisa publik, hanya terlihat oleh penerima, atau sepenuhnya anonim — pilihanmu.",
  },
  ms: {
    title: "Hantar hadiah",
    give: "Beri hadiah",
    close: "Tutup",
    kindLabel: "Pilih hadiah",
    kind: { rose: "Mawar", cactus: "Kaktus" },
    modeLabel: "Siapa boleh lihat penghantar",
    mode: {
      public: "Awam — semua orang nampak nama anda",
      anonExcept: "Hanya penerima nampak nama anda",
      anon: "Sepenuhnya tanpa nama",
    },
    send: "Hantar hadiah",
    approveFirst: "Luluskan EVOLVE dahulu",
    funding: "Menyediakan baucar…",
    sent: "Hadiah dihantar!",
    noAddress: "Penerima tiada alamat dompet — pilih mod tanpa nama.",
    walletRequired: "Sambungkan dompet anda untuk teruskan",
    error: "Sesuatu tidak kena. Sila cuba lagi.",
    chatMessage: "Anda menerima hadiah!",
    claimTitle: "Hadiah menanti anda",
    claimHint:
      "Apabila dituntut, EVOLVE yang dihadiahkan dipindahkan kepada anda dan hadiah didaftarkan atas nama anda.",
    claim: "Tuntut",
    claiming: "Menuntut…",
    claimed: "Hadiah dituntut",
    garden: "Taman hadiah",
    anonymous: "Tanpa nama",
    from: "daripada {{sender}}",
    myRoses: "Mawar saya",
    giftsOwned: "Hadiah on-chain",
    marketShare: "Bahagian hasil",
    noRoses: "Belum ada hadiah",
    explainerIntro:
      "Hadiah bersifat peribadi secara lalai: nama anda boleh awam, hanya dilihat penerima, atau sepenuhnya tanpa nama — pilihan anda.",
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

function buildGift(locale) {
  const n = natural[locale];
  if (!n) return deepClone(en);
  return deepMerge(deepClone(en), n);
}

// Every leaf key the components consume — validation walks this shape.
const REQUIRED = [
  "title",
  "give",
  "close",
  "kindLabel",
  "kind.rose",
  "kind.cactus",
  "modeLabel",
  "mode.public",
  "mode.anonExcept",
  "mode.anon",
  "send",
  "approveFirst",
  "funding",
  "sent",
  "noAddress",
  "walletRequired",
  "error",
  "chatMessage",
  "claimTitle",
  "claimHint",
  "claim",
  "claiming",
  "claimed",
  "garden",
  "anonymous",
  "from",
  "myRoses",
  "giftsOwned",
  "marketShare",
  "noRoses",
  "explainerIntro",
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
  const locale = f.replace(/\.json$/, ""); // e.g. "uk", "zh-TW", "fil"
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));
  // Add/refresh ONLY the gift subtree (preserve everything else).
  existing.gift = deepMerge(existing.gift || {}, buildGift(locale));
  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

// Validate every file parses and carries every required gift key.
const bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const missing = REQUIRED.filter((k) => !hasKey(j.gift, k));
    if (missing.length > 0) bad.push(`${f}: missing ${missing.join(", ")}`);
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}

console.log(
  bad.length ? `VALIDATION FAILED: ${bad.join(" | ")}` : `ALL ${files.length} LOCALES VALID`,
);
