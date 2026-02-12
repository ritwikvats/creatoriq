# Platform Verification Checklist - CreatorIQ

## 📋 Pre-Submission Requirements (Both Platforms)

### ✅ Already Done
- [x] Privacy Policy page (http://localhost:3004/privacy)
- [x] Terms of Service page (http://localhost:3004/terms)
- [x] Sentry error monitoring
- [x] Rate limiting
- [x] Security headers (Helmet)
- [x] User analytics (PostHog)

### 🔧 Need to Complete
- [ ] Deploy to production domain (creatoriq.com or similar)
- [ ] Update Privacy/Terms URLs in OAuth apps
- [ ] Create demo/test account for reviewers
- [ ] Record demo video showing app functionality
- [ ] Take screenshots of key features
- [ ] Prepare app description/use case

---

## 🔵 Google OAuth Consent Screen Verification

**Timeline:** 2-3 weeks
**URL:** https://console.cloud.google.com/apis/credentials/consent

### Step 1: Prepare Required Information

#### App Information
- [ ] **App name:** CreatorIQ
- [ ] **App logo:** 120x120px PNG (square, no transparency)
- [ ] **Support email:** Your email
- [ ] **Developer contact:** Your email

#### Domain Verification
- [ ] **Authorized domains:**
  - [ ] Add your production domain (e.g., creatoriq.com)
  - [ ] Verify domain ownership via Google Search Console
- [ ] **Application homepage:** https://creatoriq.com
- [ ] **Privacy policy URL:** https://creatoriq.com/privacy
- [ ] **Terms of service URL:** https://creatoriq.com/terms

#### OAuth Scopes (YouTube Analytics)
Current scopes we use:
- [ ] `https://www.googleapis.com/auth/youtube.readonly` - View YouTube account
- [ ] `https://www.googleapis.com/auth/yt-analytics.readonly` - View YouTube Analytics

#### Justification (Why we need these scopes)
```
CreatorIQ is a creator analytics dashboard that helps YouTube creators
track their channel performance, revenue, and audience demographics in
one unified platform. We need:

1. youtube.readonly - To fetch channel information and video metadata
2. yt-analytics.readonly - To display analytics like views, watch time,
   subscriber growth, and revenue data

Users explicitly connect their YouTube accounts to view their own data
in our dashboard. We do not store credentials and only use OAuth tokens
to fetch read-only analytics data.
```

### Step 2: Create Demo Video (Required)

**Requirements:**
- [ ] Max 1 minute long
- [ ] Show OAuth consent flow
- [ ] Show what data is accessed
- [ ] Show how data is used in the app
- [ ] Upload to YouTube (unlisted is fine)

**Demo Script:**
1. Go to CreatorIQ homepage
2. Click "Connect YouTube"
3. Google OAuth consent screen appears
4. Show the scopes being requested
5. Approve and return to app
6. Show YouTube analytics dashboard
7. Show how user's data is displayed

### Step 3: Screenshots (4-6 required)

- [ ] Homepage with "Connect YouTube" button
- [ ] OAuth consent screen (showing scopes)
- [ ] YouTube analytics dashboard
- [ ] Channel stats display
- [ ] Revenue tracking (if applicable)
- [ ] User profile/settings

### Step 4: Submit for Verification

**Dashboard Location:**
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Click "Edit App"
3. Fill in all fields from Step 1
4. Upload logo, screenshots, demo video
5. Click "Submit for Verification"

**What Happens Next:**
- Google reviews your app (2-3 weeks)
- They may ask clarifying questions via email
- Once approved, your app can have unlimited users

---

## 🟦 Facebook App Review (Instagram Advanced Access)

**Timeline:** 2-3 weeks
**URL:** https://developers.facebook.com/apps/765342356611450/app-review/

### Step 1: Prepare Required Information

#### App Details
- [ ] **App name:** CreatorIQ
- [ ] **Category:** Business and Pages
- [ ] **Privacy Policy URL:** https://creatoriq.com/privacy
- [ ] **Terms of Service URL:** https://creatoriq.com/terms
- [ ] **App icon:** 1024x1024px PNG
- [ ] **Data deletion instructions URL:** https://creatoriq.com/privacy (see section 5)

#### Business Verification (Required for Advanced Access)
- [ ] **Business name:** Your legal business name
- [ ] **Business documents:**
  - [ ] Business registration certificate OR
  - [ ] Tax ID document OR
  - [ ] Utility bill with business address
- [ ] **Business phone number**
- [ ] **Business website:** https://creatoriq.com

### Step 2: Permissions to Request

We need **Advanced Access** for:
- [ ] `instagram_business_basic` - Basic profile and media
- [ ] `instagram_business_manage_insights` - Analytics and insights

**Use Case Description:**
```
CreatorIQ is a unified analytics dashboard for content creators.
We request Advanced Access to Instagram Business permissions to:

1. Fetch user's Instagram Business account profile and media list
2. Display analytics (impressions, reach, engagement) for posts
3. Show audience demographics (age, gender, location)

Users explicitly connect their Instagram Business accounts to view
their own analytics data. All data is displayed in read-only format
within our dashboard. We do not post content or modify user accounts.
```

### Step 3: Demo Video (Required)

**Requirements:**
- [ ] Max 1 minute long
- [ ] Show complete user flow
- [ ] Demonstrate all requested permissions
- [ ] Show where/how data is displayed
- [ ] Upload to public hosting (YouTube, Vimeo)

**Demo Script:**
1. Start at CreatorIQ homepage (logged in)
2. Click "Connect Instagram"
3. Facebook/Instagram OAuth appears
4. Show permissions being requested
5. Approve and return to app
6. Show Instagram analytics dashboard
7. Show demographics, post insights, engagement metrics

### Step 4: Screenshots (Required)

- [ ] **Login screen** - Where users initiate Instagram connection
- [ ] **OAuth screen** - Showing permission requests
- [ ] **Main dashboard** - After connecting Instagram
- [ ] **Analytics view** - Showing how Instagram data is used
- [ ] **Settings/disconnect** - How users can revoke access

**Screenshot Requirements:**
- High resolution (at least 1280x720)
- Show actual UI, not mockups
- Include explanatory annotations if needed
- Must show actual Instagram data usage

### Step 5: Test Users (Provide 2 Test Accounts)

Facebook will need to test your app:
- [ ] Create 2 test Instagram Business accounts
- [ ] Credentials format:
  ```
  Account 1:
  Instagram username: @creatoriq_test1
  Password: [provide secure password]

  Account 2:
  Instagram username: @creatoriq_test2
  Password: [provide secure password]
  ```

### Step 6: Detailed Use Case Answers

Be ready to answer:

**Q: How does your app use Instagram data?**
```
CreatorIQ fetches Instagram Business insights (impressions, reach,
engagement, demographics) and displays them in a unified analytics
dashboard alongside YouTube and other platform metrics. Users can
view historical trends, compare performance across platforms, and
export data for reporting.
```

**Q: How do users benefit from your app?**
```
Content creators manage multiple platforms (YouTube, Instagram, etc.)
and currently need to check each platform separately. CreatorIQ
consolidates all analytics in one place, saving time and providing
cross-platform insights that individual platforms don't offer.
```

**Q: How do you protect user data?**
```
- OAuth tokens encrypted at rest using AES-256
- All API requests over HTTPS
- Rate limiting to prevent abuse
- Error tracking with Sentry (sensitive data filtered)
- Users can disconnect/delete data anytime
- Full GDPR compliance (see privacy policy)
```

### Step 7: Submit for Review

**Dashboard Location:**
1. Go to: https://developers.facebook.com/apps/765342356611450/app-review/
2. Click "Request Advanced Access"
3. Select permissions: `instagram_business_basic`, `instagram_business_manage_insights`
4. Fill in use case description
5. Upload screenshots and demo video
6. Provide test user credentials
7. Submit

**What Happens Next:**
- Facebook reviews (2-3 weeks)
- They test with your provided credentials
- May ask for clarifications
- Once approved, can use with any Instagram Business account

---

## 🎯 Submission Timeline

### Week 1 (Preparation)
- [ ] Deploy to production domain
- [ ] Update all URLs (privacy, terms)
- [ ] Create demo accounts
- [ ] Record demo videos (both platforms)
- [ ] Take all screenshots
- [ ] Write detailed use case descriptions

### Week 2 (Submit)
- [ ] Submit Google OAuth verification (Monday)
- [ ] Submit Facebook App Review (Tuesday)
- [ ] Monitor emails for reviewer questions

### Week 3-5 (Review Period)
- [ ] Respond to any reviewer questions within 24h
- [ ] Make requested changes if needed
- [ ] Wait for approval

### Week 6 (Launch)
- [ ] Both platforms approved ✅
- [ ] Update app to production mode
- [ ] Launch to public!

---

## 📧 Contact Info for Reviewers

**Support Email:** ritvikvats@gmail.com (or your business email)
**Developer Email:** ritvikvats@gmail.com
**Business Contact:** Your phone number

---

## ⚠️ Common Rejection Reasons (Avoid These!)

### Google OAuth
- ❌ Vague scope justification
- ❌ Demo video doesn't show all requested scopes
- ❌ Privacy policy missing required sections
- ❌ Using localhost URLs instead of production domain

### Facebook App Review
- ❌ Test credentials don't work
- ❌ App doesn't clearly show how Instagram data is used
- ❌ Screenshots are mockups instead of actual UI
- ❌ Use case is too generic/vague
- ❌ Privacy policy incomplete

---

## ✅ Pre-Launch Checklist

Before submitting:
- [ ] Production domain live and accessible
- [ ] Privacy policy accessible at /privacy
- [ ] Terms of service accessible at /terms
- [ ] Demo accounts work (test yourself first)
- [ ] Demo videos uploaded and public/unlisted
- [ ] Screenshots saved and organized
- [ ] All URLs use HTTPS (not HTTP)
- [ ] App actually works end-to-end

---

## 🚀 Ready to Start?

**Next Steps:**
1. Deploy to production domain first
2. Then tackle Google OAuth (Week 1)
3. Then tackle Facebook Review (Week 2)
4. Both run in parallel (review takes 2-3 weeks each)

**Need Help With:**
- Production deployment? (Vercel, Netlify, Railway)
- Domain setup?
- Creating demo videos?
- Writing better use case descriptions?

Let me know what you want to tackle first!
