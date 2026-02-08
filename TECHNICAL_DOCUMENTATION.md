# CreatorIQ - Technical Documentation

> **Version:** 2.0
> **Last Updated:** February 8, 2026
> **Target Audience:** Developers, DevOps Engineers, Technical Contributors

---

## 📚 Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [API Documentation](#api-documentation)
4. [Database Schema](#database-schema)
5. [Authentication Flow](#authentication-flow)
6. [Platform Integrations](#platform-integrations)
7. [AI Services Integration](#ai-services-integration)
8. [Security Implementation](#security-implementation)
9. [Deployment Guide](#deployment-guide)
10. [Development Workflow](#development-workflow)

---

## 🏗️ System Architecture

### High-Level Architecture

```mermaid
C4Context
    title CreatorIQ System Context Diagram

    Person(creator, "Content Creator", "User managing multiple social media platforms")
    System(creatoriq, "CreatorIQ Platform", "All-in-one analytics and management system")

    System_Ext(youtube, "YouTube API", "Video analytics and channel data")
    System_Ext(instagram, "Instagram API", "Post analytics and audience insights")
    System_Ext(fuelix, "Fuelix AI", "GPT-5.2 for insights generation")
    System_Ext(groq, "Groq AI", "Llama 3.3 fallback provider")

    Rel(creator, creatoriq, "Uses", "HTTPS")
    Rel(creatoriq, youtube, "Fetches data", "OAuth 2.0 + REST")
    Rel(creatoriq, instagram, "Fetches data", "OAuth 2.0 + Graph API")
    Rel(creatoriq, fuelix, "Generates insights", "API Key + REST")
    Rel(creatoriq, groq, "Fallback insights", "API Key + REST")
```

### Application Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js Frontend<br/>Port 3004]
        A1[React Components]
        A2[State Management]
        A3[API Client]
        A --> A1
        A --> A2
        A --> A3
    end

    subgraph "API Layer"
        B[Express Server<br/>Port 3001]
        B1[Auth Middleware]
        B2[Error Handler]
        B3[Request Logger]
        B4[Route Controllers]
        B --> B1
        B --> B2
        B --> B3
        B --> B4
    end

    subgraph "Service Layer"
        C1[YouTube Service]
        C2[Instagram Service]
        C3[AI Service]
        C4[Tax Calculator]
        C5[Encryption Service]
        C6[Supabase Service]
    end

    subgraph "Data Layer"
        D[(PostgreSQL<br/>Supabase)]
        D1[users]
        D2[connected_platforms]
        D3[analytics_snapshots]
        D4[revenue_entries]
        D5[brand_deals]
        D --> D1
        D --> D2
        D --> D3
        D --> D4
        D --> D5
    end

    subgraph "External Services"
        E1[YouTube Analytics API]
        E2[Instagram Graph API]
        E3[Fuelix AI API]
        E4[Groq AI API]
    end

    A3 -->|HTTP/REST| B4
    B4 --> C1
    B4 --> C2
    B4 --> C3
    B4 --> C4
    C1 --> E1
    C2 --> E2
    C3 --> E3
    C3 --> E4
    C6 --> D
    C5 -.->|Encrypt/Decrypt| C6

    style A fill:#4F46E5,color:#fff
    style B fill:#059669,color:#fff
    style D fill:#0891B2,color:#fff
    style E3 fill:#9333EA,color:#fff
```

---

## 🛠️ Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.x | React framework with SSR/SSG |
| **React** | 18.x | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **TailwindCSS** | 3.x | Utility-first CSS framework |
| **Lucide Icons** | Latest | Modern icon library |
| **Recharts** | 2.x | Data visualization |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x LTS | JavaScript runtime |
| **Express** | 4.x | Web server framework |
| **TypeScript** | 5.x | Type-safe backend code |
| **Axios** | 1.x | HTTP client for external APIs |
| **Groq SDK** | Latest | Groq AI integration |
| **Googleapis** | Latest | YouTube API client |

### Database & Storage

| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database + Auth |
| **PostgreSQL** | 15.x - Relational database |
| **Row-Level Security** | Data access control |

### AI & ML

| Service | Model | Purpose |
|---------|-------|---------|
| **Fuelix AI** | GPT-5.2 Chat | Primary AI for insights |
| **Groq** | Llama 3.3 70B | Fallback AI provider |

---

## 📡 API Documentation

### Base URLs

| Environment | URL |
|-------------|-----|
| **Development** | http://localhost:3001 |
| **Production** | https://api.creatoriq.app |

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

### API Endpoints Reference

#### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Create new user account | ❌ |
| POST | `/auth/login` | Login and get JWT token | ❌ |
| POST | `/auth/logout` | Logout (invalidate token) | ✅ |
| GET | `/auth/me` | Get current user info | ✅ |

#### Platform Connection Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/instagram/auth` | Get Instagram OAuth URL | ✅ |
| GET | `/instagram/callback` | OAuth callback handler | ❌ |
| GET | `/instagram/status` | Check connection status | ✅ |
| GET | `/instagram/analytics` | Get Instagram analytics | ✅ |
| POST | `/instagram/disconnect` | Disconnect Instagram | ✅ |
| GET | `/youtube/auth` | Get YouTube OAuth URL | ✅ |
| GET | `/youtube/callback` | OAuth callback handler | ❌ |
| GET | `/youtube/status` | Check connection status | ✅ |
| GET | `/youtube/analytics` | Get YouTube analytics | ✅ |
| POST | `/youtube/disconnect` | Disconnect YouTube | ✅ |

#### Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/timeline/:userId` | Get analytics timeline | ✅ |
| GET | `/audience/demographics` | Get audience demographics | ✅ |
| GET | `/audience/posting-times` | Get best posting times | ✅ |

#### AI Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/ai/insights` | Generate AI insights | ✅ |
| POST | `/ai/categorize-tax` | Categorize revenue for tax | ✅ |
| POST | `/ai/content-ideas` | Generate content ideas | ✅ |
| GET | `/ai/status` | Check AI service status | ❌ |

---

### API Request/Response Examples

#### POST /ai/insights

**Request:**
```json
{
  "analytics": {
    "instagram": {
      "followers": 209,
      "posts": 39,
      "engagementRate": 4.2,
      "avgLikes": 12,
      "avgComments": 3,
      "username": "ssup.ritwik"
    },
    "youtube": {
      "subscribers": 4,
      "totalViews": 150,
      "totalVideos": 2,
      "channelName": "Ritwik Vats"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "insights": "## 📈 Performance Overview\nYour Instagram account (@ssup.ritwik) has 209 followers with an engagement rate of 4.2%...",
  "model": "gpt-5.2-chat-2025-12-11 (Fuelix)"
}
```

#### GET /instagram/analytics

**Response:**
```json
{
  "account": {
    "username": "ssup.ritwik",
    "followers_count": 209,
    "media_count": 39,
    "engagement_rate": 4.2,
    "avg_likes": 12,
    "avg_comments": 3
  },
  "recentMedia": [
    {
      "id": "123456",
      "caption": "Post title...",
      "like_count": 45,
      "comments_count": 8,
      "timestamp": "2026-02-01T10:00:00Z"
    }
  ],
  "topPosts": [
    {
      "id": "123456",
      "like_count": 45,
      "comments_count": 8
    }
  ]
}
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o{ connected_platforms : has
    users ||--o{ analytics_snapshots : tracks
    users ||--o{ revenue_entries : earns
    users ||--o{ brand_deals : manages

    users {
        uuid id PK
        string email UK
        string password_hash
        string name
        timestamp created_at
        timestamp updated_at
    }

    connected_platforms {
        uuid id PK
        uuid user_id FK
        enum platform
        string platform_user_id
        string platform_username
        text access_token
        text refresh_token
        timestamp token_expires_at
        timestamp connected_at
        timestamp updated_at
    }

    analytics_snapshots {
        uuid id PK
        uuid user_id FK
        enum platform
        date snapshot_date
        jsonb metrics
        timestamp created_at
    }

    revenue_entries {
        uuid id PK
        uuid user_id FK
        string source
        decimal amount
        string currency
        date received_at
        string category
        jsonb tax_details
        timestamp created_at
    }

    brand_deals {
        uuid id PK
        uuid user_id FK
        string brand_name
        decimal amount
        string status
        date deal_date
        text deliverables
        timestamp created_at
    }
```

### Table Definitions

#### `users` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email (lowercase) |
| `password_hash` | TEXT | NOT NULL | Bcrypt hashed password |
| `name` | VARCHAR(100) | | User display name |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update time |

#### `connected_platforms` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique connection ID |
| `user_id` | UUID | FOREIGN KEY | Reference to users table |
| `platform` | ENUM | NOT NULL | 'instagram', 'youtube', etc. |
| `platform_user_id` | VARCHAR(255) | NOT NULL | Instagram account ID or YouTube channel ID |
| `platform_username` | VARCHAR(100) | | Display name (@username) |
| `access_token` | TEXT | ENCRYPTED | OAuth access token (AES-256-GCM) |
| `refresh_token` | TEXT | ENCRYPTED | OAuth refresh token (YouTube only) |
| `token_expires_at` | TIMESTAMP | | Token expiry (YouTube only) |
| `connected_at` | TIMESTAMP | DEFAULT NOW() | When platform was first connected |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last token refresh/update |

**Indexes:**
- `UNIQUE(user_id, platform)` - One connection per platform per user
- `INDEX(user_id)` - Fast user lookups

---

## 🔐 Authentication Flow

### JWT Token Authentication

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Database

    User->>Frontend: Enter email + password
    Frontend->>API: POST /auth/login
    API->>Database: Verify credentials
    Database-->>API: User found
    API->>API: Generate JWT token<br/>(7-day expiry)
    API-->>Frontend: Return token + user data
    Frontend->>Frontend: Store token in localStorage
    Frontend->>User: Redirect to dashboard

    Note over Frontend,API: Authenticated Requests

    Frontend->>API: GET /instagram/analytics<br/>Header: Authorization: Bearer <token>
    API->>API: Verify JWT signature
    API->>API: Check expiry
    API->>API: Extract user_id from payload
    API->>Database: Fetch data for user_id
    Database-->>API: Return data
    API-->>Frontend: Return analytics
```

### OAuth 2.0 Flow (Instagram Example)

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Instagram
    participant Database

    User->>Frontend: Click "Connect Instagram"
    Frontend->>API: GET /instagram/auth<br/>Header: Authorization: Bearer <jwt>
    API->>API: Extract user_id from JWT
    API->>API: Generate OAuth URL with state=<user_id>
    API-->>Frontend: Return authUrl
    Frontend->>Instagram: Redirect to OAuth page
    Instagram->>User: "Authorize CreatorIQ?"
    User->>Instagram: Click "Allow"
    Instagram->>API: GET /instagram/callback?code=XXX&state=<user_id>
    API->>Instagram: POST /oauth/access_token<br/>Exchange code for token
    Instagram-->>API: Return access_token
    API->>API: Encrypt access_token using AES-256-GCM
    API->>Instagram: GET /<account_id><br/>Fetch account details
    Instagram-->>API: Return account data
    API->>Database: INSERT INTO connected_platforms
    Database-->>API: Connection saved
    API-->>Frontend: Redirect to /dashboard?instagram=connected
    Frontend->>User: Show success notification
```

---

## 🔌 Platform Integrations

### Instagram Graph API Integration

#### API Version
Instagram Graph API **v22.0**

#### Required Permissions

| Permission | Purpose | Access Level |
|------------|---------|--------------|
| `instagram_basic` | Read profile info and media | Standard |
| `instagram_manage_insights` | Access analytics and demographics | Standard |
| `pages_show_list` | List Facebook Pages | Standard |
| `pages_read_engagement` | Read Page engagement data | Standard |

#### Demographics API Implementation

The Instagram demographics endpoint requires specific parameters:

```mermaid
flowchart LR
    A[Request Demographics] --> B{Fetch Country}
    B -->|GET /insights| C[metric: follower_demographics<br/>breakdown: country<br/>metric_type: total_value]
    C --> D{Fetch City}
    D -->|GET /insights| E[metric: follower_demographics<br/>breakdown: city<br/>metric_type: total_value]
    E --> F{Fetch Age/Gender}
    F -->|GET /insights| G[metric: follower_demographics<br/>breakdown: age,gender<br/>metric_type: total_value]
    G --> H[Combine Results]
    H --> I[Return Demographics Object]

    style C fill:#E11D48,color:#fff
    style E fill:#0891B2,color:#fff
    style G fill:#9333EA,color:#fff
```

**Code Example:**
```typescript
// Fetch country demographics
const countryResponse = await axios.get(
  `${INSTAGRAM_API_BASE}/${igAccountId}/insights`,
  {
    params: {
      metric: 'follower_demographics',
      period: 'lifetime',
      breakdown: 'country',
      metric_type: 'total_value',
      access_token: accessToken,
    },
  }
);

// Parse response
const countryData = countryResponse.data.data?.[0]?.total_value?.breakdowns?.[0]?.results || [];
const countries = countryData
  .map((item: any) => ({
    country: item.dimension_values?.[0] || 'Unknown',
    count: item.value || 0
  }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 10);
```

---

### YouTube Analytics API Integration

#### API Version
YouTube Data API **v3** + YouTube Analytics API **v2**

#### Required Scopes

| Scope | Purpose |
|-------|---------|
| `https://www.googleapis.com/auth/youtube.readonly` | Read channel data |
| `https://www.googleapis.com/auth/yt-analytics-monetary.readonly` | Read revenue data |
| `https://www.googleapis.com/auth/userinfo.profile` | User profile |
| `https://www.googleapis.com/auth/userinfo.email` | User email |

#### Demographics API

```mermaid
graph TD
    A[Request Demographics] --> B[Fetch Geography]
    B --> C[GET youtubeAnalytics.reports.query<br/>metrics: views<br/>dimensions: country<br/>filters: country!=ZZ]
    C --> D{YouTube Partner<br/>Program?}
    D -->|Yes| E[Fetch Age/Gender<br/>dimensions: ageGroup,gender<br/>filters: country==US]
    D -->|No| F[Skip Age/Gender<br/>Requires YPP]
    E --> G[Return Full Demographics]
    F --> G

    style C fill:#DC2626,color:#fff
    style E fill:#059669,color:#fff
    style F fill:#F59E0B,color:#fff
```

**Important Notes:**
- Geography demographics work for all channels
- Age/gender demographics require YouTube Partner Program enrollment
- Filters are **required** for certain queries to avoid API errors

---

## 🤖 AI Services Integration

### Architecture: Primary + Fallback Pattern

```mermaid
flowchart TD
    A[AI Insight Request] --> B{Fuelix AI<br/>Available?}
    B -->|Yes| C[Send to Fuelix<br/>GPT-5.2]
    B -->|No| D[Send to Groq<br/>Llama 3.3]
    C --> E{Response<br/>Successful?}
    E -->|Yes| F[Return Insights]
    E -->|No| G[Log Error]
    G --> D
    D --> H{Response<br/>Successful?}
    H -->|Yes| F
    H -->|No| I[Return Error:<br/>AI Unavailable]

    style C fill:#9333EA,color:#fff
    style D fill:#DC2626,color:#fff
```

### Fuelix AI Service

**Model**: `gpt-5.2-chat-2025-12-11`
**Provider**: Fuelix AI (OpenClaw backend)
**API Base**: `https://api.fuelix.ai/v1`

**Configuration:**
```typescript
class OpenClawService {
  private apiKey: string;
  private baseUrl: string;

  // Lazy initialization - reads env vars at runtime
  private ensureInitialized() {
    if (!this.initialized) {
      this.apiKey = process.env.OPENCLAW_API_KEY || '';
      this.baseUrl = process.env.OPENCLAW_API_URL || 'https://api.fuelix.ai/v1';
      this.initialized = true;
    }
  }

  isAvailable(): boolean {
    this.ensureInitialized();
    return !!this.apiKey;
  }
}
```

**Why Lazy Initialization?**
Environment variables are loaded by `dotenv.config()` after module imports. Lazy initialization ensures we read the API key **after** it's been loaded into `process.env`.

### Groq AI Service (Fallback)

**Model**: `llama-3.3-70b-versatile`
**Provider**: Groq
**SDK**: `groq-sdk`

**Usage:**
```typescript
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const completion = await groq.chat.completions.create({
  messages: [
    { role: 'system', content: 'You are an expert creator consultant...' },
    { role: 'user', content: prompt }
  ],
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,
  max_tokens: 1000,
});
```

---

## 🔒 Security Implementation

### Token Encryption

**Algorithm**: AES-256-GCM
**Key Derivation**: `crypto.scryptSync` with salt

```mermaid
flowchart LR
    A[Plain Access Token] --> B[Generate Random IV<br/>16 bytes]
    B --> C[Create AES-256-GCM Cipher]
    C --> D[Encrypt Token]
    D --> E[Get Auth Tag<br/>16 bytes]
    E --> F[Combine:<br/>IV + Tag + Encrypted Data]
    F --> G[Base64 Encode]
    G --> H[Store in Database]

    style C fill:#DC2626,color:#fff
    style F fill:#059669,color:#fff
```

**Encryption Code:**
```typescript
encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LENGTH); // 16 bytes
  const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag(); // 16 bytes

  // Format: iv(16) + tag(16) + encrypted data
  const result = Buffer.concat([iv, tag, Buffer.from(encrypted, 'hex')]);

  return result.toString('base64');
}
```

**Decryption Code:**
```typescript
decrypt(encryptedData: string): string {
  const buffer = Buffer.from(encryptedData, 'base64');

  // Extract components
  const iv = buffer.subarray(0, IV_LENGTH);
  const tag = buffer.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = buffer.subarray(IV_LENGTH + TAG_LENGTH);

  const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

### Backward Compatibility

For existing plaintext tokens in the database:

```typescript
safeDecrypt(data: string): string {
  try {
    return this.decrypt(data); // Try decryption first
  } catch (error) {
    console.warn('⚠️ Token decryption failed, using as plaintext (legacy token)');
    return data; // Fallback to plaintext
  }
}
```

---

## 🚀 Deployment Guide

### Environment Variables

**Required Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGci...` |
| `GOOGLE_CLIENT_ID` | YouTube OAuth client ID | `123456.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | YouTube OAuth secret | `GOCSPX-xxx` |
| `FACEBOOK_APP_ID` | Instagram app ID | `765342356611450` |
| `FACEBOOK_APP_SECRET` | Instagram app secret | `10c8264ac6...` |
| `OPENCLAW_API_KEY` | Fuelix AI API key | `ak-CDNhG4...` |
| `GROQ_API_KEY` | Groq AI API key | `gsk_FQno...` |
| `ENCRYPTION_KEY` | AES-256 encryption key | `68295ec2f2...` |
| `JWT_SECRET` | JWT signing secret | `development-secret-key` |

### Deployment Architecture

```mermaid
graph TB
    subgraph "Frontend - Vercel"
        A[Next.js App<br/>Static + SSR]
        A --> A1[Edge Network CDN]
    end

    subgraph "Backend - Railway/Render"
        B[Express API<br/>Node.js Container]
        B --> B1[Auto-scaling]
        B --> B2[Health Checks]
    end

    subgraph "Database - Supabase"
        C[(PostgreSQL)]
        C --> C1[Auto Backups]
        C --> C2[Read Replicas]
    end

    A1 -->|HTTPS| B
    B -->|Connection Pool| C

    style A fill:#4F46E5,color:#fff
    style B fill:#059669,color:#fff
    style C fill:#0891B2,color:#fff
```

---

## 💻 Development Workflow

### Setup Instructions

```bash
# Clone repository
git clone https://github.com/ritwikvats/creatoriq.git
cd creatoriq

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development servers
npm run dev:all  # Starts both frontend and backend

# Or run separately:
cd apps/api && npm run dev      # Backend on :3001
cd apps/web && npm run dev      # Frontend on :3004
```

### Project Structure

```
CreatorIQ/
├── apps/
│   ├── api/                    # Express backend
│   │   ├── src/
│   │   │   ├── routes/         # API route handlers
│   │   │   ├── services/       # Business logic
│   │   │   ├── middleware/     # Auth, error handling
│   │   │   ├── jobs/           # Background jobs
│   │   │   └── index.ts        # Server entry point
│   │   └── package.json
│   └── web/                    # Next.js frontend
│       ├── app/                # Next.js 14 app router
│       ├── components/         # React components
│       ├── lib/                # Utilities
│       └── package.json
├── docs/                       # Documentation
├── scripts/                    # Utility scripts
├── .env.example               # Environment template
├── PRD.md                     # Product requirements
└── TECHNICAL_DOCUMENTATION.md # This file
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- --grep "Instagram Service"
npm test -- --grep "AI Insights"

# Coverage report
npm run test:coverage
```

---

## 📊 Monitoring & Logging

### API Logging

All API requests are logged with:
- Method, path, user ID
- Response time
- Status code

Example log:
```
[2026-02-08T07:31:36.049Z] [INFO] [API] GET /demographics { userId: "abc123", duration: "2854ms" }
```

---

## 🆘 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Invalid OAuth access token" | Token expired or invalid | Reconnect platform in dashboard |
| "OPENCLAW_API_KEY not set" | Env var loaded before dotenv | Lazy initialization implemented ✅ |
| "Demographics not available" | Missing `metric_type` parameter | Added to all requests ✅ |
| "No filter selected" (YouTube) | Analytics API requires filters | Added `filters` parameter ✅ |

---

**Document Maintainer**: Engineering Team
**Last Reviewed**: February 8, 2026
**Next Review**: March 8, 2026
