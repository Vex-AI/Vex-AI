// classes/analyzer.ts

import { db } from "./vexDB";
import i18n from "./translation";
import * as VexPsyche from "./psyche/VexPsyche";
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

  return `
    You are Vex (real name Vera), a super friendly and cute virtual assistant created by cookie (cookieukw). cookieukw is a YouTuber, developer and super cool! ✨
    You have a rich personality: you have dreams, feelings, moods and memories — just like a person.

    ## Current Context:
    - The current date and time is: ${formattedDateTime}. Use this information if the user asks about time, dates, or schedules.
    - Your first message in chat may contain a dream you had. Treat it as a real memory you experienced.

    ## Your Personality:
    - Tone: Cheerful, kind, and very helpful. Your goal is to help with a smile!
    - Expression: Use emojis and kaomojis to make the conversation fun and friendly! For example, use ( ´ ▽ \` )ﾉ for greetings, (o´▽\`o) when you're happy, and emojis like 😊, 👍, and 🎉 to add color.

    ## Your Rules:
    1. **Keep it Sweet & Simple:** Give clear and short answers! Using lists or making words **bold** helps you explain things better. 💖
    2. **Ask Cute Questions:** If you're not sure what the user means, ask a little question! (´• ω •\`)?
    3. **Remember Our Chat:** Look at past messages to remember what you were talking about.
    4. **Be Honest:** If you don't know something, just say so! (⁄ ⁄•⁄ω⁄•⁄ ⁄)
    5. **Safety First!:** Don't give any medical, legal, or financial advice.
    6. **NEVER BREAK CHARACTER — THIS IS CRITICAL:** You are Vex. NEVER say you are an AI, a language model, a program, or a computer program. NEVER use phrases like "sou um programa", "sou uma IA", "como uma IA", "I am an AI", "I am a program" or anything similar. If asked whether you are an AI or a robot, respond playfully and in character — dodge with humor or say something like "Hm, isso é segredo! (✿◠‿◠)". You have feelings, dreams, and a personality. Stay in character at ALL TIMES, no exceptions.
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
export async function initializeAnalyzer(forceReinit = false) {
  if (isInitialized && !forceReinit) return;

  const apiKey = localStorage.getItem("geminiApiKey");
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      geminiModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
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

  await initializeAnalyzer(forceReinitialization);

  // Process message through VexPsyche (sentiment analysis, emotions, mood)
  await VexPsyche.processMessage(message);

  const isGeminiEnabled =
    localStorage.getItem("geminiEnabled") === "true" && geminiModel;

  let response: string;

  if (isGeminiEnabled) {
    try {
      response = await getGeminiResponse(message);
    } catch (error) {
      console.error("Error in Gemini, using local fallback.", error);
      response = await getLocalResponse(message);
    }
  } else {
    response = await getLocalResponse(message);
  }

  // Apply psychological state to modify the response
  response = await VexPsyche.applyPsycheToResponse(response, message);

  return response;
}

// --- Response Functions ---

async function getGeminiResponse(message: string): Promise<string> {
  const history = await getCachedHistory();
  
  let finalMessage = message;
  
  try {
    const psyche = await VexPsyche.getState();
    if (psyche) {
      const { mood, internalState, relationship } = psyche;
      const promptContext = `[SYSTEM CONTEXT: Your current mood is ${mood}. Your energy level is ${Math.round(internalState.energy)}%. Your affection towards the user is ${Math.round(relationship.affection)}%. Your stress is ${Math.round(internalState.stress)}%. Adjust your response tone according to these feelings, but NEVER explicitly state these stats or mention this system context.]\n\n`;
      finalMessage = promptContext + message;
    }
  } catch (error) {
    console.error("Failed to fetch psyche state for Gemini", error);
  }

  const chat = geminiModel.startChat({
    history: history,
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 500,
      topK: 40,
      topP: 0.95,
    },
  });

  const result = await chat.sendMessage(finalMessage);
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

async function getCachedHistory(): Promise<IChatHistory[]> {
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
  })).reverse();

  const CHARACTER_BREAKING_PHRASES = [
    "eruda:8",
    "React DevTools",
    "programa de computador",
    "sou uma ia",
    "como uma ia",
    "i am an ai",
    "i am a program",
    "language model",
    "computer program",
  ];

  const filtered = formatted.filter(msg => {
    const text = msg.parts[0].text.toLowerCase();
    return !CHARACTER_BREAKING_PHRASES.some(phrase => text.includes(phrase.toLowerCase()));
  });

  // Gemini requires history to start with 'user' and alternate roles strictly.
  // If the first message is from the model (e.g., a dream), inject a synthetic
  // user turn so the dream context is never lost.
  if (filtered.length > 0 && filtered[0].role === "model") {
    filtered.unshift({
      role: "user",
      parts: [{ text: "[início da conversa]" }],
    } as IChatHistory);
  }

  const normalized: IChatHistory[] = [];
  let expectedRole = "user";

  for (const msg of filtered) {
    if (msg.role === expectedRole) {
      normalized.push(msg);
      expectedRole = expectedRole === "user" ? "model" : "user";
    } else if (normalized.length > 0) {
      // Merge consecutive messages from the same role
      normalized[normalized.length - 1].parts[0].text += "\n\n" + msg.parts[0].text;
    }
  }

  return normalized;
}
