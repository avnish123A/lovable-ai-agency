-- Fix coming_soon_subscribers RLS: change restrictive to permissive
DROP POLICY IF EXISTS "Auth users can view subscribers" ON public.coming_soon_subscribers;
DROP POLICY IF EXISTS "Auth users can update subscribers" ON public.coming_soon_subscribers;
DROP POLICY IF EXISTS "Auth users can delete subscribers" ON public.coming_soon_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.coming_soon_subscribers;

CREATE POLICY "Anyone can subscribe" ON public.coming_soon_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Auth users can view subscribers" ON public.coming_soon_subscribers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can update subscribers" ON public.coming_soon_subscribers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth users can delete subscribers" ON public.coming_soon_subscribers FOR DELETE TO authenticated USING (true);