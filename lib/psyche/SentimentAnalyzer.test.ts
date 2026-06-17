import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeSentiment } from './SentimentAnalyzer';

// Mock translation module so we can force "ptBR" language
vi.mock('../translation', () => ({
  default: {
    language: 'ptBR'
  }
}));

describe('SentimentAnalyzer', () => {
  it('normalizes text and ignores case and diacritics', async () => {
    // "boba", "chata" are in insults_light
    const result1 = await analyzeSentiment('VOCÊ É BOBÁ E CHÃTÁ!');
    const result2 = await analyzeSentiment('voce e boba e chata');
    
    expect(result1.categories).toContain('insults_light');
    expect(result2.categories).toContain('insults_light');
    expect(result1.impacts.anger).toBeGreaterThan(0);
  });

  it('detects multiple categories in the same text', async () => {
    // "oi" -> greeting, "linda" -> praise
    const result = await analyzeSentiment('oi linda');
    expect(result.categories).toContain('greeting');
    expect(result.categories).toContain('praise');
    
    // Happiness should accumulate
    expect(result.impacts.happiness).toBe(40); // 10 (greeting) + 30 (praise)
  });

  it('multiplies impact when intensifiers are used', async () => {
    // "fofa" -> praise (happiness 30)
    const normal = await analyzeSentiment('fofa');
    // "muito" -> intensifier 1.5x -> 30 * 1.5 = 45
    const intense = await analyzeSentiment('muito fofa');
    
    expect(normal.impacts.happiness).toBe(30);
    expect(intense.impacts.happiness).toBe(45);
  });

  it('halves and flips impact when negation is used', async () => {
    // "boba" -> insult_light (anger 10)
    const normal = await analyzeSentiment('boba');
    // "nao" -> negation (-0.5 multiplier) -> 10 * -0.5 = -5
    const negated = await analyzeSentiment('não sou boba');
    
    expect(normal.impacts.anger).toBe(10);
    expect(negated.impacts.anger).toBe(-5);
  });

  it('calculates valence correctly (-1 to 1)', async () => {
    // Pure praise (positive)
    const pos = await analyzeSentiment('linda incrível'); 
    expect(pos.valence).toBeGreaterThan(0);
    
    // Pure insult (negative)
    const neg = await analyzeSentiment('idiota inútil');
    expect(neg.valence).toBeLessThan(0);
  });

  it('calculates arousal based on absolute intensity', async () => {
    const normal = await analyzeSentiment('boba');
    const extreme = await analyzeSentiment('extremamente idiota inútil lixo');
    
    // Arousal should be higher for more intense emotion words
    expect(extreme.arousal).toBeGreaterThan(normal.arousal);
  });
});
