import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { EVENT_IMAGES } from '../../assets/index';
import { X, Sun, Mountain, Gamepad2, PartyPopper } from 'lucide-react';
import clsx from 'clsx';

interface WeekendModalProps {
    onClose: () => void;
}

const WEEKEND_ACTIVITIES = [
    {
        id: 'bondi',
        title: 'Bondi Beach Day',
        desc: 'Sun, sand, and relaxation. Great for mental health.',
        image: EVENT_IMAGES['weekend_bondi'],
        icon: Sun,
        cost: { money: 20 },
        effect: { stats: { sanity: 15 } }, // Changed structure to match simple object for display, logic handles store call
        realEffect: { sanity: 15 },
        color: 'bg-blue-500'
    },
    {
        id: 'hiking',
        title: 'Blue Mountains Hike',
        desc: 'Nature walk and fresh air.',
        image: EVENT_IMAGES['weekend_hiking'],
        icon: Mountain,
        cost: { money: 40 },
        effect: { stats: { sanity: 10, experience: 2 } },
        realEffect: { sanity: 10, experience: 2 },
        color: 'bg-emerald-600'
    },
    {
        id: 'gaming',
        title: 'Stay Home & Game',
        desc: 'Recharge your social battery alone.',
        image: EVENT_IMAGES['weekend_gaming'],
        icon: Gamepad2,
        cost: { money: 0 },
        effect: { stats: { sanity: 8 } },
        realEffect: { sanity: 8 },
        color: 'bg-purple-600'
    },
    {
        id: 'party',
        title: 'House Party',
        desc: 'Meet new people and have fun!',
        image: EVENT_IMAGES['weekend_party'],
        icon: PartyPopper,
        cost: { money: 80 },
        effect: { stats: { sanity: 12, network: 5 } },
        realEffect: { sanity: 12, network: 5 },
        color: 'bg-rose-500'
    }
];

export const WeekendModal: React.FC<WeekendModalProps> = ({ onClose }) => {
    const { performWeekendAction, stats } = useGameStore();

    const handleSelect = (activity: any) => {
        if (stats.money < activity.cost.money) return;
        performWeekendAction(activity.cost, activity.realEffect);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950">
                    <div>
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <Sun className="text-amber-400" />
                            WEEKEND PLANS
                        </h2>
                        <p className="text-slate-400 text-sm">Choose how to spend your weekend. Only once per quarter.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Grid */}
                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    {WEEKEND_ACTIVITIES.map((activity) => (
                        <button
                            key={activity.id}
                            onClick={() => handleSelect(activity)}
                            disabled={stats.money < activity.cost.money}
                            className={clsx(
                                "group relative h-64 rounded-2xl overflow-hidden border-2 text-left transition-all duration-300",
                                stats.money < activity.cost.money
                                    ? "border-slate-800 opacity-50 grayscale cursor-not-allowed"
                                    : "border-slate-700 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1"
                            )}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={activity.image}
                                    alt={activity.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-x-0 bottom-0 p-5 z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                                        {activity.title}
                                    </h3>
                                    <span className={clsx(
                                        "px-3 py-1 rounded-full text-xs font-bold",
                                        activity.cost.money === 0 ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white"
                                    )}>
                                        {activity.cost.money === 0 ? 'FREE' : `-$${activity.cost.money}`}
                                    </span>
                                </div>
                                <p className="text-slate-300 text-sm mb-4 line-clamp-2">{activity.desc}</p>

                                {/* Effects */}
                                <div className="flex gap-2">
                                    {Object.entries(activity.realEffect).map(([key, val]) => (
                                        <span key={key} className="text-xs font-mono px-2 py-1 rounded bg-black/40 text-amber-200 border border-white/5 uppercase">
                                            {key === 'sanity' ? '❤️' : key === 'network' ? '🤝' : '✨'} {val as number > 0 ? '+' : ''}{val as number}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
