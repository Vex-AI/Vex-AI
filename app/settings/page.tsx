"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Key, ShieldCheck, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import { initializeAnalyzer } from "@/lib/analyzer";

const CustomSelect = ({ value, options, onChange }: { value: string, options: { value: string, label: string }[], onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label;

  // Fechar ao clicar fora não é estritamente necessário aqui se o scroll desabilitar, mas vamos focar na beleza visual
  return (
    <div className="relative">
      <div 
        onClick={() => setOpen(!open)}
        className="bg-black/60 border border-white/10 rounded-xl p-3.5 text-xs text-white/90 flex justify-between items-center cursor-pointer hover:border-emerald-500/50 hover:bg-white/[0.02] transition-all duration-300"
      >
        <span className="font-medium tracking-wide">{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${open ? 'rotate-180 text-emerald-400' : ''}`} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 w-full mt-2 bg-[#121212] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
          >
            <div className="max-h-48 overflow-y-auto py-1">
              {options.map(opt => (
                <div 
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`px-4 py-3 text-xs cursor-pointer transition-colors duration-200 flex items-center ${value === opt.value ? 'text-emerald-400 bg-emerald-500/10 font-semibold' : 'text-neutral-300 hover:text-white hover:bg-white/5'}`}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function SettingsPage() {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [temperature, setTemperature] = useState(0.8);
  const [topK, setTopK] = useState(40);
  const [topP, setTopP] = useState(0.95);
  const [harassment, setHarassment] = useState("BLOCK_NONE");
  const [hateSpeech, setHateSpeech] = useState("BLOCK_NONE");
  const [sexuallyExplicit, setSexuallyExplicit] = useState("BLOCK_NONE");
  const [dangerousContent, setDangerousContent] = useState("BLOCK_NONE");

  useEffect(() => {
    const storedKey = localStorage.getItem("geminiApiKey");
    if (storedKey) setApiKey(storedKey);

    const storedTemp = localStorage.getItem("geminiTemperature");
    if (storedTemp) setTemperature(parseFloat(storedTemp));

    const storedTopK = localStorage.getItem("geminiTopK");
    if (storedTopK) setTopK(parseInt(storedTopK));

    const storedTopP = localStorage.getItem("geminiTopP");
    if (storedTopP) setTopP(parseFloat(storedTopP));

    const storedHarassment = localStorage.getItem("geminiHarassment");
    if (storedHarassment) setHarassment(storedHarassment);

    const storedHate = localStorage.getItem("geminiHateSpeech");
    if (storedHate) setHateSpeech(storedHate);

    const storedExplicit = localStorage.getItem("geminiSexuallyExplicit");
    if (storedExplicit) setSexuallyExplicit(storedExplicit);

    const storedDangerous = localStorage.getItem("geminiDangerousContent");
    if (storedDangerous) setDangerousContent(storedDangerous);
  }, []);

  const handleSave = async () => {
    localStorage.setItem("geminiApiKey", apiKey.trim());
    localStorage.setItem("geminiTemperature", temperature.toString());
    localStorage.setItem("geminiTopK", topK.toString());
    localStorage.setItem("geminiTopP", topP.toString());
    localStorage.setItem("geminiHarassment", harassment);
    localStorage.setItem("geminiHateSpeech", hateSpeech);
    localStorage.setItem("geminiSexuallyExplicit", sexuallyExplicit);
    localStorage.setItem("geminiDangerousContent", dangerousContent);

    setSaved(true);
    
    // Attempt to reinitialize if it's set
    if (apiKey.trim()) {
      await initializeAnalyzer(true); 
    }

    setTimeout(() => setSaved(false), 2000);
  };

  const blockOptions = [
    { value: "BLOCK_NONE", label: t("block_none") },
    { value: "BLOCK_ONLY_HIGH", label: t("block_only_high") },
    { value: "BLOCK_MEDIUM_AND_ABOVE", label: t("block_medium_and_above") },
    { value: "BLOCK_LOW_AND_ABOVE", label: t("block_low_and_above") },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#0d0d0d] text-white overflow-hidden relative">
      <Header 
        title={t("settings")} 
        description={t("settings_desc")}
      />

      <div className="flex-1 w-full overflow-y-auto scroll-smooth">
        <main className="max-w-md w-full mx-auto p-6 space-y-8 mt-4 pb-8">

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
              </div>
            </div>

            {/* Advanced Gemini Settings */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-6 relative overflow-visible">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white/90">{t("advanced_gemini_settings")}</h3>
                <p className="text-xs text-neutral-400">{t("advanced_gemini_desc")}</p>
              </div>

              <div className="space-y-6">
                {/* Temperature */}
                <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-neutral-300">{t("temperature")}</span>
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md font-mono">{temperature.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="2" step="0.1" 
                    value={temperature} 
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-neutral-500 leading-relaxed">{t("temperature_desc")}</p>
                </div>

                {/* Top K */}
                <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-neutral-300">{t("top_k")}</span>
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md font-mono">{topK}</span>
                  </div>
                  <input 
                    type="range" min="1" max="100" step="1" 
                    value={topK} 
                    onChange={(e) => setTopK(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-neutral-500 leading-relaxed">{t("top_k_desc")}</p>
                </div>

                {/* Top P */}
                <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-neutral-300">{t("top_p")}</span>
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md font-mono">{topP.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.05" 
                    value={topP} 
                    onChange={(e) => setTopP(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-neutral-500 leading-relaxed">{t("top_p_desc")}</p>
                </div>

                {/* Safety Settings */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">{t("safety_settings")}</h4>
                    <p className="text-[10px] text-neutral-500 leading-relaxed">{t("safety_settings_desc")}</p>
                  </div>
                  
                  {[
                    { label: t("harassment"), value: harassment, setter: setHarassment, zIndex: 40 },
                    { label: t("hate_speech"), value: hateSpeech, setter: setHateSpeech, zIndex: 30 },
                    { label: t("sexually_explicit"), value: sexuallyExplicit, setter: setSexuallyExplicit, zIndex: 20 },
                    { label: t("dangerous_content"), value: dangerousContent, setter: setDangerousContent, zIndex: 10 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-2 relative" style={{ zIndex: item.zIndex }}>
                      <span className="text-[11px] font-medium text-neutral-400 ml-1">{item.label}</span>
                      <CustomSelect 
                        value={item.value} 
                        onChange={item.setter} 
                        options={blockOptions} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>

          {/* Sticky Save Button - respects the container width */}
          <div className="sticky bottom-6 pt-6 z-50">
            <Button 
              onClick={handleSave} 
              className={`w-full h-14 rounded-2xl font-semibold text-sm transition-all duration-300 ${saved ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-[0.98]' : 'bg-white text-black hover:bg-white/90 shadow-2xl'}`}
            >
              {saved ? (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center"
                >
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  {t("settings_saved")}
                </motion.div>
              ) : (
                t("save_settings")
              )}
            </Button>
          </div>
        </main>
      </div>

    </div>
  );
}
