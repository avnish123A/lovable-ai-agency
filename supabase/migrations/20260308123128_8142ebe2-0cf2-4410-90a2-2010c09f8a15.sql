
-- Insurance Products table
CREATE TABLE public.insurance_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  insurance_type TEXT NOT NULL DEFAULT 'health',
  premium_starting TEXT,
  coverage_amount TEXT,
  features TEXT[] DEFAULT '{}'::text[],
  apply_link TEXT,
  image_url TEXT,
  description TEXT,
  rating NUMERIC DEFAULT 4.0,
  min_age INTEGER DEFAULT 18,
  max_age INTEGER DEFAULT 65,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bank Accounts table
CREATE TABLE public.bank_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'savings',
  min_balance TEXT,
  interest_rate NUMERIC,
  features TEXT[] DEFAULT '{}'::text[],
  apply_link TEXT,
  image_url TEXT,
  description TEXT,
  rating NUMERIC DEFAULT 4.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Demat Accounts table
CREATE TABLE public.demat_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_name TEXT NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'trading',
  account_opening_fee TEXT DEFAULT '₹0',
  annual_maintenance TEXT,
  brokerage TEXT,
  features TEXT[] DEFAULT '{}'::text[],
  apply_link TEXT,
  image_url TEXT,
  description TEXT,
  rating NUMERIC DEFAULT 4.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fixed Deposits table
CREATE TABLE public.fixed_deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scheme_name TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  interest_rate NUMERIC NOT NULL,
  min_amount NUMERIC DEFAULT 1000,
  max_amount NUMERIC,
  min_tenure TEXT,
  max_tenure TEXT,
  features TEXT[] DEFAULT '{}'::text[],
  apply_link TEXT,
  image_url TEXT,
  description TEXT,
  rating NUMERIC DEFAULT 4.0,
  senior_citizen_rate NUMERIC,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.insurance_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demat_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixed_deposits ENABLE ROW LEVEL SECURITY;

-- RLS policies for insurance_products
CREATE POLICY "Anyone can read insurance products" ON public.insurance_products FOR SELECT USING (true);
CREATE POLICY "Auth users manage insurance products" ON public.insurance_products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS policies for bank_accounts
CREATE POLICY "Anyone can read bank accounts" ON public.bank_accounts FOR SELECT USING (true);
CREATE POLICY "Auth users manage bank accounts" ON public.bank_accounts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS policies for demat_accounts
CREATE POLICY "Anyone can read demat accounts" ON public.demat_accounts FOR SELECT USING (true);
CREATE POLICY "Auth users manage demat accounts" ON public.demat_accounts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS policies for fixed_deposits
CREATE POLICY "Anyone can read fixed deposits" ON public.fixed_deposits FOR SELECT USING (true);
CREATE POLICY "Auth users manage fixed deposits" ON public.fixed_deposits FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Enable realtime for all new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.insurance_products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bank_accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.demat_accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.fixed_deposits;
