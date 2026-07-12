import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, ShieldCheck, Heart } from "lucide-react";

export default function Store() {
  const { toast } = useToast();
  const [size, setSize] = useState("padrao");
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);

  // Capture affiliate code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setAffiliateCode(ref);
      localStorage.setItem("empatizando_ref", ref);
    } else {
      const storedRef = localStorage.getItem("empatizando_ref");
      if (storedRef) setAffiliateCode(storedRef);
    }
  }, []);

  const handleCheckout = () => {
    // In a real scenario, this would redirect to Asaas checkout or open a modal
    toast({
      title: "Redirecionando para o Pagamento",
      description: `Tamanho: ${size === "padrao" ? "90x45cm" : "80x35cm"}. Afiliado: ${affiliateCode || "Nenhum"}`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Loja Oficial Empatizando</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Adesivos perfurados de alta visibilidade para o vidro traseiro. Proteja quem você ama e promova a empatia no trânsito.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Product Image Area */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center aspect-square">
            <div className="text-center text-slate-400 flex flex-col items-center">
              <Car className="w-24 h-24 mb-4 text-primary opacity-50" />
              <p>Imagem Ilustrativa do Adesivo</p>
            </div>
          </div>

          {/* Product Details Area */}
          <Card className="border-0 shadow-lg bg-white/50 backdrop-blur">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">Adesivo Recém Habilitada(o)</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Aviso visual para o vidro vigia. Impressão de alta qualidade e durabilidade.
                  </CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-primary">R$ 89,90</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span>Não atrapalha a visão do motorista (Perfurado)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Gera empatia e evita buzinas desnecessárias</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <label className="text-sm font-semibold text-slate-900">Escolha o Tamanho do seu Veículo</label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger className="w-full h-14 bg-white">
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="padrao">
                      <div className="font-medium">Padrão Central (90x45cm)</div>
                      <div className="text-xs text-slate-500">Para Hatchs, Sedans, SUVs e Picapes</div>
                    </SelectItem>
                    <SelectItem value="compacto">
                      <div className="font-medium">Ultra Compacto (80x35cm)</div>
                      <div className="text-xs text-slate-500">Exclusivo para Mobi, Kwid e UP</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
            <CardFooter className="pt-2 pb-6">
              <Button size="lg" className="w-full h-14 text-lg font-bold shadow-xl" onClick={handleCheckout}>
                Comprar Agora
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
