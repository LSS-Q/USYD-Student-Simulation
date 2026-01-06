import { GameEvent } from '../../types/event';

export const RANDOM_EVENTS: GameEvent[] = [
    // --- Roommate Events ---
    {
        id: 'rand_roommate_party',
        title: 'Midnight Party',
        description: '你的室友在客厅开派对，音乐震天响，现在是凌晨2点。',
        type: 'life',
        triggerCondition: (state) => ['living_room', 'shared_room'].includes(state.housing),
        options: [
            {
                label: '忍气吞声 (Ignore)',
                description: '戴上耳塞，强行睡觉。睡眠质量极差。',
                effect: { stats: { sanity: -8 } }
            },
            {
                label: '加入狂欢 (Join)',
                description: '既然睡不着，不如一起嗨！虽然累点但很开心。',
                cost: { money: 20 },
                effect: { stats: { sanity: 10 } }
            },
            {
                label: '严正抗议 (Argue)',
                description: '冲出去让他们安静下来。(需要英语 > 40)',
                requiredStats: { english: 40 },
                effect: { stats: { sanity: 5, english: 1 } }
            }
        ]
    },
    {
        id: 'rand_roommate_fridge',
        title: 'The Missing Yoghurt',
        description: '你放在冰箱里的高级酸奶不见了，只留下一个空瓶子。',
        type: 'life',
        triggerCondition: (state) => ['living_room', 'shared_room'].includes(state.housing),
        options: [
            {
                label: '自认倒霉 (Sigh)',
                description: '也许是被老鼠吃了吧...',
                effect: { stats: { money: -5, sanity: -3 } }
            },
            {
                label: '在群里对线 (Confront)',
                description: '在群里发消息质问。(可能影响室友关系，但在本游戏中暂无此属性)',
                effect: { stats: { sanity: 2 } } // Letting it out helps
            }
        ]
    },

    // --- Academic Events ---
    {
        id: 'rand_tutor_criticism',
        title: 'Tutor from Hell',
        description: '你的Tutor对你的作业进行了严厉的批评，认为你的论点一文不值。',
        type: 'academic',
        triggerCondition: (state) => state.quartersStudied > 0 && state.quartersStudied < 8,
        options: [
            {
                label: '虚心接受 (Accept)',
                description: '承认不足，努力改进。',
                effect: { stats: { intelligence: 2, sanity: -5 } }
            },
            {
                label: '据理力争 (Argue)',
                description: '去Office Hour和Tutor理论。(需要英语 > 60)',
                requiredStats: { english: 60 },
                effect: { stats: { wam: 1, sanity: 5 } }
            }
        ]
    },
    {
        id: 'rand_group_freerider',
        title: 'Free Rider Alert',
        description: '小组作业中有一个组员全程失踪，Deadline前一天才问进度。',
        type: 'academic',
        triggerCondition: (state) => state.quartersStudied > 0 && state.quartersStudied < 8,
        options: [
            {
                label: '多干点活 (Cover)',
                description: '为了WAM，我自己把他的那份也做了。',
                cost: { ap: 2 },
                effect: { stats: { wam: 2, sanity: -10 } }
            },
            {
                label: '向老师举报 (Report)',
                description: '发邮件如实说明情况。',
                effect: { stats: { wam: -1, sanity: 5 } } // Risk of lower mark 
            }
        ]
    },

    // --- Economic Events ---
    {
        id: 'rand_exchange_rate_bad',
        title: 'Exchange Rate Plunge',
        description: '澳币汇率突然大涨，你父母寄来的生活费缩水了。',
        type: 'random',
        options: [
            {
                label: '省吃俭用 (Save)',
                description: '这个月只能吃土了。',
                effect: { stats: { money: -200, sanity: -5 } }
            },
            {
                label: '打工回血 (Work)',
                description: '多加几个班补回来。(消耗 2 AP)',
                cost: { ap: 2 },
                effect: { stats: { money: 100 } } // Net -100 still? Or gain mechanism?
                // Visual description says work explicitly.
            }
        ]
    },
    {
        id: 'rand_exchange_rate_good',
        title: 'Strong Currency',
        description: '澳币汇率下跌，你不需要那么多人民币就能换到学费了！',
        type: 'random',
        options: [
            {
                label: '存起来 (Save)',
                description: '未雨绸缪。',
                effect: { stats: { money: 300 } }
            },
            {
                label: '吃顿好的 (Treat)',
                description: '去City吃顿和牛火锅！',
                effect: { stats: { money: 100, sanity: 15 } } // +300 -200 cost
            }
        ]
    }
];
