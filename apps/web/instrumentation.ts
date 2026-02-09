import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side Sentry initialization
    Sentry.init({
      dsn: process.env.SENTRY_DSN || 'https://examplePublicKey@o0.ingest.sentry.io/0',
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 1.0,

      // Filter sensitive data
      beforeSend(event, hint) {
        // Remove authorization headers
        if (event.request?.headers) {
          delete event.request.headers['authorization'];
          delete event.request.headers['cookie'];
        }

        // Remove sensitive query params
        if (event.request?.query_string && typeof event.request.query_string === 'string') {
          event.request.query_string = event.request.query_string
            .replace(/token=[^&]*/g, 'token=REDACTED')
            .replace(/key=[^&]*/g, 'key=REDACTED');
        }

        return event;
      },
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime Sentry initialization
    Sentry.init({
      dsn: process.env.SENTRY_DSN || 'https://examplePublicKey@o0.ingest.sentry.io/0',
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 1.0,
    });
  }
}
