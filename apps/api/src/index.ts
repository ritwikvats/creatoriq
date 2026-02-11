// CRITICAL: Load .env FIRST before any other imports!
import dotenv from 'dotenv';
import path from 'path';

// Try loading from both locations
const rootEnvPath = path.resolve(__dirname, '../../../.env');
const apiEnvPath = path.resolve(__dirname, '../.env');

console.log('📁 Loading .env from root:', rootEnvPath);
dotenv.config({ path: rootEnvPath });
console.log('📁 Loading .env from api:', apiEnvPath);
dotenv.config({ path: apiEnvPath });
console.log('✅ Env loaded - GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING');

// Now import everything else AFTER env is loaded
import express from 'express';
import * as Sentry from '@sentry/node';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
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
app.use(helmet({
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
        } else {
            next();
        }
    });
}

// Middleware
const corsOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://creatoriq-web.onrender.com',
    'https://creatoriq.in',
    'https://www.creatoriq.in',
];
// Only allow localhost in development
if (process.env.NODE_ENV !== 'production') {
    corsOrigins.push('http://localhost:3004', 'http://localhost:3002');
}
app.use(cors({
    origin: corsOrigins,
    credentials: true,
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        apiLogger.logRequest(req.method, req.path, undefined, duration);
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
        status: 'operational',
    });
});

// Import rate limiters
import { generalLimiter, authLimiter, aiLimiter, platformConnectLimiter } from './middleware/rate-limit';

// Import error handlers
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { apiLogger } from './services/logger.service';

// Import routes
import youtubeRoutes from './routes/youtube';
import instagramRoutes from './routes/instagram';
import revenueRoutes from './routes/revenue';
import aiRoutes from './routes/ai';
import taxRoutes from './routes/tax';
import dealsRoutes from './routes/deals';
import analyticsRoutes from './routes/analytics';
import audienceRoutes from './routes/audience';
import openclawRoutes from './routes/openclaw';
import testSentryRoutes from './routes/test-sentry';
import statusRoutes from './routes/status';

// Import cron services
import { initializeCronJobs } from './services/cron.service';

// Mount routes with rate limiting
app.use('/youtube/connect', platformConnectLimiter); // OAuth endpoints
app.use('/instagram/connect', platformConnectLimiter); // OAuth endpoints
app.use('/ai', aiLimiter); // AI endpoints (expensive)
app.use('/openclaw', aiLimiter); // OpenClaw AI endpoints

app.use('/youtube', youtubeRoutes);
app.use('/instagram', instagramRoutes);
app.use('/revenue', revenueRoutes);
app.use('/ai', aiRoutes);
app.use('/openclaw', openclawRoutes);
app.use('/tax', taxRoutes);
app.use('/deals', dealsRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/audience', audienceRoutes);
app.use('/test-sentry', testSentryRoutes);
app.use('/status', statusRoutes);

// Sentry error handler (must be BEFORE other error handlers)
app.use(Sentry.expressErrorHandler());

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 CreatorIQ API running on http://localhost:${PORT}`);
    console.log(`📊 Tax rules: Always synced with latest government updates`);

    // Initialize background jobs (tax sync, etc.)
    initializeCronJobs();
});

export default app;
