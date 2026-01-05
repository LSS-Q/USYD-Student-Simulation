import { GameEvent } from '../../types/event';

export const ACADEMIC_EVENTS: Record<string, GameEvent> = {
    // --- Group Project Chain ---
    'group_project_start': {
        id: 'group_project_start',
        title: 'Group Assignment Time',
        description: 'Semester 刚开始，Tutor 要求大家分组完成一个占比 40% 的大作业。你环顾四周...',
        type: 'academic',
        options: [
            {
                label: '找学霸抱大腿',
                description: '尝试联系班上看起来很厉害的本地学生 (Chance based on English)',
                cost: { ap: 2 },
                // Logic would normally handle probability. Here we hardcode simple outcomes or chains later.
                effect: { stats: { network: 2, sanity: -2 } },
                nextEventId: 'group_teammate_reveal'
            },
            {
                label: '随便找个组',
                description: '省事，听天由命。',
                cost: { ap: 0 },
                effect: { stats: { sanity: 2 } },
                nextEventId: 'group_teammate_reveal_bad'
            },
            {
                label: '自己单干 (Solo)',
                description: '风险很大，但是不用受气。(High Difficulty)',
                cost: { ap: 5, sanity: 10 },
                effect: { stats: { wam: 5, sanity: -10 } }
            }
        ]
    },

    'group_teammate_reveal': {
        id: 'group_teammate_reveal',
        title: '队友揭晓',
        description: '你加入了一个看起来还不错的组。但是第一次开会，有一个组员就没有来。',
        type: 'academic',
        options: [
            { label: '先观察一下', effect: { stats: { sanity: -1 } } }
        ]
    },

    'group_teammate_reveal_bad': {
        id: 'group_teammate_reveal_bad',
        title: '队友揭晓 (噩梦)',
        description: '你的组员是：一个从不说话的社恐，一个只会说"Yes/OK"的混子，还有一个声称自己很忙的打工狂魔。',
        type: 'academic',
        options: [
            { label: '心里一凉...', effect: { stats: { sanity: -10 } } }
        ]
    },

    'group_project_conflict': {
        id: 'group_project_conflict',
        title: 'Deadline 前夜',
        description: '明天就要交作业了，但是合并代码时发现，那个"打工狂魔"负责的部分全是 ChatGPT 生成的垃圾，根本跑不通。',
        type: 'academic',
        options: [
            {
                label: '通宵重写 (Carry)',
                description: '不论如何不能挂科。为了 WAM 拼了。',
                cost: { ap: 5, sanity: 20 },
                effect: { stats: { wam: 5, sanity: -20 } } // Good result, heavy cost
            },
            {
                label: '直接提交垃圾',
                description: '爱咋咋地，累了。',
                effect: { stats: { wam: -10, sanity: 5 } } // Bad grades
            },
            {
                label: '向 Tutor 举报 (Report)',
                description: '发送含有证据的邮件。可能被视为"Snitch"。',
                effect: { stats: { network: -5, wam: 0 } } // Unpredictable
            }
        ]
    },

    // --- Tutorial Participation ---
    'tutorial_question': {
        id: 'tutorial_question',
        title: '课堂提问',
        description: 'Tutor 突然点名让你回答一个关于"Efficient Market Hypothesis"的问题。全班都看着你。',
        type: 'academic',
        options: [
            {
                label: '自信回答 (English > 50)',
                description: '用流利的英语阐述观点。',
                effect: { stats: { network: 2, experience: 2 } }
            },
            {
                label: '支支吾吾',
                description: '太紧张了，没听清问题。',
                effect: { stats: { sanity: -5, network: -2 } }
            }
        ]
    },

    // --- New Academic Events ---
    'library_all_nighter': {
        id: 'library_all_nighter',
        title: 'Fisher Library 熬夜战',
        description: 'Final 期间，Fisher 24小时爆满。你终于在角落里抢到了一个带插座的位置。准备通宵吗？',
        type: 'academic',
        options: [
            {
                label: '不刷完不回家',
                description: '灌下第三罐红牛，强行记忆内容。',
                cost: { ap: 4, money: 10 },
                effect: { stats: { wam: 5, sanity: -15 } }
            },
            {
                label: '身体要紧，溜了',
                description: '回宿舍睡觉，说不定梦里能考好。',
                effect: { stats: { sanity: 5, wam: -2 } }
            }
        ]
    },

    'academic_integrity_scare': {
        id: 'academic_integrity_scare',
        title: '学术诚信警告',
        description: '你收到了一封邮件，标题是 "Allegation of Academic Misconduct"。原来你上次作业的相似度过高...',
        type: 'academic',
        options: [
            {
                label: '诚实认错',
                description: '由于是初犯，可能只是警告。',
                effect: { stats: { sanity: -20, wam: -5 } }
            },
            {
                label: '奋力申诉',
                description: '花费大量精力寻找证据证明自己没抄。',
                cost: { ap: 6 },
                effect: { stats: { sanity: -30, experience: 2 } }
            }
        ]
    },

    'guest_lecture_network': {
        id: 'guest_lecture_network',
        title: '行业大牛讲座',
        description: '今天有一位来自 Goldman Sachs 的校友回校做分享。讲座结束后，很多人围上去要 LinkedIn。',
        type: 'academic',
        options: [
            {
                label: '挤进去套磁',
                description: '拼了！哪怕只是混个脸热。',
                cost: { ap: 2 },
                effect: { stats: { network: 10, experience: 1, sanity: -5 } }
            },
            {
                label: '社恐发作，算了',
                description: '远程听听就行了。',
                effect: { stats: { network: 0 } }
            }
        ]
    },

    'failed_midterm': {
        id: 'failed_midterm',
        title: '期中考试惨败',
        description: 'Mid-term 成绩出来了，你只拿了 42 分 (Fail)。',
        type: 'academic',
        options: [
            {
                label: '痛定思痛',
                description: '找 Tutor 咨询，恶补基础。',
                cost: { ap: 4 },
                effect: { stats: { sanity: -10, wam: 10 } }
            },
            {
                label: '破罐子破摔',
                description: '反正最后算分占比小...',
                effect: { stats: { sanity: 5, wam: -10 } }
            }
        ]
    },

    'ai_detection_drama': {
        id: 'ai_detection_drama',
        title: 'Turnitin 系统警报',
        description: '你的作业被查重系统标红，AI 检出率高达 85%。Tutor 要求你解释。事实上，你只是用了 Grammarly 润色...',
        type: 'academic',
        options: [
            {
                label: '据理力争',
                description: '拿出历史草稿证明这是自己的原创。',
                cost: { ap: 3 },
                effect: { stats: { sanity: -15, experience: 5 } }
            },
            {
                label: '破财消灾 (承认错误)',
                description: '承认错误并请求重写，分分扣一半。',
                effect: { stats: { wam: -15, sanity: -5 } }
            }
        ]
    },

    'special_consideration': {
        id: 'special_consideration',
        title: '申请 Special Consideration',
        description: 'Final 期间你突然发烧，实在考不了试。你可以申请考试延期。',
        type: 'academic',
        options: [
            {
                label: '去诊所开证明 (SC)',
                description: '需要花钱看 GP，并等待漫长的审核。',
                cost: { money: 80, ap: 2 },
                effect: { stats: { sanity: 10, wam: 1 } } // Saved from a fail
            },
            {
                label: '带病上阵',
                description: '坚持考完，但大概率考不好。',
                effect: { stats: { wam: -10, sanity: -20 } }
            }
        ]
    },

    'honours_invitation': {
        id: 'honours_invitation',
        title: 'Honours 荣誉项邀请',
        description: '学院发来邮件，由于你出色的 WAM，邀请你读荣誉学士学位 (Honours)。这对申请 PR 或读 PhD 很有利，但要多读一年。',
        type: 'academic',
        options: [
            {
                label: '接受邀请',
                description: '虽然辛苦，但这是实力的证明。',
                effect: { stats: { experience: 10, network: 5, sanity: -10, pr_score: 5 } }
            },
            {
                label: '拒绝，想尽快上班',
                description: '读够了书，想挣钱。',
                effect: { stats: { sanity: 5 } }
            }
        ]
    },

    'scholarship_success': {
        id: 'scholarship_success',
        title: '奖学金申报',
        description: '你发现学院有一个名为 "International Student Excellence" 的奖学金可以申请。',
        type: 'academic',
        options: [
            {
                label: '精心准备材料 (WAM > 80)',
                description: '如果申请成功，有一笔不小的收入。',
                cost: { ap: 4, sanity: 10 },
                effect: { stats: { money: 2000, sanity: 10, experience: 5 } }
            },
            {
                label: '重在参与',
                description: '随便填填。',
                effect: { stats: { sanity: 0 } }
            }
        ]
    },

    'research_path_tease': {
        id: 'research_path_tease',
        title: '导师的暗示',
        description: '你的 Thesis 导师觉得你很有研究天赋，暗示你应该考虑转成 MRes (Master by Research) 以后直接读博。',
        type: 'academic',
        options: [
            {
                label: '表示感兴趣',
                description: '这意味着要放弃舒适的 Coursework 生活。',
                effect: { stats: { experience: 15, sanity: -10, network: 5 } }
            },
            {
                label: '只想混个证去搬砖',
                description: '婉拒了导师。',
                effect: { stats: { sanity: 5 } }
            }
        ]
    },

    'failed_course_warning': {
        id: 'failed_course_warning',
        title: '不及格警告',
        description: '由于你最近缺勤过多，一门核心课程的 Tutor 给你发了警告信，如果 Final 不及格就要重修。',
        type: 'academic',
        options: [
            {
                label: '突击补习',
                description: '取消一切社交，死磕教材。',
                cost: { ap: 4, sanity: 20 },
                effect: { stats: { wam: 15 } }
            },
            {
                label: '求情 (Beg for Mercy)',
                description: '找 Tutor 谈心，看能不能宽限。',
                effect: { stats: { network: -5, sanity: -5 } }
            }
        ]
    },

    'major_identity_crisis': {
        id: 'major_identity_crisis',
        title: '专业怀疑',
        description: '学了三个月后，你发现这个专业和你想象中完全不同。你开始考虑是否要转专业，但这会多交半年学费。',
        type: 'academic',
        options: [
            {
                label: '坚持下去',
                description: '没钱折腾了。',
                effect: { stats: { sanity: -10 } }
            },
            {
                label: '申请转专业',
                description: '追随自己的内心。(需要补修学分)',
                cost: { money: 5000, ap: 3 },
                effect: { stats: { sanity: 20, experience: -5 } }
            }
        ]
    },

    'exchange_program_offer': {
        id: 'exchange_program_offer',
        title: '跨国交换机会',
        description: '学校有一个去美国或是新加坡交换一学期的机会。费用自理，但很有成就感。',
        type: 'academic',
        options: [
            {
                label: '去！见见世面',
                description: '花一笔钱，换取不一样的人生。',
                cost: { money: 10000 },
                effect: { stats: { network: 20, sanity: 30, experience: 5 } }
            },
            {
                label: '还是留在悉尼',
                description: '不想换环境。',
                effect: { stats: { sanity: 0 } }
            }
        ]
    }
};
