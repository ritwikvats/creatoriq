"use strict";
/**
 * Logging Service for structured application logs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.taxLogger = exports.authLogger = exports.analyticsLogger = exports.apiLogger = exports.Logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "ERROR";
    LogLevel["WARN"] = "WARN";
    LogLevel["INFO"] = "INFO";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    constructor(serviceName = 'CreatorIQ') {
        this.serviceName = serviceName;
    }
    log(level, message, context) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...(context && { context }),
        };
        const formattedLog = `[${entry.timestamp}] [${level}] [${this.serviceName}] ${message}`;
        switch (level) {
            case LogLevel.ERROR:
                console.error(formattedLog, context || '');
                break;
            case LogLevel.WARN:
                console.warn(formattedLog, context || '');
                break;
            case LogLevel.INFO:
                console.log(formattedLog, context || '');
                break;
            case LogLevel.DEBUG:
                if (process.env.NODE_ENV === 'development') {
                    console.debug(formattedLog, context || '');
                }
                break;
        }
        // In production, you could send logs to external service (e.g., Sentry, LogRocket)
        if (process.env.NODE_ENV === 'production' && level === LogLevel.ERROR) {
            // TODO: Send to error tracking service
            // Example: Sentry.captureException(context?.error || message);
        }
    }
    error(message, error) {
        this.log(LogLevel.ERROR, message, {
            error: error?.message || error,
            stack: error?.stack,
        });
    }
    warn(message, context) {
        this.log(LogLevel.WARN, message, context);
    }
    info(message, context) {
        this.log(LogLevel.INFO, message, context);
    }
    debug(message, context) {
        this.log(LogLevel.DEBUG, message, context);
    }
    // Special method for API requests
    logRequest(method, path, userId, duration) {
        this.info(`${method} ${path}`, {
            userId,
            duration: duration ? `${duration}ms` : undefined,
        });
    }
    // Special method for analytics events
    logAnalytics(event, data) {
        this.info(`Analytics: ${event}`, data);
    }
}
exports.Logger = Logger;
// Singleton instances for different services
exports.apiLogger = new Logger('API');
exports.analyticsLogger = new Logger('Analytics');
exports.authLogger = new Logger('Auth');
exports.taxLogger = new Logger('Tax');
