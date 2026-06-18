"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useTranslation } from "react-i18next";

import { db } from "@/lib/vexDB";
import { useVexMessage } from "@/hooks/useVexMessage";
import { formatHour, sendMessage } from "@/lib/utils";
import { initializeAdmob, showInterstitial } from "@/lib/admob";
import { scheduleRandomNotification } from "@/lib/notifications";
import { generateDream } from "@/lib/psyche/DreamEngine";
import { initialize as initPsyche } from "@/lib/psyche/VexPsyche";
import { useAchievementStore } from "@/store/achievementStore";

import Message from "@/components/message";
import TypingIndicator from "@/components/typing-indicator";
import DateSeparator from "@/components/date-separator";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { App } from "@capacitor/app";
import { Loader2, ArrowUp } from "lucide-react";
import ChatHeader from "@/components/chat-header";
import { loadIntentsForLanguage } from "@/lib/IntentManager";
import { changeLanguage } from "i18next";
import EmptyState from "@/components/empty-state";
import { GeminiPillToggle } from "@/components/gemini-pill-toggle";

const Home: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messages = useLiveQuery(() => db.messages.toArray(), []);
  const vexInfo = useLiveQuery(() => db.vexInfo.toArray(), []);

  const { t } = useTranslation();
  const { sendVexMessage, isProcessing, status } = useVexMessage();

  const [text, setText] = useState("");

  const handleSendMessage = useCallback(() => {
    const msg = text.trim();
    if (!msg || isProcessing) return;

    setText("");
    sendMessage(msg, false);
    sendVexMessage(msg);
    setTimeout(() => inputRef.current?.focus(), 30);
  }, [text, sendVexMessage, isProcessing]);

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !isProcessing) handleSendMessage();
    },
    [handleSendMessage, isProcessing]
  );

  useEffect(() => {
    const detectLang = () => {
      const stored = localStorage.getItem("language");
      if (stored) return stored;

      const sys = navigator.language || "en-US";
      const lang = sys.startsWith("pt") ? "ptBR" : "enUS";

      localStorage.setItem("language", lang);
      return lang;
    };

    const lang = detectLang();
    changeLanguage(lang);

    scheduleRandomNotification();
    initializeAdmob();
    showInterstitial();

    const seed = async () => {
      if ((await db.vexInfo.count()) === 0) {
        await db.vexInfo.add({
          id: 1,
          name: "Vex",
          profileImage: "/Vex_320.png",
        });
      }

      if ((await db.intents.count()) === 0) {
        await loadIntentsForLanguage(lang);
      }
    };

    seed();
  }, []);

  useEffect(() => {
    const tryDream = async () => {
      const lastDream = localStorage.getItem("vex_last_dream");
      const now = Date.now();
      if (lastDream && now - Number(lastDream) < 1000 * 60 * 60) return;

      const state = await initPsyche();
      const dreamText = await generateDream(state);

      if (dreamText) {
        sendMessage(dreamText, true);
        localStorage.setItem("vex_last_dream", now.toString());
        try { useAchievementStore.getState().unlockBadge("first_dream"); } catch {}
      }
    };

    tryDream();
  }, []);

  const isAtBottomRef = useRef(true);
  const isRestoringScrollRef = useRef(false);
  const prevMessageCountRef = useRef(0);

  // Scroll to bottom reliably after content actually renders/grows
  const scrollToBottomSafe = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = contentRef.current;
    if (!el) return;
    // Double rAF ensures the browser has painted the new content before scrolling
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior });
      });
    });
  }, []);

  // Restore scroll position on first load
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const savedScroll = sessionStorage.getItem("chatScrollTop");
    const wasAtBottom = sessionStorage.getItem("chatWasAtBottom") !== "false";

    if (wasAtBottom || savedScroll === null) {
      scrollToBottomSafe("auto");
    } else {
      isRestoringScrollRef.current = true;
      el.scrollTop = Number(savedScroll);
      setTimeout(() => { isRestoringScrollRef.current = false; }, 100);
    }
  // Run only once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll when new messages arrive
  useEffect(() => {
    if (!messages) return;
    const newCount = messages.length;
    const prevCount = prevMessageCountRef.current;

    if (newCount > prevCount) {
      const lastMsg = messages[newCount - 1];
      const isFromUser = !lastMsg.isVex;

      // Always scroll for user messages; for Vex replies only if user was near bottom
      if (isFromUser || isAtBottomRef.current) {
        scrollToBottomSafe(isFromUser ? "auto" : "smooth");
      }
    }

    prevMessageCountRef.current = newCount;
  }, [messages, scrollToBottomSafe]);

  const handleScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el || isRestoringScrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const distFromBottom = scrollHeight - scrollTop - clientHeight;
    isAtBottomRef.current = distFromBottom < 80;
    sessionStorage.setItem("chatScrollTop", scrollTop.toString());
    sessionStorage.setItem("chatWasAtBottom", String(isAtBottomRef.current));
  }, []);

  const info = vexInfo?.[0];

  const handleSuggestion = useCallback((text: string) => {
    if (isProcessing) return;
    sendMessage(text, false);
    sendVexMessage(text);
  }, [sendVexMessage, isProcessing]);

  const renderedMessages = useMemo(() => {
    if (!messages || messages.length === 0) {
      return <EmptyState onSuggestion={handleSuggestion} />;
    }

    return messages.map((msg, i) => {
      const prev = messages[i - 1];
      const showDate =
        prev &&
        new Date(msg.date).toDateString() !==
          new Date(prev.date).toDateString();

      return (
        <div key={msg.id ?? `${msg.date}-${i}`}>
          {showDate && <DateSeparator date={msg.date} />}

          <Message
            content={msg.content}
            isVex={msg.isVex}
            hour={formatHour(msg.hour)}
            date={msg.date}
            onClose={() => msg.id && db.messages.delete(msg.id)}
          />
        </div>
      );
    });
  }, [messages, handleSuggestion]);

  useEffect(() => {
    let handle: any | null = null;

    App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    }).then((h) => {
      handle = h;
    });

    return () => {
      handle?.remove();
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-background text-foreground relative">
      <ChatHeader info={info} status={status} />

      <main
        ref={contentRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 pt-20"
      >
        <div className="max-w-3xl mx-auto w-full space-y-4 pb-6">
          {renderedMessages}
          {isProcessing && <TypingIndicator />}
        </div>
      </main>

      <footer className="w-full bg-background  pb-6 px-4 md:pb-8 shrink-0">
        <div className="flex flex-col w-full max-w-3xl mx-auto rounded-3xl bg-[#1a1a1a] border border-white/10 p-2 md:p-3 shadow-2xl">
          
          <Input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("write_message")}
            className="w-full bg-transparent border-none px-3 py-2 h-12 text-[15px] text-zinc-100 placeholder:text-zinc-500 shadow-none focus-visible:outline-none focus-visible:ring-0"
            onKeyUp={handleKeyUp}
          />
          
          <div className="flex items-center justify-between mt-1 px-1">
             <div className="flex items-center gap-2">
                <GeminiPillToggle />
             </div>

             <div className="flex items-center gap-1 sm:gap-2">
                {isProcessing && (
                  <Loader2 className="h-5 w-5 animate-spin text-neutral-500 mr-2" />
                )}
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={isProcessing || text.trim() === ""}
                  className="h-8 w-8 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50 transition-colors"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
