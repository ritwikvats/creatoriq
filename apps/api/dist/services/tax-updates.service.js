"use strict";
/**
 * Tax Updates Service
 * Keeps track of latest Indian tax regulations and updates for creators
 * Syncs with government policies: GST, TDS, Income Tax
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURRENT_TAX_RULES = void 0;
exports.getLatestTaxUpdates = getLatestTaxUpdates;
exports.calculateTaxLiability = calculateTaxLiability;
exports.getTaxAdvice = getTaxAdvice;
exports.syncTaxRules = syncTaxRules;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
// Lazy initialization of Groq client
function getGroqClient() {
    if (!process.env.GROQ_API_KEY) {
        console.warn('⚠️ GROQ_API_KEY not set. AI tax updates disabled.');
        return null;
    }
    return new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
}
// Latest Indian Tax Rules for Creators (Updated: 2026)
exports.CURRENT_TAX_RULES = {
    lastUpdated: '2026-02-07',
    financialYear: '2025-26',
    gst: {
        threshold: 2000000, // ₹20 lakhs (for services)
        rate: 18, // 18% GST on most digital services
        applicableTo: [
            'Brand sponsorships',
            'Digital advertising revenue',
            'Merchandise sales',
            'Online courses/coaching',
        ],
        exemptions: [
            'YouTube AdSense revenue (paid from outside India)',
            'Instagram reels bonus (if below threshold)',
        ],
        notes: 'Creators with annual turnover above ₹20L must register for GST',
    },
    tds: {
        rates: {
            brandDeals: 10, // 10% TDS on brand sponsorships (Section 194J)
            professionalFees: 10, // 10% TDS if payment > ₹30,000
            youtube: 0, // Google (foreign company) - no TDS typically
        },
        threshold: 30000, // ₹30,000 per transaction
        form: '26AS', // Form to check TDS deductions
        notes: 'Brands must deduct TDS before paying creators. Claim this during ITR filing.',
    },
    incomeTax: {
        slabs2026: [
            { income: 300000, rate: 0, note: 'Up to ₹3L - No tax' },
            { income: 600000, rate: 5, note: '₹3L-₹6L - 5%' },
            { income: 900000, rate: 10, note: '₹6L-₹9L - 10%' },
            { income: 1200000, rate: 15, note: '₹9L-₹12L - 15%' },
            { income: 1500000, rate: 20, note: '₹12L-₹15L - 20%' },
            { income: Infinity, rate: 30, note: 'Above ₹15L - 30%' },
        ],
        deductions: {
            section80C: 150000, // ₹1.5L (LIC, PPF, ELSS)
            section80D: 25000, // ₹25K (Health insurance)
            standardDeduction: 50000, // ₹50K (New regime)
        },
        itrForms: {
            salaried: 'ITR-1',
            freelance: 'ITR-3 or ITR-4',
            business: 'ITR-4 (Presumptive)',
        },
        deadlines: {
            itr: '2026-07-31',
            advanceTax: ['2025-06-15', '2025-09-15', '2025-12-15', '2026-03-15'],
        },
    },
    creatorSpecific: {
        monetizationIncome: {
            youtube: 'Tax as Business Income (Presumptive @ 6% of revenue under Section 44ADA)',
            instagram: 'Tax as Professional Income (10% TDS if brand deals)',
            affiliate: 'Tax as Business Income',
        },
        expensesClaimed: [
            'Camera/equipment purchase (depreciation)',
            'Software subscriptions (Adobe, FCP)',
            'Internet bills (proportionate)',
            'Travel for content creation',
            'Studio rent',
            'Editor/assistant salaries',
        ],
        govtInitiatives2026: [
            '₹250Cr Creator Fund (Budget 2026)',
            'Startup benefits if registered as OPC/LLP',
            'No GST on YouTube AdSense if annual < ₹20L',
        ],
    },
    complianceChecklist: [
        'Register for GST if turnover > ₹20L',
        'Get TAN if making TDS payments',
        'File quarterly GSTR returns (if GST registered)',
        'File annual ITR by July 31',
        'Pay advance tax quarterly if tax liability > ₹10K',
        'Maintain books of accounts (cash book, ledger)',
        'Keep invoices for all brand deals',
        'Download Form 26AS to verify TDS',
    ],
    commonScenarios: {
        scenario1: {
            description: 'Creator earning ₹50K/month from YouTube AdSense only',
            gst: 'Not required (below ₹20L)',
            tds: 'No TDS (Google is foreign entity)',
            incomeTax: 'File ITR-3, pay tax at 5% (if no other income)',
        },
        scenario2: {
            description: 'Creator earning ₹5L/year (₹3L AdSense + ₹2L brand deals)',
            gst: 'Not required (below ₹20L)',
            tds: 'Brand will deduct 10% TDS on ₹2L = ₹20K',
            incomeTax: 'File ITR-3, taxable income = ₹5L, pay 5% on ₹2L = ₹10K (after ₹3L exemption)',
        },
        scenario3: {
            description: 'Creator earning ₹25L/year from multiple sources',
            gst: 'Required! Register for GST, charge 18% on invoices',
            tds: 'Ensure brands deduct TDS, claim in ITR',
            incomeTax: 'File ITR-3, tax rate 20-30%, use 44ADA (6% presumptive)',
        },
    },
};
/**
 * Get latest tax updates using AI to summarize recent changes
 */
async function getLatestTaxUpdates() {
    const prompt = `You are a tax expert for Indian content creators.
Based on Budget 2026 and latest CBDT notifications (as of Feb 2026), summarize:

1. Any NEW tax rules or changes for digital creators
2. GST rate changes (if any)
3. Income tax slab updates
4. TDS rule changes
5. Any creator-specific benefits or schemes

Keep it concise (5-7 bullet points). Focus on practical changes that affect creators earning ₹5L-50L annually.

Current rules we know:
- GST threshold: ₹20L
- TDS on brand deals: 10%
- Income tax: 5-30% slabs
- Budget 2026: ₹250Cr creator fund announced

What's NEW or CHANGED since Jan 2026?`;
    try {
        const groq = getGroqClient();
        if (!groq) {
            return 'AI tax updates unavailable. Using cached rules from Feb 2026. Please set GROQ_API_KEY.';
        }
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3, // Lower temp for factual accuracy
        });
        return completion.choices[0].message.content || 'No updates available';
    }
    catch (error) {
        console.error('Error fetching tax updates:', error);
        return 'Unable to fetch latest updates. Using cached rules from Feb 2026.';
    }
}
/**
 * Calculate tax liability for a creator
 */
function calculateTaxLiability(annualIncome) {
    const gstRequired = annualIncome >= exports.CURRENT_TAX_RULES.gst.threshold;
    const estimatedGST = gstRequired ? annualIncome * 0.18 : 0;
    // Calculate income tax using 2026 slabs
    let taxableIncome = annualIncome;
    let incomeTax = 0;
    let previousSlab = 0;
    for (const slab of exports.CURRENT_TAX_RULES.incomeTax.slabs2026) {
        if (taxableIncome > previousSlab) {
            const taxableInThisSlab = Math.min(taxableIncome, slab.income) - previousSlab;
            incomeTax += (taxableInThisSlab * slab.rate) / 100;
            previousSlab = slab.income;
        }
    }
    // Estimate TDS (assuming 50% income from brand deals)
    const brandDealIncome = annualIncome * 0.5;
    const tdsExpected = brandDealIncome * 0.1;
    const netIncome = annualIncome - estimatedGST - incomeTax;
    const breakdown = `
Annual Income: ₹${annualIncome.toLocaleString('en-IN')}
${gstRequired ? `GST Liability (18%): ₹${estimatedGST.toLocaleString('en-IN')}` : 'GST: Not applicable'}
Income Tax: ₹${incomeTax.toLocaleString('en-IN')}
Expected TDS: ₹${tdsExpected.toLocaleString('en-IN')}
Net Income: ₹${netIncome.toLocaleString('en-IN')}
    `.trim();
    return {
        gstRequired,
        estimatedGST,
        estimatedIncomeTax: incomeTax,
        tdsExpected,
        netIncome,
        breakdown,
    };
}
/**
 * Get AI-powered tax advice for a creator
 */
async function getTaxAdvice(params) {
    const { annualIncome, revenueBreakdown, expenses = 0 } = params;
    const taxCalc = calculateTaxLiability(annualIncome);
    const prompt = `You are a CA (Chartered Accountant) specializing in Indian creator tax compliance.

Creator Profile:
- Annual Income: ₹${annualIncome.toLocaleString('en-IN')}
- YouTube: ₹${(revenueBreakdown.youtube || 0).toLocaleString('en-IN')}
- Instagram/Brand Deals: ₹${(revenueBreakdown.instagram || 0).toLocaleString('en-IN')}
- Brand Deals: ₹${(revenueBreakdown.brandDeals || 0).toLocaleString('en-IN')}
- Expenses: ₹${expenses.toLocaleString('en-IN')}

Tax Calculation:
${taxCalc.breakdown}

Current Tax Rules (2026):
- GST Threshold: ₹${exports.CURRENT_TAX_RULES.gst.threshold.toLocaleString('en-IN')}
- TDS Rate: ${exports.CURRENT_TAX_RULES.tds.rates.brandDeals}%
- Income Tax Slabs: 5%, 10%, 15%, 20%, 30% (progressive)

Provide personalized tax advice in 3 sections:

1. **Immediate Actions** (What to do this month)
2. **Tax Optimization** (Legal ways to reduce tax)
3. **Compliance Checklist** (What forms/registrations needed)

Keep it practical, actionable, and India-specific. Use bullet points.`;
    try {
        const groq = getGroqClient();
        if (!groq) {
            return 'AI tax advice unavailable. Please set GROQ_API_KEY environment variable. For now, use the tax calculator and consult a CA for personalized advice.';
        }
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are an expert Indian CA. Current date: ${new Date().toISOString().split('T')[0]}. Financial Year: ${exports.CURRENT_TAX_RULES.financialYear}.`,
                },
                { role: 'user', content: prompt },
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.4,
        });
        return completion.choices[0].message.content || 'Unable to generate advice';
    }
    catch (error) {
        console.error('Error generating tax advice:', error);
        return 'Error generating personalized advice. Please consult a CA.';
    }
}
/**
 * Check for tax rule updates (should be called daily via cron)
 */
async function syncTaxRules() {
    console.log('🔄 Syncing latest tax rules...');
    const updates = await getLatestTaxUpdates();
    console.log('📋 Latest Tax Updates:\n', updates);
    // TODO: Store updates in database for audit trail
}
