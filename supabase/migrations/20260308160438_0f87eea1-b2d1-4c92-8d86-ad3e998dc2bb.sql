ALTER TABLE public.cashback_requests ADD COLUMN IF NOT EXISTS estimated_payout_date date DEFAULT NULL;
ALTER TABLE public.cashback_requests ADD COLUMN IF NOT EXISTS public_note text DEFAULT NULL;