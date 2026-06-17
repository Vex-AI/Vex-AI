import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LLMState {
  isAutonomousMode: boolean;
  selectedModel: string;
  downloadProgress: number;
  downloadText: string;
  isEngineReady: boolean;
  setAutonomousMode: (val: boolean) => void;
  setSelectedModel: (val: string) => void;
  setDownloadProgress: (progress: number, text: string) => void;
  setEngineReady: (val: boolean) => void;
}

export const useLLMStore = create<LLMState>()(
  persist(
    (set) => ({
      isAutonomousMode: false,
      selectedModel: "gemma-2b-it-q4f16_1-MLC", // Default for mobile
      downloadProgress: 0,
      downloadText: "",
      isEngineReady: false,

      setAutonomousMode: (val: boolean) => set({ isAutonomousMode: val }),
      setSelectedModel: (val: string) => set({ selectedModel: val }),
      setDownloadProgress: (progress: number, text: string) => set({ downloadProgress: progress, downloadText: text }),
      setEngineReady: (val: boolean) => set({ isEngineReady: val }),
    }),
    {
      name: "vex-llm-settings",
      partialize: (state) => ({
        isAutonomousMode: state.isAutonomousMode,
        selectedModel: state.selectedModel,
      }), // only persist these fields
    }
  )
);
