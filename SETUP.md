# CreatorIQ Setup Guide

Welcome to CreatorIQ! This guide will help you get the application running locally.

## Prerequisites

- **Node.js** 18+ and **pnpm** 8+
- **Supabase account** (free tier works)
- **Google Cloud account** (for YouTube API)
- **Facebook Developer account** (for Instagram API)

## Quick Start (15 minutes)

### 1. Install Dependencies

```bash
cd ~/CreatorIQ
pnpm install
```

This will install all dependencies for frontend, backend, and shared packages.

### 2. Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create account
2. Click **New Project**
   - Name: `CreatorIQ`
   - Database Password: (save this!)
   - Region: Choose closest to you
3. Wait for project to provision (~2 minutes)
4. Go to **Settings** → **API**
   - Copy **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy **service_role** key → This is your `SUPABASE_SERVICE_ROLE_KEY`
5. Go to **SQL Editor**
   - Click **New Query**
   - Copy entire contents of `scripts/setup/create-tables.sql`
   - Paste and click **Run**
   - You should see "Success. No rows returned"

### 3. Setup Google OAuth (YouTube)

Follow detailed guide: `scripts/setup/setup-google-oauth.md`

**Quick version**:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project → Enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. Add redirect URI: `http://localhost:3001/youtube/callback`
5. Copy Client ID and Secret

### 4. Setup Facebook OAuth (Instagram)

Follow detailed guide: `scripts/setup/setup-facebook-oauth.md`

**Quick version**:
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create new app → Add Instagram product
3. Configure OAuth redirect: `http://localhost:3001/instagram/callback`
4. Copy App ID and Secret

### 5. Create .env File

```bash
cp .env.example .env
```

Then edit `.env` and fill in all values:

```bash
# Supabase (from step 2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend
NEXT_PUBLIC_API_URL=http://localhost:3001
API_PORT=3001

# Google/YouTube (from step 3)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_REDIRECT_URI=http://localhost:3001/youtube/callback

# Facebook/Instagram (from step 4)
FACEBOOK_APP_ID=1234567890
FACEBOOK_APP_SECRET=xxxxx
FACEBOOK_REDIRECT_URI=http://localhost:3001/instagram/callback

# Other
JWT_SECRET=your-random-secret-key-here
FRONTEND_URL=http://localhost:3000
```

### 6. Run the Application

Open two terminal windows:

**Terminal 1 - Frontend**:
```bash
pnpm dev:web
```
Frontend will run on [http://localhost:3000](http://localhost:3000)

**Terminal 2 - Backend**:
```bash
pnpm dev:api
```
Backend will run on [http://localhost:3001](http://localhost:3001)

### 7. Test Your Setup

1. Open [http://localhost:3000](http://localhost:3000)
2. Click **Get Started** → Create account
3. Login to dashboard
4. Try connecting YouTube or Instagram
5. Check if OAuth flow works

## Project Structure

```
CreatorIQ/
├── apps/
│   ├── web/          # Next.js frontend (port 3000)
│   └── api/          # Express backend (port 3001)
├── packages/
│   └── shared/       # Shared TypeScript types
├── scripts/
│   └── setup/        # Setup guides and SQL scripts
├── docs/             # Documentation
├── .env              # Environment variables (create this)
└── .env.example      # Template
```

## Common Issues

### "Module not found" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### Supabase connection errors
- Check that `.env` has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verify SQL script ran successfully (check tables exist in Supabase dashboard)

### OAuth redirect errors
- Ensure redirect URIs in Google/Facebook match exactly (including `http://` vs `https://`)
- Check that ports match (3001 for backend)

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

## Next Steps

Once everything is running:

1. **Test Platform Connections**:
   - Connect your YouTube account
   - Connect your Instagram Business account
   - Verify analytics are showing

2. **Add Revenue Data**:
   - Test manual revenue entry
   - Check revenue dashboard

3. **Explore Tax Tools**:
   - Generate GST reports
   - Test Form 26AS preview

## Development Commands

```bash
# Run everything (both frontend and backend)
pnpm dev

# Run only frontend
pnpm dev:web

# Run only backend
pnpm dev:api

# Build for production
pnpm build

# Lint code
pnpm lint
```

## Need Help?

Check the detailed setup guides:
- YouTube: `scripts/setup/setup-google-oauth.md`
- Instagram: `scripts/setup/setup-facebook-oauth.md`
- Database: `scripts/setup/create-tables.sql`

## Production Deployment

For production deployment:
1. Update OAuth redirect URIs to production URLs
2. Set environment variables on hosting platforms
3. Deploy frontend to Vercel
4. Deploy backend to Railway or Render
5. Update CORS settings in backend

See `docs/deployment.md` (coming soon) for detailed production setup.
