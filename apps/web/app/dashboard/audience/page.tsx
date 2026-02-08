'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { api } from '@/lib/api-client';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, Clock, MapPin, TrendingUp, Loader2 } from 'lucide-react';

export default function AudiencePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [demographics, setDemographics] = useState<any>(null);
    const [postingTimes, setPostingTimes] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                setUser(user);
                fetchData();
            }
        };
        getUser();
    }, [router, supabase]);

    const fetchData = async () => {
        try {
            const [demoData, timesData] = await Promise.all([
                api.get('/audience/demographics'),
                api.get('/audience/posting-times')
            ]);

            setDemographics(demoData);
            setPostingTimes(timesData);
        } catch (error) {
            console.error('Error fetching audience data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout user={user}>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Audience Insights</h1>
                    <p className="text-gray-600 mt-2">Understand your audience and optimize your posting schedule</p>
                </div>

                {/* Demographics Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-6 h-6" />
                        Audience Demographics
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* YouTube Demographics */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                                YouTube
                            </h3>

                            {demographics?.youtube?.error ? (
                                <p className="text-gray-500 italic">{demographics.youtube.error}</p>
                            ) : demographics?.youtube ? (
                                <div className="space-y-4">
                                    {/* Age & Gender */}
                                    {demographics.youtube.ageGender?.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Age & Gender</h4>
                                            <div className="space-y-2">
                                                {demographics.youtube.ageGender.slice(0, 5).map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">
                                                            {item.gender} • {item.ageGroup}
                                                        </span>
                                                        <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Geography */}
                                    {demographics.youtube.geography?.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                Top Countries
                                            </h4>
                                            <div className="space-y-2">
                                                {demographics.youtube.geography.slice(0, 5).map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">{item.country}</span>
                                                        <span className="text-sm font-medium text-gray-900">{item.views.toLocaleString()} views</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">Connect YouTube to see demographics</p>
                            )}
                        </div>

                        {/* Instagram Demographics */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                                Instagram
                            </h3>

                            {demographics?.instagram?.error ? (
                                <p className="text-gray-500 italic">{demographics.instagram.error}</p>
                            ) : demographics?.instagram ? (
                                <div className="space-y-4">
                                    {/* Age & Gender */}
                                    {demographics.instagram.ageGender?.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Age & Gender</h4>
                                            <div className="space-y-2">
                                                {demographics.instagram.ageGender.slice(0, 5).map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">
                                                            {item.gender} • {item.ageRange}
                                                        </span>
                                                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Top Cities */}
                                    {demographics.instagram.cities?.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                Top Cities
                                            </h4>
                                            <div className="space-y-2">
                                                {demographics.instagram.cities.slice(0, 5).map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600">{item.city}</span>
                                                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">Connect Instagram Business account to see demographics</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Best Posting Times Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-6 h-6" />
                        Best Posting Times
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* YouTube Posting Times */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold text-red-600 mb-4">YouTube</h3>

                            {postingTimes?.youtube?.error ? (
                                <p className="text-gray-500 italic">{postingTimes.youtube.error}</p>
                            ) : postingTimes?.youtube ? (
                                <div className="space-y-4">
                                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                        <TrendingUp className="w-5 h-5 text-red-600 mb-2" />
                                        <p className="text-sm font-medium text-red-900">{postingTimes.youtube.recommendation}</p>
                                        <p className="text-xs text-red-600 mt-1">Based on {postingTimes.youtube.videosAnalyzed} videos</p>
                                    </div>

                                    {postingTimes.youtube.bestDays?.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Best Days</h4>
                                            <div className="space-y-2">
                                                {postingTimes.youtube.bestDays.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                        <span className="text-sm font-medium text-gray-900">{item.day}</span>
                                                        <span className="text-sm text-gray-600">{item.avgViews.toLocaleString()} avg views</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {postingTimes.youtube.bestHours?.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Best Hours</h4>
                                            <div className="space-y-2">
                                                {postingTimes.youtube.bestHours.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                        <span className="text-sm font-medium text-gray-900">{item.hour}</span>
                                                        <span className="text-sm text-gray-600">{item.avgEngagement.toFixed(1)}% engagement</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">Connect YouTube to see posting times</p>
                            )}
                        </div>

                        {/* Instagram Posting Times */}
                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold text-pink-600 mb-4">Instagram</h3>

                            {postingTimes?.instagram?.error ? (
                                <p className="text-gray-500 italic">{postingTimes.instagram.error}</p>
                            ) : postingTimes?.instagram ? (
                                <div className="space-y-4">
                                    <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                                        <TrendingUp className="w-5 h-5 text-pink-600 mb-2" />
                                        <p className="text-sm font-medium text-pink-900">{postingTimes.instagram.recommendation}</p>
                                        <p className="text-xs text-pink-600 mt-1">Based on {postingTimes.instagram.postsAnalyzed} posts</p>
                                    </div>

                                    {postingTimes.instagram.bestDays?.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">Best Days</h4>
                                            <div className="space-y-2">
                                                {postingTimes.instagram.bestDays.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                        <span className="text-sm font-medium text-gray-900">{item.day}</span>
                                                        <span className="text-sm text-gray-600">{item.avgEngagement.toLocaleString()} avg engagement</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {postingTimes.instagram.bestHours?.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2">When Followers Are Online</h4>
                                            <div className="space-y-2">
                                                {postingTimes.instagram.bestHours.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                        <span className="text-sm font-medium text-gray-900">{item.hour}</span>
                                                        <span className="text-sm text-gray-600">{item.activeFollowers} followers online</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">Connect Instagram Business account to see posting times</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
