# OpenClaw AI Integration Guide

CreatorIQ uses **OpenClaw AI** as the primary AI provider with Groq as a fallback.

## Overview

OpenClaw provides advanced AI capabilities including:
- 🤖 **AI Insights Generation** - Analytics and performance insights
- 💡 **Content Ideas** - Viral content suggestions
- 💰 **Revenue Analysis** - Financial insights and recommendations
- 📊 **Tax Categorization** - Automated tax classification
- 💻 **Code Generation** - API integration snippets
- ⚙️ **Automation Scripts** - Custom workflow automation
- 📝 **Technical Content** - Developer-focused content ideas

## Setup

### 1. Get OpenClaw API Key

1. Visit https://openclaw.ai/
2. Sign up or login to your account
3. Navigate to API settings
4. Generate a new API key

### 2. Configure Environment Variables

Add to `.env`:

```bash
# OpenClaw AI (Primary Provider)
OPENCLAW_API_KEY=your-openclaw-api-key-here
OPENCLAW_API_URL=https://api.openclaw.ai

# Groq AI (Fallback Provider - still needed)
GROQ_API_KEY=your-groq-api-key
```

### 3. Verify Installation

```bash
curl http://localhost:3001/openclaw/status
```

Expected response:
```json
{
  "provider": "OpenClaw",
  "available": true,
  "message": "OpenClaw AI is ready"
}
```

## API Endpoints

### Core AI Features (Automatic Fallback)

These endpoints use OpenClaw first, then fallback to Groq if unavailable:

#### Generate Insights
```bash
POST /ai/insights
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "analytics": {
    "views": 100000,
    "engagement": 5.2,
    "subscribers": 50000,
    "revenue": 25000
  }
}
```

#### Categorize Tax
```bash
POST /ai/categorize-tax
Authorization: Bearer <your-jwt-token>

{
  "description": "Brand deal with XYZ company",
  "amount": 50000
}
```

#### Generate Content Ideas
```bash
POST /ai/content-ideas
Authorization: Bearer <your-jwt-token>

{
  "niche": "tech tutorials",
  "recentTopics": ["React hooks", "Next.js 14"]
}
```

#### Analyze Revenue
```bash
POST /ai/analyze-revenue
Authorization: Bearer <your-jwt-token>

{
  "revenueHistory": [
    { "month": "2024-01", "amount": 25000 },
    { "month": "2024-02", "amount": 30000 }
  ]
}
```

### OpenClaw-Exclusive Features

These features are only available with OpenClaw:

#### Generate Code Snippet
```bash
POST /openclaw/code-snippet
Authorization: Bearer <your-jwt-token>

{
  "description": "Fetch YouTube channel statistics using YouTube Data API v3",
  "language": "javascript"
}
```

Response:
```json
{
  "success": true,
  "code": "// Generated code snippet...",
  "language": "javascript",
  "provider": "OpenClaw"
}
```

#### Generate Automation Script
```bash
POST /openclaw/automation-script
Authorization: Bearer <your-jwt-token>

{
  "task": "Automatically post Instagram stories when a new YouTube video is published"
}
```

Response:
```json
{
  "success": true,
  "script": "// Complete automation script with setup instructions...",
  "provider": "OpenClaw"
}
```

#### Generate Technical Content
```bash
POST /openclaw/technical-content
Authorization: Bearer <your-jwt-token>

{
  "topic": "React Server Components",
  "targetAudience": "intermediate developers"
}
```

Response:
```json
{
  "success": true,
  "content": {
    "ideas": [
      {
        "title": "Building Your First RSC Application",
        "keyPoints": [...],
        "difficulty": "intermediate",
        "seoKeywords": [...]
      }
    ]
  },
  "provider": "OpenClaw"
}
```

## Fallback Behavior

CreatorIQ automatically handles AI provider failures:

1. **Primary**: Try OpenClaw first
2. **Fallback**: If OpenClaw fails or is unavailable, use Groq
3. **Logging**: All provider usage is logged for monitoring

Example log output:
```
[INFO] Using OpenClaw for insights generation
[WARN] OpenClaw failed, falling back to Groq
[INFO] Using Groq (fallback) for insights generation
```

## Frontend Integration

### Using the API Client

```typescript
import { api } from '@/lib/api-client';

// Generate AI insights (uses OpenClaw → Groq fallback)
const insights = await api.post('/ai/insights', {
  analytics: { views: 10000, engagement: 5.5 }
});

// Generate code snippet (OpenClaw only)
const code = await api.post('/openclaw/code-snippet', {
  description: 'YouTube API integration',
  language: 'typescript'
});

// Generate automation script
const script = await api.post('/openclaw/automation-script', {
  task: 'Auto-post to Twitter when new video uploaded'
});
```

## Use Cases

### For All Creators
- 📊 Performance insights and recommendations
- 💡 Viral content idea generation
- 💰 Revenue optimization strategies
- 📝 Tax categorization and compliance

### For Tech Creators
- 💻 Code snippet generation for tutorials
- ⚙️ Automation script generation
- 📚 Technical content ideas with SEO optimization
- 🔧 API integration helpers

### For Business Creators
- 📈 Financial analysis and forecasting
- 💼 Brand deal optimization
- 🎯 Audience targeting recommendations
- 📊 Competitive analysis insights

## Configuration Options

### Custom OpenClaw API URL

If using a self-hosted or custom OpenClaw instance:

```bash
OPENCLAW_API_URL=https://your-custom-instance.com/api
```

### Disable OpenClaw (Use Only Groq)

To temporarily disable OpenClaw:

```bash
# Remove or comment out OPENCLAW_API_KEY
# OPENCLAW_API_KEY=...
```

The system will automatically fallback to Groq for all requests.

## Monitoring

### Check AI Provider Status

```bash
# OpenClaw status
curl http://localhost:3001/openclaw/status

# AI service status
curl http://localhost:3001/ai/status
```

### View Provider Usage Logs

Check API logs for AI provider usage:

```bash
# Using PM2
pm2 logs creatoriq-api | grep "OpenClaw\|Groq"

# Using Docker
docker logs creatoriq-api | grep "OpenClaw\|Groq"
```

## Troubleshooting

### OpenClaw API Key Invalid

**Error**: `OpenClaw API request failed: 401 Unauthorized`

**Solution**:
1. Verify your API key at https://openclaw.ai/
2. Check `OPENCLAW_API_KEY` in `.env`
3. Restart the API server

### OpenClaw API Unavailable

**Error**: `OpenClaw API request failed: ECONNREFUSED`

**Solution**:
- System automatically falls back to Groq
- Check OpenClaw service status
- Verify `OPENCLAW_API_URL` is correct

### Rate Limiting

**Error**: `OpenClaw API request failed: 429 Too Many Requests`

**Solution**:
- System falls back to Groq automatically
- Upgrade OpenClaw plan for higher limits
- Implement request caching (future enhancement)

## Best Practices

1. **Always Set Both Keys**: Configure both `OPENCLAW_API_KEY` and `GROQ_API_KEY` for redundancy

2. **Monitor Usage**: Check logs regularly to ensure fallback is working

3. **Test Fallback**: Temporarily remove `OPENCLAW_API_KEY` to test Groq fallback

4. **Cache Results**: For production, consider caching AI responses to reduce API calls

5. **Handle Errors Gracefully**: The frontend should handle AI service failures gracefully

## Cost Optimization

- **Primary Use Case**: Use OpenClaw for code gen, automation, and technical content
- **Fallback Use Case**: Groq handles general insights when OpenClaw is unavailable
- **Caching Strategy**: Cache frequently requested insights (e.g., content ideas by niche)
- **Rate Limiting**: Implement user-level rate limiting to prevent abuse

## Future Enhancements

- [ ] Response caching layer (Redis)
- [ ] User-level AI usage analytics
- [ ] Custom AI model selection
- [ ] Streaming responses for long content generation
- [ ] A/B testing between providers
- [ ] Fine-tuned models for creator-specific insights

## Support

For OpenClaw-specific issues:
- Documentation: https://openclaw.ai/docs
- Support: support@openclaw.ai

For CreatorIQ integration issues:
- GitHub Issues: https://github.com/yourusername/creatoriq/issues

---

**Last Updated**: February 2026
