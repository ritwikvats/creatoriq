"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taxService = exports.TaxService = void 0;
const supabase_service_1 = require("./supabase.service");
const ai_service_1 = require("./ai.service");
class TaxService {
    /**
     * Get tax summary for a specific financial year
     * Financial Year in India: April 1 to March 31
     */
    async getTaxSummary(userId, year) {
        const startDate = `${year}-04-01`;
        const endDate = `${year + 1}-03-31`;
        const { data: revenue, error } = await supabase_service_1.supabase
            .from('revenue_entries')
            .select('*')
            .eq('user_id', userId)
            .gte('date', startDate)
            .lte('date', endDate);
        if (error)
            throw error;
        const quarters = {
            Q1: { total: 0, gst: 0, tds: 0 }, // Apr - Jun
            Q2: { total: 0, gst: 0, tds: 0 }, // Jul - Sep
            Q3: { total: 0, gst: 0, tds: 0 }, // Oct - Dec
            Q4: { total: 0, gst: 0, tds: 0 }, // Jan - Mar
        };
        let totalIncome = 0;
        let totalGst = 0;
        let totalTds = 0;
        revenue?.forEach((entry) => {
            const date = new Date(entry.date);
            const month = date.getMonth(); // 0-indexed
            const amount = parseFloat(entry.amount) || 0;
            const gst = parseFloat(entry.gst_amount) || 0;
            const tds = parseFloat(entry.tds_deducted) || 0;
            let quarter;
            if (month >= 3 && month <= 5)
                quarter = 'Q1';
            else if (month >= 6 && month <= 8)
                quarter = 'Q2';
            else if (month >= 9 && month <= 11)
                quarter = 'Q3';
            else
                quarter = 'Q4';
            quarters[quarter].total += amount;
            quarters[quarter].gst += gst;
            quarters[quarter].tds += tds;
            totalIncome += amount;
            totalGst += gst;
            totalTds += tds;
        });
        // AI-Powered Tax Advisor (PERSONALIZED)
        let aiTips = [];
        try {
            const revenueHistory = revenue?.map(r => ({
                month: new Date(r.date).toLocaleString('default', { month: 'long' }),
                amount: parseFloat(r.amount)
            })) || [];
            const aiResponse = await ai_service_1.aiService.analyzeRevenue(revenueHistory);
            // Split by bullet points or common separators if possible, or just treat as a block
            aiTips = aiResponse.split('\n').filter(line => line.trim().length > 10).slice(0, 3);
        }
        catch (error) {
            console.error('AI Tax Advice Error:', error);
            aiTips = [
                "Consider business expense deductions for hardware/software.",
                "Ensure TDS certificates are collected for Form 26AS matching.",
                totalIncome > 1000000 ? "Since income exceeds 10L, verify advance tax liability." : "Track your expenses to minimize tax liability."
            ];
        }
        // India-specific thresholds
        const GST_THRESHOLD = 2000000; // 20 Lakhs
        const isGstMandatory = totalIncome >= GST_THRESHOLD;
        return {
            financialYear: `${year}-${(year + 1).toString().slice(2)}`,
            totalIncome,
            totalGst,
            totalTds,
            netIncome: totalIncome - totalTds,
            quarters,
            gstStatus: {
                isMandatory: isGstMandatory,
                threshold: GST_THRESHOLD,
                progress: (totalIncome / GST_THRESHOLD) * 100,
            },
            taxSavingTips: aiTips,
        };
    }
}
exports.TaxService = TaxService;
exports.taxService = new TaxService();
