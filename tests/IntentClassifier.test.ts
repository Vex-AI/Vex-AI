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
    const phrase = 'ola vex';
    const prediction = classifier.predict(phrase);
    console.log(`Intent Prediction (Exact/Fast-Path): "${phrase}" ->`, prediction);
    expect(prediction).not.toBeNull();
    expect(prediction?.intent).toBe('saudacao');
    expect(prediction?.confidence).toBeGreaterThan(0.8);
  });

  it('predicts intent correctly via hybrid TF-IDF (Cosine + Overlap)', async () => {
    await classifier.train();
    
    // Not an exact phrase, but uses keywords "tudo" and "bem"
    // "ola", "tudo", "bem" are tokens
    const phrase = 'vex, queria saber se está tudo bem com vc';
    const prediction = classifier.predict(phrase);
    
    console.log(`Intent Prediction (Hybrid Score): "${phrase}" ->`, prediction);
    expect(prediction).not.toBeNull();
    expect(prediction?.intent).toBe('saudacao');
    // Hybrid score should push it above threshold
  });

  it('returns null if confidence is below threshold', async () => {
    await classifier.train();
    
    // Completely unrelated phrase
    const phrase = 'paralelepipedo amarelo flutuante voador marte marte marte';
    const prediction = classifier.predict(phrase, 0.5);
    
    console.log(`Intent Prediction (Below Threshold): "${phrase}" ->`, prediction);
    expect(prediction).toBeNull();
  });
});
