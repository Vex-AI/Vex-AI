"use client";

import { useState, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/vexDB";
import { useTranslation } from "react-i18next";

import { Camera, Pencil, Github, Youtube, Link as LinkIcon, RefreshCw, SmilePlus } from "lucide-react";
import { motion } from "framer-motion";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Header from "@/components/header";

export default function EditProfile() {
  const { t } = useTranslation();
  const vexInfo = useLiveQuery(() => db.vexInfo.get(1), []);

  const [nameModal, setNameModal] = useState(false);
  const [imgModal, setImgModal] = useState(false);
  const [newName, setNewName] = useState("");
  
  // Dynamic avatar state
  const [dynamicAvatar, setDynamicAvatar] = useState(() => {
    const val = localStorage.getItem("dynamicAvatar");
    return val !== "false"; // true by default
  });

  const toggleDynamicAvatar = (checked: boolean) => {
    setDynamicAvatar(checked);
    localStorage.setItem("dynamicAvatar", checked.toString());
  };

  const saveName = useCallback(async () => {
    if (!newName.trim()) return;
    await db.vexInfo.update(1, { name: newName });
    setNewName("");
    setNameModal(false);
  }, [newName]);

  const selectImage = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      await db.vexInfo.update(1, { profileImage: ev.target?.result as string });
    };

    reader.readAsDataURL(file);
    setImgModal(false);
  }, []);

  const reset = async () => {
    await db.vexInfo.update(1, {
      name: "Vex",
      profileImage: "/Vex_320.png",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d0d] text-white overflow-x-hidden">
      <Header 
        title={t("vex_profile")} 
        description={t("vex_profile_text")}
      />

      <main className="flex-1 max-w-md w-full mx-auto p-6 space-y-8 mt-4 pb-20">

        {/* AVATAR SECTION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center gap-5 p-6 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent pointer-events-none" />
          
          <div className="relative group">
            <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
            <img
              src={vexInfo?.profileImage || "/Vex_320.png"}
              className="relative w-32 h-32 rounded-full object-cover border-4 border-[#0d0d0d] shadow-2xl transition-transform duration-500 group-hover:scale-105"
            />
            
            <Button
              size="icon"
              onClick={() => setImgModal(true)}
              className="absolute bottom-0 right-0 rounded-full h-10 w-10 bg-pink-500 hover:bg-pink-600 text-white shadow-lg border-2 border-[#0d0d0d] transition-transform hover:scale-110"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs text-neutral-400 text-center max-w-[240px] relative z-10">
            {t("pick_image_message")}
          </p>

          <div className="flex items-center justify-between w-full mt-2 bg-black/40 px-5 py-4 rounded-2xl border border-white/10 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <SmilePlus className="w-4 h-4 text-pink-400" />
              </div>
              <Label htmlFor="dynamic-avatar" className="text-sm font-medium cursor-pointer text-white/90">
                {t("dynamic_avatar")}
              </Label>
            </div>
            <Switch 
              id="dynamic-avatar" 
              checked={dynamicAvatar} 
              onCheckedChange={toggleDynamicAvatar} 
              className="data-[state=checked]:bg-pink-500 data-[state=unchecked]:bg-white/20"
            />
          </div>
        </motion.div>

        {/* NAME AND RESET */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/[0.07] transition-colors">
            <div className="flex flex-col">
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">{t("display_name")}</span>
              <span className="text-lg font-medium text-white/90">{vexInfo?.name || "Vex"}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNameModal(true)}
              className="rounded-full hover:bg-white/10 text-neutral-400 hover:text-white"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl border-red-500/20 bg-red-500/5 hover:bg-red-500/20 hover:text-red-400 text-neutral-300 transition-all font-medium" 
            onClick={reset}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("reset_profile")}
          </Button>
        </motion.div>

        {/* SOCIAL LINKS */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2 text-neutral-500">
            <LinkIcon className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-semibold">{t("oficial_links")}</span>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="ghost" size="icon" asChild className="rounded-full w-12 h-12 bg-white/5 hover:bg-white/10 hover:text-white text-neutral-400 transition-all">
              <a target="_blank" href="https://github.com/Vex-AI/VexAI" rel="noreferrer">
                <Github className="w-5 h-5" />
              </a>
            </Button>

            <Button variant="ghost" size="icon" asChild className="rounded-full w-12 h-12 bg-white/5 hover:bg-[#ff0000]/20 hover:text-[#ff0000] text-neutral-400 transition-all">
              <a target="_blank" href="https://youtube.com/@vex-ai" rel="noreferrer">
                <Youtube className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </motion.div>

        {/* MODAL – NAME */}
        <Dialog open={nameModal} onOpenChange={setNameModal}>
          <DialogContent aria-describedby={undefined} className="bg-[#1a1a1a] border-white/10 text-white rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{t("editName")}</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <Input
                placeholder={t("typeThing")}
                maxLength={12}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-black/40 border-white/10 focus-visible:ring-pink-500/50 h-12 rounded-xl text-lg px-4"
              />
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <Button variant="ghost" onClick={() => setNameModal(false)} className="hover:bg-white/5 text-neutral-400 rounded-xl">Cancelar</Button>
              <Button onClick={saveName} className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.3)]">{t("save")}</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* MODAL – IMAGE */}
        <Dialog open={imgModal} onOpenChange={setImgModal}>
          <DialogContent aria-describedby={undefined} className="bg-[#1a1a1a] border-white/10 text-white rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold mb-4">{t("edit_image")}</DialogTitle>
            </DialogHeader>

            <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/20 hover:border-pink-500/50 transition-colors bg-white/5 group">
              <input
                type="file"
                accept="image/*"
                onChange={selectImage}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="p-3 bg-white/10 rounded-full group-hover:bg-pink-500/20 transition-colors">
                  <Camera className="w-6 h-6 text-neutral-400 group-hover:text-pink-400 transition-colors" />
                </div>
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">Clique para escolher uma imagem</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
