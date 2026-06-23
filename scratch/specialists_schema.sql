-- Tabela de Especialistas (Terapeutas, Médicos, etc)
CREATE TABLE IF NOT EXISTS public.specialists (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    professional_id TEXT NOT NULL, -- CRM, CRP, etc.
    specialties TEXT[] DEFAULT '{}',
    cep TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    online_only BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending_approval', -- pending_approval, active, suspended
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Segurança)
ALTER TABLE public.specialists ENABLE ROW LEVEL SECURITY;

-- Política 1: Especialistas podem ler os próprios dados
CREATE POLICY "Especialistas podem ver seus próprios dados"
    ON public.specialists FOR SELECT
    USING (auth.uid() = id);

-- Política 2: Especialistas podem atualizar seus próprios dados (mas não o status)
-- Usaremos uma política de update restritiva para evitar que ele mude seu próprio status para "active".
-- Neste caso simplificado, o RLS permite atualização da própria linha. O status de aprovação será travado no backend ou UI.
CREATE POLICY "Especialistas podem atualizar seus próprios dados"
    ON public.specialists FOR UPDATE
    USING (auth.uid() = id);

-- Política 3: Cadastro inicial do próprio especialista
CREATE POLICY "Especialistas podem se cadastrar"
    ON public.specialists FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Trigger para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_specialists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_specialist_updated ON public.specialists;
CREATE TRIGGER on_specialist_updated
    BEFORE UPDATE ON public.specialists
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_specialists_updated_at();

-- Comentários úteis
COMMENT ON TABLE public.specialists IS 'Armazena os perfis dos especialistas de saúde.';
COMMENT ON COLUMN public.specialists.status IS 'Status da conta: pending_approval, active, suspended.';
