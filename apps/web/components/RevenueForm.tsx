'use client';

import { useState } from 'react';
import { IndianRupee, Calendar, Tag, FileText, CheckCircle2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface RevenueFormProps {
    userId: string | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function RevenueForm({ userId, onSuccess, onCancel }: RevenueFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        source: 'brand_deal',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        platform: 'youtube',
        gst_applicable: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/revenue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    user_id: userId,
                    amount: parseFloat(formData.amount),
                }),
            });

            if (response.ok) {
                onSuccess();
            } else {
                console.error('Failed to save revenue');
            }
        } catch (error) {
            console.error('Error saving revenue:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-100 rounded-lg">
                    <IndianRupee className="w-6 h-6 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-dark-800">Add Revenue Entry</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Source Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-dark-700 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Source
                    </label>
                    <select
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        required
                    >
                        <option value="brand_deal">Brand Deal</option>
                        <option value="adsense">YouTube AdSense</option>
                        <option value="subscription">Subscriptions / Memberships</option>
                        <option value="merchandise">Merchandise</option>
                        <option value="affiliate">Affiliate Commission</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-dark-700 flex items-center gap-2">
                        <IndianRupee className="w-4 h-4" />
                        Amount (₹)
                    </label>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        required
                    />
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-dark-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date Recieved
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        required
                    />
                </div>

                {/* Platform Selection */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-dark-700">Platform</label>
                    <div className="flex gap-4">
                        <label className={`flex-1 flex items-center justify-center p-2 rounded-lg border cursor-pointer transition-all ${formData.platform === 'youtube' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-gray-50 border-gray-200'}`}>
                            <input
                                type="radio"
                                name="platform"
                                value="youtube"
                                className="hidden"
                                checked={formData.platform === 'youtube'}
                                onChange={() => setFormData({ ...formData, platform: 'youtube' })}
                            />
                            YouTube
                        </label>
                        <label className={`flex-1 flex items-center justify-center p-2 rounded-lg border cursor-pointer transition-all ${formData.platform === 'instagram' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-gray-50 border-gray-200'}`}>
                            <input
                                type="radio"
                                name="platform"
                                value="instagram"
                                className="hidden"
                                checked={formData.platform === 'instagram'}
                                onChange={() => setFormData({ ...formData, platform: 'instagram' })}
                            />
                            Instagram
                        </label>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-dark-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description (Brand Name, Campaign, etc.)
                </label>
                <textarea
                    rows={3}
                    placeholder="Describe this income source..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                />
            </div>

            {/* Tax Info (Simplified) */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.gst_applicable}
                        onChange={(e) => setFormData({ ...formData, gst_applicable: e.target.checked })}
                        className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                        <span className="text-sm font-bold text-blue-900">GST Invoice</span>
                        <p className="text-xs text-blue-700">Check if you provided a GST invoice for this payment.</p>
                    </div>
                </label>
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Save Revenue
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
