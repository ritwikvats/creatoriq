-- ============================================
-- CLEANUP SCRIPT (Run this first if you want to start fresh)
-- ============================================

-- Drop all tables (will cascade delete everything)
DROP TABLE IF EXISTS public.deals CASCADE;
DROP TABLE IF EXISTS public.tax_records CASCADE;
DROP TABLE IF EXISTS public.revenue_entries CASCADE;
DROP TABLE IF EXISTS public.analytics_snapshots CASCADE;
DROP TABLE IF EXISTS public.connected_platforms CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop types
DROP TYPE IF EXISTS deal_status CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Now run the ALL-IN-ONE-SETUP.sql script
