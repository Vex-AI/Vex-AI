// utils.ts
import diacritics from "diacritics";
import { toast } from "react-toastify";
import i18n from "@/lib/translation";
import { IChatHistory, IMessage } from "@/types";
import { db } from "./vexDB";
import { RefObject } from "react";

export const historyCache = new Map<string, IChatHistory[]>();
export const MAX_HISTORY_SIZE = 20;

export async function getResponse() {
  const responsePromise = await import(
    `../response/response_${i18n.language}.json`
  );
  const response = await responsePromise.default;
  const randomIndex = Math.floor(Math.random() * response.length);
  return response[randomIndex];
}

export async function readFile(path: string) {
  const response = await fetch(path);
  return response.text();
}

export function inherits(a: any, b: any) {
  Object.setPrototypeOf(a.prototype, b.prototype);
}

export function clear(message: string) {
  return message
    .replace(/<@.?[0-9]*?>/g, "")
    .replace(/(https?:\/\/[^\s]+)/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(" ")
    .filter((e) => String(e).trim())
    .map((word) => diacritics.remove(word));
}

export function mkToast(message: string) {
  toast(message, {
    position: "bottom-right",
    autoClose: 1700,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
}

export function scrollToBottom(
  ref: RefObject<{ scrollToBottom: (duration?: number) => void }>
) {
  ref.current?.scrollToBottom(500);
}

export function formatHour(time: string) {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
}

export function formatDate(timestamp: number): string {
  const today = new Date();
  const messageDate = new Date(timestamp);

  const formatDateString = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (messageDate.toDateString() === today.toDateString()) return "Hoje";

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) return "Ontem";

  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  if (messageDate.toDateString() === twoDaysAgo.toDateString())
    return "Anteontem";

  return formatDateString(messageDate);
}

export function sendMessage(content: string, isVex: boolean) {
  const newMessage: IMessage = {
    content,
    isVex,
    hour: new Date().toLocaleTimeString(),
    date: Date.now(),
  };
  db.messages.add(newMessage);
}

export function randomReply(replies: string[]): string {
  return replies[Math.floor(Math.random() * replies.length)];
}

export async function getDefaultResponse(): Promise<string> {
  const response = await import(`../response/response_${i18n.language}.json`);
  return randomReply(response.default);
}

export async function getCachedHistory(): Promise<IChatHistory[]> {
  const cacheKey = "chat_history";

  if (!historyCache.has(cacheKey)) {
    const history = await db.messages
      .orderBy("date")
      .reverse()
      .limit(MAX_HISTORY_SIZE)
      .toArray();

    const formatted = history.map((msg) => ({
      role: msg.isVex ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    historyCache.set(cacheKey, formatted);
  }

  return historyCache.get(cacheKey)!;
}

export function getCodePoint(emoji: string) {
  return Array.from(emoji)
    .map((c) => c.codePointAt(0)!.toString(16))
    .join("-");
}

export const getRandomAnimation = <T extends Record<string, any>>(
  animationVariants: T
): keyof T => {
  const animations = Object.keys(animationVariants) as (keyof T)[];
  return animations[Math.floor(Math.random() * animations.length)];
};
