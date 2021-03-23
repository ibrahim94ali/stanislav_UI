import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";
import tr from "./tr";
import al from "./al";
import mk from "./mk";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: { en, tr, al, mk },
    lng: Localization.locale,
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
