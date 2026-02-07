# Database Setup Guide

## Quick Setup (5 minutes)

Your Supabase credentials are already configured! Just need to run the SQL scripts.

### Step 1: Open Supabase SQL Editor

Click this link to open your project's SQL Editor:
**https://supabase.com/dashboard/project/bbbhnymcuqwedxofdotg/sql/new**

### Step 2: Execute SQL Scripts (in order)

#### 1️⃣ Create Main Tables

Copy and paste the entire content from:
`scripts/setup/create-tables.sql`

Then click **RUN** in the SQL Editor.

This creates:
- ✅ users table
- ✅ connected_platforms (YouTube, Instagram)
- ✅ analytics_snapshots
- ✅ revenue_entries
- ✅ tax_records
- ✅ Row Level Security policies

---

#### 2️⃣ Create Deals Table

Copy and paste the entire content from:
`scripts/setup/create-deals-table.sql`

Then click **RUN**.

This creates:
- ✅ deals table (for brand deal CRM)
- ✅ RLS policies for deals

---

#### 3️⃣ Create Auto-User Trigger

Copy and paste the entire content from:
`scripts/setup/auto-create-user-trigger.sql`

Then click **RUN**.

This creates:
- ✅ Automatic user creation trigger (when someone signs up)

---

## Verification

After running all scripts, verify in Supabase Dashboard:

1. Go to **Table Editor**
2. You should see these tables:
   - users
   - connected_platforms
   - analytics_snapshots
   - revenue_entries
   - tax_records
   - deals

---

## ✅ Done!

Your database is now ready. Return to the terminal and run:

```bash
pnpm dev
```

Visit http://localhost:3000 to start using CreatorIQ!
