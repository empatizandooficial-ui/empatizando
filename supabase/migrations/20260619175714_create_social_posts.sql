-- Create table for scheduling social posts
CREATE TABLE IF NOT EXISTS public.social_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    caption TEXT NOT NULL,
    media_url TEXT,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    post_instagram BOOLEAN DEFAULT false,
    post_tiktok BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed'))
);

-- Enable RLS
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- Temporary Policy: Allow anonymous access for the Admin Panel prototype.
-- In production, this should be restricted to authenticated admin users.
CREATE POLICY "Allow anon all on social_posts" ON public.social_posts FOR ALL TO anon USING (true) WITH CHECK (true);

-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('social_media_assets', 'social_media_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public read on assets" ON storage.objects FOR SELECT USING (bucket_id = 'social_media_assets');
CREATE POLICY "Anon insert on assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'social_media_assets' AND auth.role() = 'anon');
