"use client";

import { useState, useEffect, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { useTranslation } from "react-i18next";
import { ChromePicker } from "react-color";
import { toast } from "sonner";
import { Save, Trash2, Paintbrush, Layers, Palette, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import Preview from "@/components/preview";
import Header from "@/components/header";

const defaultStyle = {
  borderTopRightRadius: 15,
  borderTopLeftRadius: 15,
  borderBottomRightRadius: 15,
  borderBottomLeftRadius: 15,
  borderColor: "#ffffff",
  borderWidth: 0,
  background: "rgba(220, 17, 47, 0.9)",
  color: "#ffffff",
  ripple: "#000000",
  padding: "10px",
};

export default function Customize() {
  const { t } = useTranslation();

  const [key, setKey] = useState<"vexStyle" | "userStyle">("vexStyle");

  const savedStyle = useMemo(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultStyle;
  }, [key]);

  const [style, setStyle] = useState(savedStyle);

  const update = (obj: any) =>
    setStyle((prev: any) => ({
      ...prev,
      ...obj,
    }));

  const save = () => {
    localStorage.setItem(key, JSON.stringify(style));
    toast.success(t("saved_success"));
  };

  const remove = () => {
    localStorage.removeItem(key);
    toast.success(t("deleted_success"));
    setStyle(defaultStyle);
  };

  useEffect(() => {
    const stored = localStorage.getItem(key);
    setStyle(stored ? JSON.parse(stored) : defaultStyle);
  }, [key]);

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-[#0d0d0d] text-white">
      <div className="px-6 pt-6">
        <Header />
      </div>

      <main className="flex-1 overflow-y-auto scrollbar-none p-4 pb-20">
        <div className="max-w-xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 mt-4"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/10 mb-4">
            <Paintbrush className="w-6 h-6 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">{t("customization")}</h1>
          <p className="text-sm text-neutral-400 leading-relaxed">{t("customization_desc")}</p>
        </motion.div>

        {/* Preview Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="sticky top-4 z-20 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col items-center justify-center min-h-[160px] shadow-2xl"
        >
          <Preview
            style={{
              ...style,
              borderWidth: `${style.borderWidth}px`,
              padding: "1rem",
              borderStyle: "solid",
              background: style.background,
            }}
            text={key === "vexStyle" ? t("vex_message") : t("user_message")}
          />
        </motion.div>

        {/* Mode Switcher */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <RefreshCcw className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white/90">{t("choose_profile")}</span>
              <span className="text-xs text-neutral-400">{key === "vexStyle" ? t("isVex") : t("isUser")}</span>
            </div>
          </div>
          <Switch
            checked={key === "vexStyle"}
            onCheckedChange={() =>
              setKey((p) => (p === "vexStyle" ? "userStyle" : "vexStyle"))
            }
            id="change-style"
            className="data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-neutral-600"
          />
        </motion.div>

        {/* Radius + Border Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/5 space-y-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wider">{t("bubble_style")}</h2>
          </div>

          <div className="space-y-6">
            {[
              ["borderTopLeftRadius", t("topLeftRadius")],
              ["borderTopRightRadius", t("topRightRadius")],
              ["borderBottomLeftRadius", t("bottomLeftRadius")],
              ["borderBottomRightRadius", t("bottomRightRadius")],
              ["borderWidth", t("borderWidth")],
            ].map(([item, label]) => (
              <div key={item} className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <Label className="text-neutral-300 text-sm">{label}</Label>
                  <span className="text-xs font-mono text-neutral-500 bg-black/40 px-2 py-1 rounded-md">
                    {style[item]}px
                  </span>
                </div>
                <Slider
                  className="[&>span]:bg-purple-500"
                  value={[style[item]]}
                  max={item === "borderWidth" ? 10 : 30}
                  step={1}
                  onValueChange={([v]) => update({ [item]: v })}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Color Pickers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-5 h-5 text-yellow-400" />
            <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wider">{t("colors")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
            <div className="space-y-3 w-full flex flex-col items-center">
              <Label className="text-neutral-300">{t("backgroundColor")}</Label>
              <div className="p-2 bg-black/40 rounded-xl border border-white/10">
                <ChromePicker
                  color={style.background}
                  onChange={(c) => update({ background: c.hex })}
                  disableAlpha={true}
                />
              </div>
            </div>

            <div className="space-y-3 w-full flex flex-col items-center">
              <Label className="text-neutral-300">{t("text_color")}</Label>
              <div className="p-2 bg-black/40 rounded-xl border border-white/10">
                <ChromePicker
                  color={style.color}
                  onChange={(c) => update({ color: c.hex })}
                  disableAlpha={true}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4 pt-4"
        >
          <Button
            onClick={save}
            className="h-14 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors shadow-none border-none"
          >
            <Save className="w-5 h-5 mr-2" /> {t("save_styles")}
          </Button>

          <Button 
            onClick={remove}
            variant="outline"
            className="h-14 rounded-xl border-white/10 bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-colors text-neutral-300 font-medium"
          >
            <Trash2 className="w-5 h-5 mr-2" /> {t("delete_styles")}
          </Button>
        </motion.div>
        </div>
      </main>
    </div>
  );
}
