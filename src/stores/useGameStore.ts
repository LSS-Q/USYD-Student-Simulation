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
import { RANDOM_EVENTS } from '../data/events/random';
import { ALL_ITEMS, CONSUMABLES } from '../data/items';
import { SoundManager } from '../utils/SoundManager';
import { useLegacyStore, LEGACY_BUFFS } from './useLegacyStore';
import { EndingType } from '../types/endings';

// Helper to get a random event from the existing pool
// Helper to get a random event from the existing pool
const getRandomEvent = (state: GameState): GameEvent | null => {
    const allEvents = [
        ...Object.values(ACADEMIC_EVENTS),
        ...Object.values(CAREER_EVENTS),
        ...Object.values(LIFE_EVENTS),
        ...RANDOM_EVENTS
    ];

    const validEvents = allEvents.filter(e => {
        // If event has specific trigger condition, use it
        if (e.triggerCondition) {
            return e.triggerCondition(state);
        }

        // Fallback checks based on phase
        if (state.phase === 'student') return e.type === 'academic' || e.type === 'life';
        if (state.phase === 'graduate') return e.type === 'career' || e.type === 'life';

        return true;
    });

    if (validEvents.length === 0) return null;
    return validEvents[Math.floor(Math.random() * validEvents.length)];
};

// Extend GameState to include active event and new structures
interface ExtendedGameState extends GameState {
    currentEvent: GameEvent | null;
    npcRelations: Record<string, number>; // Store dynamic relationship values
    hasTakenWeekendAction: boolean; // P2: Track if weekend action used this quarter
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
    // V2.0 NPC Actions
    interactWithNPC: (npcId: string, action: 'chat' | 'gift' | 'date') => void;

    // V3.0 Items & Actions
    drinkCoffee: (itemId: string) => void;
    buyGift: (itemId: string) => void;
    giveGift: (npcId: string, giftId: string) => void;
    handleStudyComplete: (score: number) => void;

    // Phase 4: Endings
    triggerEnding: (endingId: EndingType) => void;
    checkEnding: () => void;

    // Phase 10: P2 Polish
    performWeekendAction: (cost: { money: number }, effect: { sanity: number; experience?: number; network?: number }) => void;
    setPlayerProfile: (profile: Partial<PlayerProfile>) => void;
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
    coffeeConsumed: 0,
    inventory: [],
    stats: { ...INITIAL_STATS, age: 24 }, // Default age 24, will be set by profile
    phase: 'intro',
    visaStatus: { subclass: 'subclass_500', expiryDays: 0 },
    actionPoints: 50,
    maxActionPoints: 50,
    isGameOver: false,
    gameOverReason: null,
    eventsLog: [],

    currentEvent: null,
    housing: 'shared_room',
    currentRegion: 'eastern_suburbs', // Default for USYD
    assets: [],
    hasTakenWeekendAction: false, // P2: Weekend action flag
    npcRelations: Object.keys(NPC_DATA).reduce((acc, key) => ({
        ...acc,
        [key]: NPC_DATA[key].initialRel
    }), {} as Record<string, number>),
    profile: {
        name: 'Player',
        gender: 'female',
        degree: 'master',
        major: 'commerce',
        background: 'middle'
    }
};

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            ...INITIAL_DATA_BASE,

            startGame: (profile) => {
                const legacyStore = useLegacyStore.getState();
                const activeBuffs = legacyStore.activeBuffs || [];

                const degreeData = DEGREE_CONFIG[profile.degree];
                let initialStats: PlayerStats = { ...INITIAL_STATS, age: degreeData.initialAge };

                // Set initial money based on background
                let initialMoney = 10000; // Middle class default
                if (profile.background === 'wealthy') initialMoney = 50000;
                if (profile.background === 'working') initialMoney = 5000;
                initialStats.money = initialMoney;

                let initialRels: Record<string, number> = {};
                // Default Rels
                Object.keys(NPC_DATA).forEach(key => {
                    initialRels[key] = NPC_DATA[key].initialRel;
                });

                // Apply Buffs
                activeBuffs.forEach(buffId => {
                    const buff = LEGACY_BUFFS.find(b => b.id === buffId);
                    if (buff) {
                        if (buff.id === 'social_butterfly') {
                            Object.keys(NPC_DATA).forEach(npcId => {
                                initialRels[npcId] = (initialRels[npcId] || 0) + 15;
                            });
                        } else {
                            initialStats = buff.apply(initialStats);
                        }
                    }
                });

                // const degreeData = DEGREE_CONFIG[profile.degree]; // Already defined above
                const initialVisa = getInitialVisa(profile.degree);

                set({
                    ...INITIAL_DATA_BASE,
                    profile,
                    stats: initialStats,
                    npcRelations: initialRels,
                    visaStatus: initialVisa,
                    phase: 'student',
                    isGameOver: false,
                    gameOverReason: null,

                    // Explicitly set these from Base to ensure reset
                    year: INITIAL_DATA_BASE.year,
                    quarter: INITIAL_DATA_BASE.quarter,
                    totalQuarters: INITIAL_DATA_BASE.totalQuarters,
                    quartersStudied: INITIAL_DATA_BASE.quartersStudied,
                    coffeeConsumed: INITIAL_DATA_BASE.coffeeConsumed,
                    inventory: [],
                    actionPoints: INITIAL_DATA_BASE.actionPoints,
                    currentEvent: null,
                    housing: 'shared_room',
                    currentRegion: 'eastern_suburbs',
                    assets: [],
                    eventsLog: INITIAL_DATA_BASE.eventsLog,
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
                    let moneyChanged = false;

                    (Object.keys(delta) as Array<keyof PlayerStats>).forEach((key) => {
                        const val = delta[key];
                        if (val !== undefined) {
                            newStats[key] = Math.max(0, newStats[key] + val);
                            if (key === 'sanity') newStats[key] = Math.min(100, newStats[key]);
                            if (key === 'wam') newStats[key] = Math.min(100, newStats[key]);

                            if (key === 'money' && val !== 0) moneyChanged = true;
                        }
                    });

                    if (moneyChanged) SoundManager.playMoney();

                    if (newStats.sanity <= 0) {
                        SoundManager.playError();
                        get().triggerGameOver("你因长期精神压力过大，患上了严重抑郁症，被迫休学回国。");
                    }
                    if (newStats.money < -5000) {
                        SoundManager.playError();
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
                SoundManager.playSuccess(); // Quarter end sound
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
                    } else if (Math.random() < 0.45) { // Increased prob to 45% for testing
                        // Trigger random event (unless graduating)
                        const event = getRandomEvent(state);
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

                    get().addLog(`Paid housing rent: $${rentCost} (${currentHousing.label} @ ${currentRegion.label}). Sanity ${totalSanityEffect > 0 ? '+' : ''}${totalSanityEffect}.`);

                    // Calculate new stats
                    const finalMoney = state.stats.money - rentCost;
                    const newSanity = Math.max(0, Math.min(100, state.stats.sanity + totalSanityEffect));

                    let isGameOver = state.isGameOver;
                    let gameOverReason = state.gameOverReason;

                    // Trigger Game Over checks
                    if (newSanity <= 0) {
                        isGameOver = true;
                        gameOverReason = "你因长期精神压力过大，患上了严重抑郁症，被迫休学回国。";
                        SoundManager.playError();
                    }
                    if (finalMoney < 0) {
                        isGameOver = true;
                        gameOverReason = `资金链断裂！你现在负债 $${Math.abs(finalMoney)}，无力支付房租，破产清算。`;
                        SoundManager.playError();
                    }

                    return {
                        year: newYear,
                        quarter: newQuarter,
                        totalQuarters: state.totalQuarters + 1,
                        quartersStudied: newQuartersStudied,
                        visaStatus: { ...state.visaStatus, expiryDays: newVisaDays },
                        actionPoints: state.maxActionPoints, // Reset AP
                        hasTakenWeekendAction: false, // Reset weekend action status
                        isGameOver,
                        gameOverReason,
                        stats: {
                            ...state.stats,
                            age: state.stats.age + ageIncrement,
                            money: finalMoney, // Allow negative for display on ending screen
                            sanity: newSanity
                        }
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
                        ...SPECIAL_EVENTS,
                        ...RANDOM_EVENTS.reduce((acc, e) => ({ ...acc, [e.id]: e }), {})
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
            },

            drinkCoffee: (itemId) => {
                const state = get();
                const item = ALL_ITEMS[itemId];
                if (!item || !item.effect) return;

                // Check limits (Flat White only)
                if (itemId === 'coffee' && state.coffeeConsumed >= 2) {
                    get().addLog("You've had too much coffee this quarter!");
                    return;
                }

                // Check cost
                if (state.stats.money < item.price) return;

                // Apply
                get().updateMoney(-item.price);
                if (item.effect.ap) get().updateStats({ sanity: item.effect.sanity, health: item.effect.health });
                // Need manual AP update because updateStats doesn't handle AP usually (it's separate state)
                // Wait, useActionPoints consumes. We need gainActionPoints.
                // We don't have gainActionPoints helper.
                // modify state directly
                set(s => ({ actionPoints: s.actionPoints + (item.effect?.ap || 0) }));

                if (itemId === 'coffee') {
                    set(s => ({ coffeeConsumed: s.coffeeConsumed + 1 }));
                }

                get().addLog(`Consumed ${item.name}. AP +${item.effect.ap}`);
            },

            buyGift: (itemId) => {
                const state = get();
                const item = ALL_ITEMS[itemId];
                if (!item || state.stats.money < item.price) return;

                get().updateMoney(-item.price);
                set(s => ({ inventory: [...s.inventory, itemId] }));
                get().addLog(`Bought ${item.name}.`);
            },

            giveGift: (npcId, giftId) => {
                const state = get();
                // Check inventory
                if (!state.inventory.includes(giftId)) return;

                const npc = NPC_DATA[npcId];
                const item = ALL_ITEMS[giftId];
                if (!npc || !item) return;

                // Remove from inventory
                const newInv = [...state.inventory];
                const index = newInv.indexOf(giftId);
                if (index > -1) newInv.splice(index, 1);

                // Calc Rel
                let relDelta = 10; // Base
                let logMsg = `Gifted ${item.name} to ${npc.name}.`;

                // Tags matching
                if (npc.likes && item.tags && item.tags.some(tag => npc.likes?.includes(tag))) {
                    relDelta += 15;
                    logMsg += " They loved it! (+25 Rel)";
                } else if (npc.dislikes && item.tags && item.tags.some(tag => npc.dislikes?.includes(tag))) {
                    relDelta = -5;
                    logMsg += " They didn't seem to like it. (-5 Rel)";
                } else {
                    logMsg += " (+10 Rel)";
                }

                // Update
                set(s => ({
                    inventory: newInv,
                    npcRelations: {
                        ...s.npcRelations,
                        [npcId]: Math.min(100, (s.npcRelations[npcId] || 0) + relDelta)
                    }
                }));
                get().addLog(logMsg);
            },

            handleStudyComplete: (score) => {
                // Score depends on rounds (0-3 normally)
                // Base: 2 WAM.
                // Bonus: +1 WAM per score.
                // Sanity: -5.

                const wamGain = 2 + score;
                const intGain = score >= 3 ? 2 : 1; // Bonus Int for good performance

                get().updateStats({
                    wam: wamGain,
                    intelligence: intGain,
                    sanity: -5
                });

                get().addLog(`Study Session Complete! WAM +${wamGain}, Int +${intGain}. (-2 AP)`);
                // Note: AP is consumed when starting the game in Dashboard
            },

            triggerEnding: (endingId) => {
                // Set Game Over state
                set({ isGameOver: true, gameOverReason: endingId });
                // Unlock in Legacy Store
                // We'll calculate points in the EndingScreen based on stats
                // But we should unlock the ID here or there? Better there to avoid side effects if re-rendering.
                // Actually, let's just set state here.
            },

            performWeekendAction: (cost, effect) => {
                const s = get();
                if (s.hasTakenWeekendAction) return;

                // Pay Cost
                if (s.stats.money < cost.money) return; // Should check in UI too

                set(state => ({
                    stats: {
                        ...state.stats,
                        money: state.stats.money - cost.money,
                        sanity: Math.min(100, state.stats.sanity + effect.sanity),
                        experience: state.stats.experience + (effect.experience || 0),
                        network: state.stats.network + (effect.network || 0),
                    },
                    hasTakenWeekendAction: true,
                    eventsLog: [
                        `Weekend Vibes! Sanity +${effect.sanity}`,
                        ...state.eventsLog
                    ]
                }));
                SoundManager.playSuccess();
            },

            setPlayerProfile: (updates) => {
                set(state => ({
                    profile: { ...state.profile, ...updates }
                }));
            },

            checkEnding: () => {
                const s = get();
                // Only check during active play phases
                if (s.phase !== 'student' && s.phase !== 'graduate') return;

                // --- BAD ENDINGS (Check First) ---
                // Dropout: WAM too low or Sanity 0
                if (s.stats.wam < 50 || s.stats.sanity <= 0) {
                    get().triggerEnding('dropout');
                    return;
                }

                // Forced Departure: Visa expired (handled in advanceQuarter, but double-check)
                if (s.visaStatus.expiryDays <= 0 && s.stats.pr_score < 85) {
                    get().triggerEnding('forced_departure');
                    return;
                }

                // --- GOOD ENDINGS (Check at game completion) ---
                // These should ideally be checked when player explicitly "Ends Game" or time runs out
                // For now, we'll check them in advanceQuarter when totalQuarters reaches max

                // Entrepreneur: Money >= $200k & Network >= 80
                if (s.stats.money >= 200000 && s.stats.network >= 80) {
                    get().triggerEnding('entrepreneur');
                    return;
                }

                // PR Granted: PR Score >= 85
                if (s.stats.pr_score >= 85) {
                    get().triggerEnding('pr_granted');
                    return;
                }

                // Academic: WAM >= 85 & Intelligence >= 90
                if (s.stats.wam >= 85 && s.stats.intelligence >= 90) {
                    get().triggerEnding('academic');
                    return;
                }

                // Global Talent: Money >= $50k & WAM >= 75 (fallback good ending)
                if (s.stats.money >= 50000 && s.stats.wam >= 75) {
                    get().triggerEnding('global_talent');
                    return;
                }
            }
        }),
        {
            name: 'aus-sim-storage-v2', // unique name
            storage: createJSONStorage(() => localStorage),
        }
    )
);
