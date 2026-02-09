import * as youtubeService from '../services/youtube.service';
import * as instagramService from '../services/instagram.service';
import { getSupabaseClient, saveAnalyticsSnapshot } from '../services/supabase.service';

/**
 * Fetch and save analytics snapshots for all connected platforms
 * This job should run daily to build historical data
 */
export async function captureAnalyticsSnapshots() {
    console.log('📊 Starting daily analytics snapshot capture...');
    const startTime = Date.now();
    const supabase = getSupabaseClient();

    try {
        // Get all connected platforms
        const { data: connectedPlatforms, error } = await supabase
            .from('connected_platforms')
            .select('*');

        if (error) {
            throw new Error(`Failed to fetch connected platforms: ${error.message}`);
        }

        if (!connectedPlatforms || connectedPlatforms.length === 0) {
            console.log('⚠️ No connected platforms found');
            return;
        }

        console.log(`📱 Found ${connectedPlatforms.length} connected platform(s)`);

        let successCount = 0;
        let errorCount = 0;

        // Process each connected platform
        for (const platform of connectedPlatforms) {
            try {
                if (platform.platform === 'youtube') {
                    await captureYouTubeSnapshot(platform);
                    successCount++;
                } else if (platform.platform === 'instagram') {
                    await captureInstagramSnapshot(platform);
                    successCount++;
                }
            } catch (err: any) {
                console.error(`❌ Failed to capture snapshot for ${platform.platform} (${platform.platform_username}):`, err.message);
                errorCount++;
            }
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✅ Analytics snapshot complete: ${successCount} success, ${errorCount} errors (${duration}s)`);
    } catch (error: any) {
        console.error('❌ Analytics snapshot job failed:', error.message);
        throw error;
    }
}

/**
 * Capture YouTube analytics snapshot
 */
async function captureYouTubeSnapshot(platform: any) {
    console.log(`🎥 Capturing YouTube snapshot for ${platform.platform_username}...`);

    try {
        // Fetch current YouTube stats
        const channelStats = await youtubeService.getChannelAnalytics(platform.access_token);

        const recentVideos = await youtubeService.getVideoPerformance(platform.access_token, 10);

        // Calculate engagement metrics
        // Note: youtube service returns { views, likes, comments } as numbers
        const totalViews = recentVideos.reduce((sum: number, video: any) =>
            sum + (video.views || 0), 0);
        const totalLikes = recentVideos.reduce((sum: number, video: any) =>
            sum + (video.likes || 0), 0);
        const totalComments = recentVideos.reduce((sum: number, video: any) =>
            sum + (video.comments || 0), 0);

        const avgEngagementRate = recentVideos.length > 0 && channelStats.subscriberCount > 0
            ? ((totalLikes + totalComments) / recentVideos.length / parseInt(String(channelStats.subscriberCount || '0'))) * 100
            : 0;

        // Save snapshot
        await saveAnalyticsSnapshot({
            user_id: platform.user_id,
            platform: 'youtube',
            snapshot_date: new Date().toISOString().split('T')[0],
            metrics: {
                subscribers: parseInt(String(channelStats.subscriberCount || '0')),
                total_views: parseInt(String(channelStats.totalViews || '0')),
                total_videos: parseInt(String(channelStats.totalVideos || '0')),
                recent_videos_count: recentVideos.length,
                avg_engagement_rate: parseFloat(avgEngagementRate.toFixed(4)),
                total_likes: totalLikes,
                total_comments: totalComments,
            },
        });

        console.log(`✅ YouTube snapshot saved: ${channelStats.subscriberCount} subscribers`);
    } catch (error: any) {
        console.error(`❌ YouTube snapshot failed:`, error.message);
        throw error;
    }
}

/**
 * Capture Instagram analytics snapshot
 */
async function captureInstagramSnapshot(platform: any) {
    console.log(`📸 Capturing Instagram snapshot for ${platform.platform_username}...`);

    try {
        // Fetch current Instagram stats
        const { account, insights } = await instagramService.getAccountInsights(
            platform.access_token,
            platform.platform_user_id
        );

        const media = await instagramService.getMediaPerformance(
            platform.access_token,
            platform.platform_user_id,
            20
        );

        // Calculate engagement metrics
        const totalEngagement = media.reduce((sum: number, post: any) =>
            sum + (post.like_count || 0) + (post.comments_count || 0), 0);
        const avgEngagement = media.length > 0 ? totalEngagement / media.length : 0;
        const engagementRate = account.followers_count > 0
            ? (avgEngagement / account.followers_count) * 100
            : 0;

        // Extract insights data
        const insightsData: any = {};
        if (insights && insights.length > 0) {
            insights.forEach((insight: any) => {
                if (insight.values && insight.values.length > 0) {
                    // Get the most recent value
                    const latestValue = insight.values[insight.values.length - 1];
                    insightsData[insight.name] = latestValue.value;
                }
            });
        }

        // Save snapshot
        await saveAnalyticsSnapshot({
            user_id: platform.user_id,
            platform: 'instagram',
            snapshot_date: new Date().toISOString().split('T')[0],
            metrics: {
                followers: account.followers_count,
                following: account.follows_count,
                posts_count: account.media_count,
                engagement_rate: parseFloat(engagementRate.toFixed(4)),
                avg_likes: media.length > 0 ? media.reduce((sum: number, p: any) => sum + (p.like_count || 0), 0) / media.length : 0,
                avg_comments: media.length > 0 ? media.reduce((sum: number, p: any) => sum + (p.comments_count || 0), 0) / media.length : 0,
                total_engagement: totalEngagement,
                insights: insightsData,
            },
        });

        console.log(`✅ Instagram snapshot saved: ${account.followers_count} followers`);
    } catch (error: any) {
        console.error(`❌ Instagram snapshot failed:`, error.message);
        throw error;
    }
}

/**
 * Schedule analytics snapshots to run daily
 * Returns the interval ID for cleanup
 */
export function scheduleAnalyticsSnapshots(): NodeJS.Timeout {
    console.log('🕐 Scheduling daily analytics snapshots...');

    // Run immediately on startup
    setTimeout(() => {
        captureAnalyticsSnapshots().catch(err => {
            console.error('❌ Initial analytics snapshot failed:', err);
        });
    }, 5000); // Wait 5 seconds after server starts

    // Then run daily at 2 AM
    const interval = setInterval(() => {
        const now = new Date();
        if (now.getHours() === 2 && now.getMinutes() === 0) {
            captureAnalyticsSnapshots().catch(err => {
                console.error('❌ Scheduled analytics snapshot failed:', err);
            });
        }
    }, 60000); // Check every minute

    console.log('✅ Analytics snapshot scheduler started (runs daily at 2 AM)');
    return interval;
}
