import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { ACADEMIC_EVENTS } from '../../data/events/academics';
import { GraduationCap, Users, MessageSquare, BookOpen, Zap } from 'lucide-react';
import clsx from 'clsx';

export const AcademicsView: React.FC = () => {
    const {
        stats,
        actionPoints,
        useActionPoints,
        updateStats,
        triggerEvent,
        profile
    } = useGameStore();

    // Simple Study Action
    const handleStudy = () => {
        if (useActionPoints(2)) {
            updateStats({ wam: 2, sanity: -5 });
        }
    };

    // Trigger Group Project Event
    const handleGroupProject = () => {
        if (actionPoints >= 2) {
            triggerEvent(ACADEMIC_EVENTS['group_project_start']);
        }
    };

    // Trigger Tutorial Event (with some randomness)
    const handleTutorial = () => {
        if (useActionPoints(1)) {
            // 30% chance to get called on
            if (Math.random() < 0.3) {
                triggerEvent(ACADEMIC_EVENTS['tutorial_question']);
            } else {
                updateStats({ wam: 1, sanity: -2 });
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Current Academic Status */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">学业状态 (Academic Status)</h2>
                        <p className="text-sm text-slate-500">{profile.degree} in {profile.major}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase font-bold">WAM</div>
                        <div className={clsx(
                            "text-2xl font-bold",
                            stats.wam >= 75 ? "text-green-600" : stats.wam >= 50 ? "text-amber-600" : "text-red-600"
                        )}>
                            {stats.wam}
                        </div>
                        <div className="text-xs text-slate-400">Weighted Average Mark</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase font-bold">English</div>
                        <div className="text-2xl font-bold text-purple-600">{stats.english}</div>
                        <div className="text-xs text-slate-400">PTE Equivalent</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase font-bold">Experience</div>
                        <div className="text-2xl font-bold text-emerald-600">{stats.experience}</div>
                        <div className="text-xs text-slate-400">Skill Points</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="text-xs text-slate-500 uppercase font-bold">Network</div>
                        <div className="text-2xl font-bold text-orange-600">{stats.network}</div>
                        <div className="text-xs text-slate-400">Connections</div>
                    </div>
                </div>
            </div>

            {/* Academic Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Study Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        日常学习 (Daily Study)
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={handleStudy}
                            disabled={actionPoints < 2}
                            className="w-full p-4 rounded-lg border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800">自习 (Self Study)</span>
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">-2 AP</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">+2 WAM, -5 Sanity</p>
                        </button>

                        <button
                            onClick={handleTutorial}
                            disabled={actionPoints < 1}
                            className="w-full p-4 rounded-lg border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50 transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800">上 Tutorial</span>
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">-1 AP</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">+1 WAM | 可能被老师点名提问...</p>
                        </button>
                    </div>
                </div>

                {/* Group Work */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-orange-600" />
                        小组作业 (Group Project)
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={handleGroupProject}
                            disabled={actionPoints < 2}
                            className="w-full p-4 rounded-lg border-2 border-dashed border-orange-200 hover:border-orange-500 hover:bg-orange-50 transition text-left disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800 group-hover:text-orange-700">开始新的 Group Assignment</span>
                                <span className="text-xs font-mono bg-orange-100 text-orange-700 px-2 py-1 rounded">Event</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">40% 的成绩取决于你的队友... 你准备好了吗？</p>
                        </button>

                        <div className="text-xs text-slate-400 italic p-2">
                            ⚠️ 警告：Group Project 可能导致严重的 Sanity 损失。请谨慎选择队友。
                        </div>
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                    <strong>Tips:</strong> 保持 WAM 在 65 以上可以避免 Academic Probation。
                    WAM 75+ 可以申请 Dean's List，对 PR 有帮助。
                </div>
            </div>
        </div>
    );
};
