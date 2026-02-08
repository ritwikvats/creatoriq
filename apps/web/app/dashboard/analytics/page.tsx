'use client';

import { useEffect, useState } from 'react';
import GrowthStats from '@/components/GrowthStats';
import { Download } from 'lucide-react';
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
    };
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<PlatformStats>({
        youtube: { connected: false },
        instagram: { connected: false },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllStats();
    }, []);

    const fetchAllStats = async () => {
        try {
            setLoading(true);
            const userId = '00000000-0000-0000-0000-000000000001'; // Test user

            // Fetch YouTube stats
            const ytRes = await fetch(`http://localhost:3001/youtube/stats/${userId}`);
            const ytData = await ytRes.json();

            // Fetch Instagram status
            const igRes = await fetch(`http://localhost:3001/instagram/status/${userId}`);
            const igData = await igRes.json();

            setStats({
                youtube: {
                    connected: ytData.connected,
                    subscribers: ytData.channel?.subscriberCount || 0,
                    views: ytData.channel?.totalViews || 0,
                    videos: ytData.channel?.totalVideos || 0,
                    channelName: ytData.channel?.channelName,
                },
                instagram: {
                    connected: igData.connected,
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

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    const totalFollowers = (stats.youtube.subscribers || 0) + (stats.instagram.followers || 0);
    const connectedCount = (stats.youtube.connected ? 1 : 0) + (stats.instagram.connected ? 1 : 0);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Analytics Overview</h1>
                <p className="text-gray-600 mt-2">Cross-platform performance metrics</p>
            </div>

            {/* Connection Status */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 mb-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Connected Platforms</h2>
                <p className="text-blue-100">
                    {connectedCount} of 2 platforms connected
                </p>
                <div className="mt-4 flex gap-4">
                    <div className={`px-4 py-2 rounded ${stats.youtube.connected ? 'bg-green-500' : 'bg-red-500'}`}>
                        YouTube: {stats.youtube.connected ? 'Connected' : 'Not Connected'}
                    </div>
                    <div className={`px-4 py-2 rounded ${stats.instagram.connected ? 'bg-green-500' : 'bg-red-500'}`}>
                        Instagram: {stats.instagram.connected ? 'Connected' : 'Not Connected'}
                    </div>
                </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-sm text-gray-600 font-medium">Total Followers</p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">
                        {totalFollowers.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Across all platforms</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-sm text-gray-600 font-medium">YouTube Views</p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">
                        {(stats.youtube.views || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Total video views</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-sm text-gray-600 font-medium">Content Created</p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">
                        {((stats.youtube.videos || 0) + (stats.instagram.posts || 0)).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Videos + Posts</p>
                </div>
            </div>

            {/* Platform Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* YouTube Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">YouTube</h3>
                        {stats.youtube.connected ? (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Connected</span>
                        ) : (
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">Not Connected</span>
                        )}
                    </div>
                    {stats.youtube.connected ? (
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Channel</p>
                                <p className="text-lg font-semibold text-gray-900">{stats.youtube.channelName || 'N/A'}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs text-gray-600">Subscribers</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.youtube.subscribers?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Views</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.youtube.views?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Videos</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.youtube.videos?.toLocaleString()}</p>
                                </div>
                            </div>
                            <a
                                href="/dashboard/youtube"
                                className="block text-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
                            >
                                View Detailed Analytics
                            </a>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">Connect your YouTube account to see analytics</p>
                            <a href="/dashboard" className="text-red-600 hover:underline">Connect YouTube</a>
                        </div>
                    )}
                </div>

                {/* Instagram Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Instagram</h3>
                        {stats.instagram.connected ? (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Connected</span>
                        ) : (
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">Not Connected</span>
                        )}
                    </div>
                    {stats.instagram.connected ? (
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Username</p>
                                <p className="text-lg font-semibold text-gray-900">@{stats.instagram.username || 'N/A'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-600">Followers</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.instagram.followers?.toLocaleString() || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Posts</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.instagram.posts?.toLocaleString() || 'N/A'}</p>
                                </div>
                            </div>
                            <a
                                href="/dashboard/instagram"
                                className="block text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-pink-700 mt-4"
                            >
                                View Detailed Analytics
                            </a>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">Connect your Instagram account to see analytics</p>
                            <a href="/dashboard" className="text-purple-600 hover:underline">Connect Instagram</a>
                        </div>
                    )}
                </div>
            </div>

            {/* Growth Statistics */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Growth Trends</h2>
                <GrowthStats userId="00000000-0000-0000-0000-000000000001" />
            </div>

            {/* Export Section */}
            <div className="mt-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Download className="w-6 h-6" />
                        Export Analytics
                    </h2>
                    <p className="text-gray-600 text-sm mb-4">Download your analytics data in various formats</p>
                    <div className="flex gap-3">
                        <button
                            onClick={async () => {
                                const response = await fetch(`http://localhost:3001/analytics/timeline/00000000-0000-0000-0000-000000000001?days=30`);
                                const data = await response.json();
                                const formatted = formatDataForExport('analytics', data.snapshots);
                                exportAsCSV({ type: 'analytics', data: formatted, filename: 'analytics' });
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                        >
                            Export as CSV
                        </button>
                        <button
                            onClick={async () => {
                                const response = await fetch(`http://localhost:3001/analytics/timeline/00000000-0000-0000-0000-000000000001?days=30`);
                                const data = await response.json();
                                const formatted = formatDataForExport('analytics', data.snapshots);
                                exportAsPDF({ type: 'analytics', data: formatted, filename: 'analytics' });
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                        >
                            Export as PDF
                        </button>
                        <button
                            onClick={async () => {
                                const response = await fetch(`http://localhost:3001/analytics/timeline/00000000-0000-0000-0000-000000000001?days=30`);
                                const data = await response.json();
                                const formatted = formatDataForExport('analytics', data.snapshots);
                                exportAsJSON({ type: 'analytics', data: formatted, filename: 'analytics' });
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Export as JSON
                        </button>
                    </div>
                </div>
            </div>

            {/* Refresh Button */}
            <div className="mt-8 text-center">
                <button
                    onClick={fetchAllStats}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                    Refresh All Data
                </button>
            </div>
        </div>
    );
}
