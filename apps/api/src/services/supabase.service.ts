import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

// Lazy initialization - only create client when first accessed
export function getSupabaseClient(): SupabaseClient {
    if (!supabaseInstance) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Supabase credentials not found in environment variables');
        }

        supabaseInstance = createClient(supabaseUrl, supabaseServiceKey);
    }
    return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient, {
    get(target, prop) {
        return (getSupabaseClient() as any)[prop];
    }
});

export const getUserById = async (userId: string) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
};

export const saveAnalyticsSnapshot = async (snapshot: any) => {
    const { data, error } = await supabase
        .from('analytics_snapshots')
        .insert(snapshot)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getConnectedPlatform = async (userId: string, platform: 'youtube' | 'instagram') => {
    const { data, error } = await supabase
        .from('connected_platforms')
        .select('*')
        .eq('user_id', userId)
        .eq('platform', platform)
        .single();

    if (error) throw error;
    return data;
};

export const saveConnectedPlatform = async (platformData: any) => {
    const { data, error } = await supabase
        .from('connected_platforms')
        .upsert(platformData)
        .select()
        .single();

    if (error) throw error;
    return data;
};
