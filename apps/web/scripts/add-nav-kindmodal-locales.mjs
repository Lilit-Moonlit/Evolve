/**
 * Adds the header-nav and kind-modal keys to every locale JSON file in
 * apps/web/src/i18n/locales/:
 *   - navigation.downloadApp  ("Завантажити додаток" — PWA install in nav)
 *   - kindModal.description / kindModal.confirm (mandatory profile-kind modal)
 *
 * Deterministic, non-LLM: preserves all existing keys via deep merge.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, "../src/i18n/locales");
const files = fs.readdirSync(localesDir).filter((f) => f.endsWith(".json"));

// English source.
const en = {
  navigation: {
    downloadApp: "Download app",
  },
  kindModal: {
    description: "Choose who you are — this is required for search to work correctly",
    confirm: "Confirm",
  },
};

// Natural translations (fallback = English).
const natural = {
  uk: {
    navigation: { downloadApp: "Завантажити додаток" },
    kindModal: {
      description: "Оберіть, ким ви є — це потрібно для коректної роботи пошуку",
      confirm: "Підтвердити",
    },
  },
  ru: {
    navigation: { downloadApp: "Скачать приложение" },
    kindModal: {
      description: "Выберите, кем вы являетесь — это необходимо для корректной работы поиска",
      confirm: "Подтвердить",
    },
  },
  de: {
    navigation: { downloadApp: "App herunterladen" },
    kindModal: {
      description: "Wählen Sie, wer Sie sind – das ist für eine korrekte Suche erforderlich",
      confirm: "Bestätigen",
    },
  },
  fr: {
    navigation: { downloadApp: "Télécharger l'application" },
    kindModal: {
      description:
        "Choisissez qui vous êtes — nécessaire pour que la recherche fonctionne correctement",
      confirm: "Confirmer",
    },
  },
  es: {
    navigation: { downloadApp: "Descargar la aplicación" },
    kindModal: {
      description: "Elige quién eres: es necesario para que la búsqueda funcione correctamente",
      confirm: "Confirmar",
    },
  },
  pt: {
    navigation: { downloadApp: "Descarregar a aplicação" },
    kindModal: {
      description: "Escolha quem você é — isso é necessário para a busca funcionar corretamente",
      confirm: "Confirmar",
    },
  },
  it: {
    navigation: { downloadApp: "Scarica l'app" },
    kindModal: {
      description: "Scegli chi sei: è necessario affinché la ricerca funzioni correttamente",
      confirm: "Conferma",
    },
  },
  nl: {
    navigation: { downloadApp: "App downloaden" },
    kindModal: {
      description: "Kies wie je bent — dit is nodig zodat zoeken correct werkt",
      confirm: "Bevestigen",
    },
  },
  pl: {
    navigation: { downloadApp: "Pobierz aplikację" },
    kindModal: {
      description: "Wybierz, kim jesteś — to konieczne, aby wyszukiwanie działało poprawnie",
      confirm: "Potwierdź",
    },
  },
  ja: {
    navigation: { downloadApp: "アプリをダウンロード" },
    kindModal: {
      description: "あなたが誰かを選択してください。検索を正しく機能させるために必要です",
      confirm: "確認する",
    },
  },
  "zh-TW": {
    navigation: { downloadApp: "下載應用程式" },
    kindModal: {
      description: "請選擇您的身份——搜尋功能需要此資訊才能正確運作",
      confirm: "確認",
    },
  },
  ar: {
    navigation: { downloadApp: "تحميل التطبيق" },
    kindModal: {
      description: "اختر من تكون — هذا مطلوب لكي يعمل البحث بشكل صحيح",
      confirm: "تأكيد",
    },
  },
  vi: {
    navigation: { downloadApp: "Tải ứng dụng" },
    kindModal: {
      description: "Hãy chọn bạn là ai — điều này cần thiết để tìm kiếm hoạt động chính xác",
      confirm: "Xác nhận",
    },
  },
  bg: {
    navigation: { downloadApp: "Изтегли приложението" },
    kindModal: {
      description: "Изберете кой сте — това е необходимо за коректна работа на търсенето",
      confirm: "Потвърдете",
    },
  },
  cs: {
    navigation: { downloadApp: "Stáhnout aplikaci" },
    kindModal: {
      description: "Vyberte, kdo jste — je to nutné pro správné fungování vyhledávání",
      confirm: "Potvrdit",
    },
  },
  da: {
    navigation: { downloadApp: "Download appen" },
    kindModal: {
      description: "Vælg, hvem du er — dette er nødvendigt for at søgningen fungerer korrekt",
      confirm: "Bekræft",
    },
  },
  sv: {
    navigation: { downloadApp: "Ladda ner appen" },
    kindModal: {
      description: "Välj vem du är – detta krävs för att sökningen ska fungera korrekt",
      confirm: "Bekräfta",
    },
  },
  nb: {
    navigation: { downloadApp: "Last ned appen" },
    kindModal: {
      description: "Velg hvem du er – dette kreves for at søket skal fungere riktig",
      confirm: "Bekreft",
    },
  },
  fi: {
    navigation: { downloadApp: "Lataa sovellus" },
    kindModal: {
      description: "Valitse, kuka olet – vaaditaan, jotta haku toimii oikein",
      confirm: "Vahvista",
    },
  },
  el: {
    navigation: { downloadApp: "Λήψη εφαρμογής" },
    kindModal: {
      description: "Επιλέξτε ποιοι είστε — απαιτείται για τη σωστή λειτουργία της αναζήτησης",
      confirm: "Επιβεβαίωση",
    },
  },
  he: {
    navigation: { downloadApp: "הורדת האפליקציה" },
    kindModal: {
      description: "בחרו מי אתם — הדבר נדרש כדי שהחיפוש יעבוד כראוי",
      confirm: "אישור",
    },
  },
  hr: {
    navigation: { downloadApp: "Preuzmi aplikaciju" },
    kindModal: {
      description: "Odaberite tko ste — to je potrebno da bi pretraživanje ispravno radilo",
      confirm: "Potvrdi",
    },
  },
  hu: {
    navigation: { downloadApp: "Alkalmazás letöltése" },
    kindModal: {
      description: "Válassza ki, ki Ön – ez a keresés helyes működéséhez szükséges",
      confirm: "Megerősítés",
    },
  },
  ro: {
    navigation: { downloadApp: "Descarcă aplicația" },
    kindModal: {
      description: "Alegeți cine sunteți — este necesar pentru ca căutarea să funcționeze corect",
      confirm: "Confirmați",
    },
  },
  sk: {
    navigation: { downloadApp: "Stiahnuť aplikáciu" },
    kindModal: {
      description: "Vyberte, kto ste — je to potrebné pre správne fungovanie vyhľadávania",
      confirm: "Potvrdiť",
    },
  },
  sl: {
    navigation: { downloadApp: "Prenesi aplikacijo" },
    kindModal: {
      description: "Izberite, kdo ste — potrebno za pravilno delovanje iskanja",
      confirm: "Potrdi",
    },
  },
  lt: {
    navigation: { downloadApp: "Atsisiųsti programėlę" },
    kindModal: {
      description: "Pasirinkite, kas esate — tai būtina, kad paieška veiktų tinkamai",
      confirm: "Patvirtinti",
    },
  },
  lv: {
    navigation: { downloadApp: "Lejupielādēt lietotni" },
    kindModal: {
      description:
        "Izvēlieties, kas jūs esat — tas ir nepieciešams, lai meklēšana darbotos pareizi",
      confirm: "Apstiprināt",
    },
  },
  et: {
    navigation: { downloadApp: "Laadi alla rakendus" },
    kindModal: {
      description: "Valige, kes te olete — see on vajalik, et otsing töötaks õigesti",
      confirm: "Kinnita",
    },
  },
  is: {
    navigation: { downloadApp: "Sækið appið" },
    kindModal: {
      description: "Veldu hver þú ert — þetta er nauðsynlegt til að leit virki rétt",
      confirm: "Staðfesta",
    },
  },
  sw: {
    navigation: { downloadApp: "Pakua programu" },
    kindModal: {
      description: "Chagua wewe ni nani — hii inahitajika ili utafutaji ufanye kazi vizuri",
      confirm: "Thibitisha",
    },
  },
  fil: {
    navigation: { downloadApp: "I-download ang app" },
    kindModal: {
      description:
        "Piliin kung sino kayo — kinakailangan ito upang gumana nang tama ang paghahanap",
      confirm: "Kumpirmahin",
    },
  },
  ne: {
    navigation: { downloadApp: "एप डाउनलोड गर्नुहोस्" },
    kindModal: {
      description: "तपाईं को हुनुहुन्छ छान्नुहोस् — खोज सही रूपमा काम गर्न यो आवश्यक छ",
      confirm: "पुष्टि गर्नुहोस्",
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

function buildData(locale) {
  const n = natural[locale];
  return n ? deepMerge(en, n) : en;
}

let changed = 0;
for (const f of files) {
  const locale = f.replace(/\.json$/, "");
  const file = path.join(localesDir, f);
  const existing = JSON.parse(fs.readFileSync(file, "utf8"));

  const data = buildData(locale);
  existing.navigation = deepMerge(existing.navigation || {}, data.navigation);
  existing.kindModal = deepMerge(existing.kindModal || {}, data.kindModal);

  fs.writeFileSync(file, JSON.stringify(existing, null, 2) + "\n");
  changed++;
}

console.log(`Updated ${changed} locale files.`);

// Validate every file parses and has the required keys.
let bad = [];
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(localesDir, f), "utf8"));
    const nav = j.navigation || {};
    const km = j.kindModal || {};
    if (!("downloadApp" in nav) || !("description" in km) || !("confirm" in km)) {
      bad.push(f);
    }
  } catch (e) {
    bad.push(`${f}: ${e.message}`);
  }
}
console.log(
  bad.length ? `VALIDATION FAILED: ${bad.join(", ")}` : `ALL ${files.length} LOCALES VALID`,
);
