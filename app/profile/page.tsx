"use client";

import { useState, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/vexDB";
import { useTranslation } from "react-i18next";

import { Camera, Pencil, Trash2, Github, Youtube } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";

export default function EditProfile() {
  const { t } = useTranslation();
  const vexInfo = useLiveQuery(() => db.vexInfo.get(1), []);

  const [nameModal, setNameModal] = useState(false);
  const [imgModal, setImgModal] = useState(false);
  const [newName, setNewName] = useState("");

  const saveName = useCallback(async () => {
    if (!newName.trim()) return;
    await db.vexInfo.update(1, { name: newName });
    setNewName("");
    setNameModal(false);
  }, [newName]);

  const selectImage = useCallback(async (e: any) => {
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
    <div className="max-w-md mx-auto p-6 space-y-10">
      <Header />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">{t("vex_profile")}</h1>
        <p className="text-sm text-muted-foreground">{t("vex_profile_text")}</p>
      </div>

      {/* AVATAR */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img
            src={vexInfo?.profileImage || "/Vex_320.png"}
            className="
              w-28 h-28 rounded-full 
              object-cover 
              bg-muted 
            "
          />

          <Button
            size="icon"
            variant="secondary"
            onClick={() => setImgModal(true)}
            className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
          >
            <Camera className="size-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center max-w-[240px]">
          {t("pick_image_message")}
        </p>
      </div>

      {/* NAME */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{t("display_name")}</p>
            <p className="font-medium">{vexInfo?.name || "Vex"}</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNameModal(true)}
          >
            <Pencil className="size-4" />
          </Button>
        </div>
      </div>

      {/* RESET */}
      <div className="space-y-2">
        <Button variant="destructive" className="w-full" onClick={reset}>
          <Trash2 className="size-4 mr-2" />
          {t("reset_profile")}
        </Button>
      </div>

      {/* SOCIAL */}
      <div className="space-y-3 pt-2">
        <p className="text-sm text-muted-foreground text-center">
          {t("oficial_links")}
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a target="_blank" href="https://github.com/Vex-AI/VexAI">
              <Github className="size-5" />
            </a>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <a target="_blank" href="https://youtube.com/@vex-ai">
              <Youtube className="size-5" />
            </a>
          </Button>
        </div>
      </div>

      {/* MODAL – NAME */}
      <Dialog open={nameModal} onOpenChange={setNameModal}>
        <DialogContent aria-describedby={undefined} className="bg-red-700">
          <DialogHeader>
            <DialogTitle>{t("editName")}</DialogTitle>
          </DialogHeader>
          
          <Input
            placeholder={t("typeThing")}
            maxLength={12}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <div className="flex justify-end pt-4">
            <Button onClick={saveName}>{t("save")}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL – IMAGE */}
      <Dialog open={imgModal} onOpenChange={setImgModal}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{t("edit_image")}</DialogTitle>
          </DialogHeader>

          <input
            type="file"
            accept="image/*"
            onChange={selectImage}
            className="text-sm"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
