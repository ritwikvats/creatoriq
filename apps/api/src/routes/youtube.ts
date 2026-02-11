import { Router } from 'express';
import crypto from 'crypto';
import { youtubeService } from '../services/youtube.service';
import { getSupabaseClient, saveConnectedPlatform, saveAnalyticsSnapshot } from '../services/supabase.service';
import { encryptionService } from '../services/encryption.service';
import { requireAuth } from '../middleware/auth.middleware';
import { APIError } from '../middleware/error-handler';

const router = Router();

/**
 * GET /youtube/auth
 * Get YouTube OAuth URL for authenticated user
 * Requires authentication
 */
router.get('/auth', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user!.id;

        // Generate signed state token to prevent CSRF and account linking attacks
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not configured');
        }
        const expiry = Date.now() + 10 * 60 * 1000; // 10 min
        const payload = `${userId}:youtube:${expiry}`;
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
        const stateToken = Buffer.from(`${payload}:${signature}`).toString('base64url');

        const authUrl = youtubeService.getAuthUrl();
        const urlWithState = `${authUrl}&state=${stateToken}`;

        res.json({ authUrl: urlWithState });
    } catch (error: any) {
        console.error('YouTube auth error:', error);
        next(error);
    }
});

/**
 * GET /youtube/callback
 * Handle OAuth callback from Google
 */
router.get('/callback', async (req, res) => {
    const { code, state } = req.query;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3004';

    if (!code) {
        return res.redirect(`${frontendUrl}/dashboard?error=no_code`);
    }

    if (!state) {
        return res.redirect(`${frontendUrl}/dashboard?error=no_state`);
    }

    // Verify the signed state token to prevent CSRF/account linking attacks
    let userId: string;
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET not configured');
        const decoded = Buffer.from(state as string, 'base64url').toString();
        const parts = decoded.split(':');
        if (parts.length !== 4) throw new Error('Invalid state format');
        const [uid, purpose, expiry, sig] = parts;
        if (purpose !== 'youtube') throw new Error('Wrong purpose');
        if (Date.now() > parseInt(expiry)) throw new Error('State expired');
        const expected = crypto.createHmac('sha256', secret).update(`${uid}:${purpose}:${expiry}`).digest('hex');
        if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) throw new Error('Invalid signature');
        userId = uid;
    } catch (err) {
        return res.redirect(`${frontendUrl}/dashboard?error=invalid_state`);
    }

    try {
        // Exchange authorization code for tokens
        const tokens = await youtubeService.exchangeCodeForTokens(code as string);

        if (!tokens.access_token) {
            throw new Error('No access token received');
        }

        // Get channel information
        const channelStats = await youtubeService.getChannelStats(tokens.access_token);

        // Get user email
        const userInfo = await youtubeService.getUserInfo(tokens.access_token);

        // Save to Supabase connected_platforms table (with token encryption)
        const supabase = getSupabaseClient();

        // 🔍 ENSURE USER EXISTS IN OUR USERS TABLE FIRST
        // This fixes the foreign key violation for users missing from public.users
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('id', userId)
            .single();

        if (!existingUser) {
            console.log('👤 Profile missing for user, creating now:', userId);
            await supabase.from('users').insert({
                id: userId,
                email: userInfo.email || 'unknown@example.com',
                full_name: userInfo.name || 'Anonymous Creator',
            });
        }

        // Use saveConnectedPlatform which encrypts access tokens before saving
        try {
            await saveConnectedPlatform({
                user_id: userId,
                platform: 'youtube',
                platform_user_id: channelStats.channelId,
                platform_username: channelStats.channelName,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token || null,
                token_expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
                last_synced_at: new Date().toISOString(),
            });
        } catch (saveError: any) {
            console.error('Supabase error:', saveError);
            throw new Error(`Database error: ${saveError.message}`);
        }

        // Save initial analytics snapshot
        try {
            await saveAnalyticsSnapshot({
                user_id: userId,
                platform: 'youtube',
                snapshot_date: new Date().toISOString().split('T')[0],
                metrics: {
                    subscribers: channelStats.subscriberCount,
                    views: channelStats.totalViews,
                    videos: channelStats.totalVideos,
                    channelName: channelStats.channelName,
                },
            });
        } catch (snapshotError: any) {
            console.warn('Failed to save analytics snapshot:', snapshotError.message);
            // Don't fail the whole flow if snapshot fails
        }

        // Redirect to dashboard with success message
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?youtube=connected`);
    } catch (error: any) {
        console.error('YouTube callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=youtube_failed`);
    }
});

/**
 * GET /youtube/stats
 * Get YouTube channel statistics for authenticated user
 */
router.get('/stats', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;

    try {
        const supabase = getSupabaseClient();

        // Get connected platform
        const { data: platform, error } = await supabase
            .from('connected_platforms')
            .select('*')
            .eq('user_id', userId)
            .eq('platform', 'youtube')
            .single();

        if (error || !platform) {
            return res.json({
                error: 'YouTube not connected',
                connected: false,
            });
        }

        // Decrypt tokens from database
        let accessToken = encryptionService.safeDecrypt(platform.access_token);
        const refreshToken = platform.refresh_token ? encryptionService.safeDecrypt(platform.refresh_token) : null;

        if (platform.token_expires_at) {
            const expiryTime = new Date(platform.token_expires_at).getTime();
            const now = Date.now();

            // Refresh if token expires in less than 5 minutes
            if (expiryTime - now < 5 * 60 * 1000 && refreshToken) {
                try {
                    const newTokens = await youtubeService.refreshAccessToken(refreshToken);
                    accessToken = newTokens.access_token || accessToken;

                    // Update encrypted tokens in database
                    await supabase
                        .from('connected_platforms')
                        .update({
                            access_token: encryptionService.encrypt(newTokens.access_token!),
                            token_expires_at: newTokens.expiry_date ? new Date(newTokens.expiry_date).toISOString() : null,
                        })
                        .eq('id', platform.id);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    // Continue with old token, might still work
                }
            }
        }

        // Fetch latest channel stats
        const channelStats = await youtubeService.getChannelStats(accessToken);
        console.log('📺 YouTube /stats response - subscribers:', channelStats.subscriberCount,
            'views:', channelStats.totalViews, 'videos:', channelStats.totalVideos,
            'channel:', channelStats.channelName);

        // Fetch recent videos
        const recentVideos = await youtubeService.getRecentVideos(accessToken, channelStats.channelId, 10);
        console.log('📺 Recent videos count:', recentVideos.length);

        // Fetch estimated revenue
        const estimatedRevenue = await youtubeService.getChannelRevenue(accessToken, channelStats.channelId);

        // Calculate analytics
        const analytics = youtubeService.calculateAnalytics(channelStats, recentVideos);

        // Update last_synced_at
        await supabase
            .from('connected_platforms')
            .update({ last_synced_at: new Date().toISOString() })
            .eq('id', platform.id);

        res.json({
            connected: true,
            channel: channelStats,
            recentVideos: recentVideos,
            revenue: estimatedRevenue,
            analytics: analytics,
        });
    } catch (error: any) {
        console.error('YouTube stats error:', error);
        next(error);
    }
});

/**
 * POST /youtube/disconnect
 * Disconnect YouTube account for authenticated user
 */
router.post('/disconnect', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;

    try {
        const supabase = getSupabaseClient();

        const { error } = await supabase
            .from('connected_platforms')
            .delete()
            .eq('user_id', userId)
            .eq('platform', 'youtube');

        if (error) {
            throw new Error(`Failed to disconnect: ${error.message}`);
        }

        res.json({ success: true, message: 'YouTube disconnected' });
    } catch (error: any) {
        console.error('YouTube disconnect error:', error);
        next(error);
    }
});

/**
 * GET /youtube/status
 * Check if YouTube is connected for authenticated user
 */
router.get('/status', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;

    try {
        const supabase = getSupabaseClient();

        const { data: platform, error } = await supabase
            .from('connected_platforms')
            .select('platform_username, last_synced_at')
            .eq('user_id', userId)
            .eq('platform', 'youtube')
            .single();

        if (error || !platform) {
            return res.json({ connected: false });
        }

        res.json({
            connected: true,
            channelName: platform.platform_username,
            lastSynced: platform.last_synced_at,
        });
    } catch (error: any) {
        console.error('YouTube status error:', error);
        res.json({ connected: false });
    }
});

export default router;
