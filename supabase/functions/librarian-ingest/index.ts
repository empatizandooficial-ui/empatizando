import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { content, source } = await req.json()

    if (!content) {
      throw new Error("Conteúdo não pode estar vazio")
    }

    // 1. Aqui entrará a lógica de buscar a chave da OpenAI no system_settings
    // 2. Chamar a API de embeddings da OpenAI para vetorizar o "content"
    // 3. Salvar no Supabase na tabela knowledge_base com o embedding gerado

    return new Response(
      JSON.stringify({ success: true, message: "Conhecimento absorvido (Mock)" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
