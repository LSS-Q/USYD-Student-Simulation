export interface GlossaryTerm {
    key: string;
    term: string;
    definition: string;
    tags: string[];
}

export const GLOSSARY_DATA_ZH: GlossaryTerm[] = [
    {
        key: 'wam',
        term: 'WAM (Weighted Average Mark)',
        definition: '加权平均分。澳洲大学的核心成绩指标。WAM 决定了你是否能申请 Honours（荣誉学位）、奖学金以及通过某些大公司的简历筛选。一般 75+ 为 Distinction，85+ 为 High Distinction (HD)。',
        tags: ['Academic']
    },
    {
        key: 'pr',
        term: 'PR (Permanent Residency)',
        definition: '澳大利亚永久居留权。俗称"绿卡"。拿到 PR 意味着你可以在澳洲无限期居住、工作，并享受国民医疗等福利。本项目标即是在签证结束前攒够 PR 分数并获邀。',
        tags: ['Migration']
    },
    {
        key: 'subclass_485',
        term: '485 签证 (Post-Study Work stream)',
        definition: '毕业生工签。完成两年澳洲学历后可申请。Master degrees 通常给 3 年（随政策波动）。这是你积累工作经验和凑移民分的最关键时期。',
        tags: ['Visa']
    },
    {
        key: 'honours',
        term: 'Honours (荣誉学位)',
        definition: '澳洲本科后的额外一年研究型课程，或含在四年制学士中。拿到 First Class Honours (一等荣誉) 是通往 PhD 全奖的捷径。难度极高。',
        tags: ['Academic']
    },
    {
        key: 'py',
        term: 'PY (Professional Year)',
        definition: '职业年。针对会计、IT、工程的毕业生职业培训项目。耗时约 10 个月，含实习。完成后可在移民打分中 +5 分。',
        tags: ['Migration']
    },
    {
        key: 'naati',
        term: 'NAATI (CCL)',
        definition: '社区语言认证考试。通过考试可在移民打分中 +5 分。通常作为"凑分"的必选项。',
        tags: ['Migration']
    }
];

export const GLOSSARY_DATA_EN: GlossaryTerm[] = [
    {
        key: 'wam',
        term: 'WAM (Weighted Average Mark)',
        definition: 'The average mark you received across all units, weighted by credit points. Crucial for Honours applications and competitive Graduate Programs. 75+ is Distinction, 85+ is HD.',
        tags: ['Academic']
    },
    {
        key: 'pr',
        term: 'PR (Permanent Residency)',
        definition: 'Allows you to live and work in Australia indefinitely. Points are awarded based on age, English proficiency, education, and experience. High points are required for invitation.',
        tags: ['Migration']
    },
    // ... Simplified for now
];
