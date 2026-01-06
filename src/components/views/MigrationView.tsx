import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Plane, FileText, Clock, Award, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { DEGREE_CONFIG } from '../../data/constants';

export const MigrationView: React.FC = () => {
    const {
        stats,
        visaStatus,
        profile,
        actionPoints,
        useActionPoints,
        updateStats
    } = useGameStore();

    // Helper to calculate age points
    const getAgePoints = (age: number) => {
        if (age >= 18 && age <= 24) return 25;
        if (age >= 25 && age <= 32) return 30;
        if (age >= 33 && age <= 39) return 25;
        if (age >= 40 && age <= 44) return 15;
        return 0;
    };

    // Helper to get age range label
    const getAgeRangeLabel = (age: number) => {
        if (age >= 18 && age <= 24) return '18-24';
        if (age >= 25 && age <= 32) return '25-32';
        if (age >= 33 && age <= 39) return '33-39';
        if (age >= 40 && age <= 44) return '40-44';
        return '45+';
    };

    // Helper to calculate education points
    const getEduPoints = (degree: string) => {
        if (degree === 'phd') return 20;
        return 15; // Bachelor and Master are both 15 in standard points test
    };

    // Calculate PR requirements (Dynamic version)
    const prRequirements = {
        age: { current: stats.age, points: getAgePoints(stats.age) },
        english: { current: stats.english, required: 65, points: stats.english >= 79 ? 20 : stats.english >= 65 ? 10 : 0 },
        education: { current: profile.degree, points: getEduPoints(profile.degree) },
        experience: { current: stats.experience, required: 50, points: stats.experience >= 50 ? 15 : stats.experience >= 30 ? 10 : 5 },
    };

    const totalPoints = Object.values(prRequirements).reduce((sum, req) => sum + req.points, 0);
    const passThreshold = 65;

    // Study for PTE
    const handlePTEStudy = () => {
        if (useActionPoints(3)) {
            updateStats({ english: 5, sanity: -10 });
        }
    };

    // Apply for State Nomination
    const handleStateNom = () => {
        if (stats.money < 500) {
            alert("申请费需要 $500，攒攒钱再来吧。");
            return;
        }

        if (useActionPoints(5)) {
            updateStats({ pr_score: 5, sanity: -5, money: -500 }); // Application fee
        }
    };

    return (
        <div className="space-y-6">
            {/* Visa Status */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${visaStatus.expiryDays < 365 ? 'bg-red-100' : 'bg-blue-100'}`}>
                            <Plane className={`w-6 h-6 ${visaStatus.expiryDays < 365 ? 'text-red-600' : 'text-blue-600'}`} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">签证状态 (Visa Status)</h2>
                            <p className="text-sm text-slate-500">{visaStatus.subclass.replace('_', ' ').toUpperCase()}</p>
                        </div>
                    </div>
                    <div className={`text-right ${visaStatus.expiryDays < 365 ? 'text-red-600' : 'text-blue-600'}`}>
                        <div className="text-3xl font-bold font-mono">{visaStatus.expiryDays}</div>
                        <div className="text-xs uppercase font-bold">Days Left</div>
                    </div>
                </div>

                {visaStatus.expiryDays < 365 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span><strong>紧急!</strong> 签证即将到期，请尽快获得 PR 或 Sponsor！</span>
                    </div>
                )}
            </div>

            {/* PR Points Calculator */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">移民分数 (PR Points)</h2>
                        <p className="text-sm text-slate-500">189/190 技术移民打分 (简化版)</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Age */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            {prRequirements.age.points > 0 ?
                                <CheckCircle className="w-4 h-4 text-green-500" /> :
                                <XCircle className="w-4 h-4 text-red-500" />
                            }
                            <span className="font-medium">年龄 ({getAgeRangeLabel(stats.age)}) - 当前 {stats.age} 岁</span>
                        </div>
                        <span className={`font-bold ${prRequirements.age.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            +{prRequirements.age.points} pts
                        </span>
                    </div>

                    {/* English */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            {stats.english >= 65 ?
                                <CheckCircle className="w-4 h-4 text-green-500" /> :
                                <XCircle className="w-4 h-4 text-red-500" />
                            }
                            <span className="font-medium">英语 (PTE {stats.english}/90)</span>
                        </div>
                        <span className={`font-bold ${prRequirements.english.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            +{prRequirements.english.points} pts
                        </span>
                    </div>

                    {/* Education */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="font-medium">
                                学历 ({DEGREE_CONFIG[profile.degree].label})
                            </span>
                        </div>
                        <span className="font-bold text-green-600">+{prRequirements.education.points} pts</span>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                            {stats.experience >= 30 ?
                                <CheckCircle className="w-4 h-4 text-green-500" /> :
                                <XCircle className="w-4 h-4 text-red-500" />
                            }
                            <span className="font-medium">工作经验 ({stats.experience} EXP)</span>
                        </div>
                        <span className={`font-bold ${prRequirements.experience.points >= 10 ? 'text-green-600' : 'text-amber-600'}`}>
                            +{prRequirements.experience.points} pts
                        </span>
                    </div>

                    {/* Total */}
                    <div className="border-t border-slate-200 pt-4 mt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">总分 (Total)</span>
                            <span className={`text-2xl font-bold ${totalPoints >= passThreshold ? 'text-green-600' : 'text-red-600'}`}>
                                {totalPoints} / {passThreshold}
                            </span>
                        </div>
                        {totalPoints >= passThreshold ? (
                            <p className="text-sm text-green-600 mt-1">✓ 达到最低邀请分数！可以提交 EOI。</p>
                        ) : (
                            <p className="text-sm text-red-600 mt-1">✗ 未达到最低分数，需要继续努力。</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Migration Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-blue-600" />
                        提升分数 (Improve Points)
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={handlePTEStudy}
                            disabled={actionPoints < 3}
                            className="w-full p-4 rounded-lg border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50 transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800">刷 PTE</span>
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">-3 AP</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">+5 English, -10 Sanity</p>
                        </button>

                        <button
                            onClick={handleStateNom}
                            disabled={actionPoints < 5 || stats.money < 500}
                            className="w-full p-4 rounded-lg border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition text-left disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-800">申请州担保</span>
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">-5 AP, -$500</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">+5 PR Score (需要符合州担条件)</p>
                        </button>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-3">
                        <Clock className="w-5 h-5" />
                        移民时间线
                    </h3>
                    <ul className="space-y-2 text-sm text-amber-700">
                        <li>• 485 Graduate Visa: 2-3年工作签</li>
                        <li>• 需要 {passThreshold}+ 分才能被邀请</li>
                        <li>• 或者找到愿意 Sponsor 的雇主</li>
                        <li>• 签证过期前未获得 PR = Game Over</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
