'use client';

import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, AlertTriangle, Target, RefreshCw, Zap } from 'lucide-react';
import { api } from '@/lib/api-client';

interface CompetitorGapAnalysisProps {
    competitorProfile: any;
    platform: string;
    comparisonData?: any;
}

interface GapAnalysis {
    overallVerdict: string;
    competitiveScore: number;
    metrics: Array<{
        metric: string;
        you: number;
        competitor: number;
        difference: string;
        verdict: 'ahead' | 'behind' | 'tied';
    }>;
    strengths: string[];
    gaps: string[];
    actionPlan: Array<{
        action: string;
        expectedImpact: string;
        priority: 'high' | 'medium' | 'low';
        timeframe: string;
    }>;
    contentStrategy: string;
}

export default function CompetitorGapAnalysis({ competitorProfile, platform, comparisonData }: CompetitorGapAnalysisProps) {
    const [analysis, setAnalysis] = useState<GapAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateAnalysis = async () => {
        setLoading(true);
        setError('');
        try {
            const body: any = {
                platform,
                competitorUsername: competitorProfile.username,
            };

            // Pass pre-fetched stats if available
            if (comparisonData) {
                body.userStats = comparisonData.user;
                body.competitorStats = comparisonData.competitor;
            }

            const data = await api.post('/competitors/gap-analysis', body);

            if (data.success && data.analysis) {
                setAnalysis(data.analysis);
            } else {
                setError(data.error || 'Failed to generate analysis');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to generate gap analysis');
        } finally {
            setLoading(false);
        }
    };

    const scoreColor = (score: number) => {
        if (score >= 70) return 'text-green-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const scoreBarColor = (score: number) => {
        if (score >= 70) return 'bg-green-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const priorityColor = (priority: string) => {
        if (priority === 'high') return 'bg-red-100 text-red-700';
        if (priority === 'medium') return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    return (
        <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-6 shadow-md border border-primary-100">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-bold text-dark-800">AI Gap Analysis</h2>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-purple-600 to-primary-600 text-white rounded-full shadow-lg">
                        Powered by AI
                    </span>
                    {analysis && (
                        <button
                            onClick={generateAnalysis}
                            disabled={loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 bg-white rounded-lg border border-primary-200 hover:border-primary-300 transition-colors"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            Regenerate
                        </button>
                    )}
                </div>
            </div>

            {/* Generate Button */}
            {!analysis && !loading && (
                <div>
                    <p className="text-dark-600 mb-4">
                        Get an AI-powered competitive analysis comparing you with @{competitorProfile.username} — strengths, gaps, and a concrete action plan.
                    </p>
                    <button
                        onClick={generateAnalysis}
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Sparkles className="w-5 h-5" />
                        Generate Analysis
                    </button>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-dark-600 animate-pulse">Analyzing competitive positioning...</p>
                </div>
            )}

            {/* Analysis Results */}
            {analysis && !loading && (
                <div className="space-y-5">
                    {/* Overall Verdict */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <p className="text-sm text-dark-700 leading-relaxed">{analysis.overallVerdict}</p>
                    </div>

                    {/* Competitive Score */}
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-dark-600">Competitive Score</span>
                            <span className={`text-2xl font-bold ${scoreColor(analysis.competitiveScore)}`}>
                                {analysis.competitiveScore}/100
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full transition-all duration-500 ${scoreBarColor(analysis.competitiveScore)}`}
                                style={{ width: `${analysis.competitiveScore}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Strengths + Gaps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <h3 className="font-semibold text-dark-800">Your Strengths</h3>
                            </div>
                            <ul className="space-y-2">
                                {(analysis.strengths || []).map((item, i) => (
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
                                <h3 className="font-semibold text-dark-800">Gaps to Close</h3>
                            </div>
                            <ul className="space-y-2">
                                {(analysis.gaps || []).map((item, i) => (
                                    <li key={i} className="text-sm text-dark-600 flex items-start gap-2">
                                        <span className="text-amber-500 mt-0.5 shrink-0">!</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Action Plan */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Target className="w-5 h-5 text-primary-600" />
                            <h3 className="font-semibold text-dark-800">Action Plan</h3>
                        </div>
                        <div className="space-y-3">
                            {(analysis.actionPlan || []).map((item, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-bold text-primary-600 mt-0.5">{i + 1}.</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-dark-800">{item.action}</p>
                                        <p className="text-xs text-dark-500 mt-0.5">{item.expectedImpact}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase ${priorityColor(item.priority)}`}>
                                            {item.priority}
                                        </span>
                                        <span className="text-xs text-dark-400">{item.timeframe}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Strategy */}
                    {analysis.contentStrategy && (
                        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-5 text-white shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-5 h-5" />
                                <h3 className="font-semibold">Content Strategy</h3>
                            </div>
                            <p className="text-white/95 text-sm leading-relaxed">{analysis.contentStrategy}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 mt-4">
                    <p className="font-medium">Error:</p>
                    <p className="text-sm">{error}</p>
                    <button onClick={generateAnalysis} className="mt-2 text-red-600 hover:text-red-700 font-medium text-sm">
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}
