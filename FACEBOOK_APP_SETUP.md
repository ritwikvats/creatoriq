# Facebook App Setup for Instagram Integration

## Quick Fix: App Configuration

### Step 1: Open Your Facebook App Dashboard

Open this URL:
```
https://developers.facebook.com/apps/765342356611450/dashboard/
```

### Step 2: Add Instagram Product

1. In the left sidebar, click **"Add Product"**
2. Find **"Instagram Graph API"** (NOT Instagram Basic Display)
3. Click **"Set Up"**

### Step 3: Configure Permissions

1. Go to **App Review** → **Permissions and Features**
2. Request these permissions:
   - ✅ `pages_show_list`
   - ✅ `pages_read_engagement`
   - ✅ `instagram_basic`
   - ✅ `instagram_manage_insights`

### Step 4: Add Test Users (Development Mode)

Since your app is in Development Mode:

1. Go to **Roles** → **Test Users**
2. Add your Instagram Business Account as a test user
3. OR switch app to **Live Mode** (Settings → Basic → App Mode)

### Step 5: Verify Settings

1. Go to **Settings** → **Basic**
2. Verify:
   - App Domains: `localhost`
   - Website URL: `http://localhost:3001`

3. Go to **Facebook Login** → **Settings**
4. Add Valid OAuth Redirect URIs:
   ```
   http://localhost:3001/instagram/callback
   ```

### Step 6: Connect Instagram Business Account

⚠️ **Important:** Your Instagram account MUST be:
- A **Business Account** (not Personal)
- Connected to a **Facebook Page**

To convert:
1. Open Instagram app
2. Go to Settings → Account
3. Switch to Professional Account → Business
4. Connect to a Facebook Page

---

## Alternative: Use Instagram Basic Display (Personal Accounts)

If you want to use **personal Instagram accounts** instead:

### Step 1: Add Instagram Basic Display Product
1. In Facebook App Dashboard
2. Add Product → **Instagram Basic Display**
3. Click Set Up

### Step 2: Update Scopes in Code

Change the scopes to:
```javascript
const scope = 'instagram_graph_user_profile,instagram_graph_user_media';
```

### Step 3: Add OAuth Redirect URI
```
http://localhost:3001/instagram/callback
```

---

## Testing

After setup:
1. Click "Connect Instagram" in CreatorIQ
2. Should redirect to Facebook login
3. Grant permissions
4. Redirects back to dashboard

---

## Common Issues

### "Invalid Scopes" Error
- Make sure you added Instagram Graph API product (not Basic Display)
- Request permissions in App Review

### "App Not Set Up" Error
- Add OAuth redirect URI in Facebook Login settings
- Make sure app is in Development or Live mode

### "No Instagram Business Account Found"
- Convert Instagram to Business account
- Link to a Facebook Page

---

## Current App Scopes (Updated)

```
pages_show_list
pages_read_engagement
instagram_basic
instagram_manage_insights
```

These work for Instagram Business accounts connected to Facebook Pages.
