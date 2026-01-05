import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameState, PlayerProfile, INITIAL_STATS, PlayerStats, GamePhase, DegreeType, VisaStatus, VisaSubclass, HousingType, AssetType, RegionType } from '../types/game';
import { GameEvent, GameEventOption } from '../types/event';
import { DEGREE_CONFIG, HOUSING_CONFIG } from '../data/constants';
import { NPC_DATA } from '../data/npcs';
import { REGIONS } from '../data/regions';
import { ACADEMIC_EVENTS } from '../data/events/academics';
import { CAREER_EVENTS } from '../data/events/career';
import { LIFE_EVENTS } from '../data/events/life';
import { SPECIAL_EVENTS } from '../data/events/special';

// Helper to get a random event from the existing pool
const getRandomEvent = (phase: GamePhase): GameEvent | null => {
    const allEvents = [
        ...Object.values(ACADEMIC_EVENTS),
        ...Object.values(CAREER_EVENTS),
        ...Object.values(LIFE_EVENTS)
    ];

    // Simple filter: only academic in student phase, etc. (Can be more complex)
    const filtered = allEvents.filter(e => {
        if (phase === 'student') return e.type === 'academic' || e.type === 'life';
        if (phase === 'graduate') return e.type === 'career' || e.type === 'life';
        return true;
    });

    if (filtered.length === 0) return null;
    return filtered[Math.floor(Math.random() * filtered.length)];
};

// Extend GameState to include active event and new structures
interface ExtendedGameState extends Omit<GameState, 'visaExpiryDays'> {
    currentEvent: GameEvent | null;
    visaStatus: VisaStatus;
    quartersStudied: number; // Track academic progress
    housing: HousingType;
    currentRegion: RegionType;
    assets: AssetType[];
    npcRelations: Record<string, number>; // Store dynamic relationship values
}

interface GameActions {
    // Initialization
    startGame: (profile: PlayerProfile) => void;
    resetGame: () => void;

    // Stats Updates
    updateStats: (delta: Partial<PlayerStats>) => void;
    updateSanity: (amount: number) => void;
    updateMoney: (amount: number) => void;
    addLog: (message: string) => void;

    // Time System
    advanceQuarter: () => void;
    useActionPoints: (amount: number) => boolean;

    // Game Flow
    setPhase: (phase: GamePhase) => void;
    triggerGameOver: (reason: string) => void;

    // Visa System
    applyVisa: (subclass: VisaSubclass) => void;

    // Event System
    triggerEvent: (event: GameEvent) => void;
    handleEventOption: (option: GameEventOption) => void;
    closeEvent: () => void;

    // V2.0 Economy Actions
    setHousing: (housing: HousingType) => void;
    setRegion: (region: RegionType) => void;
    addAsset: (asset: AssetType) => void;

    // V2.0 NPC Actions
    interactWithNPC: (npcId: string, action: 'chat' | 'gift' | 'date') => void;
}

type GameStore = ExtendedGameState & GameActions;

// Helper to get initial visa
const getInitialVisa = (degree: DegreeType): VisaStatus => {
    const degreeData = DEGREE_CONFIG[degree];
    const durationDays = (degreeData.durationYears * 365) + 90; // Student visa usually gives +2-3 months
    return {
        subclass: 'subclass_500',
        expiryDays: durationDays
    };
};

const INITIAL_DATA_BASE: Omit<ExtendedGameState, 'eventsLog' | 'actions' | 'startGame' | 'resetGame' | 'updateStats' | 'updateSanity' | 'updateMoney' | 'addLog' | 'advanceQuarter' | 'useActionPoints' | 'setPhase' | 'triggerGameOver' | 'applyVisa' | 'triggerEvent' | 'handleEventOption' | 'closeEvent'> & { eventsLog: string[] } = {
    year: 1,
    quarter: 1,
    totalQuarters: 1,
    quartersStudied: 0,
    stats: { ...INITIAL_STATS, age: 24 }, // Default age 24, will be set by profile
    phase: 'intro',
    visaStatus: { subclass: 'subclass_500', expiryDays: 0 },
    actionPoints: 10,
    maxActionPoints: 10,
    isGameOver: false,
    gameOverReason: null,
    eventsLog: [],

    currentEvent: null,
    housing: 'shared_room',
    currentRegion: 'eastern_suburbs', // Default for UNSW
    assets: [],
    npcRelations: Object.keys(NPC_DATA).reduce((acc, key) => ({
        ...acc,
        [key]: NPC_DATA[key].initialRel
    }), {} as Record<string, number>),
    profile: {
        name: 'Player',
        gender: 'female',
        degree: 'master',
        major: 'commerce'
    }
};

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            ...INITIAL_DATA_BASE,

            startGame: (profile) => {
                const degreeData = DEGREE_CONFIG[profile.degree];
                const initialVisa = getInitialVisa(profile.degree);

                set({
                    ...INITIAL_DATA_BASE, // Reset stats to initial
                    profile,
                    visaStatus: initialVisa,
                    stats: {
                        ...INITIAL_STATS,
                        age: degreeData.initialAge
                    },

                    housing: 'shared_room', // Default starting housing
                    currentRegion: 'eastern_suburbs',
                    assets: [],
                    npcRelations: Object.keys(NPC_DATA).reduce((acc, key) => ({
                        ...acc,
                        [key]: NPC_DATA[key].initialRel
                    }), {} as Record<string, number>),
                    phase: 'student', // Start the game loop
                });
            },

            resetGame: () => {
                set({
                    ...INITIAL_DATA_BASE,
                    phase: 'intro'
                });
            },

            addLog: (message) => {
                set(state => ({ eventsLog: [message, ...state.eventsLog].slice(0, 50) }));
            },

            updateStats: (delta) => {
                set((state) => {
                    const newStats = { ...state.stats };
                    (Object.keys(delta) as Array<keyof PlayerStats>).forEach((key) => {
                        const val = delta[key];
                        if (val !== undefined) {
                            newStats[key] = Math.max(0, newStats[key] + val);
                            if (key === 'sanity') newStats[key] = Math.min(100, newStats[key]);
                            if (key === 'wam') newStats[key] = Math.min(100, newStats[key]);
                        }
                    });

                    if (newStats.sanity <= 0) {
                        get().triggerGameOver("你因长期精神压力过大，患上了严重抑郁症，被迫休学回国。");
                    }
                    if (newStats.money < -5000) {
                        get().triggerGameOver("你因无法支付学费和房租，被遣返回国。");
                    }

                    return { stats: newStats };
                });
            },

            updateSanity: (amount) => get().updateStats({ sanity: amount }),
            updateMoney: (amount) => get().updateStats({ money: amount }),

            useActionPoints: (amount) => {
                const current = get().actionPoints;
                if (current >= amount) {
                    set({ actionPoints: current - amount });
                    return true;
                }
                return false;
            },

            applyVisa: (subclass) => {
                // Simplified visa application logic
                let newExpiry = 0;
                if (subclass === 'subclass_485') newExpiry = 365 * 2; // 2 years
                if (subclass === 'subclass_500') newExpiry = 365 * 2; // Another degree

                set(() => ({
                    visaStatus: {
                        subclass: subclass,
                        expiryDays: newExpiry
                    }
                }));
                get().addLog(`Visa Granted: ${subclass.toUpperCase()}`);
            },

            advanceQuarter: () => {
                set((state) => {
                    let newQuarter = state.quarter + 1;
                    let newYear = state.year;
                    let ageIncrement = 0;

                    if (newQuarter > 4) {
                        newQuarter = 1;
                        newYear += 1;
                        ageIncrement = 1; // 1 year older
                    }

                    // Visa decay (approx 90 days per quarter)
                    const newVisaDays = Math.max(0, state.visaStatus.expiryDays - 90);

                    // Check Visa Expiry
                    if (newVisaDays <= 0 && state.visaStatus.subclass !== 'subclass_190' && state.visaStatus.subclass !== 'subclass_189') {
                        // If expired and no PR
                        get().triggerGameOver("你的签证已过期，且未获得新的合法居留身份。Game Over.");
                    }

                    // Check Graduation (Simplified: Duration * 4 quarters)
                    const degreeDurationQuarters = DEGREE_CONFIG[state.profile.degree].durationYears * 4;
                    const newQuartersStudied = state.quartersStudied + 1;

                    if (state.phase === 'student' && newQuartersStudied >= degreeDurationQuarters) {
                        // Trigger Graduation Decision Event
                        get().triggerEvent(SPECIAL_EVENTS['graduation_decision']);
                        get().addLog("🎉 恭喜！你完成了学业！现在面临人生的抉择...");
                    } else if (Math.random() < 0.6) {
                        // Trigger random event (unless graduating)
                        const event = getRandomEvent(state.phase);
                        if (event) get().triggerEvent(event);
                    }

                    // --- V2.0 ECONOMY: Rent Deduction & Housing Buffs ---
                    const currentHousing = HOUSING_CONFIG[state.housing];
                    const currentRegion = REGIONS[state.currentRegion];

                    // 2. Pay Rent (Quarterly = 13 weeks)
                    // Rent Formula: Base Cost * Region Modifier
                    const rentCost = Math.floor(currentHousing.weeklyCost * currentRegion.rentModifier * 13);

                    // Sanity Formula: Housing Base + Region Modifier
                    const housingSanity = currentHousing.sanityModifier;
                    const regionSanity = currentRegion.sanityModifier;
                    const totalSanityEffect = housingSanity + regionSanity;

                    get().updateMoney(-rentCost);
                    get().updateSanity(totalSanityEffect);

                    get().addLog(`Paid housing rent: $${rentCost} (${currentHousing.label} @ ${currentRegion.label}). Sanity ${totalSanityEffect > 0 ? '+' : ''}${totalSanityEffect}.`);


                    return {
                        year: newYear,
                        quarter: newQuarter,
                        totalQuarters: state.totalQuarters + 1,
                        quartersStudied: newQuartersStudied,
                        visaStatus: { ...state.visaStatus, expiryDays: newVisaDays },
                        actionPoints: state.maxActionPoints, // Reset AP
                        stats: { ...state.stats, age: state.stats.age + ageIncrement }
                    };
                });
            },

            setPhase: (phase) => set({ phase }),
            triggerGameOver: (reason) => set({ isGameOver: true, gameOverReason: reason }),

            // --- Event System ---
            triggerEvent: (event) => {
                set({ currentEvent: event });
            },

            closeEvent: () => {
                set({ currentEvent: null });
            },

            handleEventOption: (option) => {
                const { cost, effect, nextEventId } = option;
                const state = get();

                // Check Cost
                if (cost) {
                    if (cost.ap && state.actionPoints < cost.ap) return; // Should be handled by UI disabled state
                    if (cost.money && state.stats.money < cost.money) return;

                    if (cost.ap) get().useActionPoints(cost.ap);
                    if (cost.money) get().updateMoney(-cost.money);
                    if (cost.sanity) get().updateSanity(-cost.sanity);
                }

                // Apply Effects
                if (effect) {
                    if (effect.stats) get().updateStats(effect.stats);
                    if (effect.gameOver) get().triggerGameOver(effect.gameOver);
                    if (effect.applyVisa) get().applyVisa(effect.applyVisa); // NEW: Handle visa application via event
                    // Handle special flags or logic
                }

                // Log decision
                get().addLog(`Decision: ${option.label}`);

                // Next Event or Close
                if (nextEventId) {
                    // Search in all event bases
                    const allEvents: Record<string, GameEvent> = {
                        ...ACADEMIC_EVENTS,
                        ...CAREER_EVENTS,
                        ...LIFE_EVENTS,
                        ...SPECIAL_EVENTS
                    };
                    const nextEvent = allEvents[nextEventId];
                    if (nextEvent) {
                        set({ currentEvent: nextEvent });
                    } else {
                        set({ currentEvent: null });
                    }
                } else {
                    set({ currentEvent: null });
                }
            },

            setHousing: (housing) => set({ housing }),
            setRegion: (region) => set({ currentRegion: region }),
            addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),

            interactWithNPC: (npcId, action) => {
                const npc = NPC_DATA[npcId];
                if (!npc) return;

                const state = get();
                let relDelta = 0;
                let costMoney = 0;
                let costAp = 0;
                let logMsg = "";

                if (action === 'chat') {
                    if (state.actionPoints < 1) return;
                    costAp = 1;
                    relDelta = 2; // Slow grind
                    get().updateSanity(2); // Small comfort
                    logMsg = `Chat with ${npc.name}: +2 Rel, +2 Sanity.`;
                } else if (action === 'gift') {
                    if (state.stats.money < 50) return;
                    costMoney = 50;
                    relDelta = 15; // Pay to win
                    logMsg = `Gift to ${npc.name}: +15 Rel, -$50.`;
                } else if (action === 'date') {
                    if (state.actionPoints < 2 || state.stats.money < 100) return;
                    costAp = 2;
                    costMoney = 100;
                    relDelta = 10;
                    get().updateSanity(15);
                    logMsg = `Date with ${npc.name}: +10 Rel, +15 Sanity, -$100.`;
                }

                // Apply costs
                if (costAp > 0) get().useActionPoints(costAp);
                if (costMoney > 0) get().updateMoney(-costMoney);

                // Update Relation
                set(state => ({
                    npcRelations: {
                        ...state.npcRelations,
                        [npcId]: Math.min(100, (state.npcRelations[npcId] || 0) + relDelta)
                    }
                }));

                get().addLog(logMsg);
            }
        }),
        {
            name: 'aus-sim-storage', // unique name
            storage: createJSONStorage(() => localStorage),
        }
    )
);
