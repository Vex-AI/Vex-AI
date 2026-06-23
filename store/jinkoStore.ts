import { create } from "zustand";

type JinkoState = "inactive" | "confirming" | "playing" | "finished";

interface JinkoStore {
  state: JinkoState;
  setState: (state: JinkoState) => void;
  reset: () => void;
}

export const useJinkoStore = create<JinkoStore>((set) => ({
  state: "inactive",
  setState: (state) => set({ state }),
  reset: () => set({ state: "inactive" }),
}));
