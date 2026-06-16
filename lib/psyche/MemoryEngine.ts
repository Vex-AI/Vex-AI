import { db } from "../vexDB";
import i18n from "../translation";
import type { SentimentResult } from "@/types/psyche";

const SIGNIFICANCE_THRESHOLD = 0.6; // Arousal must be high to form a memory
const MAX_MEMORIES_PER_TYPE = 50; // Don't bloat the DB

/**
 * Evaluates the current interaction and decides whether it's significant
 * enough to be persisted as a long-term emotional memory.
 */
export async function recordIfSignificant(
  userMessage: string,
  sentiment: SentimentResult
): Promise<void> {
  // Only high intensity emotional events form memories
  if (sentiment.arousal < SIGNIFICANCE_THRESHOLD) return;

  // Find the strongest emotion triggered by this message
  let strongestEmotion = "";
  let highestImpact = 0;

  for (const [emotion, impact] of Object.entries(sentiment.impacts)) {
    if (impact !== undefined && Math.abs(impact) > highestImpact) {
      highestImpact = Math.abs(impact);
      strongestEmotion = emotion;
    }
  }

  if (!strongestEmotion || highestImpact < 20) return;

  const newMemory = {
    event: userMessage.substring(0, 100), // store up to 100 chars
    emotionType: strongestEmotion,
    intensity: Math.min(100, highestImpact),
    triggerWords: sentiment.categories, // store what caused it
    date: Date.now(),
  };

  try {
    await db.emotionalMemories.add(newMemory);

    // Keep DB clean
    const count = await db.emotionalMemories.where("emotionType").equals(strongestEmotion).count();
    if (count > MAX_MEMORIES_PER_TYPE) {
      const oldest = await db.emotionalMemories
        .where("emotionType")
        .equals(strongestEmotion)
        .sortBy("date");
      if (oldest.length > 0 && oldest[0].id) {
        await db.emotionalMemories.delete(oldest[0].id);
      }
    }
  } catch (err) {
    console.error("Failed to save emotional memory:", err);
  }
}

/**
 * Recalls recent memories matching a specific sentiment category.
 */
export async function recallRelevantMemory(
  categories: string[]
): Promise<string | null> {
  if (categories.length === 0) return null;

  try {
    // Look for memories that share the same trigger categories (e.g. "insults_heavy")
    const memories = await db.emotionalMemories.toArray();
    
    // Sort by recent first
    memories.sort((a, b) => b.date - a.date);

    for (const mem of memories) {
      if (mem.triggerWords.some(w => categories.includes(w))) {
        // Only recall if it's within the last 7 days to keep it relevant
        const daysAgo = (Date.now() - mem.date) / (1000 * 60 * 60 * 24);
        if (daysAgo < 7) {
          if (categories.includes("insults_heavy")) {
            return i18n.t("psyche_memory_insult");
          }
          if (categories.includes("affection")) {
            return i18n.t("psyche_memory_affection");
          }
          if (categories.includes("praise")) {
            return i18n.t("psyche_memory_praise");
          }
        }
      }
    }
  } catch (err) {
    console.error("Failed to recall memory:", err);
  }

  return null;
}
