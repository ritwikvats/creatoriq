import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global error handling middleware
 */
export function errorHandler(
    err: Error | APIError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Default to 500 server error
    let statusCode = 500;
    let message = 'Internal Server Error';
    let isOperational = false;

    if (err instanceof APIError) {
        statusCode = err.statusCode;
        message = err.message;
        isOperational = err.isOperational;
    } else if (err.message) {
        message = err.message;
    }

    // Log error
    console.error('❌ Error:', {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        statusCode,
        message,
        stack: err.stack,
        isOperational,
    });

    // Don't leak error details in production for non-operational errors
    if (process.env.NODE_ENV === 'production' && !isOperational) {
        message = 'An unexpected error occurred';
    }

    // Send error response
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err,
        }),
    });
}

/**
 * Async route handler wrapper to catch errors
 */
export function asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

/**
 * 404 handler
 */
export function notFoundHandler(req: Request, res: Response) {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
        method: req.method,
    });
}
