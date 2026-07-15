-- Revoke the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view answered questions" ON public.product_questions;

-- Create a secure view for the public that excludes user_id
CREATE OR REPLACE VIEW public.public_product_questions AS
SELECT id, product_id, question, answer, answered_at, created_at
FROM public.product_questions
WHERE answer IS NOT NULL;

-- Grant access to the view
GRANT SELECT ON public.public_product_questions TO anon, authenticated;
