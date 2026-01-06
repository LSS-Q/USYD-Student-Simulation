import React, { useEffect } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { useLegacyStore } from '../stores/useLegacyStore';
import { ENDINGS, EndingType } from '../types/endings';
import { Trophy, Home, Award, Frown, Sparkles, BookOpen } from 'lucide-react';
import clsx from 'clsx';
import { EVENT_IMAGES } from '../assets/index';

export const EndingScreen: React.FC = () => {
    const { gameOverReason, resetGame, stats } = useGameStore();
    const { unlockEnding } = useLegacyStore();

    const endingId = gameOverReason as EndingType;
    const ending = ENDINGS[endingId] || ENDINGS['dropout']; // Fallback

    useEffect(() => {
        // Unlock Ending and Award Points
        unlockEnding(ending.id, ending.legacyPointsReward);
    }, [endingId]);

    const handleReturn = () => {
        resetGame(); // Goes back to Intro
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-500">
                {/* Event Image Header */}
                {(ending.id === 'pr_granted' || ending.id === 'forced_departure') && (
                    <div className="h-48 overflow-hidden">
                        <img
                            src={ending.id === 'pr_granted' ? EVENT_IMAGES['pr_success'] : EVENT_IMAGES['visa_expires']}
                            alt={ending.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div className={clsx("p-8 text-center flex flex-col items-center", ending.color.replace('text-', 'bg-').replace('600', '100'))}>
                    <div className={clsx("w-24 h-24 rounded-full flex items-center justify-center mb-4 bg-white shadow-md", ending.color)}>
                        {ending.id === 'pr_granted' && <Award className="w-12 h-12" />}
                        {ending.id === 'forced_departure' && <Frown className="w-12 h-12" />}
                        {ending.id === 'global_talent' && <Home className="w-12 h-12" />}
                        {ending.id === 'entrepreneur' && <Trophy className="w-12 h-12" />}
                        {ending.id === 'academic' && <BookOpen className="w-12 h-12" />}
                        {ending.id === 'dropout' && <Frown className="w-12 h-12" />}
                    </div>
                    <h1 className={clsx("text-3xl font-bold mb-2", ending.color)}>{ending.title}</h1>
                    <p className="text-slate-600 italic">"{ending.description}"</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl text-center">
                            <h3 className="text-xs font-bold text-slate-400 uppercase">Final Savings</h3>
                            <p className="text-xl font-bold text-slate-800">${stats.money.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl text-center">
                            <h3 className="text-xs font-bold text-slate-400 uppercase">Final WAM</h3>
                            <p className="text-xl font-bold text-slate-800">{stats.wam}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-yellow-800">Legacy Points Earned</h3>
                                <p className="text-xs text-yellow-600">Use these to unlock buffs next game!</p>
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">+{ending.legacyPointsReward}</span>
                    </div>

                    <button
                        onClick={handleReturn}
                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold shadow-lg transition transform active:scale-95"
                    >
                        Return to Menu
                    </button>
                </div>
            </div>
        </div>
    );
};
