import { Router } from 'express';
import { youtubeService } from '../services/youtube.service';
import * as instagramService from '../services/instagram.service';
import { getConnectedPlatform } from '../services/supabase.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

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
                demographics.youtube = await youtubeService.getAudienceDemographics(
                    youtubePlatform.access_token,
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
                postingTimes.youtube = await youtubeService.getBestPostingTimes(
                    youtubePlatform.access_token,
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
