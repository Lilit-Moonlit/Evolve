// Deterministic i18n locale adder for the Mode2/ Mode3 dashboards.
//
// INCREMENTAL RUN: this file now contains ONLY the NEW Mode2 dashboard keys
// (step0 deposit block, createBond, step1 partner labels, step3 pregnancy
// strings, error banner). The base dashboard.mode2/mode3.* + common.loading
// keys were already deployed to all 33 locales by the original run and must
// NOT be redefined here — deepMerge would overwrite the natural translations
// with the English source.
//
// Natural translations are provided for Tier 1 languages
// (uk de fr es pt ja ko zh ar vi hi tr th id ms ru); all other
// locales fall back to English (repo Tier 2 convention).
//
// Run: node apps/web/scripts/add-dashboard-locales.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, "..", "src", "i18n", "locales");

// English source (nested, mirrors the i18n key paths used by t()).
const EN = {
  dashboard: {
    mode2: {
      step0: {
        walletBalance: "EVOLVE Wallet Balance",
        fundTitle: "EvolveFund Deposit",
        locked: "Locked by Bond",
        unlocked: "Unlocked",
        daysRemaining: "{{days}}d remaining",
        noDeposit: "No deposit",
        depositPrompt: "Deposit EVOLVE to Fund (min 15)",
        amountPlaceholder: "Amount (e.g. 20)",
        minDeposit: "Minimum deposit is 15 EVOLVE",
        approving: "Approving...",
        depositing: "Depositing...",
        approveAction: "Approve EVOLVE",
        depositAction: "Deposit to Fund",
        lockHint: "30-day minimum lock. Required to create bonds.",
      },
      createBond: {
        partnerPlaceholder: "Partner address (0x...)",
        fundedRequired: "Deposit at least 15 EVOLVE first",
        partnerRequired: "Enter a partner address",
      },
      step1: {
        womanPartner: "Woman partner",
        manPartner: "Man partner",
        alreadyConfirmedTitle: "Already confirmed",
      },
      step3: {
        canReport: "You can now report pregnancy",
        notYet: "Pregnancy report available after 14 days from confirmation",
        reportToVerify: "Report pregnancy to initiate paternity verification.",
        waitingWindow: "Waiting for pregnancy report window to open...",
        waitingWoman: "Waiting for the woman to report pregnancy...",
        paternityInProgress: "Paternity verification in progress. Admin will submit result.",
        awaitingResult: "Awaiting paternity test result from administrator...",
      },
      error: {
        rejected: "Transaction rejected by user.",
        failed: "Transaction error: {{message}}",
      },
    },
  },
};

// Natural translations for Tier 1 languages.
const NATURAL = {
  uk: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "Баланс гаманця EVOLVE",
          fundTitle: "Депозит EvolveFund",
          locked: "Заблоковано зв'язком",
          unlocked: "Розблоковано",
          daysRemaining: "{{days}} дн. залишилось",
          noDeposit: "Немає депозиту",
          depositPrompt: "Внести EVOLVE у Фонд (мін 15)",
          amountPlaceholder: "Сума (напр. 20)",
          minDeposit: "Мінімальний депозит — 15 EVOLVE",
          approving: "Підтвердження...",
          depositing: "Внесення...",
          approveAction: "Схвалити EVOLVE",
          depositAction: "Внести у Фонд",
          lockHint: "Мінімальне блокування 30 днів. Потрібно для створення зв'язків.",
        },
        createBond: {
          partnerPlaceholder: "Адреса партнера (0x...)",
          fundedRequired: "Спершу внесіть щонайменше 15 EVOLVE",
          partnerRequired: "Введіть адресу партнера",
        },
        step1: {
          womanPartner: "Партнерка (жінка)",
          manPartner: "Партнер (чоловік)",
          alreadyConfirmedTitle: "Вже підтверджено",
        },
        step3: {
          canReport: "Тепер ви можете повідомити про вагітність",
          notYet: "Повідомлення про вагітність доступне через 14 днів після підтвердження",
          reportToVerify: "Повідомте про вагітність, щоб розпочати перевірку батьківства.",
          waitingWindow: "Очікування відкриття вікна повідомлення про вагітність...",
          waitingWoman: "Очікування, коли жінка повідомить про вагітність...",
          paternityInProgress: "Перевірка батьківства триває. Адміністратор надішле результат.",
          awaitingResult: "Очікування результату тесту на батьківство від адміністратора...",
        },
        error: {
          rejected: "Транзакцію відхилено користувачем.",
          failed: "Помилка транзакції: {{message}}",
        },
      },
    },
  },
  ru: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "Баланс кошелька EVOLVE",
          fundTitle: "Депозит EvolveFund",
          locked: "Заблокировано связью",
          unlocked: "Разблокировано",
          daysRemaining: "{{days}} дн. осталось",
          noDeposit: "Нет депозита",
          depositPrompt: "Внести EVOLVE в Фонд (мин 15)",
          amountPlaceholder: "Сумма (напр. 20)",
          minDeposit: "Минимальный депозит — 15 EVOLVE",
          approving: "Подтверждение...",
          depositing: "Внесение...",
          approveAction: "Одобрить EVOLVE",
          depositAction: "Внести в Фонд",
          lockHint: "Минимальная блокировка 30 дней. Требуется для создания связей.",
        },
        createBond: {
          partnerPlaceholder: "Адрес партнёра (0x...)",
          fundedRequired: "Сначала внесите минимум 15 EVOLVE",
          partnerRequired: "Введите адрес партнёра",
        },
        step1: {
          womanPartner: "Партнёрша (женщина)",
          manPartner: "Партнёр (мужчина)",
          alreadyConfirmedTitle: "Уже подтверждено",
        },
        step3: {
          canReport: "Теперь вы можете сообщить о беременности",
          notYet: "Сообщение о беременности доступно через 14 дней после подтверждения",
          reportToVerify: "Сообщите о беременности, чтобы начать проверку отцовства.",
          waitingWindow: "Ожидание открытия окна сообщения о беременности...",
          waitingWoman: "Ожидание, когда женщина сообщит о беременности...",
          paternityInProgress: "Проверка отцовства в процессе. Администратор отправит результат.",
          awaitingResult: "Ожидание результата теста на отцовство от администратора...",
        },
        error: {
          rejected: "Транзакция отклонена пользователем.",
          failed: "Ошибка транзакции: {{message}}",
        },
      },
    },
  },
  de: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "EVOLVE-Wallet-Guthaben",
          fundTitle: "EvolveFund-Einzahlung",
          locked: "Durch Bindung gesperrt",
          unlocked: "Entsperrt",
          daysRemaining: "{{days}} T. verbleibend",
          noDeposit: "Keine Einzahlung",
          depositPrompt: "EVOLVE in den Fonds einzahlen (min. 15)",
          amountPlaceholder: "Betrag (z. B. 20)",
          minDeposit: "Mindesteinzahlung ist 15 EVOLVE",
          approving: "Wird genehmigt...",
          depositing: "Wird eingezahlt...",
          approveAction: "EVOLVE genehmigen",
          depositAction: "In den Fonds einzahlen",
          lockHint: "Mindestsperre 30 Tage. Zum Erstellen von Bindungen erforderlich.",
        },
        createBond: {
          partnerPlaceholder: "Partneradresse (0x...)",
          fundedRequired: "Zuerst mindestens 15 EVOLVE einzahlen",
          partnerRequired: "Partneradresse eingeben",
        },
        step1: {
          womanPartner: "Partnerin (Frau)",
          manPartner: "Partner (Mann)",
          alreadyConfirmedTitle: "Bereits bestätigt",
        },
        step3: {
          canReport: "Sie können jetzt eine Schwangerschaft melden",
          notYet: "Schwangerschaftsmeldung verfügbar ab 14 Tagen nach Bestätigung",
          reportToVerify: "Melden Sie die Schwangerschaft, um die Vaterschaftsprüfung zu starten.",
          waitingWindow: "Warten auf das Fenster für die Schwangerschaftsmeldung...",
          waitingWoman: "Warten darauf, dass die Frau eine Schwangerschaft meldet...",
          paternityInProgress:
            "Vaterschaftsprüfung läuft. Der Administrator übermittelt das Ergebnis.",
          awaitingResult: "Warten auf das Vaterschaftstestergebnis des Administrators...",
        },
        error: {
          rejected: "Transaktion vom Benutzer abgelehnt.",
          failed: "Transaktionsfehler: {{message}}",
        },
      },
    },
  },
  fr: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "Solde du portefeuille EVOLVE",
          fundTitle: "Dépôt EvolveFund",
          locked: "Verrouillé par le lien",
          unlocked: "Déverrouillé",
          daysRemaining: "{{days}} j restants",
          noDeposit: "Aucun dépôt",
          depositPrompt: "Déposer des EVOLVE dans le Fonds (min 15)",
          amountPlaceholder: "Montant (p. ex. 20)",
          minDeposit: "Le dépôt minimum est de 15 EVOLVE",
          approving: "Approbation...",
          depositing: "Dépôt en cours...",
          approveAction: "Approuver EVOLVE",
          depositAction: "Déposer dans le Fonds",
          lockHint: "Blocage minimum de 30 jours. Requis pour créer des liens.",
        },
        createBond: {
          partnerPlaceholder: "Adresse du partenaire (0x...)",
          fundedRequired: "Déposez d'abord au moins 15 EVOLVE",
          partnerRequired: "Saisissez une adresse de partenaire",
        },
        step1: {
          womanPartner: "Partenaire (femme)",
          manPartner: "Partenaire (homme)",
          alreadyConfirmedTitle: "Déjà confirmé",
        },
        step3: {
          canReport: "Vous pouvez maintenant signaler une grossesse",
          notYet:
            "Le signalement de grossesse est disponible après 14 jours à compter de la confirmation",
          reportToVerify: "Signalez la grossesse pour lancer la vérification de paternité.",
          waitingWindow: "En attente de l'ouverture de la fenêtre de signalement...",
          waitingWoman: "En attente que la femme signale une grossesse...",
          paternityInProgress:
            "Vérification de paternité en cours. L'administrateur soumettra le résultat.",
          awaitingResult: "En attente du résultat du test de paternité de l'administrateur...",
        },
        error: {
          rejected: "Transaction rejetée par l'utilisateur.",
          failed: "Erreur de transaction : {{message}}",
        },
      },
    },
  },
  es: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "Saldo de cartera EVOLVE",
          fundTitle: "Depósito en EvolveFund",
          locked: "Bloqueado por vínculo",
          unlocked: "Desbloqueado",
          daysRemaining: "{{days}} d restantes",
          noDeposit: "Sin depósito",
          depositPrompt: "Depositar EVOLVE en el Fondo (mín 15)",
          amountPlaceholder: "Cantidad (p. ej. 20)",
          minDeposit: "El depósito mínimo es de 15 EVOLVE",
          approving: "Aprobando...",
          depositing: "Depositando...",
          approveAction: "Aprobar EVOLVE",
          depositAction: "Depositar en el Fondo",
          lockHint: "Bloqueo mínimo de 30 días. Requerido para crear vínculos.",
        },
        createBond: {
          partnerPlaceholder: "Dirección del socio (0x...)",
          fundedRequired: "Deposita al menos 15 EVOLVE primero",
          partnerRequired: "Introduce la dirección del socio",
        },
        step1: {
          womanPartner: "Socia (mujer)",
          manPartner: "Socio (hombre)",
          alreadyConfirmedTitle: "Ya confirmado",
        },
        step3: {
          canReport: "Ahora puedes informar del embarazo",
          notYet: "El informe de embarazo está disponible a partir de 14 días de la confirmación",
          reportToVerify: "Informa del embarazo para iniciar la verificación de paternidad.",
          waitingWindow: "Esperando a que se abra la ventana de informe de embarazo...",
          waitingWoman: "Esperando a que la mujer informe del embarazo...",
          paternityInProgress:
            "Verificación de paternidad en curso. El administrador enviará el resultado.",
          awaitingResult: "Esperando el resultado de la prueba de paternidad del administrador...",
        },
        error: {
          rejected: "Transacción rechazada por el usuario.",
          failed: "Error de transacción: {{message}}",
        },
      },
    },
  },
  pt: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "Saldo da carteira EVOLVE",
          fundTitle: "Depósito EvolveFund",
          locked: "Bloqueado pelo vínculo",
          unlocked: "Desbloqueado",
          daysRemaining: "{{days}} d restantes",
          noDeposit: "Sem depósito",
          depositPrompt: "Depositar EVOLVE no Fundo (mín 15)",
          amountPlaceholder: "Valor (ex.: 20)",
          minDeposit: "O depósito mínimo é de 15 EVOLVE",
          approving: "Aprovando...",
          depositing: "Depositando...",
          approveAction: "Aprovar EVOLVE",
          depositAction: "Depositar no Fundo",
          lockHint: "Bloqueio mínimo de 30 dias. Necessário para criar vínculos.",
        },
        createBond: {
          partnerPlaceholder: "Endereço do parceiro (0x...)",
          fundedRequired: "Deposite pelo menos 15 EVOLVE primeiro",
          partnerRequired: "Digite o endereço do parceiro",
        },
        step1: {
          womanPartner: "Parceira (mulher)",
          manPartner: "Parceiro (homem)",
          alreadyConfirmedTitle: "Já confirmado",
        },
        step3: {
          canReport: "Agora você pode informar gravidez",
          notYet: "O informe de gravidez fica disponível após 14 dias da confirmação",
          reportToVerify: "Informe a gravidez para iniciar a verificação de paternidade.",
          waitingWindow: "Aguardando a abertura da janela de informe de gravidez...",
          waitingWoman: "Aguardando a mulher informar gravidez...",
          paternityInProgress:
            "Verificação de paternidade em andamento. O administrador enviará o resultado.",
          awaitingResult: "Aguardando o resultado do teste de paternidade do administrador...",
        },
        error: {
          rejected: "Transação rejeitada pelo usuário.",
          failed: "Erro de transação: {{message}}",
        },
      },
    },
  },
  ja: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "EVOLVEウォレット残高",
          fundTitle: "EvolveFundデポジット",
          locked: "ボンドによりロック中",
          unlocked: "ロック解除済み",
          daysRemaining: "残り{{days}}日",
          noDeposit: "デポジットなし",
          depositPrompt: "ファンドにEVOLVEを入金（最低15）",
          amountPlaceholder: "金額（例: 20）",
          minDeposit: "最低入金額は15 EVOLVEです",
          approving: "承認中...",
          depositing: "入金中...",
          approveAction: "EVOLVEを承認",
          depositAction: "ファンドに入金",
          lockHint: "最低30日間ロック。ボンド作成に必要です。",
        },
        createBond: {
          partnerPlaceholder: "パートナーアドレス (0x...)",
          fundedRequired: "まず最低15 EVOLVEを入金してください",
          partnerRequired: "パートナーアドレスを入力してください",
        },
        step1: {
          womanPartner: "パートナー（女性）",
          manPartner: "パートナー（男性）",
          alreadyConfirmedTitle: "確認済み",
        },
        step3: {
          canReport: "妊娠を報告できます",
          notYet: "妊娠報告は確認から14日後に利用可能です",
          reportToVerify: "妊娠を報告して父性確認を開始します。",
          waitingWindow: "妊娠報告ウィンドウの開始を待っています...",
          waitingWoman: "女性が妊娠を報告するのを待っています...",
          paternityInProgress: "父性確認を実行中です。管理者が結果を提出します。",
          awaitingResult: "管理者からの父性検査結果を待っています...",
        },
        error: {
          rejected: "ユーザーによってトランザクションが拒否されました。",
          failed: "トランザクションエラー: {{message}}",
        },
      },
    },
  },
  ko: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "EVOLVE 지갑 잔액",
          fundTitle: "EvolveFund 예치금",
          locked: "본드로 잠김",
          unlocked: "잠금 해제됨",
          daysRemaining: "{{days}}일 남음",
          noDeposit: "예치금 없음",
          depositPrompt: "펀드에 EVOLVE 예치 (최소 15)",
          amountPlaceholder: "금액 (예: 20)",
          minDeposit: "최소 예치금은 15 EVOLVE입니다",
          approving: "승인 중...",
          depositing: "예치 중...",
          approveAction: "EVOLVE 승인",
          depositAction: "펀드에 예치",
          lockHint: "최소 30일 잠금. 본드 생성에 필요합니다.",
        },
        createBond: {
          partnerPlaceholder: "파트너 주소 (0x...)",
          fundedRequired: "먼저 최소 15 EVOLVE를 예치하세요",
          partnerRequired: "파트너 주소를 입력하세요",
        },
        step1: {
          womanPartner: "파트너(여성)",
          manPartner: "파트너(남성)",
          alreadyConfirmedTitle: "이미 확인됨",
        },
        step3: {
          canReport: "이제 임신을 보고할 수 있습니다",
          notYet: "임신 보고는 확인 후 14일부터 가능합니다",
          reportToVerify: "임신을 보고하여 친자 확인을 시작합니다.",
          waitingWindow: "임신 보고 창이 열리기를 기다리는 중...",
          waitingWoman: "여성이 임신을 보고하기를 기다리는 중...",
          paternityInProgress: "친자 확인이 진행 중입니다. 관리자가 결과를 제출합니다.",
          awaitingResult: "관리자의 친자 검사 결과를 기다리는 중...",
        },
        error: {
          rejected: "사용자가 거래를 거부했습니다.",
          failed: "거래 오류: {{message}}",
        },
      },
    },
  },
  zh: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "EVOLVE 钱包余额",
          fundTitle: "EvolveFund 存款",
          locked: "已被绑定锁定",
          unlocked: "已解锁",
          daysRemaining: "剩余{{days}}天",
          noDeposit: "无存款",
          depositPrompt: "向基金存入 EVOLVE（最低 15）",
          amountPlaceholder: "金额（如 20）",
          minDeposit: "最低存款为 15 EVOLVE",
          approving: "批准中...",
          depositing: "存款中...",
          approveAction: "批准 EVOLVE",
          depositAction: "存入基金",
          lockHint: "最短锁定 30 天。创建绑定需要。",
        },
        createBond: {
          partnerPlaceholder: "伴侣地址（0x...）",
          fundedRequired: "请先存入至少 15 EVOLVE",
          partnerRequired: "输入伴侣地址",
        },
        step1: {
          womanPartner: "伴侣（女性）",
          manPartner: "伴侣（男性）",
          alreadyConfirmedTitle: "已确认",
        },
        step3: {
          canReport: "您现在可以报告怀孕",
          notYet: "确认 14 天后可报告怀孕",
          reportToVerify: "报告怀孕以启动亲子鉴定。",
          waitingWindow: "正在等待怀孕报告窗口开启...",
          waitingWoman: "正在等待女性报告怀孕...",
          paternityInProgress: "亲子鉴定进行中。管理员将提交结果。",
          awaitingResult: "正在等待管理员的亲子鉴定结果...",
        },
        error: {
          rejected: "用户拒绝了交易。",
          failed: "交易错误：{{message}}",
        },
      },
    },
  },
  ar: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "رصيد محفظة EVOLVE",
          fundTitle: "إيداع EvolveFund",
          locked: "مقفل بواسطة الارتباط",
          unlocked: "مفتوح",
          daysRemaining: "{{days}} يوم متبقي",
          noDeposit: "لا يوجد إيداع",
          depositPrompt: "أودِع EVOLVE في الصندوق (الحد الأدنى 15)",
          amountPlaceholder: "المبلغ (مثال: 20)",
          minDeposit: "الحد الأدنى للإيداع هو 15 EVOLVE",
          approving: "جارٍ الموافقة...",
          depositing: "جارٍ الإيداع...",
          approveAction: "الموافقة على EVOLVE",
          depositAction: "الإيداع في الصندوق",
          lockHint: "قفل أدنى 30 يومًا. مطلوب لإنشاء الارتباطات.",
        },
        createBond: {
          partnerPlaceholder: "عنوان الشريك (0x...)",
          fundedRequired: "أودِع 15 EVOLVE على الأقل أولاً",
          partnerRequired: "أدخل عنوان الشريك",
        },
        step1: {
          womanPartner: "الشريك (امرأة)",
          manPartner: "الشريك (رجل)",
          alreadyConfirmedTitle: "تم التأكيد مسبقًا",
        },
        step3: {
          canReport: "يمكنك الآن الإبلاغ عن الحمل",
          notYet: "الإبلاغ عن الحمل متاح بعد 14 يومًا من التأكيد",
          reportToVerify: "أبلغ عن الحمل لبدء التحقق من الأبوة.",
          waitingWindow: "بانتظار فتح نافذة الإبلاغ عن الحمل...",
          waitingWoman: "بانتظار أن تُبلغ المرأة عن الحمل...",
          paternityInProgress: "التحقق من الأبوة قيد التنفيذ. سيقدم المسؤول النتيجة.",
          awaitingResult: "بانتظار نتيجة اختبار الأبوة من المسؤول...",
        },
        error: {
          rejected: "رُفضت المعاملة من قبل المستخدم.",
          failed: "خطأ في المعاملة: {{message}}",
        },
      },
    },
  },
  vi: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "Số dư ví EVOLVE",
          fundTitle: "Tiền gửi EvolveFund",
          locked: "Bị khóa bởi liên kết",
          unlocked: "Đã mở khóa",
          daysRemaining: "Còn {{days}} ngày",
          noDeposit: "Không có tiền gửi",
          depositPrompt: "Gửi EVOLVE vào Quỹ (tối thiểu 15)",
          amountPlaceholder: "Số tiền (ví dụ: 20)",
          minDeposit: "Số tiền gửi tối thiểu là 15 EVOLVE",
          approving: "Đang phê duyệt...",
          depositing: "Đang gửi...",
          approveAction: "Phê duyệt EVOLVE",
          depositAction: "Gửi vào Quỹ",
          lockHint: "Khóa tối thiểu 30 ngày. Cần để tạo liên kết.",
        },
        createBond: {
          partnerPlaceholder: "Địa chỉ đối tác (0x...)",
          fundedRequired: "Trước tiên hãy gửi ít nhất 15 EVOLVE",
          partnerRequired: "Nhập địa chỉ đối tác",
        },
        step1: {
          womanPartner: "Đối tác (nữ)",
          manPartner: "Đối tác (nam)",
          alreadyConfirmedTitle: "Đã xác nhận",
        },
        step3: {
          canReport: "Bạn có thể báo cáo việc mang thai ngay bây giờ",
          notYet: "Báo cáo mang thai có sẵn sau 14 ngày kể từ khi xác nhận",
          reportToVerify: "Báo cáo việc mang thai để bắt đầu xác minh quan hệ cha con.",
          waitingWindow: "Đang chờ cửa sổ báo cáo mang thai mở...",
          waitingWoman: "Đang chờ người phụ nữ báo cáo việc mang thai...",
          paternityInProgress: "Đang xác minh quan hệ cha con. Quản trị viên sẽ gửi kết quả.",
          awaitingResult: "Đang chờ kết quả xét nghiệm quan hệ cha con từ quản trị viên...",
        },
        error: {
          rejected: "Giao dịch bị người dùng từ chối.",
          failed: "Lỗi giao dịch: {{message}}",
        },
      },
    },
  },
  hi: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "EVOLVE वॉलेट बैलेंस",
          fundTitle: "EvolveFund जमा",
          locked: "बॉन्ड द्वारा लॉक",
          unlocked: "अनलॉक",
          daysRemaining: "{{days}} दिन शेष",
          noDeposit: "कोई जमा नहीं",
          depositPrompt: "फंड में EVOLVE जमा करें (न्यूनतम 15)",
          amountPlaceholder: "राशि (जैसे 20)",
          minDeposit: "न्यूनतम जमा 15 EVOLVE है",
          approving: "अनुमोदन हो रहा है...",
          depositing: "जमा हो रहा है...",
          approveAction: "EVOLVE अनुमोदित करें",
          depositAction: "फंड में जमा करें",
          lockHint: "न्यूनतम 30 दिन लॉक। बॉन्ड बनाने के लिए आवश्यक।",
        },
        createBond: {
          partnerPlaceholder: "साथी का पता (0x...)",
          fundedRequired: "पहले कम से कम 15 EVOLVE जमा करें",
          partnerRequired: "साथी का पता दर्ज करें",
        },
        step1: {
          womanPartner: "साथी (महिला)",
          manPartner: "साथी (पुरुष)",
          alreadyConfirmedTitle: "पहले ही पुष्टि हो चुकी है",
        },
        step3: {
          canReport: "अब आप गर्भावस्था की रिपोर्ट कर सकते हैं",
          notYet: "पुष्टि के 14 दिन बाद गर्भावस्था रिपोर्ट उपलब्ध है",
          reportToVerify: "पितृत्व सत्यापन शुरू करने के लिए गर्भावस्था की रिपोर्ट करें।",
          waitingWindow: "गर्भावस्था रिपोर्ट विंडो खुलने का इंतज़ार...",
          waitingWoman: "महिला द्वारा गर्भावस्था रिपोर्ट करने का इंतज़ार...",
          paternityInProgress: "पितृत्व सत्यापन जारी है। प्रशासक परिणाम सबमिट करेगा।",
          awaitingResult: "प्रशासक से पितृत्व परीक्षण परिणाम का इंतज़ार...",
        },
        error: {
          rejected: "उपयोगकर्ता द्वारा लेनदेन अस्वीकृत।",
          failed: "लेनदेन त्रुटि: {{message}}",
        },
      },
    },
  },
  tr: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "EVOLVE Cüzdan Bakiyesi",
          fundTitle: "EvolveFund Yatırımı",
          locked: "Bağ ile kilitli",
          unlocked: "Kilidi açık",
          daysRemaining: "{{days}} gün kaldı",
          noDeposit: "Yatırım yok",
          depositPrompt: "Fona EVOLVE yatırın (min 15)",
          amountPlaceholder: "Tutar (ör. 20)",
          minDeposit: "Minimum yatırım 15 EVOLVE'dir",
          approving: "Onaylanıyor...",
          depositing: "Yatırılıyor...",
          approveAction: "EVOLVE'u onayla",
          depositAction: "Fona yatır",
          lockHint: "Minimum 30 gün kilit. Bağ oluşturmak için gereklidir.",
        },
        createBond: {
          partnerPlaceholder: "Partner adresi (0x...)",
          fundedRequired: "Önce en az 15 EVOLVE yatırın",
          partnerRequired: "Bir partner adresi girin",
        },
        step1: {
          womanPartner: "Partner (kadın)",
          manPartner: "Partner (erkek)",
          alreadyConfirmedTitle: "Zaten onaylandı",
        },
        step3: {
          canReport: "Artık hamileliği bildirebilirsiniz",
          notYet: "Hamilelik bildirimi, onaydan 14 gün sonra kullanılabilir",
          reportToVerify: "Babaliği doğrulamayı başlatmak için hamileliği bildirin.",
          waitingWindow: "Hamilelik bildirim penceresinin açılması bekleniyor...",
          waitingWoman: "Kadının hamileliği bildirmesi bekleniyor...",
          paternityInProgress: "Babaliği doğrulaması sürüyor. Yönetici sonucu gönderir.",
          awaitingResult: "Yöneticiden babaliği testi sonucu bekleniyor...",
        },
        error: {
          rejected: "İşlem kullanıcı tarafından reddedildi.",
          failed: "İşlem hatası: {{message}}",
        },
      },
    },
  },
  th: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "ยอดเงินในกระเป๋า EVOLVE",
          fundTitle: "เงินฝาก EvolveFund",
          locked: "ถูกล็อกโดยพันธะ",
          unlocked: "ปลดล็อกแล้ว",
          daysRemaining: "เหลือ {{days}} วัน",
          noDeposit: "ไม่มีเงินฝาก",
          depositPrompt: "ฝาก EVOLVE เข้ากองทุน (ขั้นต่ำ 15)",
          amountPlaceholder: "จำนวน (เช่น 20)",
          minDeposit: "เงินฝากขั้นต่ำคือ 15 EVOLVE",
          approving: "กำลังอนุมัติ...",
          depositing: "กำลังฝาก...",
          approveAction: "อนุมัติ EVOLVE",
          depositAction: "ฝากเข้ากองทุน",
          lockHint: "ล็อกขั้นต่ำ 30 วัน จำเป็นเพื่อสร้างพันธะ",
        },
        createBond: {
          partnerPlaceholder: "ที่อยู่คู่ครอง (0x...)",
          fundedRequired: "ฝากอย่างน้อย 15 EVOLVE ก่อน",
          partnerRequired: "กรอกที่อยู่คู่ครอง",
        },
        step1: {
          womanPartner: "คู่ครอง (หญิง)",
          manPartner: "คู่ครอง (ชาย)",
          alreadyConfirmedTitle: "ยืนยันแล้ว",
        },
        step3: {
          canReport: "คุณสามารถรายงานการตั้งครรภ์ได้แล้ว",
          notYet: "รายงานการตั้งครรภ์พร้อมใช้หลังการยืนยัน 14 วัน",
          reportToVerify: "รายงานการตั้งครรภ์เพื่อเริ่มการตรวจความเป็นบิดา",
          waitingWindow: "กำลังรอช่วงเวลารายงานการตั้งครรภ์...",
          waitingWoman: "กำลังรอผู้หญิงรายงานการตั้งครรภ์...",
          paternityInProgress: "กำลังตรวจความเป็นบิดา ผู้ดูแลระบบจะส่งผลลัพธ์",
          awaitingResult: "กำลังรอผลตรวจความเป็นบิดาจากผู้ดูแลระบบ...",
        },
        error: {
          rejected: "ผู้ใช้ปฏิเสธธุรกรรม",
          failed: "ข้อผิดพลาดธุรกรรม: {{message}}",
        },
      },
    },
  },
  id: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "Saldo Dompet EVOLVE",
          fundTitle: "Deposit EvolveFund",
          locked: "Terkunci oleh ikatan",
          unlocked: "Tidak terkunci",
          daysRemaining: "{{days}} hari tersisa",
          noDeposit: "Tidak ada deposit",
          depositPrompt: "Setor EVOLVE ke Dana (min 15)",
          amountPlaceholder: "Jumlah (mis. 20)",
          minDeposit: "Deposit minimum adalah 15 EVOLVE",
          approving: "Menyetujui...",
          depositing: "Menyetor...",
          approveAction: "Setujui EVOLVE",
          depositAction: "Setor ke Dana",
          lockHint: "Kunci minimum 30 hari. Diperlukan untuk membuat ikatan.",
        },
        createBond: {
          partnerPlaceholder: "Alamat pasangan (0x...)",
          fundedRequired: "Setor minimal 15 EVOLVE dulu",
          partnerRequired: "Masukkan alamat pasangan",
        },
        step1: {
          womanPartner: "Pasangan (wanita)",
          manPartner: "Pasangan (pria)",
          alreadyConfirmedTitle: "Sudah dikonfirmasi",
        },
        step3: {
          canReport: "Anda sekarang dapat melaporkan kehamilan",
          notYet: "Pelaporan kehamilan tersedia 14 hari setelah konfirmasi",
          reportToVerify: "Laporkan kehamilan untuk memulai verifikasi ayah.",
          waitingWindow: "Menunggu jendela pelaporan kehamilan terbuka...",
          waitingWoman: "Menunggu wanita melaporkan kehamilan...",
          paternityInProgress: "Verifikasi ayah sedang berlangsung. Admin akan mengirimkan hasil.",
          awaitingResult: "Menunggu hasil tes ayah dari admin...",
        },
        error: {
          rejected: "Transaksi ditolak oleh pengguna.",
          failed: "Kesalahan transaksi: {{message}}",
        },
      },
    },
  },
  ms: {
    dashboard: {
      mode2: {
        step0: {
          walletBalance: "Baki Dompet EVOLVE",
          fundTitle: "Deposit EvolveFund",
          locked: "Dikunci oleh ikatan",
          unlocked: "Tidak dikunci",
          daysRemaining: "{{days}} hari lagi",
          noDeposit: "Tiada deposit",
          depositPrompt: "Deposit EVOLVE ke Dana (min 15)",
          amountPlaceholder: "Amaun (cth. 20)",
          minDeposit: "Deposit minimum ialah 15 EVOLVE",
          approving: "Mengesahkan...",
          depositing: "Mendeposit...",
          approveAction: "Sahkan EVOLVE",
          depositAction: "Deposit ke Dana",
          lockHint: "Kunci minimum 30 hari. Diperlukan untuk mencipta ikatan.",
        },
        createBond: {
          partnerPlaceholder: "Alamat pasangan (0x...)",
          fundedRequired: "Deposit sekurang-kurangnya 15 EVOLVE dahulu",
          partnerRequired: "Masukkan alamat pasangan",
        },
        step1: {
          womanPartner: "Pasangan (wanita)",
          manPartner: "Pasangan (lelaki)",
          alreadyConfirmedTitle: "Sudah disahkan",
        },
        step3: {
          canReport: "Anda kini boleh melaporkan kehamilan",
          notYet: "Laporan kehamilan tersedia selepas 14 hari dari pengesahan",
          reportToVerify: "Laporkan kehamilan untuk memulakan pengesahan bapa.",
          waitingWindow: "Menunggu tetingkap laporan kehamilan dibuka...",
          waitingWoman: "Menunggu wanita melaporkan kehamilan...",
          paternityInProgress: "Pengesahan bapa sedang berjalan. Pentadbir akan menghantar hasil.",
          awaitingResult: "Menunggu hasil ujian bapa daripada pentadbir...",
        },
        error: {
          rejected: "Transaksi ditolak oleh pengguna.",
          failed: "Ralat transaksi: {{message}}",
        },
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

// Read the actual locale files from disk (single source of truth).
const files = fs.readdirSync(LOCALES_DIR).filter((f) => f.endsWith(".json"));

function main() {
  if (files.length === 0) {
    console.error("NOT ALL LOCALES EXIST");
    process.exit(1);
  }

  for (const f of files) {
    const locale = f.replace(/\.json$/, ""); // e.g. "uk", "zh-TW"
    const filePath = path.join(LOCALES_DIR, f);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    // Tier 1 natural translation (fall back zh-TW -> zh), otherwise English.
    const natural = NATURAL[locale] || NATURAL[locale.split("-")[0]];
    const source = natural ? deepMerge(deepClone(EN), deepClone(natural)) : deepClone(EN);
    const merged = deepMerge(data, source);
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + "\n", "utf8");
  }

  // Verify every locale file now contains the required keys.
  const required = [
    ["dashboard", ["mode2", "step0", "walletBalance"]],
    ["dashboard", ["mode2", "step0", "fundTitle"]],
    ["dashboard", ["mode2", "step0", "locked"]],
    ["dashboard", ["mode2", "step0", "unlocked"]],
    ["dashboard", ["mode2", "step0", "daysRemaining"]],
    ["dashboard", ["mode2", "step0", "noDeposit"]],
    ["dashboard", ["mode2", "step0", "depositPrompt"]],
    ["dashboard", ["mode2", "step0", "amountPlaceholder"]],
    ["dashboard", ["mode2", "step0", "minDeposit"]],
    ["dashboard", ["mode2", "step0", "approving"]],
    ["dashboard", ["mode2", "step0", "depositing"]],
    ["dashboard", ["mode2", "step0", "approveAction"]],
    ["dashboard", ["mode2", "step0", "depositAction"]],
    ["dashboard", ["mode2", "step0", "lockHint"]],
    ["dashboard", ["mode2", "createBond", "partnerPlaceholder"]],
    ["dashboard", ["mode2", "createBond", "fundedRequired"]],
    ["dashboard", ["mode2", "createBond", "partnerRequired"]],
    ["dashboard", ["mode2", "step1", "womanPartner"]],
    ["dashboard", ["mode2", "step1", "manPartner"]],
    ["dashboard", ["mode2", "step1", "alreadyConfirmedTitle"]],
    ["dashboard", ["mode2", "step3", "canReport"]],
    ["dashboard", ["mode2", "step3", "notYet"]],
    ["dashboard", ["mode2", "step3", "reportToVerify"]],
    ["dashboard", ["mode2", "step3", "waitingWindow"]],
    ["dashboard", ["mode2", "step3", "waitingWoman"]],
    ["dashboard", ["mode2", "step3", "paternityInProgress"]],
    ["dashboard", ["mode2", "step3", "awaitingResult"]],
    ["dashboard", ["mode2", "error", "rejected"]],
    ["dashboard", ["mode2", "error", "failed"]],
  ];
  const bad = [];
  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, f), "utf8"));
    for (const [root, pathParts] of required) {
      let node = data[root];
      for (const p of pathParts) node = node && node[p];
      if (!node) {
        bad.push(`${f.replace(/\.json$/, "")}.${root}.${pathParts.join(".")}`);
      }
    }
  }
  console.log(bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : "ALL 33 LOCALES VALID");
}

main();
