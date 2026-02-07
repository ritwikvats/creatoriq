import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from apps/api directory first (where this package runs)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

// Mount routes
app.use('/youtube', youtubeRoutes);
app.use('/instagram', instagramRoutes);
app.use('/revenue', revenueRoutes);
app.use('/ai', aiRoutes);
app.use('/tax', taxRoutes);
app.use('/deals', dealsRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
    });
});

app.listen(PORT, () => {
    console.log(`🚀 CreatorIQ API running on http://localhost:${PORT}`);
});

export default app;
