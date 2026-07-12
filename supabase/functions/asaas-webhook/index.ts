import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Pegar o Token Webhook configurado no Laboratório Neural
    const { data: settingsData } = await supabaseClient
      .from('system_settings')
      .select('key_value')
      .eq('key_name', 'asaas_webhook_token')
      .limit(1)
      .single()

    const asaasWebhookToken = settingsData?.key_value
    
    // 2. Validar o Header Asaas-Access-Token se tivermos token configurado
    if (asaasWebhookToken) {
      const headerToken = req.headers.get('asaas-access-token')
      if (headerToken !== asaasWebhookToken) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      }
    }

    const payload = await req.json()
    
    // 3. Processar Evento de Pagamento Recebido
    if (payload.event === 'PAYMENT_RECEIVED' || payload.event === 'PAYMENT_CONFIRMED') {
      const payment = payload.payment
      const orderId = payment.externalReference

      if (orderId) {
        // Atualizar o status do pedido para paid
        const { error } = await supabaseClient
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', orderId)
          
        if (error) {
          console.error("Erro ao atualizar pedido:", error)
          throw error
        }
        
        // Aqui o gatilho (trigger) do banco de dados disparará a comissão do afiliado
      }
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error("Erro no webhook:", error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
