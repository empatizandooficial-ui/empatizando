import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { title, description } = await req.json()
    
    if (!title) {
      return new Response(JSON.stringify({ error: 'Title is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get system settings for the user
    const { data: settings, error: settingsError } = await supabaseClient
      .from('system_settings')
      .select('key_name, key_value')
      .in('key_name', ['gemini_api_key', 'gemini_model'])

    if (settingsError) {
      console.error("Settings error:", settingsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch settings' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    let gemini_api_key = Deno.env.get('GEMINI_API_KEY')
    let gemini_model = 'gemini-3.5-flash'

    if (settings) {
       const keySetting = settings.find((s: any) => s.key_name === 'gemini_api_key')
       if (keySetting && keySetting.key_value) gemini_api_key = keySetting.key_value

       const modelSetting = settings.find((s: any) => s.key_name === 'gemini_model')
       if (modelSetting && modelSetting.key_value) {
         gemini_model = modelSetting.key_value;
       }
    }
    
    if (!gemini_api_key) {
      return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const prompt = `
Você é um especialista em E-commerce e Copywriting.
Dado o seguinte produto:
Título: ${title}
Descrição: ${description || 'N/A'}

Crie conteúdos otimizados para e-commerce. Retorne ESTRITAMENTE um JSON no seguinte formato:
{
  "seo_title": "...",
  "seo_description": "...",
  "enriched_description": "...",
  "tags": ["tag1", "tag2"]
}
`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${gemini_model}:generateContent?key=${gemini_api_key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return new Response(JSON.stringify({ error: 'Failed to call Gemini API', details: errorText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const geminiData = await response.json()
    const textOutput = geminiData.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!textOutput) {
      throw new Error("Invalid response from Gemini API");
    }

    let result;
    try {
      result = JSON.parse(textOutput);
    } catch (parseError) {
      const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      result = JSON.parse(cleaned);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error("Internal error:", error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
