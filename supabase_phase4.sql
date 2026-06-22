-- Enable pgvector for Long-Term Memory
CREATE EXTENSION IF NOT EXISTS vector;

-- Enums
DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM ('Novo', 'Em Acompanhamento', 'Crítico', 'Encaminhado', 'Inativo');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Table: chat_sessions (Leads / Chats)
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id TEXT NOT NULL, -- e.g. 'lumina' or 'salvia'
    lead_name TEXT,
    lead_contact TEXT,
    status lead_status DEFAULT 'Novo',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: chat_messages (Live chat log)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: lead_memories (Long-Term Memory RAG)
CREATE TABLE IF NOT EXISTS public.lead_memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    embedding vector(1536), -- Assuming OpenAI ada-002 dimension
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_memories ENABLE ROW LEVEL SECURITY;

-- Policies for Admins only
-- (Assuming only authenticated users with admin privileges can access these in the CRM)
-- For public chat, Edge Functions use Service Role Key which bypasses RLS.
-- Frontend CRM uses anon key with authenticated user. We will restrict to authenticated users.

CREATE POLICY "Admins can manage chat_sessions" ON public.chat_sessions FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage chat_messages" ON public.chat_messages FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage lead_memories" ON public.lead_memories FOR ALL TO authenticated USING (true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_chat_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_chat_session_updated_at ON public.chat_sessions;
CREATE TRIGGER update_chat_session_updated_at
    BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW
    EXECUTE PROCEDURE update_chat_session_timestamp();
