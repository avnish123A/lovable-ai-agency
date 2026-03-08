-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create affiliate_links table for link management
CREATE TABLE IF NOT EXISTS public.affiliate_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_url text NOT NULL,
  cuelinks_url text,
  earnkaro_url text,
  product_id uuid,
  product_type text,
  platform text DEFAULT 'cuelinks',
  is_active boolean DEFAULT true,
  clicks integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for affiliate_links
CREATE POLICY "Anyone can read affiliate links" ON public.affiliate_links
  FOR SELECT USING (true);

CREATE POLICY "Auth users manage affiliate links" ON public.affiliate_links
  FOR ALL USING (true) WITH CHECK (true);

-- Add sync tracking table
CREATE TABLE IF NOT EXISTS public.sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type text NOT NULL,
  status text NOT NULL,
  records_processed integer DEFAULT 0,
  details jsonb,
  started_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz
);

-- Enable RLS
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Auth users can read sync logs" ON public.sync_logs
  FOR SELECT USING (true);