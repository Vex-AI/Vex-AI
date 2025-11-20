"use client";

import { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

//import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Check } from "lucide-react";

import { loadIntentsForLanguage } from "@/lib/IntentManager";
import { mkToast } from "@/lib/utils";
import Header from "@/components/header";

const LANGS = [
  { id: "enUS", label: "english" },
  { id: "ptBR", label: "portuguese" },
];

export default function LanguageSelector() {

  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async (lang: string) => {
    if (language === lang) return;

    setIsLoading(true);

    try {
      await changeLanguage(lang);
      localStorage.setItem("language", lang);

      await loadIntentsForLanguage(lang);

      mkToast(t("language_changed"));
      //navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      mkToast("Failed to switch language.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("language")) {
      localStorage.setItem("language", "enUS");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 flex flex-col gap-4">
      <Header />

      <Card className="p-4 border border-border bg-card flex flex-col divide-y divide-border">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="text-muted-foreground">{t("loading_model")}</p>
          </div>
        ) : (
          LANGS.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleSelect(lang.id)}
              className={`
                group w-full flex items-center justify-between py-3 px-1 transition
                text-left
                ${
                  language === lang.id
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <span className="text-base">{t(lang.label)}</span>

           
              {language === lang.id ? (
                <Check className="size-5 text-primary scale-100 opacity-100 transition-transform" />
              ) : (
                <Check className="size-5 opacity-0 scale-0 group-hover:opacity-20 group-hover:scale-75 transition" />
              )}
            </button>
          ))
        )}
      </Card>
    </div>
  );
}
