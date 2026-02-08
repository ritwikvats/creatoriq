'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { Library, Search, Filter, Youtube, Instagram, TrendingUp, Heart, MessageCircle, Eye, Calendar } from 'lucide-react';

interface ContentItem {
    id: string;
    platform: 'youtube' | 'instagram';
    title?: string;
    caption?: string;
    thumbnail?: string;
    url: string;
    views?: number;
    likes?: number;
    comments?: number;
    engagement?: number;
    publishedAt: string;
    type: string;
}

export default function ContentLibraryPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<ContentItem[]>([]);
    const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [platformFilter, setPlatformFilter] = useState<'all' | 'youtube' | 'instagram'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'views' | 'engagement'>('date');
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                setUser(user);
                fetchAllContent(user.id);
            }
        };
        getUser();
    }, [router, supabase]);

    const fetchAllContent = async (userId: string) => {
        try {
            setLoading(true);
            const api_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            // Fetch YouTube videos
            const ytResponse = await fetch(`${api_url}/youtube/stats/${userId}`);
            const ytData = await ytResponse.json();

            // Fetch Instagram posts
            const igResponse = await fetch(`${api_url}/instagram/analytics/${userId}`);
            const igData = await igResponse.json();

            const allContent: ContentItem[] = [];

            // Add YouTube videos
            if (ytData.recentVideos) {
                ytData.recentVideos.forEach((video: any) => {
                    allContent.push({
                        id: video.id,
                        platform: 'youtube',
                        title: video.title,
                        thumbnail: video.thumbnail,
                        url: `https://youtube.com/watch?v=${video.id}`,
                        views: parseInt(video.viewCount || '0'),
                        likes: parseInt(video.likeCount || '0'),
                        comments: parseInt(video.commentCount || '0'),
                        engagement: ((parseInt(video.likeCount || '0') + parseInt(video.commentCount || '0')) / Math.max(parseInt(video.viewCount || '0'), 1)) * 100,
                        publishedAt: video.publishedAt,
                        type: 'VIDEO',
                    });
                });
            }

            // Add Instagram posts
            if (igData.recentMedia) {
                igData.recentMedia.forEach((post: any) => {
                    allContent.push({
                        id: post.id,
                        platform: 'instagram',
                        caption: post.caption,
                        thumbnail: post.thumbnail_url || post.media_url,
                        url: post.permalink,
                        likes: post.like_count || 0,
                        comments: post.comments_count || 0,
                        engagement: ((post.like_count || 0) + (post.comments_count || 0)),
                        publishedAt: post.timestamp,
                        type: post.media_type,
                    });
                });
            }

            setContent(allContent);
            setFilteredContent(allContent);
        } catch (error) {
            console.error('Failed to fetch content:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort content
    useEffect(() => {
        let filtered = [...content];

        // Platform filter
        if (platformFilter !== 'all') {
            filtered = filtered.filter(item => item.platform === platformFilter);
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(item =>
                (item.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.caption?.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
                case 'views':
                    return (b.views || 0) - (a.views || 0);
                case 'engagement':
                    return (b.engagement || 0) - (a.engagement || 0);
                default:
                    return 0;
            }
        });

        setFilteredContent(filtered);
    }, [content, platformFilter, searchQuery, sortBy]);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    const stats = {
        total: content.length,
        youtube: content.filter(c => c.platform === 'youtube').length,
        instagram: content.filter(c => c.platform === 'instagram').length,
        totalViews: content.reduce((sum, c) => sum + (c.views || 0), 0),
        totalLikes: content.reduce((sum, c) => sum + (c.likes || 0), 0),
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-dark-800 flex items-center gap-2">
                        <Library className="w-10 h-10 text-purple-500" />
                        Content Library
                    </h1>
                    <p className="text-dark-600 mt-1">All your posts and videos in one place</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                        <p className="text-sm text-gray-600">Total Content</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                        <p className="text-sm text-gray-600">YouTube</p>
                        <p className="text-3xl font-bold text-red-600">{stats.youtube}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                        <p className="text-sm text-gray-600">Instagram</p>
                        <p className="text-3xl font-bold text-purple-600">{stats.instagram}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                        <p className="text-sm text-gray-600">Total Views</p>
                        <p className="text-3xl font-bold text-blue-600">{formatNumber(stats.totalViews)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                        <p className="text-sm text-gray-600">Total Likes</p>
                        <p className="text-3xl font-bold text-pink-600">{formatNumber(stats.totalLikes)}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search content..."
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>

                        {/* Platform Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={platformFilter}
                                onChange={(e) => setPlatformFilter(e.target.value as any)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
                            >
                                <option value="all">All Platforms</option>
                                <option value="youtube">YouTube Only</option>
                                <option value="instagram">Instagram Only</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                            <option value="date">Sort by Date</option>
                            <option value="views">Sort by Views</option>
                            <option value="engagement">Sort by Engagement</option>
                        </select>
                    </div>
                </div>

                {/* Content Grid */}
                {filteredContent.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center text-gray-500">
                        <Library className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="font-medium">No content found</p>
                        <p className="text-sm mt-1">
                            {searchQuery || platformFilter !== 'all'
                                ? 'Try adjusting your filters'
                                : 'Connect your platforms to see your content'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredContent.map((item) => (
                            <a
                                key={item.id}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-gray-200 overflow-hidden">
                                    {item.thumbnail && (
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title || item.caption}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    )}
                                    <div className="absolute top-2 left-2 flex gap-2">
                                        {item.platform === 'youtube' ? (
                                            <span className="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded flex items-center gap-1">
                                                <Youtube className="w-3 h-3" />
                                                YouTube
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded flex items-center gap-1">
                                                <Instagram className="w-3 h-3" />
                                                Instagram
                                            </span>
                                        )}
                                        <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
                                            {item.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                                        {item.title || item.caption || 'Untitled'}
                                    </h3>

                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(item.publishedAt)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm">
                                        {item.views !== undefined && (
                                            <span className="flex items-center gap-1 text-gray-700">
                                                <Eye className="w-4 h-4 text-blue-500" />
                                                {formatNumber(item.views)}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 text-gray-700">
                                            <Heart className="w-4 h-4 text-red-500" />
                                            {formatNumber(item.likes || 0)}
                                        </span>
                                        <span className="flex items-center gap-1 text-gray-700">
                                            <MessageCircle className="w-4 h-4 text-green-500" />
                                            {formatNumber(item.comments || 0)}
                                        </span>
                                    </div>

                                    {item.engagement !== undefined && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-600">Engagement</span>
                                                <span className="text-sm font-semibold text-purple-600 flex items-center gap-1">
                                                    <TrendingUp className="w-3 h-3" />
                                                    {item.engagement.toFixed(2)}%
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
