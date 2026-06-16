import { Bot, Zap, Brain } from "lucide-react";
import { useTranslation } from "react-i18next";

const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 rounded-xl text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <Bot className="w-6 h-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-zinc-100 tracking-tight">
            Start chatting with Vex
          </h1>
        </div>

        {/* Decorativo: Toggle estilo DeepSeek */}
        <div className="flex items-center bg-[#1a1a1a] rounded-full p-1 border border-white/10">
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#2a2a2a] text-sm font-medium text-zinc-100 shadow-sm cursor-default transition-all">
            <Zap className="size-4 text-indigo-400 fill-indigo-400" />
            Instant
          </div>
          <div className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-zinc-400 hover:text-white cursor-pointer transition-colors">
            <Brain className="size-4" />
            Expert
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmptyState;
