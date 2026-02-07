'use client';

import { Tag, Calendar, IndianRupee, Trash2 } from 'lucide-react';

interface RevenueTableProps {
    revenue: any[];
    loading: boolean;
}

export default function RevenueTable({ revenue, loading }: RevenueTableProps) {
    if (loading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                <p className="text-dark-500 font-medium tracking-wide">Fetching your earnings...</p>
            </div>
        );
    }

    if (revenue.length === 0) {
        return (
            <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IndianRupee className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-dark-800">No revenue entries yet</h3>
                <p className="text-dark-500 max-w-xs mx-auto mt-2">
                    Click the "Add Revenue" button to start tracking your income and taxes.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-dark-600 text-xs uppercase tracking-wider font-bold">
                        <th className="px-6 py-4 border-b border-gray-100">Date</th>
                        <th className="px-6 py-4 border-b border-gray-100">Source</th>
                        <th className="px-6 py-4 border-b border-gray-100">Amount</th>
                        <th className="px-6 py-4 border-b border-gray-100">Tax Info</th>
                        <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {revenue.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-dark-800 font-medium">
                                    <Calendar className="w-4 h-4 text-dark-400" />
                                    {new Date(item.date).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-dark-800 font-semibold flex items-center gap-2 capitalize">
                                        <Tag className="w-3.5 h-3.5 text-primary-500" />
                                        {item.source.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs text-dark-500 mt-1 truncate max-w-[200px]">
                                        {item.description}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-dark-800 font-bold text-lg">
                                    ₹{parseFloat(item.amount).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-primary-600 font-bold uppercase tracking-tight px-1.5 py-0.5 bg-primary-50 border border-primary-100 rounded w-fit">
                                    {item.platform}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-xs w-32">
                                        <span className="text-dark-500">GST:</span>
                                        <span className={item.gst_applicable ? "text-green-600 font-bold" : "text-gray-400"}>
                                            {item.gst_applicable ? `₹${parseFloat(item.gst_amount || 0).toLocaleString()}` : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs w-32">
                                        <span className="text-dark-500">TDS:</span>
                                        <span className="text-red-500 font-bold">
                                            ₹{parseFloat(item.tds_deducted || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
