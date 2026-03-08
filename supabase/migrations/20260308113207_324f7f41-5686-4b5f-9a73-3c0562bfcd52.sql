-- Add image_url columns to credit_cards and loan_products
ALTER TABLE public.credit_cards ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.loan_products ADD COLUMN IF NOT EXISTS image_url text;

-- Create api_keys table for admin to manage all API keys
CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name text NOT NULL UNIQUE,
  key_value text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can manage API keys
CREATE POLICY "Auth users can read api_keys" ON public.api_keys FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can manage api_keys" ON public.api_keys FOR ALL TO authenticated USING (true) WITH CHECK (true);