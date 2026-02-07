// Mock data for CreatorIQ development
// This provides realistic sample data while OAuth integrations are being built

export const mockUserData = {
    id: 'mock-user-123',
    email: 'creator@example.com',
    fullName: 'Ritwik Vats',
    createdAt: '2024-01-15T10:00:00Z',
};

export const mockYouTubeData = {
    platform: 'youtube',
    connected: true,
    username: 'RitwikTech',
    platformUserId: 'UC1234567890',
    stats: {
        subscribers: 12500,
        totalViews: 485000,
        totalVideos: 47,
        avgViewsPerVideo: 10319,
        engagementRate: 4.8, // percentage
        monthlyRevenue: 8500, // INR
    },
    recentVideos: [
        {
            id: 'vid-1',
            title: 'iPhone 15 Pro Review - India Edition',
            views: 45000,
            likes: 2100,
            comments: 340,
            publishedAt: '2024-02-01T14:00:00Z',
        },
        {
            id: 'vid-2',
            title: 'Best Budget Tech Under ₹50,000',
            views: 38000,
            likes: 1800,
            comments: 280,
            publishedAt: '2024-01-28T12:00:00Z',
        },
        {
            id: 'vid-3',
            title: 'M3 MacBook Pro - Worth it for Creators?',
            views: 52000,
            likes: 2500,
            comments: 410,
            publishedAt: '2024-01-25T16:00:00Z',
        },
    ],
};

export const mockInstagramData = {
    platform: 'instagram',
    connected: false,
    username: null,
    platformUserId: null,
    stats: null,
};

export const mockAnalyticsTimeline = [
    { date: '2024-01-04', views: 12000, subscribers: 12100, engagement: 4.2 },
    { date: '2024-01-11', views: 15000, subscribers: 12200, engagement: 4.5 },
    { date: '2024-01-18', views: 18000, subscribers: 12300, engagement: 4.7 },
    { date: '2024-01-25', views: 22000, subscribers: 12400, engagement: 4.8 },
    { date: '2024-02-01', views: 25000, subscribers: 12500, engagement: 4.8 },
];

export const mockRevenueData = [
    {
        id: 'rev-1',
        source: 'adsense',
        amount: 8500,
        currency: 'INR',
        description: 'YouTube AdSense January 2024',
        entryDate: '2024-01-31',
        createdAt: '2024-02-01T10:00:00Z',
    },
    {
        id: 'rev-2',
        source: 'brand_deal',
        amount: 25000,
        currency: 'INR',
        description: 'Sponsored video - Tech Brand',
        entryDate: '2024-01-15',
        createdAt: '2024-01-15T14:00:00Z',
    },
    {
        id: 'rev-3',
        source: 'affiliate',
        amount: 3500,
        currency: 'INR',
        description: 'Amazon Associates',
        entryDate: '2024-01-31',
        createdAt: '2024-02-01T10:00:00Z',
    },
];

export const mockRevenueBySource = [
    { source: 'AdSense', amount: 8500, percentage: 23 },
    { source: 'Brand Deals', amount: 25000, percentage: 68 },
    { source: 'Affiliates', amount: 3500, percentage: 9 },
];

export const mockRevenueTimeline = [
    { month: 'Oct 2023', amount: 28000 },
    { month: 'Nov 2023', amount: 32000 },
    { month: 'Dec 2023', amount: 35000 },
    { month: 'Jan 2024', amount: 37000 },
    { month: 'Feb 2024', amount: 37000 }, // Current month (partial)
];

export const mockTaxData = {
    financialYear: '2023-24',
    totalIncome: 420000, // INR
    gstCollected: 75600, // 18% on digital services
    tdsDeducted: 42000, // 10% on YouTube
    estimatedTax: 126000, // 30% income tax
    deductions: [
        { category: 'Equipment', amount: 80000 },
        { category: 'Software Subscriptions', amount: 25000 },
        { category: 'Internet & Utilities', amount: 18000 },
    ],
};

export const mockNotifications = [
    {
        id: 'notif-1',
        type: 'milestone',
        message: 'Congratulations! You crossed 12,000 subscribers! 🎉',
        timestamp: '2024-02-01T10:30:00Z',
        read: false,
    },
    {
        id: 'notif-2',
        type: 'revenue',
        message: 'New revenue entry: ₹8,500 from AdSense',
        timestamp: '2024-02-01T10:00:00Z',
        read: false,
    },
    {
        id: 'notif-3',
        type: 'sync',
        message: 'YouTube analytics synced successfully',
        timestamp: '2024-02-01T09:00:00Z',
        read: true,
    },
];

// Helper function to get total revenue
export const getTotalRevenue = () => {
    return mockRevenueData.reduce((sum, entry) => sum + entry.amount, 0);
};

// Helper function to get current month revenue
export const getCurrentMonthRevenue = () => {
    const currentMonth = new Date().getMonth();
    return mockRevenueData
        .filter((entry) => new Date(entry.entryDate).getMonth() === currentMonth)
        .reduce((sum, entry) => sum + entry.amount, 0);
};

// Helper function to calculate growth percentage
export const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
};
