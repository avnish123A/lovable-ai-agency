-- Create RLS policies for media storage bucket uploads
CREATE POLICY "Allow authenticated users to upload to media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Allow authenticated users to update media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Allow authenticated users to delete media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'media');

CREATE POLICY "Allow public read access to media"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'media');