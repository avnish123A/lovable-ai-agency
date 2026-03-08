
-- Finance deals table for Cuelinks API data
CREATE TABLE public.finance_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id text UNIQUE NOT NULL,
  title text NOT NULL,
  merchant text NOT NULL,
  category text NOT NULL DEFAULT 'finance',
  subcategory text,
  cashback text,
  description text,
  tracking_link text,
  expiry_date date,
  offer_type text,
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  clicks integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.finance_deals ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read finance deals"
  ON public.finance_deals FOR SELECT
  USING (true);

-- Auth users manage
CREATE POLICY "Auth users manage finance deals"
  ON public.finance_deals FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Deal clicks tracking table
CREATE TABLE public.deal_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES public.finance_deals(id) ON DELETE CASCADE NOT NULL,
  clicked_at timestamp with time zone DEFAULT now(),
  user_agent text,
  ip_hash text
);

ALTER TABLE public.deal_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert deal clicks"
  ON public.deal_clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Auth users can read deal clicks"
  ON public.deal_clicks FOR SELECT
  TO authenticated
  USING (true);
