/**
 * Adds the Lab Partner portal (labPortal.*) and patient QR / face-match
 * (profile.lab.patientQr* and profile.lab.face*) keys to every locale JSON
 * file in apps/web/src/i18n/locales/.
 *
 * Deterministic, non-LLM: preserves all existing keys via deep merge and only
 * adds what the LabPortal page, LabPatientQR component and the Profile lab
 * panel consume.
 *
 * Natural translations are provided for Tier 1 languages (uk de fr es pt ja
 * ko zh ar vi hi tr th id ms ru); all other locales fall back to English
 * (matching the repo's Tier 2 convention in TIER2-*.md).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

// English source.
const en = {
  labPortal: {
    title: "Lab Portal",
    subtitle: "Partner laboratory workspace. Verify a patient and attach a test result.",
    apiKey: "Lab API key",
    newPatient: "New patient",
    register: {
      name: "Laboratory name",
      namePlaceholder: "e.g. Sunrise Diagnostics",
      email: "Contact email",
      submit: "Register laboratory",
      required: "Please enter both the laboratory name and a contact email.",
      failed: "Could not register the laboratory. Please try again.",
      savedKey: "Laboratory registered. Your API key is saved on this device.",
    },
    scan: {
      title: "Scan the patient QR code",
      hint: "Ask the patient to open Evolve → Profile → Lab testing and show the QR code.",
      start: "Start camera",
      stop: "Stop camera",
      startFailed: "Could not start the camera. Please allow camera access and try again.",
      noPermission:
        "Camera access is blocked. Allow the camera in your browser (padlock icon in the address bar) and try again.",
      noCamera: "No camera was found on this device.",
    },
    verify: {
      title: "Verify the patient's identity",
      patientId: "Patient ID",
      takePhoto: "Take a photo of the patient",
      photoAlt: "Patient photo for verification",
      checking: "Checking…",
      confirm: "Match faces",
      noFace: "No face detected in the photo. Please take another photo.",
      photoError: "Could not process the photo. Please try again.",
      failed: "Verification failed. Please try again.",
      matched: "Identity confirmed — faces match.",
      unmatched: "Identity NOT confirmed — faces do not match.",
      similarity: "Similarity",
    },
    report: {
      title: "Attach the test result",
      hint: "Paste the raw test result text. It is parsed automatically.",
      placeholder: "Paste the test result text here…",
      submit: "Submit result",
      submitting: "Submitting…",
      success: "Result submitted. It will appear in the patient's pending reports.",
      failed: "Could not submit the result. Please try again.",
    },
  },
  profile: {
    lab: {
      patientQrTitle: "QR for on-site verification",
      patientQrHint:
        "Show this code to a partner laboratory. It encodes only your ID — no photo or profile data.",
      patientQrAria: "Patient QR code for on-site lab verification",
      patientQrError: "Could not generate the QR code.",
      faceVerified: "Face verified",
      faceNotVerified: "Face not verified",
    },
  },
};

// Natural translations for Tier 1 languages.
const natural = {
  uk: {
    labPortal: {
      title: "Портал лабораторії",
      subtitle:
        "Робоче місце лабораторії-партнера. Верифікуйте пацієнта та додайте результат аналізу.",
      apiKey: "API-ключ лабораторії",
      newPatient: "Новий пацієнт",
      register: {
        name: "Назва лабораторії",
        namePlaceholder: "напр. Sunrise Diagnostics",
        email: "Контактна пошта",
        submit: "Зареєструвати лабораторію",
        required: "Введіть назву лабораторії та контактну пошту.",
        failed: "Не вдалося зареєструвати лабораторію. Спробуйте ще раз.",
        savedKey: "Лабораторію зареєстровано. Ваш API-ключ збережено на цьому пристрої.",
      },
      scan: {
        title: "Відскануйте QR-код пацієнта",
        hint: "Попросіть пацієнта відкрити Evolve → Профіль → Лабораторні аналізи та показати QR-код.",
        start: "Запустити камеру",
        stop: "Зупинити камеру",
        startFailed: "Не вдалося запустити камеру. Надайте доступ до камери та спробуйте ще раз.",
        noPermission:
          "Доступ до камери заблоковано. Дозвольте камеру в браузері (іконка замка в адресному рядку) та спробуйте ще раз.",
        noCamera: "На цьому пристрої не знайдено камери.",
      },
      verify: {
        title: "Підтвердьте особу пацієнта",
        patientId: "ID пацієнта",
        takePhoto: "Сфотографуйте пацієнта",
        photoAlt: "Фото пацієнта для верифікації",
        checking: "Перевірка…",
        confirm: "Зіставити обличчя",
        noFace: "На фото не виявлено обличчя. Зробіть інше фото.",
        photoError: "Не вдалося обробити фото. Спробуйте ще раз.",
        failed: "Верифікацію не вдалося. Спробуйте ще раз.",
        matched: "Особу підтверджено — обличчя збігаються.",
        unmatched: "Особу НЕ підтверджено — обличчя не збігаються.",
        similarity: "Схожість",
      },
      report: {
        title: "Додайте результат аналізу",
        hint: "Вставте текст результату. Він буде розпарсений автоматично.",
        placeholder: "Вставте сюди текст результату…",
        submit: "Надіслати результат",
        submitting: "Надсилання…",
        success: "Результат надіслано. Він з'явиться у списку очікуючих звітів пацієнта.",
        failed: "Не вдалося надіслати результат. Спробуйте ще раз.",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "QR для верифікації на місці",
        patientQrHint:
          "Покажіть цей код лабораторії-партнеру. Він містить лише ваш ID — без фото та даних профілю.",
        patientQrAria: "QR-код пацієнта для верифікації в лабораторії",
        patientQrError: "Не вдалося згенерувати QR-код.",
        faceVerified: "Обличчя верифіковано",
        faceNotVerified: "Обличчя не верифіковано",
      },
    },
  },
  ru: {
    labPortal: {
      title: "Портал лаборатории",
      subtitle:
        "Рабочее место лаборатории-партнёра. Верифицируйте пациента и прикрепите результат анализа.",
      apiKey: "API-ключ лаборатории",
      newPatient: "Новый пациент",
      register: {
        name: "Название лаборатории",
        namePlaceholder: "напр. Sunrise Diagnostics",
        email: "Контактная почта",
        submit: "Зарегистрировать лабораторию",
        required: "Введите название лаборатории и контактную почту.",
        failed: "Не удалось зарегистрировать лабораторию. Попробуйте ещё раз.",
        savedKey: "Лаборатория зарегистрирована. Ваш API-ключ сохранён на этом устройстве.",
      },
      scan: {
        title: "Отсканируйте QR-код пациента",
        hint: "Попросите пациента открыть Evolve → Профиль → Лабораторные анализы и показать QR-код.",
        start: "Запустить камеру",
        stop: "Остановить камеру",
        startFailed: "Не удалось запустить камеру. Разрешите доступ к камере и попробуйте ещё раз.",
        noPermission:
          "Доступ к камере заблокирован. Разрешите камеру в браузере (значок замка в адресной строке) и попробуйте ещё раз.",
        noCamera: "На этом устройстве не найдено камеры.",
      },
      verify: {
        title: "Подтвердите личность пациента",
        patientId: "ID пациента",
        takePhoto: "Сфотографируйте пациента",
        photoAlt: "Фото пациента для верификации",
        checking: "Проверка…",
        confirm: "Сопоставить лица",
        noFace: "На фото не обнаружено лицо. Сделайте другое фото.",
        photoError: "Не удалось обработать фото. Попробуйте ещё раз.",
        failed: "Верификация не удалась. Попробуйте ещё раз.",
        matched: "Личность подтверждена — лица совпадают.",
        unmatched: "Личность НЕ подтверждена — лица не совпадают.",
        similarity: "Схожесть",
      },
      report: {
        title: "Прикрепите результат анализа",
        hint: "Вставьте текст результата. Он будет разобран автоматически.",
        placeholder: "Вставьте сюда текст результата…",
        submit: "Отправить результат",
        submitting: "Отправка…",
        success: "Результат отправлен. Он появится в списке ожидающих отчётов пациента.",
        failed: "Не удалось отправить результат. Попробуйте ещё раз.",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "QR для верификации на месте",
        patientQrHint:
          "Покажите этот код лаборатории-партнёру. Он содержит только ваш ID — без фото и данных профиля.",
        patientQrAria: "QR-код пациента для верификации в лаборатории",
        patientQrError: "Не удалось сгенерировать QR-код.",
        faceVerified: "Лицо верифицировано",
        faceNotVerified: "Лицо не верифицировано",
      },
    },
  },
  de: {
    labPortal: {
      title: "Labor-Portal",
      subtitle:
        "Arbeitsplatz für Partnerlabore. Bestätigen Sie die Identität eines Patienten und hängen Sie ein Testergebnis an.",
      apiKey: "Lab-API-Schlüssel",
      newPatient: "Neuer Patient",
      register: {
        name: "Name des Labors",
        namePlaceholder: "z. B. Sunrise Diagnostics",
        email: "Kontakt-E-Mail",
        submit: "Labor registrieren",
        required: "Bitte geben Sie Name und Kontakt-E-Mail des Labors ein.",
        failed: "Das Labor konnte nicht registriert werden. Bitte erneut versuchen.",
        savedKey: "Labor registriert. Ihr API-Schlüssel ist auf diesem Gerät gespeichert.",
      },
      scan: {
        title: "QR-Code des Patienten scannen",
        hint: "Bitten Sie den Patienten, Evolve → Profil → Laboranalysen zu öffnen und den QR-Code zu zeigen.",
        start: "Kamera starten",
        stop: "Kamera stoppen",
        startFailed:
          "Kamera konnte nicht gestartet werden. Bitte erlauben Sie den Kamerazugriff und versuchen Sie es erneut.",
        noPermission:
          "Der Kamerazugriff ist blockiert. Erlauben Sie die Kamera im Browser (Schloss-Symbol in der Adressleiste) und versuchen Sie es erneut.",
        noCamera: "Auf diesem Gerät wurde keine Kamera gefunden.",
      },
      verify: {
        title: "Identität des Patienten bestätigen",
        patientId: "Patienten-ID",
        takePhoto: "Foto des Patienten aufnehmen",
        photoAlt: "Patientenfoto zur Verifikation",
        checking: "Prüfen…",
        confirm: "Gesichter abgleichen",
        noFace: "Kein Gesicht im Foto erkannt. Bitte ein anderes Foto aufnehmen.",
        photoError: "Foto konnte nicht verarbeitet werden. Bitte erneut versuchen.",
        failed: "Verifikation fehlgeschlagen. Bitte erneut versuchen.",
        matched: "Identität bestätigt — Gesichter stimmen überein.",
        unmatched: "Identität NICHT bestätigt — Gesichter stimmen nicht überein.",
        similarity: "Ähnlichkeit",
      },
      report: {
        title: "Testergebnis anhängen",
        hint: "Fügen Sie den Rohtext des Ergebnisses ein. Er wird automatisch ausgewertet.",
        placeholder: "Ergebnistext hier einfügen…",
        submit: "Ergebnis einreichen",
        submitting: "Wird eingereicht…",
        success: "Ergebnis eingereicht. Es erscheint in den ausstehenden Berichten des Patienten.",
        failed: "Ergebnis konnte nicht eingereicht werden. Bitte erneut versuchen.",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "QR zur Vor-Ort-Verifikation",
        patientQrHint:
          "Zeigen Sie diesen Code einem Partnerlabor. Er enthält nur Ihre ID — kein Foto und keine Profildaten.",
        patientQrAria: "Patienten-QR-Code zur Verifikation im Labor",
        patientQrError: "QR-Code konnte nicht erstellt werden.",
        faceVerified: "Gesicht verifiziert",
        faceNotVerified: "Gesicht nicht verifiziert",
      },
    },
  },
  fr: {
    labPortal: {
      title: "Portail laboratoire",
      subtitle:
        "Espace de travail du laboratoire partenaire. Vérifiez l'identité d'un patient et joignez un résultat d'analyse.",
      apiKey: "Clé API du laboratoire",
      newPatient: "Nouveau patient",
      register: {
        name: "Nom du laboratoire",
        namePlaceholder: "ex. Sunrise Diagnostics",
        email: "E-mail de contact",
        submit: "Enregistrer le laboratoire",
        required: "Veuillez saisir le nom du laboratoire et une adresse e-mail de contact.",
        failed: "Impossible d'enregistrer le laboratoire. Veuillez réessayer.",
        savedKey: "Laboratoire enregistré. Votre clé API est enregistrée sur cet appareil.",
      },
      scan: {
        title: "Scannez le QR code du patient",
        hint: "Demandez au patient d'ouvrir Evolve → Profil → Analyses et d'afficher le QR code.",
        start: "Démarrer la caméra",
        stop: "Arrêter la caméra",
        startFailed: "Impossible de démarrer la caméra. Autorisez l'accès et réessayez.",
        noPermission:
          "L'accès à la caméra est bloqué. Autorisez la caméra dans votre navigateur (icône cadenas dans la barre d'adresse) puis réessayez.",
        noCamera: "Aucune caméra trouvée sur cet appareil.",
      },
      verify: {
        title: "Vérifiez l'identité du patient",
        patientId: "ID du patient",
        takePhoto: "Prendre une photo du patient",
        photoAlt: "Photo du patient pour la vérification",
        checking: "Vérification…",
        confirm: "Comparer les visages",
        noFace: "Aucun visage détecté sur la photo. Veuillez prendre une autre photo.",
        photoError: "Impossible de traiter la photo. Veuillez réessayer.",
        failed: "Vérification échouée. Veuillez réessayer.",
        matched: "Identité confirmée — les visages correspondent.",
        unmatched: "Identité NON confirmée — les visages ne correspondent pas.",
        similarity: "Similarité",
      },
      report: {
        title: "Joindre le résultat d'analyse",
        hint: "Collez le texte brut du résultat. Il est analysé automatiquement.",
        placeholder: "Collez ici le texte du résultat…",
        submit: "Envoyer le résultat",
        submitting: "Envoi…",
        success: "Résultat envoyé. Il apparaîtra dans les rapports en attente du patient.",
        failed: "Impossible d'envoyer le résultat. Veuillez réessayer.",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "QR pour vérification sur site",
        patientQrHint:
          "Montrez ce code à un laboratoire partenaire. Il ne contient que votre ID — ni photo ni données de profil.",
        patientQrAria: "QR code patient pour vérification en laboratoire",
        patientQrError: "Impossible de générer le QR code.",
        faceVerified: "Visage vérifié",
        faceNotVerified: "Visage non vérifié",
      },
    },
  },
  es: {
    labPortal: {
      title: "Portal de laboratorio",
      subtitle:
        "Espacio de trabajo del laboratorio asociado. Verifique la identidad de un paciente y adjunte un resultado de análisis.",
      apiKey: "Clave API del laboratorio",
      newPatient: "Nuevo paciente",
      register: {
        name: "Nombre del laboratorio",
        namePlaceholder: "p. ej. Sunrise Diagnostics",
        email: "Correo de contacto",
        submit: "Registrar laboratorio",
        required: "Introduzca el nombre del laboratorio y un correo de contacto.",
        failed: "No se pudo registrar el laboratorio. Inténtelo de nuevo.",
        savedKey: "Laboratorio registrado. Su clave API se guardó en este dispositivo.",
      },
      scan: {
        title: "Escanee el código QR del paciente",
        hint: "Pida al paciente que abra Evolve → Perfil → Análisis de laboratorio y muestre el código QR.",
        start: "Iniciar cámara",
        stop: "Detener cámara",
        startFailed: "No se pudo iniciar la cámara. Permita el acceso y vuelva a intentarlo.",
        noPermission:
          "El acceso a la cámara está bloqueado. Permita la cámara en su navegador (icono de candado en la barra de direcciones) e inténtelo de nuevo.",
        noCamera: "No se encontró ninguna cámara en este dispositivo.",
      },
      verify: {
        title: "Verifique la identidad del paciente",
        patientId: "ID del paciente",
        takePhoto: "Tomar una foto del paciente",
        photoAlt: "Foto del paciente para verificación",
        checking: "Comprobando…",
        confirm: "Comparar rostros",
        noFace: "No se detectó ningún rostro en la foto. Tome otra foto.",
        photoError: "No se pudo procesar la foto. Inténtelo de nuevo.",
        failed: "La verificación falló. Inténtelo de nuevo.",
        matched: "Identidad confirmada: los rostros coinciden.",
        unmatched: "Identidad NO confirmada: los rostros no coinciden.",
        similarity: "Similitud",
      },
      report: {
        title: "Adjuntar el resultado del análisis",
        hint: "Pegue el texto bruto del resultado. Se analiza automáticamente.",
        placeholder: "Pegue aquí el texto del resultado…",
        submit: "Enviar resultado",
        submitting: "Enviando…",
        success: "Resultado enviado. Aparecerá en los informes pendientes del paciente.",
        failed: "No se pudo enviar el resultado. Inténtelo de nuevo.",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "QR para verificación en el lugar",
        patientQrHint:
          "Muestre este código a un laboratorio asociado. Solo contiene su ID, sin foto ni datos de perfil.",
        patientQrAria: "Código QR del paciente para verificación en laboratorio",
        patientQrError: "No se pudo generar el código QR.",
        faceVerified: "Rostro verificado",
        faceNotVerified: "Rostro no verificado",
      },
    },
  },
  pt: {
    labPortal: {
      title: "Portal do laboratório",
      subtitle:
        "Espaço de trabalho do laboratório parceiro. Verifique a identidade de um paciente e anexe um resultado de exame.",
      apiKey: "Chave de API do laboratório",
      newPatient: "Novo paciente",
      register: {
        name: "Nome do laboratório",
        namePlaceholder: "ex. Sunrise Diagnostics",
        email: "E-mail de contato",
        submit: "Registrar laboratório",
        required: "Informe o nome do laboratório e um e-mail de contato.",
        failed: "Não foi possível registrar o laboratório. Tente novamente.",
        savedKey: "Laboratório registrado. Sua chave de API foi salva neste dispositivo.",
      },
      scan: {
        title: "Escanee o QR code do paciente",
        hint: "Peça ao paciente para abrir Evolve → Perfil → Exames e mostrar o QR code.",
        start: "Iniciar câmera",
        stop: "Parar câmera",
        startFailed: "Não foi possível iniciar a câmera. Permita o acesso e tente novamente.",
        noPermission:
          "O acesso à câmera está bloqueado. Permita a câmera no navegador (ícone de cadeado na barra de endereços) e tente novamente.",
        noCamera: "Nenhuma câmera encontrada neste dispositivo.",
      },
      verify: {
        title: "Verifique a identidade do paciente",
        patientId: "ID do paciente",
        takePhoto: "Tirar uma foto do paciente",
        photoAlt: "Foto do paciente para verificação",
        checking: "Verificando…",
        confirm: "Comparar rostos",
        noFace: "Nenhum rosto detectado na foto. Tire outra foto.",
        photoError: "Não foi possível processar a foto. Tente novamente.",
        failed: "A verificação falhou. Tente novamente.",
        matched: "Identidade confirmada — os rostos coincidem.",
        unmatched: "Identidade NÃO confirmada — os rostos não coincidem.",
        similarity: "Similaridade",
      },
      report: {
        title: "Anexar o resultado do exame",
        hint: "Cole o texto bruto do resultado. Ele é analisado automaticamente.",
        placeholder: "Cole aqui o texto do resultado…",
        submit: "Enviar resultado",
        submitting: "Enviando…",
        success: "Resultado enviado. Ele aparecerá nos relatórios pendentes do paciente.",
        failed: "Não foi possível enviar o resultado. Tente novamente.",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "QR para verificação presencial",
        patientQrHint:
          "Mostre este código a um laboratório parceiro. Ele contém apenas seu ID — sem foto nem dados do perfil.",
        patientQrAria: "QR code do paciente para verificação no laboratório",
        patientQrError: "Não foi possível gerar o QR code.",
        faceVerified: "Rosto verificado",
        faceNotVerified: "Rosto não verificado",
      },
    },
  },
  ja: {
    labPortal: {
      title: "検査ラボポータル",
      subtitle: "提携ラボ用ワークスペース。患者の本人確認と検査結果の添付を行います。",
      apiKey: "ラボAPIキー",
      newPatient: "新しい患者",
      register: {
        name: "ラボ名",
        namePlaceholder: "例: Sunrise Diagnostics",
        email: "連絡先メール",
        submit: "ラボを登録",
        required: "ラボ名と連絡先メールを入力してください。",
        failed: "ラボを登録できませんでした。もう一度お試しください。",
        savedKey: "ラボを登録しました。APIキーはこのデバイスに保存されています。",
      },
      scan: {
        title: "患者のQRコードをスキャン",
        hint: "患者にEvolve → プロフィール → 検査を開いてQRコードを見せてもらいます。",
        start: "カメラを起動",
        stop: "カメラを停止",
        startFailed:
          "カメラを起動できませんでした。カメラへのアクセスを許可して再度お試しください。",
        noPermission:
          "カメラへのアクセスがブロックされています。ブラウザ（アドレスバーの鍵アイコン）でカメラを許可して再度お試しください。",
        noCamera: "このデバイスにカメラが見つかりません。",
      },
      verify: {
        title: "患者の本人確認",
        patientId: "患者ID",
        takePhoto: "患者の写真を撮影",
        photoAlt: "本人確認用の患者写真",
        checking: "確認中…",
        confirm: "顔を照合",
        noFace: "写真に顔が検出されませんでした。別の写真を撮ってください。",
        photoError: "写真を処理できませんでした。もう一度お試しください。",
        failed: "本人確認に失敗しました。もう一度お試しください。",
        matched: "本人確認が完了しました — 顔は一致しています。",
        unmatched: "本人確認ができませんでした — 顔が一致しません。",
        similarity: "類似度",
      },
      report: {
        title: "検査結果を添付",
        hint: "検査結果のテキストを貼り付けます。自動で解析されます。",
        placeholder: "ここに結果テキストを貼り付け…",
        submit: "結果を送信",
        submitting: "送信中…",
        success: "結果を送信しました。患者の保留中レポートに表示されます。",
        failed: "結果を送信できませんでした。もう一度お試しください。",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "来店時確認用QR",
        patientQrHint:
          "このコードを提携ラボに提示してください。IDのみを含み、写真やプロフィール情報は含まれません。",
        patientQrAria: "ラボでの本人確認用患者QRコード",
        patientQrError: "QRコードを生成できませんでした。",
        faceVerified: "顔認証済み",
        faceNotVerified: "顔認証なし",
      },
    },
  },
  ko: {
    labPortal: {
      title: "검사소 포털",
      subtitle: "제휴 검사소 작업 공간. 환자 신원을 확인하고 검사 결과를 첨부합니다.",
      apiKey: "검사소 API 키",
      newPatient: "새 환자",
      register: {
        name: "검사소 이름",
        namePlaceholder: "예: Sunrise Diagnostics",
        email: "연락처 이메일",
        submit: "검사소 등록",
        required: "검사소 이름과 연락처 이메일을 입력하세요.",
        failed: "검사소를 등록할 수 없습니다. 다시 시도하세요.",
        savedKey: "검사소가 등록되었습니다. API 키가 이 기기에 저장되었습니다.",
      },
      scan: {
        title: "환자 QR 코드 스캔",
        hint: "환자에게 Evolve → 프로필 → 검사를 열고 QR 코드를 보여달라고 하세요.",
        start: "카메라 시작",
        stop: "카메라 중지",
        startFailed: "카메라를 시작할 수 없습니다. 카메라 접근을 허용하고 다시 시도하세요.",
        noPermission:
          "카메라 접근이 차단되었습니다. 브라우저(주소 표시줄의 자물쇠 아이콘)에서 카메라를 허용하고 다시 시도하세요.",
        noCamera: "이 기기에서 카메라를 찾을 수 없습니다.",
      },
      verify: {
        title: "환자 신원 확인",
        patientId: "환자 ID",
        takePhoto: "환자 사진 촬영",
        photoAlt: "신원 확인용 환자 사진",
        checking: "확인 중…",
        confirm: "얼굴 매칭",
        noFace: "사진에서 얼굴이 감지되지 않았습니다. 다른 사진을 촬영하세요.",
        photoError: "사진을 처리할 수 없습니다. 다시 시도하세요.",
        failed: "신원 확인에 실패했습니다. 다시 시도하세요.",
        matched: "신원 확인 완료 — 얼굴이 일치합니다.",
        unmatched: "신원이 확인되지 않음 — 얼굴이 일치하지 않습니다.",
        similarity: "유사도",
      },
      report: {
        title: "검사 결과 첨부",
        hint: "검사 결과 원문 텍스트를 붙여넣으세요. 자동으로 분석됩니다.",
        placeholder: "여기에 결과 텍스트 붙여넣기…",
        submit: "결과 제출",
        submitting: "제출 중…",
        success: "결과가 제출되었습니다. 환자의 대기 보고서에 표시됩니다.",
        failed: "결과를 제출할 수 없습니다. 다시 시도하세요.",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "현장 확인용 QR",
        patientQrHint:
          "이 코드를 제휴 검사소에 보여주세요. ID만 포함하며 사진이나 프로필 정보는 포함하지 않습니다.",
        patientQrAria: "검사소 신원 확인용 환자 QR 코드",
        patientQrError: "QR 코드를 생성할 수 없습니다.",
        faceVerified: "얼굴 인증됨",
        faceNotVerified: "얼굴 인증 안 됨",
      },
    },
  },
  zh: {
    labPortal: {
      title: "检测实验室门户",
      subtitle: "合作实验室工作区。验证患者身份并附加检测结果。",
      apiKey: "实验室 API 密钥",
      newPatient: "新患者",
      register: {
        name: "实验室名称",
        namePlaceholder: "例如 Sunrise Diagnostics",
        email: "联系邮箱",
        submit: "注册实验室",
        required: "请输入实验室名称和联系邮箱。",
        failed: "无法注册实验室。请重试。",
        savedKey: "实验室已注册。您的 API 密钥已保存在此设备上。",
      },
      scan: {
        title: "扫描患者二维码",
        hint: "请患者打开 Evolve → 个人资料 → 检测并出示二维码。",
        start: "启动摄像头",
        stop: "停止摄像头",
        startFailed: "无法启动摄像头。请允许访问摄像头后重试。",
        noPermission: "摄像头访问已被阻止。请在浏览器中（地址栏的锁形图标）允许访问摄像头后重试。",
        noCamera: "未在此设备上找到摄像头。",
      },
      verify: {
        title: "验证患者身份",
        patientId: "患者 ID",
        takePhoto: "拍摄患者照片",
        photoAlt: "用于验证的患者照片",
        checking: "检查中…",
        confirm: "比对面部",
        noFace: "照片中未检测到面部。请重新拍摄。",
        photoError: "无法处理照片。请重试。",
        failed: "验证失败。请重试。",
        matched: "身份已确认 — 面部匹配。",
        unmatched: "身份未确认 — 面部不匹配。",
        similarity: "相似度",
      },
      report: {
        title: "附加检测结果",
        hint: "粘贴检测结果原始文本。系统将自动解析。",
        placeholder: "在此粘贴结果文本…",
        submit: "提交结果",
        submitting: "提交中…",
        success: "结果已提交。将显示在患者的待处理报告中。",
        failed: "无法提交结果。请重试。",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "现场验证二维码",
        patientQrHint: "向合作实验室出示此代码。它只包含您的 ID，不含照片或个人资料。",
        patientQrAria: "用于实验室身份验证的患者二维码",
        patientQrError: "无法生成二维码。",
        faceVerified: "面部已验证",
        faceNotVerified: "面部未验证",
      },
    },
  },
  ar: {
    labPortal: {
      title: "بوابة المختبر",
      subtitle: "مساحة عمل المختبر الشريك. تحقق من هوية المريض وأرفق نتيجة التحليل.",
      apiKey: "مفتاح API للمختبر",
      newPatient: "مريض جديد",
      register: {
        name: "اسم المختبر",
        namePlaceholder: "مثال: Sunrise Diagnostics",
        email: "البريد الإلكتروني للتواصل",
        submit: "تسجيل المختبر",
        required: "يرجى إدخال اسم المختبر والبريد الإلكتروني للتواصل.",
        failed: "تعذر تسجيل المختبر. حاول مرة أخرى.",
        savedKey: "تم تسجيل المختبر. تم حفظ مفتاح API على هذا الجهاز.",
      },
      scan: {
        title: "امسح رمز QR الخاص بالمريض",
        hint: "اطلب من المريض فتح Evolve ← الملف الشخصي ← الفحوصات وإظهار رمز QR.",
        start: "تشغيل الكاميرا",
        stop: "إيقاف الكاميرا",
        startFailed: "تعذر تشغيل الكاميرا. اسمح بالوصول إلى الكاميرا وحاول مرة أخرى.",
        noPermission:
          "تم حظر الوصول إلى الكاميرا. اسمح بالوصول إلى الكاميرا في المتصفح (أيقونة القفل في شريط العنوان) ثم حاول مرة أخرى.",
        noCamera: "لم يتم العثور على كاميرا على هذا الجهاز.",
      },
      verify: {
        title: "تحقق من هوية المريض",
        patientId: "معرف المريض",
        takePhoto: "التقاط صورة للمريض",
        photoAlt: "صورة المريض للتحقق",
        checking: "جارٍ التحقق…",
        confirm: "مطابقة الوجوه",
        noFace: "لم يتم اكتشاف وجه في الصورة. يرجى التقاط صورة أخرى.",
        photoError: "تعذر معالجة الصورة. حاول مرة أخرى.",
        failed: "فشل التحقق. حاول مرة أخرى.",
        matched: "تم تأكيد الهوية — الوجوه متطابقة.",
        unmatched: "لم يتم تأكيد الهوية — الوجوه غير متطابقة.",
        similarity: "التشابه",
      },
      report: {
        title: "إرفاق نتيجة التحليل",
        hint: "الصق نص النتيجة الخام. سيتم تحليله تلقائيًا.",
        placeholder: "الصق نص النتيجة هنا…",
        submit: "إرسال النتيجة",
        submitting: "جارٍ الإرسال…",
        success: "تم إرسال النتيجة. ستظهر في التقارير المعلقة للمريض.",
        failed: "تعذر إرسال النتيجة. حاول مرة أخرى.",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "رمز QR للتحقق في الموقع",
        patientQrHint:
          "اعرض هذا الرمز على المختبر الشريك. يحتوي على معرفك فقط — بدون صورة أو بيانات ملف شخصي.",
        patientQrAria: "رمز QR للمريض للتحقق في المختبر",
        patientQrError: "تعذر إنشاء رمز QR.",
        faceVerified: "تم التحقق من الوجه",
        faceNotVerified: "لم يتم التحقق من الوجه",
      },
    },
  },
  vi: {
    labPortal: {
      title: "Cổng phòng xét nghiệm",
      subtitle:
        "Không gian làm việc của phòng xét nghiệm đối tác. Xác minh danh tính bệnh nhân và đính kèm kết quả xét nghiệm.",
      apiKey: "Khóa API phòng xét nghiệm",
      newPatient: "Bệnh nhân mới",
      register: {
        name: "Tên phòng xét nghiệm",
        namePlaceholder: "vd: Sunrise Diagnostics",
        email: "Email liên hệ",
        submit: "Đăng ký phòng xét nghiệm",
        required: "Vui lòng nhập tên phòng xét nghiệm và email liên hệ.",
        failed: "Không thể đăng ký phòng xét nghiệm. Vui lòng thử lại.",
        savedKey: "Đã đăng ký. Khóa API của bạn được lưu trên thiết bị này.",
      },
      scan: {
        title: "Quét mã QR của bệnh nhân",
        hint: "Yêu cầu bệnh nhân mở Evolve → Hồ sơ → Xét nghiệm và hiển thị mã QR.",
        start: "Bật camera",
        stop: "Tắt camera",
        startFailed: "Không thể bật camera. Vui lòng cho phép truy cập camera và thử lại.",
        noPermission:
          "Quyền truy cập camera bị chặn. Vui lòng cho phép camera trong trình duyệt (biểu tượng ổ khóa trên thanh địa chỉ) rồi thử lại.",
        noCamera: "Không tìm thấy camera trên thiết bị này.",
      },
      verify: {
        title: "Xác minh danh tính bệnh nhân",
        patientId: "ID bệnh nhân",
        takePhoto: "Chụp ảnh bệnh nhân",
        photoAlt: "Ảnh bệnh nhân để xác minh",
        checking: "Đang kiểm tra…",
        confirm: "So khớp khuôn mặt",
        noFace: "Không phát hiện khuôn mặt trong ảnh. Vui lòng chụp ảnh khác.",
        photoError: "Không thể xử lý ảnh. Vui lòng thử lại.",
        failed: "Xác minh thất bại. Vui lòng thử lại.",
        matched: "Đã xác nhận danh tính — khuôn mặt khớp.",
        unmatched: "Chưa xác nhận danh tính — khuôn mặt không khớp.",
        similarity: "Độ tương đồng",
      },
      report: {
        title: "Đính kèm kết quả xét nghiệm",
        hint: "Dán văn bản kết quả thô. Nó sẽ được phân tích tự động.",
        placeholder: "Dán văn bản kết quả vào đây…",
        submit: "Gửi kết quả",
        submitting: "Đang gửi…",
        success: "Đã gửi kết quả. Nó sẽ xuất hiện trong báo cáo chờ xử lý của bệnh nhân.",
        failed: "Không thể gửi kết quả. Vui lòng thử lại.",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "Mã QR xác minh tại chỗ",
        patientQrHint:
          "Hiển thị mã này cho phòng xét nghiệm đối tác. Mã chỉ chứa ID của bạn — không có ảnh hay dữ liệu hồ sơ.",
        patientQrAria: "Mã QR bệnh nhân để xác minh tại phòng xét nghiệm",
        patientQrError: "Không thể tạo mã QR.",
        faceVerified: "Đã xác minh khuôn mặt",
        faceNotVerified: "Chưa xác minh khuôn mặt",
      },
    },
  },
  hi: {
    labPortal: {
      title: "प्रयोगशाला पोर्टल",
      subtitle:
        "साझेदार प्रयोगशाला कार्यक्षेत्र। रोगी की पहचान सत्यापित करें और परीक्षण परिणाम संलग्न करें।",
      apiKey: "प्रयोगशाला API कुंजी",
      newPatient: "नया रोगी",
      register: {
        name: "प्रयोगशाला का नाम",
        namePlaceholder: "जैसे: Sunrise Diagnostics",
        email: "संपर्क ईमेल",
        submit: "प्रयोगशाला पंजीकृत करें",
        required: "कृपया प्रयोगशाला का नाम और संपर्क ईमेल दर्ज करें।",
        failed: "प्रयोगशाला पंजीकृत नहीं की जा सकी। कृपया पुनः प्रयास करें।",
        savedKey: "प्रयोगशाला पंजीकृत हुई। आपकी API कुंजी इस डिवाइस पर सहेजी गई है।",
      },
      scan: {
        title: "रोगी का QR कोड स्कैन करें",
        hint: "रोगी से Evolve → प्रोफ़ाइल → परीक्षण खोलकर QR कोड दिखाने को कहें।",
        start: "कैमरा शुरू करें",
        stop: "कैमरा बंद करें",
        startFailed: "कैमरा शुरू नहीं हो सका। कैमरा अनुमति दें और पुनः प्रयास करें।",
        noPermission:
          "कैमरा एक्सेस अवरुद्ध है। ब्राउज़र में कैमरा अनुमति दें (एड्रेस बार में ताला आइकन) और पुनः प्रयास करें।",
        noCamera: "इस डिवाइस पर कोई कैमरा नहीं मिला।",
      },
      verify: {
        title: "रोगी की पहचान सत्यापित करें",
        patientId: "रोगी ID",
        takePhoto: "रोगी का फोटो लें",
        photoAlt: "सत्यापन के लिए रोगी का फोटो",
        checking: "जाँच हो रही है…",
        confirm: "चेहरे मिलाएँ",
        noFace: "फोटो में कोई चेहरा नहीं मिला। कृपया दूसरा फोटो लें।",
        photoError: "फोटो संसाधित नहीं हो सकी। कृपया पुनः प्रयास करें।",
        failed: "सत्यापन विफल रहा। कृपया पुनः प्रयास करें।",
        matched: "पहचान की पुष्टि हुई — चेहरे मेल खाते हैं।",
        unmatched: "पहचान की पुष्टि नहीं हुई — चेहरे मेल नहीं खाते।",
        similarity: "समानता",
      },
      report: {
        title: "परीक्षण परिणाम संलग्न करें",
        hint: "परिणाम का मूल पाठ चिपकाएँ। यह स्वतः विश्लेषित होगा।",
        placeholder: "परिणाम का पाठ यहाँ चिपकाएँ…",
        submit: "परिणाम जमा करें",
        submitting: "जमा हो रहा है…",
        success: "परिणाम जमा हो गया। यह रोगी के लंबित रिपोर्ट में दिखाई देगा।",
        failed: "परिणाम जमा नहीं हो सका। कृपया पुनः प्रयास करें।",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "स्थल पर सत्यापन हेतु QR",
        patientQrHint:
          "यह कोड साझेदार प्रयोगशाला को दिखाएँ। इसमें केवल आपकी ID है — कोई फोटो या प्रोफ़ाइल डेटा नहीं।",
        patientQrAria: "प्रयोगशाला सत्यापन हेतु रोगी QR कोड",
        patientQrError: "QR कोड उत्पन्न नहीं हो सका।",
        faceVerified: "चेहरा सत्यापित",
        faceNotVerified: "चेहरा सत्यापित नहीं",
      },
    },
  },
  tr: {
    labPortal: {
      title: "Laboratuvar Portalı",
      subtitle:
        "Partner laboratuvar çalışma alanı. Hastanın kimliğini doğrulayın ve test sonucunu ekleyin.",
      apiKey: "Laboratuvar API anahtarı",
      newPatient: "Yeni hasta",
      register: {
        name: "Laboratuvar adı",
        namePlaceholder: "örn. Sunrise Diagnostics",
        email: "İletişim e-postası",
        submit: "Laboratuvarı kaydet",
        required: "Lütfen laboratuvar adını ve iletişim e-postasını girin.",
        failed: "Laboratuvar kaydedilemedi. Lütfen tekrar deneyin.",
        savedKey: "Laboratuvar kaydedildi. API anahtarınız bu cihaza saklandı.",
      },
      scan: {
        title: "Hastanın QR kodunu tarayın",
        hint: "Hastadan Evolve → Profil → Testler bölümünü açıp QR kodunu göstermesini isteyin.",
        start: "Kamerayı başlat",
        stop: "Kamerayı durdur",
        startFailed: "Kamera başlatılamadı. Lütfen kamera erişimine izin verin ve tekrar deneyin.",
        noPermission:
          "Kamera erişimi engellendi. Tarayıcıda kameraya izin verin (adres çubuğundaki kilit simgesi) ve tekrar deneyin.",
        noCamera: "Bu cihazda kamera bulunamadı.",
      },
      verify: {
        title: "Hastanın kimliğini doğrulayın",
        patientId: "Hasta kimliği",
        takePhoto: "Hastanın fotoğrafını çek",
        photoAlt: "Doğrulama için hasta fotoğrafı",
        checking: "Kontrol ediliyor…",
        confirm: "Yüzleri eşleştir",
        noFace: "Fotoğrafta yüz algılanamadı. Lütfen başka bir fotoğraf çekin.",
        photoError: "Fotoğraf işlenemedi. Lütfen tekrar deneyin.",
        failed: "Doğrulama başarısız oldu. Lütfen tekrar deneyin.",
        matched: "Kimlik doğrulandı — yüzler eşleşiyor.",
        unmatched: "Kimlik doğrulanamadı — yüzler eşleşmiyor.",
        similarity: "Benzerlik",
      },
      report: {
        title: "Test sonucunu ekleyin",
        hint: "Sonucun ham metnini yapıştırın. Otomatik olarak ayrıştırılır.",
        placeholder: "Sonuç metnini buraya yapıştırın…",
        submit: "Sonucu gönder",
        submitting: "Gönderiliyor…",
        success: "Sonuç gönderildi. Hastanın bekleyen raporlarında görünecektir.",
        failed: "Sonuç gönderilemedi. Lütfen tekrar deneyin.",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "Yerinde doğrulama için QR",
        patientQrHint:
          "Bu kodu partner laboratuvara gösterin. Yalnızca kimliğinizi içerir — fotoğraf veya profil verisi yok.",
        patientQrAria: "Laboratuvar doğrulaması için hasta QR kodu",
        patientQrError: "QR kodu oluşturulamadı.",
        faceVerified: "Yüz doğrulandı",
        faceNotVerified: "Yüz doğrulanmadı",
      },
    },
  },
  th: {
    labPortal: {
      title: "พอร์ทัลห้องปฏิบัติการ",
      subtitle: "พื้นที่ทำงานของห้องปฏิบัติการพันธมิตร ตรวจสอบตัวตนผู้ป่วยและแนบผลตรวจ",
      apiKey: "คีย์ API ของห้องปฏิบัติการ",
      newPatient: "ผู้ป่วยใหม่",
      register: {
        name: "ชื่อห้องปฏิบัติการ",
        namePlaceholder: "เช่น Sunrise Diagnostics",
        email: "อีเมลติดต่อ",
        submit: "ลงทะเบียนห้องปฏิบัติการ",
        required: "กรุณากรอกชื่อห้องปฏิบัติการและอีเมลติดต่อ",
        failed: "ไม่สามารถลงทะเบียนห้องปฏิบัติการได้ กรุณาลองอีกครั้ง",
        savedKey: "ลงทะเบียนแล้ว คีย์ API ของคุณถูกบันทึกบนอุปกรณ์นี้",
      },
      scan: {
        title: "สแกน QR โค้ดผู้ป่วย",
        hint: "ขอให้ผู้ป่วยเปิด Evolve → โปรไฟล์ → การตรวจ แล้วแสดง QR โค้ด",
        start: "เปิดกล้อง",
        stop: "ปิดกล้อง",
        startFailed: "ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการเข้าถึงกล้องแล้วลองอีกครั้ง",
        noPermission:
          "การเข้าถึงกล้องถูกบล็อก โปรดอนุญาตกล้องในเบราว์เซอร์ (ไอคอนกุญแจในแถบที่อยู่) แล้วลองอีกครั้ง",
        noCamera: "ไม่พบกล้องบนอุปกรณ์นี้",
      },
      verify: {
        title: "ตรวจสอบตัวตนผู้ป่วย",
        patientId: "ID ผู้ป่วย",
        takePhoto: "ถ่ายภาพผู้ป่วย",
        photoAlt: "ภาพผู้ป่วยสำหรับการตรวจสอบ",
        checking: "กำลังตรวจสอบ…",
        confirm: "เปรียบเทียบใบหน้า",
        noFace: "ไม่พบใบหน้าในภาพ กรุณาถ่ายภาพใหม่",
        photoError: "ไม่สามารถประมวลผลภาพได้ กรุณาลองอีกครั้ง",
        failed: "การตรวจสอบล้มเหลว กรุณาลองอีกครั้ง",
        matched: "ยืนยันตัวตนแล้ว — ใบหน้าตรงกัน",
        unmatched: "ไม่สามารถยืนยันตัวตนได้ — ใบหน้าไม่ตรงกัน",
        similarity: "ความคล้ายคลึง",
      },
      report: {
        title: "แนบผลตรวจ",
        hint: "วางข้อความผลตรวจดิบ มันจะถูกวิเคราะห์โดยอัตโนมัติ",
        placeholder: "วางข้อความผลตรวจที่นี่…",
        submit: "ส่งผล",
        submitting: "กำลังส่ง…",
        success: "ส่งผลแล้ว จะปรากฏในรายงานรอการยืนยันของผู้ป่วย",
        failed: "ไม่สามารถส่งผลได้ กรุณาลองอีกครั้ง",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "QR สำหรับตรวจสอบ ณ สถานที่",
        patientQrHint:
          "แสดงโค้ดนี้แก่ห้องปฏิบัติการพันธมิตร มันมีเพียง ID ของคุณ — ไม่มีภาพหรือข้อมูลโปรไฟล์",
        patientQrAria: "QR โค้ดผู้ป่วยสำหรับตรวจสอบที่ห้องปฏิบัติการ",
        patientQrError: "ไม่สามารถสร้าง QR โค้ดได้",
        faceVerified: "ยืนยันใบหน้าแล้ว",
        faceNotVerified: "ยังไม่ยืนยันใบหน้า",
      },
    },
  },
  id: {
    labPortal: {
      title: "Portal Laboratorium",
      subtitle:
        "Ruang kerja laboratorium mitra. Verifikasi identitas pasien dan lampirkan hasil tes.",
      apiKey: "Kunci API laboratorium",
      newPatient: "Pasien baru",
      register: {
        name: "Nama laboratorium",
        namePlaceholder: "mis. Sunrise Diagnostics",
        email: "Email kontak",
        submit: "Daftarkan laboratorium",
        required: "Masukkan nama laboratorium dan email kontak.",
        failed: "Tidak dapat mendaftarkan laboratorium. Silakan coba lagi.",
        savedKey: "Laboratorium terdaftar. Kunci API Anda disimpan di perangkat ini.",
      },
      scan: {
        title: "Pindai QR code pasien",
        hint: "Minta pasien membuka Evolve → Profil → Tes dan menunjukkan QR code.",
        start: "Mulai kamera",
        stop: "Hentikan kamera",
        startFailed: "Tidak dapat memulai kamera. Izinkan akses kamera dan coba lagi.",
        noPermission:
          "Akses kamera diblokir. Izinkan kamera di browser Anda (ikon gembok di bilah alamat) lalu coba lagi.",
        noCamera: "Tidak ada kamera yang ditemukan di perangkat ini.",
      },
      verify: {
        title: "Verifikasi identitas pasien",
        patientId: "ID pasien",
        takePhoto: "Ambil foto pasien",
        photoAlt: "Foto pasien untuk verifikasi",
        checking: "Memeriksa…",
        confirm: "Cocokkan wajah",
        noFace: "Tidak ada wajah terdeteksi di foto. Ambil foto lain.",
        photoError: "Tidak dapat memproses foto. Silakan coba lagi.",
        failed: "Verifikasi gagal. Silakan coba lagi.",
        matched: "Identitas dikonfirmasi — wajah cocok.",
        unmatched: "Identitas TIDAK dikonfirmasi — wajah tidak cocok.",
        similarity: "Kemiripan",
      },
      report: {
        title: "Lampirkan hasil tes",
        hint: "Tempel teks mentah hasil. Ini akan diurai secara otomatis.",
        placeholder: "Tempel teks hasil di sini…",
        submit: "Kirim hasil",
        submitting: "Mengirim…",
        success: "Hasil terkirim. Ini akan muncul di laporan tertunda pasien.",
        failed: "Tidak dapat mengirim hasil. Silakan coba lagi.",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "QR untuk verifikasi di tempat",
        patientQrHint:
          "Tunjukkan kode ini ke laboratorium mitra. Ini hanya berisi ID Anda — tanpa foto atau data profil.",
        patientQrAria: "QR code pasien untuk verifikasi di laboratorium",
        patientQrError: "Tidak dapat membuat QR code.",
        faceVerified: "Wajah terverifikasi",
        faceNotVerified: "Wajah belum terverifikasi",
      },
    },
  },
  ms: {
    labPortal: {
      title: "Portal Makmal",
      subtitle:
        "Ruang kerja makmal rakan kongsi. Sahkan identiti pesakit dan lampirkan keputusan ujian.",
      apiKey: "Kunci API makmal",
      newPatient: "Pesakit baharu",
      register: {
        name: "Nama makmal",
        namePlaceholder: "cth: Sunrise Diagnostics",
        email: "E-mel hubungan",
        submit: "Daftar makmal",
        required: "Sila masukkan nama makmal dan e-mel hubungan.",
        failed: "Tidak dapat mendaftar makmal. Sila cuba lagi.",
        savedKey: "Makmal didaftarkan. Kunci API anda disimpan pada peranti ini.",
      },
      scan: {
        title: "Imbas kod QR pesakit",
        hint: "Minta pesakit membuka Evolve → Profil → Ujian dan menunjukkan kod QR.",
        start: "Mula kamera",
        stop: "Henti kamera",
        startFailed: "Tidak dapat memulakan kamera. Sila benarkan akses kamera dan cuba lagi.",
        noPermission:
          "Akses kamera disekat. Benarkan kamera dalam pelayar anda (ikon kunci pada bar alamat) dan cuba lagi.",
        noCamera: "Tiada kamera ditemui pada peranti ini.",
      },
      verify: {
        title: "Sahkan identiti pesakit",
        patientId: "ID pesakit",
        takePhoto: "Ambil gambar pesakit",
        photoAlt: "Gambar pesakit untuk pengesahan",
        checking: "Menyemak…",
        confirm: "Padankan wajah",
        noFace: "Tiada wajah dikesan dalam gambar. Sila ambil gambar lain.",
        photoError: "Tidak dapat memproses gambar. Sila cuba lagi.",
        failed: "Pengesahan gagal. Sila cuba lagi.",
        matched: "Identiti disahkan — wajah sepadan.",
        unmatched: "Identiti TIDAK disahkan — wajah tidak sepadan.",
        similarity: "Persamaan",
      },
      report: {
        title: "Lampirkan keputusan ujian",
        hint: "Tampal teks mentah keputusan. Ia akan dianalisis secara automatik.",
        placeholder: "Tampal teks keputusan di sini…",
        submit: "Hantar keputusan",
        submitting: "Menghantar…",
        success: "Keputusan dihantar. Ia akan muncul dalam laporan pesakit yang belum selesai.",
        failed: "Tidak dapat menghantar keputusan. Sila cuba lagi.",
      },
    },
    profile: {
      lab: {
        patientQrTitle: "QR untuk pengesahan di tempat",
        patientQrHint:
          "Tunjukkan kod ini kepada makmal rakan kongsi. Ia hanya mengandungi ID anda — tiada gambar atau data profil.",
        patientQrAria: "Kod QR pesakit untuk pengesahan di makmal",
        patientQrError: "Tidak dapat menjana kod QR.",
        faceVerified: "Wajah disahkan",
        faceNotVerified: "Wajah belum disahkan",
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

function buildLabPortal(locale) {
  const n = natural[locale];
  if (!n) return deepClone(en);
  return deepMerge(deepClone(en), n);
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, ""); // e.g. "uk", "zh-TW"
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));

  // Add labPortal.* + profile.lab.* new keys (preserve existing).
  existing.labPortal = deepMerge(existing.labPortal || {}, buildLabPortal(locale).labPortal);
  existing.profile = deepMerge(existing.profile || {}, buildLabPortal(locale).profile);

  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

// Validate every file parses and has the required keys.
let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const lp = j.labPortal || {};
    const lab = (j.profile || {}).lab || {};
    if (
      !lp.title ||
      !lp.register ||
      !lp.register.submit ||
      !lp.scan ||
      !lp.scan.start ||
      !lp.verify ||
      !lp.verify.confirm ||
      !lp.report ||
      !lp.report.submit ||
      !lab.patientQrTitle ||
      !lab.faceVerified ||
      !lab.faceNotVerified
    ) {
      bad.push(f);
    }
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : "ALL 33 LOCALES VALID");
