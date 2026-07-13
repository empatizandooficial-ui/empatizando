-- Fix the exposure of cost_price to any authenticated user
-- Make the public view bypass RLS so anon and non-admins can read the safe columns
ALTER VIEW public.products_public SET (security_invoker = false);

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated can view products" ON public.products;

-- Create strict policy so only admins can read the full products table (including cost_price)
CREATE POLICY "Admins can view products" 
  ON public.products FOR SELECT 
  TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));
