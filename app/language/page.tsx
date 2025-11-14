"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowRightCircle } from "lucide-react";

import { loadIntentsForLanguage } from "@/lib/IntentManager";
import { mkToast } from "@/lib/utils";
import Header from "@/components/header";

export default function LanguageSelector() {
  const navigate = useNavigate();
  const {
    t,
    i18n: { language, changeLanguage },
  } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const go = (path: string) => navigate(path, { replace: true });

  const handleChangeLanguage = async (selectedLanguage: string) => {
    if (language === selectedLanguage) return;

    setIsLoading(true);

    try {
      await changeLanguage(selectedLanguage);
      localStorage.setItem("language", selectedLanguage);

      await loadIntentsForLanguage(selectedLanguage);
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
    <div className="min-h-screen bg-neutral-950 text-white p-4 flex flex-col gap-4">
      {/* Header */}
      <Header />

      {/* Content */}
      <Card className="bg-neutral-900 border-neutral-800 p-4 flex flex-col gap-3">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="size-6 animate-spin text-purple-500" />
            <p className="text-neutral-300">{t("loading_model")}</p>
          </div>
        ) : (
          <>
            <Button
              className="w-full rounded-xl"
              variant={language === "enUS" ? "default" : "secondary"}
              onClick={() => handleChangeLanguage("enUS")}
            >
              {t("english")}
            </Button>

            <Button
              className={`w-full rounded-xl flex items-center justify-between transition-all
    ${
      language === "enUS"
        ? "bg-purple-600"
        : "bg-neutral-800 hover:bg-neutral-700 border border-neutral-700"
    }`}
              onClick={() => handleChangeLanguage("enUS")}
            >
              {t("english")}
            </Button>

            <Button
              className={`w-full rounded-xl flex items-center justify-between transition-all
    ${
      language === "ptBR"
        ? "bg-purple-600 hover:bg-purple-700 )]"
        : "bg-neutral-800 hover:bg-neutral-700 border border-neutral-700"
    }`}
              onClick={() => handleChangeLanguage("ptBR")}
            >
              {t("portuguese")}
            </Button>

            <Button
              className="w-full rounded-xl bg-purple-600 hover:bg-purple-700"
              onClick={() => go("/home")}
            >
              {t("next")}
              <ArrowRightCircle className="size-4 ml-2" />
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
