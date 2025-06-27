// src/components/ResponseModal.tsx

import React, { useMemo } from 'react';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonInput, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { close, trash } from 'ionicons/icons';
import { IIntent } from '@/types';

export interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  newResponse: string;
  setNewResponse: (response: string) => void;
  onAddResponse: () => void;
  onDeleteResponse: (response: string) => void;
  intentId?: number;
  intents: IIntent[];
}

const ResponseModal: React.FC<ResponseModalProps> = ({ isOpen, onClose, newResponse, setNewResponse, onAddResponse, onDeleteResponse, intentId, intents }) => {
  const currentIntent = useMemo(() => {
    return intents.find(intent => intent.id === intentId);
  }, [intentId, intents]);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar Respostas</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon slot="icon-only" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            label="Nova Resposta"
            labelPlacement="stacked"
            placeholder="Digite uma nova resposta possível"
            value={newResponse}
            onIonChange={(e) => setNewResponse(e.detail.value!)}
          />
          <IonButton onClick={onAddResponse} slot="end">Adicionar</IonButton>
        </IonItem>

        <IonList>
          {currentIntent?.responses.map((response, index) => (
            <IonItem key={index}>
              <IonLabel className="ion-text-wrap">{response}</IonLabel>
              <IonButton fill="clear" color="danger" slot="end" onClick={() => onDeleteResponse(response)}>
                <IonIcon slot="icon-only" icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default ResponseModal;