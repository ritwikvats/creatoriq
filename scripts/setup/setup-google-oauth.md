# YouTube Analytics API Setup Guide

This guide walks you through setting up Google Cloud and YouTube Analytics API for CreatorIQ.

## Prerequisites
- Google Account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: `CreatorIQ`
4. Click "Create"

## Step 2: Enable YouTube APIs

1. In your project, go to **APIs & Services** → **Library**
2. Search and enable these APIs:
   - **YouTube Data API v3**
   - **YouTube Analytics API**
   - **YouTube Reporting API**

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure OAuth consent screen first:
   - User Type: **External**
   - App name: `CreatorIQ`
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add these scopes:
     - `https://www.googleapis.com/auth/youtube.readonly`
     - `https://www.googleapis.com/auth/yt-analytics.readonly`
   - Test users: Add your email (for development)

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `CreatorIQ Backend`
   - Authorized redirect URIs:
     - `http://localhost:3001/auth/youtube/callback` (development)
     - `https://your-production-api.com/auth/youtube/callback` (production)

5. Click **Create**

## Step 4: Copy Credentials

You'll get:
- **Client ID** - Copy this to `.env` as `GOOGLE_CLIENT_ID`
- **Client Secret** - Copy to `.env` as `GOOGLE_CLIENT_SECRET`

## Step 5: Update .env File

```bash
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/youtube/callback
```

## Step 6: Quota Limits

YouTube Data API has a **10,000 units/day** quota (free tier):
- List channel: 1 unit
- List videos: 1 unit
- Analytics query: 0 units (unlimited!)

For production, you may need to request quota increase.

## Testing

Test your OAuth flow:
1. Start the backend: `pnpm dev:api`
2. Visit: `http://localhost:3001/youtube/auth`
3. Approve permissions
4. You should be redirected with success

## Troubleshooting

**Error: redirect_uri_mismatch**
- Ensure redirect URI in code matches exactly what's in Google Cloud Console

**Error: Access Not Configured**
- Make sure YouTube Data API v3 is enabled

**Error: invalid_client**
- Check that Client ID and Secret are correct in `.env`

## Resources
- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [YouTube Analytics API Docs](https://developers.google.com/youtube/analytics)
