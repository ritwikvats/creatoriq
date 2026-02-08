'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardStats from '@/components/DashboardStats';
import TimelineChart from '@/components/TimelineChart';
import AIInsights from '@/components/AIInsights';
import ConnectYouTube from '@/components/ConnectYouTube';
import ConnectInstagram from '@/components/ConnectInstagram';
// Removed mock data imports - using real data only
import { Youtube, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [youtubeConnected, setYoutubeConnected] = useState(false);
    const [youtubeData, setYoutubeData] = useState<any>(null);
    const [fetchingYouTube, setFetchingYouTube] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                setUser(user);
                setLoading(false);
            }
        };
        getUser();
    }, [router, supabase]);

    // Check for OAuth callback notifications
    useEffect(() => {
        if (!user) return;

        const youtube = searchParams.get('youtube');
        const instagram = searchParams.get('instagram');
        const error = searchParams.get('error');

        if (youtube === 'connected') {
            setNotification({ type: 'success', message: 'YouTube connected successfully!' });
            setYoutubeConnected(true);
            fetchYouTubeData();
            setTimeout(() => setNotification(null), 5000);
        } else if (instagram === 'connected') {
            setNotification({ type: 'success', message: 'Instagram connected successfully!' });
            setTimeout(() => setNotification(null), 5000);
        } else if (error) {
            setNotification({ type: 'error', message: 'Authentication failed. Please try again.' });
            setTimeout(() => setNotification(null), 5000);
        }
    }, [user, searchParams]);

    // Fetch YouTube data when connected
    useEffect(() => {
        if (user && youtubeConnected) {
            fetchYouTubeData();
        }
    }, [user, youtubeConnected]);

    const fetchYouTubeData = async () => {
        if (!user) return;

        setFetchingYouTube(true);
        try {
            const { api } = await import('@/lib/api-client');
            const data = await api.get('/youtube/stats');

            if (data.connected && data.channel) {
                setYoutubeData(data);
                setYoutubeConnected(true);
            } else {
                // No data - set empty state
                setYoutubeData(null);
            }
        } catch (error) {
            console.error('Failed to fetch YouTube data:', error);
            setYoutubeData(null);
        } finally {
            setFetchingYouTube(false);
        }
    };

    const handleConnectionChange = (connected: boolean) => {
        setYoutubeConnected(connected);
        if (connected) {
            fetchYouTubeData();
        } else {
            setYoutubeData(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-dark-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
                {/* Notification Banner */}
                {notification && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 animate-slide-up ${notification.type === 'success'
                        ? 'bg-green-50 border border-green-100 text-green-800'
                        : 'bg-red-50 border border-red-100 text-red-800'
                        }`}>
                        {notification.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        <p className="font-medium">{notification.message}</p>
                    </div>
                )}

                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-dark-800 flex items-center gap-2">
                            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Creator'}! <Sparkles className="w-8 h-8 text-primary-500" />
                        </h1>
                        <p className="text-dark-600 mt-1">Here's your performance overview for this week</p>
                    </div>
                </div>

                {/* Platform Connection Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ConnectYouTube onConnectionChange={handleConnectionChange} />
                    <ConnectInstagram />
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Cards */}
                        <DashboardStats
                            stats={youtubeData?.channel ? {
                                subscribers: youtubeData.channel.subscriberCount,
                                totalViews: youtubeData.channel.totalViews,
                                monthlyRevenue: youtubeData.revenue || 0,
                                engagementRate: youtubeData.analytics?.avgEngagementRate ?? 0,
                            } : {
                                subscribers: 0,
                                totalViews: 0,
                                monthlyRevenue: 0,
                                engagementRate: 0
                            }}
                        />

                        {/* Main Chart */}
                        <TimelineChart userId={user.id} platform="all" days={30} />
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        {/* AI Insights Card */}
                        <AIInsights analytics={youtubeData?.channel ? {
                            subscribers: youtubeData.channel.subscriberCount,
                            views: youtubeData.channel.totalViews,
                            engagement: youtubeData.analytics?.avgEngagementRate ?? 0,
                            revenue: youtubeData.revenue || 0
                        } : {
                            subscribers: 0,
                            views: 0,
                            engagement: 0,
                            revenue: 0
                        }} />

                        {/* Recent Videos List */}
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold text-dark-800 mb-6">Recent Videos</h2>
                            <div className="space-y-4">
                                {(youtubeData?.recentVideos || []).slice(0, 3).map((video: any) => (
                                    <div key={video.id} className="flex gap-4 group cursor-pointer">
                                        <div className="w-24 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={video.thumbnail || `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=120&fit=crop`}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xs font-bold text-dark-800 truncate leading-tight mb-1 group-hover:text-primary-600 transition-colors">
                                                {video.title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-[10px] text-dark-500">
                                                <span className="flex items-center gap-1">
                                                    <Youtube className="w-3 h-3" /> {(parseInt(video.views) || 0).toLocaleString()} views
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2 border border-gray-100 rounded-lg text-sm font-semibold text-dark-600 hover:bg-gray-50 transition-colors">
                                View Content Library
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
