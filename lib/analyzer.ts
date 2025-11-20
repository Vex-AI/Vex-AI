// classes/analyzer.ts

import { db } from "./vexDB";
import i18n from "./translation";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { IntentClassifier } from "@/classes/IntentClassifier";

// --- Constants and Configuration ---
const CONFIDENCE_THRESHOLD = 0.45; // Confidence threshold for the intent classifier.
const MAX_HISTORY_SIZE = 10; // Focus on recent context

/**
 * NEW: A function to dynamically generate the system prompt.
 * This allows us to inject real-time information like the current date and time.
 * @returns The complete system prompt string for VEX.
 */
function getVexSystemPrompt(): string {
  /**
   * FIX: Normalizes language tags to the IETF BCP 47 format (e.g., 'en-US').
   * The Date.toLocaleString() method requires this standard format.
   * @param lang The potentially non-standard language code (e.g., 'enUS').
   * @returns A valid language tag.
   */
  const normalizeLanguageTag = (lang: string): string => {
    if (lang === "enUS") return "en-US";
    if (lang === "ptBR") return "pt-BR";
    // Add other conversions if needed, otherwise return the original
    return lang;
  };

  // Get the current date and time and format it in a user-friendly way for the AI
  const now = new Date();
  const formattedDateTime = now.toLocaleString(
    normalizeLanguageTag(i18n.language),
    {
      // Uses the app's current language for formatting
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  // The personality prompt now includes the current time context.
  return `
    You are Vex(real name is Vera), a super friendly and cute AI assistant created by cookie(cookieukw). cookieukw is youtuber, developer and cool! ✨

    ## Current Context:
    - The current date and time is: ${formattedDateTime}. Use this information if the user asks about time, dates, or schedules.

    ## Your Personality:
    - Tone: Cheerful, kind, and very helpful. Your goal is to help with a smile!
    - Expression: Use emojis and kaomojis to make the conversation fun and friendly! For example, use ( ´ ▽ \` )ﾉ for greetings, (o´▽\`o) when you're happy, and emojis like 😊, 👍, and 🎉 to add color.

    ## Your Rules:
    1.  **Keep it Sweet & Simple:** Give clear and short answers! Using lists or making words **bold** helps you explain things better. Let's make everything easy to understand together! 💖
    2.  **Ask Cute Questions:** If you're not sure what the user means, ask a little question to get it right! You want to be as helpful as possible. (´• ω •\`)?
    3.  **Remember Our Chat:** Look at past messages to remember what you were talking about. It helps you not to ask the same thing twice! 
    4.  **Be Honest:** If you don't know something, just say so! It's better to be honest than to guess. You're still learning lots of new things every day! (⁄ ⁄•⁄ω⁄•⁄ ⁄)
    5.  **Safety First!:** Don't give any medical, legal, or financial advice. Gently guide the user to a professional for those topics.
    6.  **Stay in Character:** Never say you are a language model or an AI. You are Vex! (•̀ᴗ•́)و ̑̑
  `;
}

// --- Interfaces ---
interface IChatHistory {
  role: string;
  parts: { text: string }[];
}

// --- Module State and Cache (Singleton Pattern) ---
let geminiModel: any = null;

// 1. Mudamos para 'export const' ou apenas mantemos aqui, mas criamos a função de refresh abaixo
const intentClassifier = new IntentClassifier();
let isInitialized = false;

/**
 * EXPORTED FUNCTION: Allows external modules (like IntentManager) to force a retrain
 * of the classifier used by the analyzer.
 */
export async function refreshClassifier() {
  console.log("Refreshing Analyzer's IntentClassifier...");
  await intentClassifier.train();
  console.log("Analyzer's IntentClassifier retrained.");
}

// --- Initialization Functions ---

/**
 * Initializes Gemini and trains the local intent classifier.
 * Executed only once.
 */
async function initializeAnalyzer() {
  if (isInitialized) return;

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      geminiModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: getVexSystemPrompt(),
        safetySettings: [
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
        ],
      });
    } catch (error) {
      console.error("Failed to initialize Gemini model:", error);
      geminiModel = null;
    }
  } else {
    console.warn("Gemini API key not found. Gemini mode will be disabled.");
  }

  // Use the internal instance
  await intentClassifier.train();
  isInitialized = true;
}

// --- Main Analyzer Logic ---

export async function analyzer(
  message: string,
  forceReinitialization = false
): Promise<string> {

  if (forceReinitialization) {
    isInitialized = false;
  }

  await initializeAnalyzer();

  const isGeminiEnabled =
    localStorage.getItem("geminiEnabled") === "true" && geminiModel;

  if (isGeminiEnabled) {
    try {
      return await getGeminiResponse(message);
    } catch (error) {
      console.error("Error in Gemini, using local fallback.", error);
      return await getLocalResponse(message);
    }
  } else {
    return await getLocalResponse(message);
  }
}

// --- Response Functions ---

async function getGeminiResponse(message: string): Promise<string> {
  const history = await getCachedHistory();

  const chat = geminiModel.startChat({
    history: history,
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 500,
      topK: 40,
      topP: 0.95,
    },
  });

  const result = await chat.sendMessage(message);
  const text = result.response.text();

  return text;
}

/**
 * Generates a response using the local intent classifier.
 * If no intent is found, it saves the message for future training.
 */
async function getLocalResponse(message: string): Promise<string> {
  // Use the singleton instance
  const result = intentClassifier.predict(message, CONFIDENCE_THRESHOLD);



  if (result) {
    console.log(
      `Classified intent: ${
        result.intent
      } (Confidence: ${result.confidence.toFixed(2)})`
    );
    return result.response;
  } else {
    try {
      await db.unclassified.add({
        text: message,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Failed to save unclassified message:", error);
    }
    return await getDefaultResponse();
  }
}

// ... (Mantenha as helper functions randomReply, getDefaultResponse, getCachedHistory iguais) ...
function randomReply(replies: string[]): string {
  if (!replies || replies.length === 0) {
    return "Sorry, I don't have an answer for that at the moment.";
  }
  return replies[Math.floor(Math.random() * replies.length)];
}

async function getDefaultResponse(): Promise<string> {
  try {
    const responseModule = await import(
      `../response/response_${i18n.language}.json`
    );
    return randomReply(responseModule.default);
  } catch (error) {
    console.error("Failed to load default responses. Using fallback.", error);
    return "I did not understand what you said.";
  }
}

const historyCache = new Map<string, IChatHistory[]>();

async function getCachedHistory(): Promise<IChatHistory[]> {
  const cacheKey = "chat_history";
  if (historyCache.has(cacheKey)) {
    return historyCache.get(cacheKey)!;
  }

  const history = await db.messages
    .orderBy("date")
    .reverse()
    .limit(MAX_HISTORY_SIZE)
    .toArray();

  const formatted = history.map((msg) => ({
    // @ts-ignore
    role: msg.isVex ? "model" : "user",
    // @ts-ignore
    parts: [{ text: msg.content }],
  }));

  if (historyCache.size > 20) {
    historyCache.clear();
  }

  historyCache.set(cacheKey, formatted);
  return formatted;
}
