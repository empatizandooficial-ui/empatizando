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
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { query } = await req.json()
    if (!query) {
      throw new Error("A query não pode estar vazia")
    }

    // 1. Instanciar Supabase Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error("Usuário não autenticado")
    }

    // 2. Buscar configurações (Tavily e OpenAI API Key)
    const { data: settingsData, error: settingsError } = await supabaseClient
      .from('system_settings')
      .select('key_name, key_value')
      .eq('user_id', user.id)

    if (settingsError || !settingsData) {
      throw new Error("Erro ao buscar configurações do sistema.")
    }

    const settingsMap: Record<string, string> = {}
    settingsData.forEach(s => { settingsMap[s.key_name] = s.key_value })

    let tavilyApiKey = settingsMap['tavily_api_key']
    const openaiApiKey = settingsMap['openai_api_key']

    let finalAnswer = ""
    let results: any[] = []

    // 3. Executar Busca
    if (tavilyApiKey) {
      // Usa Tavily API
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: tavilyApiKey,
          query: query,
          search_depth: "advanced",
          include_answer: true,
          include_raw_content: false,
          max_results: 5
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`Erro na API Tavily: ${errText}`)
      }

      const data = await response.json()
      finalAnswer = data.answer || "Resumo não disponível."
      results = data.results || []
    } else if (openaiApiKey) {
      // Fallback para OpenAI simulando uma busca se Tavily não existir
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Você é um agente OSINT especialista (Hermes). O usuário buscará um termo. Responda simulando um resultado de pesquisa web com um Resumo e 3 links fictícios, retornando tudo em formato JSON. Formato esperado: { "answer": "resumo...", "results": [ { "title": "titulo", "url": "url", "content": "resumo" } ] }' },
            { role: 'user', content: query }
          ],
          response_format: { type: "json_object" }
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`Erro OpenAI Fallback: ${errText}`)
      }

      const data = await response.json()
      const parsedData = JSON.parse(data.choices[0].message.content)
      finalAnswer = parsedData.answer || "Resumo não disponível."
      results = parsedData.results || []
    } else {
      throw new Error("Nenhuma API configurada. Cadastre a Chave do Tavily ou OpenAI nas configurações.")
    }

    return new Response(
      JSON.stringify({
        success: true,
        answer: finalAnswer,
        results: results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    console.error("Erro na busca OSINT:", error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
