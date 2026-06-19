import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IntentClassifier } from '../classes/IntentClassifier';

// Mock dependencies
vi.mock('@/lib/vexDB', () => {
  return {
    db: {
      intents: {
        toArray: vi.fn().mockResolvedValue([
          {
            name: 'saudacao',
            trainingPhrases: ['ola vex', 'bom dia', 'tudo bem'],
            responses: ['Olá!', 'Tudo ótimo por aqui!']
          },
          {
            name: 'despedida',
            trainingPhrases: ['tchau', 'ate logo', 'ate mais'],
            responses: ['Até a próxima!']
          }
        ])
      }
    }
  };
});

describe('IntentClassifier', () => {
  let classifier: IntentClassifier;

  beforeEach(() => {
    vi.clearAllMocks();
    classifier = new IntentClassifier();
    
    // We need to mock localStorage for language detection
    vi.stubGlobal('localStorage', {
      getItem: () => 'ptBR',
      setItem: () => {},
      clear: () => {}
    });
  });

  it('trains successfully using mock database', async () => {
    await classifier.train();
    // It should log training complete but we can test predict
    expect(classifier['isTrained']).toBe(true);
    expect(classifier['processedIntents'].length).toBe(2);
  });

  it('predicts intent correctly via exact match (Levenshtein fast-path)', async () => {
    await classifier.train();
    
    // Exact match or close typo
    const prediction = classifier.predict('ola vex');
    expect(prediction).not.toBeNull();
    expect(prediction?.intent).toBe('saudacao');
    expect(prediction?.confidence).toBeGreaterThan(0.8);
  });

  it('predicts intent correctly via hybrid TF-IDF (Cosine + Overlap)', async () => {
    await classifier.train();
    
    // Not an exact phrase, but uses keywords "tudo" and "bem"
    // "ola", "tudo", "bem" are tokens
    const prediction = classifier.predict('vex, queria saber se está tudo bem com vc');
    
    expect(prediction).not.toBeNull();
    expect(prediction?.intent).toBe('saudacao');
    // Hybrid score should push it above threshold
  });

  it('returns null if confidence is below threshold', async () => {
    await classifier.train();
    
    // Completely unrelated phrase
    const prediction = classifier.predict('paralelepipedo amarelo flutuante voador marte marte marte', 0.5);
    
    expect(prediction).toBeNull();
  });
});
