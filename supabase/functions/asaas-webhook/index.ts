import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const asaasToken = Deno.env.get('ASAAS_WEBHOOK_TOKEN')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  // 1. Verify Asaas Webhook Token (Basic Security)
  const asaasHeaderToken = req.headers.get('asaas-access-token')
  if (asaasToken && asaasHeaderToken !== asaasToken) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const payload = await req.json()
    const { event, payment } = payload

    // 2. We only care about payments that are confirmed/received
    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      
      const supabase = createClient(supabaseUrl!, supabaseServiceKey!)
      
      // The asaas_payment_id in our DB should match payment.id
      const paymentId = payment.id

      // 3. Update the order status to 'paid'
      const { data: order, error: updateError } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('asaas_payment_id', paymentId)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating order:', updateError)
        return new Response('Error updating order', { status: 500 })
      }

      // 4. Trigger the commission RPC
      if (order && order.id) {
        const { error: rpcError } = await supabase.rpc('process_affiliate_commission', {
          order_id: order.id
        })
        
        if (rpcError) {
          console.error('Error processing commission:', rpcError)
          // We don't fail the webhook, but we log the error
        }
      }

      return new Response('Webhook processed successfully', { status: 200 })
    }

    // Ignore other events
    return new Response('Event ignored', { status: 200 })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Bad Request', { status: 400 })
  }
})
