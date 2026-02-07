import { Router } from 'express';
import * as instagramService from '../services/instagram.service';
import { saveConnectedPlatform, saveAnalyticsSnapshot } from '../services/supabase.service';

const router = Router();

// Get Instagram OAuth URL
router.get('/auth', (req, res) => {
    try {
        const authUrl = instagramService.getAuthUrl();
        res.json({ authUrl });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Instagram OAuth callback
router.get('/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
    }

    try {
        // Exchange code for access token
        const accessToken = await instagramService.getAccessToken(code as string);

        // Get Instagram Business Account ID
        const igAccountId = await instagramService.getInstagramAccountId(accessToken);

        if (!igAccountId) {
            throw new Error('No Instagram Business Account found');
        }

        // Get user ID from state
        const userId = state as string || req.query.userId as string;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Get account insights
        const { account, insights } = await instagramService.getAccountInsights(accessToken, igAccountId);

        // Save platform connection
        await saveConnectedPlatform({
            user_id: userId,
            platform: 'instagram',
            platform_user_id: igAccountId,
            platform_username: account.username,
            access_token: accessToken,
        });

        // Save initial analytics snapshot
        await saveAnalyticsSnapshot({
            user_id: userId,
            platform: 'instagram',
            snapshot_date: new Date().toISOString().split('T')[0],
            metrics: {
                followers: account.followers_count,
                posts_count: account.media_count,
                insights: insights,
            },
        });

        // Redirect to frontend success page
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?instagram=connected`);
    } catch (error: any) {
        console.error('Instagram callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=instagram_auth_failed`);
    }
});

// Check Instagram connection status
router.get('/status/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const platform = await require('../services/supabase.service').getConnectedPlatform(userId, 'instagram');

        if (!platform) {
            return res.json({ connected: false });
        }

        res.json({
            connected: true,
            username: platform.platform_username,
            followers: null, // Can fetch from analytics if needed
        });
    } catch (error: any) {
        console.error('Instagram status error:', error);
        res.json({ connected: false });
    }
});

// Get Instagram analytics for a user
router.get('/analytics/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Get connected platform
        const platform = await require('../services/supabase.service').getConnectedPlatform(userId, 'instagram');

        if (!platform) {
            return res.status(404).json({ error: 'Instagram not connected' });
        }

        // Fetch latest analytics
        const { account, insights } = await instagramService.getAccountInsights(
            platform.access_token,
            platform.platform_user_id
        );

        const media = await instagramService.getMediaPerformance(
            platform.access_token,
            platform.platform_user_id,
            10
        );

        res.json({
            account,
            insights,
            recentMedia: media,
        });
    } catch (error: any) {
        console.error('Instagram analytics error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
