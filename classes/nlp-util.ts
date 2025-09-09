// classes/nlp-util.ts

// List of Portuguese stop words. Can be expanded.
const stopWords = new Set([
  "a",
  "o",
  "as",
  "os",
  "ao",
  "aos",
  "de",
  "do",
  "da",
  "dos",
  "das",
  "em",
  "no",
  "na",
  "nos",
  "nas",
  "um",
  "uma",
  "uns",
  "umas",
  "e",
  "ou",
  "mas",
  "se",
  "que",
  "qual",
  "quem",
  "com",
  "por",
  "para",
  "sem",
  "sob",
  "sobre",
  "é",
  "são",
  "foi",
  "ser",
  "ter",
  "meu",
  "seu",
  "sua",
  "pelo",
  "pela",
]);

/**
 * Cleans the text: removes accents, converts to lowercase, removes punctuation and stop words.
 * @param text The text to be cleaned.
 * @returns An array of clean and relevant words (tokens).
 */
export function cleanAndTokenize(text: string): string[] {
  const withoutAccents = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const lowercased = withoutAccents.toLowerCase();
  const tokens = lowercased.match(/\b\w+\b/g) || [];
  return tokens.filter((token) => !stopWords.has(token));
}

/**
 * Calculates the Term Frequency (TF) in a document (array of tokens).
 * @param tokens Array of words from the document.
 * @returns A Map where the key is the term and the value is its frequency.
 */
function calculateTf(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  const tokenCount = tokens.length;
  if (tokenCount === 0) return tf;

  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }

  // Normalizes the frequency
  for (const [token, count] of tf.entries()) {
    tf.set(token, count / tokenCount);
  }
  return tf;
}

/**
 * Calculates the IDF for a document corpus.
 * @param documentsTokens Array of documents, where each document is an array of tokens.
 * @returns A Map where the key is the term and the value is its IDF score.
 */
function calculateIdf(documentsTokens: string[][]): Map<string, number> {
  const idf = new Map<string, number>();
  const docCount = documentsTokens.length;
  const docFrequency = new Map<string, number>();

  // Counts how many documents each term appears in
  for (const tokens of documentsTokens) {
    const uniqueTokens = new Set(tokens);
    for (const token of uniqueTokens) {
      docFrequency.set(token, (docFrequency.get(token) || 0) + 1);
    }
  }

  // Calculates the IDF score
  for (const [token, freq] of docFrequency.entries()) {
    idf.set(token, Math.log(docCount / (1 + freq))); // +1 to avoid division by zero
  }
  return idf;
}

/**
 * Interface to store pre-processed data for local search.
 */
export interface IProcessedSynon {
  id: string;
  vector: Map<string, number>; // TF-IDF vector
  originalReplies: string[];
}

/**
 * Pre-processes a list of synonyms to calculate their TF-IDF vectors.
 * @param synons The list of synonyms from the database.
 * @returns An object containing the list of processed synonyms and the IDF map.
 */
export function preprocessSynons(
  synons: { word: string[]; reply: string[]; id: string }[]
): { processed: IProcessedSynon[]; idf: Map<string, number> } {
  // We will use the first word/phrase of each synonym as the "document"
  const documents = synons.map((s) => s.word[0] || "");
  const documentsTokens = documents.map((doc) => cleanAndTokenize(doc));

  const idf = calculateIdf(documentsTokens);
  const processed: IProcessedSynon[] = [];

  for (let i = 0; i < synons.length; i++) {
    const synon = synons[i];
    const tokens = documentsTokens[i];
    const tf = calculateTf(tokens);
    const vector = new Map<string, number>();

    for (const [token, value] of tf.entries()) {
      vector.set(token, value * (idf.get(token) || 0));
    }

    processed.push({
      id: synon.id,
      vector,
      originalReplies: synon.reply,
    });
  }

  return { processed, idf };
}

/**
 * Calculates the cosine similarity between two TF-IDF vectors.
 * @param vecA Vector A.
 * @param vecB Vector B.
 * @returns A similarity score between 0 and 1.
 */
export function cosineSimilarity(
  vecA: Map<string, number>,
  vecB: Map<string, number>
): number {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  const allKeys = new Set([...vecA.keys(), ...vecB.keys()]);

  for (const key of allKeys) {
    const valA = vecA.get(key) || 0;
    const valB = vecB.get(key) || 0;
    dotProduct += valA * valB;
    magnitudeA += valA * valA;
    magnitudeB += valB * valB;
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

export function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = new Array(bn + 1);
  for (let i = 0; i <= bn; ++i) {
    matrix[i] = new Array(an + 1);
  }
  for (let i = 0; i <= an; ++i) {
    matrix[0][i] = i;
  }
  for (let j = 0; j <= bn; ++j) {
    matrix[j][0] = j;
  }
  for (let j = 1; j <= bn; ++j) {
    for (let i = 1; i <= an; ++i) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  return matrix[bn][an];
}
