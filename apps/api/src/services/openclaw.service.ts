import axios from 'axios';

/**
 * OpenClaw/Fuelix AI Service - Primary AI Provider
 * Provides AI-powered insights, code generation, and content suggestions
 * Uses Fuelix API (OpenAI-compatible) - the same provider used by OpenClaw CLI
 */

const FUELIX_MODEL = 'gpt-5.2-chat-2025-12-11'; // Primary Fuelix model
const FUELIX_MODEL_MINI = 'gpt-5-mini-2025-08-07'; // Fallback for faster responses

class OpenClawService {
    private apiKey: string;
    private baseUrl: string;
    private initialized = false;

    constructor() {
        // Don't read env vars at construction time - they may not be loaded yet
        this.apiKey = '';
        this.baseUrl = '';
    }

    /**
     * Lazy initialization - reads env vars when first called
     */
    private ensureInitialized() {
        if (!this.initialized) {
            this.apiKey = process.env.OPENCLAW_API_KEY || '';
            this.baseUrl = process.env.OPENCLAW_API_URL || 'https://api.fuelix.ai/v1';
            this.initialized = true;

            if (!this.apiKey) {
                console.warn('⚠️ OPENCLAW_API_KEY not set. OpenClaw features will be limited.');
            } else {
                console.log('✅ Fuelix AI initialized:', this.apiKey.substring(0, 10) + '...');
                console.log('   Base URL:', this.baseUrl);
            }
        }
    }

    /**
     * Check if OpenClaw is available
     */
    isAvailable(): boolean {
        this.ensureInitialized();
        return !!this.apiKey;
    }

    /**
     * Make a request to OpenClaw API
     */
    private async makeRequest(endpoint: string, data: any) {
        this.ensureInitialized();

        if (!this.apiKey) {
            throw new Error('OpenClaw API key not configured');
        }

        try {
            const response = await axios.post(`${this.baseUrl}${endpoint}`, data, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });

            return response.data;
        } catch (error: any) {
            console.error('OpenClaw API Error:', error.response?.data || error.message);
            throw new Error(`OpenClaw API request failed: ${error.message}`);
        }
    }

    /**
     * Generate AI insights from analytics data
     */
    async generateInsights(analytics: any): Promise<string> {
        // Build detailed context from actual platform data
        const instagramContext = analytics.instagram ? `
**Instagram Account:** @${analytics.instagram.username}
📊 **Current Metrics:**
- Followers: ${analytics.instagram.followers.toLocaleString()}
- Total Posts: ${analytics.instagram.posts}
- Engagement Rate: ${analytics.instagram.engagementRate}%
- Avg Likes per Post: ${analytics.instagram.avgLikes.toLocaleString()}
- Avg Comments per Post: ${analytics.instagram.avgComments}

**Top Performing Posts:**
${analytics.instagram.topPosts?.map((post: any, i: number) =>
    `${i + 1}. ${post.like_count || 0} likes, ${post.comments_count || 0} comments`
).join('\n') || 'No data available'}
` : 'Instagram: Not connected';

        const youtubeContext = analytics.youtube ? `
**YouTube Channel:** ${analytics.youtube.channelName}
📊 **Current Metrics:**
- Subscribers: ${analytics.youtube.subscribers.toLocaleString()}
- Total Views: ${analytics.youtube.totalViews.toLocaleString()}
- Total Videos: ${analytics.youtube.totalVideos}
- Avg Views per Video: ${Math.round(analytics.youtube.totalViews / analytics.youtube.totalVideos).toLocaleString()}
` : 'YouTube: Not connected';

        const prompt = `Analyze this creator's data. Give short, clean insights.

DATA:
${instagramContext}
${youtubeContext}

FORMAT (use ## for section headers ONLY, NO other markdown):

## Performance Overview
2-3 plain text sentences. Compare to benchmarks.

## Key Strengths
- Short one-liner strength
- Another one-liner

## Growth Opportunities
- One clear gap to fix
- Another opportunity

## Action Items
1. Do this — one line why
2. Do this — one line why
3. Do this — one line why

## 30-Day Goal
One sentence with a specific number target.

CRITICAL RULES:
- EVERY section MUST start with ## followed by the header (e.g. ## Performance Overview)
- No ** bold, no ### sub-headers, no backticks
- Plain text with - bullets and 1. 2. 3. numbered lists
- Each bullet = ONE short line, MAX 2-3 per section
- Use their real numbers, no fluff`;

        try {
            const response = await this.makeRequest('/chat/completions', {
                model: FUELIX_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a concise creator growth consultant. You MUST start each section with ## (e.g. "## Performance Overview"). Use - for bullets and 1. 2. 3. for numbered lists. Do NOT use ** bold or ### sub-headers. Keep everything short and scannable.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 600,
            });

            return response.choices?.[0]?.message?.content || 'Unable to generate insights';
        } catch (error) {
            throw error;
        }
    }

    /**
     * Generate content ideas based on niche and analytics
     */
    async generateContentIdeas(niche: string, analytics: any): Promise<string[]> {
        const prompt = `Generate 5 high-performing content ideas for a ${niche} creator with the following stats:
- Subscribers: ${analytics.subscribers || 0}
- Avg Views: ${analytics.avgViews || 0}
- Engagement Rate: ${analytics.engagementRate || 0}%

Focus on trending topics, viral potential, and audience engagement. Return as a JSON array of content ideas.`;

        try {
            const response = await this.makeRequest('/chat/completions', {
                model: FUELIX_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a viral content strategist who understands platform algorithms and audience psychology.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.9,
                max_tokens: 800,
            });

            const content = response.choices?.[0]?.message?.content || '[]';

            // Try to parse as JSON, fallback to splitting by lines
            try {
                return JSON.parse(content);
            } catch {
                return content.split('\n').filter((line: string) => line.trim().length > 0).slice(0, 5);
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Categorize revenue for tax purposes
     */
    async categorizeTax(description: string, amount: number): Promise<any> {
        const prompt = `Categorize this revenue for Indian tax purposes:
Description: ${description}
Amount: ₹${amount}

Respond with JSON:
{
    "category": "brand_deal|adsense|sponsorship|merchandise|course|other",
    "taxType": "income_tax|gst|tds",
    "deductible": true/false,
    "notes": "brief explanation"
}`;

        try {
            const response = await this.makeRequest('/chat/completions', {
                model: FUELIX_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a tax expert specializing in Indian digital creator taxation and GST compliance.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 300,
            });

            const content = response.choices?.[0]?.message?.content || '{}';

            try {
                return JSON.parse(content);
            } catch {
                return {
                    category: 'other',
                    taxType: 'income_tax',
                    deductible: false,
                    notes: 'Manual categorization required'
                };
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Analyze revenue patterns and provide recommendations
     */
    async analyzeRevenue(revenueData: any[]): Promise<string> {
        const totalRevenue = revenueData.reduce((sum, item) => sum + (item.amount || 0), 0);
        const sources = [...new Set(revenueData.map(item => item.source))];

        const prompt = `Analyze this creator's revenue data:
Total Revenue: ₹${totalRevenue}
Revenue Sources: ${sources.join(', ')}
Number of Transactions: ${revenueData.length}

Recent Transactions:
${revenueData.slice(0, 5).map(item => `- ${item.source}: ₹${item.amount} (${item.date})`).join('\n')}

Provide:
1. Revenue diversification analysis
2. Growth opportunities
3. Financial health assessment
4. Recommendations for increasing revenue
5. Tax optimization tips

Format as clear, actionable insights.`;

        try {
            const response = await this.makeRequest('/chat/completions', {
                model: FUELIX_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a financial advisor specializing in creator economy and digital monetization strategies.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000,
            });

            return response.choices?.[0]?.message?.content || 'Unable to analyze revenue';
        } catch (error) {
            throw error;
        }
    }

    /**
     * Generate code snippets for creator integrations
     */
    async generateCodeSnippet(description: string, language: string = 'javascript'): Promise<string> {
        const prompt = `Generate a ${language} code snippet for: ${description}

Requirements:
- Clean, production-ready code
- Include error handling
- Add helpful comments
- Follow best practices

Return only the code snippet without explanations.`;

        try {
            const response = await this.makeRequest('/chat/completions', {
                model: FUELIX_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert software engineer specializing in API integrations and automation.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 1500,
            });

            return response.choices?.[0]?.message?.content || '// Code generation failed';
        } catch (error) {
            throw error;
        }
    }

    /**
     * Generate automation script for creators
     */
    async generateAutomationScript(task: string): Promise<string> {
        const prompt = `Create an automation script for: ${task}

The script should:
- Be production-ready and well-documented
- Include error handling and logging
- Follow security best practices
- Be easy to customize

Provide the complete script with setup instructions.`;

        try {
            const response = await this.makeRequest('/chat/completions', {
                model: FUELIX_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an automation expert who builds robust, maintainable scripts for content creators.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.4,
                max_tokens: 2000,
            });

            return response.choices?.[0]?.message?.content || '// Automation script generation failed';
        } catch (error) {
            throw error;
        }
    }

    /**
     * Chat with the AI - general conversational endpoint
     * Used by the interactive chat feature
     */
    async chat(messages: Array<{role: string, content: string}>): Promise<string> {
        try {
            const response = await this.makeRequest('/chat/completions', {
                model: FUELIX_MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 1500,
            });

            return response.choices?.[0]?.message?.content || 'No response generated';
        } catch (error) {
            throw error;
        }
    }

    /**
     * Generate structured analytics report (JSON) for the Weekly Report card
     */
    async generateAnalyticsReport(analytics: any): Promise<any> {
        const instagramContext = analytics.instagram ? `
Instagram (@${analytics.instagram.username}):
- Followers: ${analytics.instagram.followers}
- Posts: ${analytics.instagram.posts}
- Engagement Rate: ${analytics.instagram.engagementRate}%
- Avg Likes: ${analytics.instagram.avgLikes}
- Avg Comments: ${analytics.instagram.avgComments}` : 'Instagram: Not connected';

        const youtubeContext = analytics.youtube ? `
YouTube (${analytics.youtube.channelName}):
- Subscribers: ${analytics.youtube.subscribers}
- Total Views: ${analytics.youtube.totalViews}
- Total Videos: ${analytics.youtube.totalVideos}` : 'YouTube: Not connected';

        const prompt = `Analyze this creator's data and return ONLY valid JSON (no markdown, no code fences).

DATA:
${instagramContext}
${youtubeContext}

Return this exact JSON structure:
{
  "growthScore": <number 1-10>,
  "statInsights": {
    "totalFollowers": "<one short sentence about their follower count>",
    "youtubeViews": "<one short sentence about their views>",
    "contentCreated": "<one short sentence about their content volume>"
  },
  "platformNudges": {
    "youtube": "<one actionable tip for YouTube>",
    "instagram": "<one actionable tip for Instagram>"
  },
  "whatsWorking": [
    "<strength 1 with specific number>",
    "<strength 2 with specific number>"
  ],
  "needsAttention": [
    "<issue 1 with specific metric>",
    "<issue 2 with specific metric>"
  ],
  "weeklyAction": "<the single most impactful thing to do this week>",
  "goalText": "<specific measurable goal for end of month>"
}

RULES:
- Use their REAL numbers, not placeholders
- Each insight must be under 80 characters
- Be specific and actionable, not generic
- If a platform is not connected, say "Connect [platform] to unlock growth"
- Growth score: 1-3 = struggling, 4-6 = building, 7-8 = growing well, 9-10 = crushing it`;

        try {
            const response = await this.makeRequest('/chat/completions', {
                model: FUELIX_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a creator analytics engine. Return ONLY valid JSON. No markdown, no explanations, no code fences. Just the JSON object.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.5,
                max_tokens: 800,
            });

            const content = response.choices?.[0]?.message?.content || '{}';
            // Strip any markdown code fences if present
            const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            return JSON.parse(cleaned);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Generate AI-powered competitor gap analysis (structured JSON)
     */
    async generateCompetitorAnalysis(platform: string, userStats: any, competitorStats: any): Promise<any> {
        const prompt = `You are analyzing a creator's competitive position on ${platform}.

YOUR CREATOR:
- Username: @${userStats.username || 'unknown'}
- Followers: ${userStats.followers || 0}
- Engagement Rate: ${userStats.engagementRate || 0}%
- Avg Likes: ${userStats.avgLikes || 0}
- Avg Comments: ${userStats.avgComments || 0}
- Posts: ${userStats.postsCount || 0}
- Posts/Week: ${userStats.postsPerWeek || 'unknown'}

COMPETITOR:
- Username: @${competitorStats.username || 'unknown'}
- Followers: ${competitorStats.followers || 0}
- Engagement Rate: ${competitorStats.engagementRate || 0}%
- Avg Likes: ${competitorStats.avgLikes || 0}
- Avg Comments: ${competitorStats.avgComments || 0}
- Posts: ${competitorStats.postsCount || 0}
- Posts/Week: ${competitorStats.postsPerWeek || 'unknown'}

Return ONLY valid JSON (no markdown, no code fences). Use this exact structure:
{
  "overallVerdict": "<one sentence comparing both creators with real numbers>",
  "competitiveScore": <number 0-100, where 100 means you're dominating>,
  "metrics": [
    { "metric": "Followers", "you": <number>, "competitor": <number>, "difference": "<percentage like +50% or -80%>", "verdict": "ahead|behind|tied" },
    { "metric": "Engagement Rate", "you": <number>, "competitor": <number>, "difference": "<percentage>", "verdict": "ahead|behind|tied" },
    { "metric": "Avg Likes", "you": <number>, "competitor": <number>, "difference": "<percentage>", "verdict": "ahead|behind|tied" },
    { "metric": "Posts/Week", "you": <number>, "competitor": <number>, "difference": "<percentage>", "verdict": "ahead|behind|tied" }
  ],
  "strengths": ["<strength 1 with real numbers>", "<strength 2 with real numbers>"],
  "gaps": ["<gap 1 with real numbers>", "<gap 2 with real numbers>"],
  "actionPlan": [
    { "action": "<specific action>", "expectedImpact": "<what will improve>", "priority": "high|medium|low", "timeframe": "<1 week|2 weeks|1 month>" }
  ],
  "contentStrategy": "<2-3 sentence strategy recommendation based on competitor analysis>"
}

RULES:
- Use REAL numbers from the data, not placeholders
- competitiveScore: factor in followers, engagement, consistency
- Be specific and actionable in actionPlan
- strengths/gaps: 2-3 items each, always reference real metrics
- actionPlan: 2-4 items, ordered by priority`;

        try {
            const response = await this.makeRequest('/chat/completions', {
                model: FUELIX_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a competitive intelligence engine for creators. Return ONLY valid JSON. No markdown, no explanations, no code fences. Just the JSON object.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.5,
                max_tokens: 1000,
            });

            const content = response.choices?.[0]?.message?.content || '{}';
            const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            return JSON.parse(cleaned);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Generate technical content suggestions for tech creators
     */
    async generateTechnicalContent(topic: string, targetAudience: string): Promise<any> {
        const prompt = `Generate technical content ideas for: ${topic}
Target Audience: ${targetAudience}

Provide 3 content ideas with:
- Title
- Key points to cover
- Difficulty level
- Estimated engagement potential
- SEO keywords

Return as structured JSON.`;

        try {
            const response = await this.makeRequest('/chat/completions', {
                model: FUELIX_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a technical content strategist who understands developer audiences and trending tech topics.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 1200,
            });

            const content = response.choices?.[0]?.message?.content || '[]';

            try {
                return JSON.parse(content);
            } catch {
                return { ideas: [], error: 'Failed to parse response' };
            }
        } catch (error) {
            throw error;
        }
    }
}

// Export singleton instance
export const openClawService = new OpenClawService();
