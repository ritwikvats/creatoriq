import { Router } from 'express';
import { youtubeService } from '../services/youtube.service';
import { getSupabaseClient } from '../services/supabase.service';

const router = Router();

/**
 * GET /youtube/auth
 * Start YouTube OAuth flow - redirect user to Google consent screen
 */
router.get('/auth', async (req, res) => {
    try {
        let userId = req.query.userId as string;

        if (!userId) {
            // For testing: use test UUID
            userId = '00000000-0000-0000-0000-000000000001';
            console.log('⚠️ No userId provided for YouTube auth, using test UUID');
        }

        // Generate OAuth URL with state parameter
        const authUrl = youtubeService.getAuthUrl();
        const urlWithState = `${authUrl}&state=${userId}`;

        // Redirect to Google OAuth
        res.redirect(urlWithState);
    } catch (error: any) {
        console.error('YouTube auth error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /youtube/callback
 * Handle OAuth callback from Google
 */
router.get('/callback', async (req, res) => {
    const { code, state } = req.query;
    const userId = state as string;

    if (!code) {
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=no_code`);
    }

    if (!userId) {
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=no_user`);
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

        // Save to Supabase connected_platforms table
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

        const { error } = await supabase
            .from('connected_platforms')
            .upsert({
                user_id: userId,
                platform: 'youtube',
                platform_user_id: channelStats.channelId,
                platform_username: channelStats.channelName,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token || null,
                token_expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
                last_synced_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,platform',
            });

        if (error) {
            console.error('Supabase error:', error);
            throw new Error(`Database error: ${error.message}`);
        }

        // Save initial analytics snapshot
        const { error: snapshotError } = await supabase
            .from('analytics_snapshots')
            .insert({
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

        if (snapshotError) {
            console.warn('Failed to save analytics snapshot:', snapshotError);
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
 * GET /youtube/stats/:userId
 * Get YouTube channel statistics for a user
 */
router.get('/stats/:userId', async (req, res) => {
    const { userId } = req.params;

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
            return res.status(404).json({
                error: 'YouTube not connected',
                connected: false,
            });
        }

        // Check if token is still valid or needs refresh
        let accessToken = platform.access_token;

        if (platform.token_expires_at) {
            const expiryTime = new Date(platform.token_expires_at).getTime();
            const now = Date.now();

            // Refresh if token expires in less than 5 minutes
            if (expiryTime - now < 5 * 60 * 1000 && platform.refresh_token) {
                try {
                    const newTokens = await youtubeService.refreshAccessToken(platform.refresh_token);
                    accessToken = newTokens.access_token || accessToken;

                    // Update tokens in database
                    await supabase
                        .from('connected_platforms')
                        .update({
                            access_token: newTokens.access_token,
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

        // Fetch recent videos
        const recentVideos = await youtubeService.getRecentVideos(accessToken, channelStats.channelId, 10);

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
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /youtube/disconnect/:userId
 * Disconnect YouTube account
 */
router.post('/disconnect/:userId', async (req, res) => {
    const { userId } = req.params;

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
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /youtube/status/:userId
 * Check if YouTube is connected for a user
 */
router.get('/status/:userId', async (req, res) => {
    const { userId } = req.params;

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
