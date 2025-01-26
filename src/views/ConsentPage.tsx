import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import { notificationsOutline } from "ionicons/icons";
import { LocalNotifications } from "@capacitor/local-notifications";
import { t } from "i18next"; // Importa a função `t` para traduções

const ConsentPage: React.FC = () => {
  const router = useIonRouter();
  const navigate = (path: string) => {
    router.push(path, "root", "replace");
  };

  const requestNotificationPermission = async () => {
    const result = await LocalNotifications.requestPermissions();
    if (result.display === "granted") {
      console.log(t("notification.permissionGranted")); // Log traduzido
      navigate("home");
    } else {
      console.log(t("notification.permissionDenied"));
    }
  };

  const handleDenyPermission = () => {
    console.log(t("notification.permissionRejected"));
    navigate("home");
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
            style={{ fontSize: "120px", color: "#3b82f6", marginBottom: "16px" }}
          />
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "8px" }}>
            {t("notification.header")}
          </h2>
          <p style={{ fontSize: "1rem", color: "#6b7280", marginBottom: "24px" }}>
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