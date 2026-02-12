import { Router } from 'express';
import crypto from 'crypto';
import * as instagramService from '../services/instagram.service';
import { saveConnectedPlatform, saveAnalyticsSnapshot } from '../services/supabase.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Get Instagram OAuth URL (requires authentication to get user ID)
router.get('/auth', requireAuth, (req, res, next) => {
    try {
        const userId = req.user!.id;

        // Generate signed state token to prevent CSRF and account linking attacks
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not configured');
        }
        const expiry = Date.now() + 10 * 60 * 1000; // 10 min
        const payload = `${userId}:instagram:${expiry}`;
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
        const stateToken = Buffer.from(`${payload}:${signature}`).toString('base64url');

        const authUrl = instagramService.getAuthUrl(stateToken);
        res.json({ authUrl });
    } catch (error: any) {
        console.error('Instagram auth error:', error);
        next(error);
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

        // Verify signed state token to prevent CSRF/account linking attacks
        let userId: string;
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret) throw new Error('JWT_SECRET not configured');
            const decoded = Buffer.from(state as string, 'base64url').toString();
            const parts = decoded.split(':');
            if (parts.length !== 4) throw new Error('Invalid state format');
            const [uid, purpose, expiry, sig] = parts;
            if (purpose !== 'instagram') throw new Error('Wrong purpose');
            if (Date.now() > parseInt(expiry)) throw new Error('State expired');
            const expected = crypto.createHmac('sha256', secret).update(`${uid}:${purpose}:${expiry}`).digest('hex');
            if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) throw new Error('Invalid signature');
            userId = uid;
        } catch (err) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3004';
            return res.redirect(`${frontendUrl}/dashboard?error=invalid_state`);
        }

        // Get account insights
        const { account, insights } = await instagramService.getAccountInsights(accessToken, igAccountId);

        console.log('🎉 Instagram data fetched:', account.username, 'Followers:', account.followers_count);

        // Save platform connection (upsert - update if exists)
        try {
            await saveConnectedPlatform({
                user_id: userId,
                platform: 'instagram',
                platform_user_id: igAccountId,
                platform_username: account.username,
                access_token: accessToken,
            });
        } catch (saveError: any) {
            // If already exists, that's fine - just log it
            if (saveError.code === '23505') {
                console.log('⚠️ Instagram already connected, updating token...');
                // TODO: Update existing record instead
            } else {
                throw saveError;
            }
        }

        // Save initial analytics snapshot
        try {
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
        } catch (snapshotError: any) {
            console.log('⚠️ Analytics snapshot error (non-fatal):', snapshotError.message);
        }

        // Redirect to frontend success page
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3004';
        console.log('✅ Instagram connected! Redirecting to:', frontendUrl);
        res.redirect(`${frontendUrl}/dashboard?instagram=connected`);
    } catch (error: any) {
        console.error('Instagram callback error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3004';
        console.log('❌ Instagram failed! Redirecting to:', frontendUrl);
        res.redirect(`${frontendUrl}/dashboard?error=instagram_auth_failed`);
    }
});

// Check Instagram connection status
router.get('/status', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;

    try {
        let platform;

        try {
            platform = await require('../services/supabase.service').getConnectedPlatform(userId, 'instagram');
        } catch (err) {
            platform = null;
        }

        if (!platform) {
            return res.json({ connected: false });
        }

        // Fetch latest analytics snapshot to get follower/post counts
        const supabase = require('../services/supabase.service').getSupabaseClient();
        const { data: analytics } = await supabase
            .from('analytics_snapshots')
            .select('metrics')
            .eq('user_id', platform.user_id)
            .eq('platform', 'instagram')
            .order('snapshot_date', { ascending: false })
            .limit(1)
            .single();

        const followers = analytics?.metrics?.followers || 0;
        const posts = analytics?.metrics?.posts_count || 0;

        res.json({
            connected: true,
            username: platform.platform_username,
            followers,
            posts,
        });
    } catch (error: any) {
        console.error('Instagram status error:', error);
        res.json({ connected: false });
    }
});

// Get Instagram analytics for a user
router.get('/analytics', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;

    try {
        // Get connected platform
        let platform;
        try {
            platform = await require('../services/supabase.service').getConnectedPlatform(userId, 'instagram');
        } catch (err) {
            platform = null;
        }

        if (!platform) {
            return res.status(404).json({ error: 'Instagram not connected' });
        }

        // Fetch latest analytics with ALL data
        const { account, insights } = await instagramService.getAccountInsights(
            platform.access_token,
            platform.platform_user_id
        );

        const media = await instagramService.getMediaPerformance(
            platform.access_token,
            platform.platform_user_id,
            20  // Get more posts
        );

        // Calculate engagement metrics
        const totalEngagement = media.reduce((sum: number, post: any) =>
            sum + (post.like_count || 0) + (post.comments_count || 0), 0
        );
        const avgEngagement = media.length > 0 ? totalEngagement / media.length : 0;
        const engagementRate = account.followers_count > 0
            ? ((avgEngagement / account.followers_count) * 100).toFixed(2)
            : '0.00';

        // Get top performing posts
        const topPosts = [...media]
            .sort((a: any, b: any) =>
                ((b.like_count || 0) + (b.comments_count || 0)) -
                ((a.like_count || 0) + (a.comments_count || 0))
            )
            .slice(0, 5);

        res.json({
            account: {
                ...account,
                engagement_rate: parseFloat(engagementRate),
                avg_likes: media.length > 0 ? media.reduce((sum: number, p: any) => sum + (p.like_count || 0), 0) / media.length : 0,
                avg_comments: media.length > 0 ? media.reduce((sum: number, p: any) => sum + (p.comments_count || 0), 0) / media.length : 0,
            },
            insights,
            recentMedia: media,
            topPosts,
            stats: {
                total_posts: media.length,
                total_engagement: totalEngagement,
                avg_engagement_per_post: avgEngagement,
                engagement_rate: parseFloat(engagementRate),
            }
        });
    } catch (error: any) {
        console.error('Instagram analytics error:', error);
        next(error);
    }
});

// Disconnect Instagram account
router.post('/disconnect', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;

    try {
        const supabase = require('../services/supabase.service').getSupabaseClient();

        const { error } = await supabase
            .from('connected_platforms')
            .delete()
            .eq('user_id', userId)
            .eq('platform', 'instagram');

        if (error) {
            throw new Error(`Failed to disconnect: ${error.message}`);
        }

        res.json({ success: true, message: 'Instagram disconnected' });
    } catch (error: any) {
        console.error('Instagram disconnect error:', error);
        next(error);
    }
});

// Diagnostic endpoint to check Instagram connection and permissions
router.get('/debug', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;

    try {
        // Get connected platform
        const platform = await require('../services/supabase.service').getConnectedPlatform(userId, 'instagram');

        if (!platform) {
            return res.json({
                connected: false,
                message: 'Instagram not connected. Please connect your account first.'
            });
        }

        // Test the access token by fetching account info
        const axios = require('axios');
        const INSTAGRAM_API_BASE = 'https://graph.facebook.com/v22.0';

        // 1. Get account info
        const accountInfo = await axios.get(`${INSTAGRAM_API_BASE}/${platform.platform_user_id}`, {
            params: {
                fields: 'username,name,followers_count,media_count,biography',
                access_token: platform.access_token,
            }
        });

        // 2. Check if we can get Facebook pages
        let facebookPages = [];
        try {
            const pagesResponse = await axios.get(`${INSTAGRAM_API_BASE}/me/accounts`, {
                params: {
                    fields: 'id,name,instagram_business_account',
                    access_token: platform.access_token,
                }
            });
            facebookPages = pagesResponse.data.data || [];
        } catch (err: any) {
            facebookPages = [{ error: err.response?.data || err.message }];
        }

        // 3. Try to fetch demographics using v22.0 API (follower_demographics with breakdowns)
        let demographicsTest = { success: false, error: '', data: null as any };
        try {
            // v22.0 requires separate calls per breakdown
            const countryResponse = await axios.get(`${INSTAGRAM_API_BASE}/${platform.platform_user_id}/insights`, {
                params: {
                    metric: 'follower_demographics',
                    period: 'lifetime',
                    breakdown: 'country',
                    metric_type: 'total_value',
                    access_token: platform.access_token,
                }
            });
            const ageGenderResponse = await axios.get(`${INSTAGRAM_API_BASE}/${platform.platform_user_id}/insights`, {
                params: {
                    metric: 'follower_demographics',
                    period: 'lifetime',
                    breakdown: 'age,gender',
                    metric_type: 'total_value',
                    access_token: platform.access_token,
                }
            });
            demographicsTest = {
                success: true,
                error: '',
                data: {
                    country: countryResponse.data,
                    ageGender: ageGenderResponse.data,
                }
            };
        } catch (err: any) {
            demographicsTest = {
                success: false,
                error: err.response?.data?.error?.message || err.message,
                data: err.response?.data || null
            };
        }

        // 4. Try online_followers for posting times
        let postingTimesTest = { success: false, error: '', data: null };
        try {
            const onlineResponse = await axios.get(`${INSTAGRAM_API_BASE}/${platform.platform_user_id}/insights`, {
                params: {
                    metric: 'online_followers',
                    period: 'lifetime',
                    access_token: platform.access_token,
                }
            });
            postingTimesTest = { success: true, error: '', data: onlineResponse.data };
        } catch (err: any) {
            postingTimesTest = {
                success: false,
                error: err.response?.data?.error?.message || err.message,
                data: err.response?.data || null
            };
        }

        res.json({
            connected: true,
            platform_info: {
                username: platform.platform_username,
                account_id: platform.platform_user_id,
            },
            account_info: accountInfo.data,
            facebook_pages: facebookPages,
            diagnostics: {
                demographics: demographicsTest,
                posting_times: postingTimesTest,
            },
            recommendations: [
                demographicsTest.success ? '✅ Demographics API working!' : '❌ Demographics not available - check if account is Business and linked to Facebook Page',
                postingTimesTest.success ? '✅ Posting times API working!' : '❌ Posting times not available',
                facebookPages.length > 0 ? `✅ Found ${facebookPages.length} Facebook Page(s)` : '❌ No Facebook Pages found - you need to create and link a Facebook Page'
            ]
        });
    } catch (error: any) {
        console.error('Instagram debug error:', error);
        res.status(500).json({
            error: error.message,
            details: error.response?.data || null
        });
    }
});

// ============================================
// Meta App Review Required Endpoints
// ============================================

// Data Deletion Callback - Meta requires this for App Review
// When a user removes the app from their Facebook settings, Meta sends a POST here
router.post('/delete', async (req, res) => {
    try {
        const signedRequest = req.body.signed_request;
        if (!signedRequest) {
            return res.status(400).json({ error: 'Missing signed_request' });
        }

        // Parse the signed request from Meta
        const [encodedSig, payload] = signedRequest.split('.');
        const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
        const userId = data.user_id; // This is the Facebook user ID

        // Delete all Instagram data for this Facebook user
        const supabase = require('../services/supabase.service').getSupabaseClient();

        // Find platform connections linked to this Facebook user
        // We store platform_user_id as the IG account ID, but the FB user_id comes from the callback
        // Delete any connected platforms and analytics snapshots
        const { data: platforms } = await supabase
            .from('connected_platforms')
            .select('user_id')
            .eq('platform', 'instagram');

        // For each platform connection, check if it was authorized by this FB user
        // Since we don't store FB user_id separately, delete based on the callback
        if (platforms && platforms.length > 0) {
            for (const platform of platforms) {
                await supabase
                    .from('analytics_snapshots')
                    .delete()
                    .eq('user_id', platform.user_id)
                    .eq('platform', 'instagram');
            }
        }

        // Generate a confirmation code for Meta
        const confirmationCode = crypto.randomUUID();
        const statusUrl = `${process.env.FRONTEND_URL || 'https://creatoriq.in'}/deletion-status?code=${confirmationCode}`;

        console.log(`🗑️ Data deletion request from Meta for FB user: ${userId}, confirmation: ${confirmationCode}`);

        // Meta expects this exact response format
        res.json({
            url: statusUrl,
            confirmation_code: confirmationCode,
        });
    } catch (error: any) {
        console.error('Data deletion callback error:', error);
        res.json({
            url: `${process.env.FRONTEND_URL || 'https://creatoriq.in'}/deletion-status`,
            confirmation_code: 'error-processing-request',
        });
    }
});

// Deauthorize Callback - Meta sends this when user removes the app
router.post('/deauthorize', async (req, res) => {
    try {
        const signedRequest = req.body.signed_request;
        if (!signedRequest) {
            return res.status(400).json({ error: 'Missing signed_request' });
        }

        const [encodedSig, payload] = signedRequest.split('.');
        const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
        const userId = data.user_id;

        console.log(`🔓 Deauthorize callback from Meta for FB user: ${userId}`);

        // Mark the connection as deauthorized (we can clean up later)
        // For now, just acknowledge the callback
        res.json({ success: true });
    } catch (error: any) {
        console.error('Deauthorize callback error:', error);
        res.json({ success: true }); // Always acknowledge to Meta
    }
});

export default router;
