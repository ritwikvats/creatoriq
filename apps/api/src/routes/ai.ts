import { Router, Request, Response } from 'express';
import { aiService } from '../services/ai.service';

const router = Router();

/**
 * POST /api/ai/insights
 * Generate AI-powered insights from analytics data
 */
router.post('/insights', async (req: Request, res: Response) => {
    try {
        const { analytics } = req.body;

        if (!analytics) {
            return res.status(400).json({ error: 'Analytics data is required' });
        }

        const insights = await aiService.generateInsights(analytics);

        res.json({
            success: true,
            insights,
            model: 'llama-3.1-70b-versatile'
        });
    } catch (error: any) {
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
router.post('/categorize-tax', async (req: Request, res: Response) => {
    try {
        const { description, amount } = req.body;

        if (!description || !amount) {
            return res.status(400).json({ error: 'Description and amount are required' });
        }

        const category = await aiService.categorizeTax(description, amount);

        res.json({
            success: true,
            category,
            model: 'llama-3.1-8b-instant'
        });
    } catch (error: any) {
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
router.post('/content-ideas', async (req: Request, res: Response) => {
    try {
        const { niche, recentTopics } = req.body;

        if (!niche) {
            return res.status(400).json({ error: 'Niche is required' });
        }

        const ideas = await aiService.generateContentIdeas(niche, recentTopics || []);

        res.json({
            success: true,
            ideas,
            model: 'llama-3.1-70b-versatile'
        });
    } catch (error: any) {
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
router.post('/analyze-revenue', async (req: Request, res: Response) => {
    try {
        const { revenueHistory } = req.body;

        if (!revenueHistory || !Array.isArray(revenueHistory)) {
            return res.status(400).json({ error: 'Revenue history array is required' });
        }

        const analysis = await aiService.analyzeRevenue(revenueHistory);

        res.json({
            success: true,
            analysis,
            model: 'llama-3.1-70b-versatile'
        });
    } catch (error: any) {
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
router.get('/status', (req: Request, res: Response) => {
    res.json({
        success: true,
        status: 'operational',
        provider: 'Groq',
        models: {
            insights: 'llama-3.1-70b-versatile',
            categorization: 'llama-3.1-8b-instant',
            contentGeneration: 'llama-3.1-70b-versatile',
            revenueAnalysis: 'llama-3.1-70b-versatile'
        }
    });
});

export default router;
