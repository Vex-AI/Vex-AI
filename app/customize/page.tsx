"use client";

import { useState, useEffect, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { useTranslation } from "react-i18next";
import { ChromePicker } from "react-color";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import Preview from "@/components/preview";


const defaultStyle = {
  borderTopRightRadius: 10,
  borderTopLeftRadius: 10,
  borderBottomRightRadius: 10,
  borderBottomLeftRadius: 10,
  borderColor: "#ffffff",
  borderWidth: 2,
  background: "rgba(220, 17, 47, 0.9)",
  color: "#ffffff",
  ripple: "#000000",
  padding: "10px",
};

export default function Customize() {
  const { t } = useTranslation();
  const nav = useNavigate();

  const [key, setKey] = useState<"vexStyle" | "userStyle">("vexStyle");

  const savedStyle = useMemo(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultStyle;
  }, [key]);

  const [style, setStyle] = useState(savedStyle);

  const update = (obj: any) =>
    setStyle((prev:any) => ({
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
    <div className="max-w-xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => nav("/home")}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-xl font-bold">{t("customization")}</h1>
      </div>

      {/* Preview */}
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

      {/* Switch Mode */}
      <Card>
        <CardHeader>
          <CardTitle>{t("choose_profile")}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between py-3">
          <Label className="text-base">
            {key === "vexStyle" ? t("isVex") : t("isUser")}
          </Label>
          <Switch
            checked={key === "vexStyle"}
            onCheckedChange={() =>
              setKey((p) => (p === "vexStyle" ? "userStyle" : "vexStyle"))
            }
          />
        </CardContent>
      </Card>

      {/* Radius + Border Controls */}
      <Card>
        <CardHeader>
          <CardTitle>{t("bubble_style")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {[
            ["borderTopLeftRadius", t("topLeftRadius")],
            ["borderTopRightRadius", t("topRightRadius")],
            ["borderBottomLeftRadius", t("bottomLeftRadius")],
            ["borderBottomRightRadius", t("bottomRightRadius")],
            ["borderWidth", t("borderWidth")],
          ].map(([item, label]) => (
            <div key={item} className="flex flex-col gap-2">
              <Label>{label}</Label>
              <Slider
                defaultValue={[style[item]]}
                max={item === "borderWidth" ? 10 : 30}
                step={1}
                onValueChange={([v]) => update({ [item]: v })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Color Pickers */}
      <Card>
        <CardHeader>
          <CardTitle>{t("colors")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-3">
            <Label>{t("backgroundColor")}</Label>
            <ChromePicker
              color={style.background}
              onChange={(c) => update({ background: c.hex })}
            />
          </div>

          <div className="space-y-3">
            <Label>{t("text_color")}</Label>
            <ChromePicker
              color={style.color}
              onChange={(c) => update({ color: c.hex })}
            />
          </div>

          <div className="space-y-3">
            <Label>{t("ripple_color")}</Label>
            <ChromePicker
              color={style.ripple}
              onChange={(c) => update({ ripple: c.hex })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="space-y-3">
        <Button className="w-full" onClick={save}>
          <Save className="size-4 mr-2" /> {t("save_styles")}
        </Button>

        <Button variant="destructive" className="w-full" onClick={remove}>
          <Trash2 className="size-4 mr-2" /> {t("delete_styles")}
        </Button>
      </div>
    </div>
  );
}
