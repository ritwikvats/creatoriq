-- ============================================
-- CreatorIQ - Complete Database Setup
-- Copy this ENTIRE file and paste into Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/bbbhnymcuqwedxofdotg/sql/new
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 1: USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 2: CONNECTED PLATFORMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.connected_platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'linkedin', 'twitter')),
  platform_user_id TEXT NOT NULL,
  platform_username TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  UNIQUE(user_id, platform)
);

-- ============================================
-- STEP 3: ANALYTICS SNAPSHOTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'linkedin', 'twitter')),
  snapshot_date DATE NOT NULL,
  metrics JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_analytics_user_platform_date
ON public.analytics_snapshots(user_id, platform, snapshot_date DESC);

-- ============================================
-- STEP 4: REVENUE ENTRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.revenue_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('adsense', 'brand_deal', 'affiliate', 'merch', 'other')),
  platform TEXT CHECK (platform IN ('youtube', 'instagram', 'linkedin', 'twitter')),
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'INR' NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  gst_applicable BOOLEAN DEFAULT false,
  gst_amount DECIMAL(12, 2),
  tds_deducted DECIMAL(12, 2),
  invoice_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_revenue_user_date
ON public.revenue_entries(user_id, date DESC);

-- ============================================
-- STEP 5: TAX RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.tax_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  financial_year TEXT NOT NULL,
  quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
  total_income DECIMAL(12, 2) NOT NULL,
  gst_collected DECIMAL(12, 2) NOT NULL,
  tds_deducted DECIMAL(12, 2) NOT NULL,
  form_26as_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, financial_year, quarter)
);

-- ============================================
-- STEP 6: DEALS TABLE (Brand Deal CRM)
-- ============================================
-- Create enum only if it doesn't exist
DO $$ BEGIN
  CREATE TYPE deal_status AS ENUM ('pitching', 'negotiating', 'contract_sent', 'closed_won', 'closed_lost');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  status deal_status DEFAULT 'pitching',
  amount DECIMAL(12, 2),
  currency TEXT DEFAULT 'INR',
  contact_email TEXT,
  next_action_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deals_user_status
ON public.deals(user_id, status);

-- ============================================
-- STEP 7: ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Connected platforms policies
CREATE POLICY "Users can view own platforms" ON public.connected_platforms
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own platforms" ON public.connected_platforms
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own platforms" ON public.connected_platforms
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own platforms" ON public.connected_platforms
  FOR DELETE USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON public.analytics_snapshots
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analytics" ON public.analytics_snapshots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Revenue policies
CREATE POLICY "Users can view own revenue" ON public.revenue_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own revenue" ON public.revenue_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own revenue" ON public.revenue_entries
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own revenue" ON public.revenue_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Tax policies
CREATE POLICY "Users can view own tax records" ON public.tax_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tax records" ON public.tax_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tax records" ON public.tax_records
  FOR UPDATE USING (auth.uid() = user_id);

-- Deals policies
CREATE POLICY "Users can view own deals" ON public.deals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own deals" ON public.deals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own deals" ON public.deals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own deals" ON public.deals
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- STEP 8: TRIGGERS & FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_revenue_updated_at BEFORE UPDATE ON public.revenue_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_updated_at BEFORE UPDATE ON public.tax_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 9: AUTO-CREATE USER TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users
INSERT INTO public.users (id, email, full_name)
SELECT id, email, raw_user_meta_data->>'full_name'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);

-- ============================================
-- ✅ COMPLETE! Database is ready for CreatorIQ
-- ============================================
