// lib/psyche/VexPsyche.ts — Central Orchestrator
import { db } from "../vexDB";
import { analyzeSentiment } from "./SentimentAnalyzer";
import { useAchievementStore } from "@/store/achievementStore";
import { applyStimulus, decayEmotions, timeDecay, emotionToEmoji } from "./EmotionEngine";
import { calculateMood, trimHistory, getMoodEmoji } from "./MoodEngine";
import { generateRandomPersonality, evolvePersonality } from "./PersonalityEngine";
import { updateRelationship } from "./RelationshipEngine";
import { recordIfSignificant, recallRelevantMemory } from "./MemoryEngine";
import { checkTrauma, checkTrigger } from "./TraumaDetector";
import { updateInternalState, checkInternalStateOverride } from "./InternalStateEngine";
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
  state.relationship = updateRelationship(state.relationship, sentiment.valence);

  // 8. Evolve personality (only every ~50 interactions)
  state.totalInteractions++;
  state.personality = evolvePersonality(
    state.personality,
    state.relationship,
    state.totalInteractions
  );

  // 9. Process Phase 2: Memories and Traumas
  await recordIfSignificant(userMessage, sentiment);
  await checkTrauma(userMessage, sentiment.categories);

  // 10. Process Phase 3: Internal States
  state.internalState = updateInternalState(
    state.internalState,
    state.emotions,
    sentiment,
    userMessage,
    state.lastInteraction
  );

  // 11. Update timestamps
  state.lastInteraction = Date.now();

  // 12. Persist
  cachedState = state;
  try {
    await db.psycheState.put(state);
  } catch {
    // Silently fail if DB not ready
  }

  // 13. Achievement triggers
  try {
    const { unlockBadge } = useAchievementStore.getState();
    if (state.internalState.stress >= 95) unlockBadge("ruthless_villain");
    if (state.internalState.boredom >= 100) unlockBadge("monk_patience");
    if (state.internalState.energy <= 0) unlockBadge("dead_battery");
    if (state.relationship.trust >= 100) unlockBadge("unbreakable_bond");
    if (state.totalInteractions >= 500) unlockBadge("chatterbox");
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 6) unlockBadge("early_bird");
  } catch {
    // Achievement store might not be ready
  }
}

/**
 * Modify a response based on Vex's current psychological state.
 */
export async function applyPsycheToResponse(
  originalResponse: string,
  userMessage: string,
  isGeminiResponse: boolean = false
): Promise<string> {
  const state = await initialize();
  const sentiment = await analyzeSentiment(userMessage);

  // Check if this message triggered a trauma
  const traumaContext = await checkTrigger(userMessage);
  
  // Check if we should recall a memory
  const memoryContext = await recallRelevantMemory(sentiment.categories);

  // Check Phase 3: internal state overriding the response
  const internalOverride = checkInternalStateOverride(state.internalState);

  // Relieve the negative state if she expressed it (venting mechanism)
  // This prevents her from continuously complaining on every message
  if (internalOverride) {
    let stateChanged = false;
    if (state.internalState.energy < 15) {
      state.internalState.energy += 40;
      stateChanged = true;
    }
    if (state.internalState.stress > 85) {
      state.internalState.stress -= 40;
      stateChanged = true;
    }
    if (state.internalState.boredom > 85) {
      state.internalState.boredom -= 40;
      stateChanged = true;
    }
    
    if (stateChanged) {
      try {
        await db.psycheState.put(state);
      } catch {}
    }
  }

  return modifyResponse(originalResponse, state, memoryContext, traumaContext, internalOverride, isGeminiResponse);
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

/**
 * Apply manual state changes requested by the Gemini LLM.
 */
export async function applyGeminiStateChange(changes: Record<string, number>): Promise<void> {
  const state = await initialize();
  let stateChanged = false;

  if (typeof changes.energy === "number") {
    state.internalState.energy = Math.max(0, Math.min(100, changes.energy));
    stateChanged = true;
  }
  if (typeof changes.stress === "number") {
    state.internalState.stress = Math.max(0, Math.min(100, changes.stress));
    stateChanged = true;
  }
  if (typeof changes.boredom === "number") {
    state.internalState.boredom = Math.max(0, Math.min(100, changes.boredom));
    stateChanged = true;
  }
  if (typeof changes.motivation === "number") {
    state.internalState.motivation = Math.max(0, Math.min(100, changes.motivation));
    stateChanged = true;
  }
  if (typeof changes.affection === "number") {
    state.relationship.affection = Math.max(0, Math.min(100, changes.affection));
    stateChanged = true;
  }
  if (typeof changes.trust === "number") {
    state.relationship.trust = Math.max(0, Math.min(100, changes.trust));
    stateChanged = true;
  }
  if (typeof changes.respect === "number") {
    state.relationship.respect = Math.max(0, Math.min(100, changes.respect));
    stateChanged = true;
  }
  if (typeof changes.happiness === "number") {
    state.emotions.happiness = Math.max(0, Math.min(100, changes.happiness));
    stateChanged = true;
  }
  if (typeof changes.sadness === "number") {
    state.emotions.sadness = Math.max(0, Math.min(100, changes.sadness));
    stateChanged = true;
  }
  if (typeof changes.anger === "number") {
    state.emotions.anger = Math.max(0, Math.min(100, changes.anger));
    stateChanged = true;
  }
  if (typeof changes.fear === "number") {
    state.emotions.fear = Math.max(0, Math.min(100, changes.fear));
    stateChanged = true;
  }
  if (typeof changes.curiosity === "number") {
    state.emotions.curiosity = Math.max(0, Math.min(100, changes.curiosity));
    stateChanged = true;
  }

  if (stateChanged) {
    cachedState = state;
    try {
      await db.psycheState.put(state);
    } catch {}
  }
}

