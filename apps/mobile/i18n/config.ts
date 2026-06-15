import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import it from "./locales/it.json";
import pt from "./locales/pt.json";
import nl from "./locales/nl.json";
import pl from "./locales/pl.json";
import uk from "./locales/uk.json";
import sv from "./locales/sv.json";
import nb from "./locales/nb.json";
import da from "./locales/da.json";
import fi from "./locales/fi.json";
import cs from "./locales/cs.json";
import ro from "./locales/ro.json";
import hu from "./locales/hu.json";
import el from "./locales/el.json";
import hr from "./locales/hr.json";
import sk from "./locales/sk.json";
import sl from "./locales/sl.json";
import bg from "./locales/bg.json";
import et from "./locales/et.json";
import lv from "./locales/lv.json";
import lt from "./locales/lt.json";
import is from "./locales/is.json";
import ja from "./locales/ja.json";
import he from "./locales/he.json";
import ar from "./locales/ar.json";
import zhTW from "./locales/zh-TW.json";
import ne from "./locales/ne.json";
import sw from "./locales/sw.json";
import fil from "./locales/fil.json";
import vi from "./locales/vi.json";

const resources = {
  en: { translation: en },
  de: { translation: de },
  fr: { translation: fr },
  es: { translation: es },
  it: { translation: it },
  pt: { translation: pt },
  nl: { translation: nl },
  pl: { translation: pl },
  uk: { translation: uk },
  sv: { translation: sv },
  nb: { translation: nb },
  da: { translation: da },
  fi: { translation: fi },
  cs: { translation: cs },
  ro: { translation: ro },
  hu: { translation: hu },
  el: { translation: el },
  hr: { translation: hr },
  sk: { translation: sk },
  sl: { translation: sl },
  bg: { translation: bg },
  et: { translation: et },
  lv: { translation: lv },
  lt: { translation: lt },
  is: { translation: is },
  ja: { translation: ja },
  he: { translation: he },
  ar: { translation: ar },
  "zh-TW": { translation: zhTW },
  ne: { translation: ne },
  sw: { translation: sw },
  fil: { translation: fil },
  vi: { translation: vi },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("evolve-language");
  const deviceLanguage = Localization.locale.split("-")[0];
  const defaultLanguage =
    savedLanguage ||
    (resources[deviceLanguage as keyof typeof resources]
      ? deviceLanguage
      : "en");

  await i18n.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export const changeLanguage = async (lang: string) => {
  await AsyncStorage.setItem("evolve-language", lang);
  await i18n.changeLanguage(lang);
};

export default i18n;
