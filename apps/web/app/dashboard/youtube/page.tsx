'use client';

import { useEffect, useState } from 'react';

interface YouTubeStats {
    connected: boolean;
    channel?: {
        channelId: string;
        channelName: string;
        subscriberCount: number;
        totalViews: number;
        totalVideos: number;
        publishedAt: string;
        thumbnailUrl: string;
    };
    recentVideos?: any[];
    revenue?: number;
}

export default function YouTubePage() {
    const [stats, setStats] = useState<YouTubeStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchYouTubeStats();
    }, []);

    const fetchYouTubeStats = async () => {
        try {
            setLoading(true);
            // Using test user UUID for now
            const res = await fetch('http://localhost:3001/youtube/stats/00000000-0000-0000-0000-000000000001');
            const data = await res.json();
            setStats(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (error || !stats?.connected) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h2 className="text-red-800 font-semibold">YouTube Not Connected</h2>
                    <p className="text-red-600 mt-2">
                        {error || 'Please connect your YouTube account first.'}
                    </p>
                    <a
                        href="/dashboard"
                        className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Go to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    const { channel, recentVideos = [], revenue = 0 } = stats;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">YouTube Analytics</h1>
                <p className="text-gray-600 mt-2">Real-time performance metrics from your channel</p>
            </div>

            {/* Channel Overview */}
            {channel && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        {channel.thumbnailUrl && (
                            <img
                                src={channel.thumbnailUrl}
                                alt={channel.channelName}
                                className="w-20 h-20 rounded-full"
                            />
                        )}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{channel.channelName}</h2>
                            <p className="text-gray-600">Channel ID: {channel.channelId}</p>
                            <p className="text-sm text-gray-500">
                                Created: {new Date(channel.publishedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-blue-600 font-medium">Subscribers</p>
                            <p className="text-3xl font-bold text-blue-900">
                                {channel.subscriberCount.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-sm text-green-600 font-medium">Total Views</p>
                            <p className="text-3xl font-bold text-green-900">
                                {channel.totalViews.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                            <p className="text-sm text-purple-600 font-medium">Total Videos</p>
                            <p className="text-3xl font-bold text-purple-900">
                                {channel.totalVideos.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-4">
                            <p className="text-sm text-yellow-600 font-medium">Revenue</p>
                            <p className="text-3xl font-bold text-yellow-900">
                                ₹{revenue.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Videos */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Videos</h3>
                {recentVideos.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No videos found</p>
                        <p className="text-sm mt-2">Upload your first video to see it here!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentVideos.map((video: any) => (
                            <div key={video.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                                {video.thumbnailUrl && (
                                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-40 object-cover" />
                                )}
                                <div className="p-4">
                                    <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                                        {video.title}
                                    </h4>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>{video.views?.toLocaleString()} views</span>
                                        <span>{video.likes?.toLocaleString()} likes</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Refresh Button */}
            <div className="mt-6 text-center">
                <button
                    onClick={fetchYouTubeStats}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Refresh Data
                </button>
            </div>
        </div>
    );
}
