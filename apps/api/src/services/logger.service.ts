/**
 * Logging Service for structured application logs
 */

export enum LogLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: any;
}

export class Logger {
    private serviceName: string;

    constructor(serviceName: string = 'CreatorIQ') {
        this.serviceName = serviceName;
    }

    private log(level: LogLevel, message: string, context?: any) {
        const entry: LogEntry = {
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

    error(message: string, error?: Error | any) {
        this.log(LogLevel.ERROR, message, {
            error: error?.message || error,
            stack: error?.stack,
        });
    }

    warn(message: string, context?: any) {
        this.log(LogLevel.WARN, message, context);
    }

    info(message: string, context?: any) {
        this.log(LogLevel.INFO, message, context);
    }

    debug(message: string, context?: any) {
        this.log(LogLevel.DEBUG, message, context);
    }

    // Special method for API requests
    logRequest(method: string, path: string, userId?: string, duration?: number) {
        this.info(`${method} ${path}`, {
            userId,
            duration: duration ? `${duration}ms` : undefined,
        });
    }

    // Special method for analytics events
    logAnalytics(event: string, data: any) {
        this.info(`Analytics: ${event}`, data);
    }
}

// Singleton instances for different services
export const apiLogger = new Logger('API');
export const analyticsLogger = new Logger('Analytics');
export const authLogger = new Logger('Auth');
export const taxLogger = new Logger('Tax');
