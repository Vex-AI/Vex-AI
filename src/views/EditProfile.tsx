import { useState, useCallback } from "react";
import {
  IonContent,
  IonPage,
  IonAvatar,
  IonButton,
  IonIcon,
  IonInput,
  IonModal,
  IonItem,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonFooter,
  IonBackButton,
} from "@ionic/react";
import {
  cameraOutline,
  trashOutline,
  logoGithub,
  logoYoutube,
  pencilOutline,
} from "ionicons/icons";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../classes/vexDB";
import StarsBG from "../components/StarsBG";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";

const EditProfile: React.FC = () => {
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [isEditImageModalOpen, setIsEditImageModalOpen] = useState(false);
  const [newName, setNewName] = useState<string>("");
  const { t } = useTranslation();
  const vexInfo = useLiveQuery(() => db.vexInfo.get(1), []);

  // Função para salvar o novo nome
  const handleSaveName = useCallback(async () => {
    if (newName.trim() === "") return;
    await db.vexInfo.update(1, { name: newName });
    setNewName("");
    setIsEditNameModalOpen(false);
  }, [newName]);

  // Função para salvar a nova imagem
  const handleSelectImage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file: File | undefined = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imageContent: string = e.target?.result as string;
          console.log(imageContent);
          await db.vexInfo.update(1, { profileImage: imageContent });
        };
        reader.readAsDataURL(file);
      }
      setIsEditImageModalOpen(false);
    },
    []
  );

  // Função para resetar o perfil
  const handleResetProfile = async () => {
    await db.vexInfo.update(1, { name: "Vex", profileImage: "/Vex_320.png" });
    setNewName("Vex");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" color="light" />
          </IonButtons>
          <IonTitle>{t("vex_profile")}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Avatar e botão de editar imagem */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <IonAvatar
            style={{ width: "150px", height: "150px", margin: "auto" }}
          >
            <img src={vexInfo?.profileImage || "/Vex_320.png"} alt="Profile" />
          </IonAvatar>
          <IonButton
            color="light"
            fill="clear"
            onClick={() => setIsEditImageModalOpen(true)}
          >
            <IonIcon icon={cameraOutline} size="small" />
          </IonButton>
        </div>

        {/* Nome e botão de editar nome */}
        <IonItem lines="none">
          <IonLabel>{vexInfo?.name || "Vex"}</IonLabel>
          <IonButton
            color="light"
            fill="clear"
            onClick={() => setIsEditNameModalOpen(true)}
          >
            <IonIcon icon={pencilOutline} size="small" />
          </IonButton>
        </IonItem>

        <IonItem lines="none" style={{ justifyContent: "center" }}>
          <IonLabel>{t("reset_profile")}</IonLabel>
          <IonButton color="light" fill="clear" onClick={handleResetProfile}>
            <IonIcon icon={trashOutline} size="small" />
          </IonButton>
        </IonItem>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IonButton
            href="https://github.com/Vex-AI/VexAI"
            target="_blank"
            fill="clear"
            color="light"
          >
            <IonIcon icon={logoGithub} />
          </IonButton>
          <IonButton
            color="light"
            href="https://youtube.com/@vex-ai"
            target="_blank"
            fill="clear"
          >
            <IonIcon icon={logoYoutube} />
          </IonButton>
        </div>

        <IonModal isOpen={isEditNameModalOpen}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{t("editName")}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsEditNameModalOpen(false)}>
                  {t("close")}
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
              <IonInput
                value={newName}
                onIonChange={(e: any) => setNewName(e.detail.value!)}
                maxlength={12}
                label={t("typeThing")}
                labelPlacement="floating"
                fill="outline"
                shape="round"
                placeholder="Digite um novo nome"
              />
            </IonItem>
            <IonButton
              color={"tertiary"}
              className="ion-padding"
              shape="round"
              expand="full"
              onClick={handleSaveName}
            >
              {t("save")}
            </IonButton>
          </IonContent>
        </IonModal>

        <IonModal isOpen={isEditImageModalOpen}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{t("edit_image")}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsEditImageModalOpen(false)}>
                  {t("close")}
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <input
              style={{
                textAlign: "center",
                margin: "auto",
                width: "auto",
              }}
              className="ion-padding ion-text-align"
              type="file"
              accept="image/*"
              onChange={handleSelectImage}
            />
          </IonContent>
        </IonModal>
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default EditProfile;
