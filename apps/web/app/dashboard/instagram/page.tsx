'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { Instagram, TrendingUp, Heart, MessageCircle, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api-client';

export default function InstagramAnalyticsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                setUser(user);
                fetchInstagramAnalytics(user.id);
            }
        };
        getUser();
    }, [router, supabase]);

    const fetchInstagramAnalytics = async (userId: string) => {
        try {
            setLoading(true);
            const data = await api.get('/instagram/analytics');

            if (data.account) {
                setAnalytics(data);
            } else if (data.error) {
                console.error('Instagram API error:', data.error);
                setAnalytics(null);
            } else {
                setAnalytics(null);
            }
        } catch (error) {
            console.error('Failed to fetch Instagram analytics:', error);
            setAnalytics(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-dark-600">Loading Instagram analytics...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!analytics) {
        return (
            <DashboardLayout>
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                    <button
                        onClick={() => router.push('/dashboard/analytics')}
                        className="flex items-center gap-2 text-dark-600 hover:text-dark-800 mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
                        <Instagram className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-dark-800 mb-2">No Instagram Data</h2>
                        <p className="text-dark-600 mb-6">Connect your Instagram account to view detailed analytics.</p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600"
                        >
                            Connect Instagram
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const { account, recentMedia, topPosts, stats = {} } = analytics || {};

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard/analytics')}
                            className="flex items-center gap-2 text-dark-600 hover:text-dark-800"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-dark-800 flex items-center gap-3">
                                <Instagram className="w-10 h-10 text-purple-500" />
                                Instagram Analytics
                            </h1>
                            <p className="text-dark-600 mt-1">@{account.username}</p>
                        </div>
                    </div>
                </div>

                {/* Profile Summary */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-8 text-white">
                    <div className="flex items-center gap-6 mb-6">
                        {account.profile_picture_url && (
                            <img
                                src={account.profile_picture_url}
                                alt={account.username}
                                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                            />
                        )}
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">@{account.username}</h2>
                            {account.biography && (
                                <p className="text-purple-100 whitespace-pre-line">{account.biography}</p>
                            )}
                            {account.website && (
                                <a
                                    href={account.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-100 hover:text-white underline mt-2 inline-block"
                                >
                                    {account.website}
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <p className="text-purple-100 text-sm">Followers</p>
                            <p className="text-3xl font-bold">{account.followers_count?.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <p className="text-purple-100 text-sm">Following</p>
                            <p className="text-3xl font-bold">{account.follows_count?.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <p className="text-purple-100 text-sm">Posts</p>
                            <p className="text-3xl font-bold">{account.media_count?.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <p className="text-purple-100 text-sm">Engagement Rate</p>
                            <p className="text-3xl font-bold">{account.engagement_rate?.toFixed(2)}%</p>
                        </div>
                    </div>
                </div>

                {/* Engagement Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            <p className="text-sm text-dark-600 font-medium">Average Likes</p>
                        </div>
                        <p className="text-3xl font-bold text-dark-800">{Math.round(account.avg_likes || 0)}</p>
                        <p className="text-xs text-dark-500 mt-1">per post</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <MessageCircle className="w-5 h-5 text-blue-500" />
                            <p className="text-sm text-dark-600 font-medium">Average Comments</p>
                        </div>
                        <p className="text-3xl font-bold text-dark-800">{Math.round(account.avg_comments || 0)}</p>
                        <p className="text-xs text-dark-500 mt-1">per post</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <p className="text-sm text-dark-600 font-medium">Total Engagement</p>
                        </div>
                        <p className="text-3xl font-bold text-dark-800">{(stats?.total_engagement || 0).toLocaleString()}</p>
                        <p className="text-xs text-dark-500 mt-1">likes + comments</p>
                    </div>
                </div>

                {/* Top Performing Posts */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
                    <h2 className="text-xl font-bold text-dark-800 mb-6">🔥 Top Performing Posts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topPosts?.slice(0, 6).map((post: any) => (
                            <a
                                key={post.id}
                                href={post.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                                    <img
                                        src={post.thumbnail_url || post.media_url}
                                        alt={post.caption || 'Instagram post'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="text-white text-center">
                                            <p className="text-sm font-medium">View on Instagram</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3 text-dark-600">
                                        <span className="flex items-center gap-1">
                                            <Heart className="w-4 h-4 text-red-500" />
                                            {post.like_count?.toLocaleString() || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="w-4 h-4 text-blue-500" />
                                            {post.comments_count?.toLocaleString() || 0}
                                        </span>
                                    </div>
                                    <span className="text-xs text-dark-500">{post.media_product_type}</span>
                                </div>
                                {post.caption && (
                                    <p className="text-xs text-dark-600 mt-2 line-clamp-2">{post.caption}</p>
                                )}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
                    <h2 className="text-xl font-bold text-dark-800 mb-6">📸 Recent Posts</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {recentMedia?.map((post: any) => (
                            <a
                                key={post.id}
                                href={post.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={post.thumbnail_url || post.media_url}
                                        alt={post.caption || 'Instagram post'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                    {post.media_type === 'VIDEO' && (
                                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            VIDEO
                                        </div>
                                    )}
                                    {post.media_type === 'CAROUSEL_ALBUM' && (
                                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            ALBUM
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="text-white text-center space-y-1">
                                            <p className="flex items-center justify-center gap-2">
                                                <Heart className="w-4 h-4" />
                                                {post.like_count?.toLocaleString() || 0}
                                            </p>
                                            <p className="flex items-center justify-center gap-2">
                                                <MessageCircle className="w-4 h-4" />
                                                {post.comments_count?.toLocaleString() || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Refresh Button */}
                <div className="text-center">
                    <button
                        onClick={() => fetchInstagramAnalytics(user.id)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600"
                    >
                        Refresh Analytics
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
