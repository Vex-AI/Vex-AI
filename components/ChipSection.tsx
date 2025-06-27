// src/components/ChipSection.tsx

import React from 'react';
import { IonCardSubtitle, IonChip, IonLabel, IonIcon, IonButton, IonText } from '@ionic/react';
import { addCircle, closeCircle } from 'ionicons/icons';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './css/IntentItem.module.css';

interface ChipSectionProps {
  title: string;
  items: string[];
  onAddItem: () => void;
  onDeleteItem: (item: string) => void;
  chipClassName: string;
  buttonColor: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark';
  icon: string;
}

const ChipSection: React.FC<ChipSectionProps> = ({ title, items, onAddItem, onDeleteItem, chipClassName, buttonColor, icon }) => {
  return (
    <div className={styles.chipSection}>
      <IonCardSubtitle className={styles.sectionSubtitle}>
        <IonIcon icon={icon} color={buttonColor} />
        {title} ({items.length})
      </IonCardSubtitle>

      <div className={styles.chipContainer}>
        <AnimatePresence>
          {items.length > 0 ? (
            items.map((item) => (
              <motion.div key={item} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.2 }}>
                <IonChip className={`${styles.chip} ${chipClassName}`}>
                  <IonLabel className="ion-text-wrap">{item}</IonLabel>
                  <IonIcon
                    icon={closeCircle}
                    onClick={() => onDeleteItem(item)}
                    className={styles.chipIcon}
                  />
                </IonChip>
              </motion.div>
            ))
          ) : (
            <IonText className={styles.emptyStateText}>
              <p>Nenhum item adicionado.</p>
            </IonText>
          )}
        </AnimatePresence>
      </div>

      <IonButton
        size="small"
        fill="outline"
        shape="round"
        color={buttonColor}
        onClick={onAddItem}
        className={styles.addButton}
      >
        <IonIcon slot="start" icon={addCircle} />
        Adicionar
      </IonButton>
    </div>
  );
};

export default ChipSection;