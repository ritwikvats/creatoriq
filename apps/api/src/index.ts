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
import cors from 'cors';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3004', // Alternative port
        'http://localhost:3002',
    ],
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
import youtubeRoutes from './routes/youtube';
import instagramRoutes from './routes/instagram';
import revenueRoutes from './routes/revenue';
import aiRoutes from './routes/ai';
import taxRoutes from './routes/tax';
import dealsRoutes from './routes/deals';
import analyticsRoutes from './routes/analytics';
import audienceRoutes from './routes/audience';
import openclawRoutes from './routes/openclaw';

// Import cron services
import { initializeCronJobs } from './services/cron.service';

// Mount routes
app.use('/youtube', youtubeRoutes);
app.use('/instagram', instagramRoutes);
app.use('/revenue', revenueRoutes);
app.use('/ai', aiRoutes);
app.use('/openclaw', openclawRoutes);
app.use('/tax', taxRoutes);
app.use('/deals', dealsRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/audience', audienceRoutes);

// Import error handlers
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { apiLogger } from './services/logger.service';

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
