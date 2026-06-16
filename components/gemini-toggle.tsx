// components/GeminiToggle.tsx
"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const GeminiToggle = () => {
  const navigate = useNavigate();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("geminiEnabled");
    setIsEnabled(saved === "true");
  }, []);

  const handleToggle = (checked: boolean) => {
    if (checked) {
      const key = localStorage.getItem("geminiApiKey");
      if (!key) {
        toast.error("API Key not found", {
          description: "Please configure your Gemini API Key in Settings first.",
          action: {
            label: "Settings",
            onClick: () => navigate("/settings")
          }
        });
        return; // Prevent turning on
      }
    }
    
    setIsEnabled(checked);
    localStorage.setItem("geminiEnabled", checked.toString());
  };

  return (
    <Switch
      className="
             
    data-[state=checked]:bg-blue-500
    data-[state=unchecked]:bg-zinc-700

    [&>span]:data-[state=checked]:bg-white
    [&>span]:data-[state=unchecked]:bg-zinc-300
  "
      checked={isEnabled}
      onCheckedChange={handleToggle}
    />
  );
};

export default GeminiToggle;
