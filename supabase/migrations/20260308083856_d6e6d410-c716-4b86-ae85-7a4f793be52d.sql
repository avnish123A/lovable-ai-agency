ALTER TABLE public.finance_deals 
ADD COLUMN IF NOT EXISTS ai_benefits text,
ADD COLUMN IF NOT EXISTS ai_eligibility text,
ADD COLUMN IF NOT EXISTS ai_terms text;