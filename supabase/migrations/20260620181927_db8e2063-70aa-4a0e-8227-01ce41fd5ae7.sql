
-- 1. system_settings: enforce non-null user_id and explicit policies (no NULL/global rows accessible)
ALTER TABLE public.system_settings ALTER COLUMN user_id SET NOT NULL;
DROP POLICY IF EXISTS "Users can manage their own settings" ON public.system_settings;
CREATE POLICY "Users can select their own settings" ON public.system_settings
  FOR SELECT TO authenticated USING (auth.uid() = user_id AND user_id IS NOT NULL);
CREATE POLICY "Users can insert their own settings" ON public.system_settings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);
CREATE POLICY "Users can update their own settings" ON public.system_settings
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);
CREATE POLICY "Users can delete their own settings" ON public.system_settings
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 2. leads table: remove always-true RLS policies, restrict to authenticated with proper scoping
DROP POLICY IF EXISTS "Allow public insert on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated delete on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated select on leads" ON public.leads;
REVOKE INSERT ON public.leads FROM anon;
CREATE POLICY "Authenticated can read leads" ON public.leads
  FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can insert leads" ON public.leads
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can delete leads" ON public.leads
  FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- 3. Fix mutable search_path on match_documents function
CREATE OR REPLACE FUNCTION public.match_documents(
  query_embedding vector,
  match_threshold double precision,
  match_count integer,
  p_user_id uuid
)
RETURNS TABLE(id uuid, content text, metadata jsonb, similarity double precision)
LANGUAGE sql
STABLE
SET search_path = public
AS $function$
  SELECT
    knowledge_base.id,
    knowledge_base.content,
    knowledge_base.metadata,
    1 - (knowledge_base.embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE knowledge_base.user_id = p_user_id
    AND 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_base.embedding <=> query_embedding
  LIMIT match_count;
$function$;

-- 4. Move pgvector extension out of public schema
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;
ALTER EXTENSION vector SET SCHEMA extensions;
