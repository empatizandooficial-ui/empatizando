
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.match_documents(query_embedding extensions.vector, match_threshold double precision, match_count integer, p_user_id uuid)
RETURNS TABLE(id uuid, content text, metadata jsonb, similarity double precision)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, extensions
AS $$
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
$$;

DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
