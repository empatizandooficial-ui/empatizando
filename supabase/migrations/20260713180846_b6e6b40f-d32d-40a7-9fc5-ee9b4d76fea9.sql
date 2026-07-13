
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Public can view active products" ON public.products;

CREATE POLICY "Authenticated can view products"
  ON public.products FOR SELECT
  TO authenticated
  USING (true);

CREATE OR REPLACE VIEW public.products_public
WITH (security_invoker = true) AS
SELECT id, title, description, base_price, slug, images, is_active, created_at
FROM public.products
WHERE is_active = true;

REVOKE ALL ON public.products FROM anon;
GRANT SELECT ON public.products_public TO anon, authenticated;

CREATE POLICY "Anon can view active products limited columns"
  ON public.products FOR SELECT
  TO anon
  USING (is_active = true);

DROP POLICY IF EXISTS "Anyone can record affiliate clicks" ON public.affiliate_clicks;
DROP POLICY IF EXISTS "Anon can insert affiliate clicks" ON public.affiliate_clicks;
DROP POLICY IF EXISTS "Authenticated can insert affiliate clicks" ON public.affiliate_clicks;

CREATE POLICY "Only service role inserts clicks"
  ON public.affiliate_clicks FOR INSERT
  TO service_role
  WITH CHECK (true);

REVOKE INSERT ON public.affiliate_clicks FROM anon, authenticated;

DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete product images" ON storage.objects;

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.match_documents(extensions.vector, double precision, integer, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.match_documents(extensions.vector, double precision, integer, uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.process_affiliate_commission(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_affiliate_commission(uuid) TO service_role;
