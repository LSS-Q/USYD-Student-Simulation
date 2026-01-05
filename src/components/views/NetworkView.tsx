import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { NPC_DATA } from '../../data/npcs';
import { NPCCategory } from '../../types/game';
import { MessageCircle, Gift, Heart, Users, Briefcase, GraduationCap, Coffee, ShoppingBag } from 'lucide-react';
import clsx from 'clsx';

export const NetworkView: React.FC = () => {
    const { npcRelations, interactWithNPC, stats, actionPoints } = useGameStore();
    const [filter, setFilter] = useState<NPCCategory | 'all'>('all');

    const categories: { key: NPCCategory | 'all'; label: string; icon: React.ElementType }[] = [
        { key: 'all', label: 'All Contacts', icon: Users },
        { key: 'academic', label: 'Academic', icon: GraduationCap },
        { key: 'social', label: 'Social', icon: Coffee },
        { key: 'career', label: 'Career', icon: Briefcase },
        { key: 'romance', label: 'Romance', icon: Heart },
        { key: 'service', label: 'Services', icon: ShoppingBag },
    ];

    const npcs = Object.values(NPC_DATA).filter(npc => filter === 'all' || npc.category === filter);

    const getRelationColor = (rel: number) => {
        if (rel >= 80) return 'bg-pink-500';
        if (rel >= 60) return 'bg-emerald-500';
        if (rel >= 40) return 'bg-blue-500';
        if (rel >= 20) return 'bg-amber-500';
        return 'bg-slate-300';
    };

    const getRelationLabel = (rel: number) => {
        if (rel >= 80) return 'Close Partner';
        if (rel >= 60) return 'Good Friend';
        if (rel >= 40) return 'Friend';
        if (rel >= 20) return 'Acquaintance';
        return 'Stranger';
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header & Filter */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat.key}
                        onClick={() => setFilter(cat.key)}
                        className={clsx(
                            "px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all",
                            filter === cat.key
                                ? "bg-slate-800 text-white shadow-md"
                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                        )}
                    >
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* NPC Grid */}
            <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {npcs.map(npc => {
                        const rel = npcRelations[npc.id] || 0;

                        return (
                            <div key={npc.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col h-full hover:shadow-md transition group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-400">
                                            {npc.name[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 leading-tight">{npc.name}</h3>
                                            <p className="text-xs text-slate-500 font-medium">{npc.title}</p>
                                        </div>
                                    </div>
                                    <span className={clsx("text-[10px] px-2 py-0.5 rounded font-bold uppercase",
                                        npc.category === 'academic' ? "bg-blue-50 text-blue-600" :
                                            npc.category === 'social' ? "bg-amber-50 text-amber-600" :
                                                npc.category === 'career' ? "bg-emerald-50 text-emerald-600" :
                                                    npc.category === 'romance' ? "bg-pink-50 text-pink-600" :
                                                        "bg-purple-50 text-purple-600"
                                    )}>
                                        {npc.category}
                                    </span>
                                </div>

                                <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">
                                    {npc.desc}
                                </p>

                                {/* Relationship Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-bold text-slate-600">{getRelationLabel(rel)}</span>
                                        <span className="text-slate-400">{rel}/100</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={clsx("h-full transition-all duration-500", getRelationColor(rel))}
                                            style={{ width: `${rel}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-3 gap-2 mt-auto border-t border-slate-50 pt-3">
                                    <button
                                        onClick={() => interactWithNPC(npc.id, 'chat')}
                                        disabled={actionPoints < 1}
                                        className="flex flex-col items-center justify-center py-2 rounded hover:bg-slate-50 disabled:opacity-30 transition"
                                        title="-1 AP, +2 Rel"
                                    >
                                        <MessageCircle className="w-4 h-4 text-blue-500 mb-1" />
                                        <span className="text-[10px] font-bold text-slate-500">Chat</span>
                                    </button>

                                    <button
                                        onClick={() => interactWithNPC(npc.id, 'gift')}
                                        disabled={stats.money < 50}
                                        className="flex flex-col items-center justify-center py-2 rounded hover:bg-slate-50 disabled:opacity-30 transition"
                                        title="-$50, +15 Rel"
                                    >
                                        <Gift className="w-4 h-4 text-amber-500 mb-1" />
                                        <span className="text-[10px] font-bold text-slate-500">Gift</span>
                                    </button>

                                    {npc.category === 'romance' && (
                                        <button
                                            onClick={() => interactWithNPC(npc.id, 'date')}
                                            disabled={actionPoints < 2 || stats.money < 100}
                                            className="flex flex-col items-center justify-center py-2 rounded hover:bg-pink-50 disabled:opacity-30 transition"
                                            title="-2 AP, -$100, +10 Rel"
                                        >
                                            <Heart className="w-4 h-4 text-pink-500 mb-1" />
                                            <span className="text-[10px] font-bold text-slate-500">Date</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
