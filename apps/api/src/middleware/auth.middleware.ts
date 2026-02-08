import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { APIError } from './error-handler';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email?: string;
            };
        }
    }
}

/**
 * Get Supabase client with current environment variables
 */
function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new APIError('Missing Supabase configuration', 500);
    }

    return createClient(supabaseUrl, supabaseKey);
}

/**
 * Authentication middleware
 * Validates JWT token from Authorization header and attaches user to request
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new APIError('No authentication token provided', 401);
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token with Supabase
        const supabase = getSupabaseClient();
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            throw new APIError('Invalid or expired token', 401);
        }

        // Attach user to request
        req.user = {
            id: user.id,
            email: user.email,
        };

        next();
    } catch (error) {
        if (error instanceof APIError) {
            next(error);
        } else {
            next(new APIError('Authentication failed', 401));
        }
    }
}

/**
 * Optional authentication middleware
 * Attaches user to request if valid token is provided, but doesn't require it
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
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
    } catch (error) {
        // For optional auth, we don't fail on error, just continue without user
        next();
    }
}
