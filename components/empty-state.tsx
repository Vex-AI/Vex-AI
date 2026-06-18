"use client";

import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  onSuggestion?: (text: string) => void;
}

const EmptyState = ({ onSuggestion }: EmptyStateProps) => {
  const { t } = useTranslation();

  const suggestions = [
    { emoji: "🌙", key: "suggestion_dreams" },
    { emoji: "😊", key: "suggestion_mood" },
    { emoji: "🎵", key: "suggestion_music" },
    { emoji: "✨", key: "suggestion_surprise" },
  ];

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center px-4 select-none">
      {/* Avatar */}
      <div className="relative mb-5">
        <img
          src="/Vex_320.png"
          alt="Vex"
          className="w-24 h-24 rounded-full object-cover ring-2 ring-white/10 shadow-xl"
          draggable={false}
        />
        <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0b0b0b] shadow" />
      </div>

      {/* Saudação */}
      <h1 className="text-2xl font-semibold text-zinc-100 mb-1 tracking-tight">
        {t("chat_empty_greeting").replace("Vex", "").trim()}{" "}
        <span className="text-indigo-400">Vex</span>{" "}
        {t("chat_empty_greeting").includes("✨") ? "✨" : ""}
      </h1>
      <p className="text-sm text-zinc-500 mb-8 text-center max-w-xs leading-relaxed">
        {t("chat_empty_subtitle")}
      </p>

      {/* Sugestões */}
      <div className="flex flex-wrap gap-2 justify-center max-w-sm">
        {suggestions.map((s) => (
          <button
            key={s.key}
            onClick={() => onSuggestion?.(t(s.key))}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 hover:bg-white/10 hover:border-indigo-400/40 hover:text-white transition-all duration-200 cursor-pointer active:scale-95"
          >
            <span>{s.emoji}</span>
            <span>{t(s.key)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
