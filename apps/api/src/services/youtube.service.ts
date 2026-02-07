import { google } from 'googleapis';

// YouTube OAuth and API service with comprehensive functionality
class YouTubeService {
    private oauth2Client;

    constructor() {
        // Use environment variables for credentials
        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
        const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

        console.log('🔍 YouTube Service: Initialized with environment credentials');

        this.oauth2Client = new google.auth.OAuth2(
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            GOOGLE_REDIRECT_URI
        );
    }

    /**
     * Generate OAuth authorization URL with necessary scopes
     */
    getAuthUrl(): string {
        const scopes = [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/yt-analytics-monetary.readonly', // Added for revenue
        ];

        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline', // Get refresh token
            scope: scopes,
            prompt: 'consent', // Force consent screen
            redirect_uri: 'http://localhost:3001/youtube/callback', // Hardcoded redirect_uri
        });
    }

    /**
     * Exchange authorization code for access and refresh tokens
     */
    async exchangeCodeForTokens(code: string) {
        try {
            console.log('🔄 Exchanging code for tokens...');
            const { tokens } = await this.oauth2Client.getToken({
                code,
                redirect_uri: 'http://localhost:3001/youtube/callback'
            });
            this.oauth2Client.setCredentials(tokens);
            console.log('✅ Token exchange successful');
            return tokens;
        } catch (error: any) {
            console.error('❌ Error exchanging code for tokens:', error);
            if (error.response && error.response.data) {
                console.error('🔍 Google Response Data:', error.response.data);
            }
            throw new Error(`Failed to get tokens: ${error.message}`);
        }
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshAccessToken(refreshToken: string) {
        try {
            this.oauth2Client.setCredentials({ refresh_token: refreshToken });
            const { credentials } = await this.oauth2Client.refreshAccessToken();
            return credentials;
        } catch (error: any) {
            console.error('Error refreshing access token:', error);
            throw new Error(`Failed to refresh token: ${error.message}`);
        }
    }

    /**
     * Get user info (email, name) from Google
     */
    async getUserInfo(accessToken: string) {
        try {
            this.oauth2Client.setCredentials({ access_token: accessToken });
            const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
            const userInfo = await oauth2.userinfo.get();

            return {
                email: userInfo.data.email || '',
                name: userInfo.data.name || '',
                picture: userInfo.data.picture || '',
            };
        } catch (error: any) {
            console.error('Error fetching user info:', error);
            throw new Error(`Failed to fetch user info: ${error.message}`);
        }
    }

    /**
     * Get channel statistics and information
     */
    async getChannelStats(accessToken: string) {
        try {
            this.oauth2Client.setCredentials({ access_token: accessToken });
            const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });

            const channelsResponse = await youtube.channels.list({
                part: ['snippet', 'statistics', 'contentDetails'],
                mine: true,
            });

            if (!channelsResponse.data.items || channelsResponse.data.items.length === 0) {
                throw new Error('No YouTube channel found');
            }

            const channel = channelsResponse.data.items[0];
            const stats = channel.statistics;
            const snippet = channel.snippet;

            return {
                channelId: channel.id || '',
                channelName: snippet?.title || 'Unknown',
                description: snippet?.description || '',
                customUrl: snippet?.customUrl || '',
                thumbnailUrl: snippet?.thumbnails?.high?.url || snippet?.thumbnails?.default?.url || '',
                subscriberCount: parseInt(stats?.subscriberCount || '0'),
                totalViews: parseInt(stats?.viewCount || '0'),
                totalVideos: parseInt(stats?.videoCount || '0'),
                publishedAt: snippet?.publishedAt || new Date().toISOString(),
                country: snippet?.country || '',
            };
        } catch (error: any) {
            console.error('Error fetching channel stats:', error);
            throw new Error(`Failed to fetch channel stats: ${error.message}`);
        }
    }

    /**
     * Get recent videos with detailed statistics
     */
    async getRecentVideos(accessToken: string, channelId: string, maxResults: number = 10) {
        try {
            this.oauth2Client.setCredentials({ access_token: accessToken });
            const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });

            // Search for recent uploads
            const searchResponse = await youtube.search.list({
                part: ['snippet'],
                channelId: channelId,
                order: 'date',
                type: ['video'],
                maxResults: maxResults,
            });

            if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
                return [];
            }

            // Extract video IDs
            const videoIds = searchResponse.data.items
                .map((item) => item.id?.videoId)
                .filter(Boolean) as string[];

            if (videoIds.length === 0) {
                return [];
            }

            // Get detailed video statistics
            const videosResponse = await youtube.videos.list({
                part: ['snippet', 'statistics', 'contentDetails'],
                id: videoIds,
            });

            if (!videosResponse.data.items) {
                return [];
            }

            return videosResponse.data.items.map((video) => {
                const stats = video.statistics;
                const snippet = video.snippet;
                const views = parseInt(stats?.viewCount || '0');
                const likes = parseInt(stats?.likeCount || '0');
                const comments = parseInt(stats?.commentCount || '0');

                // Calculate engagement rate as percentage
                const engagementRate = views > 0 ? ((likes + comments) / views) * 100 : 0;

                return {
                    videoId: video.id || '',
                    title: snippet?.title || 'Untitled',
                    description: snippet?.description || '',
                    publishedAt: snippet?.publishedAt || new Date().toISOString(),
                    thumbnailUrl: snippet?.thumbnails?.high?.url || snippet?.thumbnails?.default?.url || '',
                    views: views,
                    likes: likes,
                    comments: comments,
                    engagementRate: parseFloat(engagementRate.toFixed(2)),
                    duration: video.contentDetails?.duration || 'PT0S',
                };
            });
        } catch (error: any) {
            console.error('Error fetching videos:', error);
            throw new Error(`Failed to fetch videos: ${error.message}`);
        }
    }

    /**
     * Get Revenue Data from YouTube Analytics API
     */
    async getChannelRevenue(accessToken: string, channelId: string) {
        try {
            this.oauth2Client.setCredentials({ access_token: accessToken });
            const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: this.oauth2Client });

            // Calculate start and end date (last 30 days)
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 30);

            const formatDate = (date: Date) => date.toISOString().split('T')[0];

            const response = await youtubeAnalytics.reports.query({
                ids: `channel==${channelId}`,
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                metrics: 'estimatedRevenue',
                dimensions: 'day',
                sort: 'day'
            });

            const rows = response.data.rows || [];
            const totalRevenue = rows.reduce((acc: number, row: any) => acc + (row[1] || 0), 0);

            return totalRevenue;
        } catch (error: any) {
            console.error('Error fetching revenue:', error);
            // Don't fail the whole dashboard if revenue permission is denied (common 403)
            return 0; // Return 0 instead of throwing
        }
    }

    /**
     * Calculate analytics and insights from channel data
     */
    calculateAnalytics(channelStats: any, recentVideos: any[]) {
        const avgViewsPerVideo = channelStats.totalVideos > 0
            ? Math.round(channelStats.totalViews / channelStats.totalVideos)
            : 0;

        const avgEngagement = recentVideos.length > 0
            ? recentVideos.reduce((sum, video) => sum + video.engagementRate, 0) / recentVideos.length
            : 0;

        return {
            avgViewsPerVideo,
            avgEngagementRate: parseFloat(avgEngagement.toFixed(2)),
            totalEngagement: recentVideos.reduce((sum, v) => sum + v.likes + v.comments, 0),
            recentPerformance: recentVideos.slice(0, 5).map(v => ({
                title: v.title,
                views: v.views,
                engagement: v.engagementRate,
            })),
        };
    }
}

// Export singleton instance
export const youtubeService = new YouTubeService();

// Export legacy functions for backward compatibility
export const getAuthUrl = () => youtubeService.getAuthUrl();
export const getTokensFromCode = (code: string) => youtubeService.exchangeCodeForTokens(code);
export const getChannelAnalytics = (accessToken: string) => youtubeService.getChannelStats(accessToken);
export const getVideoPerformance = (accessToken: string, maxResults?: number) =>
    youtubeService.getChannelStats(accessToken).then(stats =>
        youtubeService.getRecentVideos(accessToken, stats.channelId, maxResults)
    );
