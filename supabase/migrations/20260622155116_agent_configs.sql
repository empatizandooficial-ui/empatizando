CREATE TABLE IF NOT EXISTS public.agent_configurations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    model_provider TEXT DEFAULT 'openai',
    model_name TEXT DEFAULT 'gpt-4o',
    temperature FLOAT DEFAULT 0.7,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.agent_configurations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to read agent configs" ON public.agent_configurations;
CREATE POLICY "Allow authenticated users to read agent configs" ON public.agent_configurations FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to update agent configs" ON public.agent_configurations;
CREATE POLICY "Allow authenticated users to update agent configs" ON public.agent_configurations FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert agent configs" ON public.agent_configurations;
CREATE POLICY "Allow authenticated users to insert agent configs" ON public.agent_configurations FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to delete agent configs" ON public.agent_configurations;
CREATE POLICY "Allow authenticated users to delete agent configs" ON public.agent_configurations FOR DELETE TO authenticated USING (true);

-- Upsert initial agents
INSERT INTO public.agent_configurations (id, name, system_prompt, model_provider, model_name, temperature)
VALUES 
('lumina', 'Lumina (Triagem)', 'Você é Lumina, a guardiã do portal Empatizando. Sua missão é acolher visitantes de forma suave, compassiva e convidá-los a preencher a Anamnese.', 'openai', 'gpt-4o', 0.6),
('salvia', 'Sálvia (Terapias Holísticas)', 'Você é Sálvia, terapeuta holística do Empatizando. Você analisa as respostas da Anamnese e conduz os usuários numa jornada de cura integrada (Corpo, Mente e Alma).', 'openai', 'gpt-4o', 0.7)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    system_prompt = EXCLUDED.system_prompt,
    model_provider = EXCLUDED.model_provider,
    model_name = EXCLUDED.model_name,
    temperature = EXCLUDED.temperature;
