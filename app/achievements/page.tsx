"use client";


import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAchievementStore } from "@/store/achievementStore";

export default function AchievementsPage() {

  const navigate = useNavigate();
  const { badges } = useAchievementStore();

  const lang = (localStorage.getItem("language") === "ptBR" ? "ptBR" : "enUS") as "ptBR" | "enUS";

  const unlocked = badges.filter((b) => b.unlockedAt);
  const locked = badges.filter((b) => !b.unlockedAt);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(lang === "ptBR" ? "pt-BR" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] text-white overflow-y-auto">
      <header className="flex items-center gap-4 px-4 py-5 border-b border-white/10 sticky top-0 bg-[#0d0d0d]/95 z-10">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => navigate("/home", { replace: true })}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            {lang === "ptBR" ? "Conquistas" : "Achievements"}
          </h1>
          <p className="text-xs text-neutral-400">
            {unlocked.length}/{badges.length} {lang === "ptBR" ? "desbloqueadas" : "unlocked"}
          </p>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent rounded-2xl border border-amber-500/20 p-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center text-3xl border border-amber-500/30">
              🏆
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-amber-400">
                {unlocked.length}<span className="text-base text-neutral-500">/{badges.length}</span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {lang === "ptBR" ? "Emblemas conquistados" : "Badges earned"}
              </p>
            </div>
          </div>
        </motion.div>

        {unlocked.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-white/90 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              {lang === "ptBR" ? "Desbloqueados" : "Unlocked"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {unlocked.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.03] border border-white/10 hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center text-2xl border border-amber-500/20 shrink-0">
                      {badge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-white truncate">{badge.name[lang]}</h3>
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">{badge.description[lang]}</p>
                      <p className="text-[10px] text-amber-500/70 mt-1.5 font-mono">
                        {formatDate(badge.unlockedAt!)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-white/90 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-neutral-500" />
            {lang === "ptBR" ? "Bloqueados" : "Locked"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {locked.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (unlocked.length + i) * 0.08 }}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl grayscale opacity-30 border border-white/5 shrink-0">
                    ❓
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-neutral-500 truncate">???</h3>
                    <p className="text-xs text-neutral-600 mt-0.5 line-clamp-2">
                      {lang === "ptBR" ? "[Conquista Oculta] Continue interagindo para descobrir." : "[Hidden Badge] Keep interacting to discover."}
                    </p>
                    <p className="text-[10px] text-neutral-700 mt-1.5">
                      {lang === "ptBR" ? "Bloqueado" : "Locked"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
