-- Adicionar coluna user_id na tabela social_posts para segurança (identifica o dono do post)
ALTER TABLE public.social_posts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Adicionar suporte ao YouTube Shorts
ALTER TABLE public.social_posts ADD COLUMN IF NOT EXISTS post_youtube BOOLEAN DEFAULT false;
ALTER TABLE public.social_posts ADD COLUMN IF NOT EXISTS caption_youtube TEXT;

-- Remover as políticas antigas que eram muito genéricas ("USING (true)")
DROP POLICY IF EXISTS "Allow authenticated read" ON public.social_posts;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.social_posts;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.social_posts;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.social_posts;

-- Criar políticas rigorosas: O usuário SÓ PODE LER e ALTERAR os posts que ELE MESMO CRIOU
CREATE POLICY "Users can read own posts" ON public.social_posts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own posts" ON public.social_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.social_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.social_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Corrigir a segurança do Storage (Bucket social_media_assets)
-- Apenas usuários autenticados podem ver os arquivos
DROP POLICY IF EXISTS "Public read on assets" ON storage.objects;
CREATE POLICY "Auth read on assets" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'social_media_assets');

-- Permitir que apenas o dono do arquivo possa deletar e alterar o seu próprio arquivo no Storage
CREATE POLICY "Auth delete on own assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'social_media_assets' AND auth.uid() = owner);
CREATE POLICY "Auth update on own assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'social_media_assets' AND auth.uid() = owner);
