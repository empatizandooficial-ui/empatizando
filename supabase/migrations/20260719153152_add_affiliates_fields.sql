ALTER TABLE public.affiliates ADD COLUMN full_name TEXT;
ALTER TABLE public.affiliates ADD COLUMN terms_accepted BOOLEAN DEFAULT false;
