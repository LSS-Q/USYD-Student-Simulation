import { DegreeType, MajorType } from "../types/game";

export const DEGREE_CONFIG: Record<DegreeType, {
    label: string;
    durationYears: number;
    costPerYear: number;
    initialAge: number; // typical starting age
    desc: string;
}> = {
    bachelor: {
        label: "Bachelor (本科)",
        durationYears: 3,
        costPerYear: 45000,
        initialAge: 18,
        desc: "3-4年，家底要求高，融入圈子容易。"
    },
    master: {
        label: "Master (硕士)",
        durationYears: 2,
        costPerYear: 52000,
        initialAge: 23,
        desc: "1.5-2年，节奏快，挂科成本高 ($5000/门)。"
    },
    phd: {
        label: "PhD (博士)",
        durationYears: 4,
        costPerYear: 0, // Assuming scholarship
        initialAge: 25,
        desc: "3-5年，有奖学金，但学术压力极大 (SAN--)。"
    }
};

export const MAJOR_CONFIG: Record<MajorType, {
    label: string;
    effectDesc: string;
    statsModifier: {
        sanity?: number;
        network?: number;
        english?: number;
        jobDifficulty: number; // 0-10, higher is harder
        prSteady: number; // 0-10, higher is easier for PR
    }
}> = {
    commerce: {
        label: "Commerce (Finance/Accounting)",
        effectDesc: "人多卷，作业多。NET+, Job Difficulty High.",
        statsModifier: {
            network: 10,
            jobDifficulty: 8,
            prSteady: 4
        }
    },
    engineering_it: {
        label: "Engineering / IT",
        effectDesc: "头发少，作业难。SAN-, PR Chance High.",
        statsModifier: {
            sanity: -10,
            jobDifficulty: 6,
            prSteady: 8
        }
    },
    nursing: {
        label: "Nursing (护理)",
        effectDesc: "屎尿屁实习，极度累。SAN--, PR Chance Very High (稳).",
        statsModifier: {
            sanity: -20,
            jobDifficulty: 2,
            prSteady: 10
        }
    },
    arts: {
        label: "Arts / Social Work",
        effectDesc: "英语要求极高。English Req High, Job Difficulty Medium.",
        statsModifier: {
            english: 10,
            jobDifficulty: 7,
            prSteady: 6
        }
    }
};

export const HOUSING_CONFIG: Record<string, {
    label: string;
    weeklyCost: number;
    sanityModifier: number; // per quarter
    privacy: number; // 0-10, flavor stat
    desc: string;
}> = {
    living_room: {
        label: "Living Room (厅长)",
        weeklyCost: 180,
        sanityModifier: -5,
        privacy: 0,
        desc: "毫无隐私，室友半夜煮泡面都能闻到。省钱首选。"
    },
    shared_room: {
        label: "Shared Room (双人间)",
        weeklyCost: 300,
        sanityModifier: -2,
        privacy: 3,
        desc: "和陌生人上下铺，不仅要忍受呼噜声，还要防盗。"
    },
    master_room: {
        label: "Master Room (独卫主卧)",
        weeklyCost: 450,
        sanityModifier: 2,
        privacy: 8,
        desc: "拥有独立卫浴，终于不用抢厕所了。生活质量显著提升。"
    },
    studio: {
        label: "Studio (单身公寓)",
        weeklyCost: 650,
        sanityModifier: 5,
        privacy: 10,
        desc: "完全的自由空间。可以在家裸奔，但钱包会哭泣。"
    }
};
