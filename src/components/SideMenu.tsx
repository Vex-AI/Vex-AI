import {
  IonMenu,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import {
  brush,
  home,
  person,
  school,
  language,
  trash,
  libraryOutline,
  codeDownloadOutline
} from "ionicons/icons";

import { db } from "../classes/vexDB";
import { useTranslation } from "react-i18next";
import BayesToggle from "./BayesToggle";
const SideMenu: React.FC = () => {
  const { t } = useTranslation();
  const router = useIonRouter();
  const navigate = (path: string) => {
    router.push(path, "root", "replace");
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
          <IonItem href="#" button onClick={() => navigate("/customize")}>
            <IonIcon color="light" slot="start" icon={brush} />
            {t("customization")}
          </IonItem>
          <IonItem href="#" onClick={handleClearChat}>
            <IonIcon color="light" slot="start" icon={trash} />
            {t("clearChat")}
          </IonItem>
          <IonItem href="#" onClick={() => navigate("/profile")}>
            <IonIcon color="light" slot="start" icon={person} />
            {t("vexProfile")}
          </IonItem>
          <IonItem href="#" onClick={() => navigate("/functions")}>
            <IonIcon color="light" slot="start" icon={school} />
            {t("functions")}
          </IonItem>
          <IonItem href="#" onClick={() => navigate("/home")}>
            <IonIcon color="light" slot="start" icon={home} />
            {t("home")}
          </IonItem>
          <IonItem href="#" onClick={() => navigate("/language")}>
            <IonIcon color="light" slot="start" icon={language} />
            {t("select")}
          </IonItem>

          <IonItem href="#" onClick={() => navigate("/synons")}>
            <IonIcon color="light" slot="start" icon={libraryOutline} />
            {t("vexLearning")}
          </IonItem>
          <IonItem href="#" onClick={() => navigate("/loader")}>
            <IonIcon color="light" slot="start" icon={codeDownloadOutline} />
            {t("downloadModel")}
          </IonItem>
          <BayesToggle></BayesToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
