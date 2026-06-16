export interface Animal {
  id: string;
  name: {
    pt: string;
    en: string;
  };
  playCount: number;
  answers: Record<string, number>;
}

export interface Question {
  id: string;
  text: {
    pt: string;
    en: string;
  };
}

export type InvertedIndex = Record<string, Record<string, number>>;

export interface EngineState {
  scores: Record<string, number>;
  askedQuestions: string[];
}
