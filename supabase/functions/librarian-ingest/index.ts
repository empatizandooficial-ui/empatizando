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
    // --- Authentication ---
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const token = authHeader.replace('Bearer ', '')
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { content, source } = await req.json()

    if (!content || typeof content !== 'string' || content.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Conteúdo não pode estar vazio' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Pega o token do header de Authorization que o cliente React envia
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error("Nenhum token de autorização fornecido")
    }

    // Inicializa o cliente Supabase com o token do usuário para respeitar o RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Confirma quem é o usuário logado
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error("Usuário não autenticado")
    }

    // Busca a chave da OpenAI no banco de dados do usuário
    const { data: settingsData, error: settingsError } = await supabaseClient
      .from('system_settings')
      .select('key_value')
      .eq('key_name', 'openai_api_key')
      .eq('user_id', user.id)
      .single()

    if (settingsError || !settingsData?.key_value) {
      throw new Error("Chave da OpenAI não configurada. Por favor, configure no Painel de Configurações.")
    }

    const openAiApiKey = settingsData.key_value

    // Chama a API da OpenAI para gerar o Embedding (usando o modelo padrão text-embedding-3-small, que gera vetor de 1536)
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: content,
        model: 'text-embedding-3-small',
      }),
    })

    if (!embeddingResponse.ok) {
      const errText = await embeddingResponse.text()
      throw new Error(`Erro na OpenAI: ${errText}`)
    }

    const embeddingData = await embeddingResponse.json()
    const embedding = embeddingData.data[0].embedding

    // Salva o conteúdo e o vetor no banco de dados
    const { error: insertError } = await supabaseClient
      .from('knowledge_base')
      .insert({
        user_id: user.id,
        content: content,
        embedding: embedding,
        metadata: { source: source || "Manual Ingestion", ingested_at: new Date().toISOString() }
      })

    if (insertError) {
      throw new Error(`Erro ao salvar no banco: ${insertError.message}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: "Conhecimento absorvido e vetorizado com sucesso!" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    console.error("Erro na ingestão:", error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
