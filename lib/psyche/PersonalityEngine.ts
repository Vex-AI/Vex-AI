// lib/psyche/PersonalityEngine.ts
import type { Personality, Relationship } from "@/types/psyche";

/**
 * Generate a random personality.
 * Each trait gets a random value in a bell-curve-ish distribution
 * centered around 50, ensuring variety but avoiding extremes.
 *
 * This makes each user's Vex feel unique.
 */
export function generateRandomPersonality(): Personality {
  return {
    patience: randomTrait(45, 85),
    empathy: randomTrait(50, 90),
    forgiveness: randomTrait(40, 80),
    confidence: randomTrait(35, 75),
    sociability: randomTrait(50, 90),
    humor: randomTrait(40, 85),
  };
}

/**
 * Generate a random value between min and max with a slight center bias.
 * Uses the average of two random numbers for a softer distribution.
 */
function randomTrait(min: number, max: number): number {
  const r1 = Math.random();
  const r2 = Math.random();
  const avg = (r1 + r2) / 2; // center-biased
  return Math.round(min + avg * (max - min));
}

/**
 * Very slow personality evolution based on long-term relationship patterns.
 * Only called every ~50 interactions.
 *
 * If the user is consistently kind → Vex becomes more trusting, sociable.
 * If the user is consistently hostile → Vex becomes less patient, more guarded.
 */
export function evolvePersonality(
  personality: Personality,
  relationship: Relationship,
  totalInteractions: number
): Personality {
  // Only evolve every 50 interactions
  if (totalInteractions % 50 !== 0 || totalInteractions === 0) {
    return personality;
  }

  const delta = 1; // Very small changes

  const evolved = { ...personality };

  // Positive relationship patterns increase openness
  if (relationship.trust > 70) {
    evolved.sociability = clamp(evolved.sociability + delta);
    evolved.confidence = clamp(evolved.confidence + delta);
  }

  if (relationship.affection > 70) {
    evolved.empathy = clamp(evolved.empathy + delta);
    evolved.humor = clamp(evolved.humor + delta);
  }

  // Negative relationship patterns make Vex more guarded
  if (relationship.trust < 30) {
    evolved.patience = clamp(evolved.patience - delta);
    evolved.forgiveness = clamp(evolved.forgiveness - delta);
  }

  if (relationship.respect < 25) {
    evolved.sociability = clamp(evolved.sociability - delta);
    evolved.confidence = clamp(evolved.confidence - delta);
  }

  return evolved;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}
