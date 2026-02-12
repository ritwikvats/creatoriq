# Facebook App Review Submission Guide - CreatorIQ

> **Purpose**: Complete checklist and submission package for Meta App Review to get Advanced Access for Instagram API permissions
>
> **Timeline**: 5-7 business days (first submission), 5-7 days (resubmission if rejected)
>
> **Status**: 📋 Ready to submit

---

## 📋 Table of Contents

1. [Before You Start](#before-you-start)
2. [Required Permissions](#required-permissions)
3. [App Information Setup](#app-information-setup)
4. [Testing Instructions for Reviewers](#testing-instructions-for-reviewers)
5. [Video Demo Script](#video-demo-script)
6. [Screenshots Checklist](#screenshots-checklist)
7. [Permission Justifications](#permission-justifications)
8. [Submission Process](#submission-process)
9. [Common Rejection Reasons](#common-rejection-reasons)

---

## 🚀 Before You Start

### Prerequisites Checklist

- [ ] **Privacy Policy** published at https://creatoriq.in/privacy ✅ (Created by OpenClaw)
- [ ] **Terms of Service** published at https://creatoriq.in/terms ✅ (Created by OpenClaw)
- [ ] **App is working** - no errors in production
- [ ] **Test Instagram Business account** ready for demo
- [ ] **Screen recording software** installed (QuickTime/OBS)
- [ ] **Facebook App created** at https://developers.facebook.com

---

## 🔑 Required Permissions

Request **Advanced Access** for these permissions:

| Permission | Purpose | Required For |
|------------|---------|--------------|
| **instagram_basic** | Read user profile, media | ✅ **CRITICAL** - Core feature |
| **instagram_manage_insights** | Read analytics, demographics | ✅ **CRITICAL** - Analytics dashboard |
| **pages_show_list** | List user's Facebook Pages | ✅ **CRITICAL** - Find Instagram Business Account |
| **pages_read_engagement** | Read Page engagement stats | ✅ **CRITICAL** - Engagement metrics |

---

## 📝 App Information Setup

### Step 1: Go to App Settings

URL: https://developers.facebook.com/apps/YOUR_APP_ID/settings/basic/

### Step 2: Fill Required Fields

| Field | Value | Notes |
|-------|-------|-------|
| **App Name** | CreatorIQ | Must match branding |
| **Display Name** | CreatorIQ | Public-facing name |
| **Contact Email** | support@creatoriq.in | Must be monitored |
| **Privacy Policy URL** | https://creatoriq.in/privacy | ✅ Already created |
| **Terms of Service URL** | https://creatoriq.in/terms | ✅ Already created |
| **App Icon** | Upload 1024x1024px PNG | Minimum requirement |
| **Category** | Business and Pages | Best fit for analytics |
| **Business Use Case** | Analytics | Primary purpose |

### Step 3: Save and Continue

Click **"Save Changes"** at the bottom.

---

## 🧪 Testing Instructions for Reviewers

### Complete Step-by-Step Guide

Copy this to the App Review submission form:

```markdown
# How to Test CreatorIQ Instagram Integration

## Prerequisites
- Instagram Business Account (or Professional Creator Account)
- Account must be connected to a Facebook Page
- Account should have some posts and follower data

## Step-by-Step Testing Instructions

### 1. Create Account
1. Go to https://creatoriq.in
2. Click **"Sign Up"** in the top right
3. Fill in:
   - Email: test@example.com (or your own)
   - Password: TestPass123!
   - Full Name: Test User
4. Click **"Create Account"**
5. You'll be redirected to the Dashboard

### 2. Connect Instagram
1. On the Dashboard, you'll see platform connection cards
2. Find the **Instagram card**
3. Click **"Connect Instagram"** button
4. You'll be redirected to Facebook/Instagram OAuth

### 3. OAuth Flow (This is what we're requesting permissions for)
1. Facebook login screen appears
2. Log in with your Instagram Business account credentials
3. **Permission request screen** appears showing:
   - instagram_basic (access profile and media)
   - instagram_manage_insights (access analytics)
   - pages_show_list (find your Facebook Page)
   - pages_read_engagement (access engagement data)
4. Click **"Continue"** to approve all permissions
5. You'll be redirected back to CreatorIQ

### 4. View Analytics (Permission Usage)
After connecting, the app uses the granted permissions to:

**A) Fetch Basic Profile Data (instagram_basic)**
- Navigate to **Dashboard**
- See your Instagram username, profile picture, follower count
- See your recent posts with like/comment counts

**B) Fetch Audience Insights (instagram_manage_insights)**
- Click **"Audience Insights"** in the sidebar
- View **Top Countries** (where your followers are from)
- View **Top Cities** (follower city breakdown)
- View **Age & Gender** demographics (follower age/gender distribution)

**C) Fetch Engagement Metrics (pages_read_engagement)**
- See **Engagement Rate** on dashboard
- See **Average Likes** and **Average Comments** per post

### 5. Data Privacy Verification
- All data shown is **YOUR OWN** data (the logged-in user)
- We never access other users' data
- Data is displayed on the dashboard for the user's own analysis
- Users can disconnect at any time (Settings → Connected Accounts → Disconnect)

## Why We Need Each Permission

### instagram_basic
We display the user's:
- Profile picture and username
- Follower count
- Recent media posts
- Like and comment counts per post

### instagram_manage_insights
We show the user their audience demographics:
- Follower countries and cities
- Age and gender breakdown
- Growth trends over time

This helps creators understand their audience and make content decisions.

### pages_show_list
Required to find the Facebook Page connected to the Instagram Business Account.
Instagram API requires a Page ID to access insights.

### pages_read_engagement
Required to fetch engagement metrics (reach, impressions, profile views)
from the connected Facebook Page.

## Expected Behavior
- User sees their own Instagram analytics
- Data refreshes when user clicks "Refresh Data"
- No errors in the console
- User can disconnect their account anytime

## Test Credentials
You can use your own Instagram Business account for testing.

If you need a test account:
- Email: test@creatoriq.in
- Password: TestPass123!
(This test account has Instagram already connected)

## Data Deletion
Users can delete their account and all data via:
Settings → Account → Delete Account

## Support Contact
If you encounter any issues during testing:
Email: support@creatoriq.in
Response time: Within 24 hours
```

---

## 🎥 Video Demo Script

### Recording Requirements

- **Format**: MP4
- **Max Size**: 50MB
- **Length**: 3-5 minutes (under 5 minutes)
- **Quality**: 1080p minimum
- **Audio**: Clear narration explaining each step

### Script to Follow

```
[0:00-0:15] Introduction
"Hi, I'm demonstrating CreatorIQ, an analytics platform for content creators.
I'll show how we use Instagram API permissions to help creators understand
their audience and improve their content strategy."

[0:15-0:45] Landing Page & Signup
- Show landing page (https://creatoriq.in)
- Click "Sign Up"
- Fill in email, password, name
- "The user creates an account to access their analytics dashboard"
- Click "Create Account"

[0:45-1:30] OAuth Flow
- Show Dashboard with Instagram connection card
- Click "Connect Instagram"
- "Now the user connects their Instagram Business account"
- Facebook OAuth screen appears
- "We request four permissions..."
- Point to each permission and explain:
  1. instagram_basic - "To display profile and posts"
  2. instagram_manage_insights - "To show audience demographics"
  3. pages_show_list - "To find the connected Facebook Page"
  4. pages_read_engagement - "To display engagement metrics"
- Click "Continue" to approve

[1:30-2:15] Dashboard View (instagram_basic usage)
- Redirect back to CreatorIQ
- "Now the user can see their Instagram data"
- Show profile picture, username, follower count
- Scroll to recent posts
- "These posts show likes and comments from instagram_basic permission"

[2:15-3:00] Audience Insights (instagram_manage_insights usage)
- Click "Audience Insights" in sidebar
- "Here we display demographics using instagram_manage_insights"
- Point to Top Countries chart
- Point to Top Cities list
- Point to Age & Gender breakdown
- "This helps creators understand who their audience is"

[3:00-3:30] Engagement Metrics (pages_read_engagement usage)
- Show engagement rate on dashboard
- Show average likes and comments
- "These metrics use pages_read_engagement to calculate performance"

[3:30-4:00] Data Privacy
- Click Settings → Connected Accounts
- Show "Disconnect Instagram" button
- "Users can disconnect and delete their data anytime"
- "We only access the user's own data, never other people's data"

[4:00-4:15] Closing
- Go to Privacy Policy page
- "Our privacy policy explains how we handle data"
- "All data is encrypted and stored securely"
- "Thank you for reviewing CreatorIQ!"
```

### Recording Tips

1. **Use clean browser**: Private/incognito mode, no extensions
2. **Close unnecessary tabs**: Show only CreatorIQ
3. **Stable internet**: Ensure no loading delays
4. **Clear audio**: Speak slowly and clearly
5. **No personal data**: Use test account, blur any personal info
6. **Show full screen**: Don't crop browser chrome (address bar visible)

---

## 📸 Screenshots Checklist

### Required Screenshots (5-10 images)

Take screenshots of these screens and upload them to App Review:

#### Screenshot 1: Landing Page
- [ ] **URL**: https://creatoriq.in
- [ ] Shows branding and "Sign Up" button
- [ ] Filename: `01_landing_page.png`

#### Screenshot 2: Sign Up Page
- [ ] Sign up form visible
- [ ] Email, password, name fields shown
- [ ] Filename: `02_signup_page.png`

#### Screenshot 3: Dashboard (Before Connection)
- [ ] Shows Instagram connection card
- [ ] "Connect Instagram" button visible
- [ ] Filename: `03_dashboard_before_connect.png`

#### Screenshot 4: Facebook OAuth Permission Screen
- [ ] ⭐ **MOST IMPORTANT** ⭐
- [ ] Shows all 4 permissions being requested:
  - instagram_basic
  - instagram_manage_insights
  - pages_show_list
  - pages_read_engagement
- [ ] Permission descriptions visible
- [ ] Filename: `04_oauth_permissions.png`

#### Screenshot 5: Dashboard (After Connection)
- [ ] Instagram card shows "Connected"
- [ ] Profile picture, username, follower count visible
- [ ] Recent posts displayed
- [ ] Filename: `05_dashboard_connected.png`

#### Screenshot 6: Audience Insights Page
- [ ] Top Countries chart visible
- [ ] Top Cities list visible
- [ ] Age & Gender demographics visible
- [ ] Filename: `06_audience_insights.png`

#### Screenshot 7: Settings Page (Disconnect Option)
- [ ] Shows "Connected Accounts" section
- [ ] "Disconnect Instagram" button visible
- [ ] Filename: `07_disconnect_option.png`

#### Screenshot 8: Privacy Policy Page (Optional)
- [ ] URL: https://creatoriq.in/privacy
- [ ] Shows data collection and usage policy
- [ ] Filename: `08_privacy_policy.png`

### Screenshot Format Requirements

- **Resolution**: 1920x1080 or higher
- **Format**: PNG or JPG
- **Size**: Under 5MB per image
- **Content**: No personal/sensitive data visible
- **Browser**: Chrome/Safari, address bar visible

---

## 📝 Permission Justifications

### For Each Permission, Explain Why You Need It

When submitting for review, you'll need to write a justification for each permission.

#### instagram_basic

**Use Case**: Display Creator's Profile and Content

**Justification**:
```
CreatorIQ helps content creators track and analyze their Instagram performance.
We use instagram_basic to display the user's profile information (username,
profile picture, follower count) and their recent media posts (images, videos,
captions, like counts, comment counts) on their personal analytics dashboard.

This permission is essential because it allows creators to see their content
performance at a glance without leaving our platform. All data accessed belongs
to the logged-in user only. We never access or display other users' data.
```

#### instagram_manage_insights

**Use Case**: Display Audience Demographics and Analytics

**Justification**:
```
We use instagram_manage_insights to fetch and display the user's audience
demographics (follower countries, cities, age groups, gender distribution)
and performance insights (reach, impressions, engagement rate).

This data helps creators understand who their audience is and make data-driven
decisions about content strategy, posting times, and content types. For example,
if a creator discovers most followers are from India and aged 18-24, they can
tailor content accordingly.

All insights shown are the user's own data. We aggregate metrics and present
them in easy-to-understand charts and graphs on the dashboard.
```

#### pages_show_list

**Use Case**: Find Connected Facebook Page

**Justification**:
```
Instagram Business accounts must be connected to a Facebook Page. We use
pages_show_list to identify which Facebook Page is connected to the user's
Instagram account.

This is a technical requirement for accessing Instagram Insights via the API.
The Instagram Graph API requires a Page ID to fetch insights data. We only
list the user's own Pages to find the correct Page ID, then use it to access
their Instagram analytics.

We do not display Page data or use it for any purpose other than retrieving
Instagram insights.
```

#### pages_read_engagement

**Use Case**: Fetch Instagram Engagement Metrics

**Justification**:
```
We use pages_read_engagement to fetch engagement metrics (total reach,
impressions, profile views, website clicks) for the user's Instagram Business
account via the connected Facebook Page.

These metrics are displayed on the user's analytics dashboard to help them
measure content performance and audience growth. For example, showing weekly
reach trends helps creators understand what content resonates with their
audience.

All engagement data accessed belongs to the logged-in user only. We use it
solely to provide analytics insights to help creators improve their content
strategy.
```

---

## 🚀 Submission Process

### Step-by-Step Submission

#### Step 1: Navigate to App Review

1. Go to https://developers.facebook.com/apps/YOUR_APP_ID/app-review/
2. Click **"Permissions and Features"** tab

#### Step 2: Request Advanced Access

For **EACH** of the 4 permissions:

1. Find the permission in the list
2. Click **"Request Advanced Access"** button
3. Fill in the form:
   - **Platform**: Instagram
   - **Use Case**: Analytics
   - **Explain how you use this permission**: Copy from justifications above
4. Upload video demo
5. Add step-by-step testing instructions
6. Attach all screenshots
7. Click **"Submit for Review"**

**Repeat for all 4 permissions** (or submit as a package if Meta allows).

#### Step 3: Business Verification (Optional but Recommended)

- Go to https://business.facebook.com/settings/info
- Click **"Start Verification"**
- Upload:
  - Business registration certificate (if registered company)
  - OR GST certificate (for Indian businesses)
  - OR utility bill + government ID (for sole proprietors)
- Wait 2-5 business days for approval

---

## ⚠️ Common Rejection Reasons & How to Fix

### Rejection Reason 1: "Video Quality Too Low"

**Solution**:
- Re-record in 1080p or higher
- Ensure screen is not blurry
- Use QuickTime (Mac) or OBS Studio (Windows/Mac)

---

### Rejection Reason 2: "Cannot Replicate Functionality"

**Solution**:
- Make testing instructions MORE detailed
- Include exact URLs to visit
- Provide working test credentials
- Ensure app is accessible (not behind login wall initially)

---

### Rejection Reason 3: "Privacy Policy Insufficient"

**Solution**:
- Add section specifically about Instagram data usage ✅ (Already in privacy page)
- Mention data retention policy ✅ (Already included)
- Add user data deletion process ✅ (Already included)

---

### Rejection Reason 4: "Violates Platform Policy"

**Check these policies**:
- [ ] No data selling (we don't sell data ✅)
- [ ] No unauthorized data access (only user's own data ✅)
- [ ] No storing data beyond necessary period (we comply ✅)
- [ ] Respect Instagram Brand Guidelines (check usage of "Instagram" name)

**Solution**:
- Review Meta Platform Terms: https://developers.facebook.com/terms
- Ensure app complies with all policies
- Update privacy policy if needed

---

### Rejection Reason 5: "Business Use Case Not Clear"

**Solution**:
- Emphasize that we help creators analyze THEIR OWN data
- Show before/after comparison (without analytics vs with analytics)
- Explain business value for creators (better content decisions)

---

## 📊 Submission Checklist

Before clicking "Submit for Review":

### App Setup
- [ ] Privacy Policy URL working and complete ✅
- [ ] Terms of Service URL working and complete ✅
- [ ] App Icon uploaded (1024x1024px)
- [ ] App Name and Display Name correct
- [ ] Contact Email monitored

### Testing
- [ ] Test account created and working
- [ ] Instagram connection flow works end-to-end
- [ ] No errors in browser console
- [ ] All analytics data displaying correctly
- [ ] Disconnect functionality works

### Documentation
- [ ] Video demo recorded (3-5 minutes, under 50MB)
- [ ] Testing instructions written (step-by-step)
- [ ] All screenshots captured (5-10 images)
- [ ] Permission justifications written (for all 4)

### Submission
- [ ] All 4 permissions submitted for review
- [ ] Video uploaded for each permission
- [ ] Screenshots attached for each permission
- [ ] Confirmation email received from Meta

---

## ⏱️ Timeline

| Stage | Duration | Status |
|-------|----------|--------|
| **Preparation** (this guide) | 2-3 hours | ✅ Ready |
| **Video Recording** | 30 minutes | ⏳ Pending |
| **Screenshot Capture** | 15 minutes | ⏳ Pending |
| **Form Submission** | 30 minutes | ⏳ Pending |
| **Meta Review** | 5-7 business days | ⏳ Pending |
| **If Rejected** | +5-7 days after fixes | - |
| **Total** | 1-2 weeks minimum | - |

---

## 📞 Support

### If Rejected

1. Read rejection email carefully
2. Fix the specific issues mentioned
3. Update video/screenshots if needed
4. Resubmit with explanation of changes

### Meta Support

- Meta doesn't provide direct support for app review
- Questions: https://developers.facebook.com/community/
- Bug reports: https://developers.facebook.com/support/bugs/

### Internal Contact

- Engineering: (your email)
- Product: (your email)

---

## ✅ Next Steps

After approval:

1. [ ] Move app from Development to Live mode
2. [ ] Remove test user restrictions
3. [ ] Update documentation
4. [ ] Announce to users via email/social media
5. [ ] Monitor error rates (Sentry)
6. [ ] Track connection success rates (PostHog)

---

**Document Owner**: Engineering Team
**Last Updated**: 2026-02-09
**Review Before Submission**: ✅ Mandatory
**Next Review**: After Meta approval
