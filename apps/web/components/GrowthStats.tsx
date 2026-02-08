'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface GrowthStatsProps {
    userId: string;
    platform?: 'youtube' | 'instagram';
}

export default function GrowthStats({ userId, platform }: GrowthStatsProps) {
    const [growth, setGrowth] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGrowthData();
    }, [userId, platform]);

    const fetchGrowthData = async () => {
        try {
            setLoading(true);
            const api_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const platformParam = platform ? `?platform=${platform}` : '';
            const response = await fetch(`${api_url}/analytics/growth/${userId}${platformParam}`);
            const data = await response.json();
            setGrowth(data.growth);
        } catch (error) {
            console.error('Failed to fetch growth data:', error);
            setGrowth(null);
        } finally {
            setLoading(false);
        }
    };

    const GrowthIndicator = ({ value }: { value: number }) => {
        if (value > 0) {
            return (
                <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold">+{value.toFixed(1)}%</span>
                </div>
            );
        } else if (value < 0) {
            return (
                <div className="flex items-center gap-1 text-red-600">
                    <TrendingDown className="w-4 h-4" />
                    <span className="font-semibold">{value.toFixed(1)}%</span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-1 text-gray-500">
                    <Minus className="w-4 h-4" />
                    <span className="font-semibold">0%</span>
                </div>
            );
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                        <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!growth || Object.keys(growth).length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center text-gray-500">
                <p className="text-sm">Not enough data to calculate growth rates</p>
                <p className="text-xs text-gray-400 mt-1">Data is collected daily</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {Object.entries(growth).map(([platformKey, data]: [string, any]) => (
                <div key={platformKey} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-dark-800 capitalize flex items-center gap-2">
                            {platformKey === 'youtube' ? '📺' : '📸'} {platformKey} Growth
                        </h3>
                        <GrowthIndicator value={data.growth_percentage} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Current</p>
                            <p className="text-xl font-bold text-dark-800">
                                {data.current?.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Previous</p>
                            <p className="text-xl font-bold text-gray-600">
                                {data.previous?.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Total Growth</p>
                            <p className={`text-xl font-bold ${data.total_growth > 0 ? 'text-green-600' : data.total_growth < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                {data.total_growth > 0 && '+'}{data.total_growth?.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Daily Avg</p>
                            <p className={`text-xl font-bold ${data.daily_average > 0 ? 'text-green-600' : data.daily_average < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                {data.daily_average > 0 && '+'}{data.daily_average}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                            📅 Measured over {data.period_days} day{data.period_days !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
