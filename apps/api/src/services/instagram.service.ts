import axios from 'axios';

const INSTAGRAM_API_BASE = 'https://graph.facebook.com/v22.0';

export const getAuthUrl = () => {
    const appId = process.env.FACEBOOK_APP_ID;
    const redirectUri = encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI!);
    // Instagram Graph API scopes (for Business/Creator accounts with analytics)
    // Requires: Instagram Business account + linked Facebook Page
    const scope = encodeURIComponent('instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement');

    // Use Facebook OAuth (not Instagram Basic Display)
    return `https://www.facebook.com/v22.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
};

export const getAccessToken = async (code: string) => {
    // Exchange authorization code for access token (Facebook OAuth)
    console.log('🔄 Exchanging auth code for access token...');
    const response = await axios.get(`${INSTAGRAM_API_BASE}/oauth/access_token`, {
        params: {
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
            grant_type: 'authorization_code',
            code,
        },
    });

    console.log('✅ Token exchange response:', response.data);
    return response.data.access_token;
};

export const getInstagramAccountId = async (accessToken: string) => {
    try {
        // Try getting user's business accounts first
        console.log('🔍 Checking for business portfolio accounts...');
        let businessPages: any[] = [];
        try {
            const businessResponse = await axios.get(`${INSTAGRAM_API_BASE}/me/businesses`, {
                params: {
                    access_token: accessToken,
                    fields: 'id,name'
                },
            });
            console.log('🏢 Business accounts:', businessResponse.data);
            if (businessResponse.data.data && businessResponse.data.data.length > 0) {
                const businessId = businessResponse.data.data[0].id;
                const businessPagesResponse = await axios.get(`${INSTAGRAM_API_BASE}/${businessId}/client_pages`, {
                    params: {
                        access_token: accessToken,
                        fields: 'id,name,instagram_business_account'
                    },
                });
                businessPages = businessPagesResponse.data.data || [];
                console.log('📄 Business portfolio pages:', businessPages);
            }
        } catch (err) {
            console.log('ℹ️ No business portfolio pages found, trying regular pages...');
        }

        // Get Facebook Pages linked to this user directly
        console.log('🔍 Fetching Facebook Pages (direct access)...');
        console.log('🔑 Access Token (first 20 chars):', accessToken.substring(0, 20) + '...');

        const pagesResponse = await axios.get(`${INSTAGRAM_API_BASE}/me/accounts`, {
            params: {
                access_token: accessToken,
                fields: 'id,name,instagram_business_account'
            },
        });

        console.log('📦 Raw Facebook API Response:', JSON.stringify(pagesResponse.data, null, 2));
        const directPages = pagesResponse.data.data || [];

        // Combine both sources
        const pages = [...businessPages, ...directPages];
        console.log(`📄 Found ${pages.length} Facebook Page(s) total:`, pages.map((p: any) => ({ name: p.name, hasInstagram: !!p.instagram_business_account })));

        if (pages.length === 0) {
            throw new Error('No Facebook Page found. You need to create a Facebook Page and link it to your Instagram Business account.');
        }

        // Find a page with Instagram Business Account linked
        const pageWithInstagram = pages.find((page: any) => page.instagram_business_account);

        if (!pageWithInstagram) {
            throw new Error(`No Instagram Business Account found. Found ${pages.length} page(s) but none have Instagram linked. Please link your Instagram Business account to your Facebook Page.`);
        }

        console.log('✅ Found Instagram Business Account:', pageWithInstagram.instagram_business_account.id);
        return pageWithInstagram.instagram_business_account.id;
    } catch (error: any) {
        console.error('❌ Error in getInstagramAccountId:', error.response?.data || error.message);
        if (error.response?.data?.error) {
            const fbError = error.response.data.error;
            throw new Error(`Instagram API Error: ${fbError.message}. Make sure you have: 1) Instagram Business/Creator account, 2) Linked Facebook Page, 3) Approved all permissions.`);
        }
        throw error;
    }
};

export const getAccountInsights = async (accessToken: string, accountId: string) => {
    try {
        console.log(`📊 Fetching insights for Instagram account: ${accountId}`);

        // Get account info
        const accountResponse = await axios.get(`${INSTAGRAM_API_BASE}/${accountId}`, {
            params: {
                fields: 'username,followers_count,follows_count,media_count',
                access_token: accessToken,
            },
        });
        console.log('✅ Account info:', accountResponse.data);

        // Get insights for last 30 days - this might fail for new/small accounts
        let insights = [];
        try {
            const insightsResponse = await axios.get(`${INSTAGRAM_API_BASE}/${accountId}/insights`, {
                params: {
                    metric: 'impressions,reach,profile_views',  // Simplified metrics
                    period: 'day',
                    since: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60,  // Last 7 days only
                    until: Math.floor(Date.now() / 1000),
                    access_token: accessToken,
                },
            });
            insights = insightsResponse.data.data || [];
            console.log('✅ Insights fetched:', insights.length, 'metrics');
        } catch (insightsError: any) {
            console.warn('⚠️ Could not fetch insights (account might be too new):', insightsError.response?.data || insightsError.message);
            // Don't fail the whole connection if insights fail
        }

        return {
            account: accountResponse.data,
            insights,
        };
    } catch (error: any) {
        console.error('❌ Error in getAccountInsights:', JSON.stringify(error.response?.data || error.message));
        throw error;
    }
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
