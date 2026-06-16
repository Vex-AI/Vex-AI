import { create } from "zustand";

interface ChangelogState {
  isOpen: boolean;
  openChangelog: () => void;
  closeChangelog: () => void;
}

export const useChangelogStore = create<ChangelogState>((set) => ({
  isOpen: false,
  openChangelog: () => set({ isOpen: true }),
  closeChangelog: () => set({ isOpen: false }),
}));
