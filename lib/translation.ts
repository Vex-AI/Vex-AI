import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationsENUS from "../locale/enUS.json";
import translationsPTBR from "../locale/ptBR.json";
import notificationMessagesENUS from "../notifications/enUS.json"
import notificationMessagesPTBR from "../notifications/ptBR.json"

i18n.use(initReactI18next).init({
  resources: {
    enUS: {
      translation: {
        ...translationsENUS,
        notifications: notificationMessagesENUS, 
      },
    },
    ptBR: {
      translation: {
        ...translationsPTBR,
        notifications: notificationMessagesPTBR, 
      },
    },
  },
  lng: "enUS",
  interpolation: {
    escapeValue: false,
  },
});

if (localStorage.getItem("language"))
  i18n.changeLanguage(localStorage.getItem("language")??"enUS");

export default i18n;
