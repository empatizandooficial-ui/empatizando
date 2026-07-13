import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, ShieldCheck, Heart, Loader2, ChevronRight, 
  Star, Truck, RotateCcw, Lock, ThumbsUp, Check 
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Product {
  id: string;
  title: string;
  description: string;
  price?: number;
  base_price?: number;
  images?: string[];
  image_url?: string;
  features?: string[];
  slug: string;
}

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      // Fetch main product (por slug ou por ID, para suportar produtos sem slug)
      const { data, error } = await (supabase as any)
        .from('products_public')
        .select('*')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .single();
        
      if (error) throw error;
      setProduct(data as Product);
      
      // Set initial active image
      if (data.images && data.images.length > 0) {
        setActiveImage(data.images[0]);
      } else if (data.image_url) {
        setActiveImage(data.image_url);
      }

      // Fetch related products (just 3 random/latest active products)
      const { data: related } = await (supabase as any)
        .from('products_public')
        .select('*')
        .neq('slug', slug)
        .limit(3);
        
      if (related) {
        setRelatedProducts(related);
      }
      
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Produto não encontrado",
        description: "Não conseguimos carregar este produto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center flex-col gap-4">
          <h2 className="text-2xl font-bold text-slate-800">Produto não encontrado</h2>
          <Link to="/loja">
            <Button>Voltar para a Loja</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPrice = product.price || product.base_price || 0;
  const productImages = product.images || (product.image_url ? [product.image_url] : []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-slate-500 mb-8">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Início</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/loja" className="hover:text-indigo-600 transition-colors">Loja Oficial</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-slate-900 font-medium truncate">{product.title}</span>
          </nav>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              
              {/* Product Gallery */}
              <div className="p-8 bg-slate-50/50">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm mb-4 relative">
                  {activeImage ? (
                    <img 
                      src={activeImage} 
                      alt={product.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      Sem Imagem
                    </div>
                  )}
                </div>
                
                {productImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-3">
                    {productImages.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:border-indigo-300'}`}
                      >
                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info & Buy Box */}
              <div className="p-8 lg:p-12 flex flex-col">
                {/* Ratings (Static Mock) */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-amber-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 underline cursor-pointer hover:text-indigo-600 transition-colors">
                    (128 avaliações)
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4">
                  {product.title}
                </h1>
                
                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-black text-indigo-600">
                      R$ {currentPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    ou em até <span className="font-bold text-slate-700">12x de R$ {(currentPrice / 10).toFixed(2).replace('.', ',')}</span> no cartão
                  </p>
                </div>

                <div className="space-y-6 mb-8 flex-grow">
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                    {product.description.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>

                  {product.features && product.features.length > 0 && (
                    <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
                      <h3 className="font-bold text-indigo-900 mb-4">Destaques do Produto:</h3>
                      <ul className="space-y-3">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-slate-700">
                            {idx % 2 === 0 ? (
                              <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                            ) : (
                              <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            )}
                            <span className="leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Buy Action */}
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <div className="flex gap-4">
                    <div className="w-24 bg-slate-100 rounded-xl flex items-center justify-between px-2 border border-slate-200">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-800">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="flex-1 h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_25px_rgba(79,70,229,0.4)] rounded-xl border-0"
                      onClick={() => {
                        for(let i=0; i<quantity; i++) {
                          addToCart({
                            id: product.id,
                            title: product.title,
                            price: currentPrice,
                            image_url: productImages[0] || ""
                          });
                        }
                      }}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Comprar Agora
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-2 pt-4">
                    <div className="flex flex-col items-center justify-center text-center gap-1 p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <Lock className="w-5 h-5 text-slate-400" />
                      <span className="text-[10px] uppercase font-bold text-slate-500">Pagamento<br/>Seguro</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center gap-1 p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <RotateCcw className="w-5 h-5 text-slate-400" />
                      <span className="text-[10px] uppercase font-bold text-slate-500">7 Dias de<br/>Garantia</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center gap-1 p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <Truck className="w-5 h-5 text-slate-400" />
                      <span className="text-[10px] uppercase font-bold text-slate-500">Envio para<br/>Todo Brasil</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
          {/* Reviews Section (Static) */}
          <div className="mt-16 bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Avaliações de Clientes</h2>
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl font-black text-slate-900">4.9</span>
                  <div className="flex flex-col">
                    <div className="flex text-amber-400">
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-sm text-slate-500 font-medium mt-1">Baseado em 128 avaliações</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 border-slate-200">Escrever Avaliação</Button>
              </div>
              <div className="lg:col-span-2 space-y-6">
                {/* Mock Review 1 */}
                <div className="pb-6 border-b border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">Mariana S.</span>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Comprador Verificado
                        </span>
                      </div>
                      <div className="flex text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                    <span className="text-sm text-slate-400">Há 2 dias</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-3">Produto de excelente qualidade! Chegou super rápido e exatamente como na foto. Faz toda a diferença no dia a dia.</p>
                  <button className="text-xs font-medium text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                    <ThumbsUp className="w-3 h-3" /> Útil (12)
                  </button>
                </div>
                {/* Mock Review 2 */}
                <div className="pb-6 border-b border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">Carlos E.</span>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Comprador Verificado
                        </span>
                      </div>
                      <div className="flex text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                    <span className="text-sm text-slate-400">Há 1 semana</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-3">Muito bom, material resistente. Comprei por indicação e não me arrependi. Recomendo para todos!</p>
                  <button className="text-xs font-medium text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                    <ThumbsUp className="w-3 h-3" /> Útil (5)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Você também pode gostar</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map(related => (
                  <Link to={`/loja/produto/${related.slug}`} key={related.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col">
                    <div className="aspect-square bg-slate-50 overflow-hidden relative">
                      <img 
                        src={(related.images && related.images.length > 0) ? related.images[0] : (related.image_url || "")} 
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex text-amber-400 mb-2">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">{related.title}</h3>
                      <div className="text-lg font-black text-indigo-600">
                        R$ {(related.price || related.base_price || 0).toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
