import { Router } from 'express';
import { revenueService } from '../services/revenue.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Get all revenue entries for authenticated user
router.get('/', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;
    const { startDate, endDate } = req.query;

    try {
        const revenue = await revenueService.getRevenue(
            userId,
            startDate as string,
            endDate as string
        );
        res.json({ revenue });
    } catch (error: any) {
        console.error('Get revenue error:', error);
        next(error);
    }
});

// Add new revenue entry
router.post('/', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;

    try {
        const revenue = await revenueService.createRevenue({
            ...req.body,
            user_id: userId, // Ensure user_id is set from authenticated user
        });
        res.status(201).json({ revenue });
    } catch (error: any) {
        console.error('Create revenue error:', error);
        next(error);
    }
});

// Update revenue entry
router.put('/:id', requireAuth, async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user!.id;

    try {
        const revenue = await revenueService.updateRevenue(id, { ...req.body, user_id: userId });
        res.json({ revenue });
    } catch (error: any) {
        console.error('Update revenue error:', error);
        next(error);
    }
});

// Delete revenue entry
router.delete('/:id', requireAuth, async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user!.id;

    try {
        await revenueService.deleteRevenue(id);
        res.json({ message: 'Revenue entry deleted successfully' });
    } catch (error: any) {
        console.error('Delete revenue error:', error);
        next(error);
    }
});

// Get revenue summary (total by source, month, etc.)
router.get('/summary', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;
    const { startDate, endDate } = req.query;

    try {
        const summary = await revenueService.getSummary(
            userId,
            startDate as string,
            endDate as string
        );
        res.json(summary);
    } catch (error: any) {
        console.error('Revenue summary error:', error);
        next(error);
    }
});

export default router;
