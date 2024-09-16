import { useState, useEffect } from "react";
import { IonToggle, IonItem, IonLabel } from "@ionic/react";
import { useTranslation } from "react-i18next";

const BayesToggle: React.FC = () => {
  const [isBayesEnabled, setIsBayesEnabled] = useState<boolean>(false);
  const { t } = useTranslation();
  useEffect(() => {
    const storedPreference = localStorage.getItem("bayesEnabled") === null
      ? true
      : localStorage.getItem("bayesEnabled") ==="true"
     
     
    if (storedPreference) {
      setIsBayesEnabled(storedPreference);
    }
  }, []);

  const handleToggleChange = (event: CustomEvent) => {
    const isEnabled = event.detail.checked;
    setIsBayesEnabled(isEnabled);
    localStorage.setItem("bayesEnabled", String(isEnabled));
  };

  return (
    <IonItem>
      <IonLabel>{t("useBayes")}</IonLabel>
      <IonToggle checked={isBayesEnabled} onIonChange={handleToggleChange} />
    </IonItem>
  );
};

export default BayesToggle;
