"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openClawService = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * OpenClaw/Fuelix AI Service - Primary AI Provider
 * Provides AI-powered insights, code generation, and content suggestions
 * Uses Fuelix API (OpenAI-compatible) - the same provider used by OpenClaw CLI
 */
const FUELIX_MODEL = 'gpt-5.2-chat-2025-12-11'; // Primary Fuelix model
const FUELIX_MODEL_MINI = 'gpt-5-mini-2025-08-07'; // Fallback for faster responses
class OpenClawService {
    constructor() {
        this.initialized = false;
        // Don't read env vars at construction time - they may not be loaded yet
        this.apiKey = '';
        this.baseUrl = '';
    }
    /**
     * Lazy initialization - reads env vars when first called
     */
    ensureInitialized() {
        if (!this.initialized) {
            this.apiKey = process.env.OPENCLAW_API_KEY || '';
            this.baseUrl = process.env.OPENCLAW_API_URL || 'https://api.fuelix.ai/v1';
            this.initialized = true;
            if (!this.apiKey) {
                console.warn('⚠️ OPENCLAW_API_KEY not set. OpenClaw features will be limited.');
            }
            else {
                console.log('✅ Fuelix AI initialized:', this.apiKey.substring(0, 10) + '...');
                console.log('   Base URL:', this.baseUrl);
            }
        }
    }
    /**
     * Check if OpenClaw is available
     */
    isAvailable() {
        this.ensureInitialized();
        return !!this.apiKey;
    }
    /**
     * Make a request to OpenClaw API
     */
    async makeRequest(endpoint, data) {
        this.ensureInitialized();
        if (!this.apiKey) {
            throw new Error('OpenClaw API key not configured');
        }
        try {
            const response = await axios_1.default.post(`${this.baseUrl}${endpoint}`, data, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                timeout: 30000,
            });
            return response.data;
        }
        catch (error) {
            console.error('OpenClaw API Error:', error.response?.data || error.message);
            throw new Error(`OpenClaw API request failed: ${error.message}`);
        }
    }
    /**
     * Generate AI insights from analytics data
     */
    async generateInsights(analytics) {
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
${analytics.instagram.topPosts?.map((post, i) => `${i + 1}. ${post.like_count || 0} likes, ${post.comments_count || 0} comments`).join('\n') || 'No data available'}
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
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Generate content ideas based on niche and analytics
     */
    async generateContentIdeas(niche, analytics) {
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
            }
            catch {
                return content.split('\n').filter((line) => line.trim().length > 0).slice(0, 5);
            }
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Categorize revenue for tax purposes
     */
    async categorizeTax(description, amount) {
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
            }
            catch {
                return {
                    category: 'other',
                    taxType: 'income_tax',
                    deductible: false,
                    notes: 'Manual categorization required'
                };
            }
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Analyze revenue patterns and provide recommendations
     */
    async analyzeRevenue(revenueData) {
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
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Generate code snippets for creator integrations
     */
    async generateCodeSnippet(description, language = 'javascript') {
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
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Generate automation script for creators
     */
    async generateAutomationScript(task) {
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
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Chat with the AI - general conversational endpoint
     * Used by the interactive chat feature
     */
    async chat(messages) {
        try {
            const response = await this.makeRequest('/chat/completions', {
                model: FUELIX_MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 1500,
            });
            return response.choices?.[0]?.message?.content || 'No response generated';
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Generate technical content suggestions for tech creators
     */
    async generateTechnicalContent(topic, targetAudience) {
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
            }
            catch {
                return { ideas: [], error: 'Failed to parse response' };
            }
        }
        catch (error) {
            throw error;
        }
    }
}
// Export singleton instance
exports.openClawService = new OpenClawService();
