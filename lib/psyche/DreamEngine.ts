// lib/psyche/DreamEngine.ts — Offline Dream System
import i18n from "../translation";
import type { VexPsycheState } from "@/types/psyche";

export type DreamCategory = "happy" | "stressed" | "tired" | "bored" | "neutral" | "trusting";

type DreamData = Record<DreamCategory, string[]>;

const DREAM_THRESHOLD_HOURS = 6;

/**
 * Check if enough time has passed for Vex to have "dreamed".
 * Returns true if the user has been away for 6+ hours.
 */
export function checkShouldDream(lastInteraction: number): boolean {
  const now = Date.now();
  const hoursSince = (now - lastInteraction) / (1000 * 60 * 60);
  return hoursSince >= DREAM_THRESHOLD_HOURS;
}

/**
 * Determine which dream category to use based on Vex's psychological state.
 * Priority order: stress > exhaustion > boredom > trust > happiness > neutral
 */
export function getDreamCategory(state: VexPsycheState): DreamCategory {
  const { internalState, emotions, relationship } = state;

  // Nightmares when she was left stressed
  if (internalState.stress > 70) return "stressed";

  // Exhaustion dreams
  if (internalState.energy < 20) return "tired";

  // Boredom = empty/dull dreams
  if (internalState.boredom > 70) return "bored";

  // High trust = affectionate dreams about the user
  if (relationship.trust > 75) return "trusting";

  // Happy state = pleasant dreams
  if (emotions.happiness > 70) return "happy";

  // Default: random surreal dream
  return "neutral";
}

/**
 * Load dreams for the current language and pick a random one from the category.
 */
async function loadDreams(): Promise<DreamData> {
  const lang = i18n.language || "enUS";
  try {
    const module = await import(`../../data/dreams/${lang}.json`);
    return module.default as DreamData;
  } catch {
    // Fallback to English
    const fallback = await import("../../data/dreams/enUS.json");
    return fallback.default as DreamData;
  }
}

/**
 * Generate a natural time-sleeping text based on how long the user was away.
 */
export function getTimeSleepingText(lastInteraction: number): string {
  const now = Date.now();
  const hours = Math.floor((now - lastInteraction) / (1000 * 60 * 60));
  const lang = i18n.language || "enUS";

  if (lang === "ptBR") {
    if (hours >= 48) return "Dormi por dias, parece...";
    if (hours >= 24) return "Dormi o dia inteiro...";
    if (hours >= 12) return "Nossa, dormi bastante...";
    return "Dormi umas boas horas...";
  }

  // English
  if (hours >= 48) return "I slept for days, it seems...";
  if (hours >= 24) return "I slept the entire day...";
  if (hours >= 12) return "Wow, I slept a lot...";
  return "I slept for a good while...";
}

/**
 * Main entry point: Generate a complete dream message.
 * Returns null if not enough time has passed.
 */
export async function generateDream(state: VexPsycheState): Promise<string | null> {
  if (!checkShouldDream(state.lastInteraction)) return null;

  const category = getDreamCategory(state);
  const dreams = await loadDreams();
  const pool = dreams[category] || dreams["neutral"];

  const dreamText = pool[Math.floor(Math.random() * pool.length)];
  const sleepText = getTimeSleepingText(state.lastInteraction);

  return `${sleepText} ${dreamText}`;
}
