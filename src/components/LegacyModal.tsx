import React from 'react';
import { useLegacyStore, LEGACY_BUFFS } from '../stores/useLegacyStore';
import { X, Trophy, Check, Lock } from 'lucide-react';
import clsx from 'clsx';
import { SoundManager } from '../utils/SoundManager';

interface LegacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LegacyModal: React.FC<LegacyModalProps> = ({ isOpen, onClose }) => {
    const { legacyPoints, activeBuffs, toggleBuff } = useLegacyStore();

    if (!isOpen) return null;

    const handleToggle = (buffId: string, cost: number) => {
        toggleBuff(buffId, cost);
        SoundManager.playClick();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500 rounded-lg text-slate-900">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Alumni Network</h2>
                            <p className="text-slate-300 text-sm">Use your legacy points to gain advantages</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Points Display */}
                <div className="bg-yellow-50 p-4 border-b border-yellow-100 flex justify-between items-center px-8">
                    <span className="text-yellow-800 font-bold uppercase text-sm tracking-wider">Available Points</span>
                    <span className="text-3xl font-bold text-yellow-600 font-mono">{legacyPoints}</span>
                </div>

                {/* Buffs List */}
                <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50">
                    {LEGACY_BUFFS.map(buff => {
                        const isActive = activeBuffs.includes(buff.id);
                        const canAfford = legacyPoints >= buff.cost;

                        return (
                            <div
                                key={buff.id}
                                className={clsx(
                                    "relative p-4 rounded-xl border-2 transition-all flex justify-between items-center",
                                    isActive
                                        ? "bg-blue-50 border-blue-500 shadow-md"
                                        : "bg-white border-slate-200 hover:border-blue-200"
                                )}
                            >
                                <div className="flex-1">
                                    <h3 className={clsx("font-bold text-lg", isActive ? "text-blue-700" : "text-slate-700")}>
                                        {buff.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">{buff.description}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className={clsx("font-bold text-lg", isActive ? "text-blue-600" : "text-slate-600")}>
                                            {buff.cost} Series
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleToggle(buff.id, buff.cost)}
                                        disabled={!isActive && !canAfford}
                                        className={clsx(
                                            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                                            isActive
                                                ? "bg-blue-600 text-white shadow-lg hover:bg-red-500 hover:rotate-90"
                                                : canAfford
                                                    ? "bg-slate-100 text-slate-400 hover:bg-green-500 hover:text-white"
                                                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                                        )}
                                    >
                                        {isActive ? <Check className="w-6 h-6" /> : (canAfford ? <Trophy className="w-5 h-5" /> : <Lock className="w-5 h-5" />)}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
