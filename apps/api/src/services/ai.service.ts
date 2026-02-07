import Groq from 'groq-sdk';

// Lazy initialization - only create client when first accessed
let groqInstance: Groq | null = null;

function getGroqClient(): Groq {
    if (!groqInstance) {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error('GROQ_API_KEY environment variable is missing');
        }
        groqInstance = new Groq({ apiKey });
    }
    return groqInstance;
}

/**
 * AI Service for CreatorIQ
 * Uses Llama 3.1 70B for best quality insights
 */
export const aiService = {
    /**
     * Generate AI-powered insights from analytics data
     * Model: llama-3.1-70b-versatile (best for complex analysis)
     */
    async generateInsights(analyticsData: {
        views?: number;
        engagement?: number;
        subscribers?: number;
        revenue?: number;
    }) {
        try {
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
                model: 'llama-3.3-70b-versatile', // Latest Llama 3.3 model
                temperature: 0.7,
                max_tokens: 300,
            });

            return completion.choices[0]?.message?.content || 'Unable to generate insights at this time.';
        } catch (error) {
            console.error('AI Insights Error:', error);
            throw new Error('Failed to generate AI insights');
        }
    },

    /**
     * Categorize revenue for tax purposes
     * Model: llama-3.1-8b-instant (faster for simple tasks)
     */
    async categorizeTax(description: string, amount: number) {
        try {
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
                model: 'llama-3.2-1b-preview', // Fast and efficient
                temperature: 0.3, // Lower for more consistent categorization
                max_tokens: 200,
            });

            return completion.choices[0]?.message?.content || 'Unable to categorize';
        } catch (error) {
            console.error('Tax Categorization Error:', error);
            throw new Error('Failed to categorize tax');
        }
    },

    /**
     * Generate content ideas based on niche and trends
     * Model: llama-3.1-70b-versatile (best for creative generation)
     */
    async generateContentIdeas(niche: string, recentTopics: string[] = []) {
        try {
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
                model: 'llama-3.3-70b-versatile', // Best for creative tasks
                temperature: 0.9, // Higher for more creative ideas
                max_tokens: 400,
            });

            return completion.choices[0]?.message?.content || 'Unable to generate ideas';
        } catch (error) {
            console.error('Content Ideas Error:', error);
            throw new Error('Failed to generate content ideas');
        }
    },

    /**
     * Analyze revenue trends and provide financial advice
     * Model: llama-3.1-70b-versatile (best for financial analysis)
     */
    async analyzeRevenue(revenueHistory: { month: string; amount: number }[]) {
        try {
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
        } catch (error) {
            console.error('Revenue Analysis Error:', error);
            throw new Error('Failed to analyze revenue');
        }
    }
};
