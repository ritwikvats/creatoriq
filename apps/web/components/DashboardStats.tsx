'use client';

import { Users, Eye, DollarSign, BarChart3 } from 'lucide-react';

interface DashboardStatsProps {
    stats: {
        subscribers: number;
        totalViews: number;
        monthlyRevenue: number;
        engagementRate: number;
    };
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
    const statCards: StatCardProps[] = [
        {
            title: 'Total Subscribers / Followers',
            value: stats.subscribers?.toLocaleString() || '0',
            icon: <Users className="w-6 h-6 text-primary-600" />,
        },
        {
            title: 'Total Views',
            value: stats.totalViews?.toLocaleString() || '0',
            icon: <Eye className="w-6 h-6 text-primary-600" />,
        },
        {
            title: 'Monthly Revenue',
            value: `₹${stats.monthlyRevenue?.toLocaleString() || '0'}`,
            icon: <DollarSign className="w-6 h-6 text-primary-600" />,
        },
        {
            title: 'Engagement Rate',
            value: `${stats.engagementRate || '0'}%`,
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
                    </div>
                    <h3 className="text-2xl font-bold text-dark-800 mb-1">{stat.value}</h3>
                    <p className="text-sm text-dark-600">{stat.title}</p>
                </div>
            ))}
        </div>
    );
}
