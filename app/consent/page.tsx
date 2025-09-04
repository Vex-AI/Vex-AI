import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { notificationsOutline } from "ionicons/icons";
import { LocalNotifications } from "@capacitor/local-notifications";
import { t } from "i18next";
import { useNavigate } from "react-router";

const ConsentPage: React.FC = () => {
  const navigate = useNavigate();
  const go = (path: string) => {
    navigate(path, { replace: true });
  };

  const requestNotificationPermission = async () => {
    const result = await LocalNotifications.requestPermissions();
    if (result.display === "granted") {
      go("/home");
    } else {
    }
    localStorage.setItem("notification", "true");
  };

  const handleDenyPermission = () => {
    go("/home");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t("notification.title")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            textAlign: "center",
          }}
        >
          <IonIcon
            icon={notificationsOutline}
            style={{
              fontSize: "120px",
              color: "#3b82f6",
              marginBottom: "16px",
            }}
          />
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            {t("notification.header")}
          </h2>
          <p
            style={{ fontSize: "1rem", color: "#6b7280", marginBottom: "24px" }}
          >
            {t("notification.description")}
          </p>

          <div style={{ width: "100%", maxWidth: "360px" }}>
            <IonButton
              expand="block"
              onClick={requestNotificationPermission}
              style={{
                borderRadius: "24px",
                marginBottom: "16px",
              }}
            >
              {t("notification.enable")}
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              color="medium"
              onClick={handleDenyPermission}
              style={{
                borderRadius: "24px",
              }}
            >
              {t("notification.deny")}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ConsentPage;
