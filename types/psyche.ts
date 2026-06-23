// types/psyche.ts — VexPsyche Type System

// ═══════════════════════════════════════════════════
// LAYER 1: Immediate Emotions (short-term)
// ═══════════════════════════════════════════════════

export interface EmotionState {
  happiness: number;   // 0–100
  sadness: number;
  anger: number;
  fear: number;
  trust: number;
  curiosity: number;
}

export const DEFAULT_EMOTIONS: EmotionState = {
  happiness: 50,
  sadness: 0,
  anger: 0,
  fear: 0,
  trust: 50,
  curiosity: 30,
};

// ═══════════════════════════════════════════════════
// LAYER 2: Mood (medium-term)
// ═══════════════════════════════════════════════════

export enum Mood {
  EUPHORIC = "EUPHORIC",
  HAPPY = "HAPPY",
  CONTENT = "CONTENT",
  NEUTRAL = "NEUTRAL",
  MELANCHOLIC = "MELANCHOLIC",
  SAD = "SAD",
  ANGRY = "ANGRY",
  DEPRESSED = "DEPRESSED",
  ANXIOUS = "ANXIOUS",
}

// ═══════════════════════════════════════════════════
// LAYER 3: Personality (long-term, randomized per user)
// ═══════════════════════════════════════════════════

export interface Personality {
  patience: number;      // 0–100
  empathy: number;
  forgiveness: number;
  confidence: number;
  sociability: number;
  humor: number;         // sense of humor
}

// ═══════════════════════════════════════════════════
// LAYER 4: Emotional Memories
// ═══════════════════════════════════════════════════

export interface EmotionalMemory {
  id?: number;
  event: string;
  emotionType: string;
  intensity: number;       // 0–100
  triggerWords: string[];
  date: number;
}

// ═══════════════════════════════════════════════════
// LAYER 5: Relationship
// ═══════════════════════════════════════════════════

export interface Relationship {
  affection: number;   // 0–100
  respect: number;
  trust: number;
  attachment: number;
}

export const DEFAULT_RELATIONSHIP: Relationship = {
  affection: 40,
  respect: 50,
  trust: 40,
  attachment: 10,
};

// ═══════════════════════════════════════════════════
// LAYER 6: Traumas
// ═══════════════════════════════════════════════════

export interface Trauma {
  id?: number;
  triggerWord: string;
  occurrences: number;
  lastOccurrence: number;
  emotionalImpact: number; // 0–100
}

// ═══════════════════════════════════════════════════
// LAYER 7: Internal States
// ═══════════════════════════════════════════════════

export interface InternalState {
  energy: number;      // 0–100
  stress: number;
  boredom: number;
  motivation: number;
}

export const DEFAULT_INTERNAL_STATE: InternalState = {
  energy: 80,
  stress: 10,
  boredom: 0,
  motivation: 70,
};

// ═══════════════════════════════════════════════════
// SENTIMENT ANALYSIS
// ═══════════════════════════════════════════════════

export interface SentimentImpact {
  happiness?: number;
  sadness?: number;
  anger?: number;
  fear?: number;
  trust?: number;
  curiosity?: number;
}

export interface SentimentCategory {
  words: string[];
  impact: SentimentImpact;
}

export interface SentimentLexicon {
  [category: string]: SentimentCategory;
}

export interface SentimentResult {
  valence: number;       // -1.0 to +1.0 (negative to positive)
  arousal: number;       // 0 to 1.0 (calm to intense)
  categories: string[];  // matched category names
  impacts: SentimentImpact;  // aggregated emotional impacts
}

// ═══════════════════════════════════════════════════
// FULL PSYCHE STATE (persisted)
// ═══════════════════════════════════════════════════

export interface VexPsycheState {
  id: number;                     // always 1 (singleton)
  emotions: EmotionState;
  mood: Mood;
  personality: Personality;
  relationship: Relationship;
  internalState: InternalState;
  emotionHistory: EmotionState[]; // last N snapshots for mood calculation
  lastInteraction: number;        // timestamp
  totalInteractions: number;
}
