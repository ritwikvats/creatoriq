"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const competitor_service_1 = require("../services/competitor.service");
const ai_service_1 = require("../services/ai.service");
const supabase_service_1 = require("../services/supabase.service");
const router = (0, express_1.Router)();
/**
 * GET /competitors/lookup?platform=instagram&username=xyz
 * Look up a competitor's public profile
 */
router.get('/lookup', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { platform, username } = req.query;
        if (!platform || !username) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: platform and username',
            });
        }
        const platformStr = platform.toLowerCase();
        const usernameStr = username;
        if (platformStr !== 'instagram' && platformStr !== 'youtube') {
            return res.status(400).json({
                success: false,
                error: 'Platform must be "instagram" or "youtube"',
            });
        }
        let profile;
        if (platformStr === 'instagram') {
            // Get user's Instagram connection
            const connection = await (0, supabase_service_1.getConnectedPlatform)(userId, 'instagram');
            if (!connection || !connection.access_token) {
                return res.status(400).json({
                    success: false,
                    error: 'Connect your Instagram account first to look up competitors.',
                });
            }
            profile = await competitor_service_1.competitorService.lookupInstagram(connection.access_token, connection.platform_user_id, usernameStr);
        }
        else {
            // YouTube
            const connection = await (0, supabase_service_1.getConnectedPlatform)(userId, 'youtube');
            if (!connection || !connection.access_token) {
                return res.status(400).json({
                    success: false,
                    error: 'Connect your YouTube account first to look up competitors.',
                });
            }
            profile = await competitor_service_1.competitorService.lookupYouTube(connection.access_token, usernameStr);
        }
        res.json({ success: true, profile });
    }
    catch (error) {
        console.error('Competitor lookup error:', error.message);
        res.status(error.message?.includes('not found') || error.message?.includes('private') ? 404 : 500).json({
            success: false,
            error: error.message || 'Failed to look up competitor',
        });
    }
});
/**
 * POST /competitors/compare
 * Compare user's stats with a competitor
 * Body: { platform, competitorUsername }
 */
router.post('/compare', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { platform, competitorUsername } = req.body;
        if (!platform || !competitorUsername) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: platform and competitorUsername',
            });
        }
        const connection = await (0, supabase_service_1.getConnectedPlatform)(userId, platform);
        if (!connection || !connection.access_token) {
            return res.status(400).json({
                success: false,
                error: `Connect your ${platform} account first.`,
            });
        }
        // Get user's own stats from latest snapshot
        const { data: snapshot } = await supabase_service_1.supabase
            .from('analytics_snapshots')
            .select('metrics')
            .eq('user_id', userId)
            .eq('platform', platform)
            .order('snapshot_date', { ascending: false })
            .limit(1)
            .single();
        let userProfile = {
            platform,
            username: connection.platform_username || 'You',
            displayName: 'You',
        };
        if (snapshot?.metrics) {
            const m = snapshot.metrics;
            userProfile = {
                ...userProfile,
                followers: m.followers || m.subscribers || 0,
                postsCount: m.posts || m.total_videos || m.videos || 0,
                engagementRate: m.engagement_rate || m.avg_engagement_rate || 0,
                avgLikes: m.avg_likes || 0,
                avgComments: m.avg_comments || 0,
            };
        }
        // Get competitor stats
        let competitorProfile;
        if (platform === 'instagram') {
            competitorProfile = await competitor_service_1.competitorService.lookupInstagram(connection.access_token, connection.platform_user_id, competitorUsername);
        }
        else {
            competitorProfile = await competitor_service_1.competitorService.lookupYouTube(connection.access_token, competitorUsername);
        }
        // Build comparison metrics
        const metrics = [
            {
                metric: 'Followers',
                you: userProfile.followers || 0,
                competitor: competitorProfile.followers,
                unit: '',
            },
            {
                metric: 'Engagement Rate',
                you: userProfile.engagementRate || 0,
                competitor: competitorProfile.engagementRate,
                unit: '%',
            },
            {
                metric: 'Avg Likes',
                you: userProfile.avgLikes || 0,
                competitor: competitorProfile.avgLikes,
                unit: '',
            },
            {
                metric: 'Avg Comments',
                you: userProfile.avgComments || 0,
                competitor: competitorProfile.avgComments,
                unit: '',
            },
            {
                metric: 'Total Posts',
                you: userProfile.postsCount || 0,
                competitor: competitorProfile.postsCount,
                unit: '',
            },
            {
                metric: 'Posts/Week',
                you: 0,
                competitor: competitorProfile.postsPerWeek,
                unit: '',
            },
        ];
        res.json({
            success: true,
            user: userProfile,
            competitor: competitorProfile,
            metrics,
        });
    }
    catch (error) {
        console.error('Competitor compare error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to compare',
        });
    }
});
/**
 * POST /competitors/gap-analysis
 * Generate AI-powered gap analysis
 * Body: { platform, competitorUsername }
 */
router.post('/gap-analysis', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { platform, competitorUsername, userStats, competitorStats } = req.body;
        if (!platform || !competitorUsername) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: platform and competitorUsername',
            });
        }
        // Use provided stats or fetch fresh ones
        let user = userStats;
        let competitor = competitorStats;
        if (!user || !competitor) {
            const connection = await (0, supabase_service_1.getConnectedPlatform)(userId, platform);
            if (!connection || !connection.access_token) {
                return res.status(400).json({
                    success: false,
                    error: `Connect your ${platform} account first.`,
                });
            }
            // Get user stats from snapshot
            const { data: snapshot } = await supabase_service_1.supabase
                .from('analytics_snapshots')
                .select('metrics')
                .eq('user_id', userId)
                .eq('platform', platform)
                .order('snapshot_date', { ascending: false })
                .limit(1)
                .single();
            if (!user && snapshot?.metrics) {
                const m = snapshot.metrics;
                user = {
                    username: connection.platform_username || 'You',
                    followers: m.followers || m.subscribers || 0,
                    engagementRate: m.engagement_rate || m.avg_engagement_rate || 0,
                    avgLikes: m.avg_likes || 0,
                    avgComments: m.avg_comments || 0,
                    postsCount: m.posts || m.total_videos || 0,
                    postsPerWeek: 0,
                };
            }
            if (!competitor) {
                if (platform === 'instagram') {
                    competitor = await competitor_service_1.competitorService.lookupInstagram(connection.access_token, connection.platform_user_id, competitorUsername);
                }
                else {
                    competitor = await competitor_service_1.competitorService.lookupYouTube(connection.access_token, competitorUsername);
                }
            }
        }
        // Generate AI gap analysis
        const analysis = await ai_service_1.aiService.generateCompetitorAnalysis(platform, user, competitor);
        res.json({ success: true, analysis });
    }
    catch (error) {
        console.error('Gap analysis error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate gap analysis',
        });
    }
});
/**
 * GET /competitors/saved
 * Get saved competitors for the user
 */
router.get('/saved', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { data, error } = await supabase_service_1.supabase
            .from('saved_competitors')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        res.json({ success: true, competitors: data || [] });
    }
    catch (error) {
        console.error('Get saved competitors error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get saved competitors',
        });
    }
});
/**
 * POST /competitors/saved
 * Save a competitor for quick re-comparison
 * Body: { platform, username, displayName, followers, profilePicture }
 */
router.post('/saved', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { platform, username, displayName, followers, profilePicture } = req.body;
        if (!platform || !username) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: platform and username',
            });
        }
        const { data, error } = await supabase_service_1.supabase
            .from('saved_competitors')
            .upsert({
            user_id: userId,
            platform,
            username,
            display_name: displayName || username,
            followers: followers || 0,
            profile_picture: profilePicture || '',
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id,platform,username',
        })
            .select()
            .single();
        if (error)
            throw error;
        res.json({ success: true, competitor: data });
    }
    catch (error) {
        console.error('Save competitor error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to save competitor',
        });
    }
});
/**
 * DELETE /competitors/saved/:id
 * Remove a saved competitor
 */
router.delete('/saved/:id', auth_middleware_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { error } = await supabase_service_1.supabase
            .from('saved_competitors')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error)
            throw error;
        res.json({ success: true });
    }
    catch (error) {
        console.error('Delete saved competitor error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to delete competitor',
        });
    }
});
exports.default = router;
