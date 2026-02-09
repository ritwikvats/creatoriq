"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const openclaw_service_1 = require("./openclaw.service");
const logger_service_1 = require("./logger.service");
/**
 * AI Service for CreatorIQ
 * Primary: OpenClaw AI (advanced capabilities)
 * Fallback: Groq (Llama 3.3 models)
 */
// Lazy initialization for Groq
let groqInstance = null;
function getGroqClient() {
    if (!groqInstance) {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error('GROQ_API_KEY environment variable is missing');
        }
        groqInstance = new groq_sdk_1.default({ apiKey });
    }
    return groqInstance;
}
exports.aiService = {
    /**
     * Generate AI-powered insights from analytics data
     * Primary: OpenClaw | Fallback: Groq
     */
    async generateInsights(analyticsData) {
        // Try OpenClaw first (primary provider)
        if (openclaw_service_1.openClawService.isAvailable()) {
            try {
                logger_service_1.apiLogger.info('Using OpenClaw for insights generation');
                return await openclaw_service_1.openClawService.generateInsights(analyticsData);
            }
            catch (error) {
                logger_service_1.apiLogger.warn('OpenClaw failed, falling back to Groq', { error });
            }
        }
        // Fallback to Groq
        try {
            logger_service_1.apiLogger.info('Using Groq (fallback) for insights generation');
            const groq = getGroqClient();
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert creator analytics consultant. Provide concise, actionable insights in 3-4 bullet points. Focus on growth opportunities and optimization strategies specific to Indian content creators.'
                    },
                    {
                        role: 'user',
                        content: `Analyze this creator's performance data and provide insights:\n\nViews: ${analyticsData.views || 0}\nEngagement Rate: ${analyticsData.engagement || 0}%\nSubscribers: ${analyticsData.subscribers || 0}\nRevenue: ₹${analyticsData.revenue || 0}\n\nProvide 3-4 actionable insights.`
                    }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 300,
            });
            return completion.choices[0]?.message?.content || 'Unable to generate insights at this time.';
        }
        catch (error) {
            console.error('AI Insights Error:', error);
            throw new Error('Failed to generate AI insights');
        }
    },
    /**
     * Categorize revenue for tax purposes
     * Primary: OpenClaw | Fallback: Groq
     */
    async categorizeTax(description, amount) {
        // Try OpenClaw first
        if (openclaw_service_1.openClawService.isAvailable()) {
            try {
                logger_service_1.apiLogger.info('Using OpenClaw for tax categorization');
                return await openclaw_service_1.openClawService.categorizeTax(description, amount);
            }
            catch (error) {
                logger_service_1.apiLogger.warn('OpenClaw failed, falling back to Groq', { error });
            }
        }
        // Fallback to Groq
        try {
            logger_service_1.apiLogger.info('Using Groq (fallback) for tax categorization');
            const groq = getGroqClient();
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are an India tax expert for content creators. Categorize income sources and suggest applicable GST and TDS rates. Be specific about Indian tax regulations.'
                    },
                    {
                        role: 'user',
                        content: `Categorize this income for tax purposes:\n\nDescription: "${description}"\nAmount: ₹${amount}\n\nProvide: Category, GST applicability, TDS rate, and any relevant deductions.`
                    }
                ],
                model: 'llama-3.2-1b-preview',
                temperature: 0.3,
                max_tokens: 200,
            });
            return completion.choices[0]?.message?.content || 'Unable to categorize';
        }
        catch (error) {
            console.error('Tax Categorization Error:', error);
            throw new Error('Failed to categorize tax');
        }
    },
    /**
     * Generate content ideas based on niche and trends
     * Primary: OpenClaw | Fallback: Groq
     */
    async generateContentIdeas(niche, recentTopics = []) {
        // Try OpenClaw first
        if (openclaw_service_1.openClawService.isAvailable()) {
            try {
                logger_service_1.apiLogger.info('Using OpenClaw for content ideas');
                const analytics = { subscribers: 0, avgViews: 0, engagementRate: 0 };
                return await openclaw_service_1.openClawService.generateContentIdeas(niche, analytics);
            }
            catch (error) {
                logger_service_1.apiLogger.warn('OpenClaw failed, falling back to Groq', { error });
            }
        }
        // Fallback to Groq
        try {
            logger_service_1.apiLogger.info('Using Groq (fallback) for content ideas');
            const groq = getGroqClient();
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a viral content strategist for YouTube and Instagram creators in India. Generate trending, India-relevant content ideas that have high viral potential.'
                    },
                    {
                        role: 'user',
                        content: `Generate 5 viral content ideas for a ${niche} creator.\n\nRecent successful topics: ${recentTopics.join(', ') || 'None'}\n\nMake ideas specific to Indian audience and current trends. Format as a numbered list.`
                    }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.9,
                max_tokens: 400,
            });
            return completion.choices[0]?.message?.content || 'Unable to generate ideas';
        }
        catch (error) {
            console.error('Content Ideas Error:', error);
            throw new Error('Failed to generate content ideas');
        }
    },
    /**
     * Analyze revenue trends and provide financial advice
     * Primary: OpenClaw | Fallback: Groq
     */
    async analyzeRevenue(revenueHistory) {
        // Try OpenClaw first
        if (openclaw_service_1.openClawService.isAvailable()) {
            try {
                logger_service_1.apiLogger.info('Using OpenClaw for revenue analysis');
                const revenueData = revenueHistory.map(item => ({
                    date: item.month,
                    amount: item.amount,
                    source: 'mixed'
                }));
                return await openclaw_service_1.openClawService.analyzeRevenue(revenueData);
            }
            catch (error) {
                logger_service_1.apiLogger.warn('OpenClaw failed, falling back to Groq', { error });
            }
        }
        // Fallback to Groq
        try {
            logger_service_1.apiLogger.info('Using Groq (fallback) for revenue analysis');
            const groq = getGroqClient();
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a financial advisor for content creators in India. Analyze revenue patterns and provide tax-saving strategies and growth advice.'
                    },
                    {
                        role: 'user',
                        content: `Analyze this revenue history and provide insights:\n\n${JSON.stringify(revenueHistory, null, 2)}\n\nProvide: Trends, tax optimization tips, and growth recommendations.`
                    }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.5,
                max_tokens: 350,
            });
            return completion.choices[0]?.message?.content || 'Unable to analyze revenue';
        }
        catch (error) {
            console.error('Revenue Analysis Error:', error);
            throw new Error('Failed to analyze revenue');
        }
    }
};
