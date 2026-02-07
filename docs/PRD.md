# CreatorIQ - Product Requirements Document (PRD)

**Version:** 1.0
**Date:** February 2026
**Author:** Product Team
**Status:** Active Development

---

## 1. Executive Summary

### 1.1 Product Vision
CreatorIQ is a unified analytics and business management platform for digital content creators in India. We solve the fragmentation problem where creators must juggle multiple platforms (YouTube Studio, Instagram Insights, spreadsheets, calculators) to understand their business.

### 1.2 Problem Statement
Indian content creators face 4 critical pain points:

1. **Data Fragmentation**: YouTube, Instagram, LinkedIn show only their own analytics
2. **Data Loss**: Instagram deletes data after 90 days
3. **Manual Finance Tracking**: No unified system for revenue, taxes, brand deals
4. **Compliance Burden**: Complex Indian tax laws (GST, TDS, ITR) with frequent changes

**Current User Journey (Broken):**
```
Morning: Check YouTube Studio (10 min)
        → Check Instagram Insights (5 min)
        → Update Excel spreadsheet (15 min)
Afternoon: Calculate GST manually (20 min)
          → Download TDS certificates (10 min)
Evening: Update brand deal tracker (15 min)
         → Calculate quarterly advance tax (30 min)

Total: 1.5 hours/day of manual work = 45 hours/month wasted
```

### 1.3 Solution Overview
**One Dashboard. All Platforms. Complete Business Management.**

CreatorIQ consolidates:
- **Analytics**: YouTube + Instagram + LinkedIn + X (coming soon)
- **Revenue**: AdSense + Brand Deals + Affiliates + Merch
- **Tax Compliance**: Auto-calculated GST, TDS, Income Tax with AI updates
- **Business Tools**: Brand deal CRM, invoice generation, media kits

**New User Journey (Fixed):**
```
Morning: Open CreatorIQ dashboard (2 min)
        → See all platforms analytics
        → Check revenue breakdown
        → Review pending brand deals
Evening: Get AI tax insights (1 min)
         → Download tax reports

Total: 3 minutes/day = 1.5 hours/month saved
```

---

## 2. Market Research & Opportunity

### 2.1 Market Size (India, 2026)

**Total Addressable Market (TAM):**
- 2M+ content creators earning money (Budget 2026 data)
- Growing to 5M by 2030 (Government target)
- Market Value: $500M+ annually

**Serviceable Addressable Market (SAM):**
- 200K creators earning ₹5L-50L/year
- Multi-platform creators (YouTube + Instagram minimum)
- Need professional tools for compliance
- Market Value: $100M annually

**Serviceable Obtainable Market (SOM):**
- Target: 10K paying creators in Year 1
- Average Revenue: $50/month (₹4,200/month)
- Year 1 Revenue Target: $6M ARR

### 2.2 Market Trends (2026)

**Government Initiatives:**
1. **Budget 2026**: ₹4,200 crore allocated to creator economy
2. **Job Creation**: 2M creator jobs by 2030 target
3. **Startup India**: Benefits for creator businesses (OPC/LLP)
4. **Digital India**: Push for formalization and compliance

**Creator Behavior Shifts:**
1. **Multi-platform Strategy**: 87% of top creators post on 3+ platforms
2. **Professionalization**: Creators registering as businesses (GST, companies)
3. **Brand Collaboration**: 70% of creator income from brand deals (vs 30% platform revenue)
4. **Tax Anxiety**: 65% of creators unsure about tax compliance

**Technology Trends:**
1. **AI Adoption**: Creators using AI for content and analytics
2. **API Access**: Platforms opening more data access
3. **SaaS Adoption**: Creators willing to pay for business tools
4. **Mobile-First**: 80% of creators manage business on mobile

---

## 3. Target Audience & Personas

### 3.1 Ideal Customer Profile (ICP)

**Primary Target: Growing Mid-Tier Creator**

**Demographics:**
- Age: 22-35 years
- Location: Tier 1/2 cities in India
- Education: College graduates, self-taught content creators
- Tech Savviness: High (comfortable with apps, analytics)

**Professional Profile:**
- **Follower Range**: 10K-500K across platforms
- **Annual Income**: ₹5L-50L from content creation
- **Platforms**: Active on 2-3 platforms (YouTube + Instagram primary)
- **Content Type**: Lifestyle, tech, finance, education, comedy
- **Status**: Full-time creators or serious part-time

**Behavioral Traits:**
- Posts 2-5 times per week consistently
- Works with 3-10 brands per year
- Tracks analytics weekly
- Stressed about tax compliance
- Wants to grow professionally
- Willing to invest in business tools

**Pain Points (Ranked):**
1. **Tax Compliance** (Critical): Fear of penalties, don't understand GST/TDS
2. **Brand Deal Management** (High): Tracking negotiations, invoices, payments in spreadsheets
3. **Analytics Fragmentation** (High): Switching between 5 different apps daily
4. **Data Loss** (Medium): Can't see Instagram performance from 6 months ago
5. **Revenue Tracking** (Medium): Manual Excel updates, prone to errors

**Goals:**
- Primary: Grow audience and revenue
- Secondary: Professional business operations
- Tertiary: Tax compliance without CA fees (₹20K-50K/year)

---

### 3.2 User Personas

#### Persona 1: "Priya - The Full-Time YouTuber"

**Background:**
- 26 years old, Bangalore
- 150K YouTube subscribers, 50K Instagram followers
- Content: Personal finance and investing tips
- Income: ₹30L/year (₹15L AdSense + ₹15L brand deals)
- Team: Solo creator, occasional video editor

**Quote:** *"I spend more time on taxes and spreadsheets than creating content."*

**Needs:**
1. Unified analytics to track what content performs where
2. Automated tax calculations (GST registered, quarterly returns)
3. Brand deal pipeline management
4. Historical data to pitch brands ("My Q4 2025 metrics...")

**Frustrations:**
- Lost Instagram data from July 2025 campaign
- Spent ₹35K on CA for ITR filing
- Missed brand payment follow-ups
- Can't compare YouTube vs Instagram ROI

**Success Metrics:**
- Saves 10 hours/month on admin work
- Reduces CA fees by 50%
- Closes 2 more brand deals/year (better data)
- Zero tax penalties

---

#### Persona 2: "Arjun - The Side Hustler"

**Background:**
- 29 years old, Pune
- 25K YouTube subscribers, 40K Instagram followers
- Content: Tech reviews and unboxing
- Income: ₹8L/year (₹5L job + ₹3L content)
- Goal: Quit job and go full-time in 12 months

**Quote:** *"I'm making money but have no idea if I should register for GST."*

**Needs:**
1. Simple tax advice: "Do I need GST? How much tax will I pay?"
2. Revenue tracking to know when he can quit his job
3. Brand deal CRM (he's pitching but losing track)
4. Growth insights to optimize content strategy

**Frustrations:**
- Doesn't know his exact creator income (scattered data)
- Worried about surprise tax bills
- Using free tools that don't talk to each other
- Can't justify ₹50K/month SaaS cost yet

**Success Metrics:**
- Clear path to ₹15L/year (full-time threshold)
- Tax clarity and compliance
- Affordable tool (₹500-1500/month budget)
- 30min/week max time spent on admin

---

#### Persona 3: "Neha - The Agency Manager"

**Background:**
- 32 years old, Mumbai
- Manages 8 mid-tier creators
- Agency: "Content Collective" (MCN)
- Revenue: 15% commission on creator deals
- Challenge: Managing multiple creator dashboards

**Quote:** *"I need to see all 8 creators' performance in one place to pitch brands effectively."*

**Needs:**
1. Multi-creator dashboard
2. Consolidated analytics for brand pitches
3. Client reporting automation
4. White-labeled reports

**Frustrations:**
- Logging into 16 different accounts (8 creators × 2 platforms)
- Manual monthly reports for each creator
- Can't compare creator performance easily
- No historical data for trend analysis

**Success Metrics:**
- Manage 15+ creators without hiring more staff
- Close 30% more brand deals with better data
- Automated weekly reports for creators
- ₹5K-10K/creator/month willingness to pay

---

### 3.3 Secondary Audiences

**Micro-Influencers (5K-50K followers):**
- Free tier target for growth
- Conversion to paid when income hits ₹5L/year

**Mega-Creators (1M+ followers):**
- Enterprise tier opportunity
- Custom pricing, dedicated support

**Creator Agencies/MCNs:**
- B2B2C model
- Agency-level features and pricing

---

## 4. Competitor Analysis

### 4.1 Direct Competitors

#### **Competitor 1: Social Blade**

**Product:**
- Multi-platform analytics tracker
- Public leaderboards and rankings
- YouTube/Instagram/Twitter/Twitch support

**Pricing:**
- Free: Basic stats
- Pro: $3.99/month (₹330/month)
- Premium: $9.99/month (₹830/month)

**Strengths:**
- ✅ 15+ years in market, trusted brand
- ✅ Covers 10+ platforms
- ✅ Public data (anyone can check any creator)
- ✅ Affordable pricing

**Weaknesses:**
- ❌ Analytics only - no business tools
- ❌ No tax/revenue features
- ❌ No India-specific compliance
- ❌ Basic insights, no AI
- ❌ No brand deal CRM
- ❌ US-focused, not India-localized

**Threat Level:** Low (different use case)

---

#### **Competitor 2: TubeBuddy**

**Product:**
- YouTube-only creator toolkit
- SEO tools, keyword research
- Bulk processing, A/B testing
- Browser extension

**Pricing:**
- Free: Limited features
- Pro: $9/month (₹750/month)
- Star: $19/month (₹1,580/month)
- Legend: $49/month (₹4,080/month)

**Strengths:**
- ✅ Deep YouTube integration
- ✅ 5M+ users
- ✅ Powerful SEO and optimization tools
- ✅ Active community

**Weaknesses:**
- ❌ YouTube ONLY (no Instagram, LinkedIn)
- ❌ No tax/finance features
- ❌ No brand deal management
- ❌ Expensive for India (₹4K/month)
- ❌ Not India-specific

**Threat Level:** Low (different focus)

---

#### **Competitor 3: Hootsuite Analytics**

**Product:**
- Social media management + analytics
- Multi-platform scheduling
- Team collaboration
- Enterprise reporting

**Pricing:**
- Professional: $99/month (₹8,250/month)
- Team: $249/month (₹20,750/month)
- Enterprise: Custom (₹50K+/month)

**Strengths:**
- ✅ Enterprise-grade
- ✅ Multi-platform (10+ networks)
- ✅ Team features
- ✅ Robust analytics

**Weaknesses:**
- ❌ EXPENSIVE (₹8K-50K/month)
- ❌ Designed for brands/agencies, not creators
- ❌ Overkill features (scheduling, listening)
- ❌ No creator-specific features (tax, revenue)
- ❌ Complex UI, steep learning curve

**Threat Level:** None (different market)

---

### 4.2 Indirect Competitors

**Manual Solutions:**
- Excel/Google Sheets (free, painful)
- Chartered Accountants (₹20K-50K/year)
- Multiple free apps (fragmented)

**Threat:** High inertia - creators stick with "good enough"

---

### 4.3 Our Competitive Advantages

**Why CreatorIQ Wins:**

1. **India-First Design** ⭐
   - Only tool with GST, TDS, ITR compliance
   - Rupee-denominated, Indian tax laws
   - Budget 2026 updates built-in

2. **Complete Business Suite** ⭐
   - Not just analytics - CRM, tax, revenue, invoicing
   - One tool replaces 5 tools + CA

3. **AI-Powered Insights** ⭐
   - Groq-powered tax advice
   - Cross-platform intelligence
   - Predictive analytics

4. **Affordable Pricing** ⭐
   - ₹500-2000/month vs ₹8K+ competitors
   - Free tier to start

5. **Creator-Centric**
   - Built FOR creators, not adapted from agency tools
   - Simple UI, no enterprise bloat

---

## 5. Feature Requirements

### 5.1 MVP Features (Current - Month 1-2)

#### **Core Analytics**
- ✅ YouTube OAuth integration
- ✅ Instagram OAuth integration
- ✅ Unified dashboard view
- ✅ Historical data storage (unlimited)
- ⬜ Platform comparison charts
- ⬜ Export to PDF/CSV

**Acceptance Criteria:**
- User can connect YouTube and Instagram in < 2 minutes
- Dashboard loads in < 3 seconds
- Data syncs every 24 hours
- Can view data from 1 year ago

---

#### **Revenue Tracking**
- ✅ Manual revenue entry (AdSense, brand deals, etc.)
- ✅ Multiple revenue sources
- ⬜ Automatic AdSense sync via API
- ⬜ Monthly/quarterly breakdown
- ⬜ Revenue trends and projections

**Acceptance Criteria:**
- Add revenue entry in < 30 seconds
- Support for 5 revenue types
- Can filter by platform, source, date

---

#### **Tax Compliance** ⭐
- ✅ Indian tax rules database (GST, TDS, Income Tax 2026)
- ✅ Tax liability calculator
- ✅ AI-powered personalized tax advice
- ✅ Auto-sync with government updates (daily)
- ⬜ Form 26AS integration
- ⬜ GST return pre-filling
- ⬜ ITR-3 export

**Acceptance Criteria:**
- Tax calculation accurate to ±₹100
- AI advice generated in < 10 seconds
- Tax rules updated within 24 hours of govt announcement
- Supports income range ₹1L-₹1Cr

---

#### **Brand Deal CRM**
- ✅ Kanban board (Pitching → Negotiating → Closed)
- ✅ Deal cards with brand name, amount, status
- ⬜ Email reminders for follow-ups
- ⬜ Invoice generation
- ⬜ Payment tracking

**Acceptance Criteria:**
- Create deal in < 1 minute
- Drag-and-drop status update
- Filter by status, date, amount

---

#### **Authentication & Security**
- ✅ Supabase Auth (email/password)
- ✅ Row-level security (RLS)
- ✅ Encrypted OAuth tokens
- ⬜ 2FA (optional)
- ⬜ Password reset flow

---

### 5.2 Post-MVP Features (Month 3-6)

#### **Advanced Analytics**
- AI Cross-platform insights ("Your reels outperform YouTube shorts by 3x")
- Competitor benchmarking (anonymous aggregate data)
- Predictive analytics ("You'll hit 100K by June at current growth")
- Content ROI ("This video made you ₹15K")
- Audience demographics (unified across platforms)

#### **Enhanced Tax Features**
- One-click GST return filing (via GSTN API)
- Automatic TDS certificate download
- Advance tax calculator with reminders
- Section 44ADA auto-calculation
- CA consultation marketplace

#### **Business Tools**
- Professional media kit generator (PDF)
- Automated invoice generation (GST-compliant)
- Payment reminders (WhatsApp/Email)
- Contract templates library
- Expense tracking and categorization

#### **Integrations**
- LinkedIn Analytics API
- X (Twitter) API
- Razorpay for payment tracking
- WhatsApp Business API
- Google Drive export

---

### 5.3 Future Vision (Year 2+)

#### **Enterprise Features (MCN/Agency)**
- Multi-creator management
- White-labeled reports
- Client portal
- Team collaboration
- Custom pricing

#### **Monetization Tools**
- Brand marketplace (connect creators ↔ brands)
- Sponsored content tracking
- Affiliate revenue aggregation
- Merch integration (Shopify, WooCommerce)

#### **Global Expansion**
- US tax compliance (1099, federal taxes)
- UK/EU support (VAT, HMRC)
- Multi-currency support

---

## 6. User Stories & Acceptance Criteria

### 6.1 Epic 1: Platform Connection

**User Story 1.1: Connect YouTube**
```
As a creator,
I want to connect my YouTube channel in 2 clicks,
So that I can see my analytics without logging into YouTube Studio.

Acceptance Criteria:
- Click "Connect YouTube" button
- Redirected to Google OAuth
- Grant permissions
- Redirected back to dashboard with success message
- See YouTube stats within 30 seconds
```

**User Story 1.2: Historical Data Import**
```
As a creator,
I want to see my Instagram data from 6 months ago,
So that I can analyze long-term trends (Instagram only shows 90 days).

Acceptance Criteria:
- After connecting Instagram, system imports last 2 years of data
- Can view metrics from any date in past 2 years
- Charts show trends over 6/12/24 months
```

---

### 6.2 Epic 2: Tax Management

**User Story 2.1: Quick Tax Calculation**
```
As a creator earning ₹8L/year,
I want to know how much tax I owe in 10 seconds,
So that I can plan my finances without calling a CA.

Acceptance Criteria:
- Enter annual income: ₹800000
- Click "Calculate Tax"
- See breakdown: GST: ₹0 (below threshold), Income Tax: ₹25,000, TDS: ₹40,000
- See net income after taxes
- Results appear in < 3 seconds
```

**User Story 2.2: AI Tax Advice**
```
As a new creator,
I want personalized tax advice based on my income breakdown,
So that I know exactly what to do (register for GST? File ITR-3?).

Acceptance Criteria:
- Input: ₹5L AdSense + ₹2L brand deals
- Click "Get Tax Advice"
- AI generates 3 sections: Immediate Actions, Tax Optimization, Compliance Checklist
- Advice specific to my situation (not generic)
- Includes deadlines and form numbers
```

---

### 6.3 Epic 3: Brand Deal Management

**User Story 3.1: Track Brand Deal**
```
As a creator,
I want to track my brand negotiations in a Kanban board,
So that I don't lose track of pending deals.

Acceptance Criteria:
- Click "Add Deal"
- Enter: Brand name, amount, contact email
- Deal appears in "Pitching" column
- Drag to "Negotiating" when brand responds
- Set reminder for follow-up
```

---

## 7. Success Metrics & KPIs

### 7.1 Product Metrics

**Activation:**
- Time to first value: < 5 minutes (connect 1 platform)
- Day 1 retention: 70%+
- Week 1 retention: 50%+

**Engagement:**
- DAU/MAU ratio: 30%+ (high for B2B SaaS)
- Sessions per week: 3+ (checking analytics)
- Features used per session: 2+ (analytics + tax or CRM)

**Retention:**
- Month 1 → Month 2: 60%+
- Month 2 → Month 3: 80%+
- Annual retention: 70%+

**Monetization:**
- Free → Paid conversion: 10% in first 3 months
- Annual → Monthly upgrades: 30%
- Churn rate: < 5%/month

---

### 7.2 Business Metrics

**Year 1 Goals:**
- Users: 10,000 total (1,000 paying)
- MRR: $50,000 ($50/user)
- ARR: $600,000
- CAC: < $50 (payback < 1 month)
- LTV: $600 (12 months × $50)
- LTV/CAC: 12:1

**Year 2 Goals:**
- Users: 50,000 total (10,000 paying)
- MRR: $500,000
- ARR: $6,000,000
- Team: 15 people
- Profitability: Breakeven

---

## 8. Monetization Strategy

### 8.1 Pricing Tiers

#### **Free Tier: "Starter"**
**Target:** Micro-creators (< ₹5L/year income)

**Includes:**
- 1 platform connection (YouTube OR Instagram)
- 30 days data retention
- Basic analytics dashboard
- Manual revenue tracking (10 entries/month)
- Basic tax calculator

**Limitations:**
- No AI insights
- No brand deal CRM
- No tax advice
- No exports

**Goal:** 10,000 free users in Year 1

---

#### **Paid Tier: "Pro" - ₹1,999/month (~$24/month)**
**Target:** Growing creators (₹5L-25L/year income)

**Includes Everything in Free, Plus:**
- ✅ Unlimited platform connections
- ✅ Unlimited data storage (lifetime historical data)
- ✅ AI-powered tax advice
- ✅ Brand deal CRM (unlimited deals)
- ✅ GST, TDS, Income Tax calculations
- ✅ Invoice generation
- ✅ PDF exports (media kits, tax reports)
- ✅ Email support

**Value Proposition:**
- Saves ₹20K-30K/year in CA fees
- Saves 40+ hours/month
- ROI: 10x-15x

**Goal:** 1,000 Pro users in Year 1

---

#### **Enterprise Tier: "Agency" - ₹9,999/month (~$120/month)**
**Target:** MCNs, agencies managing 5+ creators

**Includes Everything in Pro, Plus:**
- ✅ Multi-creator dashboard (up to 20 creators)
- ✅ White-labeled reports
- ✅ Client portal
- ✅ Team collaboration (5 seats)
- ✅ Priority support
- ✅ Custom integrations
- ✅ Dedicated account manager

**Goal:** 20 Agency customers in Year 1

---

### 8.2 Additional Revenue Streams

**Add-ons:**
- CA consultation marketplace (20% commission)
- GST return filing service (₹500/quarter)
- Brand marketplace listing (₹2,000/month or 5% deal commission)

**Partnerships:**
- Affiliate revenue from tools (Canva, Adobe, hosting)
- Data licensing (anonymous aggregate insights to brands)

---

## 9. Go-to-Market Strategy

### 9.1 Launch Plan (Month 1-3)

**Phase 1: Private Beta (Month 1)**
- Target: 100 creators (hand-picked)
- Channels: Personal network, DMs to creators
- Goal: Product feedback, testimonials
- Pricing: Free

**Phase 2: Public Beta (Month 2)**
- Target: 1,000 creators
- Channels: ProductHunt launch, Twitter, creator WhatsApp groups
- Goal: Validate product-market fit
- Pricing: Free

**Phase 3: Paid Launch (Month 3)**
- Target: 10,000 users (1,000 paid)
- Channels: Paid ads (YouTube, Instagram), creator partnerships
- Goal: First revenue
- Pricing: Pro tier at ₹1,999/month

---

### 9.2 Marketing Channels

**Organic (70% of acquisition):**
1. **Content Marketing**
   - Blog: "Ultimate Guide to Creator Taxes in India 2026"
   - YouTube: Tutorial videos
   - Instagram: Tips and tricks

2. **SEO**
   - Keywords: "creator tax calculator india", "youtube income tax"
   - Backlinks from creator communities

3. **Community**
   - Creator WhatsApp groups
   - Reddit (r/IndianCreators)
   - Discord servers

4. **Partnerships**
   - Co-marketing with creator tools (Canva, InShot)
   - MCN partnerships

**Paid (30% of acquisition):**
1. **YouTube Ads**
   - Target: Creators watching "how to grow channel" videos
   - Budget: ₹50K/month

2. **Instagram Ads**
   - Target: Creators aged 22-35, interests: content creation
   - Budget: ₹30K/month

3. **Google Ads**
   - Keywords: "creator analytics tool", "youtube tax calculator"
   - Budget: ₹20K/month

---

### 9.3 Customer Acquisition Cost (CAC) Model

**Target CAC: ₹500-1,000 ($6-12)**

**Breakdown:**
- Organic: ₹200/user (content, SEO)
- Paid: ₹1,500/user (ads)
- Blended: ₹500/user (70% organic, 30% paid)

**LTV: ₹24,000 (12 months × ₹2,000/month)**
**LTV/CAC: 24:1 (excellent for SaaS)**

---

## 10. Roadmap

### Month 1-2: MVP (Current)
- ✅ YouTube + Instagram OAuth
- ✅ Unified dashboard
- ✅ Revenue tracking
- ✅ Tax calculator with AI
- ✅ Brand deal Kanban

### Month 3-4: Beta Launch
- ⬜ Advanced analytics charts
- ⬜ Export to PDF
- ⬜ Invoice generation
- ⬜ Form 26AS integration
- ⬜ 100 beta users

### Month 5-6: Paid Launch
- ⬜ Payment integration (Razorpay)
- ⬜ Email automation
- ⬜ Mobile-responsive design
- ⬜ 1,000 users (100 paid)

### Month 7-9: Growth
- ⬜ LinkedIn + X integration
- ⬜ Competitor benchmarking
- ⬜ Media kit generator
- ⬜ 5,000 users (500 paid)

### Month 10-12: Scale
- ⬜ Agency tier launch
- ⬜ Brand marketplace
- ⬜ Mobile apps (iOS, Android)
- ⬜ 10,000 users (1,000 paid)

---

## 11. Risks & Mitigations

### 11.1 Technical Risks

**Risk 1: API Rate Limits (YouTube, Instagram)**
- Impact: Can't fetch data frequently
- Mitigation: Cache aggressively, optimize API calls, use webhooks

**Risk 2: OAuth Token Expiry**
- Impact: Users lose connection, manual re-auth
- Mitigation: Automatic token refresh, email notifications

**Risk 3: Tax Rules Change Mid-Year**
- Impact: Wrong calculations, user complaints
- Mitigation: Daily AI sync, manual update process, disclaimers

---

### 11.2 Business Risks

**Risk 1: Low Willingness to Pay (Indian Market)**
- Impact: Free tier users don't convert
- Mitigation: Prove value early, limit free tier, aggressive sales

**Risk 2: Competitor Copies Features**
- Impact: Social Blade adds tax features
- Mitigation: Move fast, build moat (data, brand, community)

**Risk 3: Platform Changes (Instagram deprecates API)**
- Impact: Can't fetch Instagram data
- Mitigation: Diversify platforms, manual upload fallback

---

### 11.3 Market Risks

**Risk 1: Budget Cuts (Govt reduces creator fund)**
- Impact: Creator sentiment down
- Mitigation: Focus on real value (tax savings), not hype

**Risk 2: Tax Simplification (Govt makes taxes easier)**
- Impact: Our tax USP weakens
- Mitigation: Expand to analytics, CRM as primary value

---

## 12. Open Questions

1. **Should we add LinkedIn before launch or post-launch?**
   - Pros: More complete offering
   - Cons: Delays launch, LinkedIn API complex

2. **Freemium vs Free Trial?**
   - Option A: Freemium (free tier forever)
   - Option B: 14-day free trial of Pro

3. **India-only or global from Day 1?**
   - India-only allows deeper localization
   - Global opens bigger market but dilutes focus

4. **B2C or B2B2C (via MCNs)?**
   - B2C: Direct to creator (slower, higher CAC)
   - B2B2C: Via agencies (faster, lower CAC, but give up control)

---

## 13. Success Definition

**CreatorIQ is successful if:**

**Year 1:**
- 10,000 users (1,000 paying)
- $600K ARR
- 70%+ annual retention
- NPS: 50+
- Testimonials: "CreatorIQ saved me 20 hours/month"

**Year 3:**
- 100,000 users (20,000 paying)
- $12M ARR
- Profitability
- Market leader in India
- Expand to 3 more countries

**Vision (Year 5):**
- 500,000 creators using CreatorIQ
- $50M ARR
- "The operating system for creator businesses"
- Acquisition target for YouTube, Adobe, or Canva

---

**Document Status:** Living document, updated monthly
**Next Review:** March 2026
**Owner:** Product Team
