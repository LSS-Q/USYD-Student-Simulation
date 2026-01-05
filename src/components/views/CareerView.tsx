import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { CAREER_EVENTS } from '../../data/events/career';
import { Briefcase, DollarSign, TrendingUp, AlertTriangle, Users, Search } from 'lucide-react';
import clsx from 'clsx';

export const CareerView: React.FC = () => {
    const {
        stats,
        actionPoints,
        useActionPoints,
        updateStats,
        triggerEvent,
        profile
    } = useGameStore();

    // Part-time job with random event
    const handlePartTimeJob = () => {
        if (useActionPoints(3)) {
            updateStats({ money: 200, sanity: -5 });

            // 25% chance of bad event
            const roll = Math.random();
            if (roll < 0.15) {
                triggerEvent(CAREER_EVENTS['parttime_discrimination']);
            } else if (roll < 0.25) {
                triggerEvent(CAREER_EVENTS['parttime_wage_theft']);
            }
        }
    };

    // Job hunting
    const handleJobHunting = () => {
        if (useActionPoints(4)) {
            updateStats({ sanity: -10, experience: 2 });

            // Results based on stats
            const successChance = (stats.experience / 100 + stats.network / 200 + stats.english / 200);
            const roll = Math.random();

            if (roll < 0.1) { // 10% chance of interview
                triggerEvent(CAREER_EVENTS['visa_question']);
            } else if (roll > (0.5 + successChance)) {
                triggerEvent(CAREER_EVENTS['job_rejection']);
            } else if (roll < 0.05) { // 5% chance of internship
                triggerEvent(CAREER_EVENTS['internship_offer']);
            }
        }
    };

    // Networking
    const handleNetworking = () => {
        if (useActionPoints(2)) {
            updateStats({ network: 3, sanity: -3, money: -30 }); // Coffee/event costs
        }
    };

    return (
        <div className="space-y-6">
            {/* Career Status */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <Briefcase className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">职业状态 (Career Status)</h2>
                        <p className="text-sm text-slate-500">当前阶段: 找工作中...</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase font-bold">Experience</div>
                        <div className="text-2xl font-bold text-emerald-600">{stats.experience}</div>
                        <div className="text-xs text-slate-400">工作/实习经验</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase font-bold">Network</div>
                        <div className="text-2xl font-bold text-orange-600">{stats.network}</div>
                        <div className="text-xs text-slate-400">人脉连接</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase font-bold">English</div>
                        <div className="text-2xl font-bold text-purple-600">{stats.english}</div>
                        <div className="text-xs text-slate-400">语言能力</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase font-bold">资产</div>
                        <div className="text-2xl font-bold text-blue-600">${stats.money.toLocaleString()}</div>
                        <div className="text-xs text-slate-400">当前余额</div>
                    </div>
                </div>
            </div>

            {/* Career Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Income */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        赚钱途径 (Income)
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={handlePartTimeJob}
                            disabled={actionPoints < 3}
                            className="w-full p-4 rounded-lg border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800">打工 (Part-time Job)</span>
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">-3 AP</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">+$200 | 可能遇到黑心老板...</p>
                        </button>
                    </div>
                </div>

                {/* Career Development */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        职业发展 (Career Dev)
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={handleJobHunting}
                            disabled={actionPoints < 4}
                            className="w-full p-4 rounded-lg border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800">海投简历 (Job Hunting)</span>
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">-4 AP</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">高风险高回报 | 可能被拒，也可能收到面试</p>
                        </button>

                        <button
                            onClick={handleNetworking}
                            disabled={actionPoints < 2}
                            className="w-full p-4 rounded-lg border-2 border-slate-100 hover:border-orange-500 hover:bg-orange-50 transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800">社交 (Networking)</span>
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">-2 AP</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">参加行业活动 | +Network, -$30</p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Warning */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                    <strong>签证提醒:</strong> 作为留学生，你每周只能工作 48 小时。
                    毕业后如果找不到 Sponsor，你将面临回国或签证过期的风险。
                </div>
            </div>
        </div>
    );
};
