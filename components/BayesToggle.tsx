import { useState, useEffect } from "react";
import { IonToggle, IonItem } from "@ionic/react";
import { useTranslation } from "react-i18next";

const BayesToggle: React.FC = () => {
  const [isBayesEnabled, setIsBayesEnabled] = useState<boolean>(false);
  const { t } = useTranslation();
  useEffect(() => {
    const storedPreference =
      localStorage.getItem("bayesEnabled") === null
        ? true
        : localStorage.getItem("bayesEnabled") === "true";

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
      <IonToggle
        className="ion-text-center"
        aria-label="Bayes toggle"
        color="warning"
        checked={isBayesEnabled}
        onIonChange={handleToggleChange}
      >
        {t("useBayes")}
      </IonToggle>
    </IonItem>
  );
};

export default BayesToggle;
