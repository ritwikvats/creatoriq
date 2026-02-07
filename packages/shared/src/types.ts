// User Types
export interface User {
    id: string;
    email: string;
    full_name?: string;
    created_at: string;
    updated_at: string;
}

// Platform Types
export type PlatformType = 'youtube' | 'instagram' | 'linkedin' | 'twitter';

export interface ConnectedPlatform {
    id: string;
    user_id: string;
    platform: PlatformType;
    platform_user_id: string;
    platform_username: string;
    access_token: string; // Should be encrypted in production
    refresh_token?: string;
    token_expires_at?: string;
    connected_at: string;
    last_synced_at?: string;
}

// Analytics Types
export interface AnalyticsSnapshot {
    id: string;
    user_id: string;
    platform: PlatformType;
    snapshot_date: string;
    metrics: PlatformMetrics;
    created_at: string;
}

export interface PlatformMetrics {
    // Common metrics
    followers?: number;
    views?: number;
    impressions?: number;
    engagement_rate?: number;

    // YouTube specific
    subscribers?: number;
    watch_time_minutes?: number;
    video_count?: number;

    // Instagram specific
    reach?: number;
    profile_views?: number;
    posts_count?: number;

    // Additional platform-specific data
    [key: string]: any;
}

// Revenue Types
export type RevenueSource = 'adsense' | 'brand_deal' | 'affiliate' | 'merch' | 'other';

export interface RevenueEntry {
    id: string;
    user_id: string;
    source: RevenueSource;
    platform?: PlatformType;
    amount: number;
    currency: string;
    date: string;
    description?: string;
    gst_applicable?: boolean;
    gst_amount?: number;
    tds_deducted?: number;
    invoice_number?: string;
    created_at: string;
    updated_at: string;
}

// Tax Types
export interface TaxRecord {
    id: string;
    user_id: string;
    financial_year: string;
    quarter: string;
    total_income: number;
    gst_collected: number;
    tds_deducted: number;
    form_26as_data?: any;
    created_at: string;
    updated_at: string;
}

// Dashboard Types
export interface DashboardData {
    user: User;
    connectedPlatforms: ConnectedPlatform[];
    latestAnalytics: AnalyticsSnapshot[];
    totalRevenue: {
        thisMonth: number;
        lastMonth: number;
        bySource: Record<RevenueSource, number>;
    };
    aggregatedMetrics: {
        totalFollowers: number;
        totalViews: number;
        avgEngagementRate: number;
        growthRate: number;
    };
}
