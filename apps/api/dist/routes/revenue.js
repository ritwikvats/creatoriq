"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const revenue_service_1 = require("../services/revenue.service");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Get all revenue entries for authenticated user
router.get('/', auth_middleware_1.requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    try {
        const revenue = await revenue_service_1.revenueService.getRevenue(userId, startDate, endDate);
        res.json({ revenue });
    }
    catch (error) {
        console.error('Get revenue error:', error);
        next(error);
    }
});
// Add new revenue entry
router.post('/', auth_middleware_1.requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    try {
        const revenue = await revenue_service_1.revenueService.createRevenue({
            ...req.body,
            user_id: userId, // Ensure user_id is set from authenticated user
        });
        res.status(201).json({ revenue });
    }
    catch (error) {
        console.error('Create revenue error:', error);
        next(error);
    }
});
// Update revenue entry
router.put('/:id', auth_middleware_1.requireAuth, async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const revenue = await revenue_service_1.revenueService.updateRevenue(id, { ...req.body, user_id: userId });
        res.json({ revenue });
    }
    catch (error) {
        console.error('Update revenue error:', error);
        next(error);
    }
});
// Delete revenue entry
router.delete('/:id', auth_middleware_1.requireAuth, async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        await revenue_service_1.revenueService.deleteRevenue(id);
        res.json({ message: 'Revenue entry deleted successfully' });
    }
    catch (error) {
        console.error('Delete revenue error:', error);
        next(error);
    }
});
// Get revenue summary (total by source, month, etc.)
router.get('/summary', auth_middleware_1.requireAuth, async (req, res, next) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    try {
        const summary = await revenue_service_1.revenueService.getSummary(userId, startDate, endDate);
        res.json(summary);
    }
    catch (error) {
        console.error('Revenue summary error:', error);
        next(error);
    }
});
exports.default = router;
