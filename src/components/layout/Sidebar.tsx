import React from 'react';
import { useLanguageStore } from '../../stores/useLanguageStore';
import {
    LayoutDashboard,
    GraduationCap,
    Briefcase,
    Users,
    Coffee,
    Plane,
    FileText,
    Settings,
    LogOut,
    Volume2,
    VolumeX
} from 'lucide-react';
import clsx from 'clsx';
import { useGameStore } from '../../stores/useGameStore';
import { SoundManager } from '../../utils/SoundManager'; // Import SoundManager

interface SidebarProps {
    currentView: string;
    onChangeView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
    const resetGame = useGameStore(state => state.resetGame);
    const [isBgmOn, setIsBgmOn] = React.useState(false);

    const { t } = useLanguageStore();

    const menuItems = [
        { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
        { id: 'academics', label: t.nav.academics, icon: GraduationCap },
        { id: 'career', label: t.nav.career, icon: Briefcase },
        { id: 'network', label: t.nav.network, icon: Users },
        { id: 'lifestyle', label: t.nav.lifestyle, icon: Coffee },
        { id: 'migration', label: t.nav.migration, icon: Plane },
        { id: 'resume', label: t.nav.resume, icon: FileText },
    ];

    const handleLogout = () => {
        if (confirm("确定要退出当前游戏重置进度吗？")) {
            resetGame();
            // Ideally this should redirect to home or handle state change
            window.location.reload();
        }
    };

    const handleToggleBgm = () => {
        const newState = SoundManager.toggleBGM();
        setIsBgmOn(newState);
    };

    return (
        <div className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col h-full border-r border-slate-800">
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-2 text-white font-bold text-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">U</div>
                    USYD Student Sim
                </div>
                <p className="text-xs text-slate-500 mt-1">International Student Life</p>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onChangeView(item.id)}
                        className={clsx(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                            currentView === item.id
                                ? "bg-blue-600/10 text-blue-400"
                                : "hover:bg-slate-800 hover:text-slate-200"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleToggleBgm}
                    className={clsx(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium mb-1",
                        isBgmOn ? "text-emerald-400 hover:bg-emerald-900/20" : "text-slate-400 hover:bg-slate-800"
                    )}
                >
                    {isBgmOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    BGM: {isBgmOn ? 'ON' : 'OFF'}
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-colors text-sm font-medium text-slate-400 mt-1"
                >
                    <LogOut className="w-5 h-5" />
                    Quit Game
                </button>
            </div>
        </div>
    );
};

export const MobileBottomNav: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
    const { t } = useLanguageStore();
    const resetGame = useGameStore(state => state.resetGame);
    const [showMore, setShowMore] = React.useState(false);
    const [isBgmOn, setIsBgmOn] = React.useState(false);

    const handleLogout = () => {
        if (confirm("确定要退出当前游戏重置进度吗？")) {
            resetGame();
            window.location.reload();
        }
    };

    const handleToggleBgm = () => {
        const newState = SoundManager.toggleBGM();
        setIsBgmOn(newState);
    };

    const mainMenuItems = [
        { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
        { id: 'academics', label: t.nav.academics, icon: GraduationCap },
        { id: 'career', label: t.nav.career, icon: Briefcase },
        { id: 'network', label: t.nav.network, icon: Users },
        { id: 'lifestyle', label: t.nav.lifestyle, icon: Coffee },
        { id: 'migration', label: t.nav.migration, icon: Plane },
        { id: 'resume', label: t.nav.resume, icon: FileText },
    ];

    return (
        <>
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 safe-area-pb">
                <div className="flex justify-around p-1">
                    {mainMenuItems.slice(0, 5).map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onChangeView(item.id)}
                            className={clsx(
                                "flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors min-w-[56px]",
                                currentView === item.id
                                    ? "text-blue-400"
                                    : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <item.icon className="w-5 h-5 mb-0.5" />
                            <span className="text-[9px] font-medium">{item.label}</span>
                        </button>
                    ))}
                    {/* Migration */}
                    <button
                        onClick={() => onChangeView('migration')}
                        className={clsx(
                            "flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors min-w-[56px]",
                            currentView === 'migration'
                                ? "text-blue-400"
                                : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <Plane className="w-5 h-5 mb-0.5" />
                        <span className="text-[9px] font-medium">{t.nav.migration}</span>
                    </button>
                    {/* Resume */}
                    <button
                        onClick={() => onChangeView('resume')}
                        className={clsx(
                            "flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors min-w-[56px]",
                            currentView === 'resume'
                                ? "text-blue-400"
                                : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <FileText className="w-5 h-5 mb-0.5" />
                        <span className="text-[9px] font-medium">{t.nav.resume}</span>
                    </button>
                    {/* More Menu */}
                    <button
                        onClick={() => setShowMore(!showMore)}
                        className={clsx(
                            "flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors min-w-[56px]",
                            showMore ? "text-blue-400" : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <Settings className="w-5 h-5 mb-0.5" />
                        <span className="text-[9px] font-medium">更多</span>
                    </button>
                </div>
            </div>

            {/* More Menu Popup */}
            {showMore && (
                <div className="md:hidden fixed bottom-16 right-2 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-3 z-50 min-w-[180px]">
                    <button
                        onClick={handleToggleBgm}
                        className={clsx(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium mb-1",
                            isBgmOn ? "text-emerald-400 hover:bg-emerald-900/20" : "text-slate-300 hover:bg-slate-700"
                        )}
                    >
                        {isBgmOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        BGM: {isBgmOn ? 'ON' : 'OFF'}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-colors text-sm font-medium text-slate-300"
                    >
                        <LogOut className="w-4 h-4" />
                        退出游戏
                    </button>

                    <button
                        onClick={() => setShowMore(false)}
                        className="w-full mt-2 px-3 py-1.5 rounded-lg bg-slate-700 text-slate-400 text-xs hover:bg-slate-600 transition"
                    >
                        关闭
                    </button>
                </div>
            )}

            {/* Backdrop */}
            {showMore && (
                <div
                    className="md:hidden fixed inset-0 bg-black/20 z-40"
                    onClick={() => setShowMore(false)}
                />
            )}
        </>
    );
};
