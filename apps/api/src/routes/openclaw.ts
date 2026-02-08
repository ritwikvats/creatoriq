import { Router, Request, Response } from 'express';
import { openClawService } from '../services/openclaw.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /openclaw/code-snippet
 * Generate code snippets for creator integrations
 */
router.post('/code-snippet', requireAuth, async (req: Request, res: Response, next) => {
    try {
        const { description, language = 'javascript' } = req.body;

        if (!description) {
            return res.status(400).json({ error: 'Description is required' });
        }

        if (!openClawService.isAvailable()) {
            return res.status(503).json({
                error: 'OpenClaw AI is not configured. Please set OPENCLAW_API_KEY environment variable.'
            });
        }

        const code = await openClawService.generateCodeSnippet(description, language);

        res.json({
            success: true,
            code,
            language,
            provider: 'OpenClaw'
        });
    } catch (error: any) {
        console.error('Code snippet generation error:', error);
        next(error);
    }
});

/**
 * POST /openclaw/automation-script
 * Generate automation scripts for content creators
 */
router.post('/automation-script', requireAuth, async (req: Request, res: Response, next) => {
    try {
        const { task } = req.body;

        if (!task) {
            return res.status(400).json({ error: 'Task description is required' });
        }

        if (!openClawService.isAvailable()) {
            return res.status(503).json({
                error: 'OpenClaw AI is not configured'
            });
        }

        const script = await openClawService.generateAutomationScript(task);

        res.json({
            success: true,
            script,
            provider: 'OpenClaw'
        });
    } catch (error: any) {
        console.error('Automation script generation error:', error);
        next(error);
    }
});

/**
 * POST /openclaw/technical-content
 * Generate technical content ideas for tech creators
 */
router.post('/technical-content', requireAuth, async (req: Request, res: Response, next) => {
    try {
        const { topic, targetAudience = 'developers' } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        if (!openClawService.isAvailable()) {
            return res.status(503).json({
                error: 'OpenClaw AI is not configured'
            });
        }

        const content = await openClawService.generateTechnicalContent(topic, targetAudience);

        res.json({
            success: true,
            content,
            provider: 'OpenClaw'
        });
    } catch (error: any) {
        console.error('Technical content generation error:', error);
        next(error);
    }
});

/**
 * GET /openclaw/status
 * Check OpenClaw service availability
 */
router.get('/status', (req: Request, res: Response) => {
    const available = openClawService.isAvailable();

    res.json({
        provider: 'OpenClaw',
        available,
        message: available
            ? 'OpenClaw AI is ready'
            : 'OpenClaw AI is not configured (set OPENCLAW_API_KEY)'
    });
});

export default router;
