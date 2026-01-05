import React from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { LIFE_EVENTS } from '../../data/events/life';
import { HOUSING_CONFIG } from '../../data/constants';
import { REGIONS } from '../../data/regions';
import { RegionType } from '../../types/game';
import { Coffee, Heart, Home, Car, Smile, Key, Map } from 'lucide-react';

export const LifestyleView: React.FC = () => {
    const {
        stats,
        housing,
        assets,
        actionPoints,
        useActionPoints,
        updateStats,
        triggerEvent,
        addAsset,
        updateMoney,
        currentRegion,
        setRegion
    } = useGameStore();

    const currentHousing = HOUSING_CONFIG[housing];
    const regionConfig = REGIONS[currentRegion];
    const hasCar = assets.includes('car_camry');

    // Rest action
    const handleRest = () => {
        if (useActionPoints(1)) {
            updateStats({ sanity: 15 }); // Match Dashboard update
        }
    };

    // Entertainment
    const handleEntertainment = () => {
        if (useActionPoints(2)) {
            updateStats({ sanity: 15, money: -50 }); // Buffed slightly

            const roll = Math.random();
            if (roll < 0.1) triggerEvent(LIFE_EVENTS['social_event']);
            else if (roll < 0.15) triggerEvent(LIFE_EVENTS['gambling_temptation']);
        }
    };

    // Check Phone
    const handleCheckPhone = () => {
        if (useActionPoints(0)) {
            const roll = Math.random();
            if (roll < 0.15) triggerEvent(LIFE_EVENTS['scam_call']);
            else if (roll < 0.25) triggerEvent(LIFE_EVENTS['landlord_trouble']);
            else if (roll < 0.35) triggerEvent(LIFE_EVENTS['relationship_drama']);
        }
    };

    // Buy Car
    const handleBuyCar = () => {
        if (stats.money >= 5000) {
            updateMoney(-5000);
            addAsset('car_camry');
            updateStats({ sanity: 10, network: 5 }); // Buying a car feels good
            alert("恭喜提车！你获得了一辆二手神车 Camry。解锁 'Uber Eats' 打工选项！");
        } else {
            alert("钱不够！你需要 $5,000。");
        }
    };

    const handleMoveRegion = (regionKey: RegionType) => {
        if (regionKey === currentRegion) return;

        if (actionPoints < 2) {
            alert("体力不足！搬家需要消耗 2 AP。");
            return;
        }
        if (stats.money < 300) {
            alert("钱不够！你需要 $300 搬家费。");
            return;
        }

        const target = REGIONS[regionKey];
        if (confirm(`确定要搬去 ${target.label} 吗？\n\n费用: $300 + 2 AP\n房租系数: ${target.rentModifier}x\n治安: ${target.security.toUpperCase()}`)) {
            useActionPoints(2);
            updateMoney(-300);
            setRegion(regionKey);
            updateStats({ sanity: -5 }); // Stress of moving
            alert(`搬家成功！你现在住在 ${target.label}。`);
        }
    };

    return (
        <div className="space-y-6">

            {/* Top Row: Housing & Assets Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1. Housing Hub */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <Home className="w-5 h-5 text-indigo-600" />
                            My Housing
                        </h2>
                        <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                            {currentHousing.label}
                        </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col gap-6">
                        {/* Housing Type Info */}
                        <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Home className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-700">Type: {currentHousing.label}</div>
                                <div className="text-xs text-slate-500 mt-1">Base: ${currentHousing.weeklyCost}/wk</div>
                                <div className={`text-xs font-bold mt-1 ${currentHousing.sanityModifier >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {currentHousing.sanityModifier > 0 ? '+' : ''}{currentHousing.sanityModifier} Sanity
                                </div>
                            </div>
                        </div>

                        {/* Region Info */}
                        <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Map className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <div className="font-bold text-slate-700">Loc: {regionConfig.label}</div>
                                    <div className="text-xs font-mono bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded pb-1">Rent x{regionConfig.rentModifier}</div>
                                </div>
                                <div className="text-xs text-slate-500 mt-1 leading-snug">{regionConfig.desc}</div>
                                <div className="flex gap-2 mt-1">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${regionConfig.sanityModifier >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        Sanity {regionConfig.sanityModifier > 0 ? '+' : ''}{regionConfig.sanityModifier}
                                    </span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${regionConfig.security === 'high' ? 'bg-green-100 text-green-700' : regionConfig.security === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                        Security: {regionConfig.security.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Region Selector */}
                        <div className="grid grid-cols-2 gap-2 mt-auto">
                            {(Object.values(REGIONS) as any[]).map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => handleMoveRegion(r.id)}
                                    disabled={currentRegion === r.id}
                                    className={`text-xs py-2 px-1 rounded border transition ${currentRegion === r.id
                                        ? 'bg-slate-800 text-white border-slate-800'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600'
                                        }`}
                                >
                                    {r.label.split(' ')[0]} {currentRegion !== r.id && `(x${r.rentModifier})`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Assets & Mobility */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <Car className="w-5 h-5 text-emerald-600" />
                            Assets & Mobility
                        </h2>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-center">
                        {hasCar ? (
                            <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <Key className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">Toyota Camry (2012)</div>
                                    <div className="text-xs text-emerald-600 font-bold mt-0.5">UNLOCKED: Uber Eats Job</div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="text-sm text-slate-500">
                                    悉尼没有车约等于没有腿。买辆车可以解锁更多打工机会。
                                </div>
                                <button
                                    onClick={handleBuyCar}
                                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Car className="w-4 h-4" />
                                    Buy Used Camry ($5,000)
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Wellbeing Status (Condensed) */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span className="text-xs font-bold text-slate-500 uppercase">Sanity</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{stats.sanity}</div>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Coffee className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-500 uppercase">Cash</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">${stats.money.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Smile className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-bold text-slate-500 uppercase">Network</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{stats.network}</div>
                </div>
            </div>

            {/* Lifestyle Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <button
                    onClick={handleRest}
                    disabled={actionPoints < 1}
                    className="p-6 bg-white rounded-xl shadow-sm border-2 border-slate-100 hover:border-pink-400 hover:bg-pink-50 transition text-left group disabled:opacity-50"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-pink-100 rounded-lg group-hover:bg-white transition">
                            <Home className="w-5 h-5 text-pink-600" />
                        </div>
                        <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded">-1 AP</span>
                    </div>
                    <div className="font-bold text-slate-800">Deep Rest</div>
                    <div className="text-xs text-slate-500 mt-1">+15 Sanity</div>
                </button>

                <button
                    onClick={handleEntertainment}
                    disabled={actionPoints < 2}
                    className="p-6 bg-white rounded-xl shadow-sm border-2 border-slate-100 hover:border-amber-400 hover:bg-amber-50 transition text-left group disabled:opacity-50"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-white transition">
                            <Coffee className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded">-2 AP</span>
                    </div>
                    <div className="font-bold text-slate-800">City Walk / Cafe</div>
                    <div className="text-xs text-slate-500 mt-1">+15 Sanity | -$50</div>
                </button>

                <button
                    onClick={handleCheckPhone}
                    className="p-6 bg-white rounded-xl shadow-sm border-2 border-slate-100 hover:border-purple-400 hover:bg-purple-50 transition text-left group"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-white transition">
                            <Smile className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-xs font-mono bg-purple-100 text-purple-600 px-2 py-1 rounded">FREE</span>
                    </div>
                    <div className="font-bold text-slate-800">Check Phone</div>
                    <div className="text-xs text-slate-500 mt-1">Random Events</div>
                </button>

            </div>
        </div>
    );
};
