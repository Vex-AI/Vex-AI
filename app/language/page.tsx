"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { loadIntentsForLanguage } from "@/lib/IntentManager";
import { mkToast } from "@/lib/utils";
import Header from "@/components/header";

const LANGS = [
  { id: "enUS", label: "english", flag: "🇺🇸" },
  { id: "ptBR", label: "portuguese", flag: "🇧🇷" },
  { id: "ja", label: "japanese", flag: "🇯🇵" },
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
    <div className="flex flex-col h-full bg-[#0d0d0d] text-white">
      <Header 
        title={t("select")} 
        description="Escolha o idioma principal para a inteligência da Vex e para o aplicativo."
      />

      <main className="flex-1 max-w-md w-full mx-auto p-6 space-y-8 mt-4">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative p-2 rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50" />
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-12 gap-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-full" />
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-400 relative z-10" />
                </div>
                <p className="text-sm font-medium text-indigo-300 animate-pulse">{t("loading_model")}</p>
              </motion.div>
            ) : (
              <motion.div 
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-2 p-2"
              >
                {LANGS.map((lang) => {
                  const isActive = language === lang.id;
                  
                  return (
                    <button
                      key={lang.id}
                      onClick={() => handleSelect(lang.id)}
                      className={`
                        relative group w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300
                        ${isActive 
                          ? "bg-indigo-500/10 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                          : "bg-transparent border border-transparent hover:bg-white/5 hover:border-white/10"
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{lang.flag}</span>
                        <span className={`text-base font-medium transition-colors ${isActive ? "text-indigo-300" : "text-white/80 group-hover:text-white"}`}>
                          {t(lang.label)}
                        </span>
                      </div>

                      <div className={`
                        flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300
                        ${isActive ? "bg-indigo-500 text-white" : "bg-white/5 text-transparent"}
                      `}>
                        <Check className={`w-4 h-4 transition-transform duration-300 ${isActive ? "scale-100" : "scale-50 opacity-0 group-hover:opacity-50 group-hover:text-white/40"}`} />
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
