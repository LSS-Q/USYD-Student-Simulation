import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { GLOSSARY_DATA_ZH, GLOSSARY_DATA_EN, GlossaryTerm } from '../../data/glossary';
import { useLanguageStore } from '../../stores/useLanguageStore';
import clsx from 'clsx';

interface GlossaryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
    const { currentLang } = useLanguageStore();
    const data = currentLang === 'en' ? GLOSSARY_DATA_EN : GLOSSARY_DATA_ZH;
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filtered = data.filter(item =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col h-[80vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">
                        {currentLang === 'zh' ? '澳洲留学词典 (Student Handbook)' : 'Student Handbook'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                <div className="p-4 bg-slate-50 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder={currentLang === 'zh' ? "搜索术语..." : "Search terms..."}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {filtered.map((item) => (
                        <div key={item.key} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-200 transition">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-bold text-lg text-blue-700">{item.term}</h3>
                                {item.tags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {item.definition}
                            </p>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            No terms found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
