import React, { useState, useEffect } from 'react';
import { Brain, Play, X, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { SoundManager } from '../../utils/SoundManager';

interface MemoryGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (score: number) => void;
}

const GRID_SIZE = 3; // 3x3
const ROUNDS = [
    { level: 1, length: 3 },
    { level: 2, length: 4 },
    { level: 3, length: 5 },
];

export const MemoryGameModal: React.FC<MemoryGameModalProps> = ({ isOpen, onClose, onComplete }) => {
    const [gameState, setGameState] = useState<'intro' | 'displaying' | 'input' | 'result'>('intro');
    const [roundIndex, setRoundIndex] = useState(0);
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerInput, setPlayerInput] = useState<number[]>([]);
    const [activeSquare, setActiveSquare] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [resultMessage, setResultMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            resetGame();
        }
    }, [isOpen]);

    const resetGame = () => {
        setGameState('intro');
        setRoundIndex(0);
        setScore(0);
        setSequence([]);
        setPlayerInput([]);
        setResultMessage('');
    };

    const startRound = async () => {
        const roundConfig = ROUNDS[roundIndex];
        const newSequence = Array.from({ length: roundConfig.length }, () => Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)));

        setSequence(newSequence);
        setPlayerInput([]);
        setGameState('displaying');

        // Delay before flashing
        await new Promise(r => setTimeout(r, 1000));

        // Flash sequence
        for (let i = 0; i < newSequence.length; i++) {
            SoundManager.playClick(); // Beep
            setActiveSquare(newSequence[i]);
            await new Promise(r => setTimeout(r, 600)); // Lit duration
            setActiveSquare(null);
            await new Promise(r => setTimeout(r, 200)); // Gap
        }

        setGameState('input');
        // SoundManager.playSuccess(); // Your turn tone?
    };

    const handleSquareClick = (index: number) => {
        if (gameState !== 'input') return;

        SoundManager.playClick();
        const newInput = [...playerInput, index];
        setPlayerInput(newInput);
        setActiveSquare(index);
        setTimeout(() => setActiveSquare(null), 200);

        // Check validity immediately
        if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) {
            // Wrong input
            handleFail("Wrong square!");
            return;
        }

        // Check if complete
        if (newInput.length === sequence.length) {
            handleSuccess();
        }
    };

    const handleSuccess = () => {
        const currentRoundScore = 1; // 1 point per round
        const newScore = score + currentRoundScore;
        setScore(newScore);

        if (roundIndex < ROUNDS.length - 1) {
            // Next round
            SoundManager.playSuccess();
            setRoundIndex(prev => prev + 1);
            setTimeout(() => {
                startRound();
            }, 1000);
        } else {
            // All rounds done
            finishGame(newScore, "Perfect Memory!");
        }
    };

    const handleFail = (msg: string) => {
        // SoundManager.playFail(); 
        SoundManager.playClick(); // Fallback
        finishGame(score, msg);
    };

    const finishGame = (finalScore: number, msg: string) => {
        setScore(finalScore);
        setResultMessage(msg);
        setGameState('result');
    };

    const handleCollect = () => {
        onComplete(score);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col items-center p-6 relative">
                {/* Close Button (only functional in intro/result to prevent cheating?) Allow always */}
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6 flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                        <Brain className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Memory Matrix</h2>
                    <p className="text-sm text-slate-500">Round {roundIndex + 1}/{ROUNDS.length}</p>
                </div>

                {/* Game Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-slate-50 rounded-xl">
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                        <button
                            key={i}
                            disabled={gameState !== 'input'}
                            onClick={() => handleSquareClick(i)}
                            className={clsx(
                                "w-16 h-16 rounded-lg transition-all duration-100 shadow-sm border-2",
                                activeSquare === i
                                    ? "bg-blue-500 border-blue-600 shadow-blue-200 scale-95"
                                    : "bg-white border-slate-200 hover:bg-slate-50",
                                gameState === 'input' ? "cursor-pointer active:scale-95" : "cursor-default"
                            )}
                        />
                    ))}
                </div>

                {/* Status / Controls */}
                <div className="w-full text-center">
                    {gameState === 'intro' && (
                        <div className="space-y-4">
                            <p className="text-slate-600">Memorize the flashing pattern and repeat it.</p>
                            <button
                                onClick={startRound}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-blue-200"
                            >
                                <Play className="w-4 h-4" /> Start Focus
                            </button>
                        </div>
                    )}

                    {gameState === 'displaying' && (
                        <p className="font-bold text-blue-600 animate-pulse">Watch closely...</p>
                    )}

                    {gameState === 'input' && (
                        <p className="font-bold text-slate-600">Your turn!</p>
                    )}

                    {gameState === 'result' && (
                        <div className="space-y-4 animate-in zoom-in duration-300">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <h3 className="font-bold text-lg text-slate-800 mb-1">{resultMessage}</h3>
                                <div className="text-sm text-slate-500">
                                    Score: <span className="font-bold text-blue-600 text-lg">{score}</span> / 3
                                </div>
                                <div className="text-xs text-slate-400 mt-2">
                                    Stats: +{2 + score} WAM, +{score >= 3 ? 2 : 1} Int
                                </div>
                            </div>
                            <button
                                onClick={handleCollect}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition"
                            >
                                <CheckCircle className="w-4 h-4" /> Finish Session
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
