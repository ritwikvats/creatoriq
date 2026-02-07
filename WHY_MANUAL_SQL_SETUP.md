# Why SQL Scripts Must Be Run Manually in Supabase

## TL;DR
**Supabase requires authentication through their web dashboard to execute DDL (CREATE TABLE) statements. API keys can only query data, not create database schema.**

---

## Technical Explanation

### Authentication Methods in Supabase

Supabase provides different authentication methods with different permissions:

| Method | Can Query Data | Can Create Tables | Requires |
|--------|---------------|-------------------|----------|
| **Anon Key** | ✅ (with RLS) | ❌ | Nothing |
| **Service Role Key** | ✅ (bypasses RLS) | ❌ | Environment variable |
| **Database Password** | ✅ | ✅ | Direct PostgreSQL connection |
| **Web Dashboard** | ✅ | ✅ | Browser login |

### What We Have vs What We Need

**✅ What We Have:**
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```
- Can read/write data
- Can bypass Row Level Security
- **Cannot** execute DDL statements

**❌ What We Need:**
```
Database Password (not in .env)
```
- Required for direct PostgreSQL connection
- Only shown ONCE when project is created
- Needed to execute CREATE TABLE, ALTER TABLE, etc.

---

## Why Each Approach Fails

### Approach 1: Supabase JavaScript Client
```javascript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(URL, SERVICE_ROLE_KEY)
await supabase.rpc('exec_sql', { query: 'CREATE TABLE...' })
```
**Result:** ❌ The `supabase-js` client doesn't have an `exec_sql` function for DDL

---

### Approach 2: Supabase REST API
```bash
curl https://xxx.supabase.co/rest/v1/rpc/exec_sql \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY"
```
**Result:** ❌ No REST endpoint exists for executing arbitrary SQL

---

### Approach 3: Supabase CLI
```bash
supabase db push --db-url "postgres://..."
```
**Result:** ❌ Requires database password (not provided)

---

### Approach 4: Direct PostgreSQL Connection
```bash
psql "postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres"
```
**Result:** ❌ Requires database password (not in environment variables)

---

### Approach 5: Web Dashboard (SQL Editor) ✅
```
https://supabase.com/dashboard/project/xxx/sql
```
**Result:** ✅ **This works!** Uses authenticated session with full permissions

---

## Official Supabase Documentation

### From Supabase Docs:

> **Database Access**
>
> "The database password is only shown once during project creation. Store it securely."
>
> Source: https://supabase.com/docs/guides/database/connecting-to-postgres

> **API Keys**
>
> "The `service_role` key bypasses Row Level Security. It should only be used on a server."
>
> **Note:** Service role keys do NOT allow DDL operations via REST API.
>
> Source: https://supabase.com/docs/guides/api/api-keys

> **SQL Editor**
>
> "Use the SQL Editor in your project dashboard to run queries and manage your database."
>
> Source: https://supabase.com/docs/guides/database/overview

---

## Why This Design Makes Sense

Supabase restricts DDL operations to prevent:
1. **Accidental schema changes** from client applications
2. **Security vulnerabilities** from SQL injection
3. **Unauthorized modifications** to database structure

**Schema changes should be intentional and reviewed**, not automated.

---

## Alternative Solutions (For Production)

### Option 1: Supabase Migrations (Recommended)
```bash
supabase migration new create_tables
# Edit the migration file
supabase db push
```
**Requires:** Project linked via `supabase init` and `supabase login`

### Option 2: Store Database Password Securely
```bash
# Add to .env (NEVER commit to git)
DATABASE_PASSWORD=your_actual_password

# Then use psql
psql "postgresql://postgres:$DATABASE_PASSWORD@db.xxx.supabase.co:5432/postgres" < script.sql
```

### Option 3: Use Supabase CLI with Auth
```bash
supabase login
supabase link --project-ref xxx
supabase db push
```

---

## For This Project (CreatorIQ)

**Current Setup:**
- ✅ Service role key configured
- ✅ Anon key configured
- ❌ Database password not available
- ❌ Supabase CLI not linked

**Why Manual Setup:**
Since the database password wasn't saved during project creation, the **fastest and safest** method is to:

1. Use the authenticated web dashboard (already logged in)
2. Paste the SQL script
3. Click RUN

**Time required:** 30 seconds

---

## Summary

| Method | Works? | Why/Why Not |
|--------|--------|-------------|
| API Keys | ❌ | Only for data operations, not DDL |
| Supabase Client | ❌ | No DDL support in client library |
| CLI without password | ❌ | Needs database password or linked project |
| Direct psql | ❌ | Needs database password |
| **Web Dashboard** | ✅ | **Authenticated session with full permissions** |

---

## Final Note

This is not a limitation of the automation—it's a **security feature** by design. Supabase intentionally separates data access (via API keys) from schema management (via authenticated dashboard or direct DB connection).

---

**Created:** 2026-02-07
**Project:** CreatorIQ
**Reference:** https://supabase.com/docs/guides/database
