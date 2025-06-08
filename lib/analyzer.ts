// classes/analyzer.ts
import { db } from "./vexDB";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import {
  clear,
  getCachedHistory,
  getDefaultResponse,
  randomReply,
} from "./utils";
import { ISynon } from "@/types";

let synonsCache: ISynon[] | null = null;
let geminiModel: any = null;

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];
//const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

async function initializeAnalyzer() {
  if (!synonsCache) {
    synonsCache = await db.synons.toArray();
  }
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBb3qyARPhHqgS5FHSWuvIwfuNS1YNzaTw"
  );
  if (!geminiModel) {
    geminiModel = genAI.getGenerativeModel({
      model: "tunedModels/vexfinetuned-qdghi3ai6rx0",
      safetySettings,
    });
  }
}

async function refreshSynonsCache() {
  synonsCache = await db.synons.toArray();
}

export async function analyzer(message: string): Promise<string> {
  await initializeAnalyzer();

  const isGeminiEnabled = localStorage.getItem("geminiEnabled") === "true";
  const cleaned = clear(message);

  if (isGeminiEnabled && geminiModel) {
    try {
      const chat = geminiModel.startChat({
        history: await getCachedHistory(),
        generationConfig: {
          temperature: 1,
          maxOutputTokens: 500,
        },
      });

      const result = await chat.sendMessage(message);
      const text = (await result.response).text();

      const newSynon: ISynon = {
        id: Date.now().toString(),
        word: [cleaned.join(" ")],
        reply: [text],
      };

      db.synons.add(newSynon).then(refreshSynonsCache);

      return text;
    } catch (error) {
      console.error("Erro no Gemini:", error);
    }
  }

  const search = synonsCache!.map((item) => ({
    ...item,
    word: item.word.map((word) => clear(word).join(" ")),
  }));

  for (const word of cleaned) {
    const matched = search.find((item) => item.word.includes(word));
    if (matched) {
      return randomReply(matched.reply);
    }
  }

  const fullMessage = cleaned.join(" ");
  const matchedMessage = search.find((item) => item.word.includes(fullMessage));

  if (matchedMessage) {
    return randomReply(matchedMessage.reply);
  }

  return getDefaultResponse();
}
