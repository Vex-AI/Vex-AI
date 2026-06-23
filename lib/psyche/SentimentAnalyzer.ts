// lib/psyche/SentimentAnalyzer.ts
import i18n from "../translation";
import diacritics from "diacritics";
import type { SentimentResult, SentimentLexicon, SentimentImpact } from "@/types/psyche";

// Cache loaded lexicons
const lexiconCache = new Map<string, SentimentLexicon>();

async function loadLexicon(lang: string): Promise<SentimentLexicon> {
  if (lexiconCache.has(lang)) return lexiconCache.get(lang)!;

  try {
    const module = await import(`../../data/sentiment/${lang}.json`);
    const lexicon = module.default as SentimentLexicon;
    lexiconCache.set(lang, lexicon);
    return lexicon;
  } catch {
    // Fallback to enUS if language not found
    if (lang !== "enUS") return loadLexicon("enUS");
    return {};
  }
}

function normalizeText(text: string): string {
  return diacritics.remove(
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  );
}

// Intensifiers multiply impact by this factor
const INTENSIFIERS: Record<string, number> = {
  muito: 1.5,
  demais: 1.5,
  bastante: 1.3,
  extremamente: 2.0,
  super: 1.5,
  mega: 1.5,
  // English
  very: 1.5,
  really: 1.5,
  extremely: 2.0,
  so: 1.3,
  totally: 1.5,
};

// Negation words flip the valence
const NEGATIONS = new Set([
  "nao", "nem", "nunca", "jamais", "nenhum",
  "not", "never", "no", "dont", "doesnt", "isnt", "arent", "cant", "wont",
]);

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  const lang = i18n.language || "enUS";
  const lexicon = await loadLexicon(lang);
  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/).filter(Boolean);

  const matchedCategories: string[] = [];
  const aggregatedImpact: SentimentImpact = {};

  // Detect intensifier and negation presence
  let intensifierMultiplier = 1.0;
  let hasNegation = false;

  for (const word of words) {
    if (INTENSIFIERS[word]) {
      intensifierMultiplier = Math.max(intensifierMultiplier, INTENSIFIERS[word]);
    }
    if (NEGATIONS.has(word)) {
      hasNegation = true;
    }
  }

  // Match against each category in the lexicon
  for (const [categoryName, category] of Object.entries(lexicon)) {
    let matched = false;

    for (const phrase of category.words) {
      const normalizedPhrase = normalizeText(phrase);
      // Support multi-word phrases (e.g. "cala a boca")
      if (normalized.includes(normalizedPhrase)) {
        matched = true;
        break;
      }
    }

    if (matched) {
      matchedCategories.push(categoryName);

      // Aggregate impacts
      for (const [emotion, value] of Object.entries(category.impact)) {
        const current = (aggregatedImpact as any)[emotion] || 0;
        let adjustedValue = (value as number) * intensifierMultiplier;

        // Negation flips positive/negative impacts
        if (hasNegation) {
          adjustedValue *= -0.5; // Partial flip — "não te odeio" doesn't mean full love
        }

        (aggregatedImpact as any)[emotion] = current + adjustedValue;
      }
    }
  }

  // Calculate valence from aggregated impacts
  const positive = (aggregatedImpact.happiness || 0) + (aggregatedImpact.trust || 0);
  const negative = (aggregatedImpact.anger || 0) + (aggregatedImpact.sadness || 0) + (aggregatedImpact.fear || 0);
  const total = Math.abs(positive) + Math.abs(negative) || 1;
  const valence = Math.max(-1, Math.min(1, (positive - negative) / total));

  // Arousal = overall intensity of the emotional stimulus
  const arousal = Math.min(1, Object.values(aggregatedImpact).reduce(
    (sum, v) => sum + Math.abs(v || 0), 0
  ) / 100);

  return {
    valence,
    arousal,
    categories: matchedCategories,
    impacts: aggregatedImpact,
  };
}
