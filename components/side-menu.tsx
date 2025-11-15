"use client";

import React from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import {
  Home,
  Sparkles,
  User,
  Paintbrush,
  Languages,
  Trash2,
  Menu,
} from "lucide-react";

import { db } from "@/lib/vexDB";
import GeminiToggle from "./gemini-toggle";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

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

const menuItems = [
  { labelKey: "home", path: "/home", icon: Home },
  { labelKey: "vexLearning", path: "/intents", icon: Sparkles },
  { labelKey: "vexProfile", path: "/profile", icon: User },
  { labelKey: "customization", path: "/customize", icon: Paintbrush },
  { labelKey: "select", path: "/language", icon: Languages },
];

const SideMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const go = (path: string) => navigate(path, { replace: true });
  const handleClearChat = async () => db.messages.clear();

  return (
    <Sheet>
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
        className="w-full max-w-xs rounded-r-xl border-r border-white/10 bg-[#0d0d0d] p-0 text-white"
      >
        <SheetHeader className="px-6 py-5 border-b border-white/10">
          <SheetTitle className="text-lg font-semibold tracking-tight">
            {t("menu") }
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="px-4 py-5">
            <p className="mb-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
              {t("navigation")}
            </p>

            <div className="flex flex-col gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SheetClose asChild key={item.path}>
                    <Button
                      variant="ghost"
                      onClick={() => go(item.path)}
                      className="w-full justify-start gap-3 rounded-lg bg-transparent px-3 py-3 text-base font-medium text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Icon className="size-5" />
                      {t(item.labelKey)}
                    </Button>
                  </SheetClose>
                );
              })}
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="px-4 py-5">
            <p className="mb-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
              {t("actions")}
            </p>

            <AlertDialog aria-describedby={undefined}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-lg px-3 py-3 text-base font-medium text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="size-5" />
                  {t("clearChat")}
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent
                aria-describedby={undefined}
                className="
      border-none 
      bg-zinc-900/60 
      backdrop-blur-xl 
      text-zinc-100
      shadow-2xl
      rounded-2xl
      p-6
    "
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
                  <AlertDialogCancel
                    className="
          bg-zinc-800/40 
          text-zinc-200 
          hover:bg-zinc-800/70 
          rounded-xl 
          transition-colors
        "
                  >
                    {t("cancel")}
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={handleClearChat}
                    className="
          bg-red-500 
          text-white 
          hover:bg-red-600 
          rounded-xl
          transition-colors
        "
                  >
                    {t("clear")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <Separator className="bg-white/10" />

          <div className="px-4 py-5">
            <p className="mb-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
              {t("config")}
            </p>

            <div className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-white/10 transition-colors">
              <Label className="text-base cursor-pointer">
                {t("enable_gemini")}
              </Label>
              <GeminiToggle />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
