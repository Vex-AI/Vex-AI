// src/components/IntentItem.tsx

import React from "react";
import {
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonIcon,
  IonButton,
  IonText,
} from "@ionic/react";
import {
  trash,
  closeCircle,
  addCircle,
} from "ionicons/icons";
import { IIntent } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export interface IntentItemProps {
  intent: IIntent;
  onDeleteIntent: () => void;
  onAddPhrase: () => void;
  onAddResponse: () => void;
  onDeletePhrase: (phrase: string) => void;
  onDeleteResponse: (response: string) => void;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#1e1e1e",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: "1.8rem",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: 600,
  marginBottom: "0.8rem",
  color: "#ffffff",
};

const chipGroup: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  marginTop: "0.4rem",
};

const phraseChipStyle: React.CSSProperties = {
  backgroundColor: "#333",
  color: "#fff",
};

const responseChipStyle: React.CSSProperties = {
  backgroundColor: "#007aff",
  color: "#fff",
};

const IntentItem: React.FC<IntentItemProps> = ({
  intent,
  onDeleteIntent,
  onAddPhrase,
  onAddResponse,
  onDeletePhrase,
  onDeleteResponse,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <IonCard style={cardStyle}>
        <IonCardHeader>
          <IonCardTitle className="ion-text-wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <IonText color="light">{intent.name}</IonText>
            <IonButton fill="clear" color="danger" onClick={onDeleteIntent}>
              <IonIcon slot="icon-only" icon={trash} />
            </IonButton>
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent>

          {/* Frases de Treinamento */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>
              Frases de Treinamento ({intent.trainingPhrases.length})
            </div>
            <div style={chipGroup}>
              <AnimatePresence>
                {intent.trainingPhrases.length > 0 ? (
                  intent.trainingPhrases.map((phrase) => (
                    <motion.div key={phrase} exit={{ opacity: 0, scale: 0.5 }}>
                      <IonChip style={phraseChipStyle}>
                        <IonLabel>{phrase}</IonLabel>
                        <IonIcon
                          icon={closeCircle}
                          onClick={() => onDeletePhrase(phrase)}
                          style={{ cursor: "pointer", opacity: 0.7 }}
                        />
                      </IonChip>
                    </motion.div>
                  ))
                ) : (
                  <IonText color="medium">
                    <p>Nenhuma frase de treinamento.</p>
                  </IonText>
                )}
              </AnimatePresence>
            </div>
            <IonButton
              size="small"
              expand="full"
              shape="round"
              color="tertiary"
              onClick={onAddPhrase}
              style={{ marginTop: "10px" }}
            >
              <IonIcon slot="start" icon={addCircle} />
              Adicionar Frase
            </IonButton>
          </div>

          {/* Respostas */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>
              Respostas ({intent.responses.length})
            </div>
            <div style={chipGroup}>
              <AnimatePresence>
                {intent.responses.length > 0 ? (
                  intent.responses.map((response) => (
                    <motion.div key={response} exit={{ opacity: 0, scale: 0.5 }}>
                      <IonChip style={responseChipStyle}>
                        <IonLabel className="ion-text-wrap">{response}</IonLabel>
                        <IonIcon
                          icon={closeCircle}
                          onClick={() => onDeleteResponse(response)}
                          style={{ cursor: "pointer", opacity: 0.7 }}
                        />
                      </IonChip>
                    </motion.div>
                  ))
                ) : (
                  <IonText color="medium">
                    <p>Nenhuma resposta.</p>
                  </IonText>
                )}
              </AnimatePresence>
            </div>
            <IonButton
              size="small"
              expand="full"
              shape="round"
              color="tertiary"
              onClick={onAddResponse}
              style={{ marginTop: "10px" }}
            >
              <IonIcon slot="start" icon={addCircle} />
              Adicionar Resposta
            </IonButton>
          </div>

        </IonCardContent>
      </IonCard>
    </motion.div>
  );
};

export default IntentItem;
