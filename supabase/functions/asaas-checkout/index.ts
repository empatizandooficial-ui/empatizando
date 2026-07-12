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

    const { cart, customer, paymentMethod } = await req.json()

    if (!cart || cart.length === 0) {
      throw new Error("Carrinho vazio")
    }

    const { data: settingsData } = await supabaseClient
      .from('system_settings')
      .select('key_value')
      .eq('key_name', 'asaas_api_key')
      .limit(1)
      .single()

    const asaasApiKey = settingsData?.key_value
    if (!asaasApiKey) {
      throw new Error("Asaas API Key não configurada no Laboratório Neural")
    }

    const isSandbox = asaasApiKey.includes('sandbox') || asaasApiKey.startsWith('$aact_YTU5Y')
    const ASAAS_URL = isSandbox 
      ? 'https://sandbox.asaas.com/api/v3'
      : 'https://api.asaas.com/v3'

    let asaasCustomerId = ""
    
    const searchRes = await fetch(`${ASAAS_URL}/customers?cpfCnpj=${customer.cpf}`, {
      method: 'GET',
      headers: {
        'access_token': asaasApiKey,
        'Content-Type': 'application/json'
      }
    })
    
    if (searchRes.ok) {
      const searchData = await searchRes.json()
      if (searchData.data && searchData.data.length > 0) {
        asaasCustomerId = searchData.data[0].id
      }
    }

    if (!asaasCustomerId) {
      const createRes = await fetch(`${ASAAS_URL}/customers`, {
        method: 'POST',
        headers: {
          'access_token': asaasApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: customer.name,
          cpfCnpj: customer.cpf,
          email: customer.email,
          phone: customer.phone,
        })
      })
      const createData = await createRes.json()
      if (!createRes.ok) throw new Error("Erro ao criar cliente no Asaas: " + JSON.stringify(createData))
      asaasCustomerId = createData.id
    }

    const totalValue = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)
    const billingType = paymentMethod === 'CREDIT_CARD' ? 'CREDIT_CARD' : (paymentMethod === 'BOLETO' ? 'BOLETO' : 'PIX')
    
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 1)

    const paymentPayload: any = {
      customer: asaasCustomerId,
      billingType: billingType,
      value: totalValue,
      dueDate: dueDate.toISOString().split('T')[0],
      description: `Pedido na Loja Empatizando`,
      externalReference: `req_${Date.now()}`
    }

    if (billingType === 'CREDIT_CARD') {
      paymentPayload.creditCard = customer.creditCard
      paymentPayload.creditCardHolderInfo = customer.creditCardHolderInfo
    }

    const payRes = await fetch(`${ASAAS_URL}/payments`, {
      method: 'POST',
      headers: {
        'access_token': asaasApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentPayload)
    })
    
    const payData = await payRes.json()
    if (!payRes.ok) throw new Error("Erro ao gerar cobrança: " + JSON.stringify(payData))

    const asaasPaymentId = payData.id
    let invoiceUrl = payData.invoiceUrl
    
    let pixQrCode = null
    let pixPayload = null
    if (billingType === 'PIX') {
      const qrRes = await fetch(`${ASAAS_URL}/payments/${asaasPaymentId}/pixQrCode`, {
        method: 'GET',
        headers: {
          'access_token': asaasApiKey
        }
      })
      if (qrRes.ok) {
        const qrData = await qrRes.json()
        pixQrCode = qrData.encodedImage
        pixPayload = qrData.payload
      }
    }

    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .insert([
        { 
          status: 'pending', 
          total_amount: totalValue,
          asaas_payment_id: asaasPaymentId,
          user_id: customer.user_id || null,
          affiliate_id: customer.affiliate_id || null
        }
      ])
      .select()
      .single()

    if (orderError) throw orderError

    const itemsPayload = cart.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price
    }))

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(itemsPayload)

    if (itemsError) throw itemsError
    
    await fetch(`${ASAAS_URL}/payments/${asaasPaymentId}`, {
      method: 'POST',
      headers: {
        'access_token': asaasApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ externalReference: orderData.id })
    })

    return new Response(
      JSON.stringify({ 
        orderId: orderData.id, 
        asaasPaymentId, 
        invoiceUrl,
        pixQrCode,
        pixPayload,
        status: 'pending'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
