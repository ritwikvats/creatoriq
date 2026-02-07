# Instagram Basic Display API Setup Guide

## Error: "Invalid platform app"

This means your Instagram app needs proper configuration.

---

## Step-by-Step Fix

### 1. Open Your Facebook App Dashboard

```
https://developers.facebook.com/apps/1293558755931461/dashboard/
```

---

### 2. Add Instagram Basic Display Product

1. In left sidebar, click **"+ Add Product"**
2. Find **"Instagram Basic Display"** (NOT Instagram Graph API)
3. Click **"Set Up"**

---

### 3. Configure Instagram Basic Display

After adding the product:

1. Go to **Products** → **Instagram Basic Display** → **Basic Display**

2. Click **"Create New App"**

3. Fill in the form:
   - **Display Name:** CreatorIQ
   - **Valid OAuth Redirect URIs:**
     ```
     http://localhost:3001/instagram/callback
     ```
   - **Deauthorize Callback URL:**
     ```
     http://localhost:3001/instagram/deauthorize
     ```
   - **Data Deletion Request URL:**
     ```
     http://localhost:3001/instagram/delete
     ```

4. Click **"Save Changes"**

5. You'll see:
   - **Instagram App ID:** (copy this)
   - **Instagram App Secret:** (copy this)
   - **Client Token:** (not needed)

---

### 4. Add Instagram Testers

Since the app is in Development Mode:

1. Scroll down to **"User Token Generator"**
2. Click **"Add or Remove Instagram Testers"**
3. This opens Instagram settings
4. Add your Instagram account: **@ssup.ritwik**
5. Go to Instagram app → Settings → Apps and Websites → Tester Invites
6. **Accept** the invite

---

### 5. Verify App Settings

Go to **Settings** → **Basic**:

1. **App Domains:** `localhost`
2. **Privacy Policy URL:** `http://localhost:3004/privacy` (can be anything for dev)
3. **User Data Deletion:** `http://localhost:3004/deletion` (can be anything for dev)

---

### 6. Get Instagram App ID & Secret

Go back to **Instagram Basic Display** → **Basic Display**

Copy:
- **Instagram App ID:** (use this as FACEBOOK_APP_ID)
- **Instagram App Secret:** (use this as FACEBOOK_APP_SECRET)

⚠️ **Important:** These are DIFFERENT from your Facebook App ID/Secret!

---

## Update Your .env File

After getting the Instagram App ID & Secret:

```env
FACEBOOK_APP_ID=<your_instagram_app_id>
FACEBOOK_APP_SECRET=<your_instagram_app_secret>
FACEBOOK_REDIRECT_URI=http://localhost:3001/instagram/callback
```

---

## Common Issues

### "Invalid platform app"
- You're using Facebook App ID instead of Instagram App ID
- Instagram Basic Display product not added
- Redirect URI doesn't match exactly

### "User not authorized"
- You didn't add yourself as Instagram Tester
- Didn't accept the tester invite in Instagram app

### "Redirect URI mismatch"
- Make sure redirect URI in code EXACTLY matches what's in settings
- No trailing slashes
- Correct port number

---

## Testing Flow

After proper setup:

1. Click "Connect Instagram" in CreatorIQ
2. Redirects to Instagram login
3. Login with **@ssup.ritwik**
4. Grant permissions to CreatorIQ
5. Redirects back to http://localhost:3004/dashboard
6. Success! ✅

---

## Need the Instagram App ID?

If you don't see the Instagram App ID/Secret:

1. Go to **Products** → **Instagram Basic Display**
2. Look for **"Basic Display"** section
3. You should see **"Instagram App ID"** and **"Instagram App Secret"**
4. If not, click **"Create New App"** first

---

## Alternative: Use Access Token Directly

If OAuth is too complex, you can use the user token you already have:

1. In Instagram Basic Display → User Token Generator
2. Click **"Generate Token"** for @ssup.ritwik
3. Copy the token
4. Skip OAuth and use this token directly in your code

---

**Current App ID:** 1293558755931461 (this might be Facebook App ID, not Instagram App ID)

Make sure you're using the **Instagram App ID** from the Instagram Basic Display section!
