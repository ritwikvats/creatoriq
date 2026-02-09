'use client';

import { useState } from 'react';
import { Sparkles, TrendingUp, DollarSign, Lightbulb } from 'lucide-react';

interface AIInsightsProps {
    analytics?: {
        views?: number;
        engagement?: number;
        subscribers?: number;
        revenue?: number;
    };
}

export default function AIInsights({ analytics }: AIInsightsProps) {
    const [insights, setInsights] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    async function generateInsights() {
        setLoading(true);
        setError('');

        try {
            // First, fetch real analytics data from all connected platforms
            const token = localStorage.getItem('token');

            // Fetch Instagram analytics
            let instagramData = null;
            try {
                const igResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/instagram/analytics`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (igResponse.ok) {
                    instagramData = await igResponse.json();
                }
            } catch (err) {
                console.log('Instagram data not available');
            }

            // Fetch YouTube analytics
            let youtubeData = null;
            try {
                const ytResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/youtube/analytics`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (ytResponse.ok) {
                    youtubeData = await ytResponse.json();
                }
            } catch (err) {
                console.log('YouTube data not available');
            }

            // Combine all analytics data
            const comprehensiveAnalytics = {
                instagram: instagramData ? {
                    followers: instagramData.account?.followers_count || 0,
                    posts: instagramData.account?.media_count || 0,
                    engagementRate: instagramData.account?.engagement_rate || 0,
                    avgLikes: Math.round(instagramData.account?.avg_likes || 0),
                    avgComments: Math.round(instagramData.account?.avg_comments || 0),
                    topPosts: instagramData.topPosts?.slice(0, 3) || [],
                    username: instagramData.account?.username || ''
                } : null,
                youtube: youtubeData ? {
                    subscribers: youtubeData.channelStats?.subscriberCount || 0,
                    totalViews: youtubeData.channelStats?.totalViews || 0,
                    totalVideos: youtubeData.channelStats?.totalVideos || 0,
                    channelName: youtubeData.channelStats?.channelName || ''
                } : null
            };

            // Generate AI insights with comprehensive data
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/insights`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    analytics: comprehensiveAnalytics
                })
            });

            if (!response.ok) throw new Error('Failed to generate insights');

            const data = await response.json();
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
                    <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-dark-700 leading-relaxed">
                            {insights}
                        </div>
                    </div>

                    <button
                        onClick={generateInsights}
                        disabled={loading}
                        className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                    >
                        <Sparkles className="w-4 h-4" />
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
