// classes/nlp-util.ts

// Lista de stop words em português. Pode ser expandida.
const stopWords = new Set([
    "a", "o", "as", "os", "ao", "aos", "de", "do", "da", "dos", "das", "em", "no", "na", "nos", "nas",
    "um", "uma", "uns", "umas", "e", "ou", "mas", "se", "que", "qual", "quem", "com", "por", "para",
    "sem", "sob", "sobre", "é", "são", "foi", "ser", "ter", "meu", "seu", "sua", "pelo", "pela"
]);

/**
 * Limpa o texto: remove acentos, converte para minúsculas, remove pontuação e stop words.
 * @param text O texto a ser limpo.
 * @returns Um array de palavras (tokens) limpas e relevantes.
 */
export function cleanAndTokenize(text: string): string[] {
    const withoutAccents = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const lowercased = withoutAccents.toLowerCase();
    const tokens = lowercased.match(/\b\w+\b/g) || [];
    return tokens.filter(token => !stopWords.has(token));
}

/**
 * Calcula a frequência dos termos (TF) em um documento (array de tokens).
 * @param tokens Array de palavras do documento.
 * @returns Um Map onde a chave é o termo e o valor é sua frequência.
 */
function calculateTf(tokens: string[]): Map<string, number> {
    const tf = new Map<string, number>();
    const tokenCount = tokens.length;
    if (tokenCount === 0) return tf;

    for (const token of tokens) {
        tf.set(token, (tf.get(token) || 0) + 1);
    }

    // Normaliza a frequência
    for (const [token, count] of tf.entries()) {
        tf.set(token, count / tokenCount);
    }
    return tf;
}

/**
 * Calcula o IDF para um corpus de documentos.
 * @param documentsTokens Array de documentos, onde cada documento é um array de tokens.
 * @returns Um Map onde a chave é o termo e o valor é seu score IDF.
 */
function calculateIdf(documentsTokens: string[][]): Map<string, number> {
    const idf = new Map<string, number>();
    const docCount = documentsTokens.length;
    const docFrequency = new Map<string, number>();

    // Conta em quantos documentos cada termo aparece
    for (const tokens of documentsTokens) {
        const uniqueTokens = new Set(tokens);
        for (const token of uniqueTokens) {
            docFrequency.set(token, (docFrequency.get(token) || 0) + 1);
        }
    }

    // Calcula o score IDF
    for (const [token, freq] of docFrequency.entries()) {
        idf.set(token, Math.log(docCount / (1 + freq))); // +1 para evitar divisão por zero
    }
    return idf;
}

/**
 * Interface para armazenar os dados pré-processados para a busca local.
 */
export interface IProcessedSynon {
    id: string;
    vector: Map<string, number>; // Vetor TF-IDF
    originalReplies: string[];
}

/**
 * Pré-processa uma lista de sinônimos para calcular seus vetores TF-IDF.
 * @param synons A lista de sinônimos do banco de dados.
 * @returns Um objeto contendo a lista de sinônimos processados e o mapa IDF.
 */
export function preprocessSynons(synons: { word: string[], reply: string[], id: string }[]): { processed: IProcessedSynon[], idf: Map<string, number> } {
    // Usaremos a primeira palavra/frase de cada sinônimo como o "documento"
    const documents = synons.map(s => s.word[0] || "");
    const documentsTokens = documents.map(doc => cleanAndTokenize(doc));
    
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
            originalReplies: synon.reply
        });
    }

    return { processed, idf };
}

/**
 * Calcula a similaridade de cossenos entre dois vetores TF-IDF.
 * @param vecA Vetor A.
 * @param vecB Vetor B.
 * @returns Um score de similaridade entre 0 e 1.
 */
export function cosineSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number {
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