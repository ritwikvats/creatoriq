"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.optionalAuth = optionalAuth;
const supabase_js_1 = require("@supabase/supabase-js");
const error_handler_1 = require("./error-handler");
/**
 * Get Supabase client with current environment variables
 */
function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
        throw new error_handler_1.APIError('Missing Supabase configuration', 500);
    }
    return (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
}
/**
 * Authentication middleware
 * Validates JWT token from Authorization header and attaches user to request
 */
async function requireAuth(req, res, next) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new error_handler_1.APIError('No authentication token provided', 401);
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        // Verify token with Supabase
        const supabase = getSupabaseClient();
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            throw new error_handler_1.APIError('Invalid or expired token', 401);
        }
        // Attach user to request
        req.user = {
            id: user.id,
            email: user.email,
        };
        next();
    }
    catch (error) {
        if (error instanceof error_handler_1.APIError) {
            next(error);
        }
        else {
            next(new error_handler_1.APIError('Authentication failed', 401));
        }
    }
}
/**
 * Optional authentication middleware
 * Attaches user to request if valid token is provided, but doesn't require it
 */
async function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const supabase = getSupabaseClient();
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (!error && user) {
                req.user = {
                    id: user.id,
                    email: user.email,
                };
            }
        }
        next();
    }
    catch (error) {
        // For optional auth, we don't fail on error, just continue without user
        next();
    }
}
