# Project Structure

```
CreatorIQ/
├── README.md                   # Project overview
├── docs/
│   ├── research.md            # Platform analytics research (2026)
│   ├── mvp-plan.md            # MVP feature specifications
│   └── api-docs.md            # API integration docs
├── apps/
│   ├── web/                   # Next.js frontend
│   └── api/                   # Node.js backend
├── packages/
│   └── shared/                # Shared types & utilities
├── scripts/
│   └── setup/                 # Setup scripts
└── .env.example
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Platform APIs**:
  - YouTube Analytics API
  - Instagram Graph API
  - LinkedIn API
  - X (Twitter) API
- **AI**: Groq (Llama-3)
- **Deployment**: Vercel + Railway

## Getting Started

```bash
# Clone and setup
cd ~/CreatorIQ
pnpm install

# Setup environment
cp .env.example .env
# Add your API keys

# Run dev
pnpm dev
```

## API Integrations Required

### 1. YouTube Analytics API
- **Quota**: 10,000 units/day (free)
- **Auth**: OAuth 2.0
- **Data**: Views, watch time, revenue, demographics

### 2. Instagram Graph API
- **Auth**: Facebook Business Account required
- **Limitations**: 90-day data retention, no competitor data
- **Data**: Reach, impressions, engagement, follower demographics

### 3. LinkedIn API
- **TBD**: Research required

### 4. X (Twitter) API
- **TBD**: Research required

## Development Roadmap

**Week 1-2: Setup**
- [ ] Initialize monorepo
- [ ] Setup Supabase
- [ ] YouTube OAuth integration
- [ ] Instagram OAuth integration

**Week 3-4: MVP Features**
- [ ] Dashboard UI
- [ ] YouTube analytics sync
- [ ] Instagram analytics sync
- [ ] Revenue tracking (manual entry)
- [ ] Basic charts

**Week 5-6: Beta**
- [ ] Onboard 10 creators
- [ ] Feedback collection
- [ ] Bug fixes

**Week 7-8: Launch**
- [ ] Public launch
- [ ] Pro tier pricing
- [ ] Payment integration (Stripe)
