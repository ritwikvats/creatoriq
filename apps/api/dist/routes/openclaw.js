"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openclaw_service_1 = require("../services/openclaw.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * POST /openclaw/code-snippet
 * Generate code snippets for creator integrations
 */
router.post('/code-snippet', auth_middleware_1.requireAuth, async (req, res, next) => {
    try {
        const { description, language = 'javascript' } = req.body;
        if (!description) {
            return res.status(400).json({ error: 'Description is required' });
        }
        if (!openclaw_service_1.openClawService.isAvailable()) {
            return res.status(503).json({
                error: 'OpenClaw AI is not configured. Please set OPENCLAW_API_KEY environment variable.'
            });
        }
        const code = await openclaw_service_1.openClawService.generateCodeSnippet(description, language);
        res.json({
            success: true,
            code,
            language,
            provider: 'OpenClaw'
        });
    }
    catch (error) {
        console.error('Code snippet generation error:', error);
        next(error);
    }
});
/**
 * POST /openclaw/automation-script
 * Generate automation scripts for content creators
 */
router.post('/automation-script', auth_middleware_1.requireAuth, async (req, res, next) => {
    try {
        const { task } = req.body;
        if (!task) {
            return res.status(400).json({ error: 'Task description is required' });
        }
        if (!openclaw_service_1.openClawService.isAvailable()) {
            return res.status(503).json({
                error: 'OpenClaw AI is not configured'
            });
        }
        const script = await openclaw_service_1.openClawService.generateAutomationScript(task);
        res.json({
            success: true,
            script,
            provider: 'OpenClaw'
        });
    }
    catch (error) {
        console.error('Automation script generation error:', error);
        next(error);
    }
});
/**
 * POST /openclaw/technical-content
 * Generate technical content ideas for tech creators
 */
router.post('/technical-content', auth_middleware_1.requireAuth, async (req, res, next) => {
    try {
        const { topic, targetAudience = 'developers' } = req.body;
        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }
        if (!openclaw_service_1.openClawService.isAvailable()) {
            return res.status(503).json({
                error: 'OpenClaw AI is not configured'
            });
        }
        const content = await openclaw_service_1.openClawService.generateTechnicalContent(topic, targetAudience);
        res.json({
            success: true,
            content,
            provider: 'OpenClaw'
        });
    }
    catch (error) {
        console.error('Technical content generation error:', error);
        next(error);
    }
});
/**
 * GET /openclaw/status
 * Check OpenClaw service availability
 */
router.get('/status', (req, res) => {
    const available = openclaw_service_1.openClawService.isAvailable();
    res.json({
        provider: 'OpenClaw',
        available,
        message: available
            ? 'OpenClaw AI is ready'
            : 'OpenClaw AI is not configured (set OPENCLAW_API_KEY)'
    });
});
exports.default = router;
