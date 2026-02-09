"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveConnectedPlatform = exports.getConnectedPlatform = exports.saveAnalyticsSnapshot = exports.getUserById = exports.supabase = void 0;
exports.getSupabaseClient = getSupabaseClient;
const supabase_js_1 = require("@supabase/supabase-js");
const encryption_service_1 = require("./encryption.service");
let supabaseInstance = null;
// Lazy initialization - only create client when first accessed
function getSupabaseClient() {
    if (!supabaseInstance) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Supabase credentials not found in environment variables');
        }
        supabaseInstance = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
    }
    return supabaseInstance;
}
exports.supabase = new Proxy({}, {
    get(target, prop) {
        return getSupabaseClient()[prop];
    }
});
const getUserById = async (userId) => {
    const { data, error } = await exports.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
    if (error)
        throw error;
    return data;
};
exports.getUserById = getUserById;
const saveAnalyticsSnapshot = async (snapshot) => {
    // Use upsert to update if snapshot for this date already exists
    const { data, error } = await exports.supabase
        .from('analytics_snapshots')
        .upsert(snapshot, {
        onConflict: 'user_id,platform,snapshot_date', // Update if combination exists
        ignoreDuplicates: false, // Update instead of ignoring
    })
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.saveAnalyticsSnapshot = saveAnalyticsSnapshot;
const getConnectedPlatform = async (userId, platform) => {
    const { data, error } = await exports.supabase
        .from('connected_platforms')
        .select('*')
        .eq('user_id', userId)
        .eq('platform', platform)
        .single();
    if (error)
        throw error;
    // Decrypt access token before returning (with backward compatibility)
    if (data && data.access_token) {
        try {
            data.access_token = encryption_service_1.encryptionService.safeDecrypt(data.access_token);
        }
        catch (decryptError) {
            console.error('Failed to decrypt access token:', decryptError);
            throw new Error('Failed to decrypt access token');
        }
    }
    return data;
};
exports.getConnectedPlatform = getConnectedPlatform;
const saveConnectedPlatform = async (platformData) => {
    // Encrypt access token before saving
    const dataToSave = { ...platformData };
    if (dataToSave.access_token) {
        dataToSave.access_token = encryption_service_1.encryptionService.encrypt(dataToSave.access_token);
    }
    const { data, error } = await exports.supabase
        .from('connected_platforms')
        .upsert(dataToSave)
        .select()
        .single();
    if (error)
        throw error;
    // Decrypt access token in the returned data (with backward compatibility)
    if (data && data.access_token) {
        data.access_token = encryption_service_1.encryptionService.safeDecrypt(data.access_token);
    }
    return data;
};
exports.saveConnectedPlatform = saveConnectedPlatform;
