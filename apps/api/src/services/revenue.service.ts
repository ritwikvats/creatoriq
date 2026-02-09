import { supabase } from './supabase.service';
import { aiService } from './ai.service';

export class RevenueService {
    /**
     * Get all revenue entries for a user with optional date filtering
     */
    async getRevenue(userId: string, startDate?: string, endDate?: string) {
        let query = supabase
            .from('revenue_entries')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (startDate) {
            query = query.gte('date', startDate);
        }
        if (endDate) {
            query = query.lte('date', endDate);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    }

    /**
     * Add a new revenue entry with AI-assisted categorization
     */
    async createRevenue(entry: any) {
        // Prepare revenue data for AI categorization
        const { description, amount, source } = entry;

        // AI categorization logic (simplified for now)
        // In a real scenario, we'd call aiService to suggest GST/TDS based on source/description
        let gst_applicable = entry.gst_applicable || false;
        let gst_amount = entry.gst_amount || 0;
        let tds_deducted = entry.tds_deducted || 0;

        // Auto-categorize based on common Indian rules if not provided
        if (source === 'adsense' || source === 'brand_deal') {
            if (entry.tds_deducted === undefined) {
                tds_deducted = amount * 0.10; // 10% TDS for professional services
            }
        }

        const { data, error } = await supabase
            .from('revenue_entries')
            .insert({
                ...entry,
                gst_applicable,
                gst_amount,
                tds_deducted,
                currency: entry.currency || 'INR',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Get revenue summary for dashboard
     */
    async getSummary(userId: string, startDate?: string, endDate?: string) {
        const data = await this.getRevenue(userId, startDate, endDate);

        const bySource: Record<string, number> = {};
        let totalAmount = 0;
        let totalGst = 0;
        let totalTds = 0;

        data.forEach((entry: any) => {
            const amount = parseFloat(entry.amount) || 0;
            const source = entry.source || 'other';

            bySource[source] = (bySource[source] || 0) + amount;
            totalAmount += amount;
            totalGst += parseFloat(entry.gst_amount) || 0;
            totalTds += parseFloat(entry.tds_deducted) || 0;
        });

        return {
            total: totalAmount,
            bySource,
            totalGst,
            totalTds,
            count: data.length,
            netIncome: totalAmount - totalTds,
        };
    }

    /**
     * Update an existing revenue entry
     */
    async updateRevenue(id: string, updates: any) {
        const { data, error } = await supabase
            .from('revenue_entries')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Delete a revenue entry (with user ownership verification)
     */
    async deleteRevenue(id: string, userId: string) {
        const { error } = await supabase
            .from('revenue_entries')
            .delete()
            .eq('id', id)
            .eq('user_id', userId); // Ensure user owns this entry

        if (error) throw error;
        return true;
    }
}

export const revenueService = new RevenueService();
