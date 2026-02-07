# Instagram Graph API Setup Guide

This guide walks you through setting up Facebook App and Instagram Graph API for CreatorIQ.

## Prerequisites
- Facebook Account
- Instagram Business Account (converted from Personal)
- Facebook Page linked to your Instagram account

## Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Select **Business** as app type
4. Fill in details:
   - App Name: `CreatorIQ`
   - App Contact Email: Your email
   - Business Account: Create new or select existing
5. Click **Create App**

## Step 2: Add Instagram Graph API

1. In your app dashboard, click **Add Product**
2. Find **Instagram** → Click **Set Up**
3. You'll see Instagram Basic Display and Instagram Graph API
4. Use **Instagram Graph API** (not Basic Display)

## Step 3: Configure App Settings

1. Go to **Settings** → **Basic**
2. Add **App Domains**: `localhost` (for development)
3. Add **Privacy Policy URL** (required for review):
   - Use a generator or create simple page
   - Example: `https://your-site.com/privacy`
4. Save changes

## Step 4: Setup OAuth Redirect URIs

1. In left sidebar, go to **Instagram** → **Basic Display**
2. Scroll to **Valid OAuth Redirect URIs**
3. Add these URIs:
   - `http://localhost:3001/instagram/callback` (development)
   - `https://your-production-api.com/instagram/callback` (production)
4. Save changes

## Step 5: Get App Credentials

1. Go to **Settings** → **Basic**
2. Copy these values to your `.env`:
   - **App ID** → `FACEBOOK_APP_ID`
   - **App Secret** → `FACEBOOK_APP_SECRET` (click Show)

## Step 6: Add Test Users (Development)

1. Go to **Roles** → **Test Users**
2. Add your Instagram account as test user
3. This allows testing without app review

## Step 7: Required Permissions (Scopes)

For CreatorIQ, you need these permissions:
- `instagram_basic` - View Instagram account info
- `instagram_manage_insights` - Read analytics
- `pages_show_list` - Access Facebook Pages
- `pages_read_engagement` - Read Page insights

These are automatically requested in the OAuth flow.

## Step 8: Update .env File

```bash
FACEBOOK_APP_ID=your-app-id-here
FACEBOOK_APP_SECRET=your-secret-here
FACEBOOK_REDIRECT_URI=http://localhost:3001/instagram/callback
```

## Important Notes

### Instagram Account Requirements
- Must be an **Instagram Business** or **Creator** account
- Must be linked to a **Facebook Page**
- Cannot use personal Instagram accounts

### Convert Personal to Business:
1. Open Instagram app
2. Go to Settings → Account
3. Switch to Professional Account
4. Choose **Creator** or **Business**
5. Link to your Facebook Page

### Access Tokens
- **Short-lived tokens** (1 hour) are exchanged during OAuth
- **Long-lived tokens** (60 days) can be obtained via API
- Implement token refresh logic for production

## Testing Your Integration

Test the OAuth flow:
1. Start backend: `pnpm dev:api`
2. Visit: `http://localhost:3001/instagram/auth`
3. Login with Facebook, approve permissions
4. Should redirect to your app with success

## App Review (For Production)

Before going live, you need Facebook's approval:

1. **Business Verification**: Verify your business identity
2. **Permissions Review**: Submit app for review
   - Required: `instagram_manage_insights`, `pages_show_list`
   - Provide screencast showing how you use the data
   - Can take 7-14 days
3. **Make App Public**: Switch from Development to Live mode

## Troubleshooting

**Error: "The user must be an administrator of the page"**
- Make sure your Instagram is linked to a Facebook Page you admin

**Error: "Permissions error"**
- Check that you requested the right scopes in OAuth URL
- Ensure app is in Development mode with test users added

**Error: "Invalid OAuth access token"**
- Token may have expired (1 hour for short-lived)
- Re-authenticate to get new token

**No Instagram account found**
- Ensure account is Business/Creator (not Personal)
- Check Page is properly linked to Instagram

## Data Access Limits

- **90-day retention**: Instagram only stores 90 days of insights
- **Rate limits**: 200 calls per hour per user
- **Metrics available**: Impressions, reach, engagement, follower_count, profile_views

## Resources
- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [Instagram Insights](https://developers.facebook.com/docs/instagram-api/reference/ig-user/insights)
- [Facebook App Review](https://developers.facebook.com/docs/app-review)
