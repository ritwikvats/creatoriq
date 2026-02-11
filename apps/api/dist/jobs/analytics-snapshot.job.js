"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureAnalyticsSnapshots = captureAnalyticsSnapshots;
exports.scheduleAnalyticsSnapshots = scheduleAnalyticsSnapshots;
const youtubeService = __importStar(require("../services/youtube.service"));
const instagramService = __importStar(require("../services/instagram.service"));
const supabase_service_1 = require("../services/supabase.service");
/**
 * Fetch and save analytics snapshots for all connected platforms
 * This job should run daily to build historical data
 */
async function captureAnalyticsSnapshots() {
    console.log('📊 Starting daily analytics snapshot capture...');
    const startTime = Date.now();
    const supabase = (0, supabase_service_1.getSupabaseClient)();
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
                }
                else if (platform.platform === 'instagram') {
                    await captureInstagramSnapshot(platform);
                    successCount++;
                }
            }
            catch (err) {
                console.error(`❌ Failed to capture snapshot for ${platform.platform} (${platform.platform_username}):`, err.message);
                errorCount++;
            }
        }
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✅ Analytics snapshot complete: ${successCount} success, ${errorCount} errors (${duration}s)`);
    }
    catch (error) {
        console.error('❌ Analytics snapshot job failed:', error.message);
        throw error;
    }
}
/**
 * Capture YouTube analytics snapshot
 */
async function captureYouTubeSnapshot(platform) {
    console.log(`🎥 Capturing YouTube snapshot for ${platform.platform_username}...`);
    try {
        // Fetch current YouTube stats
        const channelStats = await youtubeService.getChannelAnalytics(platform.access_token);
        const recentVideos = await youtubeService.getVideoPerformance(platform.access_token, 10);
        // Calculate engagement metrics
        // Note: youtube service returns { views, likes, comments } as numbers
        const totalViews = recentVideos.reduce((sum, video) => sum + (video.views || 0), 0);
        const totalLikes = recentVideos.reduce((sum, video) => sum + (video.likes || 0), 0);
        const totalComments = recentVideos.reduce((sum, video) => sum + (video.comments || 0), 0);
        const avgEngagementRate = recentVideos.length > 0 && channelStats.subscriberCount > 0
            ? ((totalLikes + totalComments) / recentVideos.length / parseInt(String(channelStats.subscriberCount || '0'))) * 100
            : 0;
        // Save snapshot
        await (0, supabase_service_1.saveAnalyticsSnapshot)({
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
    }
    catch (error) {
        console.error(`❌ YouTube snapshot failed:`, error.message);
        throw error;
    }
}
/**
 * Capture Instagram analytics snapshot
 */
async function captureInstagramSnapshot(platform) {
    console.log(`📸 Capturing Instagram snapshot for ${platform.platform_username}...`);
    try {
        // Fetch current Instagram stats
        const { account, insights } = await instagramService.getAccountInsights(platform.access_token, platform.platform_user_id);
        const media = await instagramService.getMediaPerformance(platform.access_token, platform.platform_user_id, 20);
        // Calculate engagement metrics
        const totalEngagement = media.reduce((sum, post) => sum + (post.like_count || 0) + (post.comments_count || 0), 0);
        const avgEngagement = media.length > 0 ? totalEngagement / media.length : 0;
        const engagementRate = account.followers_count > 0
            ? (avgEngagement / account.followers_count) * 100
            : 0;
        // Extract insights data
        const insightsData = {};
        if (insights && insights.length > 0) {
            insights.forEach((insight) => {
                if (insight.values && insight.values.length > 0) {
                    // Get the most recent value
                    const latestValue = insight.values[insight.values.length - 1];
                    insightsData[insight.name] = latestValue.value;
                }
            });
        }
        // Save snapshot
        await (0, supabase_service_1.saveAnalyticsSnapshot)({
            user_id: platform.user_id,
            platform: 'instagram',
            snapshot_date: new Date().toISOString().split('T')[0],
            metrics: {
                followers: account.followers_count,
                following: account.follows_count,
                posts_count: account.media_count,
                engagement_rate: parseFloat(engagementRate.toFixed(4)),
                avg_likes: media.length > 0 ? media.reduce((sum, p) => sum + (p.like_count || 0), 0) / media.length : 0,
                avg_comments: media.length > 0 ? media.reduce((sum, p) => sum + (p.comments_count || 0), 0) / media.length : 0,
                total_engagement: totalEngagement,
                insights: insightsData,
            },
        });
        console.log(`✅ Instagram snapshot saved: ${account.followers_count} followers`);
    }
    catch (error) {
        console.error(`❌ Instagram snapshot failed:`, error.message);
        throw error;
    }
}
/**
 * Schedule analytics snapshots to run daily
 * Returns the interval ID for cleanup
 */
function scheduleAnalyticsSnapshots() {
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
