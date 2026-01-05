import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Clock, Battery, DollarSign, Calendar } from 'lucide-react';
import clsx from 'clsx';

interface HeaderProps {
    title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
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
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">

            {/* View Title */}
            <h1 className="text-xl font-bold text-slate-800 capitalize">{title}</h1>

            {/* Stats Bar */}
            <div className="flex items-center gap-6">

                {/* Date & Visa */}
                <div className="flex items-center gap-4 border-r border-slate-200 pr-6">
                    <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        <span>Y{year} Q{quarter}</span>
                    </div>

                    <div className={clsx(
                        "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border",
                        visaStatus.expiryDays < 365 ? "bg-red-50 text-red-600 border-red-200" : "bg-blue-50 text-blue-600 border-blue-200"
                    )}>
                        <Clock className="w-3 h-3" />
                        <span>Visa: {visaStatus.expiryDays} Days</span>
                    </div>
                </div>

                {/* Money */}
                <div className="flex items-center gap-2 text-slate-800 font-mono font-bold">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    {formattedMoney}
                </div>

                {/* Action Points */}
                <div className="flex flex-col items-end min-w-[100px]">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-1">
                        <Battery className="w-3 h-3" />
                        <span>AP {actionPoints}/{maxActionPoints}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-slate-800 transition-all duration-300"
                            style={{ width: `${apPercentage}%` }}
                        />
                    </div>
                </div>

            </div>
        </header>
    );
};
