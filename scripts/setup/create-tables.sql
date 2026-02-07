-- CreatorIQ Database Schema for Supabase (PostgreSQL)
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
-- Note: Supabase Auth handles the main auth.users table
-- This table extends user data
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONNECTED PLATFORMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.connected_platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'linkedin', 'twitter')),
  platform_user_id TEXT NOT NULL,
  platform_username TEXT NOT NULL,
  access_token TEXT NOT NULL, -- TODO: Encrypt in production
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  UNIQUE(user_id, platform)
);

-- ============================================
-- ANALYTICS SNAPSHOTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'linkedin', 'twitter')),
  snapshot_date DATE NOT NULL,
  metrics JSONB NOT NULL, -- Flexible JSON structure for platform-specific metrics
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform, snapshot_date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_user_platform_date 
ON public.analytics_snapshots(user_id, platform, snapshot_date DESC);

-- ============================================
-- REVENUE ENTRIES TABLE
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

-- Create index for revenue queries
CREATE INDEX IF NOT EXISTS idx_revenue_user_date 
ON public.revenue_entries(user_id, date DESC);

-- ============================================
-- TAX RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.tax_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  financial_year TEXT NOT NULL, -- e.g., "2025-26"
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
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_records ENABLE ROW LEVEL SECURITY;

-- Users table policies
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

-- Analytics snapshots policies
CREATE POLICY "Users can view own analytics" ON public.analytics_snapshots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON public.analytics_snapshots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Revenue entries policies
CREATE POLICY "Users can view own revenue" ON public.revenue_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own revenue" ON public.revenue_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own revenue" ON public.revenue_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own revenue" ON public.revenue_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Tax records policies
CREATE POLICY "Users can view own tax records" ON public.tax_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tax records" ON public.tax_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tax records" ON public.tax_records
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_updated_at BEFORE UPDATE ON public.revenue_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_updated_at BEFORE UPDATE ON public.tax_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL SETUP COMPLETE
-- ============================================
-- Next steps:
-- 1. Go to Supabase Dashboard > Authentication > Settings
-- 2. Enable Email provider
-- 3. Configure OAuth providers (Google for YouTube, Facebook for Instagram)
-- 4. Update .env with your Supabase URL and keys
