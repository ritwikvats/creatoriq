import axios from 'axios';
import { google } from 'googleapis';

const INSTAGRAM_API_BASE = 'https://graph.facebook.com/v22.0';

export interface CompetitorProfile {
    platform: 'instagram' | 'youtube';
    username: string;
    displayName: string;
    profilePicture: string;
    bio: string;
    followers: number;
    following: number;
    postsCount: number;
    engagementRate: number;
    avgLikes: number;
    avgComments: number;
    postsPerWeek: number;
    recentPosts: Array<{
        likes: number;
        comments: number;
        views: number;
        timestamp: string;
        mediaUrl?: string;
        mediaType?: string;
        title?: string;
    }>;
}

class CompetitorService {
    /**
     * Look up an Instagram Business/Creator account using Business Discovery API.
     * Uses the authenticated user's own token + IG user ID to discover another account.
     */
    async lookupInstagram(accessToken: string, igUserId: string, competitorUsername: string): Promise<CompetitorProfile> {
        try {
            // Clean up username (remove @ if present)
            const username = competitorUsername.replace(/^@/, '').trim().toLowerCase();

            console.log(`🔍 Looking up Instagram competitor: @${username} via Business Discovery`);

            const response = await axios.get(`${INSTAGRAM_API_BASE}/${igUserId}`, {
                params: {
                    fields: `business_discovery.fields(username,name,biography,followers_count,follows_count,media_count,profile_picture_url,media.limit(6){like_count,comments_count,timestamp,media_url,media_type}).username(${username})`,
                    access_token: accessToken,
                },
            });

            const discovery = response.data.business_discovery;
            if (!discovery) {
                throw new Error('Account not found or is not a Business/Creator account');
            }

            const media = discovery.media?.data || [];

            // Calculate engagement metrics from recent posts
            const totalLikes = media.reduce((sum: number, p: any) => sum + (p.like_count || 0), 0);
            const totalComments = media.reduce((sum: number, p: any) => sum + (p.comments_count || 0), 0);
            const avgLikes = media.length > 0 ? Math.round(totalLikes / media.length) : 0;
            const avgComments = media.length > 0 ? Math.round(totalComments / media.length) : 0;

            // Engagement rate: (avgLikes + avgComments) / followers * 100
            const followers = discovery.followers_count || 0;
            const engagementRate = followers > 0
                ? parseFloat(((avgLikes + avgComments) / followers * 100).toFixed(2))
                : 0;

            // Calculate posts per week from timestamps
            const postsPerWeek = this.calculatePostsPerWeek(media);

            return {
                platform: 'instagram',
                username: discovery.username || username,
                displayName: discovery.name || discovery.username || username,
                profilePicture: discovery.profile_picture_url || '',
                bio: discovery.biography || '',
                followers,
                following: discovery.follows_count || 0,
                postsCount: discovery.media_count || 0,
                engagementRate,
                avgLikes,
                avgComments,
                postsPerWeek,
                recentPosts: media.map((p: any) => ({
                    likes: p.like_count || 0,
                    comments: p.comments_count || 0,
                    views: 0,
                    timestamp: p.timestamp || '',
                    mediaUrl: p.media_url || '',
                    mediaType: p.media_type || '',
                })),
            };
        } catch (error: any) {
            const fbError = error.response?.data?.error;
            if (fbError) {
                if (fbError.code === 803 || fbError.error_subcode === 2207013) {
                    throw new Error('Account not found. Check the username and try again.');
                }
                if (fbError.code === 110) {
                    throw new Error('This account is private or not a Business/Creator account.');
                }
                throw new Error(`Instagram API error: ${fbError.message}`);
            }
            throw error;
        }
    }

    /**
     * Look up a YouTube channel by handle or username using YouTube Data API v3.
     * Uses the authenticated user's OAuth tokens for public channel lookups.
     */
    async lookupYouTube(accessToken: string, competitorHandle: string): Promise<CompetitorProfile> {
        try {
            // Clean up handle
            let handle = competitorHandle.replace(/^@/, '').trim();

            console.log(`🔍 Looking up YouTube competitor: @${handle}`);

            const oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_REDIRECT_URI
            );
            oauth2Client.setCredentials({ access_token: accessToken });
            const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

            // Try forUsername first
            let channel: any = null;
            try {
                const channelResponse = await youtube.channels.list({
                    part: ['snippet', 'statistics'],
                    forUsername: handle,
                });
                if (channelResponse.data.items && channelResponse.data.items.length > 0) {
                    channel = channelResponse.data.items[0];
                }
            } catch (err) {
                console.log('forUsername lookup failed, trying search...');
            }

            // Fallback: search for the channel by name/handle
            if (!channel) {
                const searchResponse = await youtube.search.list({
                    q: handle,
                    type: ['channel'],
                    part: ['snippet'],
                    maxResults: 1,
                });

                const channelId = searchResponse.data.items?.[0]?.snippet?.channelId
                    || searchResponse.data.items?.[0]?.id?.channelId;

                if (!channelId) {
                    throw new Error('Channel not found. Check the handle and try again.');
                }

                const channelResponse = await youtube.channels.list({
                    part: ['snippet', 'statistics'],
                    id: [channelId],
                });

                if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
                    throw new Error('Channel not found.');
                }
                channel = channelResponse.data.items[0];
            }

            const stats = channel.statistics;
            const snippet = channel.snippet;
            const subscribers = parseInt(stats?.subscriberCount || '0');
            const hiddenSubs = stats?.hiddenSubscriberCount === true;

            // Fetch 6 recent videos for engagement calculation
            let recentVideos: any[] = [];
            try {
                const searchResponse = await youtube.search.list({
                    part: ['snippet'],
                    channelId: channel.id,
                    order: 'date',
                    type: ['video'],
                    maxResults: 6,
                });

                const videoIds = (searchResponse.data.items || [])
                    .map((item: any) => item.id?.videoId)
                    .filter(Boolean) as string[];

                if (videoIds.length > 0) {
                    const videosResponse = await youtube.videos.list({
                        part: ['statistics', 'snippet'],
                        id: videoIds,
                    });
                    recentVideos = videosResponse.data.items || [];
                }
            } catch (err) {
                console.warn('Could not fetch recent videos for competitor:', err);
            }

            const totalLikes = recentVideos.reduce((sum, v) => sum + parseInt(v.statistics?.likeCount || '0'), 0);
            const totalComments = recentVideos.reduce((sum, v) => sum + parseInt(v.statistics?.commentCount || '0'), 0);
            const totalViews = recentVideos.reduce((sum, v) => sum + parseInt(v.statistics?.viewCount || '0'), 0);

            const avgLikes = recentVideos.length > 0 ? Math.round(totalLikes / recentVideos.length) : 0;
            const avgComments = recentVideos.length > 0 ? Math.round(totalComments / recentVideos.length) : 0;

            // YouTube engagement = (likes + comments) / views * 100
            const engagementRate = totalViews > 0
                ? parseFloat(((totalLikes + totalComments) / totalViews * 100).toFixed(2))
                : 0;

            // Calculate posts per week from video timestamps
            const videoPosts = recentVideos.map((v: any) => ({
                timestamp: v.snippet?.publishedAt || '',
            }));
            const postsPerWeek = this.calculatePostsPerWeek(videoPosts);

            return {
                platform: 'youtube',
                username: snippet?.customUrl?.replace(/^@/, '') || handle,
                displayName: snippet?.title || handle,
                profilePicture: snippet?.thumbnails?.high?.url || snippet?.thumbnails?.default?.url || '',
                bio: snippet?.description || '',
                followers: hiddenSubs ? -1 : subscribers,
                following: 0,
                postsCount: parseInt(stats?.videoCount || '0'),
                engagementRate,
                avgLikes,
                avgComments,
                postsPerWeek,
                recentPosts: recentVideos.map((v: any) => ({
                    likes: parseInt(v.statistics?.likeCount || '0'),
                    comments: parseInt(v.statistics?.commentCount || '0'),
                    views: parseInt(v.statistics?.viewCount || '0'),
                    timestamp: v.snippet?.publishedAt || '',
                    title: v.snippet?.title || '',
                })),
            };
        } catch (error: any) {
            if (error.message?.includes('not found')) {
                throw error;
            }
            console.error('YouTube competitor lookup error:', error.response?.data || error.message);
            throw new Error(`Failed to look up YouTube channel: ${error.message}`);
        }
    }

    /**
     * Calculate approximate posts per week from post timestamps
     */
    private calculatePostsPerWeek(posts: Array<{ timestamp: string }>): number {
        if (posts.length < 2) return 0;

        const timestamps = posts
            .map(p => new Date(p.timestamp).getTime())
            .filter(t => !isNaN(t))
            .sort((a, b) => b - a);

        if (timestamps.length < 2) return 0;

        const newestMs = timestamps[0];
        const oldestMs = timestamps[timestamps.length - 1];
        const spanWeeks = (newestMs - oldestMs) / (7 * 24 * 60 * 60 * 1000);

        if (spanWeeks < 0.1) return timestamps.length; // All in same day basically
        return parseFloat((timestamps.length / spanWeeks).toFixed(1));
    }
}

export const competitorService = new CompetitorService();
