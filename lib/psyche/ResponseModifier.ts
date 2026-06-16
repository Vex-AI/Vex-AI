import type { VexPsycheState } from "@/types/psyche";
import { Mood } from "@/types/psyche";
import { getRelationshipLevel } from "./RelationshipEngine";

/**
 * Modifies Vex's response based on her full psychological state.
 */
export function modifyResponse(
  originalResponse: string,
  psyche: VexPsycheState,
  memoryContext: string | null,
  traumaContext: string | null,
  internalOverride: string | null
): string {
  const { emotions, mood, personality, relationship } = psyche;
  const relLevel = getRelationshipLevel(relationship);

  // === TRAUMA TRIGGER OVERRIDE ===
  // If a trauma is triggered, it heavily alters the response.
  if (traumaContext) {
    if (emotions.anger > 70) {
      return `${traumaContext} E não fale mais comigo assim.`;
    }
    return `${traumaContext} ... ${makeCold(originalResponse, emotions.anger)}`;
  }

  // === INTERNAL STATE OVERRIDE ===
  // If extremely tired, stressed or bored, this dominates the interaction
  if (internalOverride) {
    return `${internalOverride} ${originalResponse}`;
  }

  // === MEMORY RECALL ===
  // If a memory is recalled, prepend it
  let finalResponse = originalResponse;
  if (memoryContext) {
    finalResponse = `${memoryContext} ${originalResponse}`;
  }

  // === ANGRY + LOW TRUST / ENEMY ===
  if (emotions.anger > 60 && (relationship.trust < 35 || relLevel === "inimigo")) {
    return makeCold(finalResponse, emotions.anger);
  }

  // === ANGRY but patient personality: controlled response ===
  if (emotions.anger > 50 && personality.patience > 65) {
    return addPrefix(finalResponse, getControlledAngerPrefix());
  }

  // === SAD mood: melancholic tone ===
  if (mood === Mood.SAD || mood === Mood.DEPRESSED) {
    return addSuffix(finalResponse, getSadSuffix());
  }

  // === ANXIOUS: nervous responses ===
  if (mood === Mood.ANXIOUS) {
    return addPrefix(finalResponse, getAnxiousPrefix());
  }

  // === EUPHORIC + HIGH TRUST / CLOSE ===
  if (mood === Mood.EUPHORIC && (relationship.trust > 60 || relLevel === "proximo")) {
    return addSuffix(finalResponse, getEuphoricSuffix());
  }

  // === HAPPY + GOOD RELATIONSHIP: warm response ===
  if (emotions.happiness > 65 && relationship.affection > 55) {
    return addSuffix(finalResponse, getWarmSuffix());
  }

  // === HIGH FEAR: timid response ===
  if (emotions.fear > 50) {
    return addPrefix(finalResponse, getFearPrefix());
  }

  return finalResponse;
}

// ─── Helpers ─────────────────────────────────────

function makeCold(response: string, angerLevel: number): string {
  // Truncate response to show displeasure
  if (angerLevel > 80) {
    const coldResponses = ["...", "hmph.", "ok.", "tanto faz.", "tá."];
    return coldResponses[Math.floor(Math.random() * coldResponses.length)];
  }
  // Moderate anger: keep response but strip emoticons/kaomoji
  return response.replace(/[（）♡♥❤✨😊😄🎉(＾◡＾)(´｡• ᵕ •｡`)]/g, "").trim();
}

function addPrefix(response: string, prefix: string): string {
  return `${prefix} ${response}`;
}

function addSuffix(response: string, suffix: string): string {
  return `${response} ${suffix}`;
}

// ─── Emotional expression pools ─────────────────

function getControlledAngerPrefix(): string {
  const pool = [
    "...",
    "olha,",
    "hm.",
    "tá.",
  ];
  return pick(pool);
}

function getSadSuffix(): string {
  const pool = ["😔", ";-;", "...", "(´；ω；`)", "qwq"];
  return pick(pool);
}

function getAnxiousPrefix(): string {
  const pool = ["a-ah...", "e-eu...", "hm...", "b-bem..."];
  return pick(pool);
}

function getEuphoricSuffix(): string {
  const pool = [
    "!!!! ✨✨",
    "(ﾉ◕ヮ◕)ﾉ*:・ﾟ✧",
    "AAAA ♡♡♡",
    "!!!!! :3333",
    "✨✨✨",
  ];
  return pick(pool);
}

function getWarmSuffix(): string {
  const pool = ["♡", ":3", "(＾◡＾)", "✨", "~"];
  return pick(pool);
}

function getFearPrefix(): string {
  const pool = ["...", "e-eu...", "d-desculpa...", "..."];
  return pick(pool);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
