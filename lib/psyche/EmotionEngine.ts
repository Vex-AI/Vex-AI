// lib/psyche/EmotionEngine.ts
import type { EmotionState, SentimentResult } from "@/types/psyche";
import { DEFAULT_EMOTIONS } from "@/types/psyche";

/** Clamp a value between min and max */
function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Apply a sentiment stimulus to the current emotion state.
 * Each impact in the sentiment result directly adjusts the corresponding emotion.
 */
export function applyStimulus(
  current: EmotionState,
  sentiment: SentimentResult
): EmotionState {
  const impacts = sentiment.impacts;
  return {
    happiness: clamp(current.happiness + (impacts.happiness || 0)),
    sadness: clamp(current.sadness + (impacts.sadness || 0)),
    anger: clamp(current.anger + (impacts.anger || 0)),
    fear: clamp(current.fear + (impacts.fear || 0)),
    trust: clamp(current.trust + (impacts.trust || 0)),
    curiosity: clamp(current.curiosity + (impacts.curiosity || 0)),
  };
}

/**
 * Emotions decay naturally toward their default resting values.
 * Called once per interaction cycle.
 *
 * Uses exponential decay: emotion = emotion + (target - emotion) * rate
 * rate controls how fast emotions return to baseline.
 */
export function decayEmotions(
  current: EmotionState,
  decayRate = 0.15
): EmotionState {
  const target = DEFAULT_EMOTIONS;
  return {
    happiness: current.happiness + (target.happiness - current.happiness) * decayRate,
    sadness: current.sadness + (target.sadness - current.sadness) * decayRate,
    anger: current.anger + (target.anger - current.anger) * decayRate,
    fear: current.fear + (target.fear - current.fear) * decayRate,
    trust: current.trust + (target.trust - current.trust) * decayRate,
    curiosity: current.curiosity + (target.curiosity - current.curiosity) * decayRate,
  };
}

/**
 * Time-based decay: if a long time has passed since the last interaction,
 * apply heavier decay. This means emotions reset more if the user is away.
 */
export function timeDecay(
  current: EmotionState,
  lastInteraction: number
): EmotionState {
  const now = Date.now();
  const hoursSince = (now - lastInteraction) / (1000 * 60 * 60);

  if (hoursSince < 0.5) return current; // less than 30 min, no extra decay

  // More time = more decay. Cap at full reset after 24h
  const extraDecayRate = Math.min(0.8, hoursSince * 0.05);
  return decayEmotions(current, extraDecayRate);
}

/**
 * Returns the dominant emotion name and its value.
 */
export function getDominantEmotion(emotions: EmotionState): {
  name: keyof EmotionState;
  value: number;
} {
  const entries = Object.entries(emotions) as [keyof EmotionState, number][];
  // Sort by absolute deviation from default (50 for happiness/trust, 0 for others)
  const defaults = DEFAULT_EMOTIONS;
  
  let maxDeviation = 0;
  let dominant: keyof EmotionState = "happiness";

  for (const [key, value] of entries) {
    const deviation = Math.abs(value - defaults[key]);
    if (deviation > maxDeviation) {
      maxDeviation = deviation;
      dominant = key;
    }
  }

  return { name: dominant, value: emotions[dominant] };
}

/**
 * Maps the dominant emotion to a Noto animated emoji code.
 */
export function emotionToEmoji(emotions: EmotionState): string {
  const { name, value } = getDominantEmotion(emotions);

  // If everything is near default, return neutral happy
  if (value < 20 && name !== "happiness" && name !== "trust") {
    return "1f60a"; // 😊
  }

  const emojiMap: Record<keyof EmotionState, string> = {
    happiness: value > 80 ? "1f929" : "1f604",  // 🤩 or 😄
    sadness: value > 60 ? "1f62d" : "1f622",    // 😭 or 😢
    anger: value > 60 ? "1f621" : "1f620",       // 😡 or 😠
    fear: "1f628",                                // 😨
    trust: "1f60a",                               // 😊
    curiosity: "1f914",                           // 🤔
  };

  return emojiMap[name] || "1f60a";
}
