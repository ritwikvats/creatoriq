import posthog from './posthog';

/**
 * Track an analytics event
 * @param eventName - Name of the event to track
 * @param properties - Additional properties to attach to the event
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Identify the current user
 * @param userId - User ID
 * @param traits - User properties (email, name, etc.)
 */
export function identifyUser(userId: string, traits?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.identify(userId, traits);
  }
}

/**
 * Reset user identity (on logout)
 */
export function resetUser() {
  if (typeof window !== 'undefined') {
    posthog.reset();
  }
}

// Predefined event tracking helpers
export const analytics = {
  // Authentication events
  signupCompleted: (userId: string, email: string) => {
    trackEvent('signup_complete', { userId, email });
  },

  loginCompleted: (userId: string) => {
    trackEvent('login_complete', { userId });
  },

  logoutCompleted: () => {
    trackEvent('logout_complete');
    resetUser();
  },

  // Platform connection events
  platformConnected: (platform: 'instagram' | 'youtube', username: string) => {
    trackEvent('platform_connected', { platform, username });
  },

  platformDisconnected: (platform: 'instagram' | 'youtube') => {
    trackEvent('platform_disconnected', { platform });
  },

  // Analytics events
  analyticsViewed: (platform: 'instagram' | 'youtube') => {
    trackEvent('analytics_viewed', { platform });
  },

  demographicsViewed: (platform: 'instagram' | 'youtube') => {
    trackEvent('demographics_viewed', { platform });
  },

  // AI events
  insightsGenerated: (platform?: string) => {
    trackEvent('insights_generated', { platform });
  },

  contentIdeasGenerated: () => {
    trackEvent('content_ideas_generated');
  },

  // Revenue events
  revenueAdded: (source: string, amount: number) => {
    trackEvent('revenue_added', { source, amount });
  },

  // Export events
  dataExported: (type: 'analytics' | 'revenue' | 'tax') => {
    trackEvent('data_exported', { type });
  },
};
