import { describe, it, expect } from 'vitest';
import { applyStimulus, decayEmotions, timeDecay, emotionToEmoji, getDominantEmotion } from './EmotionEngine';
import type { EmotionState, SentimentResult } from '@/types/psyche';
import { DEFAULT_EMOTIONS } from '@/types/psyche';

describe('EmotionEngine', () => {
  const neutralState: EmotionState = { ...DEFAULT_EMOTIONS };

  it('applyStimulus respects 0-100 clamps', () => {
    const sentiment: SentimentResult = {
      valence: 1,
      arousal: 1,
      categories: ['praise'],
      impacts: { happiness: 200, sadness: -200 }
    };
    
    const nextState = applyStimulus(neutralState, sentiment);
    
    expect(nextState.happiness).toBe(100); // Clamped to 100
    expect(nextState.sadness).toBe(0);     // Clamped to 0
    expect(nextState.fear).toBe(DEFAULT_EMOTIONS.fear); // Unchanged
  });

  it('decayEmotions moves values towards their baseline', () => {
    const extremeState: EmotionState = {
      happiness: 100, // baseline is 50
      sadness: 100,   // baseline is 0
      anger: 100,     // baseline is 0
      fear: 100,      // baseline is 0
      trust: 100,     // baseline is 50
      curiosity: 100  // baseline is 0
    };

    const decayed = decayEmotions(extremeState, 0.1);
    
    // 100 + (50 - 100) * 0.1 = 95
    expect(decayed.happiness).toBeCloseTo(95);
    // 100 + (0 - 100) * 0.1 = 90
    expect(decayed.sadness).toBeCloseTo(90);
  });

  it('timeDecay applies larger decay for longer absences', () => {
    const extremeState: EmotionState = { ...DEFAULT_EMOTIONS, anger: 100 };
    
    // 10 minutes ago - less than 30m, no extra decay
    const now = Date.now();
    const shortDecay = timeDecay(extremeState, now - 10 * 60 * 1000);
    expect(shortDecay.anger).toBe(100);

    // 10 hours ago - heavy decay
    const longDecay = timeDecay(extremeState, now - 10 * 60 * 60 * 1000);
    expect(longDecay.anger).toBeLessThan(100);
  });

  it('getDominantEmotion returns the emotion with highest deviation from baseline', () => {
    const state: EmotionState = {
      ...DEFAULT_EMOTIONS,
      happiness: 55, // deviation 5 (from 50)
      anger: 80      // deviation 80 (from 0)
    };
    
    const dominant = getDominantEmotion(state);
    expect(dominant.name).toBe('anger');
    expect(dominant.value).toBe(80);
  });

  it('emotionToEmoji returns correct Noto code for strong emotions', () => {
    const angryState: EmotionState = { ...DEFAULT_EMOTIONS, anger: 90 };
    expect(emotionToEmoji(angryState)).toBe('1f621'); // 😡
    
    const sadState: EmotionState = { ...DEFAULT_EMOTIONS, sadness: 80 };
    expect(emotionToEmoji(sadState)).toBe('1f62d'); // 😭
    
    const neutral: EmotionState = { ...DEFAULT_EMOTIONS };
    expect(emotionToEmoji(neutral)).toBe('1f604'); // 😄 (baseline happiness is 50)
  });
});
