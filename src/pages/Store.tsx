import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Car, Loader2, Star, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Product {
  id: string;
  title: string;
  description: string;
  price?: number;
  base_price?: number;
  category?: string;
  images?: string[];
  image_url?: string;
  slug: string;
}

export default function Store() {
  const { toast } = useToast();
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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
        const { data, error } = await (supabase as any).from('products_public').select('*');
        if (error) throw error;
        
        if (!data || data.length === 0) {
           setProducts([]);
        } else {
           setProducts(data as Product[]);
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
            category: 'Adesivos Veiculares',
            slug: 'adesivo-recem-habilitada',
          },
          {
            id: '2',
            title: 'Adesivo Autismo - Tenha Paciência',
            description: 'Adesivo informativo.',
            price: 79.90,
            category: 'Adesivos de Conscientização',
            slug: 'adesivo-autismo',
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ["all", ...Array.from(cats)] as string[];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery) {
      result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Category
    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      const priceA = a.price || a.base_price || 0;
      const priceB = b.price || b.base_price || 0;
      
      if (sortBy === "price_asc") return priceA - priceB;
      if (sortBy === "price_desc") return priceB - priceA;
      return 0; // newest/default
    });

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      <div className="flex-grow bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative background blur elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Promotional Top Alert */}
          <div className="mb-8 p-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 border border-indigo-500/30 rounded-2xl backdrop-blur-md flex items-center justify-between flex-wrap gap-4 text-white shadow-xl">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              <p className="text-sm md:text-base font-medium">
                🎁 <strong>Oferta Especial:</strong> Garanta empatia e segurança com envio rápido para todo o Brasil.
              </p>
            </div>
            <span className="text-xs uppercase tracking-wider font-bold bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
              Pronta Entrega
            </span>
          </div>

          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-white tracking-tight drop-shadow-lg">
              Loja Oficial Empatizando
            </h1>
            <p className="text-lg text-indigo-200/80 max-w-2xl mx-auto leading-relaxed font-light">
              Descubra nossa linha de produtos focada em promover a empatia, segurança e o respeito no trânsito.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shrink-0 lg:sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-white font-bold text-xl border-b border-white/10 pb-4">
                <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                Filtros
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-indigo-200">Buscar Produto</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Ex: Adesivo Bebê..." 
                      className="pl-9 bg-slate-900/50 border-white/20 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-indigo-200">Categoria</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-slate-900/50 border-white/20 text-white focus:ring-indigo-500">
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat === "all" ? "Todas as Categorias" : cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-indigo-200">Ordenar por</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-slate-900/50 border-white/20 text-white focus:ring-indigo-500">
                      <SelectValue placeholder="Mais Recentes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mais Recentes</SelectItem>
                      <SelectItem value="price_asc">Menor Preço</SelectItem>
                      <SelectItem value="price_desc">Maior Preço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1 w-full">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
                  <p className="text-indigo-200 font-medium">Preparando a coleção premium...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-24 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-xl text-indigo-200">Nenhum produto encontrado.</p>
                  <Button variant="link" className="text-indigo-400 mt-2" onClick={() => {setSearchQuery(""); setSelectedCategory("all");}}>
                    Limpar filtros
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product, idx) => (
                    <Card key={product.id} className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-500 group overflow-hidden flex flex-col rounded-3xl w-full">
                      <Link to={`/loja/produto/${product.slug || product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-slate-950/60 p-3 flex items-center justify-center">
                        {/* Floating Badge */}
                        <div className="absolute top-3 left-3 z-20">
                          <span className="bg-indigo-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-indigo-400/30">
                            {idx === 0 ? "🔥 Mais Vendido" : idx === 1 ? "⭐ Destaque" : "✨ Original"}
                          </span>
                        </div>

                        <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden p-2 relative shadow-inner">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.title}
                              className="object-contain w-full h-full transition-all duration-700 group-hover:scale-105" 
                            />
                          ) : product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.title}
                              className="object-contain w-full h-full transition-all duration-700 group-hover:scale-105" 
                            />
                          ) : (
                            <Car className="w-16 h-16 text-slate-300" />
                          )}
                        </div>
                      </Link>

                      <CardContent className="p-5 flex-grow flex flex-col">
                        <div className="flex items-center gap-1 text-amber-400 mb-2">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs text-slate-400 ml-1 font-medium">(4.9)</span>
                        </div>
                        
                        <Link to={`/loja/produto/${product.slug || product.id}`} className="block mb-2 group-hover:text-indigo-300 transition-colors">
                          <CardTitle className="text-lg font-bold text-white leading-tight line-clamp-2">
                            {product.title}
                          </CardTitle>
                        </Link>

                        <div className="mt-auto pt-3">
                          <div className="text-2xl font-black text-white drop-shadow-md">
                            R$ {(product.price || product.base_price || 0).toFixed(2).replace('.', ',')}
                          </div>
                          <p className="text-xs text-indigo-200/60 mt-0.5">
                            em até 12x de R$ {((product.price || product.base_price || 0) / 12).toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-2 pb-5 px-5">
                        <Button 
                          size="lg" 
                          className="w-full h-12 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] rounded-xl flex items-center justify-center gap-2 border-0"
                          onClick={() => {
                            addToCart({
                              id: product.id,
                              title: product.title,
                              price: product.price || product.base_price || 0,
                              image_url: (product.images && product.images.length > 0) ? product.images[0] : (product.image_url || "")
                            });
                            toast({
                              title: "Adicionado ao Carrinho!",
                              description: `${product.title} foi adicionado.`,
                            });
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Adicionar ao Carrinho
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

