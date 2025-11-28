"use client";

import { useEffect, useRef, useState } from "react";

import { useLiveQuery } from "dexie-react-hooks";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { db } from "@/lib/vexDB";
import { useVexMessage } from "@/hooks/useVexMessage";
import { formatHour, scrollToBottom, sendMessage } from "@/lib/utils";
import { initializeAdmob, showInterstitial } from "@/lib/admob";
import { scheduleRandomNotification } from "@/lib/notifications";
import { LocalNotifications } from "@capacitor/local-notifications";

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
//import  ChatLoading  from "@/components/chat-loading";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const contentRef = useRef<HTMLDivElement>(null);
  const messages = useLiveQuery(() => db.messages.toArray(), []);
  const vexInfo = useLiveQuery(() => db.vexInfo.toArray(), []);

  const [text, setText] = useState("");
  const { t } = useTranslation();
  const { sendVexMessage, isProcessing, status } = useVexMessage();

  const go = (path: string) => navigate(path, { replace: true });

  const handleSendMessage = () => {
    const msg = text.trim();
    if (!msg) return;

    setText("");
    sendMessage(msg, false);
    sendVexMessage(msg);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) =>
    e.key === "Enter" && !isProcessing && handleSendMessage();
  useEffect(() => {
    const detectLang = () => {
      const stored = localStorage.getItem("language");
      if (stored) return stored;

      const sys = navigator.language || navigator.languages?.[0] || "en-US";
      let normalized = "enUS";

      if (sys.toLowerCase().startsWith("pt")) normalized = "ptBR";
      if (sys.toLowerCase().startsWith("en")) normalized = "enUS";

      localStorage.setItem("language", normalized);
      return normalized;
    };

    const lang = detectLang();

    changeLanguage(lang);
    // loadIntentsForLanguage(lang);

    scheduleRandomNotification();

    if (!localStorage.getItem("notification")) {
      LocalNotifications.checkPermissions().then((res) => {
        if (res.display !== "granted") go("/consent");
      });
    }

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
        console.log("Banco vazio. Carregando intents...");
        await loadIntentsForLanguage(lang);
      }
    };

    seed();
  }, []);

  useEffect(() => {
    if (messages && contentRef.current) scrollToBottom(contentRef.current);
  }, [messages]);
 // const isLoading = !messages || !vexInfo;
  
 
  const info = vexInfo?.[0];

  App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back(); // Navigate back in the web history
    } else {
      App.exitApp(); // Exit the app if no more history to navigate back
    }
  });
  return (
    <div className="flex h-screen max-w-screen flex-col bg-background text-foreground">
      <ChatHeader info={info} status={status} />

      <main
        ref={contentRef}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-background pb-20 pt-20"
      >
        {messages?.map((msg, i) => {
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
        })}

        {isProcessing && <TypingIndicator />}
      </main>

      <footer
        className="
    fixed bottom-0 left-0 w-full 
    backdrop-blur-xl 
    bg-black/20 
   
  "
      >
        <div className="flex w-full items-center gap-2 p-3 max-w-3xl mx-auto">
          <div
            className="flex h-10 flex-1 items-center rounded-full 
      bg-neutral-900/40 px-4 shadow-sm backdrop-blur-xl transition"
          >
            <Input
              value={text}
              onChange={(e: any) => setText(e.target.value)}
              placeholder={t("write_message")}
              className="h-full flex-1 bg-transparent border-none p-0 text-base 
          placeholder:text-neutral-500 shadow-none 
          focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
