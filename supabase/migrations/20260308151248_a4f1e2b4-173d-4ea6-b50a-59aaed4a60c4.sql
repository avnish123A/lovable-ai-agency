
CREATE TABLE public.coming_soon_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(email)
);

ALTER TABLE public.coming_soon_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe"
  ON public.coming_soon_subscribers FOR INSERT
  WITH CHECK (true);

-- Authenticated users can view subscribers
CREATE POLICY "Auth users can view subscribers"
  ON public.coming_soon_subscribers FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can update subscribers
CREATE POLICY "Auth users can update subscribers"
  ON public.coming_soon_subscribers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete subscribers
CREATE POLICY "Auth users can delete subscribers"
  ON public.coming_soon_subscribers FOR DELETE
  TO authenticated
  USING (true);
