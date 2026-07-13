
-- Remove anon SELECT access on base products table (cost_price/base_price exposure)
DROP POLICY IF EXISTS "Anon can view active products limited columns" ON public.products;
REVOKE SELECT ON public.products FROM anon;

-- Ensure products_public view is readable by anon (safe columns only)
GRANT SELECT ON public.products_public TO anon, authenticated;

-- Remove non-admin-scoped storage policies on product-images bucket
DROP POLICY IF EXISTS "Authenticated can upload product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete product-images" ON storage.objects;
