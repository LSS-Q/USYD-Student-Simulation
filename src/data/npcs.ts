import { NPC } from '../types/game';

export const NPC_DATA: Record<string, NPC> = {
    // --- Academic (导师 & 同学) ---
    'prof_chen': {
        id: 'prof_chen',
        name: 'Dr. Emily Chen',
        title: 'Academic Advisor',
        category: 'academic',
        desc: '严厉但负责的华裔教授。搞定她，HD和推荐信都不是问题。',
        initialRel: 30,
        likes: ['academic', 'coffee'],
        dislikes: ['game', 'luxury']
    },
    'tutor_david': {
        id: 'tutor_david',
        name: 'David Smith',
        title: 'Head Tutor',
        category: 'academic',
        desc: '批作业看心情的Tutor。稍微搞好关系，也许能多拿几分。',
        initialRel: 10
    },
    'nerd_zhang': {
        id: 'nerd_zhang',
        name: '学霸张伟',
        title: 'Group Assignment Carrier',
        category: 'academic',
        desc: '传说中的大腿。抱紧他，小组作业可以全程划水。',
        initialRel: 20
    },
    'slacker_mike': {
        id: 'slacker_mike',
        name: 'Mike',
        title: 'The Ghost Teammate',
        category: 'academic',
        desc: '永远在失联，出现只为借抄作业。但也许有很多Party内幕。',
        initialRel: 50
    },

    // --- Social (朋友 & 圈子) ---
    'rich_alice': {
        id: 'rich_alice',
        name: 'Alice Wang',
        title: '富家千金',
        category: 'social',
        desc: '住在豪华海景房，日常是逛街和High Tea。也是进入上流圈子的门票。',
        initialRel: 20,
        likes: ['luxury', 'fashion'],
        dislikes: ['cheap', 'academic']
    },
    'party_king_kevin': {
        id: 'party_king_kevin',
        name: 'Kevin Li',
        title: 'Party King',
        category: 'social',
        desc: '每周末都在夜店卡座。能带你飞，也能让你挂科。',
        initialRel: 40
    },
    'gossip_linda': {
        id: 'gossip_linda',
        name: 'Linda',
        title: '情报中心',
        category: 'social',
        desc: '悉尼留学圈没有什么瓜是她不知道的。',
        initialRel: 30
    },
    'gym_bro_alex': {
        id: 'gym_bro_alex',
        name: 'Alex',
        title: 'Gym Rat',
        category: 'social',
        desc: '每天都在健身房举铁。Sanity恢复大师。',
        initialRel: 10
    },
    'roommate_sara': {
        id: 'roommate_sara',
        name: 'Sara',
        title: 'Clean Freak Roommate',
        category: 'social',
        desc: '有点洁癖的室友。搞好关系，家里环境会很舒服。',
        initialRel: 40
    },

    // --- Career (职场 & 打工) ---
    'mentor_james': {
        id: 'mentor_james',
        name: 'James Wilson',
        title: 'Big 4 Manager',
        category: 'career',
        desc: '四大经理，你的校友导师。内推全靠他。',
        initialRel: 10
    },
    'boss_peter': {
        id: 'boss_peter',
        name: 'Peter',
        title: 'Café Owner',
        category: 'career',
        desc: '抠门的老板，喜欢压榨留学生。但确实是个练口语的地方。',
        initialRel: 0
    },
    'recruiter_sam': {
        id: 'recruiter_sam',
        name: 'Sam',
        title: 'Tech Recruiter',
        category: 'career',
        desc: '猎头，手里有很多不想公开的职位。',
        initialRel: 5
    },
    'senior_lucy': {
        id: 'senior_lucy',
        name: 'Lucy',
        title: 'Senior Developer',
        category: 'career',
        desc: '乐于助人的学姐，已经拿到PR上岸。',
        initialRel: 25
    },

    // --- Romance (Crush) ---
    'crush_jessica': {
        id: 'crush_jessica',
        name: 'Jessica',
        title: 'Arts Student',
        category: 'romance',
        desc: '文艺女神，喜欢逛展和看海。',
        initialRel: 10,
        likes: ['art', 'book', 'flowers', 'romance'],
        dislikes: ['game', 'tech']
    },
    'crush_tom': {
        id: 'crush_tom',
        name: 'Tom',
        title: 'Surfer Boy',
        category: 'romance',
        desc: '阳光开朗大男孩，总是出现在海滩。',
        initialRel: 10
    },
    'ex_boyfriend': {
        id: 'ex_boyfriend',
        name: 'Jason (Ex)',
        title: 'The Past',
        category: 'romance',
        desc: '在国内分手的前任，偶尔还会发消息骚扰。',
        initialRel: -10
    },

    // --- Service (生活服务) ---
    'landlord_wang': {
        id: 'landlord_wang',
        name: 'Uncle Wang',
        title: 'Hardcore Landlord',
        category: 'service',
        desc: '手里有十几套房的房东。心情好可能会免水电费。',
        initialRel: 30
    },
    'daigou_sister': {
        id: 'daigou_sister',
        name: 'Sister Hua',
        title: 'Ace Daigou',
        category: 'service',
        desc: '资深代购大姐，路子野。',
        initialRel: 20
    },
    'mechanic_jack': {
        id: 'mechanic_jack',
        name: 'Jack',
        title: 'Honest Mechanic',
        category: 'service',
        desc: '靠谱的修车师傅，有了车以后他是你最好的朋友。',
        initialRel: 10
    },
    'consultant_li': {
        id: 'consultant_li',
        name: 'Consultant Li',
        title: 'Visa Agent',
        category: 'service',
        desc: '中介老李，虽然收费贵，但消息由于灵通。',
        initialRel: 10
    }
};
