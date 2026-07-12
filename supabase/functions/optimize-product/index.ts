import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Tratamento de CORS para chamadas diretas (opcional)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const record = payload.record // O produto recém inserido

    // Se já foi otimizado ou não houver nome, aborta para não gerar loop
    if (!record || record.is_ai_optimized || !record.name) {
      return new Response(JSON.stringify({ message: "Produto já otimizado ou sem nome" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Tentar pegar do banco de dados (Painel Admin)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: setting } = await supabaseClient
      .from('system_settings')
      .select('key_value')
      .eq('key_name', 'gemini_api_key')
      .single()

    const geminiApiKey = setting?.key_value || Deno.env.get('GEMINI_API_KEY')
    
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY não configurada no Painel Admin (Laboratório Neural).")
    }

    // Prompt Estruturado para o Gemini
    const prompt = `
Você é um Especialista de SEO e Copywriter de E-commerce de altíssima conversão.
Recebi o cadastro de um produto simples. O nome é: "${record.name}".
A descrição básica fornecida foi: "${record.description || ''}".

Aja como um especialista em produtos para o público neurodivergente (Autismo, TDAH) e terapeutas. 
Gere os seguintes dados em formato estrito JSON, sem usar blocos de código (\`\`\`) e sem texto extra.

Estrutura do JSON Esperada:
{
  "seo_title": "O título ideal para ranquear no Google (max 60 caracteres)",
  "seo_description": "A meta description perfeita para o Google (max 160 caracteres)",
  "rich_description": "Uma descrição expandida, persuasiva, focada em benefícios, usando gatilhos emocionais, ideal para a página de vendas. Use algumas tags HTML básicas (<br>, <strong>).",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}
`

    // Chamada à API do Google Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })

    const data = await response.json()
    let aiResponseText = data.candidates[0].content.parts[0].text
    
    // Limpar markdown de json se houver
    aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim()
    
    const optimizedData = JSON.parse(aiResponseText)

    // Atualizar no Banco de Dados
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Service role para ter permissão de admin
    )

    const { error } = await supabaseClient
      .from('products')
      .update({
        seo_title: optimizedData.seo_title,
        seo_description: optimizedData.seo_description,
        description: optimizedData.rich_description,
        tags_json: optimizedData.tags,
        is_ai_optimized: true
      })
      .eq('id', record.id)

    if (error) throw error

    return new Response(JSON.stringify({ success: true, data: optimizedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
