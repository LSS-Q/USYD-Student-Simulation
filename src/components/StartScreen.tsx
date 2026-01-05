import React, { useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { DEGREE_CONFIG, MAJOR_CONFIG } from '../data/constants';
import { DegreeType, Gender, MajorType } from '../types/game';
import clsx from 'clsx';
import { GraduationCap, BookOpen, User, ArrowRight } from 'lucide-react';

export const StartScreen: React.FC = () => {
    const startGame = useGameStore((state) => state.startGame);

    const [name, setName] = useState('');
    const [gender, setGender] = useState<Gender>('female');
    const [degree, setDegree] = useState<DegreeType>('master');
    const [major, setMajor] = useState<MajorType>('commerce');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("请输入你的名字");
            return;
        }
        startGame({
            name,
            gender,
            degree,
            major
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* Left Side: Illustration / Welcome */}
                <div className="md:w-1/3 bg-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">U</div>
                            <span className="font-bold text-lg">USYD Student Simulation</span>
                        </div>
                        <h1 className="text-3xl font-bold mb-4">悉尼留学<br />模拟器</h1>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            欢迎来到USYD (University of Sydney)。<br /><br />
                            你的每一项选择都决定了你能否在签证过期前拿到 PR。
                            <br /><br />
                            这是一场关于学业、金钱、心态与运气的博弈。
                        </p>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
                    <div className="absolute top-10 -left-10 w-40 h-40 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-2/3 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Identity Section */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <User className="w-5 h-5 text-blue-600" />
                                身份信息 (Identity)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">姓名 (Name)</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="请输入你的英文名"
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">性别 (Gender)</label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setGender('female')}
                                            className={clsx(
                                                "flex-1 py-2 px-4 rounded-lg border transition text-sm font-medium",
                                                gender === 'female'
                                                    ? "bg-pink-50 border-pink-200 text-pink-700 ring-1 ring-pink-500"
                                                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                                            )}
                                        >
                                            女 (Female)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setGender('male')}
                                            className={clsx(
                                                "flex-1 py-2 px-4 rounded-lg border transition text-sm font-medium",
                                                gender === 'male'
                                                    ? "bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500"
                                                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                                            )}
                                        >
                                            男 (Male)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Degree Section */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                                学历选择 (Degree)
                            </h2>
                            <div className="grid grid-cols-1 gap-3">
                                {(Object.keys(DEGREE_CONFIG) as DegreeType[]).map((key) => {
                                    const conf = DEGREE_CONFIG[key];
                                    const isSelected = degree === key;
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setDegree(key)}
                                            className={clsx(
                                                "w-full text-left p-4 rounded-xl border transition relative",
                                                isSelected
                                                    ? "bg-blue-50 border-blue-500 shadow-sm"
                                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            )}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={clsx("font-bold", isSelected ? "text-blue-900" : "text-slate-700")}>
                                                    {conf.label}
                                                </span>
                                                <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-slate-100 text-slate-500">
                                                    {conf.durationYears} Years
                                                </span>
                                            </div>
                                            <p className={clsx("text-sm", isSelected ? "text-blue-700" : "text-slate-500")}>
                                                {conf.desc}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Major Section */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                专业选择 (Major)
                            </h2>
                            <div className="grid grid-cols-1 gap-3">
                                {(Object.keys(MAJOR_CONFIG) as MajorType[]).map((key) => {
                                    const conf = MAJOR_CONFIG[key];
                                    const isSelected = major === key;
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setMajor(key)}
                                            className={clsx(
                                                "w-full text-left p-4 rounded-xl border transition relative",
                                                isSelected
                                                    ? "bg-purple-50 border-purple-500 shadow-sm"
                                                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            )}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={clsx("font-bold", isSelected ? "text-purple-900" : "text-slate-700")}>
                                                    {conf.label}
                                                </span>
                                            </div>
                                            <p className={clsx("text-sm mb-2", isSelected ? "text-purple-700" : "text-slate-500")}>
                                                {conf.effectDesc}
                                            </p>

                                            {/* Stat Modifiers Badges */}
                                            <div className="flex flex-wrap gap-2">
                                                {conf.statsModifier.sanity !== undefined && (
                                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                                                        Sanity {conf.statsModifier.sanity > 0 ? '+' : ''}{conf.statsModifier.sanity}
                                                    </span>
                                                )}
                                                {conf.statsModifier.network !== undefined && (
                                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                                                        Network +{conf.statsModifier.network}
                                                    </span>
                                                )}
                                                <span className={clsx("text-[10px] uppercase font-bold px-1.5 py-0.5 rounded", conf.statsModifier.prSteady > 7 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")}>
                                                    PR Chance: {conf.statsModifier.prSteady}/10
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 group"
                        >
                            开始我的留学生活
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};
