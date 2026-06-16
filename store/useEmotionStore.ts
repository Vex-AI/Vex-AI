import { create } from "zustand";

interface EmotionState {
  currentEmotion: string; // Noto Emoji hex code, defaults to happy/neutral '1f60a'
  currentMoodEmoji: string; // Emoji code representing the general mood
  isTyping: boolean;
  setEmotion: (emotion: string) => void;
  setMood: (moodEmoji: string) => void;
  setTyping: (typing: boolean) => void;
  resetEmotion: () => void;
}

export const useEmotionStore = create<EmotionState>()((set) => ({
  currentEmotion: "1f60a",
  currentMoodEmoji: "1f642", // Neutral default
  isTyping: false,
  setEmotion: (emotion: string) => set({ currentEmotion: emotion }),
  setMood: (moodEmoji: string) => set({ currentMoodEmoji: moodEmoji }),
  setTyping: (typing: boolean) => set({ isTyping: typing }),
  resetEmotion: () => set({ currentEmotion: "1f60a" }),
}));
