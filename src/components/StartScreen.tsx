import React, { useState } from 'react';
import { useGameStore } from '../stores/useGameStore';
import { DEGREE_CONFIG, MAJOR_CONFIG } from '../data/constants';
import { DegreeType, Gender, MajorType, PlayerBackground } from '../types/game';
import clsx from 'clsx';
import { GraduationCap, BookOpen, User, ArrowRight, Briefcase, Trophy, Check } from 'lucide-react';
import { LegacyModal } from './LegacyModal';
import { useLegacyStore } from '../stores/useLegacyStore';
import { PLAYER_AVATARS } from '../assets/index';

export const StartScreen: React.FC = () => {
    const startGame = useGameStore((state) => state.startGame);

    const [name, setName] = useState('');
    const [gender, setGender] = useState<Gender>('female');
    const [selectedAvatar, setSelectedAvatar] = useState(PLAYER_AVATARS['female']); // Default match
    const [background, setBackground] = useState<PlayerBackground>('middle');
    const [degree, setDegree] = useState<DegreeType>('master');
    const [major, setMajor] = useState<MajorType>('commerce');
    const [showLegacyModal, setShowLegacyModal] = useState(false);
    const legacyPoints = useLegacyStore(state => state.legacyPoints);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("请输入你的名字");
            return;
        }
        startGame({
            name,
            gender,
            avatar: selectedAvatar,
            degree,
            major,
            background
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

                        {/* Legacy Link (only if points > 0 usually, but let's show always for demo) */}
                        <div className="flex justify-between items-center bg-yellow-50 p-4 rounded-xl border border-yellow-200 cursor-pointer hover:bg-yellow-100 transition"
                            onClick={() => setShowLegacyModal(true)}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500 text-white rounded-lg">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-yellow-900">Alumni Network</h3>
                                    <p className="text-xs text-yellow-700">Unlock legacy buffs</p>
                                </div>
                            </div>
                            <span className="font-bold text-yellow-800 text-lg">{legacyPoints} Pts</span>
                        </div>

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
                                    <label className="block text-sm font-medium text-slate-600 mb-2">形象 (Avatar)</label>
                                    <div className="flex gap-4 justify-start">
                                        {[
                                            { id: 'male', src: PLAYER_AVATARS['male'], label: 'Male' },
                                            { id: 'female', src: PLAYER_AVATARS['female'], label: 'Female' }
                                        ].map((opt) => (
                                            <div
                                                key={opt.id}
                                                onClick={() => {
                                                    setGender(opt.id as Gender);
                                                    setSelectedAvatar(opt.src);
                                                }}
                                                className={clsx(
                                                    "relative cursor-pointer transition-all duration-300 transform group",
                                                    gender === opt.id ? "scale-105" : "opacity-60 hover:opacity-100 hover:scale-105"
                                                )}
                                            >
                                                <img
                                                    src={opt.src}
                                                    alt={opt.label}
                                                    className={clsx(
                                                        "w-20 h-20 rounded-full object-cover border-4",
                                                        gender === opt.id ? "border-blue-500 shadow-lg" : "border-slate-200"
                                                    )}
                                                />
                                                {gender === opt.id && (
                                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1 border-2 border-white">
                                                        <Check size={12} strokeWidth={4} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Family Background Section */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                                家庭背景 (Family Background)
                            </h2>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { id: 'wealthy', label: '富二代 (Wealthy)', money: '$50,000', desc: 'Starting Easy. Money is not an issue.', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                                    { id: 'middle', label: '中产家庭 (Middle Class)', money: '$10,000', desc: 'Standard Start. Tuition is covered, rent is on you.', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
                                    { id: 'working', label: '工薪阶层 (Working Class)', money: '$5,000', desc: 'Hard Mode. You need to work to survive.', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
                                ].map((bg) => (
                                    <button
                                        key={bg.id}
                                        type="button"
                                        onClick={() => setBackground(bg.id as PlayerBackground)}
                                        className={clsx(
                                            "w-full text-left p-3 rounded-xl border transition flex justify-between items-center group",
                                            background === bg.id
                                                ? `${bg.bg} ${bg.border} ring-1 ring-offset-1`
                                                : "border-slate-200 hover:bg-slate-50"
                                        )}
                                    >
                                        <div>
                                            <div className={clsx("font-bold text-sm", background === bg.id ? "text-slate-900" : "text-slate-700")}>{bg.label}</div>
                                            <div className="text-xs text-slate-500">{bg.desc}</div>
                                        </div>
                                        <div className={clsx("font-mono font-bold text-sm", bg.color)}>
                                            {bg.money}
                                        </div>
                                    </button>
                                ))}
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

                        {/* Footer */}
                        <div className="text-center mt-8 text-slate-400 text-sm">
                            <p>© 2026 USYD Student Simulation. All rights reserved.</p>
                            <p className="mt-1">Developed by GitHub @LSS-Q Noah</p>
                        </div>
                    </form>
                </div>
            </div>
            <LegacyModal isOpen={showLegacyModal} onClose={() => setShowLegacyModal(false)} />
        </div>
    );
};
