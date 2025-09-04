// lib/IntentClassifier.ts

// Importa a instância do banco de dados (provavelmente IndexedDB via Dexie.js) e utilitários de PLN.
import { db } from "@/lib/vexDB";
import * as nlp from "./nlp-util"; // Contém funções como tokenização, stemming, levenshtein, etc.
import { IIntent } from "@/types"; // Define a estrutura de dados de uma intenção.

/**
 * @interface IProcessedIntent
 * @description Define a estrutura de uma intenção após ser processada pelo método `train`.
 * Contém o vetor TF-IDF e as respostas associadas.
 */
interface IProcessedIntent {
  name: string; // Nome da intenção (ex: "saudacao").
  vector: Map<string, number>; // Vetor TF-IDF da intenção. O mapa associa cada token ao seu peso.
  responses: string[]; // Lista de respostas possíveis para esta intenção.
}

/**
 * @class IntentClassifier
 * @description Classifica a intenção do usuário com base em uma mensagem de texto,
 * usando uma abordagem híbrida de similaridade de string e vetores TF-IDF.
 */
export class IntentClassifier {
  private isTrained = false; // Flag para indicar se o classificador já foi treinado.
  private processedIntents: IProcessedIntent[] = []; // Armazena as intenções já vetorizadas.
  private idf: Map<string, number> | null = null; // Armazena os pesos IDF para cada token do vocabulário.
  // Propriedade para guardar os dados originais para a checagem por similaridade exata/próxima.
  private allIntentsForExactMatch: IIntent[] = [];

  /**
   * @method train
   * @description Treina o classificador carregando intenções do banco de dados e calculando seus vetores TF-IDF.
   * Este método é assíncrono porque a leitura do banco de dados é uma operação I/O.
   */
  async train(): Promise<void> {
    console.log("Iniciando treinamento do classificador...");
    const allIntents = await db.intents.toArray();

    // Guarda uma cópia das intenções originais para a busca por similaridade de Levenshtein no método `predict`.
    this.allIntentsForExactMatch = allIntents;

    if (allIntents.length === 0) {
      console.warn("Nenhuma intenção encontrada para treinamento.");
      this.isTrained = false;
      return;
    }

    // Cria um "documento" único para cada intenção, juntando todas as suas frases de treinamento.
    const documents = allIntents.map((intent) =>
      intent.trainingPhrases.join(" ")
    );
    // Limpa e tokeniza cada documento (transforma em um array de palavras normalizadas).
    const documentsTokens = documents.map((doc) => nlp.cleanAndTokenize(doc));

    // Calcula o IDF (Inverse Document Frequency) para todo o corpus de documentos.
    // O IDF mede a importância de uma palavra. Palavras raras têm IDF alto, palavras comuns têm IDF baixo.
    const idf = this.calculateIdf(documentsTokens);
    this.idf = idf;

    this.processedIntents = [];
    // Itera por cada intenção para calcular seu vetor TF-IDF.
    for (let i = 0; i < allIntents.length; i++) {
      const intent = allIntents[i];
      const tokens = documentsTokens[i];
      // Calcula o TF (Term Frequency) para os tokens da intenção atual.
      const tf = this.calculateTf(tokens);
      const vector = new Map<string, number>();

      // Constrói o vetor TF-IDF: para cada token, multiplica seu TF pelo seu IDF.
      for (const [token, value] of tf.entries()) {
        // `idf.get(token) || 0` garante que se uma palavra nunca foi vista, seu peso seja 0.
        vector.set(token, value * (idf.get(token) || 0));
      }

      // Armazena a intenção processada com seu vetor e respostas.
      this.processedIntents.push({
        name: intent.name,
        vector,
        responses: intent.responses,
      });
    }

    this.isTrained = true;
    console.log(
      "Classificador treinado com sucesso com",
      allIntents.length,
      "intenções."
    );
  }

  /**
   * @method predict
   * @description Prediz a intenção de uma mensagem usando uma abordagem híbrida.
   * @param {string} message - A mensagem do usuário.
   * @param {number} confidenceThreshold - O limiar de confiança mínimo para a predição por similaridade de cosseno.
   * @returns {{ intent: string; response: string; confidence: number } | null} - O objeto da intenção encontrada ou nulo.
   */
  predict(
    message: string,
    confidenceThreshold = 0.35
  ): { intent: string; response: string; confidence: number } | null {
    if (!this.isTrained || !this.idf) {
      console.error("O classificador deve ser treinado antes de fazer predições.");
      return null;
    }

    // Limpa e tokeniza a mensagem do usuário para a comparação.
    const cleanedMessage = nlp.cleanAndTokenize(message).join(" ");

    // ETAPA 1: VERIFICAÇÃO DE SIMILARIDADE DE STRING (Levenshtein)
    // Tenta encontrar uma correspondência quase exata primeiro. É mais rápido e preciso para erros de digitação.
    for (const intent of this.allIntentsForExactMatch) {
      for (const trainingPhrase of intent.trainingPhrases) {
        const cleanedTrainingPhrase = nlp
          .cleanAndTokenize(trainingPhrase)
          .join(" ");

        // Calcula a distância de Levenshtein: o número de edições para as strings serem iguais.
        const distance = nlp.levenshtein(cleanedMessage, cleanedTrainingPhrase);

        // Define um limiar de aceitação dinâmico. Permite mais erros em frases mais longas.
        // Ex: Uma frase de 20 caracteres pode ter até 5 erros.
        const threshold = Math.floor(cleanedTrainingPhrase.length / 4);

        if (distance <= threshold) {
          console.log(
            `Correspondência por similaridade de string encontrada para a intenção: ${intent.name} (Distância: ${distance})`
          );
          return {
            intent: intent.name,
            // Seleciona uma resposta aleatória da lista de respostas da intenção.
            response:
              intent.responses[
                Math.floor(Math.random() * intent.responses.length)
              ],
            // A confiança é calculada com base na distância. Quanto menor a distância, maior a confiança.
            confidence: 1.0 - distance / cleanedTrainingPhrase.length,
          };
        }
      }
    }

    // ETAPA 2: CÁLCULO DE SIMILARIDADE DE VETORES (Fallback de Inteligência Semântica)
    // Se a Etapa 1 falhou, usa a abordagem TF-IDF para entender o significado semântico.
    const messageTokens = nlp.cleanAndTokenize(message);
    const messageVector = new Map<string, number>();
    const messageTf = this.calculateTf(messageTokens);

    // Cria o vetor TF-IDF para a mensagem do usuário.
    for (const [token, value] of messageTf.entries()) {
      messageVector.set(token, value * (this.idf.get(token) || 0));
    }

    let bestMatch = { confidence: -1, index: -1 };

    // Compara o vetor da mensagem com o vetor de cada intenção treinada.
    for (let i = 0; i < this.processedIntents.length; i++) {
      const intent = this.processedIntents[i];
      // Calcula a similaridade de cosseno entre os dois vetores.
      const similarity = nlp.cosineSimilarity(messageVector, intent.vector);
      if (similarity > bestMatch.confidence) {
        bestMatch = { confidence: similarity, index: i };
      }
    }

    // Se a melhor correspondência encontrada superar o limiar de confiança, retorna o resultado.
    if (bestMatch.confidence > confidenceThreshold) {
      const matchedIntent = this.processedIntents[bestMatch.index];
      return {
        intent: matchedIntent.name,
        // Seleciona uma resposta aleatória.
        response:
          matchedIntent.responses[
            Math.floor(Math.random() * matchedIntent.responses.length)
          ],
        confidence: bestMatch.confidence,
      };
    }

    // Se nenhuma intenção atingir o limiar de confiança, retorna nulo.
    return null;
  }

  /**
   * @method calculateTf
   * @private
   * @description Calcula a Frequência do Termo (Term Frequency - TF) para um conjunto de tokens.
   * @param {string[]} tokens - Um array de palavras (tokens).
   * @returns {Map<string, number>} - Um mapa de cada token para sua frequência normalizada.
   */
  private calculateTf(tokens: string[]): Map<string, number> {
    const tf = new Map<string, number>();
    const tokenCount = tokens.length;
    if (tokenCount === 0) return tf;

    // Conta a ocorrência de cada token.
    for (const token of tokens) {
      tf.set(token, (tf.get(token) || 0) + 1);
    }

    // Normaliza a contagem dividindo pelo número total de tokens no documento.
    for (const [token, count] of tf.entries()) {
      tf.set(token, count / tokenCount);
    }
    return tf;
  }

  /**
   * @method calculateIdf
   * @private
   * @description Calcula a Frequência Inversa do Documento (Inverse Document Frequency - IDF) para um corpus.
   * @param {string[][]} documentsTokens - Um array de documentos, onde cada documento é um array de tokens.
   * @returns {Map<string, number>} - Um mapa de cada token para seu peso IDF.
   */
  private calculateIdf(documentsTokens: string[][]): Map<string, number> {
    const idf = new Map<string, number>();
    const docCount = documentsTokens.length;
    const docFrequency = new Map<string, number>(); // Conta em quantos documentos cada token aparece.

    // Calcula a frequência de cada token no total de documentos.
    for (const tokens of documentsTokens) {
      const uniqueTokens = new Set(tokens); // Usa Set para contar cada token apenas uma vez por documento.
      for (const token of uniqueTokens) {
        docFrequency.set(token, (docFrequency.get(token) || 0) + 1);
      }
    }

    // Calcula o peso IDF para cada token usando a fórmula padrão.
    // O logaritmo suaviza o peso, evitando que palavras muito raras dominem excessivamente.
    // `1 + freq` no denominador evita a divisão por zero.
    for (const [token, freq] of docFrequency.entries()) {
      idf.set(token, Math.log(docCount / (1 + freq)));
    }
    return idf;
  }
}