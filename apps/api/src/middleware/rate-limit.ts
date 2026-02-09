import rateLimit from 'express-rate-limit';

// General API rate limiter (applies to most endpoints)
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.',
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many requests, please try again later.',
            retryAfter: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        });
    },
});

// Auth endpoints rate limiter (stricter for login/signup)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many authentication attempts, please try again later.',
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many login attempts. Please wait 15 minutes and try again.',
            retryAfter: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        });
    },
});

// AI insights rate limiter (prevent expensive AI calls abuse)
export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 AI requests per hour per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: 'AI insight generation limit reached. Please wait before generating more insights.',
    handler: (req, res) => {
        res.status(429).json({
            error: 'AI insight limit reached (10 per hour). Please wait before generating more.',
            retryAfter: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            tip: 'Upgrade to Pro for higher limits!',
        });
    },
});

// Platform connection rate limiter (OAuth flows)
export const platformConnectLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 connection attempts per hour per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many platform connection attempts, please try again later.',
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many platform connection attempts. Please wait 1 hour and try again.',
            retryAfter: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        });
    },
});
