import React, { useRef } from "react";
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonList,
  IonContent,
  IonToolbar,
  IonHeader,
  IonButtons,
} from "@ionic/react";
import { addCircleOutline, trash, exitOutline } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { OverlayEventDetail } from "@ionic/core/components";

interface ReplyModalProps {
  replyModal: boolean;
  setReplyModal: (isOpen: boolean) => void;
  newReply: string;
  setNewReply: (value: string) => void;
  handleAddReply: () => void;
  handleDeleteReply: (reply: string) => void;
  synonID: string | null;
  synons: ISynon[];
}
interface ISynon {
  word: string[];
  reply: string[];
  id: string;
}

const ReplyModal: React.FC<ReplyModalProps> = ({
  replyModal,
  setReplyModal,
  newReply,
  setNewReply,
  handleAddReply,
  handleDeleteReply,
  synonID,
  synons,
}) => {
  const synon = synons.find((syn) => syn.id === synonID);
  const { t } = useTranslation();

  const modal = useRef<HTMLIonModalElement>(null);

  function confirm() {
    modal.current?.dismiss("confirm");
  }

  return (
    <IonModal
      ref={modal}
      isOpen={replyModal}
      onDidDismiss={() => setReplyModal(false)}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => modal.current?.dismiss()}>
              Cancel
            </IonButton>
          </IonButtons>

          <IonButtons slot="end">
            <IonButton strong={true} onClick={() => confirm()}>
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonInput
          labelPlacement="floating"
          label={t("write_reply")}
          placeholder={t("write_new_reply")}
          fill="outline"
          shape="round"
          value={newReply}
          onIonChange={(e: any) => setNewReply(e.detail.value)}
        />

        <IonButton
          expand="full"
          shape="round"
          onClick={handleAddReply}
          color="tertiary"
          style={{ marginTop: "1rem" }}
        >
          <IonIcon icon={addCircleOutline} slot="start" />
          {t("add")}
        </IonButton>

        {(synon?.reply?.length ?? 0) > 0 && (
          <IonList>
            {synon?.reply.map((r, index) => (
              <IonItem key={index}>
                <IonLabel>{r}</IonLabel>
                <IonButton
                  fill="clear"
                  slot="end"
                  color="light"
                  onClick={() => handleDeleteReply(r)}
                >
                  <IonIcon icon={trash} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonModal>
  );
};

export default ReplyModal;
