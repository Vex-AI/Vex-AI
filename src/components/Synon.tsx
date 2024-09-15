// Synon.tsx
import React from "react";
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import { gitNetworkOutline, trash, personCircleOutline } from "ionicons/icons";
import { motion } from "framer-motion";
import { ISynon } from "../classes/vexDB";



interface SynonProps {
  syn: ISynon;
  onAddWordSynon?: () => void;
  onDeleteSynon?: () => void;
  onAddReplySynon?: () => void;
  index: number;
}

const Synon: React.FC<SynonProps> = ({
  syn,
  onDeleteSynon,
  onAddWordSynon,
  onAddReplySynon,
  index,
}) => {
  const reply = syn.reply.join(", ");
  const word = syn.word.join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <IonCard>
        <IonCardContent color="medium" >
          <IonItem  lines="full" style={{ borderBottom: "1px solid white" }}>
            <IonLabel>
              <h5>{word.length > 20 ? `${word.slice(0, 20)}...` : word}</h5>
            </IonLabel>
          </IonItem>
          <IonItem lines="full" style={{ borderBottom: "1px solid white" }}>
            <IonLabel>
              <p>{reply.length > 20 ? `${reply.slice(0, 20)}...` : reply}</p>
            </IonLabel>
          </IonItem>
          <IonItem lines="none" >
            <IonButton color="light" onClick={onAddWordSynon} fill="clear">
              <IonIcon icon={personCircleOutline} />
            </IonButton>
            <IonButton color="light" onClick={onAddReplySynon} fill="clear">
              <IonIcon icon={gitNetworkOutline} />
            </IonButton>
            <IonButton color="light" onClick={onDeleteSynon} fill="clear">
              <IonIcon icon={trash} />
            </IonButton>
          </IonItem>
        </IonCardContent>
      </IonCard>
    </motion.div>
  );
};

export default Synon;
