"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Status endpoint to show what features are enabled
router.get('/', (req, res) => {
    const features = {
        app: 'CreatorIQ API',
        version: '0.2.0',
        timestamp: new Date().toISOString(),
        features: {
            sentry: {
                enabled: !!process.env.SENTRY_DSN,
                dsn: process.env.SENTRY_DSN ? '✅ Configured' : '❌ Missing',
            },
            postHog: {
                enabled: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
                key: process.env.NEXT_PUBLIC_POSTHOG_KEY ? '✅ Configured' : '❌ Missing',
                host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'Not set',
            },
            rateLimiting: {
                enabled: true,
                tiers: ['general', 'auth', 'ai', 'platformConnect'],
            },
            helmet: {
                enabled: true,
                features: ['CSP', 'HSTS', 'XSS Protection'],
            },
            security: {
                httpsRedirect: process.env.NODE_ENV === 'production',
                cors: true,
                encryption: !!process.env.ENCRYPTION_KEY,
            },
        },
        integrations: {
            youtube: {
                configured: !!process.env.GOOGLE_CLIENT_ID,
                clientId: process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing',
            },
            instagram: {
                configured: !!process.env.FACEBOOK_APP_ID,
                appId: process.env.FACEBOOK_APP_ID || 'Missing',
            },
            supabase: {
                configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            },
            fuelixAI: {
                configured: !!process.env.OPENCLAW_API_KEY,
            },
            groqAI: {
                configured: !!process.env.GROQ_API_KEY,
            },
        },
        pages: {
            privacy: '/privacy - GDPR compliant',
            terms: '/terms - Legal compliance',
        },
        readyForProduction: {
            security: '✅ Helmet + HTTPS redirect',
            monitoring: process.env.SENTRY_DSN ? '✅ Sentry configured' : '⚠️  Sentry needs DSN',
            analytics: process.env.NEXT_PUBLIC_POSTHOG_KEY ? '✅ PostHog configured' : '⚠️  PostHog needs key',
            rateLimit: '✅ API protection active',
            legal: '✅ Privacy & Terms pages',
        },
    };
    res.json(features);
});
exports.default = router;
