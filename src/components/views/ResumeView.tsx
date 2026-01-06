import React, { useRef } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Download, Share2, Award, Briefcase, BookOpen, User } from 'lucide-react';
import { DEGREE_CONFIG } from '../../data/constants';

export const ResumeView: React.FC = () => {
    const { profile, stats, quartersStudied } = useGameStore();
    const resumeRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    // Calculate GPA (Rough approximation: WAM 85+ = 4.0, 75+ = 3.5, 65+ = 3.0, 50+ = 2.0)
    const getGPA = (wam: number) => {
        if (wam >= 85) return "4.0 (HD)";
        if (wam >= 75) return "3.7 (D)";
        if (wam >= 65) return "3.0 (CR)";
        if (wam >= 50) return "2.0 (P)";
        return "1.0 (Fail)";
    };

    const degreeInfo = DEGREE_CONFIG[profile.degree];

    return (
        <div className="h-full flex flex-col items-center">
            {/* Action Bar */}
            <div className="w-full max-w-[210mm] flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">My Visual Resume</h2>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    Export PDF
                </button>
            </div>

            {/* A4 Paper Container */}
            <div
                ref={resumeRef}
                className="bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm] p-[20mm] text-slate-900 print:shadow-none print:w-full"
                style={{ aspectRatio: '210/297' }}
            >
                {/* Header */}
                <header className="border-b-2 border-slate-900 pb-6 mb-8">
                    <h1 className="text-4xl font-serif font-bold tracking-tight mb-2 uppercase">{profile.name}</h1>
                    <div className="flex gap-4 text-sm text-slate-600 font-medium">
                        <span>Sydney, NSW</span>
                        <span>•</span>
                        <span>{profile.name.toLowerCase().replace(/\s/g, '.')}@uni.sydney.edu.au</span>
                        <span>•</span>
                        <span>github.com/{profile.name.split(' ')[0]}</span>
                    </div>
                </header>

                {/* Education */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-slate-100 rounded">
                            <BookOpen className="w-4 h-4 text-slate-700" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-wider text-slate-800">Education</h3>
                    </div>

                    <div className="pl-2 border-l-2 border-slate-200 ml-3">
                        <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-bold text-lg">The University of Sydney</h4>
                            <span className="text-sm font-medium text-slate-600">Expected 2026</span>
                        </div>
                        <div className="text-slate-700 font-medium mb-2">
                            {degreeInfo.label} in {profile.major.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                            <li>Weighted Average Mark (WAM): <span className="font-bold text-slate-900">{stats.wam.toFixed(1)}</span></li>
                            <li>Grade Point Average: {getGPA(stats.wam)}</li>
                            <li>Logic & Computing Score: {stats.intelligence}/100</li>
                        </ul>
                    </div>
                </section>

                {/* Experience */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-slate-100 rounded">
                            <Briefcase className="w-4 h-4 text-slate-700" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-wider text-slate-800">Experience</h3>
                    </div>

                    <div className="pl-2 border-l-2 border-slate-200 ml-3 space-y-6">
                        {stats.experience > 50 ? (
                            <div>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-lg">Professional Intern</h4>
                                    <span className="text-sm font-medium text-slate-600">Sydney, AU</span>
                                </div>
                                <div className="text-slate-700 font-medium mb-2">Tech/Business Sector</div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Accumulated {stats.experience} points of professional experience through part-time work and internships.
                                    Demonstrated ability to balance academic workload with industry practice.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-lg">Student Freelancer</h4>
                                    <span className="text-sm font-medium text-slate-600">Remote</span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed mt-2">
                                    Engaged in various gig-economy tasks and casual employment. (Experience: {stats.experience})
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Skills */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-slate-100 rounded">
                            <Award className="w-4 h-4 text-slate-700" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-wider text-slate-800">Skills & competencies</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 ml-3">
                        <div>
                            <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                                <span>English Proficiency (PTE equivalent)</span>
                                <span>{stats.english}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-800" style={{ width: `${Math.min(100, (stats.english / 90) * 100)}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                                <span>Technical / Coding</span>
                                <span>{stats.coding || stats.intelligence}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-800" style={{ width: `${stats.coding || stats.intelligence}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                                <span>Professional Network</span>
                                <span>{stats.network} Connections</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-800" style={{ width: `${Math.min(100, stats.network)}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                                <span>Adaptability (Sanity Management)</span>
                                <span>{stats.sanity}/100</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-800" style={{ width: `${stats.sanity}%` }}></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between text-[10px] text-slate-400 font-mono uppercase">
                    <span>Generated by USYD Student Sim v1.5</span>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
            </div>
            <style>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body * { visibility: hidden; }
                    #root { display: block; }
                    .print\\:w-full { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20mm; box-shadow: none; }
                    .print\\:w-full * { visibility: visible; }
                    button { display: none; }
                }
            `}</style>
        </div>
    );
};
