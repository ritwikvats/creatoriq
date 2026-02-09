"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIError = void 0;
exports.errorHandler = errorHandler;
exports.asyncHandler = asyncHandler;
exports.notFoundHandler = notFoundHandler;
/**
 * Custom error class for API errors
 */
class APIError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.APIError = APIError;
/**
 * Global error handling middleware
 */
function errorHandler(err, req, res, next) {
    // Default to 500 server error
    let statusCode = 500;
    let message = 'Internal Server Error';
    let isOperational = false;
    if (err instanceof APIError) {
        statusCode = err.statusCode;
        message = err.message;
        isOperational = err.isOperational;
    }
    else if (err.message) {
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
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
/**
 * 404 handler
 */
function notFoundHandler(req, res) {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
        method: req.method,
    });
}
