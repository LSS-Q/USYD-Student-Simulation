import React, { useState } from 'react';
import { Trophy, X } from 'lucide-react';
import { useAchievementStore, ACHIEVEMENT_DEFS } from '../../stores/useAchievementStore';
import clsx from 'clsx';

interface AchievementPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AchievementPanel: React.FC<AchievementPanelProps> = ({ isOpen, onClose }) => {
    const { unlockedAchievements, isUnlocked } = useAchievementStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Trophy className="w-6 h-6" />
                        成就 (Achievements)
                    </h2>
                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unlockedAchievements.length} / {ACHIEVEMENT_DEFS.length}
                    </span>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3">
                    {ACHIEVEMENT_DEFS.map((ach) => {
                        const unlocked = isUnlocked(ach.id);
                        return (
                            <div
                                key={ach.id}
                                className={clsx(
                                    "p-4 rounded-xl border-2 transition flex items-start gap-3",
                                    unlocked
                                        ? "bg-amber-50 border-amber-200"
                                        : "bg-slate-50 border-slate-200 opacity-50 grayscale"
                                )}
                            >
                                <span className="text-3xl">{ach.icon}</span>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">{ach.name}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{ach.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
