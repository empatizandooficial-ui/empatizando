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
import { Loader2, ArrowLeft, QrCode, CreditCard, Banknote } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [pixData, setPixData] = useState<{ qrCode: string, payload: string } | null>(null);

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
      phone: ""
    }
  });

  const total = cartTotal;

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
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-12">
          <h2 className="text-2xl font-semibold mb-4">Seu carrinho está vazio</h2>
          <Button onClick={() => navigate("/loja")}>Voltar para a Loja</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
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
                  <CardHeader><CardTitle>Seus Dados</CardTitle></CardHeader>
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

                <Card>
                  <CardHeader><CardTitle>Forma de Pagamento</CardTitle></CardHeader>
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
          </div>

          {/* Resumo do Pedido */}
          <div>
            <Card className="sticky top-24">
              <CardHeader><CardTitle>Resumo do Pedido</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.quantity}x {item.title}</span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                
                {!pixData && (
                  <Button 
                    type="submit" 
                    form="checkout-form" 
                    className="w-full mt-6" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Finalizar Compra
                  </Button>
                )}
                <div className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                  <CreditCard className="w-3 h-3" /> Pagamento Seguro via Asaas
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
