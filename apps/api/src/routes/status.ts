import express from 'express';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

// Public status endpoint - only shows app is running (no config details)
router.get('/', (req, res) => {
    res.json({
        app: 'CreatorIQ API',
        status: 'operational',
        timestamp: new Date().toISOString(),
    });
});

// Authenticated status endpoint - shows full config (admin/dev use only)
router.get('/detail', requireAuth, (req, res) => {
    res.json({
        app: 'CreatorIQ API',
        version: '0.2.0',
        timestamp: new Date().toISOString(),
        features: {
            sentry: { enabled: !!process.env.SENTRY_DSN },
            rateLimiting: { enabled: true },
            helmet: { enabled: true },
            security: {
                httpsRedirect: process.env.NODE_ENV === 'production',
                cors: true,
                encryption: !!process.env.ENCRYPTION_KEY,
            },
        },
        integrations: {
            youtube: { configured: !!process.env.GOOGLE_CLIENT_ID },
            instagram: { configured: !!process.env.FACEBOOK_APP_ID },
            supabase: { configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
            ai: { configured: !!process.env.OPENCLAW_API_KEY || !!process.env.GROQ_API_KEY },
        },
    });
});

export default router;
