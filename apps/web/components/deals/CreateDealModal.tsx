'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { DealStatus } from '@/types/deal';

interface CreateDealModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void;
    userId: string;
}

export default function CreateDealModal({ isOpen, onClose, onCreated, userId }: CreateDealModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        brand_name: '',
        amount: '',
        currency: 'INR',
        status: 'pitching' as DealStatus,
        notes: '',
        contact_email: ''
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/deals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    brand_name: formData.brand_name,
                    amount: formData.amount ? parseFloat(formData.amount) : null,
                    currency: formData.currency,
                    status: formData.status,
                    notes: formData.notes,
                    contact_email: formData.contact_email
                })
            });

            if (response.ok) {
                onCreated();
                onClose();
            } else {
                const errorData = await response.json();
                console.error('Failed to create deal:', errorData);
                alert(`Failed to create deal: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error creating deal:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-lg text-gray-800">New Brand Deal</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Nike"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={formData.brand_name}
                            onChange={e => setFormData({ ...formData, brand_name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={formData.currency}
                                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value as DealStatus })}
                        >
                            <option value="pitching">Pitching</option>
                            <option value="negotiating">Negotiating</option>
                            <option value="contract_sent">Contract Sent</option>
                            <option value="closed_won">Closed Won</option>
                            <option value="closed_lost">Closed Lost</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                        <input
                            type="email"
                            placeholder="contact@brand.com"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={formData.contact_email}
                            onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            placeholder="Any details about the deal..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Create Deal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
