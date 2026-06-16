import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SidebarContent } from "./sidebar-content";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const DesktopSidebar = () => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="hidden md:flex h-full relative z-50">
      <aside 
        className={cn(
          "flex flex-col border-white/5 bg-[#0a0a0a] transition-all duration-300 ease-in-out",
          isCollapsed ? "w-0 overflow-hidden border-r-0" : "w-64 border-r"
        )}
      >
        <div className="h-[52px] flex items-center justify-between px-4 border-b border-white/5 whitespace-nowrap">
          <div className="flex items-center gap-2 px-2">
            <span className="font-semibold text-base tracking-tight text-zinc-100">
              Vex AI
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(true)}
            className="text-zinc-400 hover:text-zinc-100 h-8 w-8"
          >
            <PanelLeftClose className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="w-64 h-full">
            <SidebarContent />
          </div>
        </div>
      </aside>

      {/* Botão flutuante para reabrir quando colapsado */}
      {isCollapsed && (
        <div className="absolute top-2 left-3 z-50">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(false)}
            className="text-zinc-400 hover:text-zinc-100 bg-[#0a0a0a]/50 backdrop-blur-md border border-white/5 shadow-lg h-9 w-9"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};
