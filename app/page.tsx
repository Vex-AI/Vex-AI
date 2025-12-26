"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useTranslation } from "react-i18next";

import { db } from "@/lib/vexDB";
import { useVexMessage } from "@/hooks/useVexMessage";
import { formatHour, scrollToBottom, sendMessage } from "@/lib/utils";
import { initializeAdmob, showInterstitial } from "@/lib/admob";
import { scheduleRandomNotification } from "@/lib/notifications";

import Message from "@/components/message";
import TypingIndicator from "@/components/typing-indicator";
import DateSeparator from "@/components/date-separator";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { App } from "@capacitor/app";
import { Loader2, Send } from "lucide-react";
import ChatHeader from "@/components/chat-header";
import { loadIntentsForLanguage } from "@/lib/IntentManager";
import { changeLanguage } from "i18next";
import EmptyState from "@/components/empty-state";

const Home: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const messages = useLiveQuery(() => db.messages.toArray(), []);
  const vexInfo = useLiveQuery(() => db.vexInfo.toArray(), []);

  const { t } = useTranslation();
  const { sendVexMessage, isProcessing, status } = useVexMessage();

  const [text, setText] = useState("");

  const handleSendMessage = useCallback(() => {
    const msg = text.trim();
    if (!msg) return;

    setText("");
    sendMessage(msg, false);
    sendVexMessage(msg);
  }, [text, sendVexMessage]);

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !isProcessing) handleSendMessage();
    },
    [handleSendMessage, isProcessing]
  );

  // --------------------------------------------------
  // LINGUAGEM + INTENTS + NOTIFICAÇÃO + ADMOB
  // --------------------------------------------------

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

  // --------------------------------------------------
  // AUTO-SCROLL
  // --------------------------------------------------

  useEffect(() => {
    if (messages && contentRef.current) scrollToBottom(contentRef.current);
  }, [messages]);

  // --------------------------------------------------
  // MEMO DOS DADOS
  // --------------------------------------------------

  const info = vexInfo?.[0];

  const renderedMessages = useMemo(() => {
    if (!messages) return null;
    if (messages.length === 0) {
      return <EmptyState />;
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
  }, [messages]);

  // --------------------------------------------------
  // BACK BUTTON (Android)
  // --------------------------------------------------

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
    <div className="flex h-screen max-w-screen flex-col bg-background text-foreground">
      <ChatHeader info={info} status={status} />

      <main
        ref={contentRef}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-background pb-20 pt-20"
      >
        {renderedMessages}
        {isProcessing && <TypingIndicator />}
      </main>

      <footer className="fixed bottom-0 left-0 w-full backdrop-blur-xl bg-black/20">
        <div className="flex w-full items-center gap-2 p-3 max-w-3xl mx-auto">
          <div className="flex h-10 flex-1 items-center rounded-full bg-neutral-900/40 px-4 shadow-sm backdrop-blur-xl transition">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("write_message")}
              className="h-full flex-1 bg-transparent border-none p-0 text-base placeholder:text-neutral-500 shadow-none focus-visible:outline-none focus-visible:ring-0"
              onKeyUp={handleKeyUp}
              disabled={isProcessing}
            />

            {isProcessing && (
              <Loader2 className="h-5 w-5 animate-spin text-neutral-500" />
            )}
          </div>

          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={isProcessing || text.trim() === ""}
            className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Home;
