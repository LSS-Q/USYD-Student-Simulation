import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { NPC_DATA } from '../../data/npcs';
import { GIFT_ITEMS, ALL_ITEMS } from '../../data/items';
import { NPCCategory } from '../../types/game';
import { DatingModal } from '../games/DatingModal';
import { ChatModal } from '../games/ChatModal';
import { MessageCircle, Gift, Heart, Users, Briefcase, GraduationCap, Coffee, ShoppingBag, X, Tag } from 'lucide-react';
import clsx from 'clsx';
import { SoundManager } from '../../utils/SoundManager';
import { NPC_AVATARS } from '../../assets/index';

// --- Gift Modal Component ---
interface GiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    npcId: string | null;
}

const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, npcId }) => {
    const { inventory, stats, buyGift, giveGift } = useGameStore();

    if (!isOpen || !npcId) return null;
    const npc = NPC_DATA[npcId];

    const handleBuy = (itemId: string) => {
        SoundManager.playClick();
        buyGift(itemId);
    };

    const handleGive = (itemId: string) => {
        SoundManager.playSuccess(); // Or generic interaction sound
        giveGift(npcId, itemId);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Send Gift to {npc.name}</h3>
                        <p className="text-xs text-slate-500">Choose carefully! They have their own taste.</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.values(GIFT_ITEMS).map(item => {
                        const owned = inventory.includes(item.id);
                        const canAfford = stats.money >= item.price;

                        return (
                            <div key={item.id} className="border border-slate-200 rounded-lg p-3 hover:border-emerald-300 transition bg-white flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-700">{item.name}</h4>
                                    {item.tags && (
                                        <div className="flex gap-1">
                                            {item.tags.map(tag => (
                                                <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full capitalize">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 flex-1 mb-3">{item.description}</p>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="font-mono text-sm font-bold text-slate-600">${item.price}</span>

                                    {owned ? (
                                        <button
                                            onClick={() => handleGive(item.id)}
                                            className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded flex items-center gap-1 transition shadow-sm hover:shadow-pink-200"
                                        >
                                            <Gift className="w-3 h-3" />
                                            Give
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleBuy(item.id)}
                                            disabled={!canAfford}
                                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded flex items-center gap-1 transition"
                                        >
                                            <ShoppingBag className="w-3 h-3" />
                                            Buy
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 text-sm text-slate-500 flex justify-between items-center rounded-b-xl">
                    <span>Current Balance: <strong className="text-emerald-600">${stats.money}</strong></span>
                    <span className="text-xs">Buying puts item in inventory to give later or now.</span>
                </div>
            </div>
        </div>
    );
};

// --- Main View ---

export const NetworkView: React.FC = () => {
    const { npcRelations, interactWithNPC, stats, actionPoints } = useGameStore();
    const [filter, setFilter] = useState<NPCCategory | 'all'>('all');
    const [giftModalState, setGiftModalState] = useState<{ isOpen: boolean, npcId: string | null }>({ isOpen: false, npcId: null });
    const [datingModalState, setDatingModalState] = useState<{ isOpen: boolean, npcId: string | null }>({ isOpen: false, npcId: null });
    const [chatModalState, setChatModalState] = useState<{ isOpen: boolean, npcId: string | null }>({ isOpen: false, npcId: null });

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

    const handleChat = (id: string) => {
        setChatModalState({ isOpen: true, npcId: id });
        SoundManager.playClick();
    };

    const handleDate = (id: string) => {
        setDatingModalState({ isOpen: true, npcId: id });
        SoundManager.playClick();
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <GiftModal
                isOpen={giftModalState.isOpen}
                npcId={giftModalState.npcId}
                onClose={() => setGiftModalState({ isOpen: false, npcId: null })}
            />
            <DatingModal
                isOpen={datingModalState.isOpen}
                npcId={datingModalState.npcId}
                onClose={() => setDatingModalState({ isOpen: false, npcId: null })}
            />
            <ChatModal
                isOpen={chatModalState.isOpen}
                npcId={chatModalState.npcId}
                onClose={() => setChatModalState({ isOpen: false, npcId: null })}
            />

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
            <div className="flex-1 overflow-y-auto pr-2 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {npcs.map(npc => {
                        const rel = npcRelations[npc.id] || 0;

                        return (
                            <div key={npc.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col h-full hover:shadow-md transition group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {NPC_AVATARS[npc.id] ? (
                                            <img
                                                src={NPC_AVATARS[npc.id]}
                                                alt={npc.name}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-400">
                                                {npc.name[0]}
                                            </div>
                                        )}
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
                                        ></div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-3 gap-2 mt-auto">
                                    <button
                                        onClick={() => handleChat(npc.id)}
                                        disabled={actionPoints < 1}
                                        className="flex flex-col items-center justify-center p-2 rounded bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="-1 AP"
                                    >
                                        <MessageCircle className="w-4 h-4 mb-1" />
                                        <span className="text-[10px] font-bold">Chat</span>
                                    </button>
                                    <button
                                        onClick={() => setGiftModalState({ isOpen: true, npcId: npc.id })}
                                        className="flex flex-col items-center justify-center p-2 rounded bg-slate-50 hover:bg-pink-50 text-slate-600 hover:text-pink-600 transition"
                                        title="Send Gift"
                                    >
                                        <Gift className="w-4 h-4 mb-1" />
                                        <span className="text-[10px] font-bold">Gift</span>
                                    </button>
                                    <button
                                        onClick={() => handleDate(npc.id)}
                                        disabled={actionPoints < 2 || stats.money < 100}
                                        className="flex flex-col items-center justify-center p-2 rounded bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="-2 AP, -$100"
                                    >
                                        <Heart className="w-4 h-4 mb-1" />
                                        <span className="text-[10px] font-bold">Date</span>
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
