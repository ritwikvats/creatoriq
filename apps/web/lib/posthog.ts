import posthog from 'posthog-js';

export function initPostHog() {
  if (typeof window !== 'undefined' && !posthog.__loaded) {
    posthog.init(
      process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_PLACEHOLDER_KEY_REPLACE_LATER',
      {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        autocapture: true,
        capture_pageview: true,
        capture_pageleave: true,
        session_recording: {
          enabled: true,
          recordCrossOriginIframes: false,
        },
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            posthog.debug();
          }
        },
      }
    );
  }
}

export default posthog;
