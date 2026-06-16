import { create } from "zustand";

interface EmotionState {
  currentEmotion: string; // Noto Emoji hex code, defaults to happy/neutral '1f60a'
  isTyping: boolean;
  setEmotion: (emotion: string) => void;
  setTyping: (typing: boolean) => void;
  resetEmotion: () => void;
}

export const useEmotionStore = create<EmotionState>()((set) => ({
  currentEmotion: "1f60a",
  isTyping: false,
  setEmotion: (emotion: string) => set({ currentEmotion: emotion }),
  setTyping: (typing: boolean) => set({ isTyping: typing }),
  resetEmotion: () => set({ currentEmotion: "1f60a" }),
}));
