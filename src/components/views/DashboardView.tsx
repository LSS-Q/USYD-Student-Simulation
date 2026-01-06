import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { WelcomeModal } from '../common/WelcomeModal';
import { WeekendModal } from '../common/WeekendModal';
import { MemoryGameModal } from '../games/MemoryGameModal';
import {
    Activity,
    Brain,
    TrendingUp,
    Users,
    Globe,
    Award,
    Zap,
    Briefcase,
    Coffee,
    Book,
    PartyPopper,
    Sun
} from 'lucide-react';
import clsx from 'clsx';

export const DashboardView: React.FC = () => {
    const {
        stats,
        assets,
        actionPoints,
        useActionPoints,
        updateStats,
        eventsLog,
        advanceQuarter,
        coffeeConsumed,
        drinkCoffee,
        handleStudyComplete,
        hasTakenWeekendAction
    } = useGameStore();
    const { t } = useLanguageStore();

    const [isMemoryGameOpen, setIsMemoryGameOpen] = React.useState(false);
    const [isWeekendModalOpen, setIsWeekendModalOpen] = React.useState(false);

    const handleFlatWhite = () => {
        drinkCoffee('coffee');
    };

    const handleEnergyDrink = () => {
        drinkCoffee('energy_drink');
    };

    // Re-implementing simplified actions for now
    const handleStudy = () => {
        // -2 AP
        if (actionPoints >= 2) {
            if (useActionPoints(2)) {
                setIsMemoryGameOpen(true);
            }
        }
    };

    const onMemoryGameValid = (score: number) => {
        handleStudyComplete(score);
        setIsMemoryGameOpen(false);
    };

    const handleJob = () => {
        if (useActionPoints(3)) {
            updateStats({ money: 200, sanity: -5 });
        }
    };

    const handleUber = () => {
        if (useActionPoints(3)) {
            // High income, high fatigue
            const income = 500 + Math.floor(Math.random() * 300); // 500-800
            updateStats({ money: income, sanity: -10 });
        }
    };

    const handleRest = () => {
        if (useActionPoints(1)) {
            updateStats({ sanity: 15 }); // Buffed from 5
        }
    };

    const handlePlay = () => {
        if (stats.money < 100) {
            alert("你没有足够的钱去浪！");
            return;
        }

        if (useActionPoints(2)) {
            updateStats({ sanity: 25, network: 2, money: -100 });
        }
    };

    // Stats Configuration
    const statCards = [
        { label: t.stats.sanity, value: stats.sanity, max: 100, icon: Brain, color: 'text-pink-600', bg: 'bg-pink-50' },
        { label: t.stats.wam, value: stats.wam, max: 100, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: t.stats.english, value: stats.english, max: 90, icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: t.stats.network, value: stats.network, max: 100, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Experience', value: stats.experience, max: 100, icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: t.stats.pr_score, value: stats.pr_score, max: 100, icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    return (
        <div className="space-y-6">
            <WelcomeModal />
            <MemoryGameModal
                isOpen={isMemoryGameOpen}
                onClose={() => setIsMemoryGameOpen(false)}
                onComplete={onMemoryGameValid}
            />
            {isWeekendModalOpen && (
                <WeekendModal onClose={() => setIsWeekendModalOpen(false)} />
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-28 relative overflow-hidden group hover:shadow-md transition">
                        <div className="flex justify-between items-start z-10">
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                            <div className={clsx("p-1.5 rounded-lg", stat.bg)}>
                                <stat.icon className={clsx("w-4 h-4", stat.color)} />
                            </div>
                        </div>
                        <div className="z-10">
                            <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
                            {stat.max && <span className="text-slate-400 text-xs ml-1">/ {stat.max}</span>}
                        </div>

                        {/* Progress Bar Background */}
                        <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full">
                            <div
                                className={clsx("h-full opacity-50", stat.color.replace('text', 'bg'))}
                                style={{ width: `${(stat.value / stat.max) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">

                {/* Left: Action Centre */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Action Centre
                        </h2>
                        <span className="text-xs text-slate-400 font-mono">Select an activity</span>
                    </div>

                    <div className="p-4 grid grid-cols-2 gap-4">
                        <button
                            onClick={handleStudy}
                            disabled={actionPoints < 2}
                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition">
                                <Book className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-slate-800">Study Hard</div>
                                <div className="text-xs text-slate-500 mt-1 font-mono">-2 AP | +WAM | -Sanity</div>
                            </div>
                        </button>

                        <button
                            onClick={handleJob}
                            disabled={actionPoints < 3}
                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition">
                                <TrendingUp className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-slate-800">Part-time Job</div>
                                <div className="text-xs text-slate-500 mt-1 font-mono">-3 AP | +$$$ | -Sanity</div>
                            </div>
                        </button>

                        <button
                            onClick={handleFlatWhite}
                            disabled={stats.money < 6 || coffeeConsumed >= 2}
                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-100 hover:border-amber-500 hover:bg-amber-50 transition gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative"
                        >
                            <div className="absolute top-2 right-2 text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 rounded-full">
                                {coffeeConsumed}/2
                            </div>
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center group-hover:scale-110 transition">
                                <Coffee className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-slate-800">Flat White</div>
                                <div className="text-xs text-slate-500 mt-1 font-mono">-$6 | +1 AP | -Sanity</div>
                            </div>
                        </button>

                        <button
                            onClick={handleEnergyDrink}
                            disabled={stats.money < 12}
                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-100 hover:border-red-500 hover:bg-red-50 transition gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center group-hover:scale-110 transition">
                                <Zap className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-slate-800">V Energy</div>
                                <div className="text-xs text-slate-500 mt-1 font-mono">-$12 | +3 AP | -Health</div>
                            </div>
                        </button>

                        {/* Uber Eats (Conditional) */}
                        {assets && assets.includes('car_camry') && (
                            <button
                                onClick={handleUber}
                                disabled={actionPoints < 3}
                                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-100 hover:border-emerald-600 hover:bg-emerald-50 transition gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] px-2 py-0.5 font-bold">PRO</div>
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition">
                                    <Zap className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-slate-800">Uber Eats</div>
                                    <div className="text-xs text-slate-500 mt-1 font-mono">-3 AP | +$800 | -10 Sanity</div>
                                </div>
                            </button>
                        )}


                        <button
                            onClick={handleRest}
                            disabled={actionPoints < 1}
                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-100 hover:border-pink-500 hover:bg-pink-50 transition gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center group-hover:scale-110 transition">
                                <Coffee className="w-6 h-6 text-pink-600" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-slate-800">Rest & Relax</div>
                                <div className="text-xs text-slate-500 mt-1 font-mono">-1 AP | +15 Sanity</div>
                            </div>
                        </button>


                        <button
                            onClick={handlePlay}
                            disabled={actionPoints < 2 || stats.money < 100}
                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center group-hover:scale-110 transition">
                                <PartyPopper className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-slate-800">Party</div>
                                <div className="text-xs text-slate-500 mt-1 font-mono">-2 AP | -$100 | +25 Sanity</div>
                            </div>
                        </button>

                        <button
                            onClick={() => setIsWeekendModalOpen(true)}
                            disabled={hasTakenWeekendAction}
                            className="col-span-2 flex items-center justify-between p-4 rounded-xl border-2 border-amber-100 bg-amber-50 hover:border-amber-400 hover:bg-amber-100 transition gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center group-hover:scale-110 transition">
                                    <Sun className="w-6 h-6 text-amber-700" />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-slate-800 text-lg">Plan Weekend Trip</div>
                                    <div className="text-xs text-slate-600 font-mono">Special activity (Once per quarter)</div>
                                </div>
                            </div>
                            <div className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-amber-600 border border-amber-200 group-hover:bg-amber-400 group-hover:text-white transition">
                                {hasTakenWeekendAction ? 'COMPLETED' : 'VIEW OPTIONS'}
                            </div>
                        </button>
                    </div>

                    <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
                        <button
                            onClick={advanceQuarter}
                            className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
                        >
                            End Quarter (Advance Time)
                        </button>
                    </div>
                </div>

                {/* Right: Feed */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-500" />
                            Moments & Feed
                        </h2>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[10px] font-bold text-blue-600 uppercase">Live</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
                        {/* Featured Global Moments */}
                        <div className="flex gap-3 group">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-sm">
                                    RR
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-white">
                                    <Globe className="w-2.5 h-2.5 text-indigo-500" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <div className="text-xs font-bold text-slate-900 truncate">USYD Rants</div>
                                    <div className="text-[10px] text-slate-400">10:42 AM</div>
                                </div>
                                <div className="text-sm text-slate-600 mt-1 bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100 leading-relaxed">
                                    Final exam results are out! RIP WAM. 💀
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 group">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 flex items-center justify-center flex-shrink-0 text-white shadow-sm font-bold text-xs">
                                    M
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-white">
                                    <Users className="w-2.5 h-2.5 text-pink-500" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <div className="text-xs font-bold text-slate-900">Mom</div>
                                    <div className="text-[10px] text-slate-400">Yesterday</div>
                                </div>
                                <div className="text-sm text-slate-600 mt-1 bg-pink-50/30 p-3 rounded-2xl rounded-tl-none border border-pink-100/50 leading-relaxed italic">
                                    "最近身体怎么样？钱还够用吗？别太累了。"
                                </div>
                            </div>
                        </div>

                        {/* Event Log Section */}
                        {eventsLog.length > 0 && (
                            <div className="pt-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-px bg-slate-100 flex-1"></div>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">History Log</span>
                                    <div className="h-px bg-slate-100 flex-1"></div>
                                </div>

                                <div className="space-y-3">
                                    {eventsLog.map((log, i) => (
                                        <div key={i} className="flex gap-3 items-start animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                                            <div className={clsx(
                                                "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                                                log.includes('Decision') ? "bg-amber-400" : "bg-blue-400"
                                            )}></div>
                                            <div className="text-xs text-slate-500 font-medium leading-relaxed">
                                                {log.startsWith('Decision: ') ? (
                                                    <span>
                                                        <span className="text-slate-400 lowercase mr-1">You chose:</span>
                                                        <span className="text-slate-700">{log.replace('Decision: ', '')}</span>
                                                    </span>
                                                ) : log}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {eventsLog.length === 0 && (
                            <div className="h-40 flex flex-col items-center justify-center text-slate-300 gap-2 opacity-50">
                                <Activity className="w-8 h-8" />
                                <span className="text-xs">No recent activity</span>
                            </div>
                        )}
                    </div>
                </div>

            </div >
        </div >
    );
};
