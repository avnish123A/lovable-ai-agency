
-- Cashback deals table (admin adds or API syncs)
CREATE TABLE public.cashback_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_name TEXT NOT NULL,
  merchant_logo TEXT,
  offer_title TEXT NOT NULL,
  cashback_amount TEXT NOT NULL,
  description TEXT,
  tracking_link TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  source TEXT DEFAULT 'manual', -- 'manual' or 'hiqmobi'
  external_deal_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cashback_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active cashback deals"
  ON public.cashback_deals FOR SELECT
  USING (true);

CREATE POLICY "Auth users manage cashback deals"
  ON public.cashback_deals FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Cashback requests table
CREATE TABLE public.cashback_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID NOT NULL REFERENCES public.cashback_deals(id) ON DELETE CASCADE,
  tracking_id TEXT NOT NULL UNIQUE,
  user_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  upi_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, paid
  cashback_amount TEXT,
  click_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  admin_notes TEXT,
  device TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cashback_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit cashback requests (no login needed)
CREATE POLICY "Anyone can submit cashback requests"
  ON public.cashback_requests FOR INSERT
  WITH CHECK (true);

-- Auth users (admin) can view all
CREATE POLICY "Auth users can view cashback requests"
  ON public.cashback_requests FOR SELECT
  TO authenticated
  USING (true);

-- Auth users can update (approve/reject)
CREATE POLICY "Auth users can update cashback requests"
  ON public.cashback_requests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Auth users can delete
CREATE POLICY "Auth users can delete cashback requests"
  ON public.cashback_requests FOR DELETE
  TO authenticated
  USING (true);

-- Cashback payouts/transactions table
CREATE TABLE public.cashback_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.cashback_requests(id) ON DELETE CASCADE,
  upi_id TEXT NOT NULL,
  amount TEXT NOT NULL,
  transaction_ref TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cashback_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users manage payouts"
  ON public.cashback_payouts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
