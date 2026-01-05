import { GameEvent } from '../../types/event';

export const SPECIAL_EVENTS: Record<string, GameEvent> = {
    'graduation_decision': {
        id: 'graduation_decision',
        title: '毕业的十字路口',
        description: '你拿到了毕业证 (Completion Letter)！按照澳洲法律，你的学生签证将在数月内过期。你必须做出决定。',
        type: 'academic',
        options: [
            {
                label: '申请 485 毕业生签证',
                description: '获得 2-3 年全职工作权限。申请费约 $1900。',
                cost: { money: 1900, ap: 2 },
                effect: { applyVisa: 'subclass_485', stats: { network: 5 } },
            },
            {
                label: '准备回国',
                description: '悉尼的生活很精彩，但家乡才是归宿。 (Ending: Return Home)',
                effect: { gameOver: "你选择了回国，带着这几年的回忆和学位，开启了人生新篇章。" }
            },
            {
                label: '继续深造 (再读一个 Master/PhD)',
                description: '还没准备好进入职场，再苟几年。 (延长 2 年签证)',
                cost: { money: 30000, ap: 5 },
                effect: { applyVisa: 'subclass_500', stats: { wam: 2 } }
            }
        ]
    },

    'pr_invitation_189': {
        id: 'pr_invitation_189',
        title: 'PR 获邀！(189 Invitation)',
        description: '你在凌晨三点刷新邮箱时，看到了一封来自 Department of Home Affairs 的信："Invitation to Apply for a Skilled Independent visa"。',
        type: 'career',
        options: [
            {
                label: '立刻接受，提交申请',
                description: '这就是终点。你成功了。',
                effect: { gameOver: "恭喜！你拿到了澳洲永久居留权 (PR)！你在澳洲的奋斗终于开花结果。" }
            }
        ]
    }
};
