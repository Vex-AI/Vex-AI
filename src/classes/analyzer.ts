// classes/analyzer.ts
import { db } from "./vexDB";
import util from "./utils";
import i18n from "./translation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { Capacitor } from "@capacitor/core";

// Cache para dados estáticos
let synonsCache: ISynon[] | null = null;
let geminiModel: any = null;

interface ISynon {
    word: string[];
    reply: string[];
    id: string;
}

interface IChatHistory {
    role: string;
    parts: { text: string }[];
}
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE
    }
];
//const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);


// Carregar dados iniciais uma única vez
async function initializeAnalyzer() {
    if (!synonsCache) {
        synonsCache = await db.synons.toArray();
    }
const genAI = new GoogleGenerativeAI("AIzaSyBb3qyARPhHqgS5FHSWuvIwfuNS1YNzaTw");
    if (!geminiModel) {
        geminiModel = genAI.getGenerativeModel({
            model: "tunedModels/vexfinetuned-qdghi3ai6rx0",
            safetySettings
        });
    }
}

// Atualizar cache quando novos dados forem adicionados
async function refreshSynonsCache() {
    synonsCache = await db.synons.toArray();
}

export async function analyzer(message: string): Promise<string> {
    await initializeAnalyzer(); // Garante a inicialização

    const isGeminiEnabled = localStorage.getItem("geminiEnabled") === "true";
    const cleaned = util.clear(message); // Processar uma única vez

    if (isGeminiEnabled && geminiModel) {
        try {
            const chat = geminiModel.startChat({
                history: await getCachedHistory(),
                generationConfig: {
                    temperature: 1,
                    maxOutputTokens: 500
                }
            });

            const result = await chat.sendMessage(message);
            const text = (await result.response).text();

            // Atualizar cache assincronamente
            const newSynon: ISynon = {
                id: Date.now().toString(),
                word: [cleaned.join(" ")],
                reply: [text]
            };

            db.synons.add(newSynon).then(refreshSynonsCache);

            return text;
        } catch (error) {
            console.error("Erro no Gemini:", error);
        }
    }

    // Usar cache para consultas locais
    const search = synonsCache!.map(item => ({
        ...item,
        word: item.word.map(word => util.clear(word).join(" "))
    }));

    // Restante da lógica original com cache...
    for (const word of cleaned) {
        const matched = search.find(item => item.word.includes(word));
        if (matched) {
            return randomReply(matched.reply);
        }
    }

    const fullMessage = cleaned.join(" ");
    const matchedMessage = search.find(item => item.word.includes(fullMessage));

    if (matchedMessage) {
        return randomReply(matchedMessage.reply);
    }

    return getDefaultResponse();
}

// Funções auxiliares
function randomReply(replies: string[]): string {
    return replies[Math.floor(Math.random() * replies.length)];
}

async function getDefaultResponse(): Promise<string> {
    const response = await import(`../response/response_${i18n.language}.json`);
    return randomReply(response.default);
}

// Cache de histórico (LRU cache)
const historyCache = new Map<string, IChatHistory[]>();
const MAX_HISTORY_SIZE = 20;

async function getCachedHistory(): Promise<IChatHistory[]> {
    const cacheKey = "chat_history";

    if (!historyCache.has(cacheKey)) {
        const history = await db.messages
            .orderBy("date")
            .reverse()
            .limit(MAX_HISTORY_SIZE)
            .toArray();

        const formatted = history.map(msg => ({
            role: msg.isVex ? "model" : "user",
            parts: [{ text: msg.content }]
        }));

        historyCache.set(cacheKey, formatted);
    }

    return historyCache.get(cacheKey)!;
}
