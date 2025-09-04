// src/components/PhraseModal.tsx

import React, { useMemo } from 'react';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonInput, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { close, trash } from 'ionicons/icons';
import { IIntent } from '@/types';

export interface PhraseModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPhrase: string;
  setNewPhrase: (phrase: string) => void;
  onAddPhrase: () => void;
  onDeletePhrase: (phrase: string) => void;
  intentId?: number;
  intents: IIntent[];
}

const PhraseModal: React.FC<PhraseModalProps> = ({ isOpen, onClose, newPhrase, setNewPhrase, onAddPhrase, onDeletePhrase, intentId, intents }) => {
  const currentIntent = useMemo(() => {
    return intents.find(intent => intent.id === intentId);
  }, [intentId, intents]);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar Frases de Treinamento</IonTitle>
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
            label="Nova Frase"
            labelPlacement="stacked"
            placeholder="Digite uma nova variação"
            value={newPhrase}
            onIonChange={(e) => setNewPhrase(e.detail.value!)}
          />
          <IonButton onClick={onAddPhrase} slot="end">Adicionar</IonButton>
        </IonItem>

        <IonList>
          {currentIntent?.trainingPhrases.map((phrase, index) => (
            <IonItem key={index}>
              <IonLabel>{phrase}</IonLabel>
              <IonButton fill="clear" color="danger" slot="end" onClick={() => onDeletePhrase(phrase)}>
                <IonIcon slot="icon-only" icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default PhraseModal;