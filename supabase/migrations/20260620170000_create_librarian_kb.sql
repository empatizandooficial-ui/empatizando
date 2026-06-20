-- Habilita a extensão pgvector se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- Tabela para armazenar os documentos e o conhecimento do Bibliotecário
CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adiciona as colunas caso a tabela já existisse sem elas
ALTER TABLE public.knowledge_base ADD COLUMN IF NOT EXISTS embedding vector(1536);
ALTER TABLE public.knowledge_base ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- RLS para knowledge_base
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own knowledge base" 
ON public.knowledge_base FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own knowledge base" 
ON public.knowledge_base FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own knowledge base" 
ON public.knowledge_base FOR DELETE 
USING (auth.uid() = user_id);

-- Função de Busca de Similaridade (Match Documents)
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_user_id uuid
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql STABLE
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
