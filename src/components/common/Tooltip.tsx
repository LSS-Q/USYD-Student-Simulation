import React from 'react';
import clsx from 'clsx';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    disabled?: boolean; // Only show tooltip if disabled (optional behavior)
    className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, disabled, className }) => {
    return (
        <div className={clsx("relative group", className)}>
            {children}
            {content && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
                    {content}
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                </div>
            )}
        </div>
    );
};
