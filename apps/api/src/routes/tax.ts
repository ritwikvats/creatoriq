import { Router } from 'express';
import { taxService } from '../services/tax.service';
import * as taxUpdatesService from '../services/tax-updates.service';

const router = Router();

// Get tax summary for a user
router.get('/:userId/summary', async (req, res) => {
    const { userId } = req.params;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    try {
        const summary = await taxService.getTaxSummary(userId, year);
        res.json(summary);
    } catch (error: any) {
        console.error('Tax summary error:', error);
        res.status(500).json({ error: error.message });
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
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Calculate tax liability for annual income
router.post('/liability', async (req, res) => {
    const { annualIncome } = req.body;

    if (!annualIncome || annualIncome <= 0) {
        return res.status(400).json({ error: 'Valid annual income required' });
    }

    try {
        const liability = taxUpdatesService.calculateTaxLiability(annualIncome);
        res.json(liability);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get personalized AI-powered tax advice
router.post('/advice', async (req, res) => {
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
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Sync tax rules with latest government updates (called by cron)
router.post('/sync', async (req, res) => {
    try {
        await taxUpdatesService.syncTaxRules();
        res.json({
            message: 'Tax rules synced successfully',
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
