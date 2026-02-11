import { Router, Request, Response } from 'express';
import { aiService } from '../services/ai.service';
import { openClawService } from '../services/openclaw.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/ai/insights
 * Generate AI-powered insights from analytics data
 */
router.post('/insights', requireAuth, async (req: Request, res: Response) => {
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
router.post('/categorize-tax', requireAuth, async (req: Request, res: Response) => {
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
router.post('/content-ideas', requireAuth, async (req: Request, res: Response) => {
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
router.post('/analyze-revenue', requireAuth, async (req: Request, res: Response) => {
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
 * POST /api/ai/chat
 * Interactive AI chat with analytics context
 */
router.post('/chat', requireAuth, async (req: Request, res: Response) => {
    try {
        const { message, history, analytics } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const systemPrompt = `You are an expert creator growth consultant for CreatorIQ. You have access to the user's real analytics data.

RESPONSE RULES:
- Be specific, actionable, and use their real numbers
- When asked to do something (rewrite captions, build a plan), DO IT immediately
- Use ## for section headers, ### for sub-sections
- Use **bold** for key terms and numbers
- Use tables with | for structured data (calendars, plans, comparisons)
- Use - bullets for lists, 1. 2. 3. for steps
- Add blank lines between sections for readability
- Keep each section focused and scannable`;

        const analyticsContext = analytics
            ? `\n\nUser's current analytics data:\n${JSON.stringify(analytics, null, 2)}`
            : '';

        const messages: Array<{role: string, content: string}> = [
            {
                role: 'system',
                content: systemPrompt + analyticsContext
            },
            ...(history || []).map((msg: {role: string, content: string}) => ({
                role: msg.role,
                content: msg.content
            })),
            {
                role: 'user',
                content: message
            }
        ];

        const reply = await aiService.chat(messages);

        res.json({
            success: true,
            reply
        });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate chat response'
        });
    }
});

/**
 * GET /api/ai/status
 * Check AI service status
 */
router.get('/status', requireAuth, (req: Request, res: Response) => {
    res.json({
        success: true,
        status: 'operational',
    });
});

export default router;
