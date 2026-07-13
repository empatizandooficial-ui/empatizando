
-- 1. Newsletter email validation
ALTER TABLE public.leads_newsletter
  ADD CONSTRAINT leads_newsletter_email_check
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- 2. Roles system
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 3. Fix function search_path (mutable)
CREATE OR REPLACE FUNCTION public.update_chat_session_timestamp()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.handle_specialists_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.process_affiliate_commission(order_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_affiliate_id UUID;
  v_commission NUMERIC;
BEGIN
  SELECT affiliate_id, commission_amount INTO v_affiliate_id, v_commission
  FROM orders WHERE id = order_id AND status = 'paid';
  IF v_affiliate_id IS NOT NULL AND v_commission > 0 THEN
    UPDATE affiliates SET balance = balance + v_commission WHERE id = v_affiliate_id;
  END IF;
END;
$$;

-- 4. Revoke EXECUTE on SECURITY DEFINER function from anon/authenticated
REVOKE ALL ON FUNCTION public.process_affiliate_commission(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_affiliate_commission(uuid) TO service_role;

-- 5. agent_configurations: admin-only
DROP POLICY IF EXISTS "Allow authenticated users to delete agent configs" ON public.agent_configurations;
DROP POLICY IF EXISTS "Allow authenticated users to insert agent configs" ON public.agent_configurations;
DROP POLICY IF EXISTS "Allow authenticated users to read agent configs" ON public.agent_configurations;
DROP POLICY IF EXISTS "Allow authenticated users to update agent configs" ON public.agent_configurations;

CREATE POLICY "Admins can select agent configs" ON public.agent_configurations
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert agent configs" ON public.agent_configurations
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update agent configs" ON public.agent_configurations
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete agent configs" ON public.agent_configurations
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 6. chat_sessions / chat_messages / lead_memories: admin-only
DROP POLICY IF EXISTS "Admins can manage chat_sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Admins can manage chat_messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admins can manage lead_memories" ON public.lead_memories;

CREATE POLICY "Admins can manage chat_sessions" ON public.chat_sessions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage chat_messages" ON public.chat_messages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage lead_memories" ON public.lead_memories
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. affiliate_clicks: enable RLS + policies
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can record affiliate clicks" ON public.affiliate_clicks;
DROP POLICY IF EXISTS "Affiliate can view own clicks" ON public.affiliate_clicks;
DROP POLICY IF EXISTS "Admins can view all clicks" ON public.affiliate_clicks;

CREATE POLICY "Anyone can record affiliate clicks" ON public.affiliate_clicks
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Affiliate can view own clicks" ON public.affiliate_clicks
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliates a
      WHERE a.id = affiliate_clicks.affiliate_id
        AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all clicks" ON public.affiliate_clicks
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 8. Storage: product-images (public bucket) — allow public read via direct URL only,
-- disallow listing and public writes.
DROP POLICY IF EXISTS "Public read access for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public users can delete from product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public users can insert into product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public users can update product-images" ON storage.objects;

CREATE POLICY "Authenticated can upload product-images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated can update product-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated can delete product-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');

-- 9. Storage: social_media_assets — path-scope to user's folder
DROP POLICY IF EXISTS "Auth delete on own assets" ON storage.objects;
DROP POLICY IF EXISTS "Auth insert on assets" ON storage.objects;
DROP POLICY IF EXISTS "Auth read on assets" ON storage.objects;
DROP POLICY IF EXISTS "Auth update on own assets" ON storage.objects;

CREATE POLICY "Users can read own social assets" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'social_media_assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload own social assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'social_media_assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own social assets" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'social_media_assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'social_media_assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own social assets" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'social_media_assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
