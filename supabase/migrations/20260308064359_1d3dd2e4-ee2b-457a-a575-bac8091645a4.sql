
-- Add AI-generated description column
ALTER TABLE public.finance_deals ADD COLUMN IF NOT EXISTS ai_description text;

-- Add city and salary_range to leads table for lead capture
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS salary_range text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS deal_id uuid REFERENCES public.finance_deals(id);
