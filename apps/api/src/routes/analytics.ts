import { Router } from 'express';
import { getSupabaseClient } from '../services/supabase.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

/**
 * Get historical analytics data for timeline charts
 * GET /analytics/timeline
 * Query params: platform (optional), days (default 30)
 */
router.get('/timeline', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;
    const { platform, days = '30' } = req.query;

    try {
        const supabase = getSupabaseClient();

        // Calculate date range
        const daysAgo = parseInt(days as string);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
        const startDateStr = startDate.toISOString().split('T')[0];

        // Build query
        let query = supabase
            .from('analytics_snapshots')
            .select('*')
            .eq('user_id', userId)
            .gte('snapshot_date', startDateStr)
            .order('snapshot_date', { ascending: true });

        // Filter by platform if specified
        if (platform) {
            query = query.eq('platform', platform);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        res.json({
            snapshots: data || [],
            period: {
                start: startDateStr,
                end: new Date().toISOString().split('T')[0],
                days: daysAgo,
            },
        });
    } catch (error: any) {
        console.error('Timeline analytics error:', error);
        next(error);
    }
});

/**
 * Get growth rates and trends
 * GET /analytics/growth
 */
router.get('/growth', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;
    const { platform } = req.query;

    try {
        const supabase = getSupabaseClient();

        // Get last 30 days of data
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        let query = supabase
            .from('analytics_snapshots')
            .select('*')
            .eq('user_id', userId)
            .gte('snapshot_date', thirtyDaysAgo.toISOString().split('T')[0])
            .order('snapshot_date', { ascending: true });

        if (platform) {
            query = query.eq('platform', platform);
        }

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
            return res.json({
                growth: {
                    daily: 0,
                    weekly: 0,
                    monthly: 0,
                },
                message: 'Not enough historical data',
            });
        }

        calculateGrowthRates(data, res);
    } catch (error: any) {
        console.error('Growth analytics error:', error);
        next(error);
    }
});

/**
 * Calculate growth rates from historical data
 */
function calculateGrowthRates(snapshots: any[], res: any) {
    if (snapshots.length < 2) {
        return res.json({
            growth: {
                daily: 0,
                weekly: 0,
                monthly: 0,
            },
            message: 'Not enough data points',
        });
    }

    const latest = snapshots[snapshots.length - 1];
    const earliest = snapshots[0];

    // Group by platform
    const platforms = Array.from(new Set(snapshots.map(s => s.platform)));
    const growthByPlatform: any = {};

    platforms.forEach(platform => {
        const platformSnapshots = snapshots.filter(s => s.platform === platform);
        if (platformSnapshots.length < 2) return;

        const latestData = platformSnapshots[platformSnapshots.length - 1];
        const earliestData = platformSnapshots[0];

        // Calculate followers/subscribers growth
        const latestFollowers = platform === 'youtube'
            ? latestData.metrics.subscribers
            : latestData.metrics.followers;

        const earliestFollowers = platform === 'youtube'
            ? earliestData.metrics.subscribers
            : earliestData.metrics.followers;

        const totalGrowth = latestFollowers - earliestFollowers;
        const growthPercentage = earliestFollowers > 0
            ? ((totalGrowth / earliestFollowers) * 100).toFixed(2)
            : 0;

        // Calculate daily average
        const daysDiff = Math.max(1, platformSnapshots.length - 1);
        const dailyAverage = (totalGrowth / daysDiff).toFixed(2);

        growthByPlatform[platform] = {
            total_growth: totalGrowth,
            growth_percentage: parseFloat(growthPercentage as string),
            daily_average: parseFloat(dailyAverage),
            period_days: daysDiff,
            current: latestFollowers,
            previous: earliestFollowers,
        };
    });

    res.json({
        growth: growthByPlatform,
        period: {
            start: earliest.snapshot_date,
            end: latest.snapshot_date,
            days: snapshots.length,
        },
    });
}

export default router;
