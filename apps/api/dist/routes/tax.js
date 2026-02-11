"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tax_service_1 = require("../services/tax.service");
const taxUpdatesService = __importStar(require("../services/tax-updates.service"));
const tax_calculator_service_1 = require("../services/tax-calculator.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Get tax summary for authenticated user
router.get('/summary', auth_middleware_1.requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    try {
        const summary = await tax_service_1.taxService.getTaxSummary(userId, year);
        res.json(summary);
    }
    catch (error) {
        console.error('Tax summary error:', error);
        next(error);
    }
});
// Get current tax rules (always up-to-date with govt regulations)
router.get('/rules', (req, res) => {
    res.json({
        rules: taxUpdatesService.CURRENT_TAX_RULES,
        message: 'Tax rules updated as of ' + taxUpdatesService.CURRENT_TAX_RULES.lastUpdated,
        source: 'Indian Government Tax Policy 2026',
    });
});
// Get latest tax updates from AI (synced with govt changes)
router.get('/updates', async (req, res) => {
    try {
        const updates = await taxUpdatesService.getLatestTaxUpdates();
        res.json({
            updates,
            lastChecked: new Date().toISOString(),
            currentRules: taxUpdatesService.CURRENT_TAX_RULES,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Calculate tax liability
router.post('/calculate', auth_middleware_1.requireAuth, (req, res) => {
    try {
        const result = tax_calculator_service_1.taxCalculatorService.calculateTax(req.body);
        res.json(result);
    }
    catch (error) {
        console.error('Tax calculation error:', error);
        res.status(500).json({ error: error.message });
    }
});
// Calculate advance tax installments
router.post('/advance-tax', auth_middleware_1.requireAuth, (req, res) => {
    try {
        const { annualTax } = req.body;
        const installments = tax_calculator_service_1.taxCalculatorService.calculateAdvanceTax(annualTax);
        res.json({ installments });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Calculate tax liability for annual income
router.post('/liability', auth_middleware_1.requireAuth, async (req, res) => {
    const { annualIncome } = req.body;
    if (!annualIncome || annualIncome <= 0) {
        return res.status(400).json({ error: 'Valid annual income required' });
    }
    try {
        const liability = taxUpdatesService.calculateTaxLiability(annualIncome);
        res.json(liability);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get personalized AI-powered tax advice
router.post('/advice', auth_middleware_1.requireAuth, async (req, res) => {
    const { annualIncome, revenueBreakdown, expenses } = req.body;
    if (!annualIncome) {
        return res.status(400).json({ error: 'Annual income required' });
    }
    try {
        const advice = await taxUpdatesService.getTaxAdvice({
            annualIncome,
            revenueBreakdown: revenueBreakdown || {},
            expenses: expenses || 0,
        });
        res.json({
            advice,
            calculation: taxUpdatesService.calculateTaxLiability(annualIncome),
            rules: taxUpdatesService.CURRENT_TAX_RULES,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Sync tax rules with latest government updates (called by cron or admin)
router.post('/sync', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        await taxUpdatesService.syncTaxRules();
        res.json({
            message: 'Tax rules synced successfully',
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
