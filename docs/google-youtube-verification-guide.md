# Google YouTube OAuth Verification Guide - CreatorIQ

> **Status**: Ready to submit
> **GCP Project**: creatoriq-486308
> **Timeline**: 3-10 business days after submission
> **CASA Required?**: NO (your scopes are "sensitive", not "restricted")

---

## What's Already Done

- [x] OAuth consent screen branding: VERIFIED & PUBLISHED
- [x] Google Search Console: creatoriq.in verified
- [x] Homepage publicly accessible with Privacy Policy link in footer
- [x] Privacy Policy updated with YouTube data section + Limited Use statement
- [x] API code working (bugs fixed, pushed to master)
- [x] Scopes declared: youtube.readonly, yt-analytics-monetary.readonly, userinfo.profile, userinfo.email

## What You Need To Do

- [ ] Record demo video (see script below)
- [ ] Upload video to YouTube as **Unlisted**
- [ ] Submit verification in GCP Console
- [ ] Wait for approval (3-10 business days)

---

## Step 1: Record the Demo Video

### Requirements
- **Format**: Screen recording (QuickTime on Mac, or OBS)
- **Upload to**: YouTube as **Unlisted** video (you'll paste the link in the form)
- **Length**: 3-5 minutes (shorter is better)
- **Language**: English (make sure Google consent screen is in English)
- **Resolution**: 1080p minimum
- **Show URL bar** throughout the entire recording

### Demo Video Script (Follow This Exactly)

```
[0:00 - 0:15] INTRODUCTION
- Open browser, go to https://creatoriq.in
- Say/caption: "This is CreatorIQ, an analytics dashboard for content
  creators. I'll demonstrate how we use YouTube API permissions."

[0:15 - 0:30] SHOW HOMEPAGE
- Show the landing page (public, no login needed)
- Scroll down to show app description
- Scroll to footer, POINT TO the Privacy Policy link
- Say/caption: "Our privacy policy is linked on the homepage"

[0:30 - 0:50] LOGIN
- Click "Login" or "Sign Up"
- Log in with your test account
- You'll land on the Dashboard

[0:50 - 1:30] CONNECT YOUTUBE (OAuth Flow - MOST IMPORTANT PART)
- On Dashboard, find the YouTube connection card
- Click "Connect YouTube"
- Google OAuth consent screen appears
- PAUSE HERE and show clearly:
  ✓ App name "CreatorIQ" displayed
  ✓ Scopes listed (youtube.readonly, yt-analytics)
  ✓ URL bar shows accounts.google.com
- Say/caption: "The consent screen shows the scopes we request:
  youtube.readonly for channel data, and yt-analytics-monetary
  for analytics and revenue data"
- Click "Allow" / "Continue"
- You get redirected back to CreatorIQ

[1:30 - 2:15] SHOW youtube.readonly DATA
- Dashboard now shows YouTube connected
- Show: Channel name, profile picture, subscriber count, total views
- Navigate to /dashboard/youtube
- Show: Full channel stats (subscribers, views, video count)
- Scroll to Recent Videos grid
- Show: Video titles, thumbnails, view counts, like counts
- Say/caption: "Channel info and video data comes from
  youtube.readonly scope"

[2:15 - 3:00] SHOW yt-analytics-monetary.readonly DATA
- Navigate to /dashboard/audience
- Show: YouTube demographics section
  ✓ Top Countries (geography data)
  ✓ Age & Gender breakdown (if YPP eligible)
- Go back to /dashboard/youtube
- Show: Revenue card (₹ amount or ₹0 if not monetized)
- Say/caption: "Demographics, analytics, and revenue data comes
  from yt-analytics-monetary.readonly scope"

[3:00 - 3:30] SHOW BEST POSTING TIMES
- On /dashboard/audience page
- Show: Best posting times section
  ✓ Best days to post
  ✓ Best hours to post
  ✓ Recommendation text
- Say/caption: "We analyze posting history to recommend
  optimal posting times"

[3:30 - 4:00] DATA PRIVACY & DISCONNECT
- Navigate to Dashboard
- Show the "Disconnect" button on YouTube card
- Say/caption: "Users can disconnect YouTube anytime. When
  disconnected, all YouTube data and tokens are deleted
  within 24 hours"
- Navigate to /privacy
- Show Section 5 (YouTube & Google Data)
- Show the Limited Use compliance statement (blue box)
- Say/caption: "Our privacy policy explicitly discloses how
  we handle Google user data and complies with the Google
  API Services User Data Policy including Limited Use"

[4:00 - 4:15] CLOSING
- Say/caption: "CreatorIQ only accesses the authenticated
  user's own YouTube data. We do not sell or share data
  with third parties. Thank you for reviewing."
```

### Recording Tips
1. Use Chrome, clean profile or incognito
2. Close all other tabs
3. No developer tools open
4. Show URL bar at all times
5. Speak slowly or use clear text captions
6. No personal/sensitive data visible (use test account if possible)
7. Make sure consent screen language is ENGLISH

---

## Step 2: Upload Video to YouTube

1. Go to https://studio.youtube.com
2. Upload the recorded video
3. Set visibility to **Unlisted**
4. Copy the video URL (you'll need it for the form)

---

## Step 3: Submit Verification

### Go to the Verification Centre

URL: https://console.cloud.google.com/apis/credentials/consent?project=creatoriq-486308

1. Click **"Verification centre"** (or "Prepare for verification")
2. Click **"Start verification"** or **"Submit for verification"**

### Fill the Form

**App Name**: CreatorIQ
**Support Email**: support@creatoriq.in
**Homepage**: https://creatoriq.in
**Privacy Policy**: https://creatoriq.in/privacy
**Terms of Service**: https://creatoriq.in/terms

### Scopes (make sure all 4 are listed)
- `https://www.googleapis.com/auth/youtube.readonly`
- `https://www.googleapis.com/auth/yt-analytics-monetary.readonly`
- `https://www.googleapis.com/auth/userinfo.profile`
- `https://www.googleapis.com/auth/userinfo.email`

### Demo Video Link
Paste your unlisted YouTube URL here.

### Documentation Links (up to 3)
1. https://creatoriq.in/privacy (Privacy Policy)
2. https://creatoriq.in/faq (FAQ / Help)
3. https://creatoriq.in/terms (Terms of Service)

### Scope Justifications

When asked to justify each sensitive scope, paste these:

#### youtube.readonly

```
CreatorIQ is an analytics dashboard for content creators. We use
youtube.readonly to retrieve the authenticated user's own YouTube
channel data and display it on their private dashboard:

- Channel information: name, subscriber count, total views, video count,
  profile picture, publish date
- Recent videos: titles, thumbnails, view counts, like counts, comment
  counts, engagement rates
- Upload history: to analyze best posting times based on past performance

This data helps creators track channel growth and content performance in
one place alongside their Instagram analytics.

youtube.readonly is the minimum scope required by the YouTube Data API v3
to retrieve channel and video information. No narrower scope exists for
this functionality.

We only access the authenticated user's own channel. We never access
other users' data. All data is displayed on the user's private dashboard
at https://creatoriq.in/dashboard/youtube
```

#### yt-analytics-monetary.readonly

```
CreatorIQ uses yt-analytics-monetary.readonly to display the authenticated
user's YouTube Analytics data on their private dashboard:

- Audience geography: views by country (top 10 countries)
- Age & gender demographics: viewer percentage by age group and gender
- Estimated revenue: last 30 days earnings trend (for monetized channels)
- Performance metrics: views, watch time, engagement over time

This allows creators to understand WHO their audience is and make
data-driven content decisions. For example, if most viewers are from
India aged 18-24, the creator can tailor content for that demographic.

We use yt-analytics-monetary.readonly instead of yt-analytics.readonly
because creators in the YouTube Partner Program need visibility into
their estimated revenue alongside content metrics. The non-monetary
scope does not include access to revenue reports.

For non-monetized channels, our app gracefully handles the absence of
revenue data (shows ₹0) with no errors.

All analytics data is displayed on the user's private dashboard at
https://creatoriq.in/dashboard/audience and
https://creatoriq.in/dashboard/youtube

Privacy policy: https://creatoriq.in/privacy
```

---

## Step 4: After Submission

1. **Check email daily** - Google Trust & Safety team may ask follow-up questions
2. **DO NOT change anything** on the OAuth consent screen after submission (scopes, logo, name) - it resets the review
3. **Expected timeline**: 3-10 business days
4. **If rejected**: Read the rejection email carefully, fix the specific issues, resubmit

---

## Common Rejection Reasons (Avoid These!)

| Rejection Reason | How We Avoid It |
|-----------------|-----------------|
| Privacy policy not linked on homepage | ✅ Already in footer |
| Privacy policy doesn't mention Google data | ✅ Section 5 added |
| No Limited Use statement | ✅ Added in blue box |
| Homepage behind login wall | ✅ Public landing page |
| Demo video doesn't show consent screen | ⚠️ MAKE SURE to pause on consent screen |
| Demo video doesn't show all scopes in use | ⚠️ Show BOTH youtube.readonly AND yt-analytics data |
| Consent screen not in English | ⚠️ Toggle language before recording |
| Domain not verified in Search Console | ✅ Already verified |
| Requesting unused scopes | ✅ All 4 scopes are used in the app |
| Changing anything after submission | ⚠️ DON'T touch OAuth settings after submitting |

---

## Compliance Checklist (Google API Services User Data Policy)

- [x] Only request scopes needed for implemented features
- [x] Privacy policy discloses: collection, use, storage, sharing of Google data
- [x] Limited Use compliance statement in privacy policy
- [x] Do NOT sell Google user data
- [x] Do NOT use for advertising or profiling
- [x] Do NOT transfer to data brokers
- [x] Do NOT allow unauthorized human access to raw data
- [x] HTTPS for all redirect URIs
- [x] Tokens encrypted at rest (AES-256-GCM)
- [x] Users can disconnect and delete data anytime
- [x] Data deleted within 24 hours of disconnect

---

## Quick Reference

| Item | Value |
|------|-------|
| GCP Project | creatoriq-486308 |
| App Name | CreatorIQ |
| Homepage | https://creatoriq.in |
| Privacy Policy | https://creatoriq.in/privacy |
| Terms | https://creatoriq.in/terms |
| Verification URL | https://console.cloud.google.com/apis/credentials/consent?project=creatoriq-486308 |
| Scope 1 | youtube.readonly (sensitive) |
| Scope 2 | yt-analytics-monetary.readonly (sensitive) |
| Scope 3 | userinfo.profile (non-sensitive) |
| Scope 4 | userinfo.email (non-sensitive) |
| CASA Required? | NO |
| Expected Review Time | 3-10 business days |
