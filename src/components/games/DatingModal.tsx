import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { NPC_DATA } from '../../data/npcs';
import { SoundManager } from '../../utils/SoundManager';
import { Heart, X, Coffee, Utensils, Film, MapPin, Beer } from 'lucide-react';
import clsx from 'clsx';

interface DatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    npcId: string | null;
}

const DATING_SPOTS = [
    { id: 'park', name: 'Hyde Park Walk', cost: 0, icon: MapPin, desc: 'Free & Relaxed. Good for talking.', minRel: 0, bonus: 5 },
    { id: 'cafe', name: 'Campos Coffee', cost: 30, icon: Coffee, desc: 'Casual date. Standards.', minRel: 10, bonus: 10 },
    { id: 'cinema', name: 'Event Cinemas', cost: 60, icon: Film, desc: 'Movie night. Low interaction.', minRel: 20, bonus: 15 },
    { id: 'restaurant', name: 'The Grounds', cost: 150, icon: Utensils, desc: 'Fancy brunch. Impressive.', minRel: 40, bonus: 25 },
    { id: 'bar', name: 'Opera Bar', cost: 100, icon: Beer, desc: 'Drinks with a view. Fun.', minRel: 30, bonus: 20 },
];

export const DatingModal: React.FC<DatingModalProps> = ({ isOpen, onClose, npcId }) => {
    const { stats, updateStats, updateMoney, addLog, npcRelations, actionPoints, useActionPoints } = useGameStore();
    const [result, setResult] = useState<{ success: boolean; msg: string; relChange: number } | null>(null);

    if (!isOpen || !npcId) return null;
    const npc = NPC_DATA[npcId];
    const currentRel = npcRelations[npcId] || 0;

    const handleDate = (spotId: string) => {
        const spot = DATING_SPOTS.find(s => s.id === spotId);
        if (!spot) return;

        // Check Cost & AP
        if (stats.money < spot.cost) {
            alert("Not enough money!");
            return;
        }
        if (actionPoints < 3) { // Date is expensive AP
            alert("Not enough AP (Need 3)");
            return;
        }

        // Consume Resources
        useActionPoints(3);
        updateMoney(-spot.cost);

        // Calculate Outcome
        // Success Chance = 30 + (Rel / 2) + Luck
        const chance = 30 + (currentRel / 2) + (Math.random() * 40); // 30-120 range roughly
        // Difficulty check based on spot? 
        // Logic: Expensive spots require higher base relation to not feel "awkward", but give higher reward if successful.
        // Simplified: Always succeeds if Rel >= spot.minRel? Or chance?
        // Let's do random chance but heavily weighted by Relation.

        const success = chance >= 50 && currentRel >= spot.minRel;

        if (success) {
            const relGain = 15 + spot.bonus;
            SoundManager.playSuccess();
            setResult({
                success: true,
                msg: `Great date at ${spot.name}! You got to know each other better.`,
                relChange: relGain
            });
            // Update Store Rel (Need helper or direct update)
            useGameStore.setState(s => ({
                npcRelations: {
                    ...s.npcRelations,
                    [npcId]: Math.min(100, (s.npcRelations[npcId] || 0) + relGain)
                },
                stats: { ...s.stats, sanity: Math.min(100, s.stats.sanity + 15) }
            }));
            addLog(`Date with ${npc.name} at ${spot.name}: Success! (+${relGain} Rel)`);
        } else {
            // Fail
            SoundManager.playFail(); // Add fail sound later or use Click
            let failMsg = "It was awkward...";
            if (currentRel < spot.minRel) failMsg = "It felt too soon for this venue.";

            setResult({
                success: false,
                msg: `${failMsg} You didn't click today.`,
                relChange: 2
            });
            useGameStore.setState(s => ({
                npcRelations: {
                    ...s.npcRelations,
                    [npcId]: Math.min(100, (s.npcRelations[npcId] || 0) + 2) // Small gain for trying
                },
                stats: { ...s.stats, sanity: s.stats.sanity - 5 }
            }));
            addLog(`Date with ${npc.name} at ${spot.name}: Awkward... (+2 Rel)`);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-pink-50 rounded-t-xl">
                    <h3 className="font-bold text-lg text-pink-800 flex items-center gap-2">
                        <Heart className="w-5 h-5" /> Date with {npc.name}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-pink-200 rounded-full transition text-pink-800">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {result ? (
                        <div className="text-center py-10 space-y-4 animate-in zoom-in">
                            <div className={clsx("w-20 h-20 rounded-full flex items-center justify-center mx-auto", result.success ? "bg-pink-100 text-pink-600" : "bg-slate-100 text-slate-500")}>
                                {result.success ? <Heart className="w-10 h-10 fill-current" /> : <Coffee className="w-10 h-10" />}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">{result.success ? "Sweet!" : "Oh no..."}</h2>
                            <p className="text-slate-600">{result.msg}</p>
                            <div className="text-sm font-bold text-pink-600">
                                Relation {result.relChange > 0 ? '+' : ''}{result.relChange}
                            </div>
                            <button onClick={onClose} className="px-8 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition">
                                Close
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-slate-500 mb-4">Choose a location. Cost and success rate vary.</p>
                            <div className="space-y-3">
                                {DATING_SPOTS.map(spot => {
                                    const canAfford = stats.money >= spot.cost;
                                    const isRelHighEnough = currentRel >= spot.minRel;

                                    return (
                                        <button
                                            key={spot.id}
                                            onClick={() => handleDate(spot.id)}
                                            disabled={!canAfford}
                                            className={clsx(
                                                "w-full p-4 rounded-xl border-2 flex items-center gap-4 transition text-left group",
                                                canAfford
                                                    ? "border-slate-100 hover:border-pink-400 hover:bg-pink-50 cursor-pointer"
                                                    : "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                                            )}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:scale-110 transition">
                                                <spot.icon className="w-6 h-6 text-pink-500" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-bold text-slate-800">{spot.name}</h4>
                                                    <span className="font-mono text-slate-600">${spot.cost}</span>
                                                </div>
                                                <p className="text-xs text-slate-500">{spot.desc}</p>
                                                {!isRelHighEnough && (
                                                    <span className="text-[10px] text-amber-600 font-bold">Rel {spot.minRel}+ recommended</span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-6 text-center text-xs text-slate-400">
                                Requires 3 AP. Current Money: ${stats.money}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
