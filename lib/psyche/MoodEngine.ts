// lib/psyche/MoodEngine.ts
import { Mood } from "@/types/psyche";
import type { EmotionState } from "@/types/psyche";

const HISTORY_SIZE = 15; // Number of emotion snapshots to consider

/**
 * Calculate the average of an emotion property across history snapshots.
 */
function average(history: EmotionState[], key: keyof EmotionState): number {
  if (history.length === 0) return 50;
  // Exponential weighted: recent snapshots matter more
  let totalWeight = 0;
  let weightedSum = 0;

  for (let i = 0; i < history.length; i++) {
    const weight = i + 1; // more recent = higher index = higher weight
    weightedSum += history[i][key] * weight;
    totalWeight += weight;
  }

  return weightedSum / totalWeight;
}

/**
 * Calculate mood from accumulated emotion history.
 * Mood changes slowly — it's a weighted moving average of recent emotion snapshots.
 */
export function calculateMood(
  currentEmotions: EmotionState,
  emotionHistory: EmotionState[]
): Mood {
  // Use the last N snapshots + current
  const snapshots = [...emotionHistory.slice(-HISTORY_SIZE), currentEmotions];

  const avgHappiness = average(snapshots, "happiness");
  const avgSadness = average(snapshots, "sadness");
  const avgAnger = average(snapshots, "anger");
  const avgFear = average(snapshots, "fear");
  const avgTrust = average(snapshots, "trust");

  // Determine mood based on emotion averages
  // High anger overrides most things
  if (avgAnger > 60) return Mood.ANGRY;

  // Combined negativity check
  if (avgSadness > 50 && avgHappiness < 30) {
    return avgSadness > 70 ? Mood.DEPRESSED : Mood.SAD;
  }

  // Anxiety: high fear + moderate stress
  if (avgFear > 40 && avgSadness > 30) return Mood.ANXIOUS;

  // Positive spectrum
  if (avgHappiness > 80 && avgTrust > 60) return Mood.EUPHORIC;
  if (avgHappiness > 65) return Mood.HAPPY;
  if (avgHappiness > 45 && avgSadness < 25) return Mood.CONTENT;

  // Mild sadness
  if (avgSadness > 35 && avgHappiness < 45) return Mood.MELANCHOLIC;

  return Mood.NEUTRAL;
}

/**
 * Trim emotion history to keep only the last N entries.
 */
export function trimHistory(history: EmotionState[]): EmotionState[] {
  return history.slice(-HISTORY_SIZE);
}

/**
 * Get a human-readable mood label for the UI (i18n keys).
 */
export function getMoodEmoji(mood: Mood): string {
  const map: Record<Mood, string> = {
    [Mood.EUPHORIC]: "1f929",    // 🤩
    [Mood.HAPPY]: "1f604",       // 😄
    [Mood.CONTENT]: "1f60a",     // 😊
    [Mood.NEUTRAL]: "1f642",     // 🙂
    [Mood.MELANCHOLIC]: "1f614", // 😔
    [Mood.SAD]: "1f622",         // 😢
    [Mood.ANGRY]: "1f621",       // 😡
    [Mood.DEPRESSED]: "1f62d",   // 😭
    [Mood.ANXIOUS]: "1f630",     // 😰
  };
  return map[mood] || "1f642";
}
