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

        // Build analytics context with clear labels
        let dataBlock = '';
        if (analytics) {
            const ig = analytics.instagram;
            const yt = analytics.youtube;
            const parts: string[] = [];

            if (ig) {
                parts.push(`INSTAGRAM (@${ig.username || 'connected'}):
- Followers: ${ig.followers?.toLocaleString() || 0}
- Posts: ${ig.posts || 0}
- Engagement Rate: ${ig.engagementRate || 0}%
- Avg Likes/Post: ${ig.avgLikes || 0}
- Avg Comments/Post: ${ig.avgComments || 0}`);
            }

            if (yt) {
                parts.push(`YOUTUBE (${yt.channelName || 'connected'}):
- Subscribers: ${yt.subscribers?.toLocaleString() || 0}
- Total Views: ${yt.totalViews?.toLocaleString() || 0}
- Total Videos: ${yt.totalVideos || 0}`);
            }

            if (parts.length > 0) {
                dataBlock = `\n\n=== USER'S REAL ANALYTICS (USE THESE NUMBERS) ===\n${parts.join('\n\n')}\n=== END ANALYTICS ===`;
            }
        }

        const systemPrompt = `You are the user's personal creator growth consultant inside CreatorIQ. You ALREADY have their real analytics data below — use it in every response.

CRITICAL RULES:
- You ALREADY know their username, followers, engagement, everything. NEVER ask for their handle or more data.
- NEVER say "drop your handle" or "send me your data" — you have it all.
- Jump straight into actionable advice using their REAL numbers.
- When asked to do something (rewrite captions, build a plan, hashtags), DO IT immediately. Don't describe what you would do — actually do it.
- Reference their specific metrics: "Your ${analytics?.instagram ? analytics.instagram.followers + ' followers' : 'account'}" not "your followers"

FORMAT RULES:
- Use ## for section headers, ### for sub-sections
- Use **bold** for key numbers and important terms
- Use tables with | for calendars, plans, comparisons
- Use - bullets for lists, 1. 2. 3. for ordered steps
- Add blank lines between sections
- Keep it scannable — no walls of text${dataBlock}`;

        const messages: Array<{role: string, content: string}> = [
            {
                role: 'system',
                content: systemPrompt
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
