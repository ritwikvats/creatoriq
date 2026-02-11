"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_service_1 = require("../services/ai.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * POST /api/ai/insights
 * Generate AI-powered insights from analytics data
 */
router.post('/insights', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const { analytics } = req.body;
        if (!analytics) {
            return res.status(400).json({ error: 'Analytics data is required' });
        }
        const insights = await ai_service_1.aiService.generateInsights(analytics);
        res.json({
            success: true,
            insights,
            model: 'llama-3.1-70b-versatile'
        });
    }
    catch (error) {
        console.error('Insights API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate insights'
        });
    }
});
/**
 * POST /api/ai/categorize-tax
 * Categorize revenue for tax purposes
 */
router.post('/categorize-tax', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const { description, amount } = req.body;
        if (!description || !amount) {
            return res.status(400).json({ error: 'Description and amount are required' });
        }
        const category = await ai_service_1.aiService.categorizeTax(description, amount);
        res.json({
            success: true,
            category,
            model: 'llama-3.1-8b-instant'
        });
    }
    catch (error) {
        console.error('Tax Categorization API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to categorize tax'
        });
    }
});
/**
 * POST /api/ai/content-ideas
 * Generate viral content ideas
 */
router.post('/content-ideas', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const { niche, recentTopics } = req.body;
        if (!niche) {
            return res.status(400).json({ error: 'Niche is required' });
        }
        const ideas = await ai_service_1.aiService.generateContentIdeas(niche, recentTopics || []);
        res.json({
            success: true,
            ideas,
            model: 'llama-3.1-70b-versatile'
        });
    }
    catch (error) {
        console.error('Content Ideas API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate content ideas'
        });
    }
});
/**
 * POST /api/ai/analyze-revenue
 * Analyze revenue trends and provide financial advice
 */
router.post('/analyze-revenue', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const { revenueHistory } = req.body;
        if (!revenueHistory || !Array.isArray(revenueHistory)) {
            return res.status(400).json({ error: 'Revenue history array is required' });
        }
        const analysis = await ai_service_1.aiService.analyzeRevenue(revenueHistory);
        res.json({
            success: true,
            analysis,
            model: 'llama-3.1-70b-versatile'
        });
    }
    catch (error) {
        console.error('Revenue Analysis API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to analyze revenue'
        });
    }
});
/**
 * GET /api/ai/status
 * Check AI service status
 */
router.get('/status', auth_middleware_1.requireAuth, (req, res) => {
    res.json({
        success: true,
        status: 'operational',
    });
});
exports.default = router;
