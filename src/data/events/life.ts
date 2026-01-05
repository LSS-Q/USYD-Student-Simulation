import { GameEvent } from '../../types/event';

export const LIFE_EVENTS: Record<string, GameEvent> = {
    // --- Housing Events ---
    'landlord_trouble': {
        id: 'landlord_trouble',
        title: '房东来电',
        description: '你的华人房东突然通知你下周必须搬走，因为他女儿要回来住。你还有两个月合同呢。',
        type: 'life',
        options: [
            {
                label: '乖乖搬走',
                description: '不想惹麻烦...',
                effect: { stats: { sanity: -10, money: -500 } } // Moving costs, deposit lost
            },
            {
                label: '争取权益 (找 Tenancy Union)',
                description: '需要时间和精力，但合法权益应该得到保护。',
                cost: { ap: 3 },
                effect: { stats: { sanity: -5, experience: 3 } }
            },
            {
                label: '威胁报警',
                description: '强硬态度，可能有效也可能激化矛盾。',
                effect: { stats: { sanity: -5, network: -5 } }
            }
        ]
    },

    'scam_call': {
        id: 'scam_call',
        title: '诈骗电话',
        description: '"你好，这里是中国大使馆。你涉嫌洗钱案件，需要立即配合调查，否则将被取消签证..."',
        type: 'life',
        options: [
            {
                label: '直接挂断',
                description: '这种骗子见多了。',
                effect: { stats: { sanity: 2 } } // Relief from recognizing the scam
            },
            {
                label: '半信半疑',
                description: '万一是真的呢？ (危险！)',
                effect: { stats: { sanity: -20, money: -2000 } } // Potentially scammed
            }
        ]
    },

    'social_event': {
        id: 'social_event',
        title: '华人聚会',
        description: '一个朋友邀请你参加留学生聚会，说有很多同校的人。可能能认识一些有用的人脉。',
        type: 'life',
        options: [
            {
                label: '参加',
                description: '社交一下总是好的。',
                cost: { ap: 1, money: 30 },
                effect: { stats: { network: 5, sanity: 5 } }
            },
            {
                label: '婉拒',
                description: '太累了，想休息。',
                effect: { stats: { sanity: 3 } }
            }
        ]
    },

    'gambling_temptation': {
        id: 'gambling_temptation',
        title: '赌场诱惑',
        description: '室友兴奋地说他在 Star Casino 赢了 $500，邀请你一起去"试试手气"。',
        type: 'life',
        options: [
            {
                label: '去赌一把',
                description: '也许今天运气好？ (危险！)',
                cost: { ap: 2 },
                effect: { stats: { money: -300, sanity: -10 } } // Usually lose
            },
            {
                label: '坚决拒绝',
                description: '赌博害人。',
                effect: { stats: { sanity: 5 } }
            }
        ]
    },

    'travel_option': {
        id: 'travel_option',
        title: '假期旅行',
        description: '放假了！你有几个选择...',
        type: 'life',
        options: [
            {
                label: '去 Melbourne 玩几天',
                description: '不算太远，费用适中。',
                cost: { money: 500 },
                effect: { stats: { sanity: 15 } }
            },
            {
                label: '去 Tasmania 看极光',
                description: '更贵，但据说很值得。',
                cost: { money: 1000 },
                effect: { stats: { sanity: 25, network: 2 } }
            },
            {
                label: '待在家里学习',
                description: '省钱，但 boring...',
                effect: { stats: { wam: 2, sanity: -5 } }
            }
        ]
    },

    'relationship_drama': {
        id: 'relationship_drama',
        title: '感情问题',
        description: '你的前任（现在的对象）突然发消息说要和你谈谈。你们已经冷战一周了。',
        type: 'life',
        options: [
            {
                label: '去谈谈',
                description: '沟通才能解决问题。',
                cost: { ap: 2 },
                effect: { stats: { sanity: -5 } }
            },
            {
                label: '已读不回',
                description: '没心情处理这些。',
                effect: { stats: { sanity: -10, network: -3 } }
            }
        ]
    },

    // --- New Life Events ---
    'parking_fine': {
        id: 'parking_fine',
        title: '悉尼停车罚单',
        description: '你在市中心临时停了十分钟去买咖啡，回来发现挡风玻璃上贴着一张 $120 的罚单。',
        type: 'life',
        options: [
            {
                label: '乖乖交钱',
                description: '破财消灾。',
                effect: { stats: { money: -120, sanity: -10 } }
            },
            {
                label: '尝试申诉 (Appeal)',
                description: '写一封长邮件给 Revenue NSW，尽管希望渺茫。',
                cost: { ap: 2 },
                effect: { stats: { sanity: -5, experience: 2 } }
            }
        ]
    },

    'parents_pressure': {
        id: 'parents_pressure',
        title: '远方的压力',
        description: '视频通话里，父母又提到了回国考公的事，并暗示某某亲戚的孩子已经结婚了。',
        type: 'life',
        options: [
            {
                label: '耐着性子解释',
                description: '告诉他们你的职业规划。',
                cost: { sanity: 15 },
                effect: { stats: { network: 1 } }
            },
            {
                label: '直接吵一架',
                description: '受够了这些控制！',
                effect: { stats: { sanity: -20, network: -5 } }
            }
        ]
    },

    'housemate_drama_dishes': {
        id: 'housemate_drama_dishes',
        title: '厨房里的苍蝇',
        description: '厨房水槽里堆满了室友三天没洗的碗筷，已经开始发臭了。',
        type: 'life',
        options: [
            {
                label: '帮他洗了',
                description: '为了环境忍了。',
                cost: { ap: 1 },
                effect: { stats: { sanity: -10 } }
            },
            {
                label: '在群里发消息开撕',
                description: '必须要维护寝室正义！',
                effect: { stats: { sanity: -5, network: -5 } }
            }
        ]
    },

    'melbourne_cup_day': {
        id: 'melbourne_cup_day',
        title: '墨尔本杯日',
        description: '今天是全澳洲停摆看赛马的日子。你的同事们都在玩小赌注。',
        type: 'life',
        options: [
            {
                label: '随便下注 $5',
                description: '主打一个参与感。',
                effect: { stats: { money: -5, network: 5, sanity: 5 } }
            },
            {
                label: '无视，继续努力',
                description: '赌博没意思。',
                effect: { stats: { sanity: -2 } }
            }
        ]
    },

    'emergency_medical': {
        id: 'emergency_medical',
        title: '意外感冒发烧',
        description: '早起感到浑身发冷，嗓子冒火。由于没有私立医疗保险，看普通医生 (GP) 也要排队。',
        type: 'life',
        options: [
            {
                label: '硬扛',
                description: '多喝热水，睡觉。',
                cost: { ap: 2 },
                effect: { stats: { sanity: -20 } }
            },
            {
                label: '去找 GP',
                description: '花钱买个心安。',
                cost: { money: 80, ap: 1 },
                effect: { stats: { sanity: -5 } }
            }
        ]
    },

    'bondi_beach_day': {
        id: 'bondi_beach_day',
        title: 'Bondi 的阳光',
        description: '周末天气晴朗，你决定去 Bondi Beach 走一圈。海风轻拂，压力一扫而空。',
        type: 'life',
        options: [
            {
                label: '享受阳光 (Relax)',
                description: '在沙滩上躺一下午。',
                effect: { stats: { sanity: 20 } }
            },
            {
                label: '发朋友圈/小红书',
                description: '配一张精修图，文案："悉尼蓝"。',
                effect: { stats: { network: 5, sanity: 15 } }
            }
        ]
    },

    'sydney_rental_crisis': {
        id: 'sydney_rental_crisis',
        title: '悉尼租房危机',
        description: '全悉尼的租金都在疯涨。中介发来一封正式信件，通知你的房租每周涨 $100！如果不接受，请在 21 天内搬走。',
        type: 'life',
        options: [
            {
                label: '含泪接受',
                description: '现在搬出去也租不到便宜的...',
                effect: { stats: { money: -1200, sanity: -20 } } // total extra cost for the year
            },
            {
                label: '找室友分摊',
                description: '客厅再住一个人？ (牺牲隐私)',
                effect: { stats: { sanity: -30, money: 0 } }
            }
        ]
    },

    'buying_a_car': {
        id: 'buying_a_car',
        title: '买车的诱惑',
        description: '悉尼的公交系统实在太慢了。你在 Marketplace 看到一辆性价比极高的 2012 年 Corolla。',
        type: 'life',
        options: [
            {
                label: '买了！告别等车',
                description: '以后去远郊面试也方便。',
                cost: { money: 8000 },
                effect: { stats: { sanity: 15, experience: 2 } }
            },
            {
                label: '继续坐火车',
                description: '省钱是王道。',
                effect: { stats: { sanity: -5 } }
            }
        ]
    },

    'soulmate_encounter': {
        id: 'soulmate_encounter',
        title: '命中注定的相遇',
        description: '在一次社团辩论赛中，你遇到了一个志同道合的人，你们聊到了深夜。',
        type: 'life',
        options: [
            {
                label: '确定关系',
                description: '在这里终于不孤独了。',
                effect: { stats: { sanity: 40, network: 10 } }
            },
            {
                label: '只做普通朋友',
                description: '现在没精力谈恋爱。',
                effect: { stats: { network: 15, sanity: 5 } }
            }
        ]
    },

    'manly_ferry_ride': {
        id: 'manly_ferry_ride',
        title: 'Manly 渡轮之旅',
        description: '坐在 F1 渡轮上，从 Circular Quay 出发，路过歌剧院和海港大桥。清晨的海风让你觉得这一切努力都值了。',
        type: 'life',
        options: [
            {
                label: '站在甲板上吹风',
                description: '拍照，深呼吸。',
                effect: { stats: { sanity: 15, network: 2 } }
            }
        ]
    },

    'vegemite_challenge': {
        id: 'vegemite_challenge',
        title: 'Vegemite 挑战',
        description: '你的澳洲室友神秘兮兮地递给你一片涂满黑色酱料的吐司："This is the true Aussie spirit, mate!"',
        type: 'life',
        options: [
            {
                label: '咬一大口',
                description: '这...这味道... (Sanity check)',
                effect: { stats: { sanity: -5, network: 10 } }
            },
            {
                label: '礼貌拒绝',
                description: '我还是吃老干妈吧。',
                effect: { stats: { sanity: 2 } }
            }
        ]
    },

    'kangaroo_golf_course': {
        id: 'kangaroo_golf_course',
        title: '高尔夫球场的袋鼠',
        description: '你和朋友去悉尼近郊徒步，路过一个高尔夫球场，发现满地都是大袋鼠正在晒太阳。',
        type: 'life',
        options: [
            {
                label: '近距离自拍',
                description: '小心它们会泰拳！',
                effect: { stats: { sanity: 10, network: 5 } }
            },
            {
                label: '保持距离',
                description: '安全第一。',
                effect: { stats: { sanity: 5 } }
            }
        ]
    },

    'smashed_avo_brunch': {
        id: 'smashed_avo_brunch',
        title: '周日的 Smashed Avo',
        description: '你来到一家网红 Cafe，点了一份 $25 的牛油果吐司。虽然贵，但这很悉尼。',
        type: 'life',
        options: [
            {
                label: '慢享早午餐',
                description: '生活不只有奋斗，还有 Avo。',
                cost: { money: 25 },
                effect: { stats: { sanity: 15 } }
            }
        ]
    },

    'lonely_nights': {
        id: 'lonely_nights',
        title: '深夜的孤独',
        description: '赶完 Deadline，推开窗，外面安静得可怕。你突然特别想念家乡的夜市。',
        type: 'life',
        options: [
            {
                label: '刷刷抖音/朋友圈',
                description: '看看大家都在干嘛。',
                effect: { stats: { sanity: -10 } }
            },
            {
                label: '给自己煮碗泡面',
                description: '暖暖胃也暖暖心。',
                effect: { stats: { sanity: 5 } }
            }
        ]
    }
};
