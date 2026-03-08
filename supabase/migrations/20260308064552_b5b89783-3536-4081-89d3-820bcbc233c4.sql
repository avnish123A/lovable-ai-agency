
-- Allow anonymous lead submissions
DROP POLICY IF EXISTS "Authenticated users can insert leads" ON public.leads;
CREATE POLICY "Anyone can submit leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);
