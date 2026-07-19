import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowLeft, QrCode, CreditCard, Banknote, ShieldCheck, Truck } from "lucide-react";
import logo from "@/assets/logo.png";
import { TrustBadges } from "@/components/TrustBadges";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [pixData, setPixData] = useState<{ qrCode: string, payload: string } | null>(null);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const [cep, setCep] = useState("");
  const [shippingAddress, setShippingAddress] = useState<any>(null);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    cpf: "",
    email: "",
    phone: "",
    creditCard: {
      holderName: "",
      number: "",
      expiryMonth: "",
      expiryYear: "",
      ccv: ""
    },
    creditCardHolderInfo: {
      name: "",
      email: "",
      cpfCnpj: "",
      postalCode: "",
      addressNumber: "",
    }
  });

  const total = cartTotal + (shippingCost || 0);

  const handleCalculateShipping = async () => {
    if (cep.replace(/\D/g, '').length !== 8) {
      toast({ title: "CEP inválido", variant: "destructive" });
      return;
    }
    setCalculatingShipping(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
      const data = await res.json();
      if (data.erro) throw new Error("CEP não encontrado");
      
      setShippingAddress(data);
      
      const ids = cart.map(item => item.product_id || item.id);
      const { data: productsData } = await supabase.from('products').select('id, weight_kg').in('id', ids);
      
      const payloadProducts = cart.map(item => {
        const actualProductId = item.product_id || item.id;
        const prod = productsData?.find(p => p.id === actualProductId);
        return {
          id: actualProductId,
          product_id: item.product_id || item.id,
          quantity: item.quantity,
          price_at_time: item.price,
          product_name: item.variant_sku ? `${item.title} (${item.variant_sku})${item.custom_text ? ' - Detalhes: ' + item.custom_text : ''}` : item.title + (item.custom_text ? ' - Detalhes: ' + item.custom_text : ''),
          weight_kg: prod?.weight_kg || 0.3
        }
      });

      const { data: quoteData, error } = await supabase.functions.invoke('melhorenvio-quote', {
        body: { to_cep: cep, products: payloadProducts }
      });
      
      if (error) throw error;
      if (!quoteData || quoteData.length === 0 || quoteData.error) {
        throw new Error("Nenhuma transportadora disponível para este CEP.");
      }

      const cheapest = quoteData.reduce((prev: any, curr: any) => parseFloat(prev.price) < parseFloat(curr.price) ? prev : curr);
      
      setShippingCost(parseFloat(cheapest.price));
      toast({ title: `Frete calculado: ${data.localidade}/${data.uf}`, description: `Via MelhorEnvio (${cheapest.name})` });
    } catch (err: any) {
      toast({ title: "Erro ao buscar CEP ou calcular frete", description: err.message, variant: "destructive" });
    } finally {
      setCalculatingShipping(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const affiliateId = localStorage.getItem('affiliate_id') || null;

      const { data, error } = await supabase.functions.invoke('asaas-checkout', {
        body: {
          cart,
          customer: {
            ...customer,
            affiliate_id: affiliateId
          },
          paymentMethod
        }
      });

      if (error) throw error;

      if (paymentMethod === "PIX" && data.pixQrCode) {
        setPixData({ qrCode: data.pixQrCode, payload: data.pixPayload });
        toast({ title: "PIX gerado com sucesso!" });
      } else if (data.invoiceUrl) {
        window.location.href = data.invoiceUrl; // Redireciona para o boleto/fatura Asaas
      } else {
        toast({ title: "Pedido processado!" });
        clearCart();
        navigate("/loja");
      }
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro no pagamento", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !pixData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white border-b py-4 px-6 flex justify-center items-center shadow-sm">
          <img src={logo} alt="Empatizando" className="h-8 w-8 mr-2 rounded-full" />
          <span className="font-heading font-bold text-xl text-primary">Empatizando Checkout</span>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-12">
          <h2 className="text-2xl font-semibold mb-4">Seu carrinho está vazio</h2>
          <Button onClick={() => navigate("/loja")}>Voltar para a Loja</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b py-4 px-6 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center">
          <img src={logo} alt="Empatizando" className="h-8 w-8 mr-2 rounded-full" />
          <span className="font-heading font-bold text-xl text-primary hidden sm:inline-block">Empatizando Checkout</span>
        </div>
        <div className="flex items-center text-sm font-medium text-slate-500 gap-2">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          Ambiente 100% Seguro
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate("/loja")} className="mb-6 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a Loja
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Formulário */}
          <div className="md:col-span-2 space-y-6">
            {pixData ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <QrCode /> Pagamento via PIX
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <p className="text-center text-muted-foreground">Escaneie o QRCode abaixo com o app do seu banco:</p>
                  <img src={`data:image/jpeg;base64,${pixData.qrCode}`} alt="PIX QRCode" className="w-64 h-64 border rounded-xl shadow-sm" />
                  <div className="w-full">
                    <Label>Código Copia e Cola:</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={pixData.payload} readOnly />
                      <Button onClick={() => {
                        navigator.clipboard.writeText(pixData.payload);
                        toast({ title: "Código copiado!" });
                      }}>Copiar</Button>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" onClick={() => { clearCart(); navigate("/loja"); }}>
                    Já realizei o pagamento
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="w-5 h-5 text-indigo-500"/> 1. Entrega</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2 items-end">
                      <div className="space-y-2 flex-1">
                        <Label>CEP de Destino</Label>
                        <Input placeholder="00000-000" value={cep} onChange={(e) => setCep(e.target.value)} maxLength={9} />
                      </div>
                      <Button type="button" onClick={handleCalculateShipping} disabled={calculatingShipping} className="bg-indigo-600 hover:bg-indigo-700">
                        {calculatingShipping ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calcular Frete"}
                      </Button>
                    </div>
                    {shippingCost !== null && shippingAddress && (
                      <div className="p-4 bg-slate-100/80 rounded-lg text-sm flex justify-between items-center border border-slate-200">
                        <div>
                          <strong className="text-indigo-700">Correios PAC</strong> (7 a 12 dias úteis)<br/>
                          <span className="text-slate-600">
                            {shippingAddress.logradouro}, {shippingAddress.bairro} <br/> 
                            {shippingAddress.localidade}/{shippingAddress.uf}
                          </span>
                        </div>
                        <div className="font-bold text-lg text-slate-800">
                          R$ {shippingCost.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className={shippingCost === null ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
                  <CardHeader><CardTitle>2. Seus Dados</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nome Completo</Label>
                      <Input required value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>CPF</Label>
                        <Input required value={customer.cpf} onChange={e => setCustomer({...customer, cpf: e.target.value})} placeholder="000.000.000-00" />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input required value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} placeholder="(00) 00000-0000" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" required value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} />
                    </div>
                  </CardContent>
                </Card>

                <Card className={shippingCost === null ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
                  <CardHeader><CardTitle>3. Forma de Pagamento</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PIX"><div className="flex items-center gap-2"><QrCode className="h-4 w-4"/> PIX</div></SelectItem>
                        <SelectItem value="CREDIT_CARD"><div className="flex items-center gap-2"><CreditCard className="h-4 w-4"/> Cartão de Crédito</div></SelectItem>
                        <SelectItem value="BOLETO"><div className="flex items-center gap-2"><Banknote className="h-4 w-4"/> Boleto</div></SelectItem>
                      </SelectContent>
                    </Select>

                    {paymentMethod === "CREDIT_CARD" && (
                      <div className="pt-4 border-t space-y-4">
                        <div className="space-y-2">
                          <Label>Número do Cartão</Label>
                          <Input required value={customer.creditCard.number} onChange={e => setCustomer({...customer, creditCard: {...customer.creditCard, number: e.target.value}})} />
                        </div>
                        <div className="space-y-2">
                          <Label>Nome Impresso no Cartão</Label>
                          <Input required value={customer.creditCard.holderName} onChange={e => setCustomer({...customer, creditCard: {...customer.creditCard, holderName: e.target.value}})} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Mês (MM)</Label>
                            <Input required maxLength={2} value={customer.creditCard.expiryMonth} onChange={e => setCustomer({...customer, creditCard: {...customer.creditCard, expiryMonth: e.target.value}})} />
                          </div>
                          <div className="space-y-2">
                            <Label>Ano (AAAA)</Label>
                            <Input required maxLength={4} value={customer.creditCard.expiryYear} onChange={e => setCustomer({...customer, creditCard: {...customer.creditCard, expiryYear: e.target.value}})} />
                          </div>
                          <div className="space-y-2">
                            <Label>CVV</Label>
                            <Input required maxLength={4} value={customer.creditCard.ccv} onChange={e => setCustomer({...customer, creditCard: {...customer.creditCard, ccv: e.target.value}})} />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </form>
            )}
            
            <div className="pt-8">
              <TrustBadges />
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div>
            <Card className="sticky top-24 shadow-lg border-primary/10">
              <CardHeader><CardTitle>Resumo do Pedido</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">{item.quantity}x {item.title} {item.variant_sku && <span className="text-xs text-slate-500 font-normal">({item.variant_sku})</span>}</span>
                        {item.custom_text && <span className="text-xs text-indigo-600 italic">Detalhes: {item.custom_text}</span>}
                      </div>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                {shippingCost !== null && (
                  <div className="flex justify-between text-sm text-slate-600 py-2 border-b">
                    <span>Frete (PAC)</span>
                    <span>R$ {shippingCost.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="pt-2 flex justify-between font-bold text-xl text-primary">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                
                {!pixData && (
                  <>
                    <div className="flex items-center space-x-2 mt-6 mb-2 bg-slate-100 p-3 rounded-md border border-slate-200">
                      <Checkbox 
                        id="terms" 
                        checked={acceptedPolicy} 
                        onCheckedChange={(checked) => setAcceptedPolicy(checked as boolean)} 
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700"
                      >
                        Declaro que li e concordo com a <a href="/exchange-policy" target="_blank" className="text-indigo-600 hover:underline font-semibold">Política de Trocas e Devoluções</a>
                      </label>
                    </div>
                    <Button 
                      type="submit" 
                      form="checkout-form" 
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold h-14 text-lg rounded-xl shadow-lg hover:shadow-green-500/20 transition-all" 
                      size="lg"
                      disabled={loading || shippingCost === null || !acceptedPolicy}
                    >
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                      Confirmar e Pagar
                    </Button>
                  </>
                )}
                <div className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                  <CreditCard className="w-3 h-3" /> Pagamento Seguro via Asaas
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
