import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

// Since the layout might manage the selected tab, or we can lift it up.
// For now, let's keep the nav state local or passed down. 
// Actually, to make 'children' dynamic based on selection, the parent needs to control it.
// Let's make this a wrapper that accepts 'children' but also renders the shell.
// Wait, if the parent renders children, the parent knows the view.
// So this Layout just takes 'currentView' and 'onChangeView' to pass to Sidebar.

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
    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            <Sidebar currentView={currentView} onChangeView={onChangeView} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header title={currentView} />

                <main className="flex-1 overflow-auto p-6 scroll-smooth">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
