-- Create knowledge_base table
CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('book', 'video', 'article', 'documentary', 'other')),
    title TEXT NOT NULL,
    content TEXT,
    summary TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own knowledge base" 
ON public.knowledge_base 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);
