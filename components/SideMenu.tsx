// src/components/SideMenu.tsx

import React from 'react';
import {
  IonMenu,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonIcon,
  IonListHeader,
  IonItemGroup,
  IonLabel,
} from "@ionic/react";
import {
  home,
  brush,
  person,
  language,
  trash,
  sparklesOutline,
} from "ionicons/icons";

import GeminiToggle from "./GeminiToggle";
import { db } from "@/lib/vexDB";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const menuItems = [
  { labelKey: "home", path: "/home", icon: home },
  { labelKey: "vexLearning", path: "/intents", icon: sparklesOutline },
  { labelKey: "vexProfile", path: "/profile", icon: person },
  { labelKey: "customization", path: "/customize", icon: brush },
  { labelKey: "select", path: "/language", icon: language },
];

const SideMenu: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path, { replace: true });
  };

  const handleClearChat = async () => {
    if (window.confirm(t("are_you_sure_clear_chat", "Tem certeza que deseja apagar todo o histórico de conversa?"))) {
      await db.messages.clear();
    }
  };

  return (
<IonMenu menuId="sideMenu" side="start" contentId="main-content">
  <IonHeader>
    <IonToolbar style={{ backgroundColor: "#1e1e1e" }}>
      <IonTitle style={{ color: "#fff" }}>Menu</IonTitle>
    </IonToolbar>
  </IonHeader>

  <IonContent  >
    <IonList>

      {/* NAV */}
      <IonItemGroup>
        <IonListHeader>
          <IonLabel className="ion-text-uppercase" color="light">Navegação</IonLabel>
        </IonListHeader>
        {menuItems.map((item) => (
          <IonItem key={item.path} button onClick={() => go(item.path)} lines="none" style={{ "--background-hover": "#1f1f1f" }}>
            <IonIcon slot="start" icon={item.icon} color="light" />
            <IonLabel style={{ color: "#fff" }}>{t(item.labelKey)}</IonLabel>
          </IonItem>
        ))}
      </IonItemGroup>
<div style={{ height: "1px", backgroundColor: "#333", margin: "8px 0" }} />

      {/* AÇÕES */}
      <IonItemGroup>
        <IonListHeader>
          <IonLabel className="ion-text-uppercase" color="light">Ações</IonLabel>
        </IonListHeader>
        <IonItem button onClick={handleClearChat} lines="none" style={{ "--background-hover": "#1f1f1f" }}>
          <IonIcon slot="start" icon={trash} color="danger" />
          <IonLabel style={{ color: "rgb(255, 80, 80)", fontWeight: 500 }}>{t("clearChat")}</IonLabel>
        </IonItem>
      </IonItemGroup>
<div style={{ height: "1px", backgroundColor: "#333", margin: "8px 0" }} />

      {/* IA */}
      <IonItemGroup>
        <IonListHeader>
          <IonLabel className="ion-text-uppercase" color="light">Configurações da IA</IonLabel>
        </IonListHeader>
        <IonItem lines="none" style={{ "--background-hover": "#1f1f1f" }}>
          <IonLabel style={{ color: "#fff" }}>Ativar Gemini</IonLabel>
          <div slot="end">
            <GeminiToggle />
          </div>
        </IonItem>
      </IonItemGroup>

    </IonList>
  </IonContent>
</IonMenu>

  );
};

export default SideMenu;
