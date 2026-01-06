import { PlayerStats, VisaSubclass, GameState } from './game';

export interface GameEventOption {
    label: string;
    description?: string;
    cost?: {
        ap?: number;
        money?: number;
        sanity?: number;
    };
    requiredStats?: Partial<PlayerStats>; // e.g. need English > 50 to argue
    effect?: {
        stats?: Partial<PlayerStats>;
        flags?: string[]; // Set specific story flags
        gameOver?: string; // Instant game over reason
        applyVisa?: VisaSubclass; // NEW: Change visa subclass via event
    };
    nextEventId?: string; // Chain events
}

export interface GameEvent {
    id: string;
    title: string;
    description: string;
    image?: string; // URL or local path
    type: 'academic' | 'career' | 'life' | 'random';
    options: GameEventOption[];
    // Auto-trigger conditions (handled by store logic, defined here for reference)
    triggerCondition?: (state: GameState) => boolean;
}
