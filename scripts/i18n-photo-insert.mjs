/* eslint-disable */
/**
 * One-off script: inserts photo-blur/onboarding i18n keys into all 33 locale files.
 * Tier 1 (natural translations): uk, de, fr, es, pt, ja, ar, vi, zh-TW
 * Tier 2 (English + local description): all others
 * Run from repo root: node scripts/i18n-photo-insert.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const LOCALES_DIR = "C:/CFC/apps/web/src/i18n/locales";

const EN = {
  onboarding: {
    title: "Complete your profile",
    subtitle: "Tell others a little about yourself",
    age: {
      title: "Your age",
      label: "Age",
      hide: "Hide my age",
      hideHint: "Your age will not be shown to other users",
    },
    languages: {
      title: "Languages",
      hint: "Select the languages you speak",
    },
    bio: {
      title: "About me",
      label: "About me",
      placeholder: "Tell a little about yourself, hobbies, what you are looking for...",
    },
    photo: {
      title: "Your photo",
      upload: "Upload photo",
      change: "Change photo",
      preview: "Photo preview",
      blur: "Blur my photo",
      blurHint: "Others will only see a blurred preview until you grant access",
      invalidType: "Please choose an image file",
      readError: "Could not read the image. Try another file.",
    },
    back: "Back",
    next: "Next",
    skip: "Skip for now",
    saving: "Saving…",
    finish: "Finish",
  },
  photo: {
    request: "Request photo view",
    tempView: "Visible for {{seconds}} s",
    accessPermanent: "You have permanent access to this photo",
    accessTemporary: "You have temporary access to this photo",
    accessNone: "Blurred photo — request access to view",
    pendingRequest: "Photo view request pending:",
    approveTemporary: "Approve 15 s",
    approvePermanent: "Approve permanently",
    deny: "Deny",
    offerTitle: "Offer my photo:",
    offerTemporary: "Offer 15 s",
    offerPermanent: "Offer permanently",
    revoke: "Revoke access",
    viewOffer: "View photo",
    hide: "Hide photo",
  },
  chat: {
    requestPhoto: "Requests to view your photo",
    photoApprovedPermanent: "Photo access granted permanently",
    photoApprovedTemporary: "Photo access granted for 15 seconds",
    photoDenied: "Photo access request declined",
    photoOfferPermanent: "Offers permanent photo access",
    photoOfferTemporary: "Offers a 15-second photo view",
    photoRevoked: "Photo access revoked",
  },
  userProfile: { ageHidden: "age hidden" },
  profile: {
    edit: {
      title: "My profile info",
      photoAlt: "My photo",
      changePhoto: "Change photo",
      uploadPhoto: "Upload photo",
      blurPhoto: "Blur my photo",
      age: "Age",
      hideAge: "Hide my age",
      languages: "Languages I speak",
      bio: "About me",
      save: "Save changes",
      saving: "Saving…",
      saved: "Profile saved",
    },
    photoGrants: {
      title: "Photo access",
      description: "Users you granted photo access to:",
      permanent: "Permanent access",
      temporary: "Temporary access",
      revoke: "Revoke",
    },
  },
};

/** Tier 1 — full natural translations. */
const TIER1 = {
  uk: {
    onboarding: {
      title: "Заповніть свій профіль",
      subtitle: "Розкажіть трохи про себе іншим",
      age: { title: "Ваш вік", label: "Вік", hide: "Приховати мій вік", hideHint: "Ваш вік не буде видно іншим користувачам" },
      languages: { title: "Мови", hint: "Оберіть мови, якими ви спілкуєтесь" },
      bio: { title: "Про себе", label: "Про себе", placeholder: "Розкажіть трохи про себе, захоплення, що шукаєте..." },
      photo: { title: "Ваше фото", upload: "Завантажити фото", change: "Змінити фото", preview: "Попередній перегляд фото", blur: "Заблюрити моє фото", blurHint: "Інші бачитимуть лише розмите фото, поки ви не надасте доступ", invalidType: "Оберіть файл зображення", readError: "Не вдалося прочитати зображення. Спробуйте інший файл." },
      back: "Назад", next: "Далі", skip: "Пропустити", saving: "Збереження…", finish: "Готово",
    },
    photo: {
      request: "Запросити перегляд фото",
      tempView: "Видно {{seconds}} с",
      accessPermanent: "У вас постійний доступ до цього фото",
      accessTemporary: "У вас тимчасовий доступ до цього фото",
      accessNone: "Фото заблюрене — запросіть доступ, щоб переглянути",
      pendingRequest: "Запит на перегляд фото:",
      approveTemporary: "Схвалити на 15 с",
      approvePermanent: "Схвалити назавжди",
      deny: "Відхилити",
      offerTitle: "Запропонувати моє фото:",
      offerTemporary: "На 15 секунд",
      offerPermanent: "На постійно",
      revoke: "Відкликати доступ",
      viewOffer: "Переглянути фото",
      hide: "Сховати фото",
    },
    chat: {
      requestPhoto: "Запитує перегляд вашого фото",
      photoApprovedPermanent: "Надано постійний доступ до фото",
      photoApprovedTemporary: "Надано доступ до фото на 15 секунд",
      photoDenied: "Запит на фото відхилено",
      photoOfferPermanent: "Пропонує постійний доступ до фото",
      photoOfferTemporary: "Пропонує перегляд фото на 15 секунд",
      photoRevoked: "Доступ до фото скасовано",
    },
    userProfile: { ageHidden: "вік приховано" },
    profile: {
      edit: { title: "Моя інформація", photoAlt: "Моє фото", changePhoto: "Змінити фото", uploadPhoto: "Завантажити фото", blurPhoto: "Заблюрити моє фото", age: "Вік", hideAge: "Приховати мій вік", languages: "Мови, якими я спілкуюсь", bio: "Про себе", save: "Зберегти зміни", saving: "Збереження…", saved: "Профіль збережено" },
      photoGrants: { title: "Доступ до фото", description: "Користувачі, яким ви надали доступ до фото:", permanent: "Постійний доступ", temporary: "Тимчасовий доступ", revoke: "Відкликати" },
    },
  },
  de: {
    onboarding: {
      title: "Profil vervollständigen",
      subtitle: "Erzähle anderen ein wenig über dich",
      age: { title: "Dein Alter", label: "Alter", hide: "Mein Alter verbergen", hideHint: "Dein Alter wird anderen Nutzern nicht angezeigt" },
      languages: { title: "Sprachen", hint: "Wähle die Sprachen, die du sprichst" },
      bio: { title: "Über mich", label: "Über mich", placeholder: "Erzähle etwas über dich, Hobbys und was du suchst..." },
      photo: { title: "Dein Foto", upload: "Foto hochladen", change: "Foto ändern", preview: "Fotovorschau", blur: "Mein Foto unkenntlich machen", blurHint: "Andere sehen nur eine unscharfe Vorschau, bis du Zugriff gewährst", invalidType: "Bitte eine Bilddatei wählen", readError: "Bild konnte nicht gelesen werden. Versuche eine andere Datei." },
      back: "Zurück", next: "Weiter", skip: "Überspringen", saving: "Speichern…", finish: "Fertig",
    },
    photo: {
      request: "Fotoansicht anfragen",
      tempView: "Sichtbar für {{seconds}} s",
      accessPermanent: "Du hast dauerhaften Zugriff auf dieses Foto",
      accessTemporary: "Du hast vorübergehenden Zugriff auf dieses Foto",
      accessNone: "Unschärfes Foto — Zugriff anfragen",
      pendingRequest: "Anfrage für Fotoansicht:",
      approveTemporary: "15 s genehmigen",
      approvePermanent: "Dauerhaft genehmigen",
      deny: "Ablehnen",
      offerTitle: "Mein Foto anbieten:",
      offerTemporary: "15 s anbieten",
      offerPermanent: "Dauerhaft anbieten",
      revoke: "Zugriff entziehen",
      viewOffer: "Foto ansehen",
      hide: "Foto ausblenden",
    },
    chat: {
      requestPhoto: "Bittet um Ansicht deines Fotos",
      photoApprovedPermanent: "Dauerhafter Foto-Zugriff gewährt",
      photoApprovedTemporary: "Foto-Zugriff für 15 Sekunden gewährt",
      photoDenied: "Fotoanfrage abgelehnt",
      photoOfferPermanent: "Bietet dauerhaften Foto-Zugriff an",
      photoOfferTemporary: "Bietet eine 15-Sekunden-Fotoansicht an",
      photoRevoked: "Foto-Zugriff entzogen",
    },
    userProfile: { ageHidden: "Alter verborgen" },
    profile: {
      edit: { title: "Meine Profilinformationen", photoAlt: "Mein Foto", changePhoto: "Foto ändern", uploadPhoto: "Foto hochladen", blurPhoto: "Mein Foto unkenntlich machen", age: "Alter", hideAge: "Mein Alter verbergen", languages: "Sprachen, die ich spreche", bio: "Über mich", save: "Änderungen speichern", saving: "Speichern…", saved: "Profil gespeichert" },
      photoGrants: { title: "Foto-Zugriff", description: "Nutzer mit Zugriff auf dein Foto:", permanent: "Dauerhafter Zugriff", temporary: "Vorübergehender Zugriff", revoke: "Entziehen" },
    },
  },
  fr: {
    onboarding: {
      title: "Complétez votre profil",
      subtitle: "Parlez un peu de vous aux autres",
      age: { title: "Votre âge", label: "Âge", hide: "Masquer mon âge", hideHint: "Votre âge ne sera pas visible des autres utilisateurs" },
      languages: { title: "Langues", hint: "Sélectionnez les langues que vous parlez" },
      bio: { title: "À propos de moi", label: "À propos de moi", placeholder: "Parlez un peu de vous, de vos loisirs, de ce que vous cherchez..." },
      photo: { title: "Votre photo", upload: "Importer une photo", change: "Changer la photo", preview: "Aperçu de la photo", blur: "Flouter ma photo", blurHint: "Les autres ne verront qu'un aperçu flou tant que vous n'accordez pas l'accès", invalidType: "Choisissez un fichier image", readError: "Impossible de lire l'image. Essayez un autre fichier." },
      back: "Retour", next: "Suivant", skip: "Passer", saving: "Enregistrement…", finish: "Terminer",
    },
    photo: {
      request: "Demander l'accès à la photo",
      tempView: "Visible {{seconds}} s",
      accessPermanent: "Vous avez un accès permanent à cette photo",
      accessTemporary: "Vous avez un accès temporaire à cette photo",
      accessNone: "Photo floutée — demandez l'accès pour voir",
      pendingRequest: "Demande d'accès à la photo :",
      approveTemporary: "Approuver 15 s",
      approvePermanent: "Approuver définitivement",
      deny: "Refuser",
      offerTitle: "Proposer ma photo :",
      offerTemporary: "Proposer 15 s",
      offerPermanent: "Proposer définitivement",
      revoke: "Révoquer l'accès",
      viewOffer: "Voir la photo",
      hide: "Masquer la photo",
    },
    chat: {
      requestPhoto: "Demande à voir votre photo",
      photoApprovedPermanent: "Accès permanent à la photo accordé",
      photoApprovedTemporary: "Accès à la photo accordé pour 15 secondes",
      photoDenied: "Demande de photo refusée",
      photoOfferPermanent: "Propose un accès permanent à la photo",
      photoOfferTemporary: "Propose un aperçu de 15 secondes",
      photoRevoked: "Accès à la photo révoqué",
    },
    userProfile: { ageHidden: "âge masqué" },
    profile: {
      edit: { title: "Mes informations", photoAlt: "Ma photo", changePhoto: "Changer la photo", uploadPhoto: "Importer une photo", blurPhoto: "Flouter ma photo", age: "Âge", hideAge: "Masquer mon âge", languages: "Langues que je parle", bio: "À propos de moi", save: "Enregistrer", saving: "Enregistrement…", saved: "Profil enregistré" },
      photoGrants: { title: "Accès à la photo", description: "Utilisateurs ayant accès à votre photo :", permanent: "Accès permanent", temporary: "Accès temporaire", revoke: "Révoquer" },
    },
  },
  es: {
    onboarding: {
      title: "Completa tu perfil",
      subtitle: "Cuenta un poco sobre ti a los demás",
      age: { title: "Tu edad", label: "Edad", hide: "Ocultar mi edad", hideHint: "Tu edad no se mostrará a otros usuarios" },
      languages: { title: "Idiomas", hint: "Selecciona los idiomas que hablas" },
      bio: { title: "Sobre mí", label: "Sobre mí", placeholder: "Cuenta algo sobre ti, aficiones, qué buscas..." },
      photo: { title: "Tu foto", upload: "Subir foto", change: "Cambiar foto", preview: "Vista previa", blur: "Difuminar mi foto", blurHint: "Los demás verán solo una vista previa borrosa hasta que concedas acceso", invalidType: "Elige un archivo de imagen", readError: "No se pudo leer la imagen. Prueba otro archivo." },
      back: "Atrás", next: "Siguiente", skip: "Omitir", saving: "Guardando…", finish: "Terminar",
    },
    photo: {
      request: "Solicitar ver la foto",
      tempView: "Visible {{seconds}} s",
      accessPermanent: "Tienes acceso permanente a esta foto",
      accessTemporary: "Tienes acceso temporal a esta foto",
      accessNone: "Foto borrosa: solicita acceso para verla",
      pendingRequest: "Solicitud de foto pendiente:",
      approveTemporary: "Aprobar 15 s",
      approvePermanent: "Aprobar definitivamente",
      deny: "Rechazar",
      offerTitle: "Ofrecer mi foto:",
      offerTemporary: "Ofrecer 15 s",
      offerPermanent: "Ofrecer definitivamente",
      revoke: "Revocar acceso",
      viewOffer: "Ver foto",
      hide: "Ocultar foto",
    },
    chat: {
      requestPhoto: "Solicita ver tu foto",
      photoApprovedPermanent: "Acceso permanente a la foto concedido",
      photoApprovedTemporary: "Acceso a la foto concedido por 15 segundos",
      photoDenied: "Solicitud de foto rechazada",
      photoOfferPermanent: "Ofrece acceso permanente a su foto",
      photoOfferTemporary: "Ofrece una vista de 15 segundos",
      photoRevoked: "Acceso a la foto revocado",
    },
    userProfile: { ageHidden: "edad oculta" },
    profile: {
      edit: { title: "Mi información", photoAlt: "Mi foto", changePhoto: "Cambiar foto", uploadPhoto: "Subir foto", blurPhoto: "Difuminar mi foto", age: "Edad", hideAge: "Ocultar mi edad", languages: "Idiomas que hablo", bio: "Sobre mí", save: "Guardar cambios", saving: "Guardando…", saved: "Perfil guardado" },
      photoGrants: { title: "Acceso a la foto", description: "Usuarios con acceso a tu foto:", permanent: "Acceso permanente", temporary: "Acceso temporal", revoke: "Revocar" },
    },
  },
  pt: {
    onboarding: {
      title: "Complete seu perfil",
      subtitle: "Conte um pouco sobre você aos outros",
      age: { title: "Sua idade", label: "Idade", hide: "Ocultar minha idade", hideHint: "Sua idade não será mostrada a outros usuários" },
      languages: { title: "Idiomas", hint: "Selecione os idiomas que você fala" },
      bio: { title: "Sobre mim", label: "Sobre mim", placeholder: "Conte um pouco sobre você, hobbies, o que procura..." },
      photo: { title: "Sua foto", upload: "Enviar foto", change: "Trocar foto", preview: "Pré-visualização", blur: "Desfocar minha foto", blurHint: "Outros verão apenas uma prévia desfocada até você conceder acesso", invalidType: "Escolha um arquivo de imagem", readError: "Não foi possível ler a imagem. Tente outro arquivo." },
      back: "Voltar", next: "Avançar", skip: "Pular", saving: "Salvando…", finish: "Concluir",
    },
    photo: {
      request: "Solicitar visualização da foto",
      tempView: "Visível por {{seconds}} s",
      accessPermanent: "Você tem acesso permanente a esta foto",
      accessTemporary: "Você tem acesso temporário a esta foto",
      accessNone: "Foto desfocada — solicite acesso para ver",
      pendingRequest: "Solicitação de foto pendente:",
      approveTemporary: "Aprovar 15 s",
      approvePermanent: "Aprovar permanentemente",
      deny: "Recusar",
      offerTitle: "Oferecer minha foto:",
      offerTemporary: "Oferecer 15 s",
      offerPermanent: "Oferecer permanentemente",
      revoke: "Revogar acesso",
      viewOffer: "Ver foto",
      hide: "Ocultar foto",
    },
    chat: {
      requestPhoto: "Solicita ver sua foto",
      photoApprovedPermanent: "Acesso permanente à foto concedido",
      photoApprovedTemporary: "Acesso à foto concedido por 15 segundos",
      photoDenied: "Solicitação de foto recusada",
      photoOfferPermanent: "Oferece acesso permanente à foto",
      photoOfferTemporary: "Oferece uma visualização de 15 segundos",
      photoRevoked: "Acesso à foto revogado",
    },
    userProfile: { ageHidden: "idade oculta" },
    profile: {
      edit: { title: "Minhas informações", photoAlt: "Minha foto", changePhoto: "Trocar foto", uploadPhoto: "Enviar foto", blurPhoto: "Desfocar minha foto", age: "Idade", hideAge: "Ocultar minha idade", languages: "Idiomas que falo", bio: "Sobre mim", save: "Salvar alterações", saving: "Salvando…", saved: "Perfil salvo" },
      photoGrants: { title: "Acesso à foto", description: "Usuários com acesso à sua foto:", permanent: "Acesso permanente", temporary: "Acesso temporário", revoke: "Revogar" },
    },
  },
  ja: {
    onboarding: {
      title: "プロフィールを完成させましょう",
      subtitle: "あなたのことを少し教えてください",
      age: { title: "年齢", label: "年齢", hide: "年齢を非表示にする", hideHint: "年齢は他のユーザーに表示されません" },
      languages: { title: "言語", hint: "話せる言語を選択してください" },
      bio: { title: "自己紹介", label: "自己紹介", placeholder: "あなたのこと、趣味、探しているものを書いてください..." },
      photo: { title: "あなたの写真", upload: "写真をアップロード", change: "写真を変更", preview: "写真プレビュー", blur: "写真をぼかす", blurHint: "アクセスを許可するまで、他のユーザーにはぼかしたプレビューのみ表示されます", invalidType: "画像ファイルを選択してください", readError: "画像を読み込めませんでした。別のファイルを試してください。" },
      back: "戻る", next: "次へ", skip: "スキップ", saving: "保存中…", finish: "完了",
    },
    photo: {
      request: "写真の閲覧をリクエスト",
      tempView: "{{seconds}} 秒間表示",
      accessPermanent: "この写真への永続的なアクセス権があります",
      accessTemporary: "この写真への一時的なアクセス権があります",
      accessNone: "ぼかし写真 — アクセスをリクエストしてください",
      pendingRequest: "写真閲覧リクエスト:",
      approveTemporary: "15秒許可",
      approvePermanent: "永久に許可",
      deny: "拒否",
      offerTitle: "私の写真を提供:",
      offerTemporary: "15秒提供",
      offerPermanent: "永久に提供",
      revoke: "アクセスを取り消す",
      viewOffer: "写真を見る",
      hide: "写真を隠す",
    },
    chat: {
      requestPhoto: "あなたの写真の閲覧をリクエストしています",
      photoApprovedPermanent: "写真への永続的アクセスが許可されました",
      photoApprovedTemporary: "写真へのアクセスが15秒許可されました",
      photoDenied: "写真リクエストが拒否されました",
      photoOfferPermanent: "写真への永続的アクセスを提供しています",
      photoOfferTemporary: "15秒の写真閲覧を提供しています",
      photoRevoked: "写真へのアクセスが取り消されました",
    },
    userProfile: { ageHidden: "年齢非表示" },
    profile: {
      edit: { title: "プロフィール情報", photoAlt: "私の写真", changePhoto: "写真を変更", uploadPhoto: "写真をアップロード", blurPhoto: "写真をぼかす", age: "年齢", hideAge: "年齢を非表示にする", languages: "話せる言語", bio: "自己紹介", save: "変更を保存", saving: "保存中…", saved: "プロフィールを保存しました" },
      photoGrants: { title: "写真アクセス", description: "写真アクセスを許可したユーザー:", permanent: "永続的アクセス", temporary: "一時的アクセス", revoke: "取り消す" },
    },
  },
  ar: {
    onboarding: {
      title: "أكمل ملفك الشخصي",
      subtitle: "أخبر الآخرين قليلاً عن نفسك",
      age: { title: "عمرك", label: "العمر", hide: "إخفاء عمري", hideHint: "لن يظهر عمرك للمستخدمين الآخرين" },
      languages: { title: "اللغات", hint: "اختر اللغات التي تتحدثها" },
      bio: { title: "عنّي", label: "عنّي", placeholder: "اكتب قليلاً عن نفسك وهواياتك وما تبحث عنه..." },
      photo: { title: "صورتك", upload: "رفع صورة", change: "تغيير الصورة", preview: "معاينة الصورة", blur: "تعتيم صورتي", blurHint: "لن يرى الآخرون سوى معاينة ضبابية حتى تمنح الوصول", invalidType: "يرجى اختيار ملف صورة", readError: "تعذر قراءة الصورة. جرّب ملفاً آخر." },
      back: "رجوع", next: "التالي", skip: "تخطي", saving: "جارٍ الحفظ…", finish: "إنهاء",
    },
    photo: {
      request: "طلب عرض الصورة",
      tempView: "ظاهرة لمدة {{seconds}} ثانية",
      accessPermanent: "لديك وصول دائم لهذه الصورة",
      accessTemporary: "لديك وصول مؤقت لهذه الصورة",
      accessNone: "صورة ضبابية — اطلب الوصول للعرض",
      pendingRequest: "طلب عرض الصورة قيد الانتظار:",
      approveTemporary: "الموافقة 15 ثانية",
      approvePermanent: "الموافقة بشكل دائم",
      deny: "رفض",
      offerTitle: "عرض صورتي:",
      offerTemporary: "عرض 15 ثانية",
      offerPermanent: "عرض بشكل دائم",
      revoke: "إلغاء الوصول",
      viewOffer: "عرض الصورة",
      hide: "إخفاء الصورة",
    },
    chat: {
      requestPhoto: "يطلب عرض صورتك",
      photoApprovedPermanent: "تم منح وصول دائم للصورة",
      photoApprovedTemporary: "تم منح وصول للصورة لمدة 15 ثانية",
      photoDenied: "تم رفض طلب الصورة",
      photoOfferPermanent: "يعرض وصولاً دائماً لصورته",
      photoOfferTemporary: "يعرض مشاهدة الصورة لمدة 15 ثانية",
      photoRevoked: "تم إلغاء الوصول إلى الصورة",
    },
    userProfile: { ageHidden: "العمر مخفي" },
    profile: {
      edit: { title: "معلوماتي", photoAlt: "صورتي", changePhoto: "تغيير الصورة", uploadPhoto: "رفع صورة", blurPhoto: "تعتيم صورتي", age: "العمر", hideAge: "إخفاء عمري", languages: "اللغات التي أتحدثها", bio: "عنّي", save: "حفظ التغييرات", saving: "جارٍ الحفظ…", saved: "تم حفظ الملف الشخصي" },
      photoGrants: { title: "الوصول إلى الصورة", description: "المستخدمون الذين منحتهم وصولاً لصورتك:", permanent: "وصول دائم", temporary: "وصول مؤقت", revoke: "إلغاء" },
    },
  },
  vi: {
    onboarding: {
      title: "Hoàn thiện hồ sơ của bạn",
      subtitle: "Chia sẻ một chút về bản thân",
      age: { title: "Tuổi của bạn", label: "Tuổi", hide: "Ẩn tuổi của tôi", hideHint: "Tuổi của bạn sẽ không hiển thị với người khác" },
      languages: { title: "Ngôn ngữ", hint: "Chọn ngôn ngữ bạn nói" },
      bio: { title: "Giới thiệu", label: "Giới thiệu", placeholder: "Viết một chút về bạn, sở thích, điều bạn đang tìm kiếm..." },
      photo: { title: "Ảnh của bạn", upload: "Tải ảnh lên", change: "Đổi ảnh", preview: "Xem trước ảnh", blur: "Làm mờ ảnh của tôi", blurHint: "Người khác chỉ thấy ảnh mờ cho đến khi bạn cấp quyền", invalidType: "Vui lòng chọn tệp hình ảnh", readError: "Không đọc được ảnh. Hãy thử tệp khác." },
      back: "Quay lại", next: "Tiếp theo", skip: "Bỏ qua", saving: "Đang lưu…", finish: "Hoàn tất",
    },
    photo: {
      request: "Yêu cầu xem ảnh",
      tempView: "Hiển thị {{seconds}} giây",
      accessPermanent: "Bạn có quyền xem ảnh này vĩnh viễn",
      accessTemporary: "Bạn có quyền xem ảnh này tạm thời",
      accessNone: "Ảnh bị làm mờ — yêu cầu quyền xem",
      pendingRequest: "Yêu cầu xem ảnh đang chờ:",
      approveTemporary: "Chấp nhận 15 giây",
      approvePermanent: "Chấp nhận vĩnh viễn",
      deny: "Từ chối",
      offerTitle: "Đề nghị ảnh của tôi:",
      offerTemporary: "Đề nghị 15 giây",
      offerPermanent: "Đề nghị vĩnh viễn",
      revoke: "Thu hồi quyền",
      viewOffer: "Xem ảnh",
      hide: "Ẩn ảnh",
    },
    chat: {
      requestPhoto: "Yêu cầu xem ảnh của bạn",
      photoApprovedPermanent: "Đã cấp quyền xem ảnh vĩnh viễn",
      photoApprovedTemporary: "Đã cấp quyền xem ảnh trong 15 giây",
      photoDenied: "Yêu cầu xem ảnh đã bị từ chối",
      photoOfferPermanent: "Đề nghị cấp quyền xem ảnh vĩnh viễn",
      photoOfferTemporary: "Đề nghị xem ảnh trong 15 giây",
      photoRevoked: "Đã thu hồi quyền xem ảnh",
    },
    userProfile: { ageHidden: "đã ẩn tuổi" },
    profile: {
      edit: { title: "Thông tin của tôi", photoAlt: "Ảnh của tôi", changePhoto: "Đổi ảnh", uploadPhoto: "Tải ảnh lên", blurPhoto: "Làm mờ ảnh của tôi", age: "Tuổi", hideAge: "Ẩn tuổi của tôi", languages: "Ngôn ngữ tôi nói", bio: "Giới thiệu", save: "Lưu thay đổi", saving: "Đang lưu…", saved: "Đã lưu hồ sơ" },
      photoGrants: { title: "Quyền xem ảnh", description: "Người dùng được cấp quyền xem ảnh:", permanent: "Vĩnh viễn", temporary: "Tạm thời", revoke: "Thu hồi" },
    },
  },
  "zh-TW": {
    onboarding: {
      title: "完善你的個人資料",
      subtitle: "向他人簡單介紹你自己",
      age: { title: "你的年齡", label: "年齡", hide: "隱藏我的年齡", hideHint: "其他用戶將看不到你的年齡" },
      languages: { title: "語言", hint: "選擇你會說的語言" },
      bio: { title: "關於我", label: "關於我", placeholder: "寫一些關於你自己、興趣愛好、你在尋找什麼..." },
      photo: { title: "你的照片", upload: "上傳照片", change: "更換照片", preview: "照片預覽", blur: "模糊我的照片", blurHint: "在你授予權限前，其他人只能看到模糊預覽", invalidType: "請選擇圖片檔案", readError: "無法讀取圖片，請嘗試其他檔案。" },
      back: "返回", next: "下一步", skip: "跳過", saving: "儲存中…", finish: "完成",
    },
    photo: {
      request: "請求查看照片",
      tempView: "顯示 {{seconds}} 秒",
      accessPermanent: "你擁有這張照片的永久查看權限",
      accessTemporary: "你擁有這張照片的臨時查看權限",
      accessNone: "照片已模糊 — 請請求權限以查看",
      pendingRequest: "照片查看請求待處理：",
      approveTemporary: "批准 15 秒",
      approvePermanent: "永久批准",
      deny: "拒絕",
      offerTitle: "提供我的照片：",
      offerTemporary: "提供 15 秒",
      offerPermanent: "永久提供",
      revoke: "撤銷權限",
      viewOffer: "查看照片",
      hide: "隱藏照片",
    },
    chat: {
      requestPhoto: "請求查看你的照片",
      photoApprovedPermanent: "已授予照片永久查看權限",
      photoApprovedTemporary: "已授予照片 15 秒查看權限",
      photoDenied: "照片請求已拒絕",
      photoOfferPermanent: "提供永久查看照片權限",
      photoOfferTemporary: "提供 15 秒照片查看",
      photoRevoked: "照片查看權限已撤銷",
    },
    userProfile: { ageHidden: "年齡已隱藏" },
    profile: {
      edit: { title: "我的資訊", photoAlt: "我的照片", changePhoto: "更換照片", uploadPhoto: "上傳照片", blurPhoto: "模糊我的照片", age: "年齡", hideAge: "隱藏我的年齡", languages: "我會說的語言", bio: "關於我", save: "儲存變更", saving: "儲存中…", saved: "個人資料已儲存" },
      photoGrants: { title: "照片權限", description: "已授予照片查看權限的用戶：", permanent: "永久權限", temporary: "臨時權限", revoke: "撤銷" },
    },
  },
};

/** Tier 2 — English value + local description in parentheses. */
const TIER2_DESC = {
  en: null,
  bg: "попълнете профила си", cs: "dokončete svůj profil", da: "fuldfør din profil",
  el: "συμπληρώστε το προφίλ σας", et: "täida oma profiil", fi: "täydennä profiilisi",
  he: "השלם את הפרופיל שלך", hr: "dovršite svoj profil", hu: "töltsd ki a profilod",
  is: "kláraðu prófílinn þinn", it: "completa il tuo profilo", lt: "užpildykite savo profilį",
  lv: "aizpildiet savu profilu", nb: "fullfør profilen din", nl: "vul je profiel aan",
  pl: "uzupełnij swój profil", ro: "completează-ți profilul", sk: "dokončite svoj profil",
  sl: "dokončite svoj profil", sv: "färdigställ din profil", ne: "आफ्नो प्रोफाइल पूरा गर्नुहोस्",
  sw: "kamilisha wasifu wako", fil: "kumpletuhin ang iyong profile",
};

const main = () => {
  const files = readdirSync(LOCALES_DIR).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const code = file.replace(/\.json$/, "");
    const path = join(LOCALES_DIR, file);
    const json = JSON.parse(readFileSync(path, "utf8"));

    let block;
    if (TIER1[code]) {
      block = JSON.parse(JSON.stringify(TIER1[code]));
    } else {
      // Tier 2: English + local description
      const desc = TIER2_DESC[code] || "";
      const suffix = desc ? ` (${desc})` : "";
      const clone = JSON.parse(JSON.stringify(EN));
      const addSuffix = (obj) => {
        for (const k of Object.keys(obj)) {
          if (typeof obj[k] === "string") obj[k] = obj[k] + suffix;
          else if (obj[k] && typeof obj[k] === "object") addSuffix(obj[k]);
        }
      };
      addSuffix(clone);
      block = clone;
    }

    // Deep-merge into the existing locale
    const merge = (target, source) => {
      for (const k of Object.keys(source)) {
        if (
          source[k] &&
          typeof source[k] === "object" &&
          !Array.isArray(source[k]) &&
          target[k] &&
          typeof target[k] === "object" &&
          !Array.isArray(target[k])
        ) {
          merge(target[k], source[k]);
        } else {
          target[k] = source[k];
        }
      }
    };
    merge(json, block);

    writeFileSync(path, JSON.stringify(json, null, 2));
    console.log(`OK ${file}`);
  }
  console.log("Done — all locales updated.");
};

main();