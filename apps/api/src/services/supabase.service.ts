import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { encryptionService } from './encryption.service';

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
    // Use upsert to update if snapshot for this date already exists
    const { data, error } = await supabase
        .from('analytics_snapshots')
        .upsert(snapshot, {
            onConflict: 'user_id,platform,snapshot_date', // Update if combination exists
            ignoreDuplicates: false, // Update instead of ignoring
        })
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

    // Decrypt access token before returning (with backward compatibility)
    if (data && data.access_token) {
        try {
            data.access_token = encryptionService.safeDecrypt(data.access_token);
        } catch (decryptError) {
            console.error('Failed to decrypt access token:', decryptError);
            throw new Error('Failed to decrypt access token');
        }
    }

    return data;
};

export const saveConnectedPlatform = async (platformData: any) => {
    // Encrypt access token before saving
    const dataToSave = { ...platformData };
    if (dataToSave.access_token) {
        dataToSave.access_token = encryptionService.encrypt(dataToSave.access_token);
    }

    const { data, error } = await supabase
        .from('connected_platforms')
        .upsert(dataToSave)
        .select()
        .single();

    if (error) throw error;

    // Decrypt access token in the returned data (with backward compatibility)
    if (data && data.access_token) {
        data.access_token = encryptionService.safeDecrypt(data.access_token);
    }

    return data;
};
