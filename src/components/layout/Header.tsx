import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Clock, Battery, DollarSign, Calendar } from 'lucide-react';
import clsx from 'clsx';

interface HeaderProps {
    title: string;
    extraActions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, extraActions }) => {
    const {
        year,
        quarter,
        actionPoints,
        maxActionPoints,
        stats,
        visaStatus
    } = useGameStore();

    const apPercentage = (actionPoints / maxActionPoints) * 100;

    // Format currency
    const formattedMoney = new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        maximumFractionDigits: 0
    }).format(stats.money);

    return (
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-0 md:h-16 flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-10 gap-3 md:gap-0">

            {/* View Title */}
            <h1 className="text-lg md:text-xl font-bold text-slate-800 capitalize">{title}</h1>

            {/* Stats Bar */}
            <div className="flex items-center gap-2 md:gap-6 flex-wrap md:flex-nowrap">

                {/* Date & Visa - Compact on mobile */}
                <div className="flex items-center gap-2 md:gap-4 md:border-r border-slate-200 md:pr-6">
                    <div className="flex items-center gap-1 md:gap-2 text-slate-600 text-xs md:text-sm font-medium">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Y{year} Q{quarter}</span>
                        <span className="sm:hidden">Q{quarter}</span>
                    </div>

                    <div className={clsx(
                        "flex items-center gap-1 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold border",
                        visaStatus.expiryDays < 365 ? "bg-red-50 text-red-600 border-red-200" : "bg-blue-50 text-blue-600 border-blue-200"
                    )}>
                        <Clock className="w-3 h-3" />
                        <span className="hidden sm:inline">Visa: {visaStatus.expiryDays}d</span>
                        <span className="sm:hidden">{visaStatus.expiryDays}d</span>
                    </div>
                </div>

                {/* Money */}
                <div className="flex items-center gap-1 md:gap-2 text-slate-800 font-mono font-bold text-sm md:text-base">
                    <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-emerald-600" />
                    <span className="hidden sm:inline">{formattedMoney}</span>
                    <span className="sm:hidden">${stats.money >= 1000 ? (stats.money / 1000).toFixed(0) + 'k' : stats.money}</span>
                </div>

                {/* Action Points */}
                <div className="flex flex-col items-end min-w-[80px] md:min-w-[100px]">
                    <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs font-bold text-slate-600 mb-1">
                        <Battery className="w-3 h-3" />
                        <span>AP {actionPoints}/{maxActionPoints}</span>
                    </div>
                    <div className="w-full h-1 md:h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-slate-800 transition-all duration-300"
                            style={{ width: `${apPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Extra Actions - Now visible on mobile but smaller */}
                {extraActions && (
                    <div className="flex items-center gap-1 md:gap-2 md:border-l border-slate-200 md:pl-6 md:ml-2">
                        {extraActions}
                    </div>
                )}

            </div>
        </header>
    );
};
