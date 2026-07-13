import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Car, ShieldCheck, Heart, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images?: string[];
  image_url?: string;
  features?: string[];
}

export default function Store() {
  const { toast } = useToast();
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

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

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products_public' as any).select('*');
        if (error) throw error;
        
        if (!data || data.length === 0) {
           setProducts([]);
        } else {
           setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Erro ao carregar produtos",
          description: "Exibindo versão de demonstração.",
          variant: "destructive",
        });
        setProducts([
          {
            id: '1',
            title: 'Adesivo Recém Habilitada(o)',
            description: 'Aviso visual para o vidro vigia. Impressão de alta qualidade e durabilidade.',
            price: 89.90,
            images: [],
            features: ['Não atrapalha a visão do motorista (Perfurado)', 'Gera empatia e evita buzinas desnecessárias']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      <div className="flex-grow bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blur elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-white tracking-tight drop-shadow-lg">
            Loja Oficial Empatizando
          </h1>
          <p className="text-xl text-indigo-200/80 max-w-3xl mx-auto leading-relaxed font-light">
            Descubra nossa linha de produtos focada em promover a empatia e o respeito no trânsito. Qualidade premium com um propósito real.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
            <p className="text-indigo-200 font-medium">Preparando a coleção premium...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {products.map((product) => (
              <Card key={product.id} className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl hover:bg-white/10 transition-all duration-500 group overflow-hidden flex flex-col rounded-3xl">
                <div className="relative aspect-video overflow-hidden bg-slate-900/50 flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.title}
                      className="object-cover w-full h-full absolute inset-0 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                    />
                  ) : product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.title}
                      className="object-cover w-full h-full absolute inset-0 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                    />
                  ) : (
                    <Car className="w-24 h-24 text-white/10 group-hover:text-white/20 transition-colors duration-500 absolute" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                    <span className="text-3xl font-black text-white drop-shadow-md">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <CardHeader className="space-y-2 pb-4 pt-6">
                  <CardTitle className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-300">
                    {product.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-sm leading-relaxed">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow space-y-4">
                  {product.features && product.features.length > 0 && (
                    <div className="space-y-3 pt-2">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                          {idx % 2 === 0 ? (
                            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <span className="leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="pt-4 pb-6 px-6">
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-base font-bold bg-indigo-500 hover:bg-indigo-400 text-white transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] rounded-xl flex items-center justify-center gap-2 border-0"
                    onClick={() => addToCart({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      image_url: (product.images && product.images.length > 0) ? product.images[0] : (product.image_url || "")
                    })}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Adicionar ao Carrinho
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
}
