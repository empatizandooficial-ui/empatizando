import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { to_cep, products } = await req.json()

    if (!to_cep || !products || products.length === 0) {
      throw new Error("CEP de destino ou produtos não informados.")
    }

    const { data: tokenData } = await supabaseClient
      .from('system_settings')
      .select('key_value')
      .eq('key_name', 'melhorenvio_api_token')
      .single()

    const { data: cepData } = await supabaseClient
      .from('system_settings')
      .select('key_value')
      .eq('key_name', 'origin_cep')
      .single()

    const apiToken = tokenData?.key_value
    const originCep = cepData?.key_value

    if (!apiToken || !originCep) {
      // Mock Data para testes e fluxo sem token
      const mockServices = [
        { id: 1, name: "Correios PAC", price: "18.50", delivery_time: 7 },
        { id: 2, name: "Correios Sedex", price: "35.90", delivery_time: 3 }
      ]
      return new Response(
        JSON.stringify(mockServices),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const payload = {
      from: {
        postal_code: originCep.replace(/\D/g, '')
      },
      to: {
        postal_code: to_cep.replace(/\D/g, '')
      },
      products: products.map((p: any) => ({
        id: p.id || '1',
        width: p.width || 11,
        height: p.height || 5,
        length: p.length || 16,
        weight: p.weight_kg || 0.3,
        insurance_value: p.price || 0,
        quantity: p.quantity || 1
      }))
    }

    const isSandbox = apiToken.includes('eyJ0eXAiOiJKV1Qi') || apiToken.length > 500 // Simplificação para identificar JWT sandbox
    const url = 'https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
        'User-Agent': 'Empatizando (contato@empatizando.com)' // O MelhorEnvio exige um User-Agent válido
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error("Erro na API do MelhorEnvio: " + JSON.stringify(data))
    }

    const validServices = Array.isArray(data) ? data.filter(s => !s.error) : []

    return new Response(
      JSON.stringify(validServices),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
