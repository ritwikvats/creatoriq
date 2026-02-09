'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { Briefcase, Plus, DollarSign, Calendar, Trash2, Edit2 } from 'lucide-react';

interface Deal {
    id: string;
    brand_name: string;
    status: 'pitching' | 'negotiating' | 'active' | 'completed';
    amount?: number;
    currency: string;
    contact_email?: string;
    notes?: string;
    next_action_date?: string;
    created_at: string;
}

export default function DealsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        brand_name: '',
        amount: '',
        contact_email: '',
        notes: '',
    });
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                setUser(user);
                fetchDeals(user.id);
            }
        };
        getUser();
    }, [router, supabase]);

    const fetchDeals = async (userId: string) => {
        try {
            setLoading(true);
            const api_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${api_url}/deals/${userId}`);
            if (!response.ok) {
                console.error('Deals API error:', response.status);
                setDeals([]);
                return;
            }
            const data = await response.json();
            setDeals(Array.isArray(data) ? data : data?.deals || []);
        } catch (error) {
            console.error('Failed to fetch deals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const api_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${api_url}/deals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    ...formData,
                    amount: formData.amount ? parseFloat(formData.amount) : null,
                }),
            });

            if (response.ok) {
                setShowAddForm(false);
                setFormData({ brand_name: '', amount: '', contact_email: '', notes: '' });
                fetchDeals(user.id);
            }
        } catch (error) {
            console.error('Failed to add deal:', error);
        }
    };

    const handleStatusChange = async (dealId: string, newStatus: Deal['status']) => {
        try {
            const api_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            await fetch(`${api_url}/deals/${dealId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (user) {
                fetchDeals(user.id);
            }
        } catch (error) {
            console.error('Failed to update deal:', error);
        }
    };

    const handleDelete = async (dealId: string) => {
        if (!confirm('Are you sure you want to delete this deal?')) return;

        try {
            const api_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            await fetch(`${api_url}/deals/${dealId}`, {
                method: 'DELETE',
            });

            if (user) {
                fetchDeals(user.id);
            }
        } catch (error) {
            console.error('Failed to delete deal:', error);
        }
    };

    const getStatusColor = (status: Deal['status']) => {
        switch (status) {
            case 'pitching': return 'bg-blue-100 text-blue-800';
            case 'negotiating': return 'bg-yellow-100 text-yellow-800';
            case 'active': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
        }
    };

    const columns = [
        { id: 'pitching', title: '🎯 Pitching', deals: deals.filter(d => d.status === 'pitching') },
        { id: 'negotiating', title: '💬 Negotiating', deals: deals.filter(d => d.status === 'negotiating') },
        { id: 'active', title: '✅ Active', deals: deals.filter(d => d.status === 'active') },
        { id: 'completed', title: '🎉 Completed', deals: deals.filter(d => d.status === 'completed') },
    ];

    const totalValue = deals
        .filter(d => d.status === 'active' || d.status === 'completed')
        .reduce((sum, d) => sum + (d.amount || 0), 0);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-dark-800 flex items-center gap-2">
                            <Briefcase className="w-10 h-10 text-indigo-500" />
                            Brand Deals
                        </h1>
                        <p className="text-dark-600 mt-1">Track your brand partnerships & collaborations</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                    >
                        <Plus className="w-5 h-5" />
                        Add Deal
                    </button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                        <p className="text-sm text-gray-600">Total Deals</p>
                        <p className="text-3xl font-bold text-gray-900">{deals.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                        <p className="text-sm text-gray-600">Pitching</p>
                        <p className="text-3xl font-bold text-blue-600">{columns[0].deals.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                        <p className="text-sm text-gray-600">Active</p>
                        <p className="text-3xl font-bold text-green-600">{columns[2].deals.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                        <p className="text-sm text-gray-600">Total Value</p>
                        <p className="text-3xl font-bold text-indigo-600">₹{totalValue.toLocaleString()}</p>
                    </div>
                </div>

                {/* Add Deal Form */}
                {showAddForm && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-dark-800 mb-4">Add New Deal</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
                                <input
                                    type="text"
                                    value={formData.brand_name}
                                    onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                <input
                                    type="email"
                                    value={formData.contact_email}
                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <input
                                    type="text"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="md:col-span-2 flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                                >
                                    Add Deal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {columns.map((column) => (
                        <div key={column.id} className="bg-gray-50 rounded-xl p-4">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
                                {column.title}
                                <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">{column.deals.length}</span>
                            </h3>
                            <div className="space-y-3">
                                {column.deals.map((deal) => (
                                    <div key={deal.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-900">{deal.brand_name}</h4>
                                            <button
                                                onClick={() => handleDelete(deal.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {deal.amount && (
                                            <p className="text-lg font-bold text-indigo-600 mb-2">
                                                ₹{deal.amount.toLocaleString()}
                                            </p>
                                        )}
                                        {deal.notes && (
                                            <p className="text-sm text-gray-600 mb-2">{deal.notes}</p>
                                        )}
                                        {deal.contact_email && (
                                            <p className="text-xs text-gray-500 mb-2">{deal.contact_email}</p>
                                        )}
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <select
                                                value={deal.status}
                                                onChange={(e) => handleStatusChange(deal.id, e.target.value as Deal['status'])}
                                                className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                            >
                                                <option value="pitching">Pitching</option>
                                                <option value="negotiating">Negotiating</option>
                                                <option value="active">Active</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                                {column.deals.length === 0 && (
                                    <p className="text-center text-gray-400 text-sm py-8">No deals in this stage</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
