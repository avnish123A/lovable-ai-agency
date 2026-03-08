-- Create banks table for partner bank management
CREATE TABLE IF NOT EXISTS public.banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  website_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.banks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read banks" ON public.banks
  FOR SELECT USING (true);

CREATE POLICY "Auth users manage banks" ON public.banks
  FOR ALL USING (true) WITH CHECK (true);

-- Add enhanced tracking columns to leads table
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS device text,
  ADD COLUMN IF NOT EXISTS ip_hash text,
  ADD COLUMN IF NOT EXISTS source_page text,
  ADD COLUMN IF NOT EXISTS user_agent text,
  ADD COLUMN IF NOT EXISTS product_name text,
  ADD COLUMN IF NOT EXISTS bank_name text;

-- Add device and source info to deal_clicks for enhanced analytics
ALTER TABLE public.deal_clicks
  ADD COLUMN IF NOT EXISTS source_page text,
  ADD COLUMN IF NOT EXISTS device text;

-- Create media table for media library
CREATE TABLE IF NOT EXISTS public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text,
  file_size bigint,
  category text DEFAULT 'general',
  alt_text text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- RLS Policies for media
CREATE POLICY "Anyone can read media" ON public.media
  FOR SELECT USING (true);

CREATE POLICY "Auth users manage media" ON public.media
  FOR ALL USING (true) WITH CHECK (true);