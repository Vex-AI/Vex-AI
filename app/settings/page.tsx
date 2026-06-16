"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Key, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import { initializeAnalyzer } from "@/lib/analyzer";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
    <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-white">
      <Header 
        title={t("settings")} 
        description={t("settings_desc")}
      />

      <main className="flex-1 max-w-md w-full mx-auto p-6 space-y-8 mt-4">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* API Key Card */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 relative overflow-hidden group transition-all duration-500 hover:bg-white/[0.05]">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                  <Key className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-white/90">{t("gemini_api_key")}</h3>
              </div>
              
              <p className="text-xs text-neutral-400">
                {t("gemini_api_key_desc")}
              </p>
              
              <div className={`relative transition-all duration-300 rounded-xl overflow-hidden border ${isFocused ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-white/10'}`}>
                <Input 
                  type="password" 
                  placeholder="AIzaSy..." 
                  value={apiKey}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-black/40 border-0 focus-visible:ring-0 text-white/90 placeholder:text-neutral-600 px-4 py-6"
                />
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleSave} 
                  className={`w-full h-12 rounded-xl font-medium transition-all duration-300 ${saved ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-white text-black hover:bg-white/90'}`}
                >
                  {saved ? (
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center"
                    >
                      <ShieldCheck className="w-5 h-5 mr-2" />
                      {t("key_saved")}
                    </motion.div>
                  ) : (
                    t("save_key")
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
