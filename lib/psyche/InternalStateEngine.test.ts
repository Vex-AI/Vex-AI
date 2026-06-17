import { describe, it, expect, vi } from 'vitest';
import { updateInternalState, checkInternalStateOverride } from './InternalStateEngine';
import type { InternalState, EmotionState, SentimentResult } from '@/types/psyche';
import { DEFAULT_EMOTIONS } from '@/types/psyche';

// Mock translation module
vi.mock('../translation', () => ({
  default: {
    t: (key: string) => key // just return the key for testing
  }
}));

describe('InternalStateEngine', () => {
  const baseState: InternalState = {
    energy: 100,
    stress: 0,
    boredom: 0,
    motivation: 100,
  };

  const baseEmotions: EmotionState = { ...DEFAULT_EMOTIONS };
  
  const neutralSentiment: SentimentResult = {
    valence: 0,
    arousal: 0,
    categories: [],
    impacts: {}
  };

  it('depletes energy based on message length', () => {
    const now = Date.now();
    // Short message
    const state1 = updateInternalState(baseState, baseEmotions, neutralSentiment, "oi", now);
    expect(state1.energy).toBeLessThan(100);
    expect(state1.energy).toBeGreaterThan(90);

    // Long message depletes more energy
    const longMsg = "a".repeat(500);
    const state2 = updateInternalState(baseState, baseEmotions, neutralSentiment, longMsg, now);
    expect(state2.energy).toBeLessThan(state1.energy);
  });

  it('recovers energy if sufficient time has passed', () => {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    
    const exhaustedState = { ...baseState, energy: 20 };
    const nextState = updateInternalState(exhaustedState, baseEmotions, neutralSentiment, "oi", oneHourAgo);
    
    // Energy recovered by 10 points for 1 hour, minus cost of "oi" (approx 2) -> 20 + 10 - 2.04 = 27.96
    expect(nextState.energy).toBeCloseTo(27.96);
  });

  it('increases stress on high arousal negative interactions', () => {
    const angrySentiment: SentimentResult = {
      valence: -0.8,
      arousal: 0.9,
      categories: ['threat'],
      impacts: {}
    };

    const nextState = updateInternalState(baseState, baseEmotions, angrySentiment, "te odeio", Date.now());
    expect(nextState.stress).toBeGreaterThan(0);
  });

  it('increases boredom on flat interactions', () => {
    const boringEmotions = { ...baseEmotions, curiosity: 10 };
    
    const nextState = updateInternalState(baseState, boringEmotions, neutralSentiment, "ok", Date.now());
    expect(nextState.boredom).toBe(5); // +5 for flat
  });

  it('checkInternalStateOverride returns appropriate override keys', () => {
    const exhausted = { ...baseState, energy: 10 };
    expect(checkInternalStateOverride(exhausted)).toBe('psyche_state_tired');

    const stressed = { ...baseState, stress: 90 };
    expect(checkInternalStateOverride(stressed)).toBe('psyche_state_stressed');

    const bored = { ...baseState, boredom: 90 };
    expect(checkInternalStateOverride(bored)).toBe('psyche_state_bored');

    const fine = { ...baseState, energy: 50, stress: 20, boredom: 20 };
    expect(checkInternalStateOverride(fine)).toBeNull();
  });
});
