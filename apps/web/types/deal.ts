export type DealStatus = 'pitching' | 'negotiating' | 'contract_sent' | 'closed_won' | 'closed_lost';

export interface Deal {
    id: string;
    user_id: string;
    brand_name: string;
    status: DealStatus;
    amount: number | null;
    currency: string;
    contact_email: string | null;
    next_action_date: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}
