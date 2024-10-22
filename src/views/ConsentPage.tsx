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

const ConsentPage: React.FC = () => {
  const router = useIonRouter();
  const navigate = (path: string) => {
    router.push(path, "root", "replace");
  };

  const requestNotificationPermission = async () => {
    const result = await LocalNotifications.requestPermissions();
    if (result.display === "granted") {
      console.log("Notification permission grated.");
      navigate("home")
    } else {
      console.log("Notification permission denied.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Notification Consent</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ textAlign: "center" }}>
          <IonIcon
            icon={notificationsOutline}
            style={{ fontSize: "100px", color: "#3880ff" }}
          />
          <h2>We'd like to send you notifications!</h2>
          <p>
            Stay up to date with the latest features and updates by enabling
            notifications.
          </p>

          {/* Button to request notifications */}
          <IonButton expand="block" onClick={requestNotificationPermission}>
            Enable Notifications
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ConsentPage;
