import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as nlp from '../classes/nlp-util';

// Mock localStorage for the language tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

describe('NLP Utilities (nlp-util.ts)', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Use ptBR as default for most tests
    localStorageMock.setItem('language', 'ptBR');
  });

  describe('Tokenization & Cleaning (cleanAndTokenize)', () => {
    it('removes accents and converts to lowercase', () => {
      const tokens = nlp.cleanAndTokenize('AÇÃO Coração!');
      console.log('Original: "AÇÃO Coração!" -> Tokens:', tokens);
      expect(tokens).toContain('acao');
      expect(tokens).toContain('coracao');
    });

    it('filters out ptBR stop words', () => {
      const phrase = 'eu gosto de jogar bola na rua com o meu cachorro';
      const tokens = nlp.cleanAndTokenize(phrase);
      console.log(`Stopwords: "${phrase}" -> Tokens:`, tokens);
      // "de", "na", "com", "o", "meu" should be filtered out
      expect(tokens).not.toContain('de');
      expect(tokens).not.toContain('na');
      expect(tokens).not.toContain('com');
      expect(tokens).toContain('gosto');
      expect(tokens).toContain('jogar');
      expect(tokens).toContain('bola');
    });

    it('applies slang normalization', () => {
      const phrase = 'vc tbm acha q ta blz kd vc';
      const tokens = nlp.cleanAndTokenize(phrase);
      console.log(`Gírias: "${phrase}" -> Tokens:`, tokens);
      // vc -> voce
      // tbm -> tambem
      // q -> que (will be removed as stop word)
      // blz -> beleza
      // kd -> cade
      expect(tokens).toContain('voce');
      expect(tokens).toContain('tambem');
      expect(tokens).toContain('beleza');
      expect(tokens).toContain('cade');
      expect(tokens).not.toContain('vc');
      expect(tokens).not.toContain('blz');
    });

    it('removes punctuation and kaomojis', () => {
      const phrase = 'olá! tudo bem? (´• ω •`) ¯\\_(ツ)_/¯';
      const tokens = nlp.cleanAndTokenize(phrase);
      console.log(`Kaomojis Limpos: "${phrase}" -> Tokens:`, tokens);
      expect(tokens).toContain('tudo');
      expect(tokens).toContain('bem');
      expect(tokens).not.toContain('´•');
      expect(tokens).not.toContain('ω');
      expect(tokens).not.toContain('ツ');
    });

    it('generates n-grams (bigrams)', () => {
      const phrase = 'abrir conta banco';
      const tokens = nlp.cleanAndTokenize(phrase);
      console.log(`N-grams: "${phrase}" -> Tokens:`, tokens);
      expect(tokens).toContain('abrir_conta');
      expect(tokens).toContain('conta_banco');
    });
  });

  describe('Stemmer', () => {
    it('stems Portuguese gerunds correctly', () => {
      // ando -> ar, endo -> er, indo -> ir
      console.log('Stemmer PT-BR Gerúndio: "jogando" ->', nlp.cleanAndTokenize('jogando'));
      console.log('Stemmer PT-BR Gerúndio: "correndo" ->', nlp.cleanAndTokenize('correndo'));
      expect(nlp.cleanAndTokenize('jogando')).toContain('jogar');
      expect(nlp.cleanAndTokenize('correndo')).toContain('correr');
      expect(nlp.cleanAndTokenize('sorrindo')).toContain('sorrir');
    });

    it('stems Portuguese plurals and adverbs correctly', () => {
      expect(nlp.cleanAndTokenize('corações')).toContain('coracao');
      expect(nlp.cleanAndTokenize('certamente')).toContain('certa');
    });

    it('handles English stemming', () => {
      localStorageMock.setItem('language', 'enUS');
      const tokens = nlp.cleanAndTokenize('running quickly jumps');
      expect(tokens).toContain('runn');
      expect(tokens).toContain('quick');
      expect(tokens).toContain('jump');
    });
  });

  describe('Levenshtein Distance', () => {
    it('calculates the exact distance between two strings', () => {
      const tests = [
        {a: 'gatinho', b: 'gatinho', expected: 0},
        {a: 'gato', b: 'gatoo', expected: 1}, // 1 insertion
        {a: 'gato', b: 'gata', expected: 1}, // 1 substitution
        {a: 'gato', b: 'ga', expected: 2}, // 2 deletions
        {a: 'kitten', b: 'sitting', expected: 3} // classic example
      ];
      
      for (const t of tests) {
        const dist = nlp.levenshtein(t.a, t.b);
        console.log(`Levenshtein Distance: "${t.a}" vs "${t.b}" = ${dist}`);
        expect(dist).toBe(t.expected);
      }
    });
  });

  describe('Cosine Similarity', () => {
    it('calculates perfect similarity for identical vectors', () => {
      const vecA = new Map([['a', 1], ['b', 1]]);
      const vecB = new Map([['a', 1], ['b', 1]]);
      const mag = Math.sqrt(2);
      expect(nlp.cosineSimilarity(vecA, vecB, mag, mag)).toBeCloseTo(1, 5);
    });

    it('calculates zero similarity for orthogonal vectors', () => {
      const vecA = new Map([['a', 1]]);
      const vecB = new Map([['b', 1]]);
      const mag = 1;
      expect(nlp.cosineSimilarity(vecA, vecB, mag, mag)).toBe(0);
    });

    it('calculates partial similarity', () => {
      const vecA = new Map([['a', 1], ['b', 1]]); // mag: sqrt(2)
      const vecB = new Map([['a', 1]]);           // mag: 1
      const magA = Math.sqrt(2);
      const magB = 1;
      // Dot product: 1*1 = 1.
      // Magnitude product: sqrt(2) * 1 = 1.414
      // Similarity: 1 / 1.414 = 0.707
      const sim = nlp.cosineSimilarity(vecA, vecB, magA, magB);
      console.log(`Cosine Similarity: vecA(a=1,b=1) vs vecB(a=1) = ${sim.toFixed(4)}`);
      expect(sim).toBeCloseTo(0.7071, 4);
    });
  });

  describe('TF-IDF & preprocessSynons', () => {
    it('calculates magnitudes correctly for preprocessed synons', () => {
      const synons = [
        { id: "1", word: ["criar conta", "fazer registro"], reply: ["Siga as instruções..."] },
        { id: "2", word: ["esqueci senha", "recuperar acesso"], reply: ["Clique em recuperar..."] }
      ];

      const { processed, idf } = nlp.preprocessSynons(synons);
      
      expect(processed.length).toBe(2);
      expect(processed[0].id).toBe("1");
      expect(processed[0].vector.size).toBeGreaterThan(0);
      expect(processed[0].magnitude).toBeGreaterThan(0);
      
      // Both "criar" and "conta" should have IDF weights calculated
      expect(idf.size).toBeGreaterThan(0);
    });
  });
});
