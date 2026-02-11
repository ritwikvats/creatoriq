import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { competitorService, CompetitorProfile } from '../services/competitor.service';
import { aiService } from '../services/ai.service';
import { getConnectedPlatform, supabase } from '../services/supabase.service';

const router = Router();

/**
 * GET /competitors/lookup?platform=instagram&username=xyz
 * Look up a competitor's public profile
 */
router.get('/lookup', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { platform, username } = req.query;

        if (!platform || !username) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters: platform and username',
            });
        }

        const platformStr = (platform as string).toLowerCase();
        const usernameStr = username as string;

        if (platformStr !== 'instagram' && platformStr !== 'youtube') {
            return res.status(400).json({
                success: false,
                error: 'Platform must be "instagram" or "youtube"',
            });
        }

        let profile: CompetitorProfile;

        if (platformStr === 'instagram') {
            // Get user's Instagram connection
            const connection = await getConnectedPlatform(userId, 'instagram');
            if (!connection || !connection.access_token) {
                return res.status(400).json({
                    success: false,
                    error: 'Connect your Instagram account first to look up competitors.',
                });
            }

            profile = await competitorService.lookupInstagram(
                connection.access_token,
                connection.platform_user_id,
                usernameStr
            );
        } else {
            // YouTube
            const connection = await getConnectedPlatform(userId, 'youtube');
            if (!connection || !connection.access_token) {
                return res.status(400).json({
                    success: false,
                    error: 'Connect your YouTube account first to look up competitors.',
                });
            }

            profile = await competitorService.lookupYouTube(
                connection.access_token,
                usernameStr
            );
        }

        res.json({ success: true, profile });
    } catch (error: any) {
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
router.post('/compare', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { platform, competitorUsername } = req.body;

        if (!platform || !competitorUsername) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: platform and competitorUsername',
            });
        }

        const connection = await getConnectedPlatform(userId, platform);
        if (!connection || !connection.access_token) {
            return res.status(400).json({
                success: false,
                error: `Connect your ${platform} account first.`,
            });
        }

        // Get user's own stats from latest snapshot
        const { data: snapshot } = await supabase
            .from('analytics_snapshots')
            .select('metrics')
            .eq('user_id', userId)
            .eq('platform', platform)
            .order('snapshot_date', { ascending: false })
            .limit(1)
            .single();

        let userProfile: any = {
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
        let competitorProfile: CompetitorProfile;
        if (platform === 'instagram') {
            competitorProfile = await competitorService.lookupInstagram(
                connection.access_token,
                connection.platform_user_id,
                competitorUsername
            );
        } else {
            competitorProfile = await competitorService.lookupYouTube(
                connection.access_token,
                competitorUsername
            );
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
    } catch (error: any) {
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
router.post('/gap-analysis', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
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
            const connection = await getConnectedPlatform(userId, platform);
            if (!connection || !connection.access_token) {
                return res.status(400).json({
                    success: false,
                    error: `Connect your ${platform} account first.`,
                });
            }

            // Get user stats from snapshot
            const { data: snapshot } = await supabase
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
                    competitor = await competitorService.lookupInstagram(
                        connection.access_token,
                        connection.platform_user_id,
                        competitorUsername
                    );
                } else {
                    competitor = await competitorService.lookupYouTube(
                        connection.access_token,
                        competitorUsername
                    );
                }
            }
        }

        // Generate AI gap analysis
        const analysis = await aiService.generateCompetitorAnalysis(
            platform,
            user,
            competitor
        );

        res.json({ success: true, analysis });
    } catch (error: any) {
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
router.get('/saved', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        const { data, error } = await supabase
            .from('saved_competitors')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, competitors: data || [] });
    } catch (error: any) {
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
router.post('/saved', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { platform, username, displayName, followers, profilePicture } = req.body;

        if (!platform || !username) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: platform and username',
            });
        }

        const { data, error } = await supabase
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

        if (error) throw error;

        res.json({ success: true, competitor: data });
    } catch (error: any) {
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
router.delete('/saved/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params;

        const { error } = await supabase
            .from('saved_competitors')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;

        res.json({ success: true });
    } catch (error: any) {
        console.error('Delete saved competitor error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to delete competitor',
        });
    }
});

export default router;
