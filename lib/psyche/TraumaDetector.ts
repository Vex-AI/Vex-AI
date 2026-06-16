import { db } from "../vexDB";
import i18n from "../translation";

const TRAUMA_THRESHOLD = 3; // Number of times a word must be used to become a trauma

/**
 * Checks if the user is repeatedly using the same negative words.
 * If so, records a trauma in the database.
 */
export async function checkTrauma(
  userMessage: string,
  categories: string[]
): Promise<void> {
  // We only care about heavy insults or threats for traumas
  if (!categories.includes("insults_heavy") && !categories.includes("threat")) {
    return;
  }

  // Tokenize roughly
  const words = userMessage.toLowerCase().split(/\s+/);
  
  try {
    for (const word of words) {
      if (word.length < 3) continue;

      // Look if we already tracked this word
      const existing = await db.traumas.where("triggerWord").equals(word).first();

      if (existing) {
        existing.occurrences += 1;
        existing.lastOccurrence = Date.now();
        existing.emotionalImpact = Math.min(100, existing.emotionalImpact + 10);
        await db.traumas.put(existing);
      } else {
        await db.traumas.add({
          triggerWord: word,
          occurrences: 1,
          lastOccurrence: Date.now(),
          emotionalImpact: 50,
        });
      }
    }
  } catch (err) {
    console.error("Failed to check trauma:", err);
  }
}

/**
 * If the user uses a trauma word, Vex reacts specifically to it.
 */
export async function checkTrigger(userMessage: string): Promise<string | null> {
  const words = userMessage.toLowerCase().split(/\s+/);

  try {
    const traumas = await db.traumas.toArray();
    
    for (const word of words) {
      const trauma = traumas.find(t => t.triggerWord === word);
      if (trauma && trauma.occurrences >= TRAUMA_THRESHOLD) {
        // Only trigger if it hasn't been used very recently to avoid spam
        const minutesAgo = (Date.now() - trauma.lastOccurrence) / (1000 * 60);
        if (minutesAgo > 10) { // Update last occurrence to prevent spam
           trauma.lastOccurrence = Date.now();
           await db.traumas.put(trauma);
        }
        
        return i18n.t("psyche_trauma_trigger");
      }
    }
  } catch (err) {
    console.error("Failed to check trigger:", err);
  }

  return null;
}
