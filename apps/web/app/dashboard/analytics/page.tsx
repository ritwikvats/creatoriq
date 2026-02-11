'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { api } from '@/lib/api-client';
import DashboardLayout from '@/components/DashboardLayout';
import GrowthStats from '@/components/GrowthStats';
import ReactMarkdown from 'react-markdown';
import {
    Download, RefreshCw, Youtube, Instagram, Users, Eye, FileText,
    Sparkles, TrendingUp, BarChart3, CheckCircle2, XCircle
} from 'lucide-react';
import { exportAsCSV, exportAsJSON, exportAsPDF, formatDataForExport } from '@/lib/export-utils';

interface PlatformStats {
    youtube: {
        connected: boolean;
        subscribers?: number;
        views?: number;
        videos?: number;
        channelName?: string;
    };
    instagram: {
        connected: boolean;
        username?: string;
        followers?: number;
        posts?: number;
        engagementRate?: number;
    };
}

export default function AnalyticsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-dark-600">Loading analytics...</p>
                </div>
            </div>
        }>
            <AnalyticsContent />
        </Suspense>
    );
}

function AnalyticsContent() {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<PlatformStats>({
        youtube: { connected: false },
        instagram: { connected: false },
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [aiSummary, setAiSummary] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                setUser(user);
            }
        };
        getUser();
    }, [router, supabase]);

    useEffect(() => {
        if (user) {
            fetchAllStats();
        }
    }, [user]);

    const fetchAllStats = async () => {
        try {
            setLoading(true);

            // Fetch YouTube stats (authenticated - no userId in URL)
            let ytData: any = { connected: false };
            try {
                ytData = await api.get('/youtube/stats');
            } catch (err) {
                console.log('YouTube data not available');
            }

            // Fetch Instagram status (authenticated - no userId in URL)
            let igData: any = { connected: false };
            try {
                igData = await api.get('/instagram/status');
            } catch (err) {
                console.log('Instagram data not available');
            }

            setStats({
                youtube: {
                    connected: ytData.connected || false,
                    subscribers: ytData.channel?.subscriberCount || 0,
                    views: ytData.channel?.totalViews || 0,
                    videos: ytData.channel?.totalVideos || 0,
                    channelName: ytData.channel?.channelName,
                },
                instagram: {
                    connected: igData.connected || false,
                    username: igData.username,
                    followers: igData.followers || 0,
                    posts: igData.posts || 0,
                },
            });
        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAllStats();
        setRefreshing(false);
    };

    const generateAISummary = async () => {
        setAiLoading(true);
        setAiError('');
        try {
            // Gather real analytics data
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
                    topPosts: instagramAnalytics.topPosts?.slice(0, 3) || [],
                    username: instagramAnalytics.account.username || ''
                } : null,
                youtube: stats.youtube.connected ? {
                    subscribers: stats.youtube.subscribers || 0,
                    totalViews: stats.youtube.views || 0,
                    totalVideos: stats.youtube.videos || 0,
                    channelName: stats.youtube.channelName || ''
                } : null
            };

            const data = await api.post('/ai/insights', { analytics: comprehensiveAnalytics });
            setAiSummary(data.insights);
        } catch (err: any) {
            setAiError(err.message || 'Failed to generate AI summary');
        } finally {
            setAiLoading(false);
        }
    };

    const handleExport = async (format: 'csv' | 'pdf' | 'json') => {
        try {
            const data = await api.get('/analytics/timeline?days=30');
            const formatted = formatDataForExport('analytics', data.snapshots || []);

            if (format === 'csv') {
                exportAsCSV({ type: 'analytics', data: formatted, filename: 'analytics' });
            } else if (format === 'pdf') {
                exportAsPDF({ type: 'analytics', data: formatted, filename: 'analytics' });
            } else {
                exportAsJSON({ type: 'analytics', data: formatted, filename: 'analytics' });
            }
        } catch (err) {
            console.error('Export failed:', err);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-8 max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-32 bg-gray-200 rounded-xl"></div>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="h-32 bg-gray-200 rounded-xl"></div>
                            <div className="h-32 bg-gray-200 rounded-xl"></div>
                            <div className="h-32 bg-gray-200 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const totalFollowers = (stats.youtube.subscribers || 0) + (stats.instagram.followers || 0);
    const connectedCount = (stats.youtube.connected ? 1 : 0) + (stats.instagram.connected ? 1 : 0);
    const totalContent = (stats.youtube.videos || 0) + (stats.instagram.posts || 0);

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-dark-800 flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-primary-500" />
                            Analytics Overview
                        </h1>
                        <p className="text-dark-600 mt-1">Cross-platform performance metrics</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-dark-700 font-medium shadow-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                </div>

                {/* Connection Status Banner */}
                <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Connected Platforms</h2>
                            <p className="text-white/80">
                                {connectedCount} of 2 platforms connected
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${stats.youtube.connected ? 'bg-white/20' : 'bg-black/20'}`}>
                                <Youtube className="w-5 h-5" />
                                {stats.youtube.connected ? (
                                    <><CheckCircle2 className="w-4 h-4 text-green-300" /> Connected</>
                                ) : (
                                    <><XCircle className="w-4 h-4 text-red-300" /> Not Connected</>
                                )}
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${stats.instagram.connected ? 'bg-white/20' : 'bg-black/20'}`}>
                                <Instagram className="w-5 h-5" />
                                {stats.instagram.connected ? (
                                    <><CheckCircle2 className="w-4 h-4 text-green-300" /> Connected</>
                                ) : (
                                    <><XCircle className="w-4 h-4 text-red-300" /> Not Connected</>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overall Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-primary-50 rounded-lg">
                                <Users className="w-6 h-6 text-primary-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-dark-800">{totalFollowers.toLocaleString()}</h3>
                        <p className="text-sm text-dark-600 mt-1">Total Followers</p>
                        <p className="text-xs text-dark-400 mt-1">Across all platforms</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-50 rounded-lg">
                                <Eye className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-dark-800">{(stats.youtube.views || 0).toLocaleString()}</h3>
                        <p className="text-sm text-dark-600 mt-1">YouTube Views</p>
                        <p className="text-xs text-dark-400 mt-1">Total video views</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <FileText className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-dark-800">{totalContent.toLocaleString()}</h3>
                        <p className="text-sm text-dark-600 mt-1">Content Created</p>
                        <p className="text-xs text-dark-400 mt-1">Videos + Posts</p>
                    </div>
                </div>

                {/* Platform Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* YouTube Card */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <Youtube className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-dark-800">YouTube</h3>
                            </div>
                            {stats.youtube.connected ? (
                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">Connected</span>
                            ) : (
                                <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100">Not Connected</span>
                            )}
                        </div>
                        {stats.youtube.connected ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-dark-500">Channel</p>
                                    <p className="text-lg font-semibold text-dark-800">{stats.youtube.channelName || 'N/A'}</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-red-50 rounded-xl p-3 text-center">
                                        <p className="text-2xl font-bold text-red-600">{stats.youtube.subscribers?.toLocaleString()}</p>
                                        <p className="text-xs text-dark-500 mt-1">Subscribers</p>
                                    </div>
                                    <div className="bg-red-50 rounded-xl p-3 text-center">
                                        <p className="text-2xl font-bold text-red-600">{stats.youtube.views?.toLocaleString()}</p>
                                        <p className="text-xs text-dark-500 mt-1">Views</p>
                                    </div>
                                    <div className="bg-red-50 rounded-xl p-3 text-center">
                                        <p className="text-2xl font-bold text-red-600">{stats.youtube.videos?.toLocaleString()}</p>
                                        <p className="text-xs text-dark-500 mt-1">Videos</p>
                                    </div>
                                </div>
                                <a
                                    href="/dashboard/youtube"
                                    className="block text-center bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition-colors font-medium"
                                >
                                    View Detailed Analytics
                                </a>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Youtube className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-dark-500 mb-4">Connect your YouTube account to see analytics</p>
                                <a href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium">
                                    Connect YouTube
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Instagram Card */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Instagram className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-dark-800">Instagram</h3>
                            </div>
                            {stats.instagram.connected ? (
                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">Connected</span>
                            ) : (
                                <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium border border-red-100">Not Connected</span>
                            )}
                        </div>
                        {stats.instagram.connected ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-dark-500">Username</p>
                                    <p className="text-lg font-semibold text-dark-800">@{stats.instagram.username || 'N/A'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-purple-50 rounded-xl p-3 text-center">
                                        <p className="text-2xl font-bold text-purple-600">{stats.instagram.followers?.toLocaleString()}</p>
                                        <p className="text-xs text-dark-500 mt-1">Followers</p>
                                    </div>
                                    <div className="bg-purple-50 rounded-xl p-3 text-center">
                                        <p className="text-2xl font-bold text-purple-600">{stats.instagram.posts?.toLocaleString()}</p>
                                        <p className="text-xs text-dark-500 mt-1">Posts</p>
                                    </div>
                                </div>
                                <a
                                    href="/dashboard/instagram"
                                    className="block text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-colors font-medium"
                                >
                                    View Detailed Analytics
                                </a>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Instagram className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-dark-500 mb-4">Connect your Instagram account to see analytics</p>
                                <a href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-colors font-medium">
                                    Connect Instagram
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Analytics Summary */}
                <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-6 shadow-md border border-primary-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary-600" />
                            <h2 className="text-xl font-bold text-dark-800">AI Analytics Summary</h2>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-purple-600 to-primary-600 text-white rounded-full shadow-lg">
                            Powered by GPT-5.2
                        </span>
                    </div>

                    {!aiSummary && !aiLoading && (
                        <div>
                            <p className="text-dark-600 mb-4">Get an AI-powered analysis of your cross-platform performance with actionable growth recommendations.</p>
                            <button
                                onClick={generateAISummary}
                                disabled={aiLoading || connectedCount === 0}
                                className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Sparkles className="w-5 h-5" />
                                {connectedCount === 0 ? 'Connect a platform first' : 'Generate AI Analysis'}
                            </button>
                        </div>
                    )}

                    {aiLoading && (
                        <div className="text-center py-8">
                            <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                            <p className="text-dark-600 animate-pulse">AI is analyzing your cross-platform data...</p>
                        </div>
                    )}

                    {aiSummary && (
                        <div className="bg-white rounded-xl p-5 shadow-sm">
                            <div className="ai-insights-content prose prose-sm max-w-none
                                prose-headings:text-dark-800 prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2
                                prose-h2:text-base prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-1
                                prose-p:text-dark-600 prose-p:leading-relaxed prose-p:my-1
                                prose-li:text-dark-600 prose-li:my-0.5
                                prose-strong:text-dark-800
                                prose-ul:my-1 prose-ol:my-1">
                                <ReactMarkdown>{aiSummary}</ReactMarkdown>
                            </div>
                            <button
                                onClick={generateAISummary}
                                disabled={aiLoading}
                                className="mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Regenerate Analysis
                            </button>
                        </div>
                    )}

                    {aiError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                            <p className="font-medium">Error:</p>
                            <p className="text-sm">{aiError}</p>
                            <button onClick={generateAISummary} className="mt-2 text-red-600 hover:text-red-700 font-medium text-sm">
                                Try Again
                            </button>
                        </div>
                    )}
                </div>

                {/* Growth Trends */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-6 h-6 text-primary-500" />
                        <h2 className="text-2xl font-bold text-dark-800">Growth Trends</h2>
                    </div>
                    <GrowthStats />
                </div>

                {/* Export Section */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Download className="w-6 h-6 text-dark-700" />
                        <h2 className="text-xl font-bold text-dark-800">Export Analytics</h2>
                    </div>
                    <p className="text-dark-500 text-sm mb-4">Download your analytics data in various formats</p>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => handleExport('csv')}
                            className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors"
                        >
                            Export as CSV
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors"
                        >
                            Export as PDF
                        </button>
                        <button
                            onClick={() => handleExport('json')}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors"
                        >
                            Export as JSON
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
