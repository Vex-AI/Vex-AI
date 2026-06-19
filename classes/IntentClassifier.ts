// classes/IntentClassifier.ts

import { db } from "@/lib/vexDB";
import * as nlp from "./nlp-util";
import { ICachedIntent } from "@/types";

interface IProcessedIntent {
  name: string;
  vector: Map<string, number>;
  magnitude: number;
  responses: string[];
}

export class IntentClassifier {
  private isTrained = false;
  private processedIntents: IProcessedIntent[] = [];
  private idf: Map<string, number> | null = null;
  private allIntentsForExactMatch: ICachedIntent[] = [];

  async train(): Promise<void> {
    const allIntents = await db.intents.toArray();

    this.allIntentsForExactMatch = allIntents.map((intent) => ({
      name: intent.name,
      responses: intent.responses,
      cachedCleanedPhrases: intent.trainingPhrases.map((phrase) =>
        nlp.cleanAndTokenize(phrase).join(" ")
      ),
    }));

    if (allIntents.length === 0) {
      console.warn("No intents found for training.");
      this.isTrained = false;
      return;
    }

    const documents = allIntents.map((intent) =>
      intent.trainingPhrases.join(" ")
    );
    const documentsTokens = documents.map((doc) => nlp.cleanAndTokenize(doc));

    const idf = this.calculateIdf(documentsTokens);
    this.idf = idf;

    this.processedIntents = [];
    for (let i = 0; i < allIntents.length; i++) {
      const intent = allIntents[i];
      const tokens = documentsTokens[i];
      const tf = this.calculateTf(tokens);
      const vector = new Map<string, number>();

      let magSq = 0;
      for (const [token, value] of tf.entries()) {
        const weight = value * (idf.get(token) || 0);
        vector.set(token, weight);
        magSq += weight * weight;
      }

      this.processedIntents.push({
        name: intent.name,
        vector,
        magnitude: Math.sqrt(magSq),
        responses: intent.responses,
      });
    }

    this.isTrained = true;
    console.log("Classifier successfully trained with", allIntents.length, "intents.");
  }

  predict(
    message: string,
    confidenceThreshold = 0.35
  ): { intent: string; response: string; confidence: number } | null {
    if (!this.isTrained || !this.idf) {
      console.error("The classifier must be trained before making predictions.");
      return null;
    }

    const messageTokens = nlp.cleanAndTokenize(message);
    const cleanedMessage = messageTokens.join(" ");

    // STEP 1: STRING SIMILARITY CHECK (Levenshtein) - Fast Path for exact/near-exact
    for (const intent of this.allIntentsForExactMatch) {
      for (const cachedPhrase of intent.cachedCleanedPhrases) {
        const distance = nlp.levenshtein(cleanedMessage, cachedPhrase);
        const threshold = Math.floor(cachedPhrase.length / 4);

        if (distance <= threshold) {
          return {
            intent: intent.name,
            response: intent.responses[Math.floor(Math.random() * intent.responses.length)],
            confidence: 1.0 - distance / Math.max(cachedPhrase.length, 1),
          };
        }
      }
    }

    // STEP 2: HYBRID VECTOR CALCULATION (Semantic Fallback)
    const messageVector = new Map<string, number>();
    const messageTf = this.calculateTf(messageTokens);

    let msgMagSq = 0;
    for (const [token, value] of messageTf.entries()) {
      const weight = value * (this.idf.get(token) || 0);
      messageVector.set(token, weight);
      msgMagSq += weight * weight;
    }
    const messageMagnitude = Math.sqrt(msgMagSq);

    let bestMatch = { confidence: -1, index: -1 };

    for (let i = 0; i < this.processedIntents.length; i++) {
      const intent = this.processedIntents[i];
      
      // Cosine Similarity (60% weight)
      const cosine = nlp.cosineSimilarity(messageVector, intent.vector, messageMagnitude, intent.magnitude);
      
      // Keyword Overlap (Jaccard-like, 40% weight)
      let overlapCount = 0;
      for (const token of messageVector.keys()) {
        if (intent.vector.has(token)) overlapCount++;
      }
      const totalUniqueTokens = new Set([...messageVector.keys(), ...intent.vector.keys()]).size;
      const overlapScore = totalUniqueTokens === 0 ? 0 : overlapCount / totalUniqueTokens;

      // Hybrid Score
      const hybridScore = (cosine * 0.6) + (overlapScore * 0.4);

      if (hybridScore > bestMatch.confidence) {
        bestMatch = { confidence: hybridScore, index: i };
      }
    }

    if (bestMatch.confidence > confidenceThreshold) {
      const matchedIntent = this.processedIntents[bestMatch.index];
      return {
        intent: matchedIntent.name,
        response: matchedIntent.responses[Math.floor(Math.random() * matchedIntent.responses.length)],
        confidence: bestMatch.confidence,
      };
    }

    return null;
  }

  private calculateTf(tokens: string[]): Map<string, number> {
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

  private calculateIdf(documentsTokens: string[][]): Map<string, number> {
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
      idf.set(token, Math.log((1 + docCount) / (1 + freq)) + 1);
    }
    return idf;
  }
}
