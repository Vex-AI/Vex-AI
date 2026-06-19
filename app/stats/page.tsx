"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Battery, Zap, Flame, Heart, Shield, Users, Compass, Smile, Frown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedEmoji from "@/components/animated-emoji";
import { getState } from "@/lib/psyche/VexPsyche";
import type { VexPsycheState } from "@/types/psyche";
import { getMoodEmoji } from "@/lib/psyche/MoodEngine";

const ProgressBar = ({ label, value, color, icon: Icon }: { label: string, value: number, color: string, icon: React.ElementType }) => (
  <div className="flex flex-col gap-1 mb-4">
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2 text-white/80">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <span className="font-mono text-xs text-white/60">{Math.round(value)}%</span>
    </div>
    <div className="w-full bg-black/40 rounded-full h-2.5 border border-white/5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ duration: 1, delay: 0.2, type: "spring" }}
        className={`h-2.5 rounded-full ${color}`}
      ></motion.div>
    </div>
  </div>
);

export default function Stats() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [psyche, setPsyche] = useState<VexPsycheState | null>(null);

  useEffect(() => {
    const fetchPsyche = async () => {
      const state = await getState();
      setPsyche(state);
    };
    fetchPsyche();
  }, []);

  if (!psyche) {
    return <div className="flex items-center justify-center h-screen bg-[#0d0d0d] text-white">Loading...</div>;
  }

  const { internalState, emotions, mood, relationship, personality } = psyche;
  const moodEmoji = getMoodEmoji(mood);

  return (
    <div className="flex flex-col h-screen bg-[#0d0d0d] text-white overflow-y-auto">
      <header className="flex items-center gap-4 px-4 py-5 border-b border-white/10 sticky top-0 bg-[#0d0d0d]/95 z-10">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => navigate("/home", { replace: true })}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">{t("stats") || "Estatísticas"}</h1>
          <p className="text-xs text-neutral-400">{t("psyche_dashboard") || "Painel de Humor"}</p>
        </div>
      </header>

      <main className="p-4 space-y-6 pb-12">
        {/* Mood & Energy Section */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 mb-2 flex items-center justify-center">
              <AnimatedEmoji code={moodEmoji} />
            </div>
            <span className="text-sm font-medium text-white/80 capitalize">{t(mood.toLowerCase()) || mood}</span>
            <span className="text-xs text-neutral-500 mt-1">{t("stats_current_mood")}</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center"
          >
            <div className="flex items-center gap-2 mb-3 text-white/80">
              <Battery className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">{t("stats_battery")}</span>
            </div>
            <div className="text-3xl font-mono font-bold">{Math.round(internalState.energy)}<span className="text-lg text-neutral-500">%</span></div>
          </motion.div>
        </div>

        {/* Internal States */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-white/5 border border-white/10"
        >
          <h2 className="text-sm font-semibold text-white/90 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" /> {t("stats_internal_states")}
          </h2>
          <ProgressBar label={t("stats_stress")} value={internalState.stress} color="bg-red-500" icon={Flame} />
          <ProgressBar label={t("stats_boredom")} value={internalState.boredom} color="bg-zinc-500" icon={AlertCircle} />
          <ProgressBar label={t("stats_motivation")} value={internalState.motivation} color="bg-blue-500" icon={Zap} />
        </motion.div>

        {/* Emotions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl bg-white/5 border border-white/10"
        >
          <h2 className="text-sm font-semibold text-white/90 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Smile className="w-4 h-4 text-pink-400" /> {t("stats_immediate_emotions")}
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <ProgressBar label={t("stats_happiness")} value={emotions.happiness} color="bg-green-400" icon={Smile} />
            <ProgressBar label={t("stats_sadness")} value={emotions.sadness} color="bg-blue-400" icon={Frown} />
            <ProgressBar label={t("stats_anger")} value={emotions.anger} color="bg-red-500" icon={Flame} />
            <ProgressBar label={t("stats_fear")} value={emotions.fear} color="bg-purple-500" icon={AlertCircle} />
            <ProgressBar label={t("stats_trust")} value={emotions.trust} color="bg-cyan-400" icon={Shield} />
            <ProgressBar label={t("stats_curiosity")} value={emotions.curiosity} color="bg-yellow-400" icon={Compass} />
          </div>
        </motion.div>

        {/* Relationship */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl bg-white/5 border border-white/10"
        >
          <h2 className="text-sm font-semibold text-white/90 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" /> {t("stats_relationship")}
          </h2>
          <ProgressBar label={t("stats_affection")} value={relationship.affection} color="bg-pink-500" icon={Heart} />
          <ProgressBar label={t("stats_respect")} value={relationship.respect} color="bg-amber-500" icon={Users} />
          <ProgressBar label={t("stats_trust")} value={relationship.trust} color="bg-indigo-400" icon={Shield} />
          <ProgressBar label={t("stats_attachment")} value={relationship.attachment} color="bg-rose-600" icon={Heart} />
        </motion.div>

        {/* Personality */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 rounded-2xl bg-white/5 border border-white/10"
        >
          <h2 className="text-sm font-semibold text-white/90 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" /> {t("stats_personality")}
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <ProgressBar label={t("stats_empathy")} value={personality.empathy} color="bg-emerald-500" icon={Heart} />
            <ProgressBar label={t("stats_patience")} value={personality.patience} color="bg-teal-500" icon={Smile} />
            <ProgressBar label={t("stats_sociability")} value={personality.sociability} color="bg-lime-500" icon={Users} />
            <ProgressBar label={t("stats_confidence")} value={personality.confidence} color="bg-violet-500" icon={Shield} />
          </div>
        </motion.div>

      </main>
    </div>
  );
}
