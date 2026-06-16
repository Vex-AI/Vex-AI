import { Animal, Question, InvertedIndex } from "./types";

export class MagicEngine {
  public invertedIndex: InvertedIndex;
  public scores: Record<string, number>;
  public askedQuestions: string[];
  public animals: Animal[];
  public questions: Question[];

  // Mapa de perguntas correlacionadas: se uma já foi respondida de forma
  // forte, as correlatas têm menor prioridade.
  private static CORRELATED_GROUPS: string[][] = [
    ['q1', 'q2', 'q3', 'q4'],   // mamífero, ave, réptil, inseto — são mutuamente exclusivos
    ['q13', 'q14'],               // tem pelo vs tem pena — normalmente um exclui o outro
    ['q5', 'q10'],                // voa vs quatro patas — forte correlação inversa
  ];

  constructor(animals: Animal[], questions: Question[]) {
    this.animals = animals;
    this.questions = questions;
    this.askedQuestions = [];
    this.scores = {};
    this.invertedIndex = {};

    // Build InvertedIndex
    for (const animal of animals) {
      this.scores[animal.id] = 0;
      for (const [qId, weight] of Object.entries(animal.answers)) {
        if (!this.invertedIndex[qId]) {
          this.invertedIndex[qId] = {};
        }
        this.invertedIndex[qId][animal.id] = weight;
      }
    }
  }

  public answerQuestion(questionId: string, value: number): void {
    if (this.askedQuestions.includes(questionId)) return;
    this.askedQuestions.push(questionId);

    const questionData = this.invertedIndex[questionId];
    if (!questionData) return;

    // Aplicar pontuação com peso progressivo baseado na força da resposta
    // Uma resposta forte (+1 ou -1) vale mais do que fraca (0.5)
    const strength = Math.abs(value);
    const multiplier = strength >= 1 ? 3 : strength >= 0.5 ? 1.5 : 0;

    for (const [animalId, weight] of Object.entries(questionData)) {
      // Se o usuário disse "SIM" (value > 0) e o animal tem essa característica (weight > 0): +pontos
      // Se o usuário disse "SIM" (value > 0) e o animal NÃO tem (weight < 0): -pontos (penalidade)
      // Multiplicador progressivo garante que respostas fortes eliminam candidatos rapidamente
      this.scores[animalId] += value * weight * multiplier;
    }
  }

  public getBestQuestion(): string | null {
    // 1. Identificar os candidatos atuais (animais com score acima de zero ou top N)
    const sortedAnimals = this.getSortedAnimals();
    
    // Pegar candidatos viáveis: animais que ainda não foram eliminados
    // (score > mediana ou top 10, o que for menor)
    const medianScore = sortedAnimals.length > 0 
      ? sortedAnimals[Math.floor(sortedAnimals.length / 2)]
      : null;
    const medianVal = medianScore ? this.scores[medianScore.id] : 0;
    
    const candidates = sortedAnimals.filter(a => this.scores[a.id] >= medianVal).slice(0, 10);
    if (candidates.length === 0) return null;

    // 2. Identificar perguntas que já foram "respondidas implicitamente" por correlação
    const deprioritized = this.getDeprioritizedQuestions();

    // 3. Calcular entropia para cada pergunta restante
    type ScoredQuestion = { id: string; entropy: number; isDeprioritized: boolean };
    const scoredQuestions: ScoredQuestion[] = [];

    for (const q of this.questions) {
      if (this.askedQuestions.includes(q.id)) continue;

      let yesCount = 0;
      let noCount = 0;
      let totalWeight = 0;

      for (const animal of candidates) {
        const weight = this.invertedIndex[q.id]?.[animal.id] ?? 0;
        if (weight > 0) {
          yesCount += weight;
        } else if (weight < 0) {
          noCount += Math.abs(weight);
        }
        totalWeight += Math.abs(weight);
      }

      if (totalWeight === 0) continue; // Pergunta irrelevante para os candidatos atuais

      // Entropia: quanto mais 50/50 a divisão, melhor a pergunta
      const total = yesCount + noCount;
      const pYes = total > 0 ? yesCount / total : 0;
      const pNo = total > 0 ? noCount / total : 0;

      // Entropia de Shannon simplificada
      let entropy = 0;
      if (pYes > 0 && pYes < 1) {
        entropy = -(pYes * Math.log2(pYes) + pNo * Math.log2(pNo));
      }

      scoredQuestions.push({
        id: q.id,
        entropy,
        isDeprioritized: deprioritized.has(q.id),
      });
    }

    if (scoredQuestions.length === 0) return null;

    // 4. Perguntas despriorizadas (correlatas) perdem 60% da entropia
    for (const sq of scoredQuestions) {
      if (sq.isDeprioritized) {
        sq.entropy *= 0.4;
      }
    }

    // 5. Ordenar por entropia (melhor primeiro)
    scoredQuestions.sort((a, b) => b.entropy - a.entropy);

    // 6. Aleatoriedade: Para dar variedade ao jogo.
    // No começo do jogo (primeiras 2 perguntas), abrimos bastante o leque de opções (top 8)
    // porque várias perguntas têm entropia parecida. No final, afunilamos para precisão (top 3).
    const bestEntropy = scoredQuestions[0].entropy;
    const isBeginning = this.askedQuestions.length < 2;
    
    const threshold = bestEntropy * (isBeginning ? 0.60 : 0.85); 
    const maxPoolSize = isBeginning ? 8 : 3;

    const topTier = scoredQuestions.filter(sq => sq.entropy >= threshold).slice(0, maxPoolSize);
    
    const randomIndex = Math.floor(Math.random() * topTier.length);
    return topTier[randomIndex].id;
  }

  public checkVictory(): Animal | null {
    const sorted = this.getSortedAnimals();

    if (sorted.length === 0) return null;
    if (sorted.length === 1) return sorted[0];

    const top1Score = this.scores[sorted[0].id];
    const top2Score = this.scores[sorted[1].id];

    // Condições de vitória:
    // 1. Diferença de score >= 6 pontos E pelo menos 3 perguntas feitas
    // 2. Já fez >= 15 perguntas (forçar um palpite)
    if ((top1Score - top2Score >= 6 && this.askedQuestions.length >= 3) ||
        this.askedQuestions.length >= 15) {
      return sorted[0];
    }

    return null;
  }

  private getSortedAnimals(): Animal[] {
    return [...this.animals].sort((a, b) => {
      const scoreDiff = this.scores[b.id] - this.scores[a.id];
      if (scoreDiff !== 0) return scoreDiff;
      return b.playCount - a.playCount;
    });
  }

  /** 
   * Identifica perguntas que seriam redundantes baseado nas respostas já dadas.
   * Ex: Se o usuário disse "é mamífero = SIM", perguntas como "é ave?" e "tem penas?" 
   * são quase certamente "não" e não agregam informação.
   */
  private getDeprioritizedQuestions(): Set<string> {
    const deprioritized = new Set<string>();

    for (const group of MagicEngine.CORRELATED_GROUPS) {
      // Se alguma pergunta do grupo já foi respondida
      const answeredInGroup = group.filter(qId => this.askedQuestions.includes(qId));
      if (answeredInGroup.length > 0) {
        // Depriorizar as outras do grupo (não remover, só baixar score)
        for (const qId of group) {
          if (!this.askedQuestions.includes(qId)) {
            deprioritized.add(qId);
          }
        }
      }
    }

    return deprioritized;
  }
}
