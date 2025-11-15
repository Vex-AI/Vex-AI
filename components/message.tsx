"use client";

import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";

import { MessageProps, Style } from "@/types";
import { getCodePoint } from "@/lib/utils";
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
import { Skeleton } from "@/components/ui/skeleton";

import AnimatedEmoji from "./animated-emoji";
import StaticEmoji from "./static-emoji";

export function MessageSkeleton({ isVex }: { isVex: boolean }) {
  return (
    <div
      className={cn(
        "w-fit max-w-[85%] rounded-xl ",
        isVex ? "mr-auto" : "ml-auto"
      )}
    >
      <div className="w-fit max-w-[85%] rounded-xl p-2">
        <div
          className={`flex flex-col  gap-2 ${
            isVex ? "items-start" : "items-end"
          }`}
        >
          <Skeleton className="h-4 w-[250px] bg-[#413c3c]" />
          <Skeleton className="h-4 w-[200px] bg-[#413c3c]" />
        </div>
      </div>
    </div>
  );
}

const Message: React.FC<MessageProps> = ({ content, isVex, hour, onClose }) => {
  const { t } = useTranslation();
  const [style, setStyle] = useState<Style | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const processedContent = useMemo(() => processContent(content), [content]);

  useEffect(() => {
    const load = () => {
      const userStyle = localStorage.getItem("userStyle");
      const vexStyle = localStorage.getItem("vexStyle");
      return JSON.parse((isVex && vexStyle) || (!isVex && userStyle) || "null");
    };

    setStyle(load());
    setLoading(false);
  }, [isVex]);

  if (loading) return <MessageSkeleton isVex={isVex} />;

  const bubbleStyle = style
    ? {
        borderTopLeftRadius: `${style.borderTopLeftRadius}px`,
        borderTopRightRadius: `${style.borderTopRightRadius}px`,
        borderBottomLeftRadius: `${style.borderBottomLeftRadius}px`,
        borderBottomRightRadius: `${style.borderBottomRightRadius}px`,
        borderWidth: `${style.borderWidth}px`,
        borderColor: style.borderColor,
        backgroundColor: style.background,
        color: style.color,
        borderStyle: "solid" as const,
      }
    : {};

  const textColor = style ? { color: style.color } : undefined;

  const handleDelete = () => {
    onClose();
    setIsDeleteAlertOpen(false);
  };

  return (
    <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              "relative w-fit max-w-[85%] rounded-xl px-4 py-3 shadow-sm transition-all",
              isVex
                ? "mr-auto bg-muted message-vex"
                : "ml-auto bg-primary text-primary-foreground message-other",
              style && "border"
            )}
            style={bubbleStyle}
          >
            <div style={textColor}>
              <p className="whitespace-pre-wrap wrap-break-words">
                {processedContent.map((part, i) => (
                  <Fragment key={i}>{part}</Fragment>
                ))}
              </p>

              <small
                className={cn(
                  "mt-1 block text-right text-xs opacity-60",
                  isVex ? "text-muted-foreground" : "text-primary-foreground"
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
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete}>
            {t("deleteMessage")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Message;

function processContent(content: string) {
  const emojiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g;
  const tokens: (string | any)[] = [];
  let last = 0;
  let animatedCount = 0;

  let m;
  while ((m = emojiRegex.exec(content)) !== null) {
    const start = m.index;
    const end = emojiRegex.lastIndex;

    if (start > last) tokens.push(content.substring(last, start));

    const code = getCodePoint(m[0]);

    if (animatedCount < 10) {
      tokens.push(<AnimatedEmoji code={code} key={start} />);
      animatedCount++;
    } else {
      tokens.push(<StaticEmoji code={code} key={start} />);
    }

    last = end;
  }

  if (last < content.length) tokens.push(content.substring(last));

  return tokens;
}
