'use client';

import { useState } from 'react';
import { Sparkles, TrendingUp, DollarSign, Lightbulb, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api } from '@/lib/api-client';

export default function AIInsights() {
    const [insights, setInsights] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    async function generateInsights() {
        setLoading(true);
        setError('');

        try {
            // Fetch real analytics data from connected platforms
            let instagramData = null;
            try {
                instagramData = await api.get('/instagram/analytics');
            } catch (err) {
                console.log('Instagram data not available');
            }

            let youtubeData = null;
            try {
                youtubeData = await api.get('/youtube/stats');
            } catch (err) {
                console.log('YouTube data not available');
            }

            // Map data correctly from API response structures
            const comprehensiveAnalytics = {
                instagram: instagramData?.account ? {
                    followers: instagramData.account.followers_count || 0,
                    posts: instagramData.account.media_count || 0,
                    engagementRate: instagramData.account.engagement_rate || instagramData.stats?.engagement_rate || 0,
                    avgLikes: Math.round(instagramData.account.avg_likes || 0),
                    avgComments: Math.round(instagramData.account.avg_comments || 0),
                    topPosts: instagramData.topPosts?.slice(0, 3) || [],
                    username: instagramData.account.username || ''
                } : null,
                youtube: youtubeData?.channel ? {
                    subscribers: youtubeData.channel.subscriberCount || 0,
                    totalViews: youtubeData.channel.totalViews || 0,
                    totalVideos: youtubeData.channel.totalVideos || 0,
                    channelName: youtubeData.channel.channelName || ''
                } : null
            };

            const data = await api.post('/ai/insights', { analytics: comprehensiveAnalytics });
            setInsights(data.insights);
        } catch (err: any) {
            setError(err.message || 'Failed to generate AI insights');
            console.error('AI Error:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 shadow-lg border border-primary-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-bold text-dark-800">
                        AI-Powered Insights
                    </h3>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-purple-600 to-primary-600 text-white rounded-full shadow-lg">
                    Powered by GPT-5.2
                </span>
            </div>

            <p className="text-dark-600 mb-4">
                Get personalized recommendations to grow your creator business
            </p>

            {!insights && !loading && (
                <button
                    onClick={generateInsights}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <Sparkles className="w-5 h-5" />
                    Generate AI Insights
                </button>
            )}

            {loading && (
                <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-dark-600 animate-pulse">
                        AI is analyzing your data...
                    </p>
                </div>
            )}

            {insights && (
                <div className="bg-white rounded-lg p-5 shadow-md">
                    <div className="ai-insights-content prose prose-sm max-w-none
                        prose-headings:text-dark-800 prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2
                        prose-h2:text-base prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-1
                        prose-p:text-dark-600 prose-p:leading-relaxed prose-p:my-1
                        prose-li:text-dark-600 prose-li:my-0.5
                        prose-strong:text-dark-800
                        prose-ul:my-1 prose-ol:my-1">
                        <ReactMarkdown>{insights}</ReactMarkdown>
                    </div>

                    <button
                        onClick={generateInsights}
                        disabled={loading}
                        className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Regenerate Insights
                    </button>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <p className="font-medium">Error:</p>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={generateInsights}
                        className="mt-2 text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Feature Hints */}
            <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="text-center">
                    <TrendingUp className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                    <p className="text-xs text-dark-600">Growth Tips</p>
                </div>
                <div className="text-center">
                    <DollarSign className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                    <p className="text-xs text-dark-600">Revenue Ideas</p>
                </div>
                <div className="text-center">
                    <Lightbulb className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                    <p className="text-xs text-dark-600">Content Suggestions</p>
                </div>
            </div>
        </div>
    );
}
