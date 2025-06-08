import { useRef } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonToolbar,
} from "@ionic/react";
import { addCircleOutline, trash } from "ionicons/icons";
import { useTranslation } from "react-i18next";

interface ISynon {
  word: string[];
  reply: string[];
  id: string;
}
interface WordModalProps {
  wordModal: boolean;
  setWordModal: React.Dispatch<React.SetStateAction<boolean>>;
  newWord: string;
  setNewWord: React.Dispatch<React.SetStateAction<string>>;
  handleAddWord: () => void;
  handleDeleteWord: (word: string) => void;
  synonID: string | null;
  synons: ISynon[];
}

const WordModal: React.FC<WordModalProps> = ({
  wordModal,
  setWordModal,
  newWord,
  setNewWord,
  handleAddWord,
  handleDeleteWord,
  synonID,
  synons,
}) => {
  const { t } = useTranslation();
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);



  function confirm() {
    modal.current?.dismiss(input.current?.value, "confirm");
  }


  return (
    <IonModal
      ref={modal}
      isOpen={wordModal}
      onDidDismiss={() => setWordModal(false)}
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
          clearInput={true}
          className="input"
          placeholder={t("write_new_word")}
          label={t("write_new_word")}
          labelPlacement="floating"
          fill="outline"
          shape="round"
          value={newWord}
          onIonChange={(e: any) => setNewWord(e.detail.value)}
        />

        <IonButton
          expand="full"
          shape="round"
          onClick={handleAddWord}
          color="tertiary"
        >
          <IonIcon icon={addCircleOutline} />
          {t("add")}
        </IonButton>

        {synonID &&
          synons
            .find((syn) => syn.id === synonID)
            ?.word.map((w, index) => (
              <IonItem key={index}>
                <IonLabel>{w}</IonLabel>
                <IonButton
                  shape="round"
                  fill="clear"
                  onClick={() => handleDeleteWord(w)}
                >
                  <IonIcon icon={trash} color="light" />
                </IonButton>
              </IonItem>
            ))}
      </IonContent>
    </IonModal>
  );
};

export default WordModal;
