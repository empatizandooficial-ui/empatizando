
ALTER VIEW public.products_public SET (security_invoker = true);

DROP POLICY IF EXISTS "Public read access for product_variants" ON public.product_variants;

CREATE OR REPLACE VIEW public.product_variants_public
WITH (security_invoker = true) AS
SELECT id, product_id, sku, price_override, image_url, is_active, created_at
FROM public.product_variants
WHERE is_active = true;

GRANT SELECT ON public.product_variants_public TO anon, authenticated;
REVOKE SELECT ON public.product_variants FROM anon;
