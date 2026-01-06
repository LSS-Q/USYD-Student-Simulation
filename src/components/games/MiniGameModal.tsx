import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, Trophy, Keyboard } from 'lucide-react';
import clsx from 'clsx';
import { SoundManager } from '../../utils/SoundManager';

interface MiniGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (score: number) => void;
}

const WORDS = [
    'Coffee', 'Latte', 'Order', 'Menu', 'Table', 'Water', 'Bill', 'Tips',
    'Burger', 'Fries', 'Sauce', 'Clean', 'Wipe', 'Serve', 'Smile', 'Fast',
    'Report', 'Excel', 'Email', 'Print', 'Copy', 'Scan', 'File', 'Data',
    'Meeting', 'Boss', 'Client', 'Call', 'Desk', 'Work', 'Team', 'Goal'
];

export const MiniGameModal: React.FC<MiniGameModalProps> = ({ isOpen, onClose, onComplete }) => {
    const [status, setStatus] = useState<'intro' | 'playing' | 'result'>('intro');
    const [timeLeft, setTimeLeft] = useState(15);
    const [score, setScore] = useState(0);
    const [currentWord, setCurrentWord] = useState('');
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            resetGame();
        }
    }, [isOpen]);

    useEffect(() => {
        if (status === 'playing') {
            if (timeLeft > 0) {
                const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                setStatus('result');
                SoundManager.playSuccess();
            }
        }
    }, [status, timeLeft]);

    useEffect(() => {
        if (status === 'playing' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [status]);

    const resetGame = () => {
        setStatus('intro');
        setTimeLeft(15);
        setScore(0);
        pickNewWord();
        setInput('');
    };

    const pickNewWord = () => {
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        setCurrentWord(word);
    };

    const startGame = () => {
        setStatus('playing');
        pickNewWord();
        SoundManager.playClick();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInput(val);

        if (val.toLowerCase() === currentWord.toLowerCase()) {
            // Success
            setScore(prev => prev + 1);
            setInput('');
            pickNewWord();
            SoundManager.playClick(); // Or a custom 'type' sound
        }
    };

    const handleComplete = () => {
        onComplete(score);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-2 border-slate-800">

                {/* Header */}
                <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2">
                        <Keyboard className="w-5 h-5 text-emerald-400" />
                        Part-time Hustle
                    </h3>
                    {status === 'intro' && (
                        <button onClick={onClose} className="text-slate-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="p-8 text-center">
                    {status === 'intro' && (
                        <div className="space-y-6">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                                <Keyboard className="w-10 h-10 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 mb-2">Ready to Work?</h2>
                                <p className="text-slate-500">
                                    Type as many words as you can in 15 seconds!
                                    <br />
                                    <span className="font-bold text-emerald-600">+$20 per word</span>
                                </p>
                            </div>
                            <button
                                onClick={startGame}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-lg hover:shadow-emerald-500/20"
                            >
                                Start Shift
                            </button>
                        </div>
                    )}

                    {status === 'playing' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Clock className="w-4 h-4" />
                                    {timeLeft}s
                                </div>
                                <div className="flex items-center gap-2 text-emerald-600">
                                    <Trophy className="w-4 h-4" />
                                    {score}
                                </div>
                            </div>

                            <div className="py-8">
                                <div className="text-4xl font-black text-slate-800 mb-6 tracking-wide select-none">
                                    {currentWord}
                                </div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    className="w-full text-center text-2xl font-bold py-3 border-b-2 border-slate-200 focus:border-emerald-500 focus:outline-none bg-transparent placeholder-slate-200 transition-colors"
                                    placeholder="Type here..."
                                    autoComplete="off"
                                />
                            </div>

                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {status === 'result' && (
                        <div className="space-y-6">
                            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <Trophy className="w-10 h-10 text-yellow-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 mb-1">Shift Over!</h2>
                                <div className="text-4xl font-black text-emerald-600 mb-2">
                                    {score} <span className="text-lg text-slate-400 font-medium">words</span>
                                </div>
                                <p className="text-slate-500">
                                    Bonus Earned: <span className="font-bold text-slate-800">${score * 20}</span>
                                </p>
                            </div>
                            <button
                                onClick={handleComplete}
                                className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition shadow-lg"
                            >
                                Collect Earnings
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
