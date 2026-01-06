import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string; // Emoji or Lucide icon name
    unlockedAt?: number; // Timestamp
}

export const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlockedAt'>[] = [
    { id: 'first_hd', name: 'First HD!', description: 'Achieve 85+ WAM for the first time.', icon: '🎓' },
    { id: 'rich_100k', name: 'Six Figures', description: 'Save $100,000 AUD.', icon: '💰' },
    { id: 'first_date', name: 'First Date', description: 'Go on your first date.', icon: '❤️' },
    { id: 'gift_master', name: 'Gift Master', description: 'Give 10 gifts to NPCs.', icon: '🎁' },
    { id: 'coffee_addict', name: 'Coffee Addict', description: 'Drink 50 coffees.', icon: '☕' },
    { id: 'social_butterfly', name: 'Social Butterfly', description: 'Max out relationship with any NPC.', icon: '🦋' },
    { id: 'pr_hunter', name: 'PR Hunter', description: 'Reach 85 PR Score.', icon: '🦘' },
    { id: 'survivor', name: 'Survivor', description: 'Complete 8 quarters without game over.', icon: '🏆' },
];

interface AchievementState {
    unlockedAchievements: Achievement[];
    totalGiftsGiven: number;
    totalCoffeesDrank: number;

    unlock: (achievementId: string) => void;
    incrementGifts: () => void;
    incrementCoffees: () => void;
    isUnlocked: (achievementId: string) => boolean;
    reset: () => void;
}

export const useAchievementStore = create<AchievementState>()(
    persist(
        (set, get) => ({
            unlockedAchievements: [],
            totalGiftsGiven: 0,
            totalCoffeesDrank: 0,

            unlock: (achievementId) => {
                if (get().isUnlocked(achievementId)) return;
                const def = ACHIEVEMENT_DEFS.find(a => a.id === achievementId);
                if (!def) return;
                set(state => ({
                    unlockedAchievements: [
                        ...state.unlockedAchievements,
                        { ...def, unlockedAt: Date.now() }
                    ]
                }));
            },

            incrementGifts: () => {
                set(state => {
                    const newCount = state.totalGiftsGiven + 1;
                    if (newCount >= 10) {
                        get().unlock('gift_master');
                    }
                    return { totalGiftsGiven: newCount };
                });
            },

            incrementCoffees: () => {
                set(state => {
                    const newCount = state.totalCoffeesDrank + 1;
                    if (newCount >= 50) {
                        get().unlock('coffee_addict');
                    }
                    return { totalCoffeesDrank: newCount };
                });
            },

            isUnlocked: (achievementId) => {
                return get().unlockedAchievements.some(a => a.id === achievementId);
            },

            reset: () => set({ unlockedAchievements: [], totalGiftsGiven: 0, totalCoffeesDrank: 0 }),
        }),
        {
            name: 'aus-sim-achievements',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
