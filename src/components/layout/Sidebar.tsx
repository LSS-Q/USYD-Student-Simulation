import React from 'react';
import {
    LayoutDashboard,
    GraduationCap,
    Briefcase,
    Coffee,
    Plane,
    Settings,
    LogOut,
    Users // Added Users
} from 'lucide-react';
import clsx from 'clsx';
import { useGameStore } from '../../stores/useGameStore';

interface SidebarProps {
    currentView: string;
    onChangeView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
    const resetGame = useGameStore(state => state.resetGame);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'academics', label: 'Academics', icon: GraduationCap },
        { id: 'career', label: 'Career', icon: Briefcase },
        { id: 'network', label: 'Network', icon: Users }, // Added Network
        { id: 'lifestyle', label: 'Lifestyle', icon: Coffee },
        { id: 'migration', label: 'Migration', icon: Plane },
    ];

    const handleLogout = () => {
        if (confirm("确定要退出当前游戏重置进度吗？")) {
            resetGame();
            // Ideally this should redirect to home or handle state change
            window.location.reload();
        }
    };

    return (
        <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800">
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-2 text-white font-bold text-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">U</div>
                    USYD Student Sim
                </div>
                <p className="text-xs text-slate-500 mt-1">International Student Life</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
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
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium text-slate-400">
                    <Settings className="w-5 h-5" />
                    Settings
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
