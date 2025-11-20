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
import { Save, Trash2 } from "lucide-react";
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
    <div className="max-w-xl pb-20 mx-auto p-4 space-y-6 ">
      {/* Header */}
      <Header/>
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
        <CardContent >
          <div className="flex items-center space-x-2 ">
            <Switch
              checked={key === "vexStyle"}
              onCheckedChange={() =>
                setKey((p) => (p === "vexStyle" ? "userStyle" : "vexStyle"))
              }
              id="change-style"
              className="
             
    data-[state=checked]:bg-blue-500
    data-[state=unchecked]:bg-zinc-700

    [&>span]:data-[state=checked]:bg-white
    [&>span]:data-[state=unchecked]:bg-zinc-300
  "
            />

            <Label htmlFor="change-style" className="text-base w-100">
              {key === "vexStyle" ? t("isVex") : t("isUser")}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Radius + Border Controls */}
      <Card className="w-full">
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
                className=" bg-red-500"
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
      <Card className="flex justify-center items-center flex-col">
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
        <Button
          variant="destructive"
          className="w-full bg-green-700"
          onClick={save}
        >
          <Save className="size-4 mr-2" /> {t("save_styles")}
        </Button>

        <Button className="w-full bg-red-700" onClick={remove}>
          <Trash2 className="size-4 mr-2" /> {t("delete_styles")}
        </Button>
      </div>
    </div>
  );
}
