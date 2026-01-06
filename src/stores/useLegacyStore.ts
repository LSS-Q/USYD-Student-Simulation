import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { EndingType } from '../types/endings';

export interface LegacyState {
    unlockedEndings: EndingType[];
    legacyPoints: number;
    activeBuffs: string[]; // IDs of activated buffs for NEXT game

    // Actions
    unlockEnding: (ending: EndingType, points: number) => void;
    toggleBuff: (buffId: string, cost: number) => void;
    consumeBuffs: () => string[]; // Returns active buffs and clears them (or keeps them? Usually per run)
    resetLegacy: () => void; // Debug only
}

export const useLegacyStore = create<LegacyState>()(
    persist(
        (set, get) => ({
            unlockedEndings: [],
            legacyPoints: 0,
            activeBuffs: [],

            unlockEnding: (ending, points) => set((state) => {
                const isNew = !state.unlockedEndings.includes(ending);
                // Only give points if new? Or farming allowed? 
                // Let's allow farming for now, but maybe reduced? 
                // Simple: Always give points.
                return {
                    unlockedEndings: isNew ? [...state.unlockedEndings, ending] : state.unlockedEndings,
                    legacyPoints: state.legacyPoints + points
                };
            }),

            toggleBuff: (buffId, cost) => set((state) => {
                const isActive = state.activeBuffs.includes(buffId);
                if (isActive) {
                    // Refund
                    return {
                        activeBuffs: state.activeBuffs.filter(id => id !== buffId),
                        legacyPoints: state.legacyPoints + cost
                    };
                } else {
                    // Buy
                    if (state.legacyPoints >= cost) {
                        return {
                            activeBuffs: [...state.activeBuffs, buffId],
                            legacyPoints: state.legacyPoints - cost
                        };
                    }
                    return state;
                }
            }),

            consumeBuffs: () => {
                const buffs = get().activeBuffs;
                // Ideally we might want to keep selection for convenience, 
                // but usually roguelikes consume them.
                // Let's keep them selected but verify cost on start? 
                // Or just keep them simple.
                return buffs;
            },

            resetLegacy: () => set({ unlockedEndings: [], legacyPoints: 0, activeBuffs: [] }),
        }),
        {
            name: 'aus-sim-legacy', // Unique Key
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Define Buffs Logic here or import
export const LEGACY_BUFFS = [
    {
        id: 'rich_dad',
        name: 'Rich Dad',
        description: 'Start with +$20,000 AUD.',
        cost: 200,
        apply: (stats: any) => ({ ...stats, money: stats.money + 20000 })
    },
    {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Start with +15 Relationship with everyone.',
        cost: 150,
        apply: (npcRelations: any) => { // Complex handling
            // This needs to be handled in store initialization
            return npcRelations;
        }
    },
    {
        id: 'nerd_heritage',
        name: 'Nerd Heritage',
        description: 'Start with +10 WAM and +10 Intelligence.',
        cost: 100,
        apply: (stats: any) => ({ ...stats, wam: stats.wam + 10, intelligence: stats.intelligence + 10 })
    },
    {
        id: 'pr_hunter',
        name: 'PR Hunter',
        description: 'Start with +10 PR Points base.',
        cost: 300,
        apply: (stats: any) => ({ ...stats, pr_score: stats.pr_score + 10 })
    }
];
