// lib/psyche/ResponseModifier.ts
import type { VexPsycheState } from "@/types/psyche";
import { Mood } from "@/types/psyche";

/**
 * Modifies Vex's response based on her full psychological state.
 *
 * Instead of replacing the response entirely, we:
 * 1. May prepend/append emotional expressions
 * 2. May shorten the response if Vex is angry/cold
 * 3. May add warmth if she's happy and trusting
 */
export function modifyResponse(
  originalResponse: string,
  psyche: VexPsycheState
): string {
  const { emotions, mood, personality, relationship } = psyche;

  // === ANGRY + LOW TRUST: cold, short responses ===
  if (emotions.anger > 60 && relationship.trust < 35) {
    return makeCold(originalResponse, emotions.anger);
  }

  // === ANGRY but patient personality: controlled response ===
  if (emotions.anger > 50 && personality.patience > 65) {
    return addPrefix(originalResponse, getControlledAngerPrefix());
  }

  // === SAD mood: melancholic tone ===
  if (mood === Mood.SAD || mood === Mood.DEPRESSED) {
    return addSuffix(originalResponse, getSadSuffix());
  }

  // === ANXIOUS: nervous responses ===
  if (mood === Mood.ANXIOUS) {
    return addPrefix(originalResponse, getAnxiousPrefix());
  }

  // === EUPHORIC + HIGH TRUST: extra affectionate ===
  if (mood === Mood.EUPHORIC && relationship.trust > 60) {
    return addSuffix(originalResponse, getEuphoricSuffix());
  }

  // === HAPPY + GOOD RELATIONSHIP: warm response ===
  if (emotions.happiness > 65 && relationship.affection > 55) {
    return addSuffix(originalResponse, getWarmSuffix());
  }

  // === HIGH FEAR: timid response ===
  if (emotions.fear > 50) {
    return addPrefix(originalResponse, getFearPrefix());
  }

  return originalResponse;
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
