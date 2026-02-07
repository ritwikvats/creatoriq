# Supabase Database Setup Instructions

## ✅ Your .env is now updated with real credentials!

Now you need to run the database schema in Supabase:

## Option 1: Via Supabase Dashboard (Recommended - 2 minutes)

1. Go to your Supabase project: https://supabase.com/dashboard/project/bbbhnymcuqwedxofdotg
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the ENTIRE contents of this file: `/Users/ritwikvats/CreatorIQ/scripts/setup/create-tables.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see: "Success. No rows returned"

## Option 2: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Login
supabase login

# Link to your project
supabase link --project-ref bbbhnymcuqwedxofdotg

# Run migrations
supabase db push
```

## What This Creates

The schema creates these tables:
- `users` - User profiles
- `connected_platforms` - YouTube/Instagram OAuth tokens
- `analytics_snapshots` - Historical analytics data
- `revenue_entries` - Revenue tracking
- `tax_records` - India tax data

All tables have Row Level Security (RLS) enabled for privacy.

## After Running the Schema

The servers will automatically reload and you'll be able to:
- ✅ Sign up with email/password
- ✅ Log in to dashboard
- ✅ Start using the app!

---

**I'll wait here while you run the SQL schema. Just tell me when it's done!** 🚀
