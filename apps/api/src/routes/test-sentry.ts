import express from 'express';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

// Test route to trigger Sentry error (requires auth to prevent abuse)
router.get('/error', requireAuth, (req, res) => {
    throw new Error('🧪 Sentry test error - if you see this in Sentry, it works!');
});

export default router;
