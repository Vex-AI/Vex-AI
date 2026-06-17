"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Key, KeyRound, ShieldCheck, Cpu, Download, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useLLMStore } from "@/store/llmStore";
import { llmManager } from "@/lib/llm/LLMManager";
import Header from "@/components/header";
import { initializeAnalyzer } from "@/lib/analyzer";

export default function SettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { isAutonomousMode, setAutonomousMode, downloadProgress, downloadText, isEngineReady } = useLLMStore();

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

        {/* Local LLM Settings Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-3xl blur-xl transition-all duration-500 group-hover:bg-purple-500/30" />
          <div className="relative bg-[#111111] border border-white/10 rounded-3xl p-6 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Cpu className="w-32 h-32" />
            </div>

            <div className="relative z-10 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <Cpu className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white/90">Neural Engine (Offline)</h2>
                    <p className="text-xs text-neutral-400">Download a local AI model to run entirely on your device.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <p className="text-xs text-neutral-300 font-mono mb-2">Model: Gemma-2B-IT-Q4</p>
                  
                  {isEngineReady ? (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Ready to use
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        onClick={() => llmManager.initEngine()}
                        disabled={downloadProgress > 0}
                        variant="secondary"
                        className="w-full bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                      >
                        <Download className="w-4 h-4 mr-2" /> 
                        {downloadProgress > 0 ? "Downloading..." : "Download Model (~1.5GB)"}
                      </Button>
                      
                      {downloadProgress > 0 && (
                        <div className="space-y-1">
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 transition-all duration-300"
                              style={{ width: `${downloadProgress}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-neutral-500 truncate">{downloadText}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
                  <div>
                    <h3 className="text-sm font-medium text-white/90">Autonomous Mode</h3>
                    <p className="text-xs text-neutral-500">Bypass intents and use local AI</p>
                  </div>
                  <Switch 
                    checked={isAutonomousMode}
                    onCheckedChange={setAutonomousMode}
                    disabled={!isEngineReady}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
