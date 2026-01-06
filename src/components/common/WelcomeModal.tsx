import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useGameStore } from '../../stores/useGameStore';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { TUTORIAL_SLIDES } from '../../data/tutorial';
import clsx from 'clsx';
import { SoundManager } from '../../utils/SoundManager';

export const WelcomeModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const { phase, visaStatus } = useGameStore();
    const { currentLang } = useLanguageStore();

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('tutorial_seen');
        if (phase === 'student' && visaStatus.expiryDays > 700 && !hasSeenTutorial) {
            setIsOpen(true);
        }
    }, [phase, visaStatus]);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('tutorial_seen', 'true');
    };

    const nextStep = () => {
        if (currentStep < TUTORIAL_SLIDES.length - 1) {
            setCurrentStep(prev => prev + 1);
            SoundManager.playClick();
        } else {
            handleClose();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            SoundManager.playClick();
        }
    };

    if (!isOpen) return null;

    const slide = TUTORIAL_SLIDES[currentStep];
    const Icon = slide.icon;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300 h-[450px]">

                {/* Header with Step indicator */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex gap-1.5">
                        {TUTORIAL_SLIDES.map((_, i) => (
                            <div
                                key={i}
                                className={clsx(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    i === currentStep ? "w-8 bg-blue-600" : "w-1.5 bg-slate-200"
                                )}
                            />
                        ))}
                    </div>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Illustration Area */}
                    <div className={clsx("w-1/3 hidden md:flex flex-col items-center justify-center p-8 transition-colors duration-500", slide.bg)}>
                        <div className={clsx("w-20 h-20 rounded-full flex items-center justify-center shadow-lg bg-white mb-4 animate-bounce")}>
                            <Icon className={clsx("w-10 h-10", slide.color)} />
                        </div>
                        <Sparkles className="w-6 h-6 text-yellow-400 opacity-50" />
                    </div>

                    {/* Right: Content Area */}
                    <div className="flex-1 p-8 flex flex-col">
                        <div className="flex-1">
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2 block">
                                {currentLang === 'zh' ? `第 ${currentStep + 1} 步 / 共 ${TUTORIAL_SLIDES.length} 步` : `Step ${currentStep + 1} of ${TUTORIAL_SLIDES.length}`}
                            </span>
                            <h2 className="text-2xl font-black text-slate-800 mb-4">
                                {slide.title[currentLang]}
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                {slide.desc[currentLang]}
                            </p>
                        </div>

                        {/* Navigation Footer */}
                        <div className="flex justify-between items-center pt-8">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition",
                                    currentStep === 0 ? "opacity-0 pointer-events-none" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                )}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                {currentLang === 'zh' ? '上一步' : 'Back'}
                            </button>

                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg hover:shadow-xl group"
                            >
                                {currentStep === TUTORIAL_SLIDES.length - 1
                                    ? (currentLang === 'zh' ? '开启留学之旅' : 'Start Journey')
                                    : (currentLang === 'zh' ? '下一步' : 'Next')
                                }
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none -z-10"></div>
            </div>
        </div>
    );
};
