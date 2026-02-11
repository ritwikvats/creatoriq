'use client';

import { useState } from 'react';
import { api } from '@/lib/api-client';
import {
    Sparkles, RefreshCw, CheckCircle2, AlertTriangle, Target, BarChart3
} from 'lucide-react';

interface AnalyticsReport {
    growthScore: number;
    statInsights: {
        totalFollowers: string;
        youtubeViews: string;
        contentCreated: string;
    };
    platformNudges: {
        youtube: string;
        instagram: string;
    };
    whatsWorking: string[];
    needsAttention: string[];
    weeklyAction: string;
    goalText: string;
}

interface WeeklyReportProps {
    analytics: any;
    connectedCount: number;
    onReportLoaded?: (report: AnalyticsReport) => void;
}

export default function WeeklyReport({ analytics, connectedCount, onReportLoaded }: WeeklyReportProps) {
    const [report, setReport] = useState<AnalyticsReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateReport = async () => {
        setLoading(true);
        setError('');
        try {
            let instagramAnalytics = null;
            try {
                instagramAnalytics = await api.get('/instagram/analytics');
            } catch (err) {
                console.log('Instagram analytics not available');
            }

            const comprehensiveAnalytics = {
                instagram: instagramAnalytics?.account ? {
                    followers: instagramAnalytics.account.followers_count || 0,
                    posts: instagramAnalytics.account.media_count || 0,
                    engagementRate: instagramAnalytics.account.engagement_rate || instagramAnalytics.stats?.engagement_rate || 0,
                    avgLikes: Math.round(instagramAnalytics.account.avg_likes || 0),
                    avgComments: Math.round(instagramAnalytics.account.avg_comments || 0),
                    username: instagramAnalytics.account.username || ''
                } : null,
                youtube: analytics.youtube?.connected ? {
                    subscribers: analytics.youtube.subscribers || 0,
                    totalViews: analytics.youtube.views || 0,
                    totalVideos: analytics.youtube.videos || 0,
                    channelName: analytics.youtube.channelName || ''
                } : null
            };

            const data = await api.post('/ai/analytics-report', { analytics: comprehensiveAnalytics });
            const reportData = data.report;
            setReport(reportData);
            onReportLoaded?.(reportData);
        } catch (err: any) {
            setError(err.message || 'Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const scoreColor = (score: number) => {
        if (score >= 7) return 'text-green-600';
        if (score >= 4) return 'text-yellow-600';
        return 'text-red-600';
    };

    const scoreBarColor = (score: number) => {
        if (score >= 7) return 'bg-green-500';
        if (score >= 4) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-6 shadow-md border border-primary-100">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-bold text-dark-800">Weekly Performance Report</h2>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-purple-600 to-primary-600 text-white rounded-full shadow-lg">
                        Powered by AI
                    </span>
                    {report ? (
                        <button
                            onClick={generateReport}
                            disabled={loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 bg-white rounded-lg border border-primary-200 hover:border-primary-300 transition-colors"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            Regenerate
                        </button>
                    ) : null}
                </div>
            </div>

            {!report && !loading && (
                <div>
                    <p className="text-dark-600 mb-4">Get a structured AI report on your cross-platform performance with growth scoring, strengths, and a focused weekly action.</p>
                    <button
                        onClick={generateReport}
                        disabled={loading || connectedCount === 0}
                        className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Sparkles className="w-5 h-5" />
                        {connectedCount === 0 ? 'Connect a platform first' : 'Generate Report'}
                    </button>
                </div>
            )}

            {loading && (
                <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-dark-600 animate-pulse">Analyzing your cross-platform data...</p>
                </div>
            )}

            {report && !loading && (
                <div className="space-y-5">
                    {/* Growth Score */}
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-dark-600">Growth Score</span>
                            <span className={`text-2xl font-bold ${scoreColor(report.growthScore)}`}>
                                {report.growthScore}/10
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full transition-all duration-500 ${scoreBarColor(report.growthScore)}`}
                                style={{ width: `${report.growthScore * 10}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* What's Working + Needs Attention side by side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <h3 className="font-semibold text-dark-800">What's Working</h3>
                            </div>
                            <ul className="space-y-2">
                                {report.whatsWorking.map((item, i) => (
                                    <li key={i} className="text-sm text-dark-600 flex items-start gap-2">
                                        <span className="text-green-500 mt-0.5 shrink-0">+</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-amber-500">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                                <h3 className="font-semibold text-dark-800">Needs Attention</h3>
                            </div>
                            <ul className="space-y-2">
                                {report.needsAttention.map((item, i) => (
                                    <li key={i} className="text-sm text-dark-600 flex items-start gap-2">
                                        <span className="text-amber-500 mt-0.5 shrink-0">!</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Weekly Action */}
                    <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-5 text-white shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5" />
                            <h3 className="font-semibold">This Week's #1 Action</h3>
                        </div>
                        <p className="text-white/95 text-sm leading-relaxed">"{report.weeklyAction}"</p>
                    </div>

                    {/* Goal */}
                    {report.goalText && (
                        <div className="text-center py-2">
                            <p className="text-xs text-dark-500 uppercase tracking-wide font-medium mb-1">Monthly Goal</p>
                            <p className="text-sm text-dark-700 font-medium">{report.goalText}</p>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                    <p className="font-medium">Error:</p>
                    <p className="text-sm">{error}</p>
                    <button onClick={generateReport} className="mt-2 text-red-600 hover:text-red-700 font-medium text-sm">
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}
