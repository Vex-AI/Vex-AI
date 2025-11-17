// components/GeminiToggle.tsx
"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";

const GeminiToggle = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("geminiEnabled");
    setIsEnabled(saved === "true");
  }, []);

  const handleToggle = (checked: boolean) => {
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
