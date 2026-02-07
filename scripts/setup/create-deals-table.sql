-- Creator CRM - Deals Table Schema
-- Run this in Supabase SQL Editor

-- Create enum for deal status
CREATE TYPE deal_status AS ENUM ('pitching', 'negotiating', 'contract_sent', 'closed_won', 'closed_lost');

-- Create deals table
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

-- Enable RLS
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own deals" ON public.deals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deals" ON public.deals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deals" ON public.deals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own deals" ON public.deals
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster board loading
CREATE INDEX IF NOT EXISTS idx_deals_user_status 
ON public.deals(user_id, status);
