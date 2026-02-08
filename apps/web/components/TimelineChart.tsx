'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

interface TimelineChartProps {
    userId: string;
    platform?: 'youtube' | 'instagram' | 'all';
    days?: number;
}

export default function TimelineChart({ userId, platform = 'all', days = 30 }: TimelineChartProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDays, setSelectedDays] = useState(days);

    useEffect(() => {
        fetchTimelineData();
    }, [userId, platform, selectedDays]);

    const fetchTimelineData = async () => {
        try {
            setLoading(true);
            const api_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const platformParam = platform !== 'all' ? `&platform=${platform}` : '';
            const response = await fetch(`${api_url}/analytics/timeline/${userId}?days=${selectedDays}${platformParam}`);
            const result = await response.json();

            if (result.snapshots && result.snapshots.length > 0) {
                // Transform data for Recharts
                const chartData = transformSnapshotsToChartData(result.snapshots);
                setData(chartData);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error('Failed to fetch timeline data:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const transformSnapshotsToChartData = (snapshots: any[]) => {
        // Group by date
        const dataByDate: any = {};

        snapshots.forEach((snapshot) => {
            const date = snapshot.snapshot_date;
            if (!dataByDate[date]) {
                dataByDate[date] = { date };
            }

            if (snapshot.platform === 'youtube') {
                dataByDate[date].youtube_subscribers = snapshot.metrics.subscribers || 0;
                dataByDate[date].youtube_views = snapshot.metrics.total_views || 0;
                dataByDate[date].youtube_engagement = snapshot.metrics.avg_engagement_rate || 0;
            } else if (snapshot.platform === 'instagram') {
                dataByDate[date].instagram_followers = snapshot.metrics.followers || 0;
                dataByDate[date].instagram_engagement = snapshot.metrics.engagement_rate || 0;
            }
        });

        // Convert to array and sort by date
        return Object.values(dataByDate).sort((a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h3 className="text-lg font-bold text-dark-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-500" />
                    Growth Timeline
                </h3>
                <div className="text-center py-12 text-dark-600">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Not enough data yet</p>
                    <p className="text-sm text-dark-500 mt-1">
                        Analytics snapshots are collected daily. Check back tomorrow to see your growth trends!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-dark-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-500" />
                    Growth Timeline
                </h3>
                <select
                    value={selectedDays}
                    onChange={(e) => setSelectedDays(parseInt(e.target.value))}
                    className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value={7}>Last 7 Days</option>
                    <option value={14}>Last 14 Days</option>
                    <option value={30}>Last 30 Days</option>
                    <option value={90}>Last 90 Days</option>
                </select>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px',
                        }}
                        labelFormatter={(label) => `Date: ${formatDate(label)}`}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '12px' }}
                        iconType="line"
                    />

                    {(platform === 'all' || platform === 'youtube') && (
                        <Line
                            type="monotone"
                            dataKey="youtube_subscribers"
                            stroke="#ef4444"
                            strokeWidth={2}
                            name="YouTube Subscribers"
                            dot={{ fill: '#ef4444', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    )}

                    {(platform === 'all' || platform === 'instagram') && (
                        <Line
                            type="monotone"
                            dataKey="instagram_followers"
                            stroke="#a855f7"
                            strokeWidth={2}
                            name="Instagram Followers"
                            dot={{ fill: '#a855f7', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>

            {data.length < 3 && (
                <p className="text-xs text-dark-500 mt-4 text-center">
                    💡 More data points will make this chart more insightful. Snapshots are collected daily at 2 AM.
                </p>
            )}
        </div>
    );
}
