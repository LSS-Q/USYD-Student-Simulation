import { GameEvent } from '../../types/event';
import { EVENT_IMAGES } from '../../assets/index';

export const CAREER_EVENTS: Record<string, GameEvent> = {
    // --- Part-time Job Events ---
    'parttime_discrimination': {
        id: 'parttime_discrimination',
        title: '职场歧视',
        description: '你的主管今天当众批评你的英语口音，并暗示你应该"回到自己的国家"。周围的同事都没有说话。',
        type: 'career',
        options: [
            {
                label: '忍气吞声',
                description: '算了，为了工资先忍忍。',
                effect: { stats: { sanity: -15, money: 50 } }
            },
            {
                label: '据理力争',
                description: '用英语指出这是歧视行为。(需要一定英语水平)',
                cost: { sanity: 5 },
                effect: { stats: { sanity: -5, experience: 5, network: -3 } }
            },
            {
                label: '立刻辞职',
                description: '不干了！精神健康第一。',
                effect: { stats: { sanity: 10, money: -200 } } // Lost income
            }
        ]
    },

    'parttime_wage_theft': {
        id: 'parttime_wage_theft',
        title: '黑心老板',
        description: '已经一个月了，老板还是"忘记"发你工资。你问了好几次，每次都说"下周"。',
        type: 'career',
        image: EVENT_IMAGES['part_time_job'],
        options: [
            {
                label: '继续等',
                description: '也许这周能发...',
                effect: { stats: { sanity: -10 } }
            },
            {
                label: '向 Fair Work 举报',
                description: '需要花费时间和精力，但可能追回工资。',
                cost: { ap: 3 },
                effect: { stats: { money: 800, experience: 3 } } // Recovered wages
            },
            {
                label: '直接离职不干了',
                description: '损失这几周的工资。',
                effect: { stats: { sanity: 5, money: -400 } }
            }
        ]
    },

    'internship_offer': {
        id: 'internship_offer',
        title: '实习 Offer!',
        description: '你收到了一家小型 Fintech 公司的实习 Offer！虽然是 Unpaid Internship，但对积累经验很有帮助。',
        type: 'career',
        options: [
            {
                label: '接受 Offer',
                description: '经验比金钱重要！(接下来需要大量时间)',
                effect: { stats: { experience: 10, network: 5, sanity: -5 } }
            },
            {
                label: '拒绝',
                description: 'Unpaid Internship 就是在压榨留学生。',
                effect: { stats: { sanity: 2 } }
            }
        ]
    },

    'job_rejection': {
        id: 'job_rejection',
        title: '求职被拒',
        description: '投了 50 份简历，收到了 49 封 "We regret to inform you..." 和 1 封彻底没回复的。',
        type: 'career',
        options: [
            {
                label: '继续投简历',
                description: '坚持就是胜利...',
                cost: { ap: 2, sanity: 5 },
                effect: { stats: { sanity: -5 } }
            },
            {
                label: '找 Career Advisor 帮忙',
                description: '学校的免费服务，也许有帮助。',
                cost: { ap: 1 },
                effect: { stats: { experience: 2, network: 1 } }
            },
            {
                label: '放弃，去奶茶店打工',
                description: '至少有收入...',
                effect: { stats: { money: 100, sanity: -10, pr_score: -5 } }
            }
        ]
    },

    'visa_question': {
        id: 'visa_question',
        title: 'HR 的灵魂拷问',
        description: '面试进行得很顺利，但最后 HR 问："你有工作签证吗？我们不提供 Sponsorship。"',
        type: 'career',
        options: [
            {
                label: '诚实回答',
                description: '告诉他们你有485签证，但到期后需要 Sponsor。',
                effect: { stats: { sanity: -10, pr_score: -2 } }
            },
            {
                label: '打太极',
                description: '模糊回答，说"正在申请中"。',
                effect: { stats: { sanity: -5 } }
            }
        ]
    },

    // --- New Career Events ---
    'coffee_chat_success': {
        id: 'coffee_chat_success',
        title: 'Coffee Chat 意外惊喜',
        description: '你在 LinkedIn 上私信的一位 Senior Manager 竟然同意请你喝咖啡。',
        type: 'career',
        options: [
            {
                label: '准时赴约',
                description: '提前做好功课，准备好问题。',
                cost: { ap: 1, money: 10 },
                effect: { stats: { network: 15, experience: 2, sanity: 5 } }
            },
            {
                label: '太忙了没去',
                description: '错失良机。',
                effect: { stats: { network: -5 } }
            }
        ]
    },

    'parttime_promotion': {
        id: 'parttime_promotion',
        title: '兼职升职',
        description: '奶茶店老板看你手脚麻利，想让你当 Shift Lead。时薪涨了 $2，但责任也大了。',
        type: 'career',
        image: EVENT_IMAGES['part_time_job'],
        options: [
            {
                label: '接下重担',
                description: '更多钱，也更累。',
                effect: { stats: { money: 100, sanity: -5, experience: 3 } }
            },
            {
                label: '维持现状',
                description: '不想操心。',
                effect: { stats: { sanity: 2 } }
            }
        ]
    },

    'referral_offer': {
        id: 'referral_offer',
        title: '内推机会',
        description: '你在社团打球认识的学长说可以帮你内推到他所在的会计师事务所。',
        type: 'career',
        options: [
            {
                label: '发简历给他',
                description: '这是最容易拿面试的途径。',
                cost: { ap: 1 },
                effect: { stats: { network: 5, experience: 5 } }
            }
        ]
    },

    'professional_association_event': {
        id: 'professional_association_event',
        title: '行业社交晚宴',
        description: '你花 $50 买了一张行业晚宴的门票。满屋子都是穿着正装的人，气氛很严肃。',
        type: 'career',
        options: [
            {
                label: '厚着脸皮去换名片',
                description: '虽然尴尬，但还是凑上去。',
                cost: { ap: 2, money: 50 },
                effect: { stats: { network: 20, sanity: -15, experience: 2 } }
            },
            {
                label: '只吃自助餐',
                description: '吃回本就行。',
                effect: { stats: { money: 0, sanity: 10 } }
            }
        ]
    },

    'unpaid_internship_burnout': {
        id: 'unpaid_internship_burnout',
        title: '无薪实习的崩溃',
        description: '你已经免费打工两个月了。今天老板又让你周末加班，任务繁重。',
        type: 'career',
        options: [
            {
                label: '忍了，为了那个该死的推荐信',
                description: '身体是革命的负担。',
                cost: { sanity: 20 },
                effect: { stats: { experience: 5 } }
            },
            {
                label: '直接摊牌/离职',
                description: '拒绝被 PUA。',
                effect: { stats: { sanity: 20, network: -10 } }
            }
        ]
    },

    'salary_negotiation': {
        id: 'salary_negotiation',
        title: '薪资谈判定',
        description: '你的合同快到期了，HR 找你谈续约。你觉得自己的表现值得更高的待遇。',
        type: 'career',
        options: [
            {
                label: '强硬要求涨薪 15%',
                description: '我有其他的猎头联系我...(风险尝试)',
                effect: { stats: { money: 300, experience: 5 } }
            },
            {
                label: '顺从 HR 的 3% 涨幅',
                description: '稳定最重要，不折腾。',
                effect: { stats: { money: 50, sanity: 5 } }
            }
        ]
    },

    'tech_interview_crash': {
        id: 'tech_interview_crash',
        title: 'LeetCode 梦魇',
        description: '你在面一家澳洲独角兽时，面试官出了一道 Hard 难度的算法题，你脑子一片空白。',
        type: 'career',
        options: [
            {
                label: '强撑着写点伪代码',
                description: '至少展示一下逻辑。',
                effect: { stats: { experience: 10, sanity: -15 } }
            },
            {
                label: '当场自闭 (End session)',
                description: '对不起，我不会。',
                effect: { stats: { sanity: -25 } }
            }
        ]
    },

    'mentorship_offer': {
        id: 'mentorship_offer',
        title: '导师计划 (Mentorship)',
        description: '公司内部推出一个 Mentor 计划，你可以分配到一个 VP 级的导师。',
        type: 'career',
        options: [
            {
                label: '积极报名',
                description: '每两周要花时间汇报。(长期投资)',
                cost: { ap: 1 },
                effect: { stats: { network: 20, experience: 8 } }
            },
            {
                label: '没兴趣，只想搬砖',
                description: '不想增加额外负担。',
                effect: { stats: { sanity: 2 } }
            }
        ]
    },

    'networking_party_drunk': {
        id: 'networking_party_drunk',
        title: '醉酒社交',
        description: '在悉尼的一个 Rooftop Bar 聚会上，酒水全免。你好像喝多了，跟好几个大佬聊得热火朝天。',
        type: 'career',
        options: [
            {
                label: '继续喝，继续聊',
                description: '这是融入澳洲职场的好机会！',
                effect: { stats: { network: 15, sanity: 20, money: -50 } } // hangover tomorrow
            },
            {
                label: '适可而止，拿杯水',
                description: '保持专业形象。',
                effect: { stats: { network: 5, sanity: 5 } }
            }
        ]
    }
};
