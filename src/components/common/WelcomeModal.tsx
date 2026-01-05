import React, { useState, useEffect } from 'react';
import { Brain, Activity, Award, X, Sparkles, Clock, Globe } from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';

export const WelcomeModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { phase, visaStatus } = useGameStore();

    useEffect(() => {
        // Show only at the very start of the game
        const hasSeenTutorial = localStorage.getItem('tutorial_seen');
        if (phase === 'student' && visaStatus.expiryDays > 700 && !hasSeenTutorial) {
            setIsOpen(true);
        }
    }, [phase, visaStatus]);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('tutorial_seen', 'true');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-white/20 flex flex-col relative animate-in zoom-in-95 duration-300">
                
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition text-slate-400 hover:text-slate-600 z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col md:flex-row h-full">
                    {/* Left: Hero Image / Welcome */}
                    <div className="md:w-2/5 bg-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
                        <div className="z-10">
                            <h2 className="text-2xl font-bold mb-2">Welcome to USYD!</h2>
                            <p className="text-blue-200 text-sm leading-relaxed">
                                恭喜你入学。接下来两年，你将体验真实的澳洲留学生活。
                            </p>
                        </div>
                        <div className="z-10 mt-8">
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                                <Clock className="w-3 h-3 text-emerald-400" />
                                <span>Visa Remaining: {visaStatus.expiryDays} Days</span>
                            </div>
                        </div>
                        
                        {/* Decor */}
                        <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-blue-600 rounded-full blur-[50px] opacity-30"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-purple-600 rounded-full blur-[40px] opacity-30"></div>
                    </div>

                    {/* Right: Tutorial Content */}
                    <div className="md:w-3/5 p-8 bg-white">
                        <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            生存指南 (Survival Guide)
                        </h3>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0 text-pink-600">
                                    <Brain className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">关注 Sanity (心态)</h4>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        留学生活压力巨大，Sanity 过低会导致崩溃。记得多休息或通过娱乐来恢复心态。
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">积累 PR 分数</h4>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        你的终极目标是获得 PR。你需要尽早规划雅思 (English)、工作经验 (Experience) 和 WAM。
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">平衡 Action Points (AP)</h4>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        每个季度你的精力有限。在学习 (Study)、打工 (Job) 和休息 (Rest) 之间找到平衡点。
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleClose}
                            className="w-full mt-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                        >
                            明白，开始我的留学生活
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
