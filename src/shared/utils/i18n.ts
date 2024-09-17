import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import gbTranslation from "../../assets/i18n/gb.json";
import ieTranslation from "../../assets/i18n/ie.json";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      gb: {
        translation: gbTranslation,
      },
      ie: {
        translation: ieTranslation,
      },
    },
    lng: "gb",
    fallbackLng: "gb",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
