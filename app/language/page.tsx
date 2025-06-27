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
  IonSpinner, 
} from "@ionic/react";
import { useTranslation } from "react-i18next";
import { chevronBack, arrowRedoCircleOutline } from "ionicons/icons";
import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router";
import { loadIntentsForLanguage } from "@/lib/IntentManager"; 
import { mkToast } from "@/lib/utils"; 

const LanguageSelector: React.FC = () => {
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();
  const navigate = useNavigate();
  // Adiciona um estado de carregamento para dar feedback ao usuário
  const [isLoading, setIsLoading] = useState(false);

  const go = (path: string) => {
    navigate(path, { replace: true });
  };

  const handleChangeLanguage = async (selectedLanguage: string) => {
    // Se o idioma já for o selecionado, não faz nada
    if (language === selectedLanguage) return;

    setIsLoading(true); // Inicia o carregamento

    try {
      // 1. Muda o idioma da UI (i18next)
      await changeLanguage(selectedLanguage);
      localStorage.setItem("language", selectedLanguage);

      // 2. Carrega os modelos de intenção correspondentes no DB
      await loadIntentsForLanguage(selectedLanguage);

    } catch (error) {
      console.error("Falha ao trocar de idioma e modelo:", error);
      mkToast("Failed to switch language.");
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
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
            <IonButton onClick={() => go("/home")} color="light" disabled={isLoading}>
              <IonIcon icon={chevronBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{t("select")}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Mostra um spinner durante o carregamento dos modelos */}
        {isLoading ? (
          <div className="ion-text-center">
            <IonSpinner name="crescent" />
            <p>{t("loading_model")}</p> {/* Adicione essa tradução nos seus JSONs */}
          </div>
        ) : (
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
        )}
      </IonContent>
    </IonPage>
  );
};

export default LanguageSelector;