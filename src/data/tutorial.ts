import { Brain, Award, Activity, Users, Book, Trophy, Clock, Globe } from 'lucide-react';

export interface TutorialSlide {
    id: string;
    icon: any;
    color: string;
    bg: string;
    title: { zh: string; en: string };
    desc: { zh: string; en: string };
}

export const TUTORIAL_SLIDES: TutorialSlide[] = [
    {
        id: 'basics',
        icon: Clock,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        title: {
            zh: '悉尼留学生活',
            en: 'Life in USYD'
        },
        desc: {
            zh: '欢迎来到悉尼大学！你的目标是在签证到期前拿到 PR。每个季度你有有限的精力 (AP)，需要合理分配在学习、打工和社交之间。',
            en: 'Welcome to USYD! Your goal is to secure PR before your visa expires. Each quarter you have limited Action Points (AP) to spend on study, work, and social life.'
        }
    },
    {
        id: 'academics',
        icon: Brain,
        color: 'text-pink-600',
        bg: 'bg-pink-50',
        title: {
            zh: '学业与压力',
            en: 'Academics & Stress'
        },
        desc: {
            zh: '通过“学霸矩阵”小游戏提高 WAM。但要注意：学习会消耗 SAN 值 (心态)。如果 SAN 值过低，你需要休息或参加派对来恢复，否则会导致挂科。',
            en: 'Boost your WAM via the "Memory Matrix" mini-game. Be careful: studying consumes Sanity. If Sanity gets too low, you must rest or party, or you risk failing units.'
        }
    },
    {
        id: 'social',
        icon: Users,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        title: {
            zh: '社交与人脉',
            en: 'The Social Web'
        },
        desc: {
            zh: '人脉就是资源。通过聊天、送礼和约会增加与 NPC 的感度。高好感度不仅能解锁特殊剧情，还可能在求职或移民时提供关键帮助。',
            en: 'Networking is key. Increase relationship levels with NPCs via chatting, gifting, and dating. High relations unlock special stories and help with jobs or migration.'
        }
    },
    {
        id: 'tools',
        icon: Book,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        title: {
            zh: '生存工具箱',
            en: 'Survival Tools'
        },
        desc: {
            zh: '如果不熟悉专用术语，点击右上角的 📖 查看“词典”。还可以随时点击 🌐 切换中英双语，实时发生的随机事件会提醒你世界动态。',
            en: 'Not familiar with local terms? Click 📖 to open the Handbook. You can also toggle 🌐 to switch languages. Real-time notifications will keep you updated.'
        }
    },
    {
        id: 'legacy',
        icon: Trophy,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        title: {
            zh: '结局与传承',
            en: 'Endings & Legacy'
        },
        desc: {
            zh: '结局根据你的表现判定。达成结局可获得“传承点数”，用于在下周目购买强大的开局 Buff（如“家里有矿”、“社交达人”）。',
            en: 'Your performance determines your ending. Completing the game grants Legacy Points, which can be spent on powerful buffs for your next playthrough.'
        }
    }
];
