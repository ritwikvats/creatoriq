import { Router } from 'express';
import { supabase } from '../services/supabase.service';

const router = Router();

// Get all deals for a user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const { data, error } = await supabase
            .from('deals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new deal
router.post('/', async (req, res) => {
    const { user_id, brand_name, status, amount, currency, contact_email, notes } = req.body;

    try {
        const { data, error } = await supabase
            .from('deals')
            .insert({
                user_id,
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
        res.status(500).json({ error: error.message });
    }
});

// Update deal status (drag and drop)
router.patch('/:id', async (req, res) => {
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
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a deal
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('deals')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
