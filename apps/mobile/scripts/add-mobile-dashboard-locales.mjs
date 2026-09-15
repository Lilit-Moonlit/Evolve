// Deterministic i18n locale adder for the MOBILE Mode2/Mode3 dashboards.
//
// INCREMENTAL RUN: adds ONLY the keys that apps/mobile/app/mode2.tsx and
// mode3.tsx reference (t("common.loading"), dashboard.mode2.step0 deposit
// block, step1 partner labels, step3 pregnancy strings, error banners,
// dashboard.mode3 join/confirm/resolved) and FORCE-overrides a few stale
// values already deployed by an earlier run ("Deposit 15 ETH" -> EVOLVE,
// "20-day period" -> auto-resolve, "Pregnancy Confirmed" -> "Report
// pregnancy"). Existing natural translations are preserved (deepMerge).
//
// Natural translations are provided for the mobile Tier 1 languages that the
// mobile locale set actually ships
// (uk de fr es pt ja zh->zh-TW ar vi); all other locales fall back to
// English (repo Tier 2 convention).
//
// Run: node apps/mobile/scripts/add-mobile-dashboard-locales.mjs

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, "..", "i18n", "locales");

// ─── New keys referenced by mode2.tsx / mode3.tsx (English source) ───
const EN = {
  common: {
    loading: "Loading...",
  },
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
        approving: "Approving...",
        depositing: "Depositing...",
        approveAction: "Approve EVOLVE",
        depositAction: "Deposit to Fund",
        lockHint: "30-day minimum lock. Required to create bonds.",
      },
      createBond: {
        partnerPlaceholder: "Partner address (0x...)",
      },
      step1: {
        womanPartner: "Woman partner",
        manPartner: "Man partner",
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
    mode3: {
      joinButton: "Join Session",
      waitingForParticipants: "Your session is active — waiting for participants",
      confirmButton: "Confirm Participation",
      fundNotice: "You need at least 15 EVOLVE deposited in EvolveFund to participate.",
      resolved: {
        title: "Session Resolved",
        fatherLabel: "Chosen father:",
        rewardInfo: "Non-selected participants: 90% of stake goes to woman, 10% to chosen father.",
        noFather: "No father was chosen. Stakes returned to participants.",
      },
      error: {
        rejected: "Transaction rejected by user.",
        failed: "Transaction error: {{message}}",
      },
    },
  },
};

// ─── Stale values already deployed, must be OVERWRITTEN (English source) ───
const FORCE = {
  dashboard: {
    mode2: {
      step0: {
        description: "Deposit at least 15 EVOLVE in EvolveFund as commitment guarantee",
        fundRequired: "Minimum deposit of 15 EVOLVE in EvolveFund required",
      },
      step2: {
        description: "The bond resolves automatically when the pregnancy period ends.",
      },
      step3: {
        pregnancyCheckbox: "Report pregnancy",
      },
    },
  },
};

// ─── Natural translations for mobile Tier 1 languages ───
const NATURAL = {
  uk: {
    common: {
      loading: "Завантаження...",
    },
    dashboard: {
      mode2: {
        step0: {
          description: "Внесіть щонайменше 15 EVOLVE у EvolveFund як гарантію зобов'язання",
          fundRequired: "Потрібен депозит щонайменше 15 EVOLVE у EvolveFund",
          walletBalance: "Баланс гаманця EVOLVE",
          fundTitle: "Депозит EvolveFund",
          locked: "Заблоковано зв'язком",
          unlocked: "Розблоковано",
          daysRemaining: "{{days}} дн. залишилось",
          noDeposit: "Немає депозиту",
          depositPrompt: "Внести EVOLVE у Фонд (мін 15)",
          amountPlaceholder: "Сума (напр. 20)",
          approving: "Підтвердження...",
          depositing: "Внесення...",
          approveAction: "Схвалити EVOLVE",
          depositAction: "Внести у Фонд",
          lockHint: "Мінімальне блокування 30 днів. Потрібно для створення зв'язків.",
        },
        createBond: {
          partnerPlaceholder: "Адреса партнера (0x...)",
        },
        step1: {
          womanPartner: "Партнерка (жінка)",
          manPartner: "Партнер (чоловік)",
        },
        step2: {
          description: "Зв'язок вирішується автоматично після завершення періоду вагітності.",
        },
        step3: {
          pregnancyCheckbox: "Повідомити про вагітність",
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
      mode3: {
        joinButton: "Приєднатися до сесії",
        waitingForParticipants: "Ваша сесія активна — очікуємо учасників",
        confirmButton: "Підтвердити участь",
        fundNotice: "Для участі потрібно щонайменше 15 EVOLVE на депозиті у EvolveFund.",
        resolved: {
          title: "Сесію завершено",
          fatherLabel: "Обраний батько:",
          rewardInfo: "Необрані учасники: 90% частки — жінці, 10% — обраному батькові.",
          noFather: "Батька не обрано. Частки повернуто учасникам.",
        },
        error: {
          rejected: "Транзакцію відхилено користувачем.",
          failed: "Помилка транзакції: {{message}}",
        },
      },
    },
  },
  de: {
    common: {
      loading: "Wird geladen...",
    },
    dashboard: {
      mode2: {
        step0: {
          description:
            "Zahlen Sie mindestens 15 EVOLVE in EvolveFund als Verbindlichkeitsgarantie ein",
          fundRequired: "Mindesteinzahlung von 15 EVOLVE in EvolveFund erforderlich",
          walletBalance: "EVOLVE-Wallet-Guthaben",
          fundTitle: "EvolveFund-Einzahlung",
          locked: "Durch Bindung gesperrt",
          unlocked: "Entsperrt",
          daysRemaining: "{{days}} T. verbleibend",
          noDeposit: "Keine Einzahlung",
          depositPrompt: "EVOLVE in den Fonds einzahlen (min. 15)",
          amountPlaceholder: "Betrag (z. B. 20)",
          approving: "Wird genehmigt...",
          depositing: "Wird eingezahlt...",
          approveAction: "EVOLVE genehmigen",
          depositAction: "In den Fonds einzahlen",
          lockHint: "Mindestsperre 30 Tage. Zum Erstellen von Bindungen erforderlich.",
        },
        createBond: {
          partnerPlaceholder: "Partneradresse (0x...)",
        },
        step1: {
          womanPartner: "Partnerin (Frau)",
          manPartner: "Partner (Mann)",
        },
        step2: {
          description:
            "Die Bindung wird automatisch aufgelöst, wenn der Schwangerschaftszeitraum endet.",
        },
        step3: {
          pregnancyCheckbox: "Schwangerschaft melden",
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
      mode3: {
        joinButton: "Session beitreten",
        waitingForParticipants: "Ihre Session ist aktiv — Warten auf Teilnehmer",
        confirmButton: "Teilnahme bestätigen",
        fundNotice: "Sie benötigen mindestens 15 EVOLVE Einzahlung im EvolveFund, um teilzunehmen.",
        resolved: {
          title: "Session aufgelöst",
          fatherLabel: "Gewählter Vater:",
          rewardInfo:
            "Nicht ausgewählte Teilnehmer: 90% des Einsatzes an die Frau, 10% an den gewählten Vater.",
          noFather: "Kein Vater wurde gewählt. Einsätze an die Teilnehmer zurückgegeben.",
        },
        error: {
          rejected: "Transaktion vom Benutzer abgelehnt.",
          failed: "Transaktionsfehler: {{message}}",
        },
      },
    },
  },
  fr: {
    common: {
      loading: "Chargement...",
    },
    dashboard: {
      mode2: {
        step0: {
          description: "Déposez au moins 15 EVOLVE dans EvolveFund comme garantie d'engagement",
          fundRequired: "Dépôt minimum de 15 EVOLVE dans EvolveFund requis",
          walletBalance: "Solde du portefeuille EVOLVE",
          fundTitle: "Dépôt EvolveFund",
          locked: "Verrouillé par le lien",
          unlocked: "Déverrouillé",
          daysRemaining: "{{days}} j restants",
          noDeposit: "Aucun dépôt",
          depositPrompt: "Déposer des EVOLVE dans le Fonds (min 15)",
          amountPlaceholder: "Montant (p. ex. 20)",
          approving: "Approbation...",
          depositing: "Dépôt en cours...",
          approveAction: "Approuver EVOLVE",
          depositAction: "Déposer dans le Fonds",
          lockHint: "Blocage minimum de 30 jours. Requis pour créer des liens.",
        },
        createBond: {
          partnerPlaceholder: "Adresse du partenaire (0x...)",
        },
        step1: {
          womanPartner: "Partenaire (femme)",
          manPartner: "Partenaire (homme)",
        },
        step2: {
          description: "Le lien se résout automatiquement à la fin de la période de grossesse.",
        },
        step3: {
          pregnancyCheckbox: "Signaler une grossesse",
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
      mode3: {
        joinButton: "Rejoindre la session",
        waitingForParticipants: "Votre session est active — en attente de participants",
        confirmButton: "Confirmer la participation",
        fundNotice: "Vous devez avoir au moins 15 EVOLVE déposés dans EvolveFund pour participer.",
        resolved: {
          title: "Session résolue",
          fatherLabel: "Père choisi :",
          rewardInfo:
            "Participants non sélectionnés : 90 % de la mise à la femme, 10 % au père choisi.",
          noFather: "Aucun père choisi. Mises restituées aux participants.",
        },
        error: {
          rejected: "Transaction rejetée par l'utilisateur.",
          failed: "Erreur de transaction : {{message}}",
        },
      },
    },
  },
  es: {
    common: {
      loading: "Cargando...",
    },
    dashboard: {
      mode2: {
        step0: {
          description: "Deposita al menos 15 EVOLVE en EvolveFund como garantía de compromiso",
          fundRequired: "Se requiere un depósito mínimo de 15 EVOLVE en EvolveFund",
          walletBalance: "Saldo de cartera EVOLVE",
          fundTitle: "Depósito en EvolveFund",
          locked: "Bloqueado por vínculo",
          unlocked: "Desbloqueado",
          daysRemaining: "{{days}} d restantes",
          noDeposit: "Sin depósito",
          depositPrompt: "Depositar EVOLVE en el Fondo (mín 15)",
          amountPlaceholder: "Cantidad (p. ej. 20)",
          approving: "Aprobando...",
          depositing: "Depositando...",
          approveAction: "Aprobar EVOLVE",
          depositAction: "Depositar en el Fondo",
          lockHint: "Bloqueo mínimo de 30 días. Requerido para crear vínculos.",
        },
        createBond: {
          partnerPlaceholder: "Dirección del socio (0x...)",
        },
        step1: {
          womanPartner: "Socia (mujer)",
          manPartner: "Socio (hombre)",
        },
        step2: {
          description:
            "El vínculo se resuelve automáticamente cuando termina el período de embarazo.",
        },
        step3: {
          pregnancyCheckbox: "Informar del embarazo",
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
      mode3: {
        joinButton: "Unirse a la sesión",
        waitingForParticipants: "Tu sesión está activa — esperando participantes",
        confirmButton: "Confirmar participación",
        fundNotice: "Necesitas al menos 15 EVOLVE depositados en EvolveFund para participar.",
        resolved: {
          title: "Sesión resuelta",
          fatherLabel: "Padre elegido:",
          rewardInfo:
            "Participantes no seleccionados: 90% de la apuesta a la mujer, 10% al padre elegido.",
          noFather: "No se eligió padre. Apuestas devueltas a los participantes.",
        },
        error: {
          rejected: "Transacción rechazada por el usuario.",
          failed: "Error de transacción: {{message}}",
        },
      },
    },
  },
  pt: {
    common: {
      loading: "Carregando...",
    },
    dashboard: {
      mode2: {
        step0: {
          description: "Deposite pelo menos 15 EVOLVE no EvolveFund como garantia de compromisso",
          fundRequired: "Depósito mínimo de 15 EVOLVE no EvolveFund necessário",
          walletBalance: "Saldo da carteira EVOLVE",
          fundTitle: "Depósito EvolveFund",
          locked: "Bloqueado pelo vínculo",
          unlocked: "Desbloqueado",
          daysRemaining: "{{days}} d restantes",
          noDeposit: "Sem depósito",
          depositPrompt: "Depositar EVOLVE no Fundo (mín 15)",
          amountPlaceholder: "Valor (ex.: 20)",
          approving: "Aprovando...",
          depositing: "Depositando...",
          approveAction: "Aprovar EVOLVE",
          depositAction: "Depositar no Fundo",
          lockHint: "Bloqueio mínimo de 30 dias. Necessário para criar vínculos.",
        },
        createBond: {
          partnerPlaceholder: "Endereço do parceiro (0x...)",
        },
        step1: {
          womanPartner: "Parceira (mulher)",
          manPartner: "Parceiro (homem)",
        },
        step2: {
          description:
            "O vínculo é resolvido automaticamente quando o período de gravidez termina.",
        },
        step3: {
          pregnancyCheckbox: "Informar gravidez",
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
      mode3: {
        joinButton: "Entrar na sessão",
        waitingForParticipants: "Sua sessão está ativa — aguardando participantes",
        confirmButton: "Confirmar participação",
        fundNotice:
          "Você precisa de pelo menos 15 EVOLVE depositados no EvolveFund para participar.",
        resolved: {
          title: "Sessão resolvida",
          fatherLabel: "Pai escolhido:",
          rewardInfo:
            "Participantes não selecionados: 90% da aposta à mulher, 10% ao pai escolhido.",
          noFather: "Nenhum pai foi escolhido. Apostas devolvidas aos participantes.",
        },
        error: {
          rejected: "Transação rejeitada pelo usuário.",
          failed: "Erro de transação: {{message}}",
        },
      },
    },
  },
  ja: {
    common: {
      loading: "読み込み中...",
    },
    dashboard: {
      mode2: {
        step0: {
          description: "コミットメントの保証としてEvolveFundに最低15 EVOLVEを入金してください",
          fundRequired: "EvolveFundへの最低15 EVOLVEの入金が必要です",
          walletBalance: "EVOLVEウォレット残高",
          fundTitle: "EvolveFundデポジット",
          locked: "ボンドによりロック中",
          unlocked: "ロック解除済み",
          daysRemaining: "残り{{days}}日",
          noDeposit: "デポジットなし",
          depositPrompt: "ファンドにEVOLVEを入金（最低15）",
          amountPlaceholder: "金額（例: 20）",
          approving: "承認中...",
          depositing: "入金中...",
          approveAction: "EVOLVEを承認",
          depositAction: "ファンドに入金",
          lockHint: "最低30日間ロック。ボンド作成に必要です。",
        },
        createBond: {
          partnerPlaceholder: "パートナーアドレス (0x...)",
        },
        step1: {
          womanPartner: "パートナー（女性）",
          manPartner: "パートナー（男性）",
        },
        step2: {
          description: "妊娠期間が終了すると、ボンドは自動的に解決されます。",
        },
        step3: {
          pregnancyCheckbox: "妊娠を報告",
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
      mode3: {
        joinButton: "セッションに参加",
        waitingForParticipants: "セッションはアクティブです — 参加者を待っています",
        confirmButton: "参加を確認",
        fundNotice: "参加にはEvolveFundへの最低15 EVOLVEの入金が必要です。",
        resolved: {
          title: "セッション解決済み",
          fatherLabel: "選ばれた父:",
          rewardInfo: "選ばれなかった参加者: ステークの90%は女性へ、10%は選ばれた父へ。",
          noFather: "父は選ばれませんでした。ステークは参加者に返還されました。",
        },
        error: {
          rejected: "ユーザーによってトランザクションが拒否されました。",
          failed: "トランザクションエラー: {{message}}",
        },
      },
    },
  },
  zh: {
    common: {
      loading: "加载中...",
    },
    dashboard: {
      mode2: {
        step0: {
          description: "请在 EvolveFund 存入至少 15 EVOLVE 作为承诺担保",
          fundRequired: "需要在 EvolveFund 存入最少 15 EVOLVE",
          walletBalance: "EVOLVE 钱包余额",
          fundTitle: "EvolveFund 存款",
          locked: "已被绑定锁定",
          unlocked: "已解锁",
          daysRemaining: "剩余{{days}}天",
          noDeposit: "无存款",
          depositPrompt: "向基金存入 EVOLVE（最低 15）",
          amountPlaceholder: "金额（如 20）",
          approving: "批准中...",
          depositing: "存款中...",
          approveAction: "批准 EVOLVE",
          depositAction: "存入基金",
          lockHint: "最短锁定 30 天。创建绑定需要。",
        },
        createBond: {
          partnerPlaceholder: "伴侣地址（0x...）",
        },
        step1: {
          womanPartner: "伴侣（女性）",
          manPartner: "伴侣（男性）",
        },
        step2: {
          description: "妊娠期结束时，绑定会自动解除。",
        },
        step3: {
          pregnancyCheckbox: "报告怀孕",
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
      mode3: {
        joinButton: "加入会话",
        waitingForParticipants: "您的会话处于活动状态 — 等待参与者",
        confirmButton: "确认参与",
        fundNotice: "参与需要至少在 EvolveFund 存入 15 EVOLVE。",
        resolved: {
          title: "会话已解决",
          fatherLabel: "选定的父亲：",
          rewardInfo: "未被选中的参与者：90% 的押金归女方，10% 归选定的父亲。",
          noFather: "未选择父亲。押金已退还给参与者。",
        },
        error: {
          rejected: "用户拒绝了交易。",
          failed: "交易错误：{{message}}",
        },
      },
    },
  },
  ar: {
    common: {
      loading: "جارٍ التحميل...",
    },
    dashboard: {
      mode2: {
        step0: {
          description: "أودِع 15 EVOLVE على الأقل في EvolveFund كضمان للالتزام",
          fundRequired: "مطلوب إيداع 15 EVOLVE على الأقل في EvolveFund",
          walletBalance: "رصيد محفظة EVOLVE",
          fundTitle: "إيداع EvolveFund",
          locked: "مقفل بواسطة الارتباط",
          unlocked: "مفتوح",
          daysRemaining: "{{days}} يوم متبقي",
          noDeposit: "لا يوجد إيداع",
          depositPrompt: "أودِع EVOLVE في الصندوق (الحد الأدنى 15)",
          amountPlaceholder: "المبلغ (مثال: 20)",
          approving: "جارٍ الموافقة...",
          depositing: "جارٍ الإيداع...",
          approveAction: "الموافقة على EVOLVE",
          depositAction: "الإيداع في الصندوق",
          lockHint: "قفل أدنى 30 يومًا. مطلوب لإنشاء الارتباطات.",
        },
        createBond: {
          partnerPlaceholder: "عنوان الشريك (0x...)",
        },
        step1: {
          womanPartner: "الشريك (امرأة)",
          manPartner: "الشريك (رجل)",
        },
        step2: {
          description: "يتم حل الارتباط تلقائيًا عند انتهاء فترة الحمل.",
        },
        step3: {
          pregnancyCheckbox: "الإبلاغ عن الحمل",
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
      mode3: {
        joinButton: "الانضمام إلى الجلسة",
        waitingForParticipants: "جلستك نشطة — بانتظار المشاركين",
        confirmButton: "تأكيد المشاركة",
        fundNotice: "تحتاج إلى إيداع 15 EVOLVE على الأقل في EvolveFund للمشاركة.",
        resolved: {
          title: "تم حل الجلسة",
          fatherLabel: "الأب المختار:",
          rewardInfo: "المشاركون غير المختارين: 90% من الحصة للمرأة، 10% للأب المختار.",
          noFather: "لم يتم اختيار أب. أُعيدت الحصص إلى المشاركين.",
        },
        error: {
          rejected: "رُفضت المعاملة من قبل المستخدم.",
          failed: "خطأ في المعاملة: {{message}}",
        },
      },
    },
  },
  vi: {
    common: {
      loading: "Đang tải...",
    },
    dashboard: {
      mode2: {
        step0: {
          description: "Hãy gửi ít nhất 15 EVOLVE vào EvolveFund như cam kết bảo đảm",
          fundRequired: "Cần gửi tối thiểu 15 EVOLVE vào EvolveFund",
          walletBalance: "Số dư ví EVOLVE",
          fundTitle: "Tiền gửi EvolveFund",
          locked: "Bị khóa bởi liên kết",
          unlocked: "Đã mở khóa",
          daysRemaining: "Còn {{days}} ngày",
          noDeposit: "Không có tiền gửi",
          depositPrompt: "Gửi EVOLVE vào Quỹ (tối thiểu 15)",
          amountPlaceholder: "Số tiền (ví dụ: 20)",
          approving: "Đang phê duyệt...",
          depositing: "Đang gửi...",
          approveAction: "Phê duyệt EVOLVE",
          depositAction: "Gửi vào Quỹ",
          lockHint: "Khóa tối thiểu 30 ngày. Cần để tạo liên kết.",
        },
        createBond: {
          partnerPlaceholder: "Địa chỉ đối tác (0x...)",
        },
        step1: {
          womanPartner: "Đối tác (nữ)",
          manPartner: "Đối tác (nam)",
        },
        step2: {
          description: "Liên kết tự động được giải quyết khi kết thúc giai đoạn mang thai.",
        },
        step3: {
          pregnancyCheckbox: "Báo cáo mang thai",
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
      mode3: {
        joinButton: "Tham gia phiên",
        waitingForParticipants: "Phiên của bạn đang hoạt động — đang chờ người tham gia",
        confirmButton: "Xác nhận tham gia",
        fundNotice: "Bạn cần gửi tối thiểu 15 EVOLVE vào EvolveFund để tham gia.",
        resolved: {
          title: "Phiên đã giải quyết",
          fatherLabel: "Người cha được chọn:",
          rewardInfo:
            "Người tham gia không được chọn: 90% phần đặt cọc cho người phụ nữ, 10% cho người cha được chọn.",
          noFather: "Không ai được chọn làm cha. Phần đặt cọc đã trả lại cho người tham gia.",
        },
        error: {
          rejected: "Giao dịch bị người dùng từ chối.",
          failed: "Lỗi giao dịch: {{message}}",
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
    const natural = NATURAL[locale] || NATURAL[locale.split("-")[0]] || {};
    const additions = deepMerge(deepClone(EN), deepClone(natural));
    const force = deepMerge(deepClone(FORCE), deepClone(natural));
    let merged = deepMerge(data, additions);
    merged = deepMerge(merged, force);
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + "\n", "utf8");
  }

  // Verify every locale file now contains the required keys.
  const required = [
    ["common", ["loading"]],
    ["dashboard", ["mode2", "step0", "walletBalance"]],
    ["dashboard", ["mode2", "step0", "fundTitle"]],
    ["dashboard", ["mode2", "step0", "locked"]],
    ["dashboard", ["mode2", "step0", "unlocked"]],
    ["dashboard", ["mode2", "step0", "daysRemaining"]],
    ["dashboard", ["mode2", "step0", "noDeposit"]],
    ["dashboard", ["mode2", "step0", "depositPrompt"]],
    ["dashboard", ["mode2", "step0", "amountPlaceholder"]],
    ["dashboard", ["mode2", "step0", "approving"]],
    ["dashboard", ["mode2", "step0", "depositing"]],
    ["dashboard", ["mode2", "step0", "approveAction"]],
    ["dashboard", ["mode2", "step0", "depositAction"]],
    ["dashboard", ["mode2", "step0", "lockHint"]],
    ["dashboard", ["mode2", "step0", "description"]],
    ["dashboard", ["mode2", "step0", "fundRequired"]],
    ["dashboard", ["mode2", "createBond", "partnerPlaceholder"]],
    ["dashboard", ["mode2", "step1", "womanPartner"]],
    ["dashboard", ["mode2", "step1", "manPartner"]],
    ["dashboard", ["mode2", "step2", "description"]],
    ["dashboard", ["mode2", "step3", "pregnancyCheckbox"]],
    ["dashboard", ["mode2", "step3", "canReport"]],
    ["dashboard", ["mode2", "step3", "notYet"]],
    ["dashboard", ["mode2", "step3", "reportToVerify"]],
    ["dashboard", ["mode2", "step3", "waitingWindow"]],
    ["dashboard", ["mode2", "step3", "waitingWoman"]],
    ["dashboard", ["mode2", "step3", "paternityInProgress"]],
    ["dashboard", ["mode2", "step3", "awaitingResult"]],
    ["dashboard", ["mode2", "error", "rejected"]],
    ["dashboard", ["mode2", "error", "failed"]],
    ["dashboard", ["mode3", "joinButton"]],
    ["dashboard", ["mode3", "waitingForParticipants"]],
    ["dashboard", ["mode3", "confirmButton"]],
    ["dashboard", ["mode3", "fundNotice"]],
    ["dashboard", ["mode3", "resolved", "title"]],
    ["dashboard", ["mode3", "resolved", "fatherLabel"]],
    ["dashboard", ["mode3", "resolved", "rewardInfo"]],
    ["dashboard", ["mode3", "resolved", "noFather"]],
    ["dashboard", ["mode3", "error", "rejected"]],
    ["dashboard", ["mode3", "error", "failed"]],
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
