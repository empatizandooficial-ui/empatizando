-- Enable RLS on the leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert new leads (Newsletter)
CREATE POLICY "Allow public insert on leads" 
ON public.leads 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow only authenticated admins to read leads
CREATE POLICY "Allow authenticated select on leads" 
ON public.leads 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow only authenticated admins to delete leads
CREATE POLICY "Allow authenticated delete on leads" 
ON public.leads 
FOR DELETE 
TO authenticated 
USING (true);

-- Fix function search_path mutable warning by strictly defining search_path
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
