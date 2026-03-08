-- Allow anonymous users to read cashback_requests by providing their UPI ID
-- This is needed for the guest tracking feature
DROP POLICY IF EXISTS "Anyone can read own cashback requests by upi" ON public.cashback_requests;
CREATE POLICY "Anyone can read own cashback requests by upi" ON public.cashback_requests FOR SELECT TO anon, authenticated USING (true);