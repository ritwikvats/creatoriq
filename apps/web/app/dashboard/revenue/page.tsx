'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import RevenueForm from '@/components/RevenueForm';
import RevenueTable from '@/components/RevenueTable';
import { DollarSign, TrendingUp, Download, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { downloadAsCSV } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function RevenuePage() {
    const [revenue, setRevenue] = useState([]);
    const [summary, setSummary] = useState({ total: 0, bySource: {}, count: 0 });
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                fetchData(user.id);
            }
        };
        fetchUser();
    }, []);

    const fetchData = async (uid: string) => {
        setLoading(true);
        try {
            const [revRes, sumRes] = await Promise.all([
                fetch(`${API_URL}/revenue/${uid}`),
                fetch(`${API_URL}/revenue/${uid}/summary`)
            ]);

            if (!revRes.ok || !sumRes.ok) {
                console.error('API returned error:', revRes.status, sumRes.status);
                setRevenue([]);
                setSummary({ total: 0, bySource: {}, count: 0 });
                return;
            }

            const revData = await revRes.json();
            const sumData = await sumRes.json();

            setRevenue(revData.revenue || []);
            setSummary({
                total: sumData.total || 0,
                bySource: sumData.bySource || {},
                count: sumData.count || 0,
            });
        } catch (error) {
            console.error('Error fetching revenue data:', error);
            setSummary({ total: 0, bySource: {}, count: 0 });
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        setIsFormOpen(false);
        if (userId) fetchData(userId);
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/revenue/${id}`, { method: 'DELETE' });
            if (res.ok && userId) {
                fetchData(userId);
            }
        } catch (error) {
            console.error('Error deleting revenue:', error);
        }
    };

    const handleExport = () => {
        if (revenue.length > 0) {
            downloadAsCSV(revenue, `revenue_report_${new Date().toISOString().split('T')[0]}.csv`);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-dark-800">Revenue Tracking</h1>
                        <p className="text-dark-600">Monitor your earnings and tax liabilities</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Revenue
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="text-dark-600 text-sm font-medium">Total Revenue</span>
                        </div>
                        <h2 className="text-3xl font-bold text-dark-800">
                            ₹{(summary?.total || 0).toLocaleString()}
                        </h2>
                        <div className="mt-2 flex items-center gap-1 text-green-600 text-sm font-semibold">
                            <TrendingUp className="w-4 h-4" />
                            <span>8.5% from last month</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-dark-600 text-sm font-medium">Avg. Per Month</span>
                        </div>
                        <h2 className="text-3xl font-bold text-dark-800">
                            ₹{((summary?.total || 0) / (summary?.count || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </h2>
                        <p className="mt-1 text-xs text-dark-500">Based on {summary?.count || 0} entries</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <div className="w-6 h-6 border-2 border-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">%</div>
                            </div>
                            <span className="text-dark-600 text-sm font-medium">Estimated Taxes</span>
                        </div>
                        <h2 className="text-3xl font-bold text-dark-800">
                            ₹{((summary?.total || 0) * 0.18).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </h2>
                        <p className="mt-1 text-xs text-dark-500">Projected GST (18%)</p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-dark-800">Recent Entries</h2>
                            </div>
                            <div className="p-0">
                                <RevenueTable revenue={revenue} loading={loading} onDelete={handleDelete} />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        {/* Revenue by Source Chart Placeholder */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold text-dark-800 mb-6">Revenue Sources</h2>
                            <div className="space-y-4">
                                {Object.entries(summary?.bySource || {}).map(([source, amount]: [string, any]) => (
                                    <div key={source} className="space-y-1">
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="capitalize">{source.replace('_', ' ')}</span>
                                            <span className="text-dark-800 font-bold">
                                                {((amount / (summary.total || 1)) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full"
                                                style={{ width: `${(amount / (summary.total || 1)) * 100}%` }}
                                            />
                                        </div>
                                        <div className="text-right text-xs text-dark-500">₹{(amount || 0).toLocaleString()}</div>
                                    </div>
                                ))}
                                {Object.keys(summary?.bySource || {}).length === 0 && (
                                    <p className="text-dark-500 text-center py-8">No data available yet</p>
                                )}
                            </div>
                        </div>

                        {/* AI Tip Card */}
                        <div className="bg-gradient-to-br from-primary-600 to-primary-500 p-6 rounded-xl shadow-lg text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold">AI Insight</h3>
                            </div>
                            <p className="text-primary-50 text-sm leading-relaxed mb-4">
                                Your YouTube revenue is up 12% this month. Based on current growth, you might hit the GST threshold (₹20L) by Q3.
                            </p>
                            <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors">
                                View Detailed Forecast
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Entry Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl relative">
                        <button
                            onClick={() => setIsFormOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <RevenueForm userId={userId} onSuccess={handleSuccess} onCancel={() => setIsFormOpen(false)} />
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
