'use client';

import { TrendingUp, TrendingDown, Users, Eye, DollarSign, BarChart3 } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    trend?: 'up' | 'down';
}

export default function DashboardStats({ stats }: { stats: any }) {
    const statCards: StatCardProps[] = [
        {
            title: 'Total Subscribers',
            value: stats.subscribers?.toLocaleString() || '0',
            change: 4.2,
            trend: 'up',
            icon: <Users className="w-6 h-6 text-primary-600" />,
        },
        {
            title: 'Total Views',
            value: stats.totalViews?.toLocaleString() || '0',
            change: 8.5,
            trend: 'up',
            icon: <Eye className="w-6 h-6 text-primary-600" />,
        },
        {
            title: 'Monthly Revenue',
            value: `₹${stats.monthlyRevenue?.toLocaleString() || '0'}`,
            change: 6.3,
            trend: 'up',
            icon: <DollarSign className="w-6 h-6 text-primary-600" />,
        },
        {
            title: 'Engagement Rate',
            value: `${stats.engagementRate || '0'}%`,
            change: -0.5,
            trend: 'down',
            icon: <BarChart3 className="w-6 h-6 text-primary-600" />,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-primary-50 rounded-lg">{stat.icon}</div>
                        {stat.change !== undefined && (
                            <div
                                className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {stat.trend === 'up' ? (
                                    <TrendingUp className="w-4 h-4" />
                                ) : (
                                    <TrendingDown className="w-4 h-4" />
                                )}
                                {Math.abs(stat.change)}%
                            </div>
                        )}
                    </div>
                    <h3 className="text-2xl font-bold text-dark-800 mb-1">{stat.value}</h3>
                    <p className="text-sm text-dark-600">{stat.title}</p>
                </div>
            ))}
        </div>
    );
}
