
-- Credit Cards table
CREATE TABLE public.credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  annual_fee NUMERIC NOT NULL DEFAULT 0,
  joining_fee NUMERIC NOT NULL DEFAULT 0,
  cashback_rate TEXT,
  reward_points TEXT,
  welcome_bonus TEXT,
  features TEXT[] DEFAULT '{}',
  min_salary NUMERIC DEFAULT 0,
  min_age INTEGER DEFAULT 18,
  card_type TEXT DEFAULT 'rewards',
  apply_link TEXT,
  rating NUMERIC DEFAULT 4.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Loans table
CREATE TABLE public.loan_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  interest_rate NUMERIC NOT NULL,
  min_amount NUMERIC NOT NULL DEFAULT 50000,
  max_amount NUMERIC NOT NULL DEFAULT 5000000,
  processing_fee TEXT,
  min_tenure INTEGER DEFAULT 12,
  max_tenure INTEGER DEFAULT 60,
  features TEXT[] DEFAULT '{}',
  min_salary NUMERIC DEFAULT 0,
  min_age INTEGER DEFAULT 21,
  employment_type TEXT[] DEFAULT '{"salaried","self-employed"}',
  apply_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cashback Offers table
CREATE TABLE public.cashback_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT NOT NULL,
  cashback_value TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  validity DATE,
  claim_instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashback_offers ENABLE ROW LEVEL SECURITY;

-- Public read access for all products
CREATE POLICY "Anyone can read credit cards" ON public.credit_cards FOR SELECT USING (true);
CREATE POLICY "Anyone can read loan products" ON public.loan_products FOR SELECT USING (true);
CREATE POLICY "Anyone can read cashback offers" ON public.cashback_offers FOR SELECT USING (true);

-- Only authenticated users can manage products
CREATE POLICY "Auth users manage credit cards" ON public.credit_cards FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users manage loan products" ON public.loan_products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users manage cashback offers" ON public.cashback_offers FOR ALL TO authenticated USING (true) WITH CHECK (true);
