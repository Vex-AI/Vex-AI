export interface IMessage {
  content: string;
  isVex: boolean;
  hour: string;
  date: number;
  id?: number;
}
export interface IVexInfo {
  id: number;
  name: string;
  profileImage: string;
}
export interface ISynon {
  word: string[];
  reply: string[];
  id: string;
}

export interface IClassifier {
  id: number;
  classifierData: string;
}

export interface IStreak {
  currentStreak: number;
  lastAccessed: string;
  dailyUsage: number;
}
export type UseVexMessageProps = {
  classifier: any;
  analyzer: (input: string) => Promise<string>;
};

export default console.log("hihihiha");

export interface ISynon {
  word: string[];
  reply: string[];
  id: string;
}

export interface IChatHistory {
  role: string;
  parts: { text: string }[];
}
export interface IStreak {
  currentStreak: number;
  lastAccessed: string;
  dailyUsage: number;
}

export interface DateSeparatorProps {
  date: number;
}

export interface Style {
  borderTopRightRadius: number;
  borderTopLeftRadius: number;
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
  borderColor: string;
  borderWidth: number;
  background: string;
  color: string;
  rippleColor: string;
}

export interface MessageProps {
  content: string;
  isVex: boolean;
  hour: string;
  date: number;
  onClose: () => void;
}

export interface IntentItemProps {
  syn: ISynon;
  onAddWordSynon?: () => void;
  onDeleteSynon?: () => void;
  onAddReplySynon?: () => void;
  index: number;
}

export interface IIntent {
    id?: number; 
    name: string; 
    trainingPhrases: string[]; 
    responses: string[];
}

export interface IUnclassifiedMessage {
    id?: number;
    text: string; 
    timestamp: Date;
}

export interface PhraseModalProps {
  PhraseModal: boolean;
  setPhraseModal: React.Dispatch<React.SetStateAction<boolean>>;
  newWord: string;
  setNewWord: React.Dispatch<React.SetStateAction<string>>;
  handleAddWord: () => void;
  handleDeleteWord: (word: string) => void;
  synonID: string | null;
  synons: ISynon[];
}

export interface ICachedIntent {
  name: string;
  responses: string[];
  cachedCleanedPhrases: string[];
}

