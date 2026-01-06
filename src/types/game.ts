export type Gender = 'male' | 'female';

export type DegreeType = 'bachelor' | 'master' | 'phd';

export type MajorType = 'commerce' | 'engineering_it' | 'nursing' | 'arts';

export type HousingType = 'living_room' | 'shared_room' | 'master_room' | 'studio';
export type AssetType = 'car_camry';

export type NPCCategory = 'academic' | 'social' | 'career' | 'romance' | 'service';
export type RelationLevel = 'stranger' | 'acquaintance' | 'friend' | 'close' | 'partner';

export type RegionType = 'city' | 'inner_west' | 'eastern_suburbs' | 'western_suburbs';

export interface RegionConfig {
    id: RegionType;
    label: string;
    rentModifier: number; // Multiplier
    sanityModifier: number; // Per quarter
    security: 'high' | 'medium' | 'low';
    desc: string;
}

export interface NPC {
    id: string;
    name: string;
    title: string;
    category: NPCCategory;
    desc: string;
    avatar?: string; // Optional icon/image mapping
    initialRel: number;
    likes?: string[]; // item tags
    dislikes?: string[]; // item tags
}

export type VisaSubclass = 'subclass_500' | 'subclass_485' | 'bridging_a' | 'subclass_190' | 'subclass_189' | 'expired';

export type GamePhase = 'intro' | 'student' | 'graduate' | 'job_seeker' | 'working' | 'pr_waiting' | 'pr_granted' | 'game_over';

export interface PlayerStats {
    age: number; // Current age
    sanity: number;
    money: number;
    wam: number;
    english: number; // 0-90 (PTE score approximation)
    experience: number;
    network: number;
    pr_score: number;
    intelligence: number;
    coding: number;
    health: number;
}

export interface InventoryItem {
    id: string;
    name: string;
    price: number;
    description: string;
    category: 'consumable' | 'gift';
    effect?: {
        ap?: number;
        sanity?: number;
        health?: number;
    };
    tags?: string[]; // e.g. 'book', 'tech', 'luxury'
}

export interface DialogueOption {
    text: string;
    nextId?: string | null; // null = end
    effect?: {
        rel?: number;
        sanity?: number;
    };
    req?: {
        minRel?: number;
    };
}

export interface DialogueNode {
    id: string;
    text: string;
    options: DialogueOption[];
}


export type PlayerBackground = 'wealthy' | 'middle' | 'working';

export interface PlayerProfile {
    name: string;
    gender: Gender;
    avatar?: string; // P2: Character avatar
    degree: DegreeType;
    major: MajorType;
    background: PlayerBackground;
    // Initial choices, immutable after start
}

export interface VisaStatus {
    subclass: VisaSubclass;
    expiryDays: number;
    // canWorkLimit: number; // e.g. 48 hours per fortnight
}

export interface GameState {
    // Time System
    year: number;
    quarter: number; // 1-4
    totalQuarters: number;

    // Player Data
    profile: PlayerProfile;
    stats: PlayerStats;
    phase: GamePhase;

    // Assets & Housing
    housing: HousingType;
    currentRegion: RegionType;
    assets: AssetType[];
    inventory: string[]; // Item IDs
    coffeeConsumed: number; // Limit per quarter

    // Inventory / Status
    visaStatus: VisaStatus;
    quartersStudied: number;
    actionPoints: number;
    maxActionPoints: number;

    // System Flags
    isGameOver: boolean;
    gameOverReason: string | null;

    // Collections
    eventsLog: string[]; // History of ids
}

export const INITIAL_STATS: PlayerStats = {
    age: 24,
    sanity: 100,
    money: 50000,
    wam: 65,
    english: 50,
    experience: 0,
    network: 10,
    pr_score: 0,
    intelligence: 50,
    coding: 0,
    health: 100
};
