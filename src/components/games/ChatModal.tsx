import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { NPC_DATA } from '../../data/npcs';
import { DIALOGUE_TREES } from '../../data/dialogues';
import { DialogueNode } from '../../types/game';
import { MessageCircle, X, ArrowLeft } from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';
import clsx from 'clsx';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    npcId: string | null;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, npcId }) => {
    const { npcRelations, updateStats, addLog, actionPoints, useActionPoints } = useGameStore(); // Store Access
    const [currentNode, setCurrentNode] = useState<DialogueNode | null>(null);
    const [history, setHistory] = useState<{ sender: 'npc' | 'player', text: string }[]>([]);

    useEffect(() => {
        if (isOpen && npcId) {
            initChat(npcId);
        }
    }, [isOpen, npcId]);

    const initChat = (id: string) => {
        setHistory([]);
        // Decide Root Node
        const rel = npcRelations[id] || 0;
        const rootId = rel >= 50 ? 'root_high_rel' : 'root_low_rel';

        const rootNode = DIALOGUE_TREES[rootId];
        setCurrentNode(rootNode);
        setHistory([{ sender: 'npc', text: rootNode.text }]);
    };

    const handleOption = (option: any) => { // Type DialogueOption
        // Check req
        // (Assuming reqs passed if shown, or check here)

        // Add Player Msg
        setHistory(prev => [...prev, { sender: 'player', text: option.text }]);
        SoundManager.playClick();

        // Apply Effects
        if (option.effect) {
            const currentRel = npcRelations[npcId!] || 0;
            const relChange = option.effect.rel || 0;

            // Should call store action to update rel
            // Using a hack for now or need generic action
            useGameStore.setState(s => ({
                npcRelations: {
                    ...s.npcRelations,
                    [npcId!]: Math.min(100, (s.npcRelations[npcId!] || 0) + relChange)
                },
                stats: { ...s.stats, sanity: s.stats.sanity + (option.effect.sanity || 0) }
            }));
        }

        // Navigate
        if (option.nextId && DIALOGUE_TREES[option.nextId]) {
            setTimeout(() => {
                const nextNode = DIALOGUE_TREES[option.nextId!];
                setCurrentNode(nextNode);
                setHistory(prev => [...prev, { sender: 'npc', text: nextNode.text }]);
                SoundManager.playClick(); // NPC Reply sound
            }, 600);
        } else {
            // End Chat
            setTimeout(() => {
                onClose();
                addLog(`Finished chatting with ${NPC_DATA[npcId!].name}.`);
            }, 1000);
        }
    };

    if (!isOpen || !npcId || !currentNode) return null;
    const npc = NPC_DATA[npcId];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full flex flex-col h-[70vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-blue-50 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 font-bold flex items-center justify-center">
                            {npc.name[0]}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{npc.name}</h3>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" /> Chatting
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {history.map((msg, idx) => (
                        <div key={idx} className={clsx("flex w-full", msg.sender === 'player' ? "justify-end" : "justify-start")}>
                            <div className={clsx(
                                "max-w-[80%] p-3 rounded-xl text-sm shadow-sm",
                                msg.sender === 'player'
                                    ? "bg-blue-600 text-white rounded-tr-none"
                                    : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                            )}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-100 bg-white rounded-b-xl space-y-2">
                    {currentNode.options.map((opt, idx) => {
                        const canChoose = !opt.req || (npcRelations[npcId!] || 0) >= (opt.req.minRel || 0);
                        if (!canChoose) return null;

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOption(opt)}
                                className="w-full py-3 px-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-100 hover:border-blue-200 rounded-lg text-sm font-medium transition text-left"
                            >
                                {opt.text}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
