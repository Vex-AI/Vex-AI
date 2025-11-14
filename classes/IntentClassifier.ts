// lib/IntentClassifier.ts

// Imports the database instance (likely IndexedDB via Dexie.js) and NLP utilities.
import { db } from "@/lib/vexDB";
import * as nlp from "./nlp-util"; // Contains functions like tokenization, stemming, levenshtein, etc.
import { ICachedIntent } from "@/types"; // Defines the data structure for a cached intent.

/**
 * @interface IProcessedIntent
 * @description Defines the structure of an intent after being processed by the `train` method.
 * It contains the TF-IDF vector and associated responses.
 */
interface IProcessedIntent {
  name: string; // Name of the intent (e.g., "greeting").
  vector: Map<string, number>; // The intent's TF-IDF vector. The map associates each token with its weight.
  responses: string[]; // List of possible responses for this intent.
}

/**
 * @class IntentClassifier
 * @description Classifies user intent based on a text message,
 * using a hybrid approach of string similarity and TF-IDF vectors.
 */
export class IntentClassifier {
  private isTrained = false; // Flag to indicate if the classifier has been trained.
  private processedIntents: IProcessedIntent[] = []; // Stores the already vectorized intents.
  private idf: Map<string, number> | null = null; // Stores the IDF weights for each token in the vocabulary.
  // Property to store the pre-processed data for the exact/close similarity check.
  private allIntentsForExactMatch: ICachedIntent[] = [];

  /**
   * @method train
   * @description Trains the classifier by loading intents from the database and calculating their TF-IDF vectors.
   * This method is asynchronous because reading from the database is an I/O operation.
   */
  async train(): Promise<void> {
  //  console.log("Starting classifier training...");
    const allIntents = await db.intents.toArray();

    // Stores a cached copy of the cleaned training phrases for the Levenshtein check in the `predict` method.
    this.allIntentsForExactMatch = allIntents.map((intent) => ({
      name: intent.name,
      responses: intent.responses,
      // Creates a new property with the phrases already cleaned and ready for use
      cachedCleanedPhrases: intent.trainingPhrases.map((phrase) =>
        nlp.cleanAndTokenize(phrase).join(" ")
      ),
    }));

    if (allIntents.length === 0) {
      console.warn("No intents found for training.");
      this.isTrained = false;
      return;
    }

    // Creates a single "document" for each intent by joining all its training phrases.
    const documents = allIntents.map((intent) =>
      intent.trainingPhrases.join(" ")
    );
    // Cleans and tokenizes each document (transforms it into an array of normalized words).
    const documentsTokens = documents.map((doc) => nlp.cleanAndTokenize(doc));

    // Calculates the IDF (Inverse Document Frequency) for the entire document corpus.
    // IDF measures the importance of a word. Rare words have a high IDF, common words have a low IDF.
    const idf = this.calculateIdf(documentsTokens);
    this.idf = idf;

    this.processedIntents = [];
    // Iterates through each intent to calculate its TF-IDF vector.
    for (let i = 0; i < allIntents.length; i++) {
      const intent = allIntents[i];
      const tokens = documentsTokens[i];
      // Calculates the TF (Term Frequency) for the current intent's tokens.
      const tf = this.calculateTf(tokens);
      const vector = new Map<string, number>();

      // Builds the TF-IDF vector: for each token, multiply its TF by its IDF.
      for (const [token, value] of tf.entries()) {
        // `idf.get(token) || 0` ensures that if a word was never seen, its weight is 0.
        vector.set(token, value * (idf.get(token) || 0));
      }

      // Stores the processed intent with its vector and responses.
      this.processedIntents.push({
        name: intent.name,
        vector,
        responses: intent.responses,
      });
    }

    this.isTrained = true;
    console.log(
      "Classifier successfully trained with",
      allIntents.length,
      "intents."
    );
  }

  /**
   * @method predict
   * @description Predicts the intent of a message using a hybrid approach.
   * @param {string} message - The user's message.
   * @param {number} confidenceThreshold - The minimum confidence threshold for the cosine similarity prediction.
   * @returns {{ intent: string; response: string; confidence: number } | null} - The found intent object or null.
   */
  predict(
    message: string,
    confidenceThreshold = 0.35
  ): { intent: string; response: string; confidence: number } | null {
    if (!this.isTrained || !this.idf) {
      console.error(
        "The classifier must be trained before making predictions."
      );
      return null;
    }

    // Cleans and tokenizes the user's message for comparison.
    const cleanedMessage = nlp.cleanAndTokenize(message).join(" ");

    // STEP 1: STRING SIMILARITY CHECK (Levenshtein)
    // Tries to find a near-exact match first. It's faster and more accurate for typos.
    for (const intent of this.allIntentsForExactMatch) {
      // Iterates directly over the ALREADY CLEANED phrases from the cache:
      for (const cachedPhrase of intent.cachedCleanedPhrases) {
        // No more cleaning needed! Just calculate the distance:
        const distance = nlp.levenshtein(cleanedMessage, cachedPhrase);

        const threshold = Math.floor(cachedPhrase.length / 4);

        if (distance <= threshold) {
          // ... (rest of the return logic)
          return {
            intent: intent.name,
            response:
              intent.responses[
                Math.floor(Math.random() * intent.responses.length)
              ],
            confidence: 1.0 - distance / cachedPhrase.length,
          };
        }
      }
    }

    // STEP 2: VECTOR SIMILARITY CALCULATION (Semantic Fallback)
    // If Step 1 failed, use the TF-IDF approach to understand the semantic meaning.
    const messageTokens = nlp.cleanAndTokenize(message);
    const messageVector = new Map<string, number>();
    const messageTf = this.calculateTf(messageTokens);

    // Creates the TF-IDF vector for the user's message.
    for (const [token, value] of messageTf.entries()) {
      messageVector.set(token, value * (this.idf.get(token) || 0));
    }

    let bestMatch = { confidence: -1, index: -1 };

    // Compares the message vector with each trained intent vector.
    for (let i = 0; i < this.processedIntents.length; i++) {
      const intent = this.processedIntents[i];
      // Calculates the cosine similarity between the two vectors.
      const similarity = nlp.cosineSimilarity(messageVector, intent.vector);
      if (similarity > bestMatch.confidence) {
        bestMatch = { confidence: similarity, index: i };
      }
    }

    // If the best match found exceeds the confidence threshold, return the result.
    if (bestMatch.confidence > confidenceThreshold) {
      const matchedIntent = this.processedIntents[bestMatch.index];
      return {
        intent: matchedIntent.name,
        // Selects a random response.
        response:
          matchedIntent.responses[
            Math.floor(Math.random() * matchedIntent.responses.length)
          ],
        confidence: bestMatch.confidence,
      };
    }

    // If no intent reaches the confidence threshold, return null.
    return null;
  }

  /**
   * @method calculateTf
   * @private
   * @description Calculates the Term Frequency (TF) for a set of tokens.
   * @param {string[]} tokens - An array of words (tokens).
   * @returns {Map<string, number>} - A map of each token to its normalized frequency.
   */
  private calculateTf(tokens: string[]): Map<string, number> {
    const tf = new Map<string, number>();
    const tokenCount = tokens.length;
    if (tokenCount === 0) return tf;

    // Counts the occurrence of each token.
    for (const token of tokens) {
      tf.set(token, (tf.get(token) || 0) + 1);
    }

    // Normalizes the count by dividing by the total number of tokens in the document.
    for (const [token, count] of tf.entries()) {
      tf.set(token, count / tokenCount);
    }
    return tf;
  }

  /**
   * @method calculateIdf
   * @private
   * @description Calculates the Inverse Document Frequency (IDF) for a corpus.
   * @param {string[][]} documentsTokens - An array of documents, where each document is an array of tokens.
   * @returns {Map<string, number>} - A map of each token to its IDF weight.
   */
  private calculateIdf(documentsTokens: string[][]): Map<string, number> {
    const idf = new Map<string, number>();
    const docCount = documentsTokens.length;
    const docFrequency = new Map<string, number>(); // Counts how many documents each token appears in.

    // Calculates the frequency of each token across all documents.
    for (const tokens of documentsTokens) {
      const uniqueTokens = new Set(tokens); // Uses a Set to count each token only once per document.
      for (const token of uniqueTokens) {
        docFrequency.set(token, (docFrequency.get(token) || 0) + 1);
      }
    }

    // Calculates the IDF weight for each token using the standard formula.
    // The logarithm smooths the weight, preventing very rare words from dominating excessively.
    // `1 + freq` in the denominator avoids division by zero.
    for (const [token, freq] of docFrequency.entries()) {
      idf.set(token, Math.log(docCount / (1 + freq)));
    }
    return idf;
  }
}
