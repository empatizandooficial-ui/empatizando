-- Revert views to security definer (invoker = false) so anon users can read them
-- without needing SELECT permissions on the base tables.
ALTER VIEW public.products_public SET (security_invoker = false);
ALTER VIEW public.product_variants_public SET (security_invoker = false);
