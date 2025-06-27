// components/GeminiToggle.tsx
import { IonToggle } from "@ionic/react";
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
    <IonToggle
      color="warning"
      checked={isEnabled}
      onIonChange={handleToggle}
    />
  );
};

export default GeminiToggle;
