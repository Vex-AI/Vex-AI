import {
  IonButton,
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonTitle,
  IonList,
  IonLabel,
} from "@ionic/react";
import { useTranslation } from "react-i18next";

import { chevronBack, arrowRedoCircleOutline } from "ionicons/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const LanguageSelector: React.FC = () => {
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();
  const navigate = useNavigate();
  const go = (path: string) => {
    navigate(path, { replace: true });
  };

  const handleChangeLanguage = (selectedLanguage: string) => {
    changeLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  useEffect(() => {
    if (localStorage.getItem("language") === null)
      localStorage.setItem("language", "enUS");
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => go("/home")} color="light">
              <IonIcon icon={chevronBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{t("select")}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList style={{ display: "flex", flexDirection: "column" }}>
          <IonButton
            shape="round"
            color={language === "enUS" ? "secondary" : "light"}
            onClick={() => handleChangeLanguage("enUS")}
          >
            <IonLabel>{t("english")}</IonLabel>
          </IonButton>

          <IonButton
            shape="round"
            color={language === "ptBR" ? "secondary" : "light"}
            onClick={() => handleChangeLanguage("ptBR")}
          >
            <IonLabel>{t("portuguese")}</IonLabel>
          </IonButton>

          <IonButton shape="round" color="danger" onClick={() => go("/home")}>
            <IonLabel>{t("next")}</IonLabel>
            <IonIcon icon={arrowRedoCircleOutline} />
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default LanguageSelector;
