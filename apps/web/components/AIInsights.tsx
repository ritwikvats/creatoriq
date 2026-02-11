'use client';

import { useState } from 'react';
import {
    Sparkles, TrendingUp, DollarSign, Lightbulb, RefreshCw,
    MessageCircle, Zap, Target, Rocket, PenLine, Hash, CalendarDays
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api } from '@/lib/api-client';
import AIChatPanel from './AIChatPanel';

interface InsightSection {
    icon: string;
    title: string;
    content: string;
    color: string;
}

const SECTION_STYLES: Record<string, { icon: typeof TrendingUp; bg: string; border: string; iconColor: string }> = {
    'performance': { icon: TrendingUp, bg: 'bg-blue-50', border: 'border-blue-100', iconColor: 'text-blue-600' },
    'strengths': { icon: Target, bg: 'bg-green-50', border: 'border-green-100', iconColor: 'text-green-600' },
    'opportunities': { icon: Zap, bg: 'bg-amber-50', border: 'border-amber-100', iconColor: 'text-amber-600' },
    'actions': { icon: Rocket, bg: 'bg-purple-50', border: 'border-purple-100', iconColor: 'text-purple-600' },
    'goal': { icon: Target, bg: 'bg-primary-50', border: 'border-primary-100', iconColor: 'text-primary-600' },
    'default': { icon: Lightbulb, bg: 'bg-gray-50', border: 'border-gray-100', iconColor: 'text-gray-600' },
};

function getSectionStyle(title: string) {
    const lower = title.toLowerCase();
    if (lower.includes('performance') || lower.includes('overview')) return SECTION_STYLES.performance;
    if (lower.includes('strength')) return SECTION_STYLES.strengths;
    if (lower.includes('opportunit') || lower.includes('growth')) return SECTION_STYLES.opportunities;
    if (lower.includes('action') || lower.includes('recommendation')) return SECTION_STYLES.actions;
    if (lower.includes('goal')) return SECTION_STYLES.goal;
    return SECTION_STYLES.default;
}

function parseInsightsIntoSections(markdown: string): InsightSection[] {
    const sections: InsightSection[] = [];
    const parts = markdown.split(/^## /m).filter(Boolean);

    for (const part of parts) {
        const lines = part.trim().split('\n');
        const titleLine = lines[0] || '';
        const content = lines.slice(1).join('\n').trim();

        // Clean emoji from title
        const cleanTitle = titleLine.replace(/^[^\w]*/, '').trim();

        if (cleanTitle && content) {
            sections.push({
                icon: titleLine.match(/[\p{Emoji}]/u)?.[0] || '',
                title: cleanTitle,
                content,
                color: '',
            });
        }
    }

    return sections;
}

const QUICK_ACTIONS = [
    { label: 'Rewrite Captions', icon: PenLine, message: 'Rewrite my 5 most recent Instagram captions to maximize comments and engagement. Show the original vs new version for each.', color: 'from-pink-500 to-rose-500' },
    { label: 'Content Calendar', icon: CalendarDays, message: 'Build me a detailed 7-day content calendar with specific post ideas, best times to post, and hashtags for each day.', color: 'from-blue-500 to-cyan-500' },
    { label: 'Hashtag Strategy', icon: Hash, message: 'Create 5 hashtag sets of 20 hashtags each for different content types in my niche. Mix popular, medium, and niche hashtags.', color: 'from-purple-500 to-violet-500' },
    { label: 'Growth Plan', icon: Rocket, message: 'Build a detailed 30-day growth plan for a sub-1K Instagram creator. Include daily actions, content types, engagement strategies, and milestone targets.', color: 'from-amber-500 to-orange-500' },
];

export default function AIInsights() {
    const [insights, setInsights] = useState<string>('');
    const [sections, setSections] = useState<InsightSection[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [chatOpen, setChatOpen] = useState(false);
    const [chatInitialMessage, setChatInitialMessage] = useState<string>('');
    const [analyticsData, setAnalyticsData] = useState<any>(null);

    async function gatherAnalytics() {
        let instagramData = null;
        try {
            instagramData = await api.get('/instagram/analytics');
        } catch (err) {
            console.log('Instagram data not available');
        }

        let youtubeData = null;
        try {
            youtubeData = await api.get('/youtube/stats');
        } catch (err) {
            console.log('YouTube data not available');
        }

        const data = {
            instagram: instagramData?.account ? {
                followers: instagramData.account.followers_count || 0,
                posts: instagramData.account.media_count || 0,
                engagementRate: instagramData.account.engagement_rate || instagramData.stats?.engagement_rate || 0,
                avgLikes: Math.round(instagramData.account.avg_likes || 0),
                avgComments: Math.round(instagramData.account.avg_comments || 0),
                topPosts: instagramData.topPosts?.slice(0, 3) || [],
                username: instagramData.account.username || ''
            } : null,
            youtube: youtubeData?.channel ? {
                subscribers: youtubeData.channel.subscriberCount || 0,
                totalViews: youtubeData.channel.totalViews || 0,
                totalVideos: youtubeData.channel.totalVideos || 0,
                channelName: youtubeData.channel.channelName || ''
            } : null
        };

        setAnalyticsData(data);
        return data;
    }

    async function generateInsights() {
        setLoading(true);
        setError('');

        try {
            const analytics = await gatherAnalytics();
            const data = await api.post('/ai/insights', { analytics });

            setInsights(data.insights);
            const parsed = parseInsightsIntoSections(data.insights);
            setSections(parsed);
        } catch (err: any) {
            setError(err.message || 'Failed to generate AI insights');
        } finally {
            setLoading(false);
        }
    }

    function handleQuickAction(message: string) {
        setChatInitialMessage(message);
        setChatOpen(true);
    }

    function openChat() {
        setChatInitialMessage('');
        setChatOpen(true);
    }

    return (
        <>
            <div className="bg-gradient-to-br from-primary-50 via-white to-purple-50 rounded-2xl p-6 shadow-lg border border-primary-100">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl shadow-md">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-dark-800">AI Insights</h3>
                            <p className="text-xs text-dark-500">Personalized growth recommendations</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 bg-gradient-to-r from-purple-600 to-primary-600 text-white rounded-full">
                        GPT-5.2
                    </span>
                </div>

                {/* Generate Button */}
                {!insights && !loading && !error && (
                    <button
                        onClick={generateInsights}
                        className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-5 h-5" />
                        Generate AI Insights
                    </button>
                )}

                {/* Loading */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="relative w-12 h-12 mx-auto mb-3">
                            <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
                            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-primary-600 animate-pulse" />
                        </div>
                        <p className="text-dark-600 text-sm animate-pulse">Analyzing your data...</p>
                    </div>
                )}

                {/* Insight Cards */}
                {sections.length > 0 && (
                    <div className="space-y-3">
                        {sections.map((section, i) => {
                            const style = getSectionStyle(section.title);
                            const IconComponent = style.icon;
                            return (
                                <div key={i} className={`${style.bg} ${style.border} border rounded-xl p-4 transition-all hover:shadow-sm`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <IconComponent className={`w-4 h-4 ${style.iconColor}`} />
                                        <h4 className="font-bold text-dark-800 text-sm">{section.title}</h4>
                                    </div>
                                    <div className="prose prose-sm max-w-none
                                        prose-p:text-dark-600 prose-p:my-1 prose-p:text-xs prose-p:leading-relaxed
                                        prose-li:text-dark-600 prose-li:text-xs prose-li:my-0.5
                                        prose-strong:text-dark-800 prose-strong:text-xs
                                        prose-ul:my-1 prose-ol:my-1">
                                        <ReactMarkdown>{section.content}</ReactMarkdown>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Regenerate */}
                        <button
                            onClick={generateInsights}
                            disabled={loading}
                            className="w-full text-primary-600 hover:text-primary-700 font-medium text-xs flex items-center justify-center gap-1 py-2"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Regenerate
                        </button>
                    </div>
                )}

                {/* Fallback if parsing fails - show raw markdown */}
                {insights && sections.length === 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="prose prose-sm max-w-none
                            prose-headings:text-dark-800 prose-headings:font-bold prose-headings:mt-3 prose-headings:mb-1
                            prose-p:text-dark-600 prose-p:my-1 prose-p:text-xs
                            prose-li:text-dark-600 prose-li:text-xs
                            prose-strong:text-dark-800
                            prose-ul:my-1 prose-ol:my-1">
                            <ReactMarkdown>{insights}</ReactMarkdown>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                        <button onClick={generateInsights} className="mt-2 text-red-600 text-xs font-medium hover:underline">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-100 my-4"></div>

                {/* Quick Actions */}
                <div>
                    <p className="text-xs font-semibold text-dark-700 mb-2.5 uppercase tracking-wide">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-2">
                        {QUICK_ACTIONS.map((action) => {
                            const IconComp = action.icon;
                            return (
                                <button
                                    key={action.label}
                                    onClick={() => handleQuickAction(action.message)}
                                    className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50 transition-all text-left group"
                                >
                                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${action.color} shadow-sm`}>
                                        <IconComp className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-dark-700 group-hover:text-primary-700">{action.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Chat Button */}
                <button
                    onClick={openChat}
                    className="w-full mt-4 py-2.5 px-4 bg-dark-800 text-white font-medium rounded-xl hover:bg-dark-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                    <MessageCircle className="w-4 h-4" />
                    Chat with AI
                </button>
            </div>

            {/* Chat Panel */}
            <AIChatPanel
                isOpen={chatOpen}
                onClose={() => { setChatOpen(false); setChatInitialMessage(''); }}
                analytics={analyticsData}
                initialMessage={chatInitialMessage}
            />
        </>
    );
}
