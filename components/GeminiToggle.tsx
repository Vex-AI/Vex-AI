// components/GeminiToggle.tsx
import { IonItem, IonToggle, IonLabel } from "@ionic/react";
import { useState, useEffect } from "react";

const GeminiToggle: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("geminiEnabled");
    setIsEnabled(savedState === "true");
  }, []);

  const handleToggle = (e: CustomEvent) => {
    const newState = e.detail.checked;
    setIsEnabled(newState);
    localStorage.setItem("geminiEnabled", newState.toString());
  };

  return (
    <IonItem>
      <IonLabel>Ativar Gemini</IonLabel>
      <IonToggle
      color="warning"
        checked={isEnabled}
        onIonChange={handleToggle}
      />
    </IonItem>
  );
};

export default GeminiToggle;