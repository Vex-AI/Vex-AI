
import { motion, AnimatePresence } from "framer-motion"
import SideMenu from "./side-menu"
import { memo } from "react";


const ChatHeader=({ info, status }: { info?: { name?: string; profileImage?: string }, status?: string })=> {

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-40
        backdrop-blur-xl
        bg-black/20 supports-[backdrop-filter]:bg-black/20
        border-b border-white/5
      "
    >
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Perfil */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-neutral-900">
            {!info ? (
              <div className="w-full h-full animate-pulse bg-neutral-800" />
            ) : (
              <img
                src={info.profileImage ?? "/Vex_320.png"}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold">
              {info?.name ?? "Vex"}
            </span>

            <div className="relative h-5">
              <AnimatePresence mode="wait">
                <motion.span
                  key={status ?? "empty"}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute text-sm text-neutral-300"
                >
                  {status ?? "offline"}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Aqui entra o menu REAL — SideMenu já contém o Sheet + Trigger */}
        <SideMenu />
      </div>
    </header>
  )
}

export default memo(ChatHeader)