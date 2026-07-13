
DROP POLICY IF EXISTS "Anyone can record affiliate clicks" ON public.affiliate_clicks;
CREATE POLICY "Anyone can record affiliate clicks" ON public.affiliate_clicks
  FOR INSERT TO anon, authenticated
  WITH CHECK (affiliate_id IS NOT NULL);
