"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Public status endpoint - only shows app is running (no config details)
router.get('/', (req, res) => {
    res.json({
        app: 'CreatorIQ API',
        status: 'operational',
        timestamp: new Date().toISOString(),
    });
});
// Authenticated status endpoint - shows full config (admin/dev use only)
router.get('/detail', auth_middleware_1.requireAuth, (req, res) => {
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
exports.default = router;
