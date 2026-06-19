// classes/nlp-util.ts

const stopWords: Record<string, Set<string>> = {
  ptBR: new Set([
    "a", "o", "as", "os", "ao", "aos", "de", "do", "da", "dos", "das", "em", "no", "na", "nos", "nas",
    "um", "uma", "uns", "umas", "e", "ou", "mas", "se", "que", "qual", "quem", "com", "por", "para", "sem",
    "sob", "sobre", "é", "são", "foi", "ser", "ter", "meu", "seu", "sua", "pelo", "pela",
    "tipo", "então", "entao", "aí", "ai", "né", "ne", "olha", "vex", "poxa", "nossa", "nossa", "ah", "eh"
  ]),
  enUS: new Set([
    "a", "an", "the", "and", "or", "but", "if", "because", "as", "what", "which", "who", "whom",
    "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "to", "from", "up", "down", "in", "out", "on", "off",
    "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how",
    "like", "so", "um", "uh", "hey", "hi", "hello", "vex", "oh", "ah", "well"
  ])
};

const slangMap: Record<string, string> = {
  "vc": "voce",
  "vcs": "voces",
  "pq": "porque",
  "q": "que",
  "tb": "tambem",
  "tbm": "tambem",
  "kd": "cade",
  "vlw": "valeu",
  "blz": "beleza",
  "cmg": "comigo",
  "vdd": "verdade",
  "nd": "nada",
  "n": "nao",
  "nao": "nao", // unaccented
};

// Tokenization Cache
const tokenCache = new Map<string, string[]>();

/**
 * Generates bi-grams for better contextual matching.
 * "abrir conta" -> ["abrir", "conta", "abrir_conta"]
 */
function generateNgrams(tokens: string[]): string[] {
  const result = [...tokens];
  for (let i = 0; i < tokens.length - 1; i++) {
    result.push(`${tokens[i]}_${tokens[i + 1]}`);
  }
  return result;
}

/**
 * Conservative Stemmer to reduce words to their root form without losing semantics.
 */
function stemWord(word: string, language: string): string {
  if (word.length < 4) return word;

  if (language === "ptBR") {
    let w = word;
    if (w.endsWith("ando")) return w.slice(0, -4) + "ar";
    if (w.endsWith("endo")) return w.slice(0, -4) + "er";
    if (w.endsWith("indo")) return w.slice(0, -4) + "ir";
    
    if (w.endsWith("ões")) return w.slice(0, -3) + "ao";
    if (w.endsWith("oes")) return w.slice(0, -3) + "ao";
    if (w.endsWith("mente")) return w.slice(0, -5);
    if (w.endsWith("s") && !w.endsWith("is") && !w.endsWith("us")) return w.slice(0, -1);
    return w;
  } else if (language === "enUS") {
    let w = word;
    if (w.endsWith("ing")) return w.slice(0, -3);
    if (w.endsWith("ly")) return w.slice(0, -2);
    if (w.endsWith("es")) return w.slice(0, -2);
    if (w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
    if (w.endsWith("ed")) return w.slice(0, -2);
    return w;
  }
  return word;
}

/**
 * Cleans the text: removes accents, converts to lowercase, applies slang normalization, 
 * removes punctuation, filters stop words, applies stemming, and adds bi-grams.
 * Utilizes a memory cache to skip re-tokenizing identical strings.
 */
export function cleanAndTokenize(text: string, language?: string): string[] {
  let langKey = language;
  if (!langKey) {
    try {
      langKey = localStorage.getItem("language") || "ptBR";
    } catch (e) {
      langKey = "ptBR";
    }
  }
  langKey = stopWords[langKey] ? langKey : "enUS";
  const currentStopWords = stopWords[langKey];

  const cacheKey = `${langKey}:${text}`;
  if (tokenCache.has(cacheKey)) {
    return tokenCache.get(cacheKey)!;
  }

  const withoutAccents = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const lowercased = withoutAccents.toLowerCase();
  
  const rawTokens = lowercased.match(/\b[a-z0-9]+\b/g) || [];
  
  const baseTokens = rawTokens
    .map(token => slangMap[token] || token) // Slang normalization
    .filter((token) => !currentStopWords.has(token) && token.length > 1)
    .map((token) => stemWord(token, langKey));

  const finalTokens = generateNgrams(baseTokens);
  
  // Cache the result to save CPU cycles
  tokenCache.set(cacheKey, finalTokens);
  
  // Prevent memory leaks in cache
  if (tokenCache.size > 2000) {
    const firstKey = tokenCache.keys().next().value;
    if (firstKey) tokenCache.delete(firstKey);
  }

  return finalTokens;
}

/**
 * Calculates the Term Frequency (TF).
 */
function calculateTf(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  const tokenCount = tokens.length;
  if (tokenCount === 0) return tf;

  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }

  for (const [token, count] of tf.entries()) {
    tf.set(token, count / tokenCount);
  }
  return tf;
}

/**
 * Calculates the IDF using a safe formula to avoid negative numbers.
 */
function calculateIdf(documentsTokens: string[][]): Map<string, number> {
  const idf = new Map<string, number>();
  const docCount = documentsTokens.length;
  const docFrequency = new Map<string, number>();

  for (const tokens of documentsTokens) {
    const uniqueTokens = new Set(tokens);
    for (const token of uniqueTokens) {
      docFrequency.set(token, (docFrequency.get(token) || 0) + 1);
    }
  }

  for (const [token, freq] of docFrequency.entries()) {
    // Math.log((1 + docCount) / (1 + freq)) + 1 -> Ensures IDF is strictly positive
    idf.set(token, Math.log((1 + docCount) / (1 + freq)) + 1);
  }
  return idf;
}

export interface IProcessedSynon {
  id: string;
  vector: Map<string, number>;
  magnitude: number;
  originalReplies: string[];
}

export function preprocessSynons(
  synons: { word: string[]; reply: string[]; id: string }[]
): { processed: IProcessedSynon[]; idf: Map<string, number> } {
  // Join all variations to preserve 100% of the training data
  const documents = synons.map((s) => s.word.join(" "));
  const documentsTokens = documents.map((doc) => cleanAndTokenize(doc));

  const idf = calculateIdf(documentsTokens);
  const processed: IProcessedSynon[] = [];

  for (let i = 0; i < synons.length; i++) {
    const synon = synons[i];
    const tokens = documentsTokens[i];
    const tf = calculateTf(tokens);
    const vector = new Map<string, number>();

    let magSq = 0;
    for (const [token, value] of tf.entries()) {
      const weight = value * (idf.get(token) || 0);
      vector.set(token, weight);
      magSq += weight * weight;
    }

    processed.push({
      id: synon.id,
      vector,
      magnitude: Math.sqrt(magSq),
      originalReplies: synon.reply,
    });
  }

  return { processed, idf };
}

/**
 * Optimized Cosine Similarity.
 * Calculates dot product by iterating only the keys of Vector A.
 */
export function cosineSimilarity(
  vecA: Map<string, number>,
  vecB: Map<string, number>,
  magnitudeA: number,
  magnitudeB: number
): number {
  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  let dotProduct = 0;
  for (const [key, valA] of vecA.entries()) {
    const valB = vecB.get(key);
    if (valB) {
      dotProduct += valA * valB;
    }
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * O(min(n,m)) space optimized Levenshtein using a rolling array.
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let source = a;
  let target = b;

  if (source.length > target.length) {
    source = b;
    target = a;
  }

  const sourceLength = source.length;
  const targetLength = target.length;

  let v0 = new Array(sourceLength + 1);
  let v1 = new Array(sourceLength + 1);

  for (let i = 0; i <= sourceLength; i++) {
    v0[i] = i;
  }

  for (let i = 0; i < targetLength; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < sourceLength; j++) {
      const cost = source[j] === target[i] ? 0 : 1;
      v1[j + 1] = Math.min(
        v1[j] + 1,       // Insertion
        v0[j + 1] + 1,   // Deletion
        v0[j] + cost     // Substitution
      );
    }
    // Swap arrays
    const temp = v0;
    v0 = v1;
    v1 = temp;
  }

  return v0[sourceLength];
}
