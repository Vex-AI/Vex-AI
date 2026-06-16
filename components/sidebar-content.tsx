import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Home,
  Sparkles,
  User,
  Paintbrush,
  Languages,
  Trash2,
  Activity,
  Settings,
  Newspaper,
} from "lucide-react";
import { useChangelogStore } from "@/store/changelogStore";
import { db } from "@/lib/vexDB";
import GeminiToggle from "./gemini-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export const menuItems = [
  { labelKey: "home", path: "/home", icon: Home },
  { labelKey: "vexLearning", path: "/intents", icon: Sparkles },
  { labelKey: "customization", path: "/customize", icon: Paintbrush },
  { labelKey: "stats", path: "/stats", icon: Activity },
  { labelKey: "select", path: "/language", icon: Languages },
];

export const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openChangelog } = useChangelogStore();

  const go = (path: string) => {
    navigate(path, { replace: true });
    onNavigate?.();
  };
  
  const handleClearChat = async () => db.messages.clear();

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Top Action (DeepSeek style "New Chat") */}
      <div className="px-3 pt-4 pb-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-full bg-white/5 hover:bg-white/10 px-4 py-6 text-[15px] font-medium text-zinc-200 transition-colors"
            >
              <div className="flex items-center justify-center w-5 h-5">
                <Trash2 className="w-4 h-4 text-zinc-400" />
              </div>
              {t("clearChat")}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent
            className="border-none bg-zinc-900/60 backdrop-blur-xl text-zinc-100 shadow-2xl rounded-2xl p-6"
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-semibold text-zinc-100">
                {t("are_you_sure_title")}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-300 text-sm">
                {t("are_you_sure_clear_chat")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel className="bg-zinc-800/40 text-zinc-200 hover:bg-zinc-800/70 rounded-xl transition-colors border-none">
                {t("cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearChat}
                className="bg-red-500 text-white hover:bg-red-600 rounded-xl transition-colors border-none"
              >
                {t("clear")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-none">
        <div className="mb-2 px-2 mt-4">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
            {t("navigation")}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => go(item.path)}
                className="w-full justify-start gap-3 rounded-lg bg-transparent px-3 py-5 text-[15px] font-medium text-zinc-300 hover:bg-white/5 hover:text-zinc-100 transition-colors"
              >
                <Icon className="size-4 text-zinc-400" />
                <span className="truncate">{t(item.labelKey)}</span>
              </Button>
            );
          })}
        </div>

        <div className="mb-2 px-2 mt-8">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
            {t("config")}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-white/5 transition-colors">
            <Label className="text-[15px] font-medium text-zinc-300 cursor-pointer">
              {t("enable_gemini")}
            </Label>
            <GeminiToggle />
          </div>

          <Button
            variant="ghost"
            onClick={() => {
              openChangelog();
              onNavigate?.();
            }}
            className="w-full justify-start gap-3 rounded-lg bg-transparent px-3 py-5 text-[15px] font-medium text-zinc-300 hover:bg-white/5 hover:text-zinc-100 transition-colors mt-1"
          >
            <Newspaper className="size-4 text-zinc-400" />
            <span className="truncate">{t("view_changelog", "Notas da Versão")}</span>
          </Button>
        </div>
      </div>

      {/* Bottom Profile/Settings Row (DeepSeek style) */}
      <div className="px-3 py-4 mt-auto">
        <div 
          onClick={() => go("/profile")}
          className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-white/5 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
               <User className="size-4 text-indigo-400" />
            </div>
            <span className="text-[15px] font-medium text-zinc-200">
              {t("vexProfile")}
            </span>
          </div>
          <div 
            onClick={(e) => {
              e.stopPropagation();
              go("/settings");
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Settings className="size-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
