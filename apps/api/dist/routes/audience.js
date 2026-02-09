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
const express_1 = require("express");
const youtube_service_1 = require("../services/youtube.service");
const instagramService = __importStar(require("../services/instagram.service"));
const supabase_service_1 = require("../services/supabase.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * GET /audience/demographics
 * Get combined audience demographics from all connected platforms
 */
router.get('/demographics', auth_middleware_1.requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    try {
        const demographics = {
            youtube: null,
            instagram: null,
        };
        // Fetch YouTube demographics
        try {
            const youtubePlatform = await (0, supabase_service_1.getConnectedPlatform)(userId, 'youtube');
            if (youtubePlatform) {
                demographics.youtube = await youtube_service_1.youtubeService.getAudienceDemographics(youtubePlatform.access_token, youtubePlatform.platform_user_id);
            }
        }
        catch (error) {
            console.error('Error fetching YouTube demographics:', error);
            demographics.youtube = { error: error.message };
        }
        // Fetch Instagram demographics
        try {
            const instagramPlatform = await (0, supabase_service_1.getConnectedPlatform)(userId, 'instagram');
            if (instagramPlatform) {
                demographics.instagram = await instagramService.getAudienceDemographics(instagramPlatform.access_token, instagramPlatform.platform_user_id);
            }
        }
        catch (error) {
            console.error('Error fetching Instagram demographics:', error);
            demographics.instagram = { error: error.message };
        }
        res.json(demographics);
    }
    catch (error) {
        console.error('Error fetching demographics:', error);
        next(error);
    }
});
/**
 * GET /audience/posting-times
 * Get best posting times from all connected platforms
 */
router.get('/posting-times', auth_middleware_1.requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    try {
        const postingTimes = {
            youtube: null,
            instagram: null,
        };
        // Fetch YouTube best posting times
        try {
            const youtubePlatform = await (0, supabase_service_1.getConnectedPlatform)(userId, 'youtube');
            if (youtubePlatform) {
                postingTimes.youtube = await youtube_service_1.youtubeService.getBestPostingTimes(youtubePlatform.access_token, youtubePlatform.platform_user_id);
            }
        }
        catch (error) {
            console.error('Error fetching YouTube posting times:', error);
            postingTimes.youtube = { error: error.message };
        }
        // Fetch Instagram best posting times
        try {
            const instagramPlatform = await (0, supabase_service_1.getConnectedPlatform)(userId, 'instagram');
            if (instagramPlatform) {
                postingTimes.instagram = await instagramService.getBestPostingTimes(instagramPlatform.access_token, instagramPlatform.platform_user_id);
            }
        }
        catch (error) {
            console.error('Error fetching Instagram posting times:', error);
            postingTimes.instagram = { error: error.message };
        }
        res.json(postingTimes);
    }
    catch (error) {
        console.error('Error fetching posting times:', error);
        next(error);
    }
});
exports.default = router;
