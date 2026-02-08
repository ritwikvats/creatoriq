import axios from 'axios';

const INSTAGRAM_API_BASE = 'https://graph.facebook.com/v22.0';

export const getAuthUrl = (userId?: string) => {
    const appId = process.env.FACEBOOK_APP_ID;
    const redirectUri = encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI!);
    // Instagram Graph API scopes (for Business/Creator accounts with analytics)
    // Requires: Instagram Business account + linked Facebook Page
    const scope = encodeURIComponent('instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement');

    // Build auth URL with optional state parameter for user ID
    let authUrl = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

    if (userId) {
        authUrl += `&state=${userId}`;
    }

    return authUrl;
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

        // Get account info with ALL available fields
        const accountResponse = await axios.get(`${INSTAGRAM_API_BASE}/${accountId}`, {
            params: {
                fields: 'username,name,biography,website,followers_count,follows_count,media_count,profile_picture_url',
                access_token: accessToken,
            },
        });
        console.log('✅ Account info:', accountResponse.data);

        // Get insights for last 30 days - this might fail for new/small accounts
        let insights = [];
        try {
            // Fetch valid insights metrics for Instagram Business accounts
            const insightsResponse = await axios.get(`${INSTAGRAM_API_BASE}/${accountId}/insights`, {
                params: {
                    metric: 'reach,follower_count',
                    period: 'day',
                    metric_type: 'total_value',
                    since: Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60,  // Last 7 days
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
    // Get recent media with ALL available fields
    const mediaResponse = await axios.get(`${INSTAGRAM_API_BASE}/${accountId}/media`, {
        params: {
            fields: 'id,caption,media_type,media_url,thumbnail_url,timestamp,permalink,like_count,comments_count,media_product_type',
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

/**
 * Get audience demographics (age, gender, location) for Instagram Business account
 * Updated to use new Instagram Graph API v22.0 metrics with breakdown parameters
 */
export const getAudienceDemographics = async (accessToken: string, igAccountId: string) => {
    try {
        const demographics: any = {
            cities: [],
            countries: [],
            ageGender: [],
        };

        // Fetch each breakdown separately (Instagram requires breakdown parameter)

        // 1. Get country breakdown
        try {
            console.log('📊 Requesting country demographics for account:', igAccountId);
            const countryResponse = await axios.get(`${INSTAGRAM_API_BASE}/${igAccountId}/insights`, {
                params: {
                    metric: 'follower_demographics',
                    period: 'lifetime',
                    breakdown: 'country',
                    metric_type: 'total_value',
                    access_token: accessToken,
                },
            });

            console.log('✅ Country response:', JSON.stringify(countryResponse.data, null, 2));
            const countryData = countryResponse.data.data?.[0]?.total_value?.breakdowns?.[0]?.results || [];
            demographics.countries = countryData
                .map((item: any) => ({
                    country: item.dimension_values?.[0] || 'Unknown',
                    count: item.value || 0
                }))
                .sort((a: any, b: any) => b.count - a.count)
                .slice(0, 10);
            console.log('📍 Parsed countries:', demographics.countries.length);
        } catch (err: any) {
            console.error('❌ Country demographics error:', err.response?.data || err.message);
        }

        // 2. Get city breakdown
        try {
            console.log('📊 Requesting city demographics...');
            const cityResponse = await axios.get(`${INSTAGRAM_API_BASE}/${igAccountId}/insights`, {
                params: {
                    metric: 'follower_demographics',
                    period: 'lifetime',
                    breakdown: 'city',
                    metric_type: 'total_value',
                    access_token: accessToken,
                },
            });

            const cityData = cityResponse.data.data?.[0]?.total_value?.breakdowns?.[0]?.results || [];
            demographics.cities = cityData
                .map((item: any) => ({
                    city: item.dimension_values?.[0] || 'Unknown',
                    count: item.value || 0
                }))
                .sort((a: any, b: any) => b.count - a.count)
                .slice(0, 10);
            console.log('📍 Parsed cities:', demographics.cities.length);
        } catch (err: any) {
            console.error('❌ City demographics error:', err.response?.data || err.message);
        }

        // 3. Get age and gender breakdown (combined)
        try {
            console.log('📊 Requesting age/gender demographics...');
            const ageGenderResponse = await axios.get(`${INSTAGRAM_API_BASE}/${igAccountId}/insights`, {
                params: {
                    metric: 'follower_demographics',
                    period: 'lifetime',
                    breakdown: 'age,gender',
                    metric_type: 'total_value',
                    access_token: accessToken,
                },
            });

            const ageGenderData = ageGenderResponse.data.data?.[0]?.total_value?.breakdowns?.[0]?.results || [];
            demographics.ageGender = ageGenderData
                .map((item: any) => {
                    const dimensions = item.dimension_values || [];
                    return {
                        ageRange: dimensions[0] || 'Unknown',
                        gender: dimensions[1] === 'M' ? 'Male' : dimensions[1] === 'F' ? 'Female' : 'Unknown',
                        count: item.value || 0
                    };
                })
                .sort((a: any, b: any) => b.count - a.count);
            console.log('👥 Parsed age/gender:', demographics.ageGender.length);
        } catch (err: any) {
            console.error('❌ Age/gender demographics error:', err.response?.data || err.message);
        }

        // If all demographics are empty, return error
        if (demographics.countries.length === 0 && demographics.cities.length === 0 && demographics.ageGender.length === 0) {
            return {
                cities: [],
                countries: [],
                ageGender: [],
                error: 'Demographics not available. Make sure your Instagram account is a Professional account (Business or Creator) and connected to a Facebook Page.'
            };
        }

        return demographics;
    } catch (error: any) {
        console.error('Error fetching Instagram demographics:', error.response?.data || error.message);

        return {
            cities: [],
            countries: [],
            ageGender: [],
            error: 'Demographics not available (requires Instagram Business account with sufficient followers and proper permissions)'
        };
    }
};

/**
 * Get best posting times based on follower activity
 */
export const getBestPostingTimes = async (accessToken: string, igAccountId: string) => {
    try {
        // Fetch online followers insights
        const response = await axios.get(`${INSTAGRAM_API_BASE}/${igAccountId}/insights`, {
            params: {
                metric: 'online_followers',
                period: 'lifetime',
                access_token: accessToken,
            },
        });

        const onlineFollowers = response.data.data?.[0]?.values?.[0]?.value || {};

        // Parse hour-by-hour activity
        const hourlyActivity = Object.entries(onlineFollowers).map(([hour, count]) => ({
            hour: parseInt(hour),
            count: count as number
        })).sort((a, b) => b.count - a.count);

        // Get top 5 hours
        const bestHours = hourlyActivity.slice(0, 5).map(item => ({
            hour: `${item.hour}:00`,
            activeFollowers: item.count,
            dayOfWeek: 'All days' // Instagram provides combined data
        }));

        // Analyze recent posts to determine best days
        const mediaResponse = await axios.get(`${INSTAGRAM_API_BASE}/${igAccountId}/media`, {
            params: {
                fields: 'timestamp,like_count,comments_count',
                limit: 50,
                access_token: accessToken,
            },
        });

        const posts = mediaResponse.data.data || [];

        // Group by day of week
        const dayStats = Array(7).fill(0).map(() => ({
            count: 0,
            totalEngagement: 0
        }));

        posts.forEach((post: any) => {
            const date = new Date(post.timestamp);
            const day = date.getDay();
            const engagement = (post.like_count || 0) + (post.comments_count || 0);

            dayStats[day].count++;
            dayStats[day].totalEngagement += engagement;
        });

        const bestDays = dayStats
            .map((stat, day) => ({
                day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day],
                avgEngagement: stat.count > 0 ? Math.round(stat.totalEngagement / stat.count) : 0,
                postCount: stat.count
            }))
            .filter(d => d.postCount > 0)
            .sort((a, b) => b.avgEngagement - a.avgEngagement)
            .slice(0, 3);

        return {
            bestHours,
            bestDays,
            recommendation: bestHours.length > 0 && bestDays.length > 0
                ? `Best time to post: ${bestDays[0].day} at ${bestHours[0].hour}`
                : 'Not enough data - keep posting consistently',
            postsAnalyzed: posts.length
        };
    } catch (error: any) {
        console.error('Error fetching Instagram posting times:', error.response?.data || error.message);
        return {
            bestHours: [],
            bestDays: [],
            recommendation: 'Unable to analyze posting times',
            postsAnalyzed: 0,
            error: 'Requires Instagram Business account with insights access'
        };
    }
};
