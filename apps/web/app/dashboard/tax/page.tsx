'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { createClient } from '@/lib/supabase';
import { FileText, Calculator, AlertCircle, CheckCircle, TrendingUp, Download, Loader2, Sparkles } from 'lucide-react';
import { generateTaxPDF } from '@/lib/pdfUtils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function TaxDashboard() {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());
    const supabase = createClient();

    useEffect(() => {
        const fetchTaxSummary = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                try {
                    const res = await fetch(`${API_URL}/tax/${user.id}/summary?year=${year}`);
                    if (!res.ok) {
                        console.error('Tax API error:', res.status);
                        setSummary(null);
                        return;
                    }
                    const data = await res.json();
                    setSummary(data);
                } catch (error) {
                    console.error('Error fetching tax summary:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchTaxSummary();
    }, [year, supabase]);

    const handleGenerateReport = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !summary) return;

        setGenerating(true);
        try {
            // Fetch all revenue entries for the financial year to include in the report
            const { data: revenue, error } = await supabase
                .from('revenue_entries')
                .select('*')
                .eq('user_id', user.id)
                .gte('date', `${year}-04-01`)
                .lte('date', `${year + 1}-03-31`)
                .order('date', { ascending: true });

            if (error) throw error;

            generateTaxPDF(summary, revenue || []);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            alert('Failed to generate report. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-12 flex justify-center">
                    <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    if (!summary) {
        return (
            <DashboardLayout>
                <div className="p-8 text-center">
                    <h1 className="text-3xl font-bold text-dark-800 mb-4">Tax Dashboard</h1>
                    <p className="text-dark-600">No tax data available. Add revenue entries to see your tax analysis.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-dark-800">Tax Dashboard</h1>
                        <p className="text-dark-600">Financial Year {summary?.financialYear || `${year}-${year + 1}`} Analysis (India)</p>
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="bg-white border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value={2026}>FY 2026-27</option>
                            <option value={2025}>FY 2025-26</option>
                            <option value={2024}>FY 2024-25</option>
                        </select>
                        <button
                            onClick={handleGenerateReport}
                            disabled={generating}
                            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 disabled:opacity-50"
                        >
                            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            {generating ? 'Generating...' : 'Generate Report'}
                        </button>
                    </div>
                </div>

                {/* Tax Overview Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <p className="text-dark-500 text-sm font-medium mb-1">Total Gross Income</p>
                        <h3 className="text-2xl font-bold text-dark-800">₹{summary?.totalIncome?.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <p className="text-dark-500 text-sm font-medium mb-1">GST Collected (Payable)</p>
                        <h3 className="text-2xl font-bold text-primary-600">₹{summary?.totalGst?.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <p className="text-dark-500 text-sm font-medium mb-1">TDS Deducted (Claimable)</p>
                        <h3 className="text-2xl font-bold text-red-600">₹{summary?.totalTds?.toLocaleString()}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                        <p className="text-dark-500 text-sm font-medium mb-1">Net Income (Post-TDS)</p>
                        <h3 className="text-2xl font-bold text-green-600">₹{summary?.netIncome?.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* GST Milestone Block */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-dark-800 flex items-center gap-2">
                                        <Calculator className="w-5 h-5 text-primary-600" />
                                        GST Registration Milestone
                                    </h2>
                                    <p className="text-dark-500 text-sm">Mandatory threshold: ₹20,00,000 per annum</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${summary?.gstStatus?.isMandatory ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {summary?.gstStatus?.isMandatory ? 'Mandatory' : 'Optional'}
                                </span>
                            </div>

                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-100">
                                            {summary?.gstStatus?.progress?.toFixed(1)}% Reached
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-primary-600">
                                            Goal: ₹20L
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100">
                                    <div
                                        style={{ width: `${Math.min(summary?.gstStatus?.progress || 0, 100)}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600 transition-all duration-1000"
                                    />
                                </div>
                            </div>
                            <p className="text-sm text-dark-600 italic">
                                {summary?.gstStatus?.isMandatory
                                    ? "⚠️ You have exceeded the threshold. Please ensure your GSTIN is updated in your profile."
                                    : `You have ₹${(2000000 - (summary?.totalIncome || 0)).toLocaleString()} remaining before registration becomes mandatory.`
                                }
                            </p>
                        </div>

                        {/* Quarterly Breakdown Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(summary?.quarters || {}).map(([q, data]: [string, any]) => (
                                <div key={q} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <h4 className="text-lg font-bold text-dark-800 mb-4">{q} Summary</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-dark-500">Revenue:</span>
                                            <span className="font-semibold">₹{(data?.total || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-dark-500">GST:</span>
                                            <span className="text-primary-600 font-semibold">₹{(data?.gst || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-dark-500">TDS:</span>
                                            <span className="text-red-600 font-semibold">₹{(data?.tds || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Advisor Block */}
                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-dark-900 to-dark-800 p-8 rounded-2xl shadow-xl text-white">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary-400" />
                                AI Tax Advisor
                            </h2>
                            <div className="space-y-6">
                                {(summary?.taxSavingTips || []).map((tip: string, i: number) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 bg-primary-600/30 rounded-full flex items-center justify-center text-primary-400 font-bold">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed">{tip}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all border border-white/20">
                                Detailed AI Tax Plan
                            </button>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                            <h4 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Disclaimer
                            </h4>
                            <p className="text-xs text-blue-700 leading-relaxed">
                                CreatorIQ calculations are for estimation purposes only. Please consult a qualified Chartered Accountant (CA) for official Indian Income Tax filings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
