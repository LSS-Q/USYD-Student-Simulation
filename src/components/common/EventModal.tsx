import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import clsx from 'clsx';
import { Play, SkipForward, AlertTriangle, GraduationCap, Briefcase, Coffee, ArrowRight, Zap, TrendingUp, Brain } from 'lucide-react';

export const EventModal: React.FC = () => {
    const { currentEvent, handleEventOption } = useGameStore();

    if (!currentEvent) return null;

    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'academic':
                return {
                    label: '学业事件 (Academic)',
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                    icon: GraduationCap,
                    border: 'border-blue-100',
                    gradient: 'from-blue-500 to-indigo-600'
                };
            case 'career':
                return {
                    label: '职业探索 (Career)',
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-50',
                    icon: Briefcase,
                    border: 'border-emerald-100',
                    gradient: 'from-emerald-500 to-teal-600'
                };
            case 'life':
                return {
                    label: '生活琐事 (Life)',
                    color: 'text-rose-600',
                    bg: 'bg-rose-50',
                    icon: Coffee,
                    border: 'border-rose-100',
                    gradient: 'from-rose-400 to-orange-500'
                };
            default:
                return {
                    label: '奇遇 (Random)',
                    color: 'text-purple-600',
                    bg: 'bg-purple-50',
                    icon: AlertTriangle,
                    border: 'border-purple-100',
                    gradient: 'from-purple-500 to-blue-500'
                };
        }
    };

    const config = getTypeConfig(currentEvent.type);
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-white/20 flex flex-col max-h-[85vh] transform animate-in zoom-in-95 duration-300">

                {/* Header Image Area */}
                <div className={clsx("h-40 relative flex items-center justify-center bg-gradient-to-br transition-all", config.gradient)}>
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    <Icon className="w-16 h-16 text-white/50 relative z-10" />

                    {/* Badge */}
                    <div className="absolute -bottom-4 right-8 px-4 py-2 bg-white rounded-full shadow-lg border border-slate-100 flex items-center gap-2">
                        <div className={clsx("w-2 h-2 rounded-full animate-pulse", config.color.replace('text', 'bg'))}></div>
                        <span className={clsx("text-[10px] font-black uppercase tracking-widest", config.color)}>
                            {currentEvent.type}
                        </span>
                    </div>
                </div>

                <div className="p-8 pt-10 overflow-y-auto space-y-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight mb-3">
                            {currentEvent.title}
                        </h2>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <p className="text-slate-600 text-sm leading-relaxed italic">
                                "{currentEvent.description}"
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <span>做出抉择 (Make a Choice)</span>
                            <div className="h-px bg-slate-100 flex-1"></div>
                        </div>

                        {currentEvent.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleEventOption(option)}
                                className="w-full text-left p-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 group relative overflow-hidden active:scale-[0.98]"
                            >
                                <div className="flex justify-between items-center mb-1 relative z-10">
                                    <div className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                                        {option.label}
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                </div>

                                {option.description && (
                                    <div className="text-xs text-slate-500 mt-1 relative z-10">
                                        {option.description}
                                    </div>
                                )}

                                {option.cost && (
                                    <div className="mt-3 flex flex-wrap gap-2 relative z-10">
                                        {option.cost.ap && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-[10px] font-bold text-amber-700">
                                                <Zap className="w-2.5 h-2.5" /> -{option.cost.ap} AP
                                            </span>
                                        )}
                                        {option.cost.money && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-[10px] font-bold text-emerald-700">
                                                <TrendingUp className="w-2.5 h-2.5" /> -${option.cost.money}
                                            </span>
                                        )}
                                        {option.cost.sanity && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-[10px] font-bold text-rose-700">
                                                <Brain className="w-2.5 h-2.5" /> -{option.cost.sanity} Sanity
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
