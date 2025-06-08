import {
  IonMenu,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonIcon,
} from "@ionic/react";
import {
  brush,
  home,
  person,
  school,
  language,
  trash,
  libraryOutline,
} from "ionicons/icons";

import GeminiToggle from "./GeminiToggle";

import { db } from "@/lib/vexDB";
import { useTranslation } from "react-i18next";
import BayesToggle from "./BayesToggle";
import { useNavigate } from "react-router";
const SideMenu: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
 const go = (path: string) => {
    navigate(path, { replace: true });
  };

  const handleClearChat = async () => {
    await db.messages.clear();
  };

  return (
    <IonMenu menuId="sideMenu" side="start" contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          <IonItem href="#" button onClick={() => go("/customize")}>
            <IonIcon color="light" slot="start" icon={brush} />
            {t("customization")}
          </IonItem>
          <IonItem href="#" onClick={handleClearChat}>
            <IonIcon color="light" slot="start" icon={trash} />
            {t("clearChat")}
          </IonItem>
          <IonItem href="#" onClick={() => go("/profile")}>
            <IonIcon color="light" slot="start" icon={person} />
            {t("vexProfile")}
          </IonItem>
          <IonItem href="#" onClick={() => go("/home")}>
            <IonIcon color="light" slot="start" icon={home} />
            {t("home")}
          </IonItem>
          <IonItem href="#" onClick={() => go("/language")}>
            <IonIcon color="light" slot="start" icon={language} />
            {t("select")}
          </IonItem>

          <IonItem href="#" onClick={() => go("/synons")}>
            <IonIcon color="light" slot="start" icon={libraryOutline} />
            {t("vexLearning")}
          </IonItem>
          <IonItem href="#" onClick={() => go("/functions")}>
            <IonIcon color="light" slot="start" icon={school} />
            {t("functions")}
          </IonItem>

          <GeminiToggle />
          <BayesToggle />
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
