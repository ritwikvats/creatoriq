import axios from 'axios';

const INSTAGRAM_API_BASE = 'https://graph.facebook.com/v22.0';

export const getAuthUrl = () => {
    const appId = process.env.FACEBOOK_APP_ID;
    const redirectUri = encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI!);
    // Instagram Basic Display API scopes (for personal accounts)
    const scope = encodeURIComponent('user_profile,user_media');

    return `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
};

export const getAccessToken = async (code: string) => {
    const response = await axios.get(`${INSTAGRAM_API_BASE}/oauth/access_token`, {
        params: {
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
            code,
        },
    });

    return response.data.access_token;
};

export const getInstagramAccountId = async (accessToken: string) => {
    // Get Facebook Pages
    const pagesResponse = await axios.get(`${INSTAGRAM_API_BASE}/me/accounts`, {
        params: { access_token: accessToken },
    });

    const pageId = pagesResponse.data.data[0]?.id;
    if (!pageId) throw new Error('No Facebook page found');

    // Get Instagram Business Account ID
    const igResponse = await axios.get(`${INSTAGRAM_API_BASE}/${pageId}`, {
        params: {
            fields: 'instagram_business_account',
            access_token: accessToken,
        },
    });

    return igResponse.data.instagram_business_account?.id;
};

export const getAccountInsights = async (accessToken: string, accountId: string) => {
    // Get account info
    const accountResponse = await axios.get(`${INSTAGRAM_API_BASE}/${accountId}`, {
        params: {
            fields: 'username,followers_count,follows_count,media_count',
            access_token: accessToken,
        },
    });

    // Get insights for last 30 days
    const insightsResponse = await axios.get(`${INSTAGRAM_API_BASE}/${accountId}/insights`, {
        params: {
            metric: 'views,reach,follower_count,profile_views',
            period: 'day',
            since: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60,
            until: Math.floor(Date.now() / 1000),
            access_token: accessToken,
        },
    });

    return {
        account: accountResponse.data,
        insights: insightsResponse.data.data || [],
    };
};

export const getMediaPerformance = async (accessToken: string, accountId: string, limit: number = 10) => {
    // Get recent media
    const mediaResponse = await axios.get(`${INSTAGRAM_API_BASE}/${accountId}/media`, {
        params: {
            fields: 'id,caption,media_type,media_url,timestamp,permalink',
            limit,
            access_token: accessToken,
        },
    });

    const media = mediaResponse.data.data || [];

    // Get insights for each media
    const mediaWithInsights = await Promise.all(
        media.map(async (item: any) => {
            try {
                const insightsResponse = await axios.get(`${INSTAGRAM_API_BASE}/${item.id}/insights`, {
                    params: {
                        metric: 'views,reach,engagement,saves',
                        access_token: accessToken,
                    },
                });

                return {
                    ...item,
                    insights: insightsResponse.data.data,
                };
            } catch (error) {
                return item;
            }
        })
    );

    return mediaWithInsights;
};
