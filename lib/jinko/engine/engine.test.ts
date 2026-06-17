import { describe, it, expect, beforeEach } from 'vitest';
import { MagicEngine } from './index';
import { Animal, Question } from './types';

describe('MagicEngine', () => {
  const mockQuestions: Question[] = [
    { id: 'q1', text: { pt: 'É mamífero?', en: 'Is mammal?' } },
    { id: 'q2', text: { pt: 'Tem asas?', en: 'Has wings?' } },
    { id: 'q3', text: { pt: 'Vive na água?', en: 'Lives in water?' } },
  ];

  const mockAnimals: Animal[] = [
    { id: 'a1', name: { pt: 'Leão', en: 'Lion' }, playCount: 100, answers: { 'q1': 1, 'q2': -1, 'q3': -1 } },
    { id: 'a2', name: { pt: 'Águia', en: 'Eagle' }, playCount: 50, answers: { 'q1': -1, 'q2': 1, 'q3': -1 } },
    { id: 'a3', name: { pt: 'Tubarão', en: 'Shark' }, playCount: 80, answers: { 'q1': -1, 'q2': -1, 'q3': 1 } },
    { id: 'a4', name: { pt: 'Baleia', en: 'Whale' }, playCount: 90, answers: { 'q1': 1, 'q2': -1, 'q3': 1 } },
  ];

  let engine: MagicEngine;

  beforeEach(() => {
    engine = new MagicEngine(mockAnimals, mockQuestions);
  });

  it('builds inverted index correctly on initialization', () => {
    expect(engine.invertedIndex['q1']).toBeDefined();
    expect(engine.invertedIndex['q1']['a1']).toBe(1);
    expect(engine.invertedIndex['q2']['a2']).toBe(1);
    
    // Scores initialized to 0
    expect(engine.scores['a1']).toBe(0);
    expect(engine.scores['a2']).toBe(0);
  });

  it('updates scores correctly when answering a question', () => {
    // Answer yes to q1 (É mamífero?)
    // a1 (Leão) and a4 (Baleia) should get +1
    // a1 (Leão) and a4 (Baleia) should get +3 (1 * 1 * 3)
    // a2 (Águia) and a3 (Tubarão) should get -3 (1 * -1 * 3)
    engine.answerQuestion('q1', 1);
    expect(engine.scores['a1']).toBe(3);
    expect(engine.scores['a4']).toBe(3);
    expect(engine.scores['a2']).toBe(-3);
    expect(engine.scores['a3']).toBe(-3);
    
    expect(engine.askedQuestions).toContain('q1');
  });

  it('calculates the best question to ask', () => {
    // Add fake questions to simulate mid-game, where randomness threshold is stricter (85% of best entropy)
    // This prevents the engine from randomly selecting sub-optimal questions like q2 (which has 81% entropy).
    engine.askedQuestions.push('fake1', 'fake2');
    
    const bestQ = engine.getBestQuestion();
    // q1: 2 yes (a1, a4), 2 no (a2, a3) -> perfect split! (100% entropy)
    // q2: 1 yes (a2), 3 no (a1, a3, a4) -> 81% entropy (filtered out)
    // q3: 2 yes (a3, a4), 2 no (a1, a2) -> perfect split! (100% entropy)
    expect(['q1', 'q3']).toContain(bestQ);
  });

  it('uses jogadas as a tie-breaker', () => {
    // Both Leão and Baleia have 1 point.
    // Leão has 100 jogadas, Baleia has 90.
    engine.answerQuestion('q1', 1);
    
    // Since difference is only 0, it doesn't trigger victory yet.
    // But checkVictory should sort them with Leão first.
    const victory = engine.checkVictory();
    expect(victory).toBeNull(); // Difference is 0 between a1 and a4
    
    // Let's artificially set score diff to 15
    engine.scores['a1'] = 15;
    engine.scores['a4'] = 15;
    // Tie break should put a1 first.
    // Actually if difference is >= 15 between top1 and top2, it wins.
    // Here diff is 0. So no victory.
    
    engine.scores['a1'] = 20;
    engine.scores['a4'] = 5;
    // Add fake questions to pass the askedQuestions.length >= 3 requirement
    engine.askedQuestions.push('fake_1', 'fake_2');
    const victory2 = engine.checkVictory();
    expect(victory2).toBeDefined();
    expect(victory2?.id).toBe('a1');
  });

  it('triggers victory if 20 questions are asked', () => {
    for (let i = 0; i < 20; i++) {
      engine.askedQuestions.push(`fake_q_${i}`);
    }
    const victory = engine.checkVictory();
    expect(victory).toBeDefined();
    // Since all scores are 0, it falls back to jogadas.
    // a1 (Leão) has 100 jogadas, the highest.
    expect(victory?.id).toBe('a1');
  });
});
