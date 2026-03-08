ALTER TABLE public.cashback_deals ADD COLUMN IF NOT EXISTS coupon_code text DEFAULT NULL;
ALTER TABLE public.cashback_deals ADD COLUMN IF NOT EXISTS expiry_date date DEFAULT NULL;
ALTER TABLE public.cashback_deals ADD COLUMN IF NOT EXISTS terms text DEFAULT NULL;