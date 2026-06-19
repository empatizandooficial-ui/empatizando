-- Remove old policy
DROP POLICY IF EXISTS "Allow anon all on social_posts" ON public.social_posts;

-- Create authenticated policies for social_posts
CREATE POLICY "Allow authenticated read" ON public.social_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON public.social_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON public.social_posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON public.social_posts FOR DELETE TO authenticated USING (true);

-- Update social_posts schema for platform-specific captions
ALTER TABLE public.social_posts RENAME COLUMN caption TO base_content;
ALTER TABLE public.social_posts ADD COLUMN IF NOT EXISTS caption_instagram TEXT;
ALTER TABLE public.social_posts ADD COLUMN IF NOT EXISTS caption_tiktok TEXT;

-- Update Storage Policies for admin only (upload)
DROP POLICY IF EXISTS "Anon insert on assets" ON storage.objects;
CREATE POLICY "Auth insert on assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'social_media_assets');
