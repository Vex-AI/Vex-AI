import { motion, AnimatePresence } from "framer-motion";
import SideMenu from "./side-menu"
import { memo, useEffect, useState } from "react";
import { useEmotionStore } from "@/store/useEmotionStore";
import AnimatedEmoji from "./animated-emoji";

import { useTranslation } from "react-i18next";

const ChatHeader=({ info, status }: { info?: { name?: string; profileImage?: string }, status?: string })=> {
  const { t } = useTranslation();
  const currentEmotion = useEmotionStore((state) => state.currentEmotion);
  const isTyping = useEmotionStore((state) => state.isTyping);
  const [useDynamicAvatar, setUseDynamicAvatar] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setUseDynamicAvatar(localStorage.getItem("dynamicAvatar") === "true");
    };
    
    handleStorageChange(); // initial check
    
    // Allow reactivity across tabs/events
    window.addEventListener("storage", handleStorageChange);
    // Custom event since same window localStorage set doesn't trigger "storage" event
    const observer = setInterval(handleStorageChange, 1000); 

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(observer);
    };
  }, []);

  const activeEmojiCode = isTyping ? "1f914" : currentEmotion; // 1f914 = thinking face

  return (
    <header
      className="
        absolute top-0 left-0 w-full z-40
        bg-background/95
        border-b border-white/5
      "
    >
      <div className="max-w-3xl mx-auto px-2 py-2 flex items-center justify-between">
        
        {/* Menu na Esquerda */}
        <SideMenu />
        
        {/* Perfil (Centro) no estilo pílula moderna */}
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-default">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-indigo-500/20 flex items-center justify-center shadow-inner">
            {!info ? (
              <div className="w-full h-full animate-pulse bg-neutral-800" />
            ) : !useDynamicAvatar ? (
              <img src={info.profileImage || "/Vex_320.png"} className="w-full h-full object-cover" />
            ) : (
              <div className="transform scale-[0.9] flex items-center justify-center">
                <AnimatedEmoji code={activeEmojiCode} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-zinc-100 tracking-tight">
              {info?.name ?? "Vex"}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <div className="relative h-5 w-24 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={status ?? "empty"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-medium lowercase whitespace-nowrap"
                >
                  {t(status ?? "offline")}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Espaço reservado na direita para manter o centro alinhado */}
        <div className="w-10"></div>
        
      </div>
    </header>
  )
}

export default memo(ChatHeader)