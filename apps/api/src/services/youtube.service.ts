import { google } from 'googleapis';

// YouTube OAuth and API service with comprehensive functionality
class YouTubeService {
    private oauth2Client: any = null;

    // Lazy initialization - create oauth client when first needed
    private getOAuthClient() {
        if (!this.oauth2Client) {
            const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
            const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
            const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

            console.log('🔍 YouTube Service: Initializing OAuth client');
            console.log('   CLIENT_ID:', GOOGLE_CLIENT_ID ? `${GOOGLE_CLIENT_ID.substring(0, 20)}...` : 'MISSING!');
            console.log('   CLIENT_SECRET:', GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING!');
            console.log('   REDIRECT_URI:', GOOGLE_REDIRECT_URI);

            this.oauth2Client = new google.auth.OAuth2(
                GOOGLE_CLIENT_ID,
                GOOGLE_CLIENT_SECRET,
                GOOGLE_REDIRECT_URI
            );
        }
        return this.oauth2Client;
    }

    /**
     * Generate OAuth authorization URL with necessary scopes
     */
    getAuthUrl(): string {
        const scopes = [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/yt-analytics-monetary.readonly', // Analytics + revenue
        ];

        return this.getOAuthClient().generateAuthUrl({
            access_type: 'offline', // Get refresh token
            scope: scopes,
            prompt: 'consent', // Force consent screen
        });
    }

    /**
     * Exchange authorization code for access and refresh tokens
     */
    async exchangeCodeForTokens(code: string) {
        try {
            console.log('🔄 Exchanging code for tokens...');
            const { tokens } = await this.getOAuthClient().getToken(code);
            this.getOAuthClient().setCredentials(tokens);
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
            this.getOAuthClient().setCredentials({ refresh_token: refreshToken });
            const { credentials } = await this.getOAuthClient().refreshAccessToken();
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
            this.getOAuthClient().setCredentials({ access_token: accessToken });
            const oauth2 = google.oauth2({ version: 'v2', auth: this.getOAuthClient() });
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
            this.getOAuthClient().setCredentials({ access_token: accessToken });
            const youtube = google.youtube({ version: 'v3', auth: this.getOAuthClient() });

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

            // Debug: log raw YouTube API response for stats
            console.log('📺 YouTube raw statistics:', JSON.stringify(stats));
            console.log('📺 hiddenSubscriberCount:', stats?.hiddenSubscriberCount);

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
                uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads || '',
            };
        } catch (error: any) {
            console.error('Error fetching channel stats:', error);
            throw new Error(`Failed to fetch channel stats: ${error.message}`);
        }
    }

    /**
     * Get recent videos with detailed statistics
     * Uses playlistItems.list (1 unit) instead of search.list (100 units)
     */
    async getRecentVideos(accessToken: string, channelId: string, maxResults: number = 10) {
        try {
            this.getOAuthClient().setCredentials({ access_token: accessToken });
            const youtube = google.youtube({ version: 'v3', auth: this.getOAuthClient() });

            // Derive uploads playlist ID from channel ID (UC... → UU...)
            const uploadsPlaylistId = 'UU' + channelId.substring(2);

            // Use playlistItems.list (1 unit) instead of search.list (100 units)
            const playlistResponse = await youtube.playlistItems.list({
                part: ['snippet'],
                playlistId: uploadsPlaylistId,
                maxResults: maxResults,
            });

            if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
                return [];
            }

            // Extract video IDs from playlist items
            const videoIds = playlistResponse.data.items
                .map((item) => item.snippet?.resourceId?.videoId)
                .filter(Boolean) as string[];

            if (videoIds.length === 0) {
                return [];
            }

            // Get detailed video statistics (1 unit)
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
            this.getOAuthClient().setCredentials({ access_token: accessToken });
            const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: this.getOAuthClient() });

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

    /**
     * Get audience demographics (age, gender, geography)
     */
    async getAudienceDemographics(accessToken: string, channelId: string) {
        try {
            this.getOAuthClient().setCredentials({ access_token: accessToken });
            const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: this.getOAuthClient() });

            // Calculate date range (last 28 days - required for demographics)
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 28);
            const formatDate = (date: Date) => date.toISOString().split('T')[0];

            // Fetch geography demographics (simpler, more likely to work)
            let geoData: any[] = [];
            try {
                // Note: Don't use filters param - paramsSerializer double-encodes != operator
                const geoResponse = await youtubeAnalytics.reports.query({
                    ids: `channel==${channelId}`,
                    startDate: formatDate(startDate),
                    endDate: formatDate(endDate),
                    metrics: 'views',
                    dimensions: 'country',
                    sort: '-views',
                    maxResults: 10,
                });

                // Filter out unknown country (ZZ) client-side instead
                geoData = (geoResponse.data.rows || [])
                    .filter((row: any) => row[0] !== 'ZZ')
                    .map((row: any) => ({
                        country: row[0],
                        views: row[1]
                    }));
            } catch (geoError) {
                console.warn('Geography data not available:', geoError);
            }

            // Fetch age/gender demographics across top countries and combine
            // YouTube Analytics API requires a country filter for age/gender queries
            // So we query each top country separately and merge the weighted results
            let ageGenderData: any[] = [];
            const countriesToQuery = geoData.length > 0
                ? geoData.slice(0, 5).map(g => g.country) // Top 5 countries
                : ['IN']; // Fallback
            const totalViews = geoData.reduce((sum, g) => sum + g.views, 0) || 1;

            try {
                // Query each country in parallel
                const countryResults = await Promise.allSettled(
                    countriesToQuery.map(async (country: string) => {
                        const resp = await youtubeAnalytics.reports.query({
                            ids: `channel==${channelId}`,
                            startDate: formatDate(startDate),
                            endDate: formatDate(endDate),
                            metrics: 'viewerPercentage',
                            dimensions: 'ageGroup,gender',
                            filters: `country==${country}`,
                            sort: '-viewerPercentage',
                        });
                        const countryViews = geoData.find(g => g.country === country)?.views || 0;
                        const weight = countryViews / totalViews;
                        return { rows: resp.data.rows || [], weight, country };
                    })
                );

                // Combine weighted results across countries
                const combined: Record<string, { ageGroup: string; gender: string; weightedPct: number }> = {};
                for (const result of countryResults) {
                    if (result.status !== 'fulfilled') continue;
                    const { rows, weight } = result.value;
                    for (const row of rows) {
                        const key = `${row[0]}|${row[1]}`;
                        if (!combined[key]) {
                            combined[key] = { ageGroup: row[0], gender: row[1], weightedPct: 0 };
                        }
                        combined[key].weightedPct += (row[2] || 0) * weight;
                    }
                }

                // Normalize percentages to sum to 100
                const totalPct = Object.values(combined).reduce((s, v) => s + v.weightedPct, 0) || 1;
                ageGenderData = Object.values(combined)
                    .map(v => ({
                        ageGroup: v.ageGroup,
                        gender: v.gender,
                        percentage: parseFloat(((v.weightedPct / totalPct) * 100).toFixed(2))
                    }))
                    .sort((a, b) => b.percentage - a.percentage);
            } catch (ageError: any) {
                console.warn('Age/gender demographics not available:', ageError.message);
                // This is expected for channels not in YPP
            }

            return {
                ageGender: ageGenderData,
                countriesAnalyzed: countriesToQuery,
                geography: geoData,
                period: {
                    start: formatDate(startDate),
                    end: formatDate(endDate)
                },
                ...(ageGenderData.length === 0 && {
                    note: 'Age/gender demographics require YouTube Partner Program eligibility'
                })
            };
        } catch (error: any) {
            console.error('Error fetching demographics:', error);
            // Return empty data with helpful message
            return {
                ageGender: [],
                geography: [],
                period: { start: '', end: '' },
                error: 'Demographics data not available (requires YouTube Partner Program or more watch time)'
            };
        }
    }

    /**
     * Analyze best posting times based on video performance history
     */
    async getBestPostingTimes(accessToken: string, channelId: string) {
        try {
            this.getOAuthClient().setCredentials({ access_token: accessToken });
            const youtube = google.youtube({ version: 'v3', auth: this.getOAuthClient() });

            // Use playlistItems.list (1 unit) instead of search.list (100 units)
            const uploadsPlaylistId = 'UU' + channelId.substring(2);
            const response = await youtube.playlistItems.list({
                part: ['snippet'],
                playlistId: uploadsPlaylistId,
                maxResults: 50,
            });

            const videos = response.data.items || [];

            // Get detailed stats for each video
            const videoIds = videos.map(v => v.snippet?.resourceId?.videoId).filter(Boolean);

            // Guard: if no videos found, return early
            if (videoIds.length === 0) {
                return {
                    bestDays: [],
                    bestHours: [],
                    recommendation: 'No videos found to analyze - upload some content first!',
                    videosAnalyzed: 0
                };
            }

            const statsResponse = await youtube.videos.list({
                part: ['statistics', 'snippet'],
                id: videoIds as string[]
            });

            const videoStats = (statsResponse.data.items || []).map(video => {
                const publishedAt = new Date(video.snippet?.publishedAt || '');
                const views = parseInt(video.statistics?.viewCount || '0');
                const engagement = parseInt(video.statistics?.likeCount || '0') +
                                 parseInt(video.statistics?.commentCount || '0');

                return {
                    dayOfWeek: publishedAt.getDay(), // 0=Sunday, 6=Saturday
                    hourOfDay: publishedAt.getHours(),
                    views,
                    engagement,
                    engagementRate: views > 0 ? (engagement / views) * 100 : 0
                };
            });

            // Analyze by day of week
            const dayStats = Array(7).fill(0).map(() => ({
                count: 0,
                totalViews: 0,
                totalEngagement: 0
            }));

            videoStats.forEach(stat => {
                dayStats[stat.dayOfWeek].count++;
                dayStats[stat.dayOfWeek].totalViews += stat.views;
                dayStats[stat.dayOfWeek].totalEngagement += stat.engagementRate;
            });

            const bestDays = dayStats
                .map((stat, day) => ({
                    day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day],
                    avgViews: stat.count > 0 ? Math.round(stat.totalViews / stat.count) : 0,
                    avgEngagement: stat.count > 0 ? parseFloat((stat.totalEngagement / stat.count).toFixed(2)) : 0,
                    videoCount: stat.count
                }))
                .filter(d => d.videoCount > 0)
                .sort((a, b) => b.avgEngagement - a.avgEngagement)
                .slice(0, 3);

            // Analyze by hour of day
            const hourStats = Array(24).fill(0).map(() => ({
                count: 0,
                totalViews: 0,
                totalEngagement: 0
            }));

            videoStats.forEach(stat => {
                hourStats[stat.hourOfDay].count++;
                hourStats[stat.hourOfDay].totalViews += stat.views;
                hourStats[stat.hourOfDay].totalEngagement += stat.engagementRate;
            });

            const bestHours = hourStats
                .map((stat, hour) => ({
                    hour: `${hour}:00`,
                    avgViews: stat.count > 0 ? Math.round(stat.totalViews / stat.count) : 0,
                    avgEngagement: stat.count > 0 ? parseFloat((stat.totalEngagement / stat.count).toFixed(2)) : 0,
                    videoCount: stat.count
                }))
                .filter(h => h.videoCount > 0)
                .sort((a, b) => b.avgEngagement - a.avgEngagement)
                .slice(0, 5);

            return {
                bestDays,
                bestHours,
                recommendation: bestDays.length > 0 && bestHours.length > 0
                    ? `Best time to post: ${bestDays[0].day} at ${bestHours[0].hour}`
                    : 'Not enough data yet - post consistently to build insights',
                videosAnalyzed: videoStats.length
            };
        } catch (error: any) {
            console.error('Error analyzing posting times:', error);
            return {
                bestDays: [],
                bestHours: [],
                recommendation: 'Unable to analyze posting times',
                videosAnalyzed: 0,
                error: error.message
            };
        }
    }
}

// Export singleton instance
export const youtubeService = new YouTubeService();

// Export legacy functions for backward compatibility
export const getAuthUrl = () => youtubeService.getAuthUrl();
export const getTokensFromCode = (code: string) => youtubeService.exchangeCodeForTokens(code);
export const getChannelAnalytics = (accessToken: string) => youtubeService.getChannelStats(accessToken);
export const getVideoPerformance = (accessToken: string, channelId?: string, maxResults?: number) => {
    if (channelId) {
        return youtubeService.getRecentVideos(accessToken, channelId, maxResults);
    }
    // Fallback: fetch channelId first (costs 1 extra unit)
    return youtubeService.getChannelStats(accessToken).then(stats =>
        youtubeService.getRecentVideos(accessToken, stats.channelId, maxResults)
    );
};
