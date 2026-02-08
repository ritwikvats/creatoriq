import { Router } from 'express';
import { supabase } from '../services/supabase.service';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Get all deals for authenticated user
router.get('/', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;

    try {
        const { data, error } = await supabase
            .from('deals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        next(error);
    }
});

// Create a new deal
router.post('/', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;
    const { brand_name, status, amount, currency, contact_email, notes } = req.body;

    try {
        const { data, error } = await supabase
            .from('deals')
            .insert({
                user_id: userId, // Use authenticated user ID
                brand_name,
                status: status || 'pitching',
                amount,
                currency: currency || 'INR',
                contact_email,
                notes
            })
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        next(error);
    }
});

// Update deal status (drag and drop)
router.patch('/:id', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;
    const { id } = req.params;
    const { status, amount, notes, next_action_date } = req.body;

    try {
        const { data, error } = await supabase
            .from('deals')
            .update({
                ...(status && { status }),
                ...(amount && { amount }),
                ...(notes && { notes }),
                ...(next_action_date && { next_action_date }),
                updated_at: new Date()
            })
            .eq('id', id)
            .eq('user_id', userId) // Ensure user owns this deal
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        next(error);
    }
});

// Delete a deal
router.delete('/:id', requireAuth, async (req, res, next) => {
    const userId = req.user!.id;
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('deals')
            .delete()
            .eq('id', id)
            .eq('user_id', userId); // Ensure user owns this deal

        if (error) throw error;
        res.json({ success: true });
    } catch (error: any) {
        next(error);
    }
});

export default router;
