"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { SidebarContent } from "./sidebar-content";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

const SideMenu = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const deltaX = endX - startX;
      const deltaY = Math.abs(endY - startY);

      // Puxar da borda esquerda para a direita (abre o menu)
      if (startX < 40 && deltaX > 50 && deltaY < 50) {
        setOpen(true);
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 transition-colors"
          >
            <Menu className="size-6" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          aria-describedby={undefined}
          className="w-full max-w-xs rounded-r-xl border-r border-white/10 bg-[#0d0d0d] p-0 text-white flex flex-col"
        >
          <SheetHeader className="px-6 py-5 border-b border-white/10 flex-shrink-0">
            <SheetTitle className="text-lg font-semibold tracking-tight">
              {t("menu")}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-hidden">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SideMenu;


