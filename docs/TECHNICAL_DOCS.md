# CreatorIQ - Technical Documentation

**Version:** 1.0
**Date:** February 2026
**Last Updated:** 2026-02-07
**Status:** Active Development

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Tech Stack](#2-tech-stack)
3. [Database Schema](#3-database-schema)
4. [API Documentation](#4-api-documentation)
5. [Authentication & Security](#5-authentication--security)
6. [Integrations](#6-integrations)
7. [Deployment](#7-deployment)
8. [Performance & Scalability](#8-performance--scalability)
9. [Development Guidelines](#9-development-guidelines)
10. [Monitoring & Observability](#10-monitoring--observability)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│  Next.js 15 Frontend (React 19, TailwindCSS)               │
│  - Server Components (RSC)                                   │
│  - Client Components (Interactive UI)                        │
│  - App Router (/app directory)                              │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTP/HTTPS
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Express.js API (Node.js 22, TypeScript)                   │
│  ├── Routes (YouTube, Instagram, Revenue, Tax, Deals)       │
│  ├── Services (Business Logic)                              │
│  ├── Middleware (CORS, Auth, Error Handling)                │
│  └── Cron Jobs (Tax Sync, Data Refresh)                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────────┐
│ Supabase │ │ External │ │   Groq AI    │
│PostgreSQL│ │   APIs   │ │   (Llama3)   │
│          │ │          │ │              │
│- Users   │ │- YouTube │ │- Tax Advice  │
│- Revenue │ │- Insta   │ │- Insights    │
│- Deals   │ │- Graph   │ │- Analysis    │
│- Analytics│ │          │ │              │
└──────────┘ └──────────┘ └──────────────┘
```

### 1.2 Architecture Decisions

**Monorepo Structure:**
```
CreatorIQ/
├── apps/
│   ├── web/           # Next.js frontend
│   └── api/           # Express backend
├── packages/
│   └── shared/        # Shared types, utils
└── scripts/           # Setup, migrations
```

**Why Monorepo?**
- ✅ Shared TypeScript types between frontend/backend
- ✅ Atomic commits (FE + BE changes together)
- ✅ Easier refactoring and dependency management
- ✅ Single CI/CD pipeline
- ✅ pnpm workspaces for fast installs

---

### 1.3 Data Flow

**Example: User Connects YouTube**

```
┌─────────┐
│  User   │
│ (Browser│
└────┬────┘
     │ 1. Click "Connect YouTube"
     ▼
┌─────────────────┐
│ Next.js Client  │
│ (ConnectYouTube)│
└────┬────────────┘
     │ 2. GET /youtube/auth
     ▼
┌──────────────────┐
│  Express API     │
│  YouTubeService  │
└────┬─────────────┘
     │ 3. Generate OAuth URL
     ▼
┌──────────────────┐
│  Google OAuth    │
│  (YouTube API)   │
└────┬─────────────┘
     │ 4. User grants permissions
     ▼
┌──────────────────┐
│  Express API     │
│  /youtube/callback│
└────┬─────────────┘
     │ 5. Exchange code for access token
     │ 6. Fetch channel data
     ▼
┌──────────────────┐
│  Supabase        │
│  Save tokens     │
│  Save analytics  │
└────┬─────────────┘
     │ 7. Redirect to dashboard
     ▼
┌─────────────────┐
│ Next.js Client  │
│ Show success ✓  │
└─────────────────┘
```

---

## 2. Tech Stack

### 2.1 Frontend Stack

**Core Framework:**
- **Next.js 15.5.11**: React framework with App Router
- **React 19.2.4**: Latest React with concurrent features
- **TypeScript 5.3.3**: Type safety

**Styling:**
- **TailwindCSS 3.4.x**: Utility-first CSS
- **Lucide React**: Icon library (tree-shakeable)
- **PostCSS**: CSS processing

**State Management:**
- **React Server Components**: Server-side data fetching
- **Client State**: useState, useReducer (minimal client state)
- **URL State**: Next.js router for filters, pagination

**Data Fetching:**
- **Native fetch**: Server Components
- **fetch() with revalidation**: Client Components
- **No extra library**: Keeping it simple

**Why Next.js 15?**
- ✅ Server Components reduce bundle size by 40%
- ✅ App Router simplifies routing
- ✅ Built-in optimization (images, fonts, scripts)
- ✅ Vercel deployment (zero config)
- ✅ React 19 features (actions, use hook)

---

### 2.2 Backend Stack

**Core Framework:**
- **Node.js 22.22.0**: Latest LTS with performance improvements
- **Express.js 4.22.1**: Minimal, flexible web framework
- **TypeScript 5.3.3**: Type safety in backend

**Key Libraries:**
- **tsx 4.21.0**: TypeScript execution (dev)
- **cors**: Cross-origin requests
- **dotenv**: Environment variables
- **axios**: HTTP client for external APIs

**Why Express over Next.js API Routes?**
- ✅ Separation of concerns (FE/BE independent)
- ✅ Can scale backend separately
- ✅ Easier to add WebSockets, GraphQL later
- ✅ More control over middleware, error handling
- ✅ Can deploy on different infra (Railway, Render)

---

### 2.3 Database & Backend Services

**Primary Database:**
- **Supabase (PostgreSQL 15)**: Open-source Firebase alternative
  - Free tier: 500MB database, 1GB file storage
  - Paid: $25/month (8GB DB, 100GB storage)

**Why Supabase?**
- ✅ PostgreSQL (ACID, relational data)
- ✅ Built-in Auth (no need for Auth0, Clerk)
- ✅ Row-Level Security (data isolation)
- ✅ Real-time subscriptions (future feature)
- ✅ RESTful API auto-generated
- ✅ Generous free tier

**Authentication:**
- **Supabase Auth**: Email/password, OAuth providers
- **JWT tokens**: Stored in httpOnly cookies
- **RLS policies**: User data isolation

**AI/ML:**
- **Groq API**: Free tier LLM inference
  - Model: Llama-3.1-70B-Versatile
  - Speed: 100+ tokens/sec (faster than OpenAI)
  - Cost: FREE (for now), then $0.05/1M tokens

**Why Groq over OpenAI?**
- ✅ FREE tier (huge cost savings)
- ✅ Faster inference (2-3x vs GPT-4)
- ✅ Open models (Llama, Mixtral)
- ❌ Smaller context window (8K vs 128K)
- ❌ Less capable than GPT-4 (but good enough for our use case)

---

### 2.4 External APIs

**YouTube Analytics API:**
- **Quota**: 10,000 units/day (free)
- **Auth**: OAuth 2.0
- **Data**: Views, subscribers, watch time, revenue
- **Rate Limits**: 100 requests/100 seconds/user

**Instagram Graph API:**
- **Quota**: 200 calls/hour (free)
- **Auth**: Facebook OAuth
- **Data**: Reach, impressions, engagement, follower demographics
- **Limitation**: 90-day data retention (we store forever)

**Future APIs:**
- LinkedIn Marketing API
- X (Twitter) API v2
- TikTok Creator API

---

## 3. Database Schema

### 3.1 Schema Overview

**Tables:**
1. `users` - User profiles (extends auth.users)
2. `connected_platforms` - OAuth tokens for YouTube, Instagram
3. `analytics_snapshots` - Daily analytics data
4. `revenue_entries` - Income tracking
5. `tax_records` - Quarterly tax summaries
6. `deals` - Brand deal pipeline

**Total Size (estimated for 10K users):**
- Users: ~5MB
- Analytics: ~500MB (2 years × 365 days × 10K users × 1KB)
- Revenue: ~50MB
- Deals: ~20MB
- **Total: ~600MB** (well within Supabase free tier 500MB → need paid)

---

### 3.2 Detailed Schema

#### **Table: users**
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- Primary key on `id` (auto)
- Unique index on `email` (auto)

**RLS Policies:**
- Users can SELECT/UPDATE their own row only

---

#### **Table: connected_platforms**
```sql
CREATE TABLE public.connected_platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'linkedin', 'twitter')),
  platform_user_id TEXT NOT NULL,      -- YouTube channel ID, Instagram account ID
  platform_username TEXT NOT NULL,      -- Display name
  access_token TEXT NOT NULL,           -- OAuth access token (encrypted at rest)
  refresh_token TEXT,                   -- OAuth refresh token
  token_expires_at TIMESTAMPTZ,         -- Token expiry
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,          -- Last time we fetched data
  UNIQUE(user_id, platform)             -- One YouTube per user, one Instagram per user
);
```

**Indexes:**
- Primary key on `id`
- Unique composite index on `(user_id, platform)`
- Index on `user_id` for fast lookups

**RLS Policies:**
- Users can SELECT/INSERT/UPDATE/DELETE their own platforms only

**Security Notes:**
- `access_token` stored encrypted (Supabase encrypts at rest)
- Tokens rotated every 7 days (refresh flow)
- Never expose tokens in API responses

---

#### **Table: analytics_snapshots**
```sql
CREATE TABLE public.analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'linkedin', 'twitter')),
  snapshot_date DATE NOT NULL,          -- Daily snapshots
  metrics JSONB NOT NULL,               -- Flexible: {views, subscribers, revenue, etc.}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform, snapshot_date)  -- One snapshot per platform per day
);

CREATE INDEX idx_analytics_user_platform_date
ON public.analytics_snapshots(user_id, platform, snapshot_date DESC);
```

**Indexes:**
- Primary key on `id`
- **Composite index on `(user_id, platform, snapshot_date DESC)`**: Critical for fast queries
- GIN index on `metrics` JSONB (future: for filtering by specific metrics)

**JSONB Metrics Structure:**

```json
{
  // YouTube metrics
  "views": 12500,
  "subscribers": 45000,
  "watchTime": 85000,  // minutes
  "revenue": 1250.50,  // USD
  "newSubscribers": 150,

  // Instagram metrics
  "reach": 50000,
  "impressions": 75000,
  "engagement": 3500,  // likes + comments + saves
  "followers": 40000,
  "newFollowers": 200,
  "profileViews": 1200
}
```

**Why JSONB?**
- ✅ Flexibility: Each platform has different metrics
- ✅ Schema evolution: Add new metrics without migration
- ✅ PostgreSQL JSONB is fast (indexed, queried efficiently)
- ❌ Tradeoff: Less type safety (mitigated by TypeScript interfaces)

---

#### **Table: revenue_entries**
```sql
CREATE TABLE public.revenue_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('adsense', 'brand_deal', 'affiliate', 'merch', 'other')),
  platform TEXT CHECK (platform IN ('youtube', 'instagram', 'linkedin', 'twitter')),
  amount DECIMAL(12, 2) NOT NULL,       -- ₹99,999,999.99 max
  currency TEXT DEFAULT 'INR' NOT NULL,
  date DATE NOT NULL,
  description TEXT,                      -- e.g., "Brand: Nike, Campaign: Diwali"
  gst_applicable BOOLEAN DEFAULT false,
  gst_amount DECIMAL(12, 2),
  tds_deducted DECIMAL(12, 2),
  invoice_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_revenue_user_date
ON public.revenue_entries(user_id, date DESC);
```

**Indexes:**
- Primary key on `id`
- **Index on `(user_id, date DESC)`**: For revenue dashboards, monthly summaries

**Use Cases:**
- Monthly revenue reports
- Tax calculations (aggregate by quarter)
- Revenue by source analysis

---

#### **Table: tax_records**
```sql
CREATE TABLE public.tax_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  financial_year TEXT NOT NULL,         -- e.g., "2025-26"
  quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  total_income DECIMAL(12, 2) NOT NULL,
  gst_collected DECIMAL(12, 2) NOT NULL,
  tds_deducted DECIMAL(12, 2) NOT NULL,
  form_26as_data JSONB,                 -- TDS certificate details
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, financial_year, quarter)
);
```

**Indexes:**
- Primary key on `id`
- Unique composite index on `(user_id, financial_year, quarter)`

**Use Cases:**
- Quarterly GST returns
- Annual ITR pre-filling
- TDS certificate tracking

---

#### **Table: deals**
```sql
CREATE TYPE deal_status AS ENUM ('pitching', 'negotiating', 'contract_sent', 'closed_won', 'closed_lost');

CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  status deal_status DEFAULT 'pitching',
  amount DECIMAL(12, 2),                -- Expected/actual deal value
  currency TEXT DEFAULT 'INR',
  contact_email TEXT,
  next_action_date DATE,                -- Reminder for follow-up
  notes TEXT,                           -- Rich text (markdown)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deals_user_status
ON public.deals(user_id, status);
```

**Indexes:**
- Primary key on `id`
- **Index on `(user_id, status)`**: For Kanban board (filter by status)

**Use Cases:**
- Brand deal pipeline management
- Revenue forecasting (sum of 'negotiating' + 'contract_sent')
- Follow-up reminders

---

### 3.3 Database Triggers & Functions

#### **Trigger: Auto-update `updated_at`**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Similar triggers for revenue_entries, tax_records, deals
```

#### **Trigger: Auto-create user on signup**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 4. API Documentation

### 4.1 API Structure

**Base URL:**
- Development: `http://localhost:3001`
- Production: `https://api.creatoriq.in`

**Authentication:**
- Bearer token in `Authorization` header
- `Authorization: Bearer <supabase_jwt_token>`

**Response Format:**
```json
{
  "data": { ... },      // Success response
  "error": "message",   // Error response
  "meta": {             // Optional metadata
    "page": 1,
    "total": 100
  }
}
```

---

### 4.2 YouTube Endpoints

#### **GET /youtube/auth**
Get OAuth authorization URL.

**Request:**
```bash
GET /youtube/auth?userId=<uuid>
```

**Response:**
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
}
```

---

#### **GET /youtube/callback**
OAuth callback handler.

**Request:**
```bash
GET /youtube/callback?code=<auth_code>&state=<user_id>
```

**Response:**
Redirects to `${FRONTEND_URL}/dashboard?youtube=connected`

**Side Effects:**
- Exchanges code for access token
- Fetches YouTube channel data
- Saves to `connected_platforms`
- Creates first `analytics_snapshot`

---

#### **GET /youtube/analytics/:userId**
Get YouTube analytics for a user.

**Request:**
```bash
GET /youtube/analytics/abc-123-uuid
Authorization: Bearer <token>
```

**Response:**
```json
{
  "channel": {
    "id": "UCxxxx",
    "title": "Creator Channel",
    "subscribers": 45000,
    "totalViews": 1250000
  },
  "analytics": {
    "last30Days": {
      "views": 50000,
      "watchTime": 12500,
      "subscribers": 1200,
      "revenue": 250.50
    },
    "trending": [
      {
        "videoId": "abc123",
        "title": "My viral video",
        "views": 10000,
        "likes": 500
      }
    ]
  }
}
```

---

### 4.3 Tax Endpoints

#### **GET /tax/rules**
Get current Indian tax rules (always up-to-date).

**Request:**
```bash
GET /tax/rules
```

**Response:**
```json
{
  "rules": {
    "lastUpdated": "2026-02-07",
    "financialYear": "2025-26",
    "gst": {
      "threshold": 2000000,
      "rate": 18,
      "applicableTo": ["Brand sponsorships", "Digital advertising revenue"],
      "exemptions": ["YouTube AdSense revenue"]
    },
    "tds": { ... },
    "incomeTax": { ... }
  },
  "message": "Tax rules updated as of 2026-02-07",
  "source": "Indian Government Tax Policy 2026"
}
```

---

#### **POST /tax/liability**
Calculate tax liability for given income.

**Request:**
```bash
POST /tax/liability
Content-Type: application/json

{
  "annualIncome": 500000
}
```

**Response:**
```json
{
  "gstRequired": false,
  "estimatedGST": 0,
  "estimatedIncomeTax": 10000,
  "tdsExpected": 25000,
  "netIncome": 490000,
  "breakdown": "Annual Income: ₹5,00,000\nGST: Not applicable\nIncome Tax: ₹10,000\n..."
}
```

---

#### **POST /tax/advice**
Get AI-powered personalized tax advice.

**Request:**
```bash
POST /tax/advice
Content-Type: application/json

{
  "annualIncome": 800000,
  "revenueBreakdown": {
    "youtube": 500000,
    "brandDeals": 300000
  },
  "expenses": 100000
}
```

**Response:**
```json
{
  "advice": "## Immediate Actions\n- Register for GST (income > ₹20L)\n...",
  "calculation": {
    "gstRequired": false,
    "estimatedIncomeTax": 25000,
    ...
  },
  "rules": { ... }
}
```

**Performance:**
- Response time: 3-8 seconds (AI generation)
- Cached: No (personalized advice)

---

### 4.4 Deals Endpoints

#### **GET /deals/:userId**
Get all brand deals for a user.

**Request:**
```bash
GET /deals/abc-123-uuid
Authorization: Bearer <token>
```

**Response:**
```json
{
  "deals": [
    {
      "id": "deal-1",
      "brandName": "Nike India",
      "status": "negotiating",
      "amount": 50000,
      "currency": "INR",
      "contactEmail": "marketing@nike.com",
      "nextActionDate": "2026-02-15",
      "notes": "Discussed deliverables...",
      "createdAt": "2026-02-01T10:00:00Z"
    }
  ]
}
```

---

#### **POST /deals**
Create a new brand deal.

**Request:**
```bash
POST /deals
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": "abc-123",
  "brandName": "Nike India",
  "amount": 50000,
  "contactEmail": "marketing@nike.com",
  "notes": "Initial outreach"
}
```

**Response:**
```json
{
  "deal": {
    "id": "deal-1",
    "status": "pitching",
    ...
  }
}
```

---

#### **PATCH /deals/:dealId**
Update deal status or details.

**Request:**
```bash
PATCH /deals/deal-1
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "negotiating",
  "amount": 60000,
  "notes": "Counter-offer accepted"
}
```

---

## 5. Authentication & Security

### 5.1 Authentication Flow

**Sign Up:**
```
User enters email/password
  → Frontend: supabase.auth.signUp({ email, password })
  → Supabase: Creates auth.users entry
  → Trigger: handle_new_user() creates public.users entry
  → Returns: JWT token + session
  → Frontend: Store token in httpOnly cookie
```

**Login:**
```
User enters email/password
  → Frontend: supabase.auth.signInWithPassword({ email, password })
  → Supabase: Validates credentials
  → Returns: JWT token + session
  → Frontend: Store token in httpOnly cookie
```

**Token Refresh:**
```
Token expires (1 hour)
  → Frontend: supabase.auth.refreshSession()
  → Supabase: Issues new token
  → Frontend: Updates cookie
```

---

### 5.2 Row-Level Security (RLS)

**Example Policy:**
```sql
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);
```

**How it works:**
1. User makes request with JWT token
2. Supabase extracts `user_id` from token → `auth.uid()`
3. RLS policy checks: `auth.uid() = users.id`
4. If true: query succeeds
5. If false: query returns empty (no error, just no data)

**Benefits:**
- ✅ Data isolation at DB level (not app level)
- ✅ Can't accidentally leak user data (even with buggy code)
- ✅ No need for `WHERE user_id = ?` in every query

---

### 5.3 Security Best Practices

**API Keys:**
- ✅ Never commit `.env` files
- ✅ Use `.env.example` as template
- ✅ Rotate keys quarterly

**OAuth Tokens:**
- ✅ Encrypted at rest (Supabase default)
- ✅ Never return in API responses
- ✅ Refresh every 7 days

**Input Validation:**
- ✅ Validate all inputs (TypeScript + Zod schemas)
- ✅ Sanitize user-generated content (prevent XSS)
- ✅ Rate limiting (future: 100 req/min per user)

**CORS:**
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3004',
    'https://creatoriq.in'
  ],
  credentials: true,  // Allow cookies
}));
```

---

## 6. Integrations

### 6.1 YouTube Data API v3

**Setup:**
1. Create project in Google Cloud Console
2. Enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. Configure redirect URI: `http://localhost:3001/youtube/callback`

**OAuth Scopes:**
```
https://www.googleapis.com/auth/youtube.readonly
https://www.googleapis.com/auth/yt-analytics.readonly
```

**Rate Limits:**
- Quota: 10,000 units/day (free)
- Each API call costs 1-50 units
- Example: `channels.list` = 1 unit, `videos.list` = 1 unit

**Optimization:**
- Cache channel data (refresh daily, not hourly)
- Batch requests where possible
- Use `part` parameter to fetch only needed fields

---

### 6.2 Instagram Graph API

**Setup:**
1. Create Facebook App at developers.facebook.com
2. Add Instagram Basic Display product
3. Configure redirect URI: `http://localhost:3001/instagram/callback`
4. Add Instagram Testers (dev mode)

**OAuth Scopes:**
```
user_profile
user_media
```

**Rate Limits:**
- 200 calls/hour per user (free)

**Limitations:**
- ⚠️ 90-day data retention (we solve this by storing in our DB)
- ⚠️ Business accounts only (no personal accounts)
- ⚠️ Must be connected to Facebook Page

**Workaround for Limitation:**
- We store snapshots daily in `analytics_snapshots`
- User can view 2+ years of data (Instagram can't delete it)

---

### 6.3 Groq AI API

**Setup:**
1. Sign up at console.groq.com
2. Get API key (free tier: unlimited for now)
3. Add to `.env`: `GROQ_API_KEY=gsk_xxx`

**Models:**
- `llama-3.1-70b-versatile`: Best for general tasks
- `llama-3.1-8b-instant`: Faster, cheaper, less capable
- `mixtral-8x7b`: Alternative, good for code

**Usage:**
```typescript
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const completion = await groq.chat.completions.create({
  messages: [{ role: 'user', content: 'Explain GST for creators' }],
  model: 'llama-3.1-70b-versatile',
  temperature: 0.3,  // Lower = more factual
  max_tokens: 1000,
});

const response = completion.choices[0].message.content;
```

**Cost:**
- FREE (current, Nov 2025 - Feb 2026)
- Future pricing: ~$0.05/1M tokens (cheap!)

**Rate Limits:**
- 30 requests/minute (free tier)
- Upgrade: 10,000 requests/minute

---

## 7. Deployment

### 7.1 Deployment Architecture

**Frontend (Next.js):**
- Platform: **Vercel** (recommended)
- Alternative: Netlify, AWS Amplify
- Build command: `pnpm build`
- Output: `.next` directory

**Backend (Express):**
- Platform: **Railway** (recommended)
- Alternative: Render, Fly.io, AWS ECS
- Start command: `pnpm start`
- Port: Auto-assigned or 3001

**Database:**
- **Supabase Cloud** (managed PostgreSQL)
- No deployment needed

---

### 7.2 Environment Variables

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_API_URL=https://api.creatoriq.in
```

**Backend (.env):**
```bash
# Supabase
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# APIs
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
GOOGLE_REDIRECT_URI=https://api.creatoriq.in/youtube/callback

FACEBOOK_APP_ID=123456789
FACEBOOK_APP_SECRET=xxx
FACEBOOK_REDIRECT_URI=https://api.creatoriq.in/instagram/callback

GROQ_API_KEY=gsk_xxx

# Config
API_PORT=3001
FRONTEND_URL=https://creatoriq.in
NODE_ENV=production
```

---

### 7.3 CI/CD Pipeline

**GitHub Actions (future):**
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm build
      - uses: vercel/action@v2
        with:
          token: ${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railwayapp/railway-deploy@v1
        with:
          api-key: ${{ secrets.RAILWAY_API_KEY }}
```

---

## 8. Performance & Scalability

### 8.1 Current Performance

**Frontend:**
- Initial Load: < 2 seconds
- Time to Interactive: < 3 seconds
- Lighthouse Score: 90+ (target)

**Backend:**
- API Response Time: < 200ms (avg)
- Tax Calculation: < 100ms
- AI Advice: 3-8 seconds (LLM call)

**Database:**
- Query Time: < 50ms (indexed queries)
- Connection Pool: 10 connections (Supabase default)

---

### 8.2 Scalability Plan

**Current Capacity (Free Tier):**
- Users: 1,000-5,000
- Requests: 500K/month (Supabase)
- Storage: 500MB database

**Scale to 10K Users:**
- Upgrade Supabase: Pro plan ($25/month)
  - 8GB database
  - 100GB storage
  - 2.5M requests/month
- Backend: Railway Pro ($5/month)
  - 8GB RAM, 4 vCPUs
- **Total Cost: $30/month**

**Scale to 100K Users:**
- Supabase: Team plan ($599/month)
  - 200GB database
  - 250M requests/month
- Backend: 3x Railway instances ($20/month each)
  - Load balancer
- CDN: Cloudflare (free)
- **Total Cost: ~$700/month**
- **Revenue: 10K paid users × $50 = $500K/month**
- **Margin: 99.8%** 🚀

---

### 8.3 Optimization Strategies

**Database:**
- ✅ Indexes on frequently queried columns
- ✅ JSONB for flexible data (faster than separate tables)
- ⬜ Future: Materialized views for analytics
- ⬜ Future: Partitioning (by user_id or date)

**API:**
- ✅ CORS configured for specific origins
- ⬜ Future: Rate limiting (Redis + express-rate-limit)
- ⬜ Future: Response caching (Redis)
- ⬜ Future: API versioning (/v1, /v2)

**Frontend:**
- ✅ Server Components (reduce JS bundle)
- ✅ Image optimization (Next.js automatic)
- ⬜ Future: Route-based code splitting
- ⬜ Future: Service worker for offline support

---

## 9. Development Guidelines

### 9.1 Code Style

**TypeScript:**
- Use `interface` for public APIs
- Use `type` for unions, intersections
- Enable `strict` mode

**Naming Conventions:**
- Files: `kebab-case.ts`
- Components: `PascalCase.tsx`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

**Comments:**
- Explain WHY, not WHAT
- Use JSDoc for public functions

---

### 9.2 Git Workflow

**Branching:**
```
main          - Production code
└── develop   - Staging
    ├── feature/tax-sync
    ├── feature/instagram-oauth
    └── fix/revenue-calculation
```

**Commit Messages:**
```
feat: Add AI tax advice endpoint
fix: Correct GST calculation for threshold edge case
docs: Update API documentation
refactor: Extract YouTube service logic
```

---

### 9.3 Testing Strategy

**Unit Tests (future):**
- Tax calculations: `calculateTaxLiability()`
- Revenue aggregation: `getTotalRevenue()`
- Framework: Jest + Testing Library

**Integration Tests (future):**
- API endpoints: POST /tax/advice
- Database operations: Create deal
- Framework: Supertest

**E2E Tests (future):**
- User flows: Signup → Connect YouTube → View Dashboard
- Framework: Playwright

---

## 10. Monitoring & Observability

### 10.1 Logging (future)

**Backend:**
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

**Logs to Track:**
- API errors (500s)
- OAuth failures
- Tax sync results
- User signups

---

### 10.2 Error Tracking (future)

**Sentry Integration:**
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.errorHandler());
```

---

### 10.3 Analytics (future)

**Product Analytics:**
- Tool: PostHog (open-source)
- Events: User signup, Platform connected, Tax advice requested

**Business Metrics:**
- MRR tracking
- Churn rate
- NPS surveys

---

**Document Status:** Living document, updated as system evolves
**Next Review:** March 2026
**Owner:** Engineering Team
