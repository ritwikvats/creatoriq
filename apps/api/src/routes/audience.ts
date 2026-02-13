import { Router } from 'express';
import { youtubeService } from '../services/youtube.service';
import * as instagramService from '../services/instagram.service';
import { getConnectedPlatform, getSupabaseClient } from '../services/supabase.service';
import { encryptionService } from '../services/encryption.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

/**
 * Refresh YouTube access token if expired or expiring soon
 */
async function getValidYouTubeToken(platform: any): Promise<string> {
    let accessToken = platform.access_token;
    const refreshToken = platform.refresh_token;

    if (platform.token_expires_at && refreshToken) {
        const expiryTime = new Date(platform.token_expires_at).getTime();
        const now = Date.now();

        // Refresh if token expires in less than 5 minutes
        if (expiryTime - now < 5 * 60 * 1000) {
            try {
                const newTokens = await youtubeService.refreshAccessToken(refreshToken);
                accessToken = newTokens.access_token || accessToken;

                // Update encrypted tokens in database
                const supabase = getSupabaseClient();
                await supabase
                    .from('connected_platforms')
                    .update({
                        access_token: encryptionService.encrypt(newTokens.access_token!),
                        token_expires_at: newTokens.expiry_date ? new Date(newTokens.expiry_date).toISOString() : null,
                    })
                    .eq('id', platform.id);

                console.log('🔄 YouTube token refreshed for audience demographics');
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
            }
        }
    }

    return accessToken;
}

/**
 * GET /audience/demographics
 * Get combined audience demographics from all connected platforms
 */
router.get('/demographics', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;

    try {
        const demographics: any = {
            youtube: null,
            instagram: null,
        };

        // Fetch YouTube demographics
        try {
            const youtubePlatform = await getConnectedPlatform(userId, 'youtube');
            if (youtubePlatform) {
                const accessToken = await getValidYouTubeToken(youtubePlatform);
                demographics.youtube = await youtubeService.getAudienceDemographics(
                    accessToken,
                    youtubePlatform.platform_user_id
                );
            }
        } catch (error: any) {
            console.error('Error fetching YouTube demographics:', error);
            demographics.youtube = { error: error.message };
        }

        // Fetch Instagram demographics
        try {
            const instagramPlatform = await getConnectedPlatform(userId, 'instagram');
            if (instagramPlatform) {
                demographics.instagram = await instagramService.getAudienceDemographics(
                    instagramPlatform.access_token,
                    instagramPlatform.platform_user_id
                );
            }
        } catch (error: any) {
            console.error('Error fetching Instagram demographics:', error);
            demographics.instagram = { error: error.message };
        }

        res.json(demographics);
    } catch (error: any) {
        console.error('Error fetching demographics:', error);
        next(error);
    }
});

/**
 * GET /audience/posting-times
 * Get best posting times from all connected platforms
 */
router.get('/posting-times', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;

    try {
        const postingTimes: any = {
            youtube: null,
            instagram: null,
        };

        // Fetch YouTube best posting times
        try {
            const youtubePlatform = await getConnectedPlatform(userId, 'youtube');
            if (youtubePlatform) {
                const accessToken = await getValidYouTubeToken(youtubePlatform);
                postingTimes.youtube = await youtubeService.getBestPostingTimes(
                    accessToken,
                    youtubePlatform.platform_user_id
                );
            }
        } catch (error: any) {
            console.error('Error fetching YouTube posting times:', error);
            postingTimes.youtube = { error: error.message };
        }

        // Fetch Instagram best posting times
        try {
            const instagramPlatform = await getConnectedPlatform(userId, 'instagram');
            if (instagramPlatform) {
                postingTimes.instagram = await instagramService.getBestPostingTimes(
                    instagramPlatform.access_token,
                    instagramPlatform.platform_user_id
                );
            }
        } catch (error: any) {
            console.error('Error fetching Instagram posting times:', error);
            postingTimes.instagram = { error: error.message };
        }

        res.json(postingTimes);
    } catch (error: any) {
        console.error('Error fetching posting times:', error);
        next(error);
    }
});

export default router;
