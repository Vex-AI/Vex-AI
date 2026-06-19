"use client";

import React, { Fragment, memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, RefreshCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { MessageProps, Style } from "@/types";
import { getCodePoint } from "@/lib/utils";
import { cn } from "@/lib/utils";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

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

const renderWithEmojis = (children: React.ReactNode) => {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return processContent(child).map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ));
    }
    return child;
  });
};

const Message: React.FC<MessageProps> = ({ content, isVex, hour, onClose, isError, onRetry }) => {
  const { t } = useTranslation();
  
  // Calculate style synchronously to avoid layout shifts (scroll teleportation)
  const userStyle = typeof window !== 'undefined' ? localStorage.getItem("userStyle") : null;
  const vexStyle = typeof window !== 'undefined' ? localStorage.getItem("vexStyle") : null;
  const raw = (isVex && vexStyle) || (!isVex && userStyle) || "null";
  const style: Style | null = JSON.parse(raw);

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

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            "relative w-fit max-w-[85%] rounded-[20px] px-5 py-3.5 shadow-sm transition-all",
            isVex
              ? "mr-auto bg-muted message-vex"
              : "ml-auto bg-primary text-primary-foreground message-other",
            style && "border"
          )}
          style={bubbleStyle}
        >
          <div style={textColor}>
            <div className="whitespace-pre-wrap wrap-break-words leading-relaxed text-[15px] space-y-2">
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => <p>{renderWithEmojis(props.children)}</p>,
                  strong: ({ node, ...props }) => <strong className="font-bold">{renderWithEmojis(props.children)}</strong>,
                  em: ({ node, ...props }) => <em className="italic">{renderWithEmojis(props.children)}</em>,
                  del: ({ node, ...props }) => <del className="line-through">{renderWithEmojis(props.children)}</del>,
                  code: ({ node, ...props }) => <code className="bg-black/30 rounded px-1 py-0.5">{renderWithEmojis(props.children)}</code>,
                  a: ({ node, ...props }) => <a className="underline text-blue-400 hover:text-blue-300" {...props}>{renderWithEmojis(props.children)}</a>,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>

            <small
              className={cn(
                "mt-1 block text-right text-xs opacity-60",
                isVex ? "text-muted-foreground" : "text-primary-foreground"
              )}
            >
              {hour}
            </small>
            
            {isError && (
              <div className="mt-3 flex justify-center w-full">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetry?.();
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-200 bg-rose-500/20 hover:bg-rose-500/30 rounded-full transition-colors"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  {t("retry", "Tentar novamente")}
                </button>
              </div>
            )}
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="bg-zinc-950 border border-zinc-800 rounded-md shadow-md p-1 min-w-40 z-50">
        <ContextMenuItem
          className="text-red-500 hover:bg-zinc-900 focus:bg-zinc-900 focus:text-red-500 cursor-pointer flex items-center px-2 py-1.5 rounded-sm"
          onSelect={onClose}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("deleteMessage")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default memo(Message);

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
