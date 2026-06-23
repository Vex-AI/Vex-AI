import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAchievementStore } from './achievementStore';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe('achievementStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAchievementStore.setState({
      badges: useAchievementStore.getState().badges.map(b => ({ ...b, unlockedAt: null })),
      jinkoWins: 0,
    });
    vi.clearAllMocks();
    
    // Mock localStorage
    const store: Record<string, string> = {
      language: 'enUS'
    };
    
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
    });
  });

  describe('unlockBadge', () => {
    it('unlocks a badge and shows a toast', () => {
      const store = useAchievementStore.getState();
      
      expect(store.isBadgeUnlocked('monk_patience')).toBe(false);
      
      useAchievementStore.getState().unlockBadge('monk_patience');
      
      const updatedStore = useAchievementStore.getState();
      expect(updatedStore.isBadgeUnlocked('monk_patience')).toBe(true);
      expect(toast.success).toHaveBeenCalledTimes(1);
      
      // Check if unlockedAt is set to a timestamp
      const badge = updatedStore.badges.find(b => b.id === 'monk_patience');
      expect(badge?.unlockedAt).toBeGreaterThan(0);
    });

    it('does not unlock the same badge twice', () => {
      useAchievementStore.getState().unlockBadge('dead_battery');
      useAchievementStore.getState().unlockBadge('dead_battery');
      
      // Toast should only be called once
      expect(toast.success).toHaveBeenCalledTimes(1);
    });

    it('does nothing if badge ID is invalid', () => {
      useAchievementStore.getState().unlockBadge('invalid_badge_id');
      expect(toast.success).not.toHaveBeenCalled();
    });
  });

  describe('incrementJinkoWins', () => {
    it('increments jinko wins count', () => {
      useAchievementStore.getState().incrementJinkoWins();
      expect(useAchievementStore.getState().jinkoWins).toBe(1);
      
      useAchievementStore.getState().incrementJinkoWins();
      expect(useAchievementStore.getState().jinkoWins).toBe(2);
    });

    it('unlocks animal_master badge when reaching 5 wins', () => {
      // Win 4 times
      for (let i = 0; i < 4; i++) {
        useAchievementStore.getState().incrementJinkoWins();
      }
      
      expect(useAchievementStore.getState().jinkoWins).toBe(4);
      expect(useAchievementStore.getState().isBadgeUnlocked('animal_master')).toBe(false);
      expect(toast.success).not.toHaveBeenCalled();
      
      // Win 5th time
      useAchievementStore.getState().incrementJinkoWins();
      
      expect(useAchievementStore.getState().jinkoWins).toBe(5);
      expect(useAchievementStore.getState().isBadgeUnlocked('animal_master')).toBe(true);
      expect(toast.success).toHaveBeenCalledTimes(1);
    });
  });
});
