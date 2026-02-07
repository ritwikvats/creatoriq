import { Router } from 'express';
import { taxService } from '../services/tax.service';

const router = Router();

// Get tax summary for a user
router.get('/:userId/summary', async (req, res) => {
    const { userId } = req.params;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    try {
        const summary = await taxService.getTaxSummary(userId, year);
        res.json(summary);
    } catch (error: any) {
        console.error('Tax summary error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
