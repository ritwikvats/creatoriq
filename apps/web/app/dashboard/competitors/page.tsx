'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { api } from '@/lib/api-client';
import DashboardLayout from '@/components/DashboardLayout';
import CompetitorSearch from '@/components/CompetitorSearch';
import CompetitorComparison from '@/components/CompetitorComparison';
import CompetitorGapAnalysis from '@/components/CompetitorGapAnalysis';
import { Swords, Instagram, Youtube, X, Trash2, User } from 'lucide-react';

export default function CompetitorsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-dark-600">Loading...</p>
                </div>
            </div>
        }>
            <CompetitorsContent />
        </Suspense>
    );
}

function CompetitorsContent() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [competitorProfile, setCompetitorProfile] = useState<any>(null);
    const [currentPlatform, setCurrentPlatform] = useState<string>('');
    const [comparisonData, setComparisonData] = useState<any>(null);
    const [savedCompetitors, setSavedCompetitors] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
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
            setLoading(false);
            fetchSavedCompetitors();
        }
    }, [user]);

    const fetchSavedCompetitors = async () => {
        try {
            const data = await api.get('/competitors/saved');
            if (data.success) {
                setSavedCompetitors(data.competitors || []);
            }
        } catch (err) {
            console.log('Could not fetch saved competitors');
        }
    };

    const handleProfileLoaded = (profile: any, platform: string) => {
        setCompetitorProfile(profile);
        setCurrentPlatform(platform);
        setComparisonData(null);
    };

    const handleComparisonLoaded = (data: any) => {
        setComparisonData(data);
    };

    const handleSaveCompetitor = async () => {
        if (!competitorProfile) return;
        setSaving(true);
        try {
            await api.post('/competitors/saved', {
                platform: currentPlatform,
                username: competitorProfile.username,
                displayName: competitorProfile.displayName,
                followers: competitorProfile.followers,
                profilePicture: competitorProfile.profilePicture,
            });
            await fetchSavedCompetitors();
        } catch (err) {
            console.error('Failed to save competitor');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSaved = async (id: string) => {
        try {
            await api.delete(`/competitors/saved/${id}`);
            setSavedCompetitors(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error('Failed to delete saved competitor');
        }
    };

    const handleClearProfile = () => {
        setCompetitorProfile(null);
        setCurrentPlatform('');
        setComparisonData(null);
    };

    const formatNumber = (num: number): string => {
        if (num === -1) return 'Hidden';
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-8 max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-32 bg-gray-200 rounded-xl"></div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const isAlreadySaved = savedCompetitors.some(
        c => c.username === competitorProfile?.username && c.platform === currentPlatform
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Swords className="w-8 h-8 text-primary-600" />
                        <h1 className="text-3xl md:text-4xl font-bold text-dark-800">Competitor Analysis</h1>
                    </div>
                    <p className="text-dark-500">See how you stack up against other creators</p>
                </div>

                {/* Search */}
                <CompetitorSearch onProfileLoaded={handleProfileLoaded} />

                {/* Competitor Profile Card */}
                {competitorProfile && (
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                {competitorProfile.profilePicture ? (
                                    <img
                                        src={competitorProfile.profilePicture}
                                        alt={competitorProfile.username}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                                        <User className="w-8 h-8 text-primary-600" />
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-dark-800">{competitorProfile.displayName}</h3>
                                        {currentPlatform === 'instagram' ? (
                                            <Instagram className="w-4 h-4 text-purple-500" />
                                        ) : (
                                            <Youtube className="w-4 h-4 text-red-500" />
                                        )}
                                    </div>
                                    <p className="text-sm text-dark-500">@{competitorProfile.username}</p>
                                    {competitorProfile.bio && (
                                        <p className="text-sm text-dark-600 mt-1 line-clamp-2 max-w-md">{competitorProfile.bio}</p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleClearProfile}
                                className="p-2 text-dark-400 hover:text-dark-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-5">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-lg font-bold text-dark-800">{formatNumber(competitorProfile.followers)}</p>
                                <p className="text-xs text-dark-500">Followers</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-lg font-bold text-dark-800">{competitorProfile.postsCount.toLocaleString()}</p>
                                <p className="text-xs text-dark-500">{currentPlatform === 'youtube' ? 'Videos' : 'Posts'}</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-lg font-bold text-dark-800">{competitorProfile.engagementRate}%</p>
                                <p className="text-xs text-dark-500">Engagement</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-lg font-bold text-dark-800">{formatNumber(competitorProfile.avgLikes)}</p>
                                <p className="text-xs text-dark-500">Avg Likes</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-lg font-bold text-dark-800">{competitorProfile.postsPerWeek}</p>
                                <p className="text-xs text-dark-500">Posts/Week</p>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleSaveCompetitor}
                                disabled={saving || isAlreadySaved}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    isAlreadySaved
                                        ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                                        : 'bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100'
                                }`}
                            >
                                {isAlreadySaved ? 'Saved' : saving ? 'Saving...' : 'Save Competitor'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Comparison + Gap Analysis */}
                {competitorProfile && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <CompetitorComparison
                            competitorProfile={competitorProfile}
                            platform={currentPlatform}
                            onComparisonLoaded={handleComparisonLoaded}
                        />
                        <CompetitorGapAnalysis
                            competitorProfile={competitorProfile}
                            platform={currentPlatform}
                            comparisonData={comparisonData}
                        />
                    </div>
                )}

                {/* Saved Competitors */}
                {savedCompetitors.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-dark-800 mb-4">Saved Competitors</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {savedCompetitors.map((comp) => (
                                <div
                                    key={comp.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                                >
                                    {comp.profile_picture ? (
                                        <img
                                            src={comp.profile_picture}
                                            alt={comp.username}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                            <User className="w-5 h-5 text-primary-600" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-dark-800 truncate">@{comp.username}</p>
                                        <div className="flex items-center gap-1.5">
                                            {comp.platform === 'instagram' ? (
                                                <Instagram className="w-3 h-3 text-purple-500" />
                                            ) : (
                                                <Youtube className="w-3 h-3 text-red-500" />
                                            )}
                                            <span className="text-xs text-dark-500">{formatNumber(comp.followers || 0)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteSaved(comp.id);
                                        }}
                                        className="p-1.5 text-dark-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
