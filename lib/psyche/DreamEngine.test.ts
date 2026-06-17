import { describe, it, expect, vi } from 'vitest';
import { checkShouldDream, getDreamCategory, getTimeSleepingText } from './DreamEngine';
import type { VexPsycheState } from '@/types/psyche';
import { DEFAULT_EMOTIONS, DEFAULT_RELATIONSHIP, DEFAULT_INTERNAL_STATE, Mood } from '@/types/psyche';

// Mock translation module
vi.mock('../translation', () => ({
  default: {
    language: 'ptBR'
  }
}));

function createMockState(overrides: Partial<VexPsycheState> = {}): VexPsycheState {
  return {
    id: 1,
    emotions: { ...DEFAULT_EMOTIONS },
    mood: Mood.NEUTRAL,
    personality: { patience: 50, empathy: 50, forgiveness: 50, confidence: 50, sociability: 50, humor: 50 },
    relationship: { ...DEFAULT_RELATIONSHIP },
    internalState: { ...DEFAULT_INTERNAL_STATE },
    emotionHistory: [],
    lastInteraction: Date.now(),
    totalInteractions: 0,
    ...overrides,
  };
}

describe('DreamEngine', () => {
  describe('checkShouldDream', () => {
    it('returns false if less than 6 hours have passed', () => {
      const threeHoursAgo = Date.now() - 3 * 60 * 60 * 1000;
      expect(checkShouldDream(threeHoursAgo)).toBe(false);
    });

    it('returns true if 6+ hours have passed', () => {
      const eightHoursAgo = Date.now() - 8 * 60 * 60 * 1000;
      expect(checkShouldDream(eightHoursAgo)).toBe(true);
    });

    it('returns true at exactly 6 hours', () => {
      const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000;
      expect(checkShouldDream(sixHoursAgo)).toBe(true);
    });

    it('returns false for very recent interaction', () => {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      expect(checkShouldDream(fiveMinutesAgo)).toBe(false);
    });
  });

  describe('getDreamCategory', () => {
    it('returns "stressed" when stress is high', () => {
      const state = createMockState({
        internalState: { ...DEFAULT_INTERNAL_STATE, stress: 80 }
      });
      expect(getDreamCategory(state)).toBe('stressed');
    });

    it('returns "tired" when energy is critically low', () => {
      const state = createMockState({
        internalState: { ...DEFAULT_INTERNAL_STATE, energy: 10, stress: 20 }
      });
      expect(getDreamCategory(state)).toBe('tired');
    });

    it('returns "bored" when boredom is high', () => {
      const state = createMockState({
        internalState: { ...DEFAULT_INTERNAL_STATE, boredom: 80, stress: 20, energy: 50 }
      });
      expect(getDreamCategory(state)).toBe('bored');
    });

    it('returns "trusting" when trust is high', () => {
      const state = createMockState({
        relationship: { ...DEFAULT_RELATIONSHIP, trust: 90 },
        internalState: { ...DEFAULT_INTERNAL_STATE, stress: 20, energy: 50, boredom: 20 }
      });
      expect(getDreamCategory(state)).toBe('trusting');
    });

    it('returns "happy" when happiness is high', () => {
      const state = createMockState({
        emotions: { ...DEFAULT_EMOTIONS, happiness: 85 },
        internalState: { ...DEFAULT_INTERNAL_STATE, stress: 20, energy: 50, boredom: 20 }
      });
      expect(getDreamCategory(state)).toBe('happy');
    });

    it('returns "neutral" by default', () => {
      const state = createMockState();
      expect(getDreamCategory(state)).toBe('neutral');
    });

    it('prioritizes stress over everything else', () => {
      const state = createMockState({
        internalState: { ...DEFAULT_INTERNAL_STATE, stress: 90, energy: 10, boredom: 90 },
        emotions: { ...DEFAULT_EMOTIONS, happiness: 90 },
        relationship: { ...DEFAULT_RELATIONSHIP, trust: 90 }
      });
      expect(getDreamCategory(state)).toBe('stressed');
    });
  });

  describe('getTimeSleepingText', () => {
    it('returns long sleep text for 48+ hours', () => {
      const twoDaysAgo = Date.now() - 50 * 60 * 60 * 1000;
      expect(getTimeSleepingText(twoDaysAgo)).toBe('Dormi por dias, parece...');
    });

    it('returns full day text for 24+ hours', () => {
      const oneDayAgo = Date.now() - 25 * 60 * 60 * 1000;
      expect(getTimeSleepingText(oneDayAgo)).toBe('Dormi o dia inteiro...');
    });

    it('returns moderate text for 12+ hours', () => {
      const halfDayAgo = Date.now() - 14 * 60 * 60 * 1000;
      expect(getTimeSleepingText(halfDayAgo)).toBe('Nossa, dormi bastante...');
    });

    it('returns short text for < 12 hours', () => {
      const sevenHoursAgo = Date.now() - 7 * 60 * 60 * 1000;
      expect(getTimeSleepingText(sevenHoursAgo)).toBe('Dormi umas boas horas...');
    });
  });
});
