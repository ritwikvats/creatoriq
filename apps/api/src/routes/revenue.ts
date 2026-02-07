import { Router } from 'express';
import { revenueService } from '../services/revenue.service';

const router = Router();

// Get all revenue entries for a user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
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
        res.status(500).json({ error: error.message });
    }
});

// Add new revenue entry
router.post('/', async (req, res) => {
    try {
        const revenue = await revenueService.createRevenue(req.body);
        res.status(201).json({ revenue });
    } catch (error: any) {
        console.error('Create revenue error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update revenue entry
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const revenue = await revenueService.updateRevenue(id, req.body);
        res.json({ revenue });
    } catch (error: any) {
        console.error('Update revenue error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete revenue entry
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await revenueService.deleteRevenue(id);
        res.json({ message: 'Revenue entry deleted successfully' });
    } catch (error: any) {
        console.error('Delete revenue error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get revenue summary (total by source, month, etc.)
router.get('/:userId/summary', async (req, res) => {
    const { userId } = req.params;
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
        res.status(500).json({ error: error.message });
    }
});

export default router;
