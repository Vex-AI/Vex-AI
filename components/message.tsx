"use client";

import React, { useEffect, Fragment, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";

import { MessageProps, Style } from "@/types";
import { getCodePoint, getRandomAnimation } from "@/lib/utils";

import { cn } from "@/lib/utils";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import AnimatedEmoji from "./animated-emoji";
import StaticEmoji from "./static-emoji";

const animationVariants = {
  scaleUp: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.3 },
  },
  slideIn: {
    opacity: 0,
    x: 50,
    transition: { duration: 0.4 },
  },
  rotateEnter: {
    opacity: 0,
    rotate: -15,
    scale: 0.9,
    transition: { duration: 0.35 },
  },
  popIn: {
    opacity: 0,
    scale: 0.5,
    y: 20,
    transition: { type: "spring", stiffness: 200 },
  },
};

const Message: React.FC<MessageProps> = ({ content, isVex, hour, onClose }) => {
  const [style, setStyle] = useState<Style | null>(null);
  const { t } = useTranslation();
  const processedContent = useMemo(() => processContent(content), [content]);
  const [randomAnimation] = useState<keyof typeof animationVariants>(() =>
    getRandomAnimation(animationVariants)
  );

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  useEffect(() => {
    const loadStyles = () => {
      const userStyle = localStorage.getItem("userStyle");
      const vexStyle = localStorage.getItem("vexStyle");
      return JSON.parse((isVex && vexStyle) || (!isVex && userStyle) || "null");
    };
    setStyle(loadStyles());
  }, [isVex]);

  const messageStyle = style
    ? {
        borderTopLeftRadius: `${style.borderTopLeftRadius}px`,
        borderTopRightRadius: `${style.borderTopRightRadius}px`,
        borderBottomLeftRadius: `${style.borderBottomLeftRadius}px`,
        borderBottomRightRadius: `${style.borderBottomRightRadius}px`,
        borderWidth: `${style.borderWidth}px`,
        borderColor: style.borderColor,
        backgroundColor: style["background"],
        color: style.color,
        borderStyle: "solid" as const,
        transition: "all 0.3s ease",
      }
    : undefined;

  const labelStyle = style ? { color: style.color } : undefined;

  const handleDelete = () => {
    onClose();
    setIsDeleteAlertOpen(false);
  };

  return (
    <motion.div
      initial={randomAnimation}
      animate={{
        opacity: 1,
        scale: 1,
        x: 0,
        rotate: 0,
        transition: {
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.5,
        },
      }}
      variants={animationVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ originX: isVex ? 0 : 1 }}
      className="w-full"
    >
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div
              className={cn(
                "relative w-fit max-w-[85%] rounded-xl px-3.5 py-2.5 shadow-md",
                isVex
                  ? "mr-auto bg-muted text-muted-foreground message-vex"
                  : "ml-auto bg-primary text-primary-foreground message-other",
                style && "border"
              )}
              style={messageStyle}
            >
              <div style={labelStyle}>
                <p className={`whitespace-pre-wrap wrap-break-words`}>
                  {processedContent.map((part, index) => (
                    <Fragment key={index}>{part}</Fragment>
                  ))}
                </p>
                <small
                  style={{ color: "white" }}
                  className={cn(
                    "mt-1 block text-right text-xs ",

                    isVex
                      ? "text-muted-foreground/80"
                      : "text-primary-foreground/70"
                  )}
                >
                  {hour}
                </small>
              </div>
            </div>
          </ContextMenuTrigger>

          <ContextMenuContent>
            <ContextMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => setIsDeleteAlertOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("deleteMessage")}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        <AlertDialogContent aria-describedby={undefined}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmation.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmation.message")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel", "Cancelar")}</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete}>
              {t("deleteMessage")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

function processContent(content: string) {
  const emojiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g;
  const tokens: (string | any)[] = [];
  let lastIndex = 0;
  let animatedCount = 0;

  let match;
  while ((match = emojiRegex.exec(content)) !== null) {
    const start = match.index;
    const end = emojiRegex.lastIndex;
    const emoji = match[0];

    if (start > lastIndex) {
      tokens.push(content.substring(lastIndex, start));
    }

    const code = getCodePoint(emoji);
    if (animatedCount < 10) {
      tokens.push(<AnimatedEmoji code={code} key={start} />);
      animatedCount++;
    } else {
      tokens.push(<StaticEmoji code={code} key={start} />);
    }

    lastIndex = end;
  }

  if (lastIndex < content.length) {
    tokens.push(content.substring(lastIndex));
  }

  return tokens;
}

export default Message;
