'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Calculator, TrendingDown, AlertCircle, CheckCircle, IndianRupee } from 'lucide-react';

export default function TaxCalculatorPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        grossIncome: '',
        section80C: '',
        section80D: '',
        businessExpenses: '',
        equipmentPurchase: '',
        tdsDeducted: '',
        hasGSTRegistration: false,
    });
    const [result, setResult] = useState<any>(null);

    const handleCalculate = async () => {
        try {
            setLoading(true);
            const api_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            const response = await fetch(`${api_url}/tax/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    grossIncome: parseFloat(formData.grossIncome) || 0,
                    deductions: {
                        section80C: parseFloat(formData.section80C) || 0,
                        section80D: parseFloat(formData.section80D) || 0,
                        businessExpenses: parseFloat(formData.businessExpenses) || 0,
                        equipmentPurchase: parseFloat(formData.equipmentPurchase) || 0,
                    },
                    tdsDeducted: parseFloat(formData.tdsDeducted) || 0,
                    hasGSTRegistration: formData.hasGSTRegistration,
                }),
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Tax calculation failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return '₹' + amount.toLocaleString('en-IN');
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-dark-800 flex items-center gap-2">
                        <Calculator className="w-10 h-10 text-blue-500" />
                        Tax Calculator
                    </h1>
                    <p className="text-dark-600 mt-1">Calculate your income tax & GST liability for FY 2025-26</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-6">
                        <h2 className="text-xl font-bold text-dark-800 mb-4">Enter Your Details</h2>

                        {/* Gross Income */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gross Income (Annual)
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    value={formData.grossIncome}
                                    onChange={(e) => setFormData({ ...formData, grossIncome: e.target.value })}
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="1000000"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Total income from all sources (brand deals, AdSense, etc.)</p>
                        </div>

                        {/* Deductions */}
                        <div className="space-y-4 pt-4 border-t border-gray-200">
                            <h3 className="font-semibold text-gray-800">Deductions</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section 80C (Investments)
                                </label>
                                <input
                                    type="number"
                                    value={formData.section80C}
                                    onChange={(e) => setFormData({ ...formData, section80C: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="150000"
                                />
                                <p className="text-xs text-gray-500 mt-1">PPF, ELSS, NPS, Life Insurance (max ₹1.5L)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section 80D (Health Insurance)
                                </label>
                                <input
                                    type="number"
                                    value={formData.section80D}
                                    onChange={(e) => setFormData({ ...formData, section80D: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="25000"
                                />
                                <p className="text-xs text-gray-500 mt-1">Health insurance premiums (max ₹25k)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Expenses
                                </label>
                                <input
                                    type="number"
                                    value={formData.businessExpenses}
                                    onChange={(e) => setFormData({ ...formData, businessExpenses: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="300000"
                                />
                                <p className="text-xs text-gray-500 mt-1">Office rent, salaries, travel, etc.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Equipment & Software Purchase
                                </label>
                                <input
                                    type="number"
                                    value={formData.equipmentPurchase}
                                    onChange={(e) => setFormData({ ...formData, equipmentPurchase: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="100000"
                                />
                                <p className="text-xs text-gray-500 mt-1">Camera, laptop, editing software (max ₹1L)</p>
                            </div>
                        </div>

                        {/* TDS */}
                        <div className="pt-4 border-t border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                TDS Already Deducted
                            </label>
                            <input
                                type="number"
                                value={formData.tdsDeducted}
                                onChange={(e) => setFormData({ ...formData, tdsDeducted: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="50000"
                            />
                            <p className="text-xs text-gray-500 mt-1">Total TDS deducted by clients</p>
                        </div>

                        {/* GST Registration */}
                        <div className="pt-4 border-t border-gray-200">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.hasGSTRegistration}
                                    onChange={(e) => setFormData({ ...formData, hasGSTRegistration: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">I have GST registration</span>
                            </label>
                        </div>

                        {/* Calculate Button */}
                        <button
                            onClick={handleCalculate}
                            disabled={loading || !formData.grossIncome}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Calculator className="w-5 h-5" />
                                    Calculate Tax
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results */}
                    <div className="space-y-6">
                        {result ? (
                            <>
                                {/* Summary Card */}
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
                                    <h3 className="text-lg font-semibold mb-4">Tax Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-blue-100">Gross Income</span>
                                            <span className="text-2xl font-bold">{formatCurrency(result.grossIncome)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-blue-100">Taxable Income</span>
                                            <span className="font-semibold">{formatCurrency(result.taxableIncome)}</span>
                                        </div>
                                        <div className="border-t border-blue-400 pt-3 mt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-blue-100">Total Tax Liability</span>
                                                <span className="text-2xl font-bold">{formatCurrency(result.totalTaxLiability)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm mt-2">
                                                <span className="text-blue-100">Effective Tax Rate</span>
                                                <span className="font-semibold">{result.effectiveTaxRate}%</span>
                                            </div>
                                        </div>
                                        <div className="border-t border-blue-400 pt-3 mt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-blue-100">Tax Payable</span>
                                                <span className="text-3xl font-bold text-yellow-300">{formatCurrency(result.taxPayable)}</span>
                                            </div>
                                            <p className="text-xs text-blue-100 mt-1">After TDS deduction</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Breakdown */}
                                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                                    <h3 className="font-bold text-dark-800 mb-4">Tax Slab Breakdown</h3>
                                    <div className="space-y-2">
                                        {result.breakdown.map((item: any, index: number) => (
                                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">{item.slab}</p>
                                                    <p className="text-xs text-gray-500">Income: {formatCurrency(item.income)}</p>
                                                </div>
                                                <span className="font-semibold text-gray-900">{formatCurrency(item.tax)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Deductions Applied */}
                                {result.deductions.length > 0 && (
                                    <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                                        <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                                            <TrendingDown className="w-5 h-5" />
                                            Deductions Applied
                                        </h3>
                                        <div className="space-y-2">
                                            {result.deductions.map((item: any, index: number) => (
                                                <div key={index} className="flex justify-between items-center text-sm">
                                                    <span className="text-green-700">{item.name}</span>
                                                    <span className="font-semibold text-green-800">-{formatCurrency(item.amount)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* GST Liability */}
                                {result.gstLiability > 0 && (
                                    <div className="bg-orange-50 rounded-xl border border-orange-200 p-6">
                                        <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5" />
                                            GST Liability
                                        </h3>
                                        <p className="text-2xl font-bold text-orange-900">{formatCurrency(result.gstLiability)}</p>
                                        <p className="text-xs text-orange-700 mt-1">Estimated GST (10% after ITC)</p>
                                    </div>
                                )}

                                {/* Suggestions */}
                                {result.suggestions.length > 0 && (
                                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                                        <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5" />
                                            Tax Saving Suggestions
                                        </h3>
                                        <ul className="space-y-2">
                                            {result.suggestions.map((suggestion: string, index: number) => (
                                                <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                                                    <span className="text-blue-400 mt-0.5">•</span>
                                                    <span>{suggestion}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center text-gray-500">
                                <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="font-medium">Enter your income details</p>
                                <p className="text-sm mt-1">Calculate your tax liability for FY 2025-26</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                    <p className="font-semibold mb-1">⚠️ Disclaimer</p>
                    <p>This calculator provides estimates based on current tax laws. For accurate tax filing, please consult a certified CA or tax professional.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
