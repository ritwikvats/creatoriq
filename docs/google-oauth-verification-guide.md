# Google OAuth Consent Screen Verification Guide - CreatorIQ

> **Purpose**: Complete step-by-step guide to verify Google OAuth consent screen for YouTube API access
>
> **Timeline**: 3-5 business days (if no security assessment required)
>
> **Status**: 📋 Ready to submit

---

## 📋 Table of Contents

1. [Before You Start](#before-you-start)
2. [OAuth Consent Screen Setup](#oauth-consent-screen-setup)
3. [Scopes Configuration](#scopes-configuration)
4. [Verification Submission](#verification-submission)
5. [Video Demo Requirements](#video-demo-requirements)
6. [Security Assessment](#security-assessment)
7. [Quota Increase Request](#quota-increase-request)
8. [Common Issues](#common-issues)

---

## 🚀 Before You Start

### Prerequisites Checklist

- [ ] **Google Cloud Project** created
- [ ] **YouTube Data API v3** enabled
- [ ] **YouTube Analytics API** enabled
- [ ] **OAuth 2.0 credentials** created (Web application)
- [ ] **Privacy Policy** published at https://creatoriq.in/privacy ✅
- [ ] **Terms of Service** published at https://creatoriq.in/terms ✅
- [ ] **App is live** and accessible at https://creatoriq.in

### URLs You'll Need

- **Google Cloud Console**: https://console.cloud.google.com
- **OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent
- **Credentials Page**: https://console.cloud.google.com/apis/credentials

---

## 🔧 OAuth Consent Screen Setup

### Step 1: Navigate to OAuth Consent Screen

1. Go to https://console.cloud.google.com/apis/credentials/consent
2. Select your project from the dropdown
3. Click **"OAuth consent screen"** in the left sidebar

### Step 2: Choose User Type

- **Internal**: Only for Google Workspace org (NOT APPLICABLE)
- **External**: ✅ **SELECT THIS** - For public users

Click **"CREATE"** or **"EDIT APP"** if already exists.

---

## 📝 Fill OAuth Consent Screen Form

### Section 1: App Information

| Field | Value | Required | Notes |
|-------|-------|----------|-------|
| **App name** | CreatorIQ | ✅ Yes | Displayed to users during OAuth |
| **User support email** | support@creatoriq.in | ✅ Yes | Must be monitored |
| **App logo** | Upload 120x120px image | ❌ Optional | Recommended for branding |
| **Application home page** | https://creatoriq.in | ✅ Yes | Your landing page |
| **Application privacy policy link** | https://creatoriq.in/privacy | ✅ Yes | ✅ Created by OpenClaw |
| **Application terms of service link** | https://creatoriq.in/terms | ✅ Yes | ✅ Created by OpenClaw |

**Screenshot to take**: `google_oauth_app_info.png`

---

### Section 2: App Domain

**Authorized domains** (add these):

```
creatoriq.in
```

**Why needed**: Google verifies you own this domain before allowing OAuth.

**Domain verification**:
- May require adding DNS TXT record
- Or uploading HTML file to your domain
- Follow Google's verification steps if prompted

---

### Section 3: Developer Contact Information

| Field | Value | Required |
|-------|-------|----------|
| **Developer contact email** | Your email address | ✅ Yes |

**Note**: This is for Google to contact you about the app, not shown to users.

---

## 🔑 Scopes Configuration

### Step 4: Add Scopes

Click **"ADD OR REMOVE SCOPES"** button.

### Required Scopes for CreatorIQ

Add these scopes:

| Scope | Purpose | Sensitive? | Video Demo Needed? |
|-------|---------|------------|--------------------|
| `https://www.googleapis.com/auth/youtube.readonly` | Read channel info, videos | ⚠️ Sensitive | ✅ Yes |
| `https://www.googleapis.com/auth/yt-analytics.readonly` | Read analytics data | ⚠️ Sensitive | ✅ Yes |
| `https://www.googleapis.com/auth/userinfo.profile` | User profile (name, picture) | ❌ Non-sensitive | ❌ No |
| `https://www.googleapis.com/auth/userinfo.email` | User email address | ❌ Non-sensitive | ❌ No |

**Sensitive scopes** require verification with video demo.

### How to Add Scopes

1. In the "Add or Remove Scopes" dialog:
2. **Option A**: Search for scope by URL
   - Paste: `https://www.googleapis.com/auth/youtube.readonly`
   - Click the checkbox
3. **Option B**: Filter by API
   - Select "YouTube Data API v3"
   - Select "YouTube Analytics API"
   - Check the scopes above

4. Click **"UPDATE"** at the bottom

**Screenshot to take**: `google_oauth_scopes.png`

---

### Scope Justification (For Verification)

When submitting for verification, you'll need to explain why you need each scope.

#### youtube.readonly

**What we use it for**:
```
CreatorIQ displays the user's YouTube channel information (channel name,
subscriber count, total views, total videos) and their video list (titles,
views, likes, comments) on the analytics dashboard.

This scope is read-only and only accesses the logged-in user's own channel.
We do not access other users' data, modify any content, or upload videos.
```

#### yt-analytics.readonly

**What we use it for**:
```
We fetch and display the user's YouTube Analytics data including:
- Viewer demographics (countries, cities, age groups, gender)
- Traffic sources (YouTube search, suggested videos, external)
- Watch time trends and engagement metrics

This data helps content creators understand their audience and optimize
their content strategy. All analytics data belongs to the logged-in user only.
We aggregate and visualize this data in easy-to-understand charts.
```

---

## 📹 Video Demo Requirements

### What Google Wants to See

Google requires a video demonstration showing how you use YouTube API scopes in your app.

### Video Specifications

| Requirement | Specification |
|-------------|---------------|
| **Format** | MP4, WebM, or MOV |
| **Resolution** | 720p minimum (1080p recommended) |
| **Duration** | 3-5 minutes |
| **Audio** | Clear narration in English |
| **Upload** | YouTube (unlisted link) |

### Video Recording Script

```
[0:00-0:30] Introduction
"Hi, I'm demonstrating CreatorIQ, an analytics platform for content creators.
I'll show how we use YouTube Data API and Analytics API to help creators
understand their audience and improve their content."

[0:30-1:00] Landing Page & Sign Up
- Show https://creatoriq.in
- Click "Sign Up"
- Create test account
- "Users create an account to access their analytics dashboard"

[1:00-1:45] OAuth Flow
- Show Dashboard
- Click "Connect YouTube"
- "Now the user connects their YouTube channel"
- Google OAuth screen appears
- Show requested scopes:
  - youtube.readonly - "To display channel info and videos"
  - yt-analytics.readonly - "To show audience analytics"
  - userinfo.profile - "To personalize the dashboard"
  - userinfo.email - "For account management"
- Click "Continue" to approve

[1:45-2:30] Dashboard View (youtube.readonly usage)
- Redirect back to CreatorIQ
- "Here we display the user's YouTube channel data"
- Show:
  - Channel name and profile picture
  - Subscriber count
  - Total views
  - Recent videos list with views, likes, comments

[2:30-3:30] Analytics View (yt-analytics.readonly usage)
- Click "Audience Insights"
- "Now we show analytics data using the Analytics API"
- Show:
  - Top countries chart (viewer geography)
  - Age and gender demographics
  - Traffic sources (how people find videos)
  - Watch time trends over time
- "This helps creators understand who watches their content"

[3:30-4:00] Data Privacy
- Click Settings → Connected Accounts
- Show "Disconnect YouTube" button
- "Users can revoke access anytime"
- "We only access the user's own data, never other creators' data"
- Go to Privacy Policy page
- "Our privacy policy explains how we handle YouTube data"

[4:00-4:15] Closing
"Thank you for reviewing CreatorIQ. We use YouTube API responsibly to
help creators grow their channels."
```

### Recording Tips

1. **Clean browser**: Use incognito mode
2. **Full screen**: Show address bar (proof it's your app)
3. **Stable internet**: No loading delays
4. **Clear audio**: Speak slowly, avoid background noise
5. **Show OAuth details**: Zoom in on permission screen
6. **Use real account**: Connect an actual YouTube channel

### Upload Video

1. Upload to YouTube as **"Unlisted"** (not Public, not Private)
2. Copy the YouTube URL (e.g., `https://www.youtube.com/watch?v=XXXXXXXXXXX`)
3. You'll paste this URL in the verification form

---

## ✅ Verification Submission

### Step 5: Submit for Verification

1. After filling all OAuth consent screen fields
2. Click **"SAVE AND CONTINUE"** at each section
3. Review the summary page
4. Click **"BACK TO DASHBOARD"** or **"SUBMIT FOR VERIFICATION"**

### Verification Form

When you click "SUBMIT FOR VERIFICATION", you'll be asked:

#### Question 1: Provide a link to a video demonstration

**Answer**: (Paste your YouTube unlisted link)
```
https://www.youtube.com/watch?v=XXXXXXXXXXX
```

#### Question 2: Explain how your app uses each scope

**Answer**:
```
CreatorIQ is an analytics dashboard for content creators. We use:

1. youtube.readonly:
   - Display user's channel name, subscriber count, total views
   - Show user's video list with titles, thumbnails, view counts
   - All data is read-only and belongs to the logged-in user only

2. yt-analytics.readonly:
   - Fetch and display audience demographics (countries, age, gender)
   - Show traffic sources (YouTube search, suggested videos)
   - Display watch time trends and engagement metrics
   - Help creators understand their audience and optimize content

3. userinfo.profile:
   - Display user's name and profile picture in dashboard header
   - Personalize the user experience

4. userinfo.email:
   - Account management and user communication
   - Password reset and security notifications

We only access data that belongs to the logged-in user. We do not access
other users' channels, modify content, or upload videos. All data is displayed
on the user's private analytics dashboard.

Privacy Policy: https://creatoriq.in/privacy
Terms of Service: https://creatoriq.in/terms
```

#### Question 3: Provide additional context (if requested)

**Answer**:
```
CreatorIQ helps Indian content creators (YouTubers, Instagram creators) track
their performance across platforms. We aggregate analytics from YouTube and
Instagram into one dashboard, saving creators time.

Our YouTube integration is read-only. We fetch the user's own channel data
and analytics, then display it alongside their Instagram data for easy
comparison.

Target users: 1,000-10,000 creators in India
Launch date: March 2026
Monetization: Freemium SaaS (free tier + paid plans at ₹499/₹999 per month)
```

---

## 🔐 Security Assessment

### What is Security Assessment?

For **sensitive scopes** (like `yt-analytics.readonly`), Google **may require** an annual security assessment.

**Cost**: $15,000 - $75,000 per year 😱

### Do You Need It?

**Possibly NOT** if:
- ✅ Small scale (<10,000 users)
- ✅ Read-only access
- ✅ User-owned data only
- ✅ Good security practices

**Definitely YES** if:
- ❌ Large scale (>100,000 users)
- ❌ Sensitive operations (uploading videos, modifying content)
- ❌ Accessing others' data

### Request Exemption

If Google requires security assessment, you can request an **exemption**:

#### Exemption Request Email Template

Send to: oauth-verification@google.com

```
Subject: Request for Security Assessment Exemption - CreatorIQ (Client ID: XXXXXXXXXXXX)

Dear Google OAuth Verification Team,

I am the developer of CreatorIQ (OAuth Client ID: XXXXXXXXXXXX.apps.googleusercontent.com),
an analytics dashboard for content creators.

We are requesting an exemption from the annual security assessment requirement
for the following reasons:

1. **Small Scale Operation**
   - Bootstrapped startup with <10,000 expected users
   - Initial launch targeting Indian creator market
   - Not a high-risk, large-scale application

2. **Read-Only Access**
   - We only use youtube.readonly and yt-analytics.readonly scopes
   - We do NOT upload videos, modify content, or perform write operations
   - All access is strictly read-only for analytics purposes

3. **User-Owned Data Only**
   - We only access data belonging to the logged-in user
   - Users explicitly connect their own YouTube channel
   - We never access or display other users' channels or data

4. **Strong Security Practices**
   - All data transmission over HTTPS
   - Access tokens encrypted with AES-256-GCM
   - Secure token storage in Supabase PostgreSQL
   - Row-level security policies enforced
   - Sentry error monitoring for security issues
   - Regular security updates and dependency patches

5. **Compliance**
   - GDPR and Indian DPDPA 2023 compliant
   - Clear privacy policy and terms of service
   - Users can revoke access and delete data anytime
   - No data selling or sharing with third parties

Given the above, we respectfully request an exemption from the annual security
assessment. We are committed to maintaining high security standards and
protecting user data.

If an exemption is not possible, we would appreciate guidance on alternative
verification methods suitable for small-scale applications.

Thank you for your consideration.

Best regards,
[Your Name]
[Your Title]
CreatorIQ
Email: [Your Email]
App URL: https://creatoriq.in
```

### Alternative: Limit Scope

If exemption is denied and you can't afford the assessment:

**Option**: Remove `yt-analytics.readonly` scope
- Keep only `youtube.readonly` (less sensitive)
- Show basic channel stats without detailed analytics
- Reduces verification requirements
- Less valuable product, but more affordable

---

## 📈 Quota Increase Request

### Default Quota

- **YouTube Data API v3**: 10,000 units/day
- **YouTube Analytics API**: 50,000 queries/day

### Do You Need More?

**Calculate your usage**:

| Action | Units | Users/Day | Total |
|--------|-------|-----------|-------|
| Connect YouTube (1 user) | ~100 units | 100 | 10,000 |
| Fetch analytics (all users) | ~200 units | 1,000 | 200,000 |
| **Total Daily Need** | | | **210,000** |

If you expect >100 users connecting per day, you need a quota increase.

### Request Quota Increase

1. Go to: https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas
2. Click **"All Quotas"**
3. Find **"Queries per day"**
4. Click the pencil icon (Edit)
5. Click **"Apply for higher quota"**

### Quota Increase Request Form

**Requested Quota**: 1,000,000 units/day

**Justification**:
```
CreatorIQ is an analytics platform for content creators in India. We help
YouTubers track their channel performance alongside Instagram analytics in
one unified dashboard.

Expected usage:
- 1,000-5,000 daily active users at launch
- Each user fetches their YouTube analytics 1-2 times per day
- Average 200 API units per user per day
- Total: 200,000-1,000,000 units per day

We implement caching to minimize API calls:
- Channel data cached for 5 minutes
- Analytics data cached for 1 hour
- Demographics data cached for 24 hours

This significantly reduces API usage while providing fresh data to users.

We are a small bootstrapped startup helping creators in India grow their
channels. The increased quota will help us serve more creators effectively.
```

**Timeline**: 2-5 business days

---

## ⚠️ Common Issues & Solutions

### Issue 1: "App Domain Not Verified"

**Error**: "The domain creatoriq.in is not verified"

**Solution**:
1. Go to Google Search Console: https://search.google.com/search-console
2. Add property: https://creatoriq.in
3. Verify ownership:
   - **Option A**: Upload HTML file to root directory
   - **Option B**: Add DNS TXT record
   - **Option C**: Use Google Analytics verification
4. Wait 24-48 hours for verification
5. Return to OAuth consent screen and try again

---

### Issue 2: "Video Link Invalid"

**Error**: "Unable to access video demonstration"

**Solution**:
- Video must be **"Unlisted"** on YouTube (not Private)
- Check video URL is correct
- Ensure video is not age-restricted or region-blocked
- Video should be uploaded to YouTube (not Google Drive/Vimeo)

---

### Issue 3: "Justification Insufficient"

**Error**: "Please provide more details on scope usage"

**Solution**:
- Be specific about WHAT data you access
- Explain WHY you need each data point
- Mention HOW it helps users
- Emphasize read-only and user-owned data only
- Reference privacy policy and terms of service

---

### Issue 4: "Verification Pending for Weeks"

**Status**: No response after 2+ weeks

**Solution**:
- Check spam folder for emails from Google
- Fill out this form: https://support.google.com/code/contact/oauth_app_verification
- Select "My app has been pending review for more than 2 weeks"
- Provide OAuth Client ID
- Expect response in 3-5 business days

---

### Issue 5: "Security Assessment Required"

**Email**: "Your app requires an annual security assessment"

**Solution**:
1. Request exemption (see template above)
2. Wait for Google's response (5-10 days)
3. If denied:
   - Pay for assessment ($15K-$75K/year) 😱
   - OR remove sensitive scopes
   - OR limit to <100 users (stay in development mode)

---

## 📊 Verification Checklist

Before submitting:

### OAuth Consent Screen
- [ ] App name: CreatorIQ
- [ ] User support email: support@creatoriq.in
- [ ] Privacy policy URL: https://creatoriq.in/privacy ✅
- [ ] Terms of service URL: https://creatoriq.in/terms ✅
- [ ] Authorized domain: creatoriq.in (verified)

### Scopes
- [ ] youtube.readonly added
- [ ] yt-analytics.readonly added
- [ ] userinfo.profile added
- [ ] userinfo.email added

### Video Demo
- [ ] Recorded (3-5 minutes)
- [ ] Uploaded to YouTube (unlisted)
- [ ] Shows OAuth flow
- [ ] Shows scope usage
- [ ] Clear narration
- [ ] URL copied

### Justifications
- [ ] Scope usage explained
- [ ] Read-only access emphasized
- [ ] User-owned data only mentioned
- [ ] Privacy policy linked

### Testing
- [ ] OAuth flow works end-to-end
- [ ] YouTube connection successful
- [ ] Analytics data displaying
- [ ] No console errors

---

## ⏱️ Timeline

| Stage | Duration | Status |
|-------|----------|--------|
| **Form Setup** | 1-2 hours | ⏳ Pending |
| **Video Recording** | 30 minutes | ⏳ Pending |
| **Submission** | 15 minutes | ⏳ Pending |
| **Google Review** | 3-5 business days | ⏳ Pending |
| **If Security Assessment Required** | +5-10 days (exemption request) | - |
| **Quota Increase (if needed)** | 2-5 business days | - |
| **Total** | 1-2 weeks minimum | - |

---

## ✅ Next Steps

After verification approved:

1. [ ] **Publish App** - Change from "Testing" to "In Production"
2. [ ] Remove test user restrictions
3. [ ] Update documentation
4. [ ] Request quota increase (if needed)
5. [ ] Announce production launch
6. [ ] Monitor API usage (Google Cloud Console)
7. [ ] Monitor errors (Sentry)
8. [ ] Track connections (PostHog)

---

## 📞 Support

### Google OAuth Support

- **Documentation**: https://developers.google.com/identity/protocols/oauth2
- **Support Forum**: https://stackoverflow.com/questions/tagged/google-oauth
- **Verification Support**: https://support.google.com/code/contact/oauth_app_verification

### Internal Contact

- Engineering: (your email)
- Product: (your email)

---

**Document Owner**: Engineering Team
**Last Updated**: 2026-02-09
**Review Before Submission**: ✅ Mandatory
**Next Review**: After Google approval
