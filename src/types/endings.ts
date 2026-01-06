export type EndingType =
    | 'pr_granted'
    | 'global_talent'
    | 'entrepreneur'
    | 'academic'
    | 'forced_departure'
    | 'dropout';

export interface EndingData {
    id: EndingType;
    title: string;
    description: string;
    conditionDescription: string;
    legacyPointsReward: number;
    color: string; // Tailwind class
}

export const ENDINGS: Record<EndingType, EndingData> = {
    'pr_granted': {
        id: 'pr_granted',
        title: 'The Australian Dream',
        description: 'You successfully obtained Permanent Residency! Your hard work paid off, and you can now call Australia home.',
        conditionDescription: 'PR Score >= 85 & Stable Job',
        legacyPointsReward: 100,
        color: 'text-green-600'
    },
    'global_talent': {
        id: 'global_talent',
        title: 'The Global Talent',
        description: 'You decided to return home, armed with a prestigious degree and significant savings. Your future is bright anywhere.',
        conditionDescription: 'Money >= $50k & WAM >= 75 (Voluntary Return)',
        legacyPointsReward: 80,
        color: 'text-blue-600'
    },
    'entrepreneur': {
        id: 'entrepreneur',
        title: 'The Entrepreneur',
        description: 'Who needs a job? You built your own empire. Your startup is thriving.',
        conditionDescription: 'Money >= $200k & Network >= 80',
        legacyPointsReward: 120,
        color: 'text-purple-600'
    },
    'academic': {
        id: 'academic',
        title: 'The Academic',
        description: 'Your passion for research impressed the faculty. You received a full scholarship for a PhD.',
        conditionDescription: 'WAM >= 85 & Intelligence >= 90',
        legacyPointsReward: 90,
        color: 'text-teal-600'
    },
    'forced_departure': {
        id: 'forced_departure',
        title: 'Forced Departure',
        description: 'Your visa expired, and you failed to secure a simplified path to stay. You packed your bags with regret.',
        conditionDescription: 'Visa Expired & No PR Path',
        legacyPointsReward: 10,
        color: 'text-red-600'
    },
    'dropout': {
        id: 'dropout',
        title: 'Academic Failure',
        description: 'You failed too many subjects and were excluded from the university.',
        conditionDescription: 'WAM < 50 or Sanity 0',
        legacyPointsReward: 0,
        color: 'text-slate-600'
    }
};

export interface LegacyBuff {
    id: string;
    name: string;
    description: string;
    cost: number;
    effect: (initialState: any) => any; // Function to modify initial game state
}
