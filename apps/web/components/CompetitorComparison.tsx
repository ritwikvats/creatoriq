'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { api } from '@/lib/api-client';

interface CompetitorComparisonProps {
    competitorProfile: any;
    platform: string;
    onComparisonLoaded?: (data: any) => void;
}

export default function CompetitorComparison({ competitorProfile, platform, onComparisonLoaded }: CompetitorComparisonProps) {
    const [comparison, setComparison] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCompare = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await api.post('/competitors/compare', {
                platform,
                competitorUsername: competitorProfile.username,
            });

            if (data.success) {
                setComparison(data);
                onComparisonLoaded?.(data);
            } else {
                setError(data.error || 'Failed to compare');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to compare');
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: number): string => {
        if (num === -1) return 'Hidden';
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
    };

    const getBarWidth = (you: number, comp: number): { youWidth: number; compWidth: number } => {
        const max = Math.max(you, comp, 1);
        return {
            youWidth: Math.max((you / max) * 100, 3),
            compWidth: Math.max((comp / max) * 100, 3),
        };
    };

    const getVerdictIcon = (you: number, comp: number) => {
        if (you > comp * 1.05) return <TrendingUp className="w-4 h-4 text-green-500" />;
        if (comp > you * 1.05) return <TrendingDown className="w-4 h-4 text-red-500" />;
        return <Minus className="w-4 h-4 text-gray-400" />;
    };

    if (!comparison) {
        return (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-dark-800 mb-3">Compare with Your Stats</h3>
                <p className="text-sm text-dark-500 mb-4">See a side-by-side breakdown of your metrics vs @{competitorProfile.username}</p>
                <button
                    onClick={handleCompare}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Comparing...
                        </>
                    ) : (
                        <>
                            <ArrowRight className="w-5 h-5" />
                            Compare with Me
                        </>
                    )}
                </button>

                {error && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}
            </div>
        );
    }

    const metrics = comparison.metrics || [];

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-dark-800">
                    You vs @{competitorProfile.username}
                </h3>
                <button
                    onClick={handleCompare}
                    disabled={loading}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            <div className="space-y-5">
                {metrics.map((m: any, i: number) => {
                    const youVal = typeof m.you === 'number' ? m.you : 0;
                    const compVal = typeof m.competitor === 'number' ? m.competitor : 0;
                    const { youWidth, compWidth } = getBarWidth(youVal, compVal);
                    const isPercent = m.unit === '%';
                    const youDisplay = isPercent ? `${youVal}%` : formatNumber(youVal);
                    const compDisplay = isPercent ? `${compVal}%` : formatNumber(compVal);

                    return (
                        <div key={i}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-medium text-dark-700">{m.metric}</span>
                                {getVerdictIcon(youVal, compVal)}
                            </div>
                            <div className="space-y-1.5">
                                {/* Your bar */}
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-dark-500 w-8 shrink-0">You</span>
                                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                                            style={{ width: `${youWidth}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-dark-800 w-16 text-right">{youDisplay}</span>
                                </div>
                                {/* Competitor bar */}
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-dark-500 w-8 shrink-0 truncate" title={competitorProfile.username}>
                                        @{competitorProfile.username.slice(0, 4)}
                                    </span>
                                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 transition-all duration-500"
                                            style={{ width: `${compWidth}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-dark-800 w-16 text-right">{compDisplay}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-400" />
                    <span className="text-xs text-dark-500">You</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-400" />
                    <span className="text-xs text-dark-500">@{competitorProfile.username}</span>
                </div>
            </div>
        </div>
    );
}
