// Deterministic i18n locale adder for help terms (?/! InfoProposalIcons)
// Deep-merges new keys (nested objects, matching how i18next resolves
// dot-notation t() keys), validates all 33 locales, prints
// ALL 33 LOCALES VALID on success.
//
// Natural translations are provided for Tier 1 languages
// (uk de fr es pt ja ko zh ar vi hi tr th id ms ru); all other
// locales fall back to English (repo Tier 2 convention).

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, "..", "src", "i18n", "locales");

// English source (nested, mirrors the i18n key paths used by t()).
const EN = {
  help: {
    aria: {
      info: "Info tooltip",
      suggest: "Suggest improvement",
    },
    unknownTerm: "Unknown help term",
    home: {
      filters: {
        skinColor: {
          title: "Filter by skin color declared in profiles",
          body: "Choose a skin tone to narrow matching results",
        },
        lookingFor: {
          title: "Filter by who you are looking for",
          body: "Select relationship preference to refine matches",
        },
        testingPreference: {
          title: "Filter by STD testing status",
          body: "Show only profiles with verified STD test results",
        },
        gender: {
          title: "Filter by gender declared in profile",
          body: "Narrow matches based on gender information",
        },
      },
    },
    chat: {
      proposals: {
        title: "Proposal voting board",
        body: "View and vote on community suggestions",
      },
    },
    mode2: {
      dashboard: {
        title: "Pregnancy bond mode",
        body: "Manage pregnancy-related features and bonding",
      },
    },
    mode3: {
      dashboard: {
        title: "Cryptic choice mode",
        body: "Anonymous selection process for father",
      },
    },
    profile: {
      sections: {
        lab: {
          title: "Lab test results",
          body: "View verified STD testing status",
        },
        modeSelector: {
          title: "Mode selector",
          body: "Switch between search modes",
        },
        profileEdit: {
          title: "Profile editing",
          body: "Edit your profile information",
        },
      },
    },
  },
  suggestions: {
    title: "Suggest an improvement",
    placeholder: "Describe your suggestion...",
    cancel: "Cancel",
    submit: "Submit",
    submitting: "Submitting...",
    saved: "Suggestion saved",
    defaultTitle: "New suggestion about {{term}}",
  },
  proposals: {
    sourceLabel: "Source: {{source}}",
  },
};

// Natural translations for Tier 1 languages.
const NATURAL = {
  uk: {
    help: {
      aria: {
        info: "Підказка",
        suggest: "Запропонувати покращення",
      },
      unknownTerm: "Невідомий термін",
      home: {
        filters: {
          skinColor: {
            title: "Фільтр за кольором шкіри, вказаним у профілях",
            body: "Оберіть тон шкіри, щоб звузити результати пошуку",
          },
          lookingFor: {
            title: "Фільтр за тим, кого ви шукаєте",
            body: "Оберіть бажані стосунки, щоб уточнити збіги",
          },
          testingPreference: {
            title: "Фільтр за статусом STD-тестування",
            body: "Показати лише профілі з підтвердженими результатами STD-аналізів",
          },
          gender: {
            title: "Фільтр за статтю, вказаною в профілі",
            body: "Звузьте результати на основі інформації про стать",
          },
        },
      },
      chat: {
        proposals: {
          title: "Дошка голосування за пропозиції",
          body: "Переглядайте та голосуйте за пропозиції спільноти",
        },
      },
      mode2: {
        dashboard: {
          title: "Режим вагітності (bond)",
          body: "Управління функціями, пов'язаними з вагітністю та зв'язком",
        },
      },
      mode3: {
        dashboard: {
          title: "Режим криптік-чойс",
          body: "Анонімний процес вибору батька",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "Результати лабораторних аналізів",
            body: "Перегляд підтвердженого статусу STD-тестування",
          },
          modeSelector: {
            title: "Вибір режиму пошуку",
            body: "Перемикання між режимами пошуку",
          },
          profileEdit: {
            title: "Редагування профілю",
            body: "Редагування інформації вашого профілю",
          },
        },
      },
    },
    suggestions: {
      title: "Запропонувати покращення",
      placeholder: "Опишіть вашу пропозицію…",
      cancel: "Скасувати",
      submit: "Надіслати",
      submitting: "Надсилання…",
      saved: "Пропозицію збережено",
      defaultTitle: "Нова пропозиція про {{term}}",
    },
    proposals: {
      sourceLabel: "Джерело: {{source}}",
    },
  },
  ru: {
    help: {
      aria: {
        info: "Подсказка",
        suggest: "Предложить улучшение",
      },
      unknownTerm: "Неизвестный термин",
      home: {
        filters: {
          skinColor: {
            title: "Фильтр по цвету кожи, указанному в профилях",
            body: "Выберите тон кожи, чтобы сузить результаты поиска",
          },
          lookingFor: {
            title: "Фильтр по тому, кого вы ищете",
            body: "Выберите предпочтения в отношениях, чтобы уточнить совпадения",
          },
          testingPreference: {
            title: "Фильтр по статусу STD-тестирования",
            body: "Показать только профили с подтверждёнными результатами STD-анализов",
          },
          gender: {
            title: "Фильтр по полу, указанному в профиле",
            body: "Сузьте результаты на основе информации о поле",
          },
        },
      },
      chat: {
        proposals: {
          title: "Доска голосования за предложения",
          body: "Просматривайте и голосуйте за предложения сообщества",
        },
      },
      mode2: {
        dashboard: {
          title: "Режим беременности (bond)",
          body: "Управление функциями, связанными с беременностью и связью",
        },
      },
      mode3: {
        dashboard: {
          title: "Режим криптик-чойс",
          body: "Анонимный процесс выбора отца",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "Результаты лабораторных анализов",
            body: "Просмотр подтверждённого статуса STD-тестирования",
          },
          modeSelector: {
            title: "Выбор режима поиска",
            body: "Переключение между режимами поиска",
          },
          profileEdit: {
            title: "Редактирование профиля",
            body: "Редактирование информации вашего профиля",
          },
        },
      },
    },
    suggestions: {
      title: "Предложить улучшение",
      placeholder: "Опишите ваше предложение…",
      cancel: "Отмена",
      submit: "Отправить",
      submitting: "Отправка…",
      saved: "Предложение сохранено",
      defaultTitle: "Новое предложение о {{term}}",
    },
    proposals: {
      sourceLabel: "Источник: {{source}}",
    },
  },
  de: {
    help: {
      aria: {
        info: "Info-Tooltip",
        suggest: "Verbesserung vorschlagen",
      },
      unknownTerm: "Unbekannter Begriff",
      home: {
        filters: {
          skinColor: {
            title: "Nach Hautfarbe filtern (aus Profilen)",
            body: "Wählen Sie einen Hautton, um Ergebnisse einzugrenzen",
          },
          lookingFor: {
            title: "Danach filtern, wen Sie suchen",
            body: "Beziehungspräferenz wählen, um Treffer zu verfeinern",
          },
          testingPreference: {
            title: "Nach STD-Teststatus filtern",
            body: "Nur Profile mit bestätigten STD-Testergebnissen anzeigen",
          },
          gender: {
            title: "Nach Geschlecht im Profil filtern",
            body: "Ergebnisse anhand der Geschlechtsangabe eingrenzen",
          },
        },
      },
      chat: {
        proposals: {
          title: "Vorschlags-Abstimmungstafel",
          body: "Community-Vorschläge ansehen und abstimmen",
        },
      },
      mode2: {
        dashboard: {
          title: "Schwangerschafts-Bond-Modus",
          body: "Schwangerschaftsfunktionen und Bindung verwalten",
        },
      },
      mode3: {
        dashboard: {
          title: "Kryptische-Wahl-Modus",
          body: "Anonymer Auswahlprozess für den Vater",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "Laborergebnisse",
            body: "Bestätigten STD-Teststatus ansehen",
          },
          modeSelector: {
            title: "Modusauswahl",
            body: "Zwischen Suchmodi wechseln",
          },
          profileEdit: {
            title: "Profil bearbeiten",
            body: "Profilinformationen bearbeiten",
          },
        },
      },
    },
    suggestions: {
      title: "Verbesserung vorschlagen",
      placeholder: "Beschreiben Sie Ihren Vorschlag…",
      cancel: "Abbrechen",
      submit: "Absenden",
      submitting: "Wird gesendet…",
      saved: "Vorschlag gespeichert",
      defaultTitle: "Neuer Vorschlag zu {{term}}",
    },
    proposals: {
      sourceLabel: "Quelle: {{source}}",
    },
  },
  fr: {
    help: {
      aria: {
        info: "Info-bulle",
        suggest: "Suggérer une amélioration",
      },
      unknownTerm: "Terme inconnu",
      home: {
        filters: {
          skinColor: {
            title: "Filtrer par couleur de peau déclarée",
            body: "Choisissez un teint pour affiner les résultats",
          },
          lookingFor: {
            title: "Filtrer par personne recherchée",
            body: "Sélectionnez une préférence relationnelle pour affiner",
          },
          testingPreference: {
            title: "Filtrer par statut de test MST",
            body: "Afficher uniquement les profils avec résultats vérifiés",
          },
          gender: {
            title: "Filtrer par genre déclaré",
            body: "Réduire les résultats selon le genre",
          },
        },
      },
      chat: {
        proposals: {
          title: "Tableau de vote des propositions",
          body: "Consultez et votez les suggestions de la communauté",
        },
      },
      mode2: {
        dashboard: {
          title: "Mode lien de grossesse",
          body: "Gérer les fonctions liées à la grossesse et au lien",
        },
      },
      mode3: {
        dashboard: {
          title: "Mode choix cryptique",
          body: "Processus de sélection anonyme du père",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "Résultats de laboratoire",
            body: "Consulter le statut de test MST vérifié",
          },
          modeSelector: {
            title: "Sélecteur de mode",
            body: "Basculer entre les modes de recherche",
          },
          profileEdit: {
            title: "Édition du profil",
            body: "Modifier les informations de votre profil",
          },
        },
      },
    },
    suggestions: {
      title: "Suggérer une amélioration",
      placeholder: "Décrivez votre suggestion…",
      cancel: "Annuler",
      submit: "Envoyer",
      submitting: "Envoi…",
      saved: "Suggestion enregistrée",
      defaultTitle: "Nouvelle suggestion à propos de {{term}}",
    },
    proposals: {
      sourceLabel: "Source : {{source}}",
    },
  },
  es: {
    help: {
      aria: {
        info: "Información",
        suggest: "Sugerir mejora",
      },
      unknownTerm: "Término desconocido",
      home: {
        filters: {
          skinColor: {
            title: "Filtrar por color de piel declarado",
            body: "Elija un tono para reducir resultados",
          },
          lookingFor: {
            title: "Filtrar por quién busca",
            body: "Seleccione una preferencia para refinar coincidencias",
          },
          testingPreference: {
            title: "Filtrar por estado de pruebas ETS",
            body: "Mostrar solo perfiles con resultados ETS verificados",
          },
          gender: {
            title: "Filtrar por género declarado",
            body: "Reducir resultados según el género",
          },
        },
      },
      chat: {
        proposals: {
          title: "Tablero de votación de propuestas",
          body: "Vea y vote las sugerencias de la comunidad",
        },
      },
      mode2: {
        dashboard: {
          title: "Modo vínculo de embarazo",
          body: "Gestione funciones de embarazo y vinculación",
        },
      },
      mode3: {
        dashboard: {
          title: "Modo elección críptica",
          body: "Proceso anónimo de selección del padre",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "Resultados de laboratorio",
            body: "Consulte el estado ETS verificado",
          },
          modeSelector: {
            title: "Selector de modo",
            body: "Cambie entre modos de búsqueda",
          },
          profileEdit: {
            title: "Edición de perfil",
            body: "Edite la información de su perfil",
          },
        },
      },
    },
    suggestions: {
      title: "Sugerir una mejora",
      placeholder: "Describa su sugerencia…",
      cancel: "Cancelar",
      submit: "Enviar",
      submitting: "Enviando…",
      saved: "Sugerencia guardada",
      defaultTitle: "Nueva sugerencia sobre {{term}}",
    },
    proposals: {
      sourceLabel: "Fuente: {{source}}",
    },
  },
  pt: {
    help: {
      aria: {
        info: "Dica",
        suggest: "Sugerir melhoria",
      },
      unknownTerm: "Termo desconhecido",
      home: {
        filters: {
          skinColor: {
            title: "Filtrar pela cor de pele declarada",
            body: "Escolha um tom para refinar os resultados",
          },
          lookingFor: {
            title: "Filtrar por quem você procura",
            body: "Selecione uma preferência para refinar correspondências",
          },
          testingPreference: {
            title: "Filtrar por status de teste DST",
            body: "Mostrar apenas perfis com resultados DST verificados",
          },
          gender: {
            title: "Filtrar por gênero declarado",
            body: "Reduzir resultados com base no gênero",
          },
        },
      },
      chat: {
        proposals: {
          title: "Quadro de votação de propostas",
          body: "Veja e vote nas sugestões da comunidade",
        },
      },
      mode2: {
        dashboard: {
          title: "Modo vínculo de gravidez",
          body: "Gerencie recursos de gravidez e vínculo",
        },
      },
      mode3: {
        dashboard: {
          title: "Modo escolha críptica",
          body: "Processo anônimo de seleção do pai",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "Resultados de laboratório",
            body: "Consulte o status DST verificado",
          },
          modeSelector: {
            title: "Seletor de modo",
            body: "Alternar entre modos de busca",
          },
          profileEdit: {
            title: "Edição de perfil",
            body: "Edite as informações do seu perfil",
          },
        },
      },
    },
    suggestions: {
      title: "Sugerir uma melhoria",
      placeholder: "Descreva sua sugestão…",
      cancel: "Cancelar",
      submit: "Enviar",
      submitting: "Enviando…",
      saved: "Sugestão salva",
      defaultTitle: "Nova sugestão sobre {{term}}",
    },
    proposals: {
      sourceLabel: "Origem: {{source}}",
    },
  },
  ja: {
    help: {
      aria: {
        info: "情報ツールチップ",
        suggest: "改善を提案",
      },
      unknownTerm: "不明な用語",
      home: {
        filters: {
          skinColor: {
            title: "プロフィールの肌の色で絞り込み",
            body: "肌のトーンを選んでマッチング結果を絞り込みます",
          },
          lookingFor: {
            title: "探している相手で絞り込み",
            body: "関係性の希望を選んでマッチを絞り込みます",
          },
          testingPreference: {
            title: "STD検査ステータスで絞り込み",
            body: "検証済みのSTD検査結果を持つプロフィールのみ表示",
          },
          gender: {
            title: "プロフィールの性別で絞り込み",
            body: "性別情報に基づいてマッチを絞り込みます",
          },
        },
      },
      chat: {
        proposals: {
          title: "提案投票ボード",
          body: "コミュニティの提案を表示して投票",
        },
      },
      mode2: {
        dashboard: {
          title: "妊娠ボンドモード",
          body: "妊娠関連機能とボンドを管理",
        },
      },
      mode3: {
        dashboard: {
          title: "クリプティックチョイスモード",
          body: "父親の匿名選択プロセス",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "検査結果",
            body: "検証済みSTD検査ステータスを表示",
          },
          modeSelector: {
            title: "モードセレクター",
            body: "検索モードを切り替え",
          },
          profileEdit: {
            title: "プロフィール編集",
            body: "プロフィール情報を編集",
          },
        },
      },
    },
    suggestions: {
      title: "改善を提案",
      placeholder: "提案内容を記入…",
      cancel: "キャンセル",
      submit: "送信",
      submitting: "送信中…",
      saved: "提案を保存しました",
      defaultTitle: "{{term}}に関する新しい提案",
    },
    proposals: {
      sourceLabel: "ソース: {{source}}",
    },
  },
  ko: {
    help: {
      aria: {
        info: "정보 툴팁",
        suggest: "개선 제안",
      },
      unknownTerm: "알 수 없는 용어",
      home: {
        filters: {
          skinColor: {
            title: "프로필에 표시된 피부색으로 필터링",
            body: "피부톤을 선택하여 매칭 결과를 좁힙니다",
          },
          lookingFor: {
            title: "찾는 대상을 기준으로 필터링",
            body: "관계 선호도를 선택하여 매치를 다듬습니다",
          },
          testingPreference: {
            title: "STD 검사 상태로 필터링",
            body: "검증된 STD 검사 결과가 있는 프로필만 표시",
          },
          gender: {
            title: "프로필에 표시된 성별로 필터링",
            body: "성별 정보를 기반으로 매치를 좁힙니다",
          },
        },
      },
      chat: {
        proposals: {
          title: "제안 투표 보드",
          body: "커뮤니티 제안을 보고 투표하세요",
        },
      },
      mode2: {
        dashboard: {
          title: "임신 본드 모드",
          body: "임신 관련 기능과 본드를 관리",
        },
      },
      mode3: {
        dashboard: {
          title: "크립틱 초이스 모드",
          body: "아버지 익명 선택 프로세스",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "검사소 결과",
            body: "검증된 STD 검사 상태 보기",
          },
          modeSelector: {
            title: "모드 선택기",
            body: "검색 모드 간 전환",
          },
          profileEdit: {
            title: "프로필 편집",
            body: "프로필 정보 편집",
          },
        },
      },
    },
    suggestions: {
      title: "개선 제안",
      placeholder: "제안 내용을 설명하세요…",
      cancel: "취소",
      submit: "제출",
      submitting: "제출 중…",
      saved: "제안이 저장되었습니다",
      defaultTitle: "{{term}}에 대한 새 제안",
    },
    proposals: {
      sourceLabel: "출처: {{source}}",
    },
  },
  zh: {
    help: {
      aria: {
        info: "信息提示",
        suggest: "建议改进",
      },
      unknownTerm: "未知术语",
      home: {
        filters: {
          skinColor: {
            title: "按资料中的肤色筛选",
            body: "选择肤色以缩小匹配结果",
          },
          lookingFor: {
            title: "按寻找对象筛选",
            body: "选择关系偏好以优化匹配",
          },
          testingPreference: {
            title: "按STD检测状态筛选",
            body: "仅显示已验证STD检测结果的资料",
          },
          gender: {
            title: "按资料中的性别筛选",
            body: "根据性别信息缩小匹配范围",
          },
        },
      },
      chat: {
        proposals: {
          title: "提案投票板",
          body: "查看并投票社区建议",
        },
      },
      mode2: {
        dashboard: {
          title: "孕期绑定模式",
          body: "管理孕期相关功能与绑定",
        },
      },
      mode3: {
        dashboard: {
          title: "隐晦选择模式",
          body: "匿名选择父亲的过程",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "检测结果",
            body: "查看已验证的STD检测状态",
          },
          modeSelector: {
            title: "模式选择器",
            body: "在搜索模式间切换",
          },
          profileEdit: {
            title: "资料编辑",
            body: "编辑您的资料信息",
          },
        },
      },
    },
    suggestions: {
      title: "建议改进",
      placeholder: "描述您的建议…",
      cancel: "取消",
      submit: "提交",
      submitting: "提交中…",
      saved: "建议已保存",
      defaultTitle: "关于{{term}}的新建议",
    },
    proposals: {
      sourceLabel: "来源：{{source}}",
    },
  },
  ar: {
    help: {
      aria: {
        info: "تلميح معلومات",
        suggest: "اقتراح تحسين",
      },
      unknownTerm: "مصطلح غير معروف",
      home: {
        filters: {
          skinColor: {
            title: "التصفية حسب لون البشرة المعلن",
            body: "اختر درجة لون لتضييق نتائج المطابقة",
          },
          lookingFor: {
            title: "التصفية حسب من تبحث عنه",
            body: "اختر تفضيل العلاقة لتحسين النتائج",
          },
          testingPreference: {
            title: "التصفية حسب حالة فحص الأمراض المنقولة",
            body: "إظهار الملفات ذات النتائج الموثقة فقط",
          },
          gender: {
            title: "التصفية حسب الجنس المعلن",
            body: "تضييق النتائج بناءً على الجنس",
          },
        },
      },
      chat: {
        proposals: {
          title: "لوحة التصويت على المقترحات",
          body: "عرض والتصويت على اقتراحات المجتمع",
        },
      },
      mode2: {
        dashboard: {
          title: "وضع رابطة الحمل",
          body: "إدارة ميزات الحمل والترابط",
        },
      },
      mode3: {
        dashboard: {
          title: "وضع الاختيار الغامض",
          body: "عملية اختيار الأب بشكل مجهول",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "نتائج المختبر",
            body: "عرض حالة فحص الأمراض المنقولة الموثقة",
          },
          modeSelector: {
            title: "محدد الوضع",
            body: "التبديل بين أوضاع البحث",
          },
          profileEdit: {
            title: "تحرير الملف الشخصي",
            body: "تحرير معلومات ملفك الشخصي",
          },
        },
      },
    },
    suggestions: {
      title: "اقتراح تحسين",
      placeholder: "صف اقتراحك…",
      cancel: "إلغاء",
      submit: "إرسال",
      submitting: "جارٍ الإرسال…",
      saved: "تم حفظ الاقتراح",
      defaultTitle: "اقتراح جديد حول {{term}}",
    },
    proposals: {
      sourceLabel: "المصدر: {{source}}",
    },
  },
  vi: {
    help: {
      aria: {
        info: "Chú giải thông tin",
        suggest: "Đề xuất cải tiến",
      },
      unknownTerm: "Thuật ngữ không xác định",
      home: {
        filters: {
          skinColor: {
            title: "Lọc theo màu da khai báo",
            body: "Chọn tông màu để thu hẹp kết quả",
          },
          lookingFor: {
            title: "Lọc theo người bạn đang tìm",
            body: "Chọn sở thích quan hệ để tinh chỉnh kết quả",
          },
          testingPreference: {
            title: "Lọc theo trạng thái xét nghiệm STD",
            body: "Chỉ hiện hồ sơ có kết quả STD đã xác minh",
          },
          gender: {
            title: "Lọc theo giới tính khai báo",
            body: "Thu hẹp kết quả dựa trên giới tính",
          },
        },
      },
      chat: {
        proposals: {
          title: "Bảng bỏ phiếu đề xuất",
          body: "Xem và bỏ phiếu cho đề xuất cộng đồng",
        },
      },
      mode2: {
        dashboard: {
          title: "Chế độ liên kết thai kỳ",
          body: "Quản lý tính năng thai kỳ và liên kết",
        },
      },
      mode3: {
        dashboard: {
          title: "Chế độ lựa chọn ẩn danh",
          body: "Quy trình chọn cha ẩn danh",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "Kết quả xét nghiệm",
            body: "Xem trạng thái STD đã xác minh",
          },
          modeSelector: {
            title: "Bộ chọn chế độ",
            body: "Chuyển đổi giữa các chế độ tìm kiếm",
          },
          profileEdit: {
            title: "Chỉnh sửa hồ sơ",
            body: "Chỉnh sửa thông tin hồ sơ của bạn",
          },
        },
      },
    },
    suggestions: {
      title: "Đề xuất cải tiến",
      placeholder: "Mô tả đề xuất của bạn…",
      cancel: "Hủy",
      submit: "Gửi",
      submitting: "Đang gửi…",
      saved: "Đã lưu đề xuất",
      defaultTitle: "Đề xuất mới về {{term}}",
    },
    proposals: {
      sourceLabel: "Nguồn: {{source}}",
    },
  },
  hi: {
    help: {
      aria: {
        info: "सूचना टूलटिप",
        suggest: "सुधार सुझाएं",
      },
      unknownTerm: "अज्ञात शब्द",
      home: {
        filters: {
          skinColor: {
            title: "प्रोफ़ाइल में दर्शाए गए त्वचा के रंग से फ़िल्टर करें",
            body: "परिणामों को सीमित करने के लिए त्वचा टोन चुनें",
          },
          lookingFor: {
            title: "आप जिसे खोज रहे हैं उससे फ़िल्टर करें",
            body: "मिलान परिष्कृत करने के लिए संबंध पसंद चुनें",
          },
          testingPreference: {
            title: "STD परीक्षण स्थिति से फ़िल्टर करें",
            body: "केवल सत्यापित STD परिणाम वाले प्रोफ़ाइल दिखाएं",
          },
          gender: {
            title: "प्रोफ़ाइल में दर्शाए गए लिंग से फ़िल्टर करें",
            body: "लिंग जानकारी के आधार पर परिणाम सीमित करें",
          },
        },
      },
      chat: {
        proposals: {
          title: "प्रस्ताव मतदान बोर्ड",
          body: "समुदाय सुझाव देखें और मतदान करें",
        },
      },
      mode2: {
        dashboard: {
          title: "गर्भावस्था बॉन्ड मोड",
          body: "गर्भावस्था सुविधाएं और बॉन्ड प्रबंधित करें",
        },
      },
      mode3: {
        dashboard: {
          title: "रहस्यमय विकल्प मोड",
          body: "पिता के लिए गुमनाम चयन प्रक्रिया",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "प्रयोगशाला परिणाम",
            body: "सत्यापित STD परीक्षण स्थिति देखें",
          },
          modeSelector: {
            title: "मोड चयनकर्ता",
            body: "खोज मोड के बीच स्विच करें",
          },
          profileEdit: {
            title: "प्रोफ़ाइल संपादन",
            body: "अपनी प्रोफ़ाइल जानकारी संपादित करें",
          },
        },
      },
    },
    suggestions: {
      title: "सुधार सुझाएं",
      placeholder: "अपना सुझाव लिखें…",
      cancel: "रद्द करें",
      submit: "जमा करें",
      submitting: "जमा हो रहा है…",
      saved: "सुझाव सहेजा गया",
      defaultTitle: "{{term}} के बारे में नया सुझाव",
    },
    proposals: {
      sourceLabel: "स्रोत: {{source}}",
    },
  },
  tr: {
    help: {
      aria: {
        info: "Bilgi ipucu",
        suggest: "İyileştirme öner",
      },
      unknownTerm: "Bilinmeyen terim",
      home: {
        filters: {
          skinColor: {
            title: "Profillerdeki cilt rengine göre filtrele",
            body: "Sonuçları daraltmak için bir cilt tonu seçin",
          },
          lookingFor: {
            title: "Aradığınız kişiye göre filtrele",
            body: "Eşleşmeleri iyileştirmek için ilişki tercihi seçin",
          },
          testingPreference: {
            title: "STD test durumuna göre filtrele",
            body: "Yalnızca doğrulanmış STD sonuçları olan profilleri göster",
          },
          gender: {
            title: "Profildeki cinsiyete göre filtrele",
            body: "Cinsiyet bilgisine göre sonuçları daraltın",
          },
        },
      },
      chat: {
        proposals: {
          title: "Teklif oylama panosu",
          body: "Topluluk önerilerini görüntüleyin ve oylayın",
        },
      },
      mode2: {
        dashboard: {
          title: "Hamilelik bağ modu",
          body: "Hamilelik özelliklerini ve bağlanmayı yönetin",
        },
      },
      mode3: {
        dashboard: {
          title: "Gizemli seçim modu",
          body: "Baba için anonim seçim süreci",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "Laboratuvar sonuçları",
            body: "Doğrulanmış STD test durumunu görüntüleyin",
          },
          modeSelector: {
            title: "Mod seçici",
            body: "Arama modları arasında geçiş yapın",
          },
          profileEdit: {
            title: "Profil düzenleme",
            body: "Profil bilgilerinizi düzenleyin",
          },
        },
      },
    },
    suggestions: {
      title: "Bir iyileştirme önerin",
      placeholder: "Önerinizi açıklayın…",
      cancel: "İptal",
      submit: "Gönder",
      submitting: "Gönderiliyor…",
      saved: "Öneri kaydedildi",
      defaultTitle: "{{term}} hakkında yeni öneri",
    },
    proposals: {
      sourceLabel: "Kaynak: {{source}}",
    },
  },
  th: {
    help: {
      aria: {
        info: "คำแนะนำข้อมูล",
        suggest: "เสนอการปรับปรุง",
      },
      unknownTerm: "คำที่ไม่รู้จัก",
      home: {
        filters: {
          skinColor: {
            title: "กรองตามสีผิวที่ระบุในโปรไฟล์",
            body: "เลือกโทนผิวเพื่อจำกัดผลลัพธ์",
          },
          lookingFor: {
            title: "กรองตามคนที่คุณกำลังมองหา",
            body: "เลือกความต้องการความสัมพันธ์เพื่อปรับแต่งผลลัพธ์",
          },
          testingPreference: {
            title: "กรองตามสถานะการตรวจ STD",
            body: "แสดงเฉพาะโปรไฟล์ที่มีผล STD ที่ยืนยันแล้ว",
          },
          gender: {
            title: "กรองตามเพศที่ระบุในโปรไฟล์",
            body: "จำกัดผลลัพธ์ตามข้อมูลเพศ",
          },
        },
      },
      chat: {
        proposals: {
          title: "กระดานโหวตข้อเสนอ",
          body: "ดูและโหวตข้อเสนอของชุมชน",
        },
      },
      mode2: {
        dashboard: {
          title: "โหมดพันธะการตั้งครรภ์",
          body: "จัดการฟีเจอร์การตั้งครรภ์และพันธะ",
        },
      },
      mode3: {
        dashboard: {
          title: "โหมดเลือกแบบไม่เปิดเผย",
          body: "กระบวนการเลือกพ่อแบบไม่เปิดเผยตัวตน",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "ผลตรวจทางห้องปฏิบัติการ",
            body: "ดูสถานะการตรวจ STD ที่ยืนยันแล้ว",
          },
          modeSelector: {
            title: "ตัวเลือกโหมด",
            body: "สลับระหว่างโหมดการค้นหา",
          },
          profileEdit: {
            title: "แก้ไขโปรไฟล์",
            body: "แก้ไขข้อมูลโปรไฟล์ของคุณ",
          },
        },
      },
    },
    suggestions: {
      title: "เสนอการปรับปรุง",
      placeholder: "อธิบายข้อเสนอของคุณ…",
      cancel: "ยกเลิก",
      submit: "ส่ง",
      submitting: "กำลังส่ง…",
      saved: "บันทึกข้อเสนอแล้ว",
      defaultTitle: "ข้อเสนอใหม่เกี่ยวกับ {{term}}",
    },
    proposals: {
      sourceLabel: "แหล่งที่มา: {{source}}",
    },
  },
  id: {
    help: {
      aria: {
        info: "Info tooltip",
        suggest: "Sarankan perbaikan",
      },
      unknownTerm: "Istilah tidak dikenal",
      home: {
        filters: {
          skinColor: {
            title: "Filter berdasarkan warna kulit di profil",
            body: "Pilih warna kulit untuk mempersempit hasil",
          },
          lookingFor: {
            title: "Filter berdasarkan yang Anda cari",
            body: "Pilih preferensi hubungan untuk menyempurnakan kecocokan",
          },
          testingPreference: {
            title: "Filter berdasarkan status tes STD",
            body: "Tampilkan hanya profil dengan hasil STD terverifikasi",
          },
          gender: {
            title: "Filter berdasarkan gender di profil",
            body: "Persempit hasil berdasarkan gender",
          },
        },
      },
      chat: {
        proposals: {
          title: "Papan pemungutan suara proposal",
          body: "Lihat dan pilih saran komunitas",
        },
      },
      mode2: {
        dashboard: {
          title: "Mode ikatan kehamilan",
          body: "Kelola fitur kehamilan dan ikatan",
        },
      },
      mode3: {
        dashboard: {
          title: "Mode pilihan samar",
          body: "Proses pemilihan ayah secara anonim",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "Hasil laboratorium",
            body: "Lihat status tes STD terverifikasi",
          },
          modeSelector: {
            title: "Pemilih mode",
            body: "Beralih antar mode pencarian",
          },
          profileEdit: {
            title: "Pengeditan profil",
            body: "Edit informasi profil Anda",
          },
        },
      },
    },
    suggestions: {
      title: "Sarankan perbaikan",
      placeholder: "Jelaskan saran Anda…",
      cancel: "Batal",
      submit: "Kirim",
      submitting: "Mengirim…",
      saved: "Saran disimpan",
      defaultTitle: "Saran baru tentang {{term}}",
    },
    proposals: {
      sourceLabel: "Sumber: {{source}}",
    },
  },
  ms: {
    help: {
      aria: {
        info: "Tip maklumat",
        suggest: "Cadangkan penambahbaikan",
      },
      unknownTerm: "Istilah tidak diketahui",
      home: {
        filters: {
          skinColor: {
            title: "Tapis mengikut warna kulit dalam profil",
            body: "Pilih ton kulit untuk mengecilkan hasil",
          },
          lookingFor: {
            title: "Tapis mengikut siapa yang anda cari",
            body: "Pilih keutamaan hubungan untuk memperhalus padanan",
          },
          testingPreference: {
            title: "Tapis mengikut status ujian STD",
            body: "Paparkan hanya profil dengan keputusan STD disahkan",
          },
          gender: {
            title: "Tapis mengikut jantina dalam profil",
            body: "Kecilkan hasil berdasarkan jantina",
          },
        },
      },
      chat: {
        proposals: {
          title: "Papan undian cadangan",
          body: "Lihat dan undi cadangan komuniti",
        },
      },
      mode2: {
        dashboard: {
          title: "Mod ikatan kehamilan",
          body: "Urus ciri berkaitan kehamilan dan ikatan",
        },
      },
      mode3: {
        dashboard: {
          title: "Mod pilihan samar",
          body: "Proses pemilihan bapa secara tanpa nama",
        },
      },
      profile: {
        sections: {
          lab: {
            title: "Keputusan makmal",
            body: "Lihat status ujian STD yang disahkan",
          },
          modeSelector: {
            title: "Pemilih mod",
            body: "Tukar antara mod carian",
          },
          profileEdit: {
            title: "Pengeditan profil",
            body: "Edit maklumat profil anda",
          },
        },
      },
    },
    suggestions: {
      title: "Cadangkan penambahbaikan",
      placeholder: "Terangkan cadangan anda…",
      cancel: "Batal",
      submit: "Hantar",
      submitting: "Menghantar…",
      saved: "Cadangan disimpan",
      defaultTitle: "Cadangan baharu tentang {{term}}",
    },
    proposals: {
      sourceLabel: "Sumber: {{source}}",
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
    ["help", ["aria", "info"]],
    ["help", ["aria", "suggest"]],
    ["help", ["unknownTerm"]],
    ["help", ["home", "filters", "skinColor", "title"]],
    ["help", ["home", "filters", "lookingFor", "body"]],
    ["help", ["home", "filters", "testingPreference", "title"]],
    ["help", ["home", "filters", "gender", "body"]],
    ["help", ["chat", "proposals", "title"]],
    ["help", ["mode2", "dashboard", "body"]],
    ["help", ["mode3", "dashboard", "title"]],
    ["help", ["profile", "sections", "lab", "body"]],
    ["help", ["profile", "sections", "modeSelector", "title"]],
    ["help", ["profile", "sections", "profileEdit", "body"]],
    ["suggestions", ["title"]],
    ["suggestions", ["placeholder"]],
    ["suggestions", ["submit"]],
    ["suggestions", ["defaultTitle"]],
    ["proposals", ["sourceLabel"]],
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
