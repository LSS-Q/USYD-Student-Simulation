import React, { useState } from 'react';
import { Sidebar, MobileBottomNav } from './Sidebar';
import { Header } from './Header';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { GlossaryModal } from '../common/GlossaryModal';
import { AchievementPanel } from '../common/AchievementPanel';
import { Book, Globe, Trophy } from 'lucide-react';

interface DashboardLayoutProps {
    currentView: string;
    onChangeView: (view: string) => void;
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    currentView,
    onChangeView,
    children
}) => {
    const { currentLang, setLanguage } = useLanguageStore();
    const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
    const [isAchievementOpen, setIsAchievementOpen] = useState(false);

    const toggleLanguage = () => {
        setLanguage(currentLang === 'zh' ? 'en' : 'zh');
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            <Sidebar currentView={currentView} onChangeView={onChangeView} />

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Header
                    title={currentView}
                    extraActions={
                        <React.Fragment>
                            <button
                                onClick={() => setIsAchievementOpen(true)}
                                className="p-1.5 md:p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-amber-50 text-amber-600 flex items-center gap-1 md:gap-2 transition"
                                title="Achievements"
                            >
                                <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                            <button
                                onClick={toggleLanguage}
                                className="p-1.5 md:p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1 md:gap-2 transition"
                                title="Switch Language"
                            >
                                <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                <span className="text-[10px] md:text-xs font-bold">{currentLang === 'zh' ? 'EN' : '中'}</span>
                            </button>
                            <button
                                onClick={() => setIsGlossaryOpen(true)}
                                className="p-1.5 md:p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1 md:gap-2 transition"
                                title="Glossary"
                            >
                                <Book className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>
                        </React.Fragment>
                    }
                />

                <GlossaryModal isOpen={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
                <AchievementPanel isOpen={isAchievementOpen} onClose={() => setIsAchievementOpen(false)} />

                <main className="flex-1 overflow-auto p-4 md:p-6 scroll-smooth pb-48 md:pb-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            <MobileBottomNav currentView={currentView} onChangeView={onChangeView} />
        </div>
    );
};
