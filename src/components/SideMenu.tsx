import  { useState } from "react";
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
  logOut,
} from "ionicons/icons";

import { db } from "../classes/vexDB";
const SideMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useIonRouter();
  const navigate = (path: string) => {
    router.push(path, "root", "replace");
  };


  const handleClearChat = async () => {
    await db.messages.clear();
  };

  return (
    <IonMenu side="start" contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          <IonItem href="#" button onClick={() => navigate("/customize")}>
            <IonIcon color="light" slot="start" icon={brush} />
            Customization
          </IonItem>
          <IonItem href="#" onClick={handleClearChat}>
            <IonIcon color="light" slot="start" icon={trash} />
            Clear Chat
          </IonItem>
          <IonItem href="#" onClick={() => navigate("/profile")}>
            <IonIcon color="light" slot="start" icon={person} />
            Vex Profile
          </IonItem>
          <IonItem href="#" onClick={() => navigate("/functions")}>
            <IonIcon color="light" slot="start" icon={school} />
            Functions
          </IonItem>
          <IonItem href="#" onClick={() => navigate("/home")}>
            <IonIcon color="light" slot="start" icon={home} />
            Home
          </IonItem>
          <IonItem href="#" onClick={() => navigate("/language")}>
            <IonIcon color="light" slot="start" icon={language} />
            Select Language
          </IonItem>
          <IonItem disabled>
            <IonIcon color="light" slot="start" icon={logOut} />
            Log Out
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
