/**
 * Tax Calculator Service for Indian Digital Creators
 * Implements Indian Income Tax and GST rules as of FY 2025-26
 */

interface TaxCalculationInput {
    grossIncome: number;
    deductions?: {
        section80C?: number; // Investments (max 1.5L)
        section80D?: number; // Health insurance (max 25k/50k)
        businessExpenses?: number;
        equipmentPurchase?: number; // Creative Industry Development scheme (max 1L)
    };
    tdsDeducted?: number;
    hasGSTRegistration?: boolean;
    ageGroup?: 'below60' | '60to80' | 'above80';
}

interface TaxCalculationResult {
    grossIncome: number;
    taxableIncome: number;
    incomeTax: number;
    surcharge: number;
    cess: number;
    totalTaxLiability: number;
    tdsDeducted: number;
    taxPayable: number;
    gstLiability: number;
    effectiveTaxRate: number;
    breakdown: {
        slab: string;
        income: number;
        tax: number;
    }[];
    deductions: {
        name: string;
        amount: number;
    }[];
    suggestions: string[];
}

export class TaxCalculatorService {
    // Income Tax Slabs for FY 2025-26 (New Regime)
    private readonly TAX_SLABS = [
        { min: 0, max: 300000, rate: 0 },
        { min: 300000, max: 700000, rate: 5 },
        { min: 700000, max: 1000000, rate: 10 },
        { min: 1000000, max: 1200000, rate: 15 },
        { min: 1200000, max: 1500000, rate: 20 },
        { min: 1500000, max: Infinity, rate: 30 },
    ];

    // Rebate under Section 87A
    private readonly REBATE_LIMIT = 700000;
    private readonly REBATE_AMOUNT = 25000;

    // GST Threshold
    private readonly GST_THRESHOLD = 2000000; // ₹20L

    /**
     * Calculate comprehensive tax liability
     */
    calculateTax(input: TaxCalculationInput): TaxCalculationResult {
        // Step 1: Calculate total deductions
        const totalDeductions = this.calculateDeductions(input.deductions || {});

        // Step 2: Calculate taxable income
        const taxableIncome = Math.max(0, input.grossIncome - totalDeductions.total);

        // Step 3: Calculate income tax using slabs
        const { tax: baseTax, breakdown } = this.calculateIncomeTax(taxableIncome);

        // Step 4: Apply rebate if applicable
        let finalTax = baseTax;
        if (taxableIncome <= this.REBATE_LIMIT) {
            finalTax = Math.max(0, baseTax - this.REBATE_AMOUNT);
        }

        // Step 5: Calculate surcharge (for high earners)
        const surcharge = this.calculateSurcharge(taxableIncome, finalTax);

        // Step 6: Calculate cess (4% of tax + surcharge)
        const cess = (finalTax + surcharge) * 0.04;

        // Step 7: Total tax liability
        const totalTaxLiability = Math.round(finalTax + surcharge + cess);

        // Step 8: Tax payable after TDS
        const tdsDeducted = input.tdsDeducted || 0;
        const taxPayable = Math.max(0, totalTaxLiability - tdsDeducted);

        // Step 9: Calculate GST liability
        const gstLiability = this.calculateGST(input.grossIncome, input.hasGSTRegistration);

        // Step 10: Effective tax rate
        const effectiveTaxRate = input.grossIncome > 0
            ? (totalTaxLiability / input.grossIncome) * 100
            : 0;

        // Step 11: Generate tax-saving suggestions
        const suggestions = this.generateSuggestions(input, taxableIncome, totalDeductions);

        return {
            grossIncome: input.grossIncome,
            taxableIncome,
            incomeTax: Math.round(finalTax),
            surcharge: Math.round(surcharge),
            cess: Math.round(cess),
            totalTaxLiability,
            tdsDeducted,
            taxPayable,
            gstLiability: Math.round(gstLiability),
            effectiveTaxRate: parseFloat(effectiveTaxRate.toFixed(2)),
            breakdown,
            deductions: totalDeductions.items,
            suggestions,
        };
    }

    /**
     * Calculate income tax using slabs
     */
    private calculateIncomeTax(taxableIncome: number): { tax: number; breakdown: any[] } {
        let tax = 0;
        const breakdown = [];

        for (const slab of this.TAX_SLABS) {
            if (taxableIncome > slab.min) {
                const taxableInSlab = Math.min(taxableIncome, slab.max) - slab.min;
                const taxInSlab = (taxableInSlab * slab.rate) / 100;
                tax += taxInSlab;

                if (taxInSlab > 0) {
                    breakdown.push({
                        slab: `₹${(slab.min / 100000).toFixed(1)}L - ${slab.max === Infinity ? 'Above' : '₹' + (slab.max / 100000).toFixed(1) + 'L'}`,
                        income: Math.round(taxableInSlab),
                        tax: Math.round(taxInSlab),
                    });
                }
            }
        }

        return { tax, breakdown };
    }

    /**
     * Calculate total deductions
     */
    private calculateDeductions(deductions: any): { total: number; items: any[] } {
        const items = [];
        let total = 0;

        // Standard deduction (₹50,000 for salaried, not applicable for business income)
        // For creators, we'll use business expense deduction instead

        // Section 80C - Investments (max 1.5L)
        if (deductions.section80C) {
            const amount = Math.min(deductions.section80C, 150000);
            items.push({ name: 'Section 80C (Investments)', amount });
            total += amount;
        }

        // Section 80D - Health Insurance (max 25k for self, 50k if senior citizen)
        if (deductions.section80D) {
            const amount = Math.min(deductions.section80D, 25000);
            items.push({ name: 'Section 80D (Health Insurance)', amount });
            total += amount;
        }

        // Business Expenses (30% presumptive taxation under Section 44ADA)
        if (deductions.businessExpenses) {
            items.push({ name: 'Business Expenses', amount: deductions.businessExpenses });
            total += deductions.businessExpenses;
        }

        // Creative Industry Development - Equipment/Software (max 1L)
        if (deductions.equipmentPurchase) {
            const amount = Math.min(deductions.equipmentPurchase, 100000);
            items.push({ name: 'Equipment & Software (Creative Industry)', amount });
            total += amount;
        }

        return { total, items };
    }

    /**
     * Calculate surcharge for high earners
     */
    private calculateSurcharge(income: number, tax: number): number {
        if (income > 5000000) return tax * 0.10; // 10% surcharge above ₹50L
        if (income > 10000000) return tax * 0.15; // 15% surcharge above ₹1Cr
        return 0;
    }

    /**
     * Calculate GST liability
     */
    private calculateGST(income: number, hasRegistration: boolean = false): number {
        // GST is applicable if turnover exceeds ₹20L
        if (income < this.GST_THRESHOLD) {
            return 0;
        }

        // Simplified: 18% GST on services (creators provide services)
        // Actual GST would be on output services minus input tax credit
        // For simplicity, assuming 10% effective GST after ITC
        return income * 0.10;
    }

    /**
     * Generate tax-saving suggestions
     */
    private generateSuggestions(input: TaxCalculationInput, taxableIncome: number, deductions: any): string[] {
        const suggestions: string[] = [];

        // Section 80C suggestions
        const currentSection80C = input.deductions?.section80C || 0;
        if (currentSection80C < 150000) {
            const remaining = 150000 - currentSection80C;
            suggestions.push(`💰 Invest ₹${remaining.toLocaleString()} more in PPF/ELSS/NPS to maximize Section 80C deduction`);
        }

        // Health insurance
        const currentSection80D = input.deductions?.section80D || 0;
        if (currentSection80D < 25000) {
            suggestions.push(`🏥 Get health insurance to claim up to ₹25,000 deduction under Section 80D`);
        }

        // Equipment purchase
        const currentEquipment = input.deductions?.equipmentPurchase || 0;
        if (currentEquipment < 100000) {
            suggestions.push(`🎬 Purchase content creation equipment/software to claim up to ₹1L deduction`);
        }

        // GST registration
        if (input.grossIncome > this.GST_THRESHOLD && !input.hasGSTRegistration) {
            suggestions.push(`📋 Your income exceeds ₹20L - GST registration is mandatory. Register within 30 days.`);
        }

        // Presumptive taxation
        if (input.grossIncome > 5000000) {
            suggestions.push(`📊 Consider regular books of accounts instead of presumptive taxation for better deductions`);
        }

        // TDS certificates
        if (!input.tdsDeducted) {
            suggestions.push(`🧾 Ensure you collect TDS certificates (Form 16A) from all clients paying you`);
        }

        // Advance tax
        if (taxableIncome > 1000000) {
            suggestions.push(`⏰ Remember to pay advance tax in quarterly installments to avoid interest charges`);
        }

        // Creator fund
        suggestions.push(`🎁 Check eligibility for ₹250Cr Creator Fund announced in Budget 2026`);

        return suggestions;
    }

    /**
     * Calculate quarterly advance tax
     */
    calculateAdvanceTax(annualTax: number): { q1: number; q2: number; q3: number; q4: number } {
        return {
            q1: Math.round(annualTax * 0.15), // By June 15
            q2: Math.round(annualTax * 0.30), // By Sept 15 (cumulative 45%)
            q3: Math.round(annualTax * 0.30), // By Dec 15 (cumulative 75%)
            q4: Math.round(annualTax * 0.25), // By Mar 15 (remaining 100%)
        };
    }
}

export const taxCalculatorService = new TaxCalculatorService();
