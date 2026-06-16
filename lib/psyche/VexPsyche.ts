// lib/psyche/VexPsyche.ts — Central Orchestrator
import { db } from "../vexDB";
import { analyzeSentiment } from "./SentimentAnalyzer";
import { applyStimulus, decayEmotions, timeDecay, emotionToEmoji } from "./EmotionEngine";
import { calculateMood, trimHistory, getMoodEmoji } from "./MoodEngine";
import { generateRandomPersonality, evolvePersonality } from "./PersonalityEngine";
import { modifyResponse } from "./ResponseModifier";
import {
  DEFAULT_EMOTIONS,
  DEFAULT_RELATIONSHIP,
  DEFAULT_INTERNAL_STATE,
  Mood,
} from "@/types/psyche";
import type { VexPsycheState } from "@/types/psyche";

let cachedState: VexPsycheState | null = null;

/**
 * Get the default initial state — with a RANDOM personality unique to this user.
 */
function createDefaultState(): VexPsycheState {
  return {
    id: 1,
    emotions: { ...DEFAULT_EMOTIONS },
    mood: Mood.NEUTRAL,
    personality: generateRandomPersonality(),
    relationship: { ...DEFAULT_RELATIONSHIP },
    internalState: { ...DEFAULT_INTERNAL_STATE },
    emotionHistory: [],
    lastInteraction: Date.now(),
    totalInteractions: 0,
  };
}

/**
 * Initialize: load state from IndexedDB or create a fresh one.
 */
export async function initialize(): Promise<VexPsycheState> {
  if (cachedState) return cachedState;

  try {
    const stored = await db.psycheState.get(1);
    if (stored) {
      cachedState = stored;
      return stored;
    }
  } catch {
    // Table might not exist yet during migration
  }

  const fresh = createDefaultState();
  try {
    await db.psycheState.put(fresh);
  } catch {
    // Silently fail if table not ready
  }
  cachedState = fresh;
  return fresh;
}

/**
 * The main pipeline. Called for every user message BEFORE generating a response.
 *
 * 1. Load state
 * 2. Apply time decay (if user was away)
 * 3. Analyze sentiment of user's message
 * 4. Apply stimulus to emotions
 * 5. Apply natural decay
 * 6. Calculate mood from history
 * 7. Update relationship
 * 8. Evolve personality (very slowly)
 * 9. Save everything
 */
export async function processMessage(userMessage: string): Promise<void> {
  const state = await initialize();

  // 1. Time decay (emotions reset if user was away for hours)
  state.emotions = timeDecay(state.emotions, state.lastInteraction);

  // 2. Analyze sentiment
  const sentiment = await analyzeSentiment(userMessage);

  // 3. Apply emotional stimulus
  state.emotions = applyStimulus(state.emotions, sentiment);

  // 4. Natural decay toward baseline
  state.emotions = decayEmotions(state.emotions);

  // 5. Record snapshot in history
  state.emotionHistory.push({ ...state.emotions });
  state.emotionHistory = trimHistory(state.emotionHistory);

  // 6. Calculate mood from history
  state.mood = calculateMood(state.emotions, state.emotionHistory);

  // 7. Update relationship based on sentiment
  updateRelationship(state, sentiment.valence);

  // 8. Evolve personality (only every ~50 interactions)
  state.totalInteractions++;
  state.personality = evolvePersonality(
    state.personality,
    state.relationship,
    state.totalInteractions
  );

  // 9. Update timestamps
  state.lastInteraction = Date.now();

  // 10. Persist
  cachedState = state;
  try {
    await db.psycheState.put(state);
  } catch {
    // Silently fail if DB not ready
  }
}

/**
 * Modify a response based on Vex's current psychological state.
 */
export async function applyPsycheToResponse(originalResponse: string): Promise<string> {
  const state = await initialize();
  return modifyResponse(originalResponse, state);
}

/**
 * Get the current emoji code for the header avatar.
 */
export async function getEmoji(): Promise<string> {
  const state = await initialize();
  return emotionToEmoji(state.emotions);
}

/**
 * Get the mood emoji for the mood indicator.
 */
export async function getMoodIndicator(): Promise<{ mood: Mood; emoji: string }> {
  const state = await initialize();
  return {
    mood: state.mood,
    emoji: getMoodEmoji(state.mood),
  };
}

/**
 * Get full state (for UI display).
 */
export async function getState(): Promise<VexPsycheState> {
  return initialize();
}

// ─── Internal helpers ───────────────────────────

function updateRelationship(state: VexPsycheState, valence: number): void {
  const delta = valence * 3; // small incremental changes
  const r = state.relationship;

  r.affection = clamp(r.affection + delta * 0.8);
  r.respect = clamp(r.respect + delta * 0.5);
  r.trust = clamp(r.trust + delta * 0.6);
  r.attachment = clamp(r.attachment + Math.abs(delta) * 0.1); // any interaction increases attachment slightly
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}
