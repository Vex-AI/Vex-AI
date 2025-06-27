// classes/analyzer.ts - VERSÃO COMPLETA E UNIFICADA

import { db } from "./vexDB";
import i18n from "./translation";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { IntentClassifier } from "@/classes/IntentClassifier";

// --- Constantes e Configurações ---
const CONFIDENCE_THRESHOLD = 0.45; // Limiar de confiança para o classificador de intenções. Ajuste conforme necessário.
const MAX_HISTORY_SIZE = 10; // Foco em contexto recente

// --- Interfaces ---
interface IChatHistory {
  role: string;
  parts: { text: string }[];
}

// --- Estado e Cache do Módulo (Singleton Pattern) ---
let geminiModel: any = null;
let intentClassifier = new IntentClassifier(); // <<< INSTANCIAMOS NOSSO CÉREBRO OFFLINE
let isInitialized = false;

// --- Funções de Inicialização ---

/**
 * Inicializa o Gemini e treina o classificador de intenções local.
 * Executado apenas uma vez.
 */
async function initializeAnalyzer() {
  
  if (isInitialized) return;

  // 1. Inicializar Gemini (com chave de ambiente!)
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      geminiModel = genAI.getGenerativeModel({
       // model: "tunedModels/vexfinetuned-qdghi3ai6rx0", // ou um modelo padrão como "gemini-1.5-flash"
     
     "model": "gemini-1.5-flash", // Modelo padrão para testes
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
        console.error("Falha ao inicializar o modelo Gemini:", error);
        geminiModel = null;
    }
  } else {
    console.warn(
      "Chave da API do Gemini não encontrada. O modo Gemini será desativado."
    );
  }

  // 2. TREINAR nosso cérebro offline com as INTENÇÕES do DB
  await intentClassifier.train();

  isInitialized = true;
}

// --- Lógica Principal do Analisador ---

/**
 * Ponto de entrada principal para analisar uma mensagem do usuário.
 * @param message A mensagem do usuário.
 * @returns Uma string contendo a resposta do bot.
 */
export async function analyzer(message: string,forceReinitialization = false): Promise<string> {
  
  // Se forçado, reseta o estado de inicialização
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
      console.error("Erro no Gemini, usando fallback local.", error);
      return await getLocalResponse(message);
    }
  } else {
    return await getLocalResponse(message);
  }
}

// --- Funções de Resposta ---

/**
 * Gera uma resposta usando o Gemini.
 */
async function getGeminiResponse(message: string): Promise<string> {
  const history = await getCachedHistory();
  const systemPrompt = `Você é VEX, um assistente prestativo. Seja conciso e direto. Seu tom é amigável, mas profissional.`;

  const chat = geminiModel.startChat({
    history: [{ role: "user", parts: [{ text: systemPrompt }] }, ...history],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 500,
    },
  });

  const result = await chat.sendMessage(message);
  const text = result.response.text();

  return text;
}

/**
 * Gera uma resposta usando o classificador de intenções local.
 * Se nenhuma intenção for encontrada, salva a mensagem para treinamento futuro.
 */
async function getLocalResponse(message: string): Promise<string> {
  // Prediz a intenção da mensagem do usuário
  const result = intentClassifier.predict(message, CONFIDENCE_THRESHOLD);

  if (result) {
    // SUCESSO! Encontramos uma intenção com confiança suficiente.
    console.log(
      `Intenção classificada: ${result.intent} (Confiança: ${result.confidence.toFixed(
        2
      )})`
    );
    return result.response;
  } else {
    // FALHA! Não sabemos a resposta. HORA DE APRENDER.
    console.log(
      "Não foi possível classificar a intenção. Salvando para treinamento futuro."
    );

    // Salva a mensagem na tabela 'unclassified' para curadoria manual pelo administrador
    try {
      await db.unclassified.add({
        text: message,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Falha ao salvar mensagem não classificada:", error);
    }

    // Retorna uma resposta padrão de "não sei"
    return await getDefaultResponse();
  }
}

// --- Funções Auxiliares ---

/**
 * Seleciona aleatoriamente uma resposta de uma lista.
 * @param replies Array de respostas possíveis.
 * @returns Uma resposta aleatória.
 */
function randomReply(replies: string[]): string {
  if (!replies || replies.length === 0) {
    return "Desculpe, não tenho uma resposta para isso no momento.";
  }
  return replies[Math.floor(Math.random() * replies.length)];
}

/**
 * Carrega as respostas padrão do arquivo JSON de acordo com o idioma.
 * @returns Uma resposta padrão aleatória.
 */
async function getDefaultResponse(): Promise<string> {
  try {
    const responseModule = await import(`../response/response_${i18n.language}.json`);
    return randomReply(responseModule.default);
  } catch (error) {
    console.error("Falha ao carregar respostas padrão. Usando fallback.", error);
    return "Não compreendi o que você disse.";
  }
}

const historyCache = new Map<string, IChatHistory[]>();
/**
 * Busca o histórico de mensagens do banco de dados e o formata para a API do Gemini.
 * Utiliza um cache em memória para evitar acessos repetidos ao DB.
 */
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

  // Limpa o cache se ele crescer demais, para gerenciar memória
  if (historyCache.size > 20) {
      historyCache.clear();
  }

  historyCache.set(cacheKey, formatted);
  return formatted;
}