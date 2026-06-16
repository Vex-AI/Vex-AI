"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Key, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import { initializeAnalyzer } from "@/lib/analyzer";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("geminiApiKey");
    if (stored) setApiKey(stored);
  }, []);

  const handleSave = async () => {
    localStorage.setItem("geminiApiKey", apiKey.trim());
    setSaved(true);
    
    // Attempt to reinitialize if it's set
    if (apiKey.trim()) {
      await initializeAnalyzer(true); 
    }

    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-10">
      <Header />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">{t("settings")}</h1>
        <p className="text-sm text-muted-foreground">{t("settings_desc")}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-500" />
            {t("gemini_api_key")}
          </label>
          <p className="text-xs text-muted-foreground">
            {t("gemini_api_key_desc")}
          </p>
          <Input 
            type="password" 
            placeholder="AIzaSy..." 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <Button onClick={handleSave} className="w-full" variant={saved ? "secondary" : "default"}>
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              {t("key_saved")}
            </>
          ) : (
            t("save_key")
          )}
        </Button>
      </div>
    </div>
  );
}
