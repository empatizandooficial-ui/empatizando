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

    const { prompt, platforms } = await req.json()

    if (!prompt) {
      throw new Error("O prompt não pode estar vazio")
    }

    // 1. Obter JWT e instanciar cliente Supabase
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error("Nenhum token de autorização fornecido")
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error("Usuário não autenticado")
    }

    // 2. Buscar configurações do usuário
    const { data: settingsData, error: settingsError } = await supabaseClient
      .from('system_settings')
      .select('key_name, key_value')
      .eq('user_id', user.id)

    if (settingsError || !settingsData) {
      throw new Error("Erro ao buscar configurações do sistema.")
    }

    const settingsMap: Record<string, string> = {}
    settingsData.forEach(s => { settingsMap[s.key_name] = s.key_value })

    const openAiApiKey = settingsMap['openai_api_key']
    const systemPrompt = settingsMap['thoth_system_prompt'] || 'Você é um roteirista especializado em mídias sociais.'
    const thothModel = settingsMap['thoth_model'] || 'gpt-4o-mini' // Fallback caso não esteja preenchido

    if (!openAiApiKey) {
      throw new Error("Chave da OpenAI não configurada. Configure no Painel do Laboratório Neural.")
    }

    // 3. Vetorizar o prompt para buscar contexto no Bibliotecário
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: prompt,
        model: 'text-embedding-3-small',
      }),
    })

    if (!embeddingResponse.ok) {
      const errText = await embeddingResponse.text()
      throw new Error(`Erro OpenAI Embeddings: ${errText}`)
    }

    const embeddingData = await embeddingResponse.json()
    const queryEmbedding = embeddingData.data[0].embedding

    // 4. Buscar contexto via RPC match_documents
    const { data: contextDocs, error: matchError } = await supabaseClient.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.70, // 70% de similaridade mínima
      match_count: 5,
      p_user_id: user.id
    })

    if (matchError) {
      console.error("Erro na busca de contexto:", matchError)
      // Continuamos sem contexto em caso de falha silenciosa para não quebrar a geração
    }

    let librarianContext = ""
    if (contextDocs && contextDocs.length > 0) {
      librarianContext = "\n\nCONTEXTO RECUPERADO DA BASE DE CONHECIMENTO:\n"
      contextDocs.forEach((doc: any, index: number) => {
        librarianContext += `[Documento ${index + 1}]: ${doc.content}\n\n`
      })
    }

    // 5. Chamar a IA (Thoth) para gerar o roteiro
    // Pedimos explicitamente formato JSON
    const finalSystemPrompt = `${systemPrompt}

Você deve gerar roteiros para as plataformas solicitadas: ${platforms ? platforms.join(', ') : 'Instagram, TikTok, YouTube'}.
Você DEVE retornar a resposta EXATAMENTE no formato JSON abaixo, com as chaves para cada plataforma.
Exemplo de retorno esperado:
{
  "instagram": "Seu roteiro para Instagram aqui...",
  "tiktok": "Seu roteiro para TikTok aqui...",
  "youtube": "Seu roteiro para YouTube aqui..."
}
Não inclua nenhum texto antes ou depois do JSON.`

    const finalUserPrompt = `${prompt}${librarianContext}`

    const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: thothModel.includes('gpt-') ? thothModel : 'gpt-4o-mini', // Evita tentar usar claude na openai api
        messages: [
          { role: 'system', content: finalSystemPrompt },
          { role: 'user', content: finalUserPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    })

    if (!chatResponse.ok) {
      const errText = await chatResponse.text()
      throw new Error(`Erro OpenAI Chat: ${errText}`)
    }

    const chatData = await chatResponse.json()
    const generatedContent = JSON.parse(chatData.choices[0].message.content)

    return new Response(
      JSON.stringify({ 
        success: true, 
        instagram: generatedContent.instagram || "", 
        tiktok: generatedContent.tiktok || "",
        youtube: generatedContent.youtube || "",
        used_context_chunks: contextDocs ? contextDocs.length : 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    console.error("Erro na geração:", error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
