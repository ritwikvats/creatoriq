"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// CRITICAL: Load .env FIRST before any other imports!
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Try loading from both locations
const rootEnvPath = path_1.default.resolve(__dirname, '../../../.env');
const apiEnvPath = path_1.default.resolve(__dirname, '../.env');
console.log('📁 Loading .env from root:', rootEnvPath);
dotenv_1.default.config({ path: rootEnvPath });
console.log('📁 Loading .env from api:', apiEnvPath);
dotenv_1.default.config({ path: apiEnvPath });
console.log('✅ Env loaded - GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING');
// Now import everything else AFTER env is loaded
const express_1 = __importDefault(require("express"));
const Sentry = __importStar(require("@sentry/node"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
const PORT = process.env.API_PORT || 3001;
// Initialize Sentry with Express integration
Sentry.init({
    dsn: process.env.SENTRY_DSN || 'https://examplePublicKey@o0.ingest.sentry.io/0',
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
    integrations: [
        Sentry.expressIntegration(),
    ],
    beforeSend(event, hint) {
        if (event.request?.headers) {
            delete event.request.headers['authorization'];
            delete event.request.headers['cookie'];
        }
        if (event.extra) {
            delete event.extra.apiKey;
            delete event.extra.access_token;
            delete event.extra.refresh_token;
        }
        return event;
    },
});
// Helmet security headers (must be early)
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://api.fuelix.ai"],
            imgSrc: ["'self'", "data:", "https:", "https://scontent.cdninstagram.com", "https://i.ytimg.com"],
            connectSrc: ["'self'", "https://api.fuelix.ai", "https://graph.facebook.com", "https://youtube.googleapis.com"],
        },
    },
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
    },
}));
// HTTPS redirect in production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        }
        else {
            next();
        }
    });
}
// Middleware
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3004', // Alternative port
        'http://localhost:3002',
    ],
    credentials: true,
}));
app.use(express_1.default.json());
// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_service_1.apiLogger.logRequest(req.method, req.path, undefined, duration);
    });
    next();
});
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'CreatorIQ API is running' });
});
// Routes
app.get('/', (req, res) => {
    res.json({
        name: 'CreatorIQ API',
        version: '0.1.0',
        endpoints: {
            health: '/health',
            auth: '/auth/*',
            youtube: '/youtube/*',
            instagram: '/instagram/*',
            revenue: '/revenue/*',
        },
    });
});
// Import routes
const youtube_1 = __importDefault(require("./routes/youtube"));
const instagram_1 = __importDefault(require("./routes/instagram"));
const revenue_1 = __importDefault(require("./routes/revenue"));
const ai_1 = __importDefault(require("./routes/ai"));
const tax_1 = __importDefault(require("./routes/tax"));
const deals_1 = __importDefault(require("./routes/deals"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const audience_1 = __importDefault(require("./routes/audience"));
const openclaw_1 = __importDefault(require("./routes/openclaw"));
const test_sentry_1 = __importDefault(require("./routes/test-sentry"));
const status_1 = __importDefault(require("./routes/status"));
// Import cron services
const cron_service_1 = require("./services/cron.service");
// Mount routes with rate limiting
app.use('/youtube/connect', rate_limit_1.platformConnectLimiter); // OAuth endpoints
app.use('/instagram/connect', rate_limit_1.platformConnectLimiter); // OAuth endpoints
app.use('/ai', rate_limit_1.aiLimiter); // AI endpoints (expensive)
app.use('/openclaw', rate_limit_1.aiLimiter); // OpenClaw AI endpoints
app.use('/youtube', youtube_1.default);
app.use('/instagram', instagram_1.default);
app.use('/revenue', revenue_1.default);
app.use('/ai', ai_1.default);
app.use('/openclaw', openclaw_1.default);
app.use('/tax', tax_1.default);
app.use('/deals', deals_1.default);
app.use('/analytics', analytics_1.default);
app.use('/audience', audience_1.default);
app.use('/test-sentry', test_sentry_1.default);
app.use('/status', status_1.default);
// Import rate limiters
const rate_limit_1 = require("./middleware/rate-limit");
// Import error handlers
const error_handler_1 = require("./middleware/error-handler");
const logger_service_1 = require("./services/logger.service");
// Sentry error handler (must be BEFORE other error handlers)
app.use(Sentry.expressErrorHandler());
// 404 handler (must be after all routes)
app.use(error_handler_1.notFoundHandler);
// Global error handler (must be last)
app.use(error_handler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 CreatorIQ API running on http://localhost:${PORT}`);
    console.log(`📊 Tax rules: Always synced with latest government updates`);
    // Initialize background jobs (tax sync, etc.)
    (0, cron_service_1.initializeCronJobs)();
});
exports.default = app;
