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
  IonItem,
  IonLabel,
  useIonRouter,
} from "@ionic/react";
import { useTranslation } from "react-i18next";

import { chevronBack , arrowRedoCircleOutline} from "ionicons/icons";

const LanguageSelector: React.FC = () => {
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();
  const router = useIonRouter();

  const handleChangeLanguage = (selectedLanguage: string) => {
    changeLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              onClick={() => router.push("/home", "root", "replace")}
              color="light"
            >
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
            color={language === "enUS" ? "primary" : "light"}
            onClick={() => handleChangeLanguage("enUS")}
          >
            <IonLabel>{t("english")}</IonLabel>
          </IonButton>

          <IonButton
            shape="round"
            color={language === "ptBR" ? "primary" : "light"}
            onClick={() => handleChangeLanguage("ptBR")}
          >
            <IonLabel>{t("portuguese")}</IonLabel>
          </IonButton>

          <IonButton
            shape="round"
            color="tertiary"
            onClick={() => router.push("/home", "root", "replace")}
          >
            <IonLabel>{t("next")}</IonLabel>
            <IonIcon icon={arrowRedoCircleOutline}/>
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default LanguageSelector;
