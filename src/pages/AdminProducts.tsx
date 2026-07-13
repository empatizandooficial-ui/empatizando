import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit2, Trash2, Check, X, Sparkles, Box, Tag, Layers, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("geral");
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      const file = e.target.files[0];
      setUploading(true);
      
      const fileName = `${crypto.randomUUID()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: publicUrl });
      toast({ title: "Imagem enviada com sucesso!" });
    } catch (error: any) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    base_price: "",
    cost_price: "",
    slug: "",
    image_url: "",
    is_active: true,
    seo_title: "",
    seo_description: "",
    tags_json: "[]",
    is_ai_optimized: false,
  });

  const [variants, setVariants] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (!error && data) setCategories(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*, product_variants(*, inventory(*)), product_categories(categories(*))")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({ title: "Erro ao buscar produtos", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        base_price: formData.base_price ? parseFloat(formData.base_price) : 0,
        price: formData.base_price ? parseFloat(formData.base_price) : 0, // Fallback for old queries
        cost_price: formData.cost_price ? parseFloat(formData.cost_price) : 0,
        slug: formData.slug,
        image_url: formData.image_url,
        is_active: formData.is_active,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
        tags_json: JSON.parse(formData.tags_json || "[]"),
        is_ai_optimized: formData.is_ai_optimized,
      };

      if (formData.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", formData.id);
        if (error) throw error;
        toast({ title: "Produto atualizado com sucesso!" });
      } else {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
        toast({ title: "Produto criado com sucesso!" });
      }
      setIsDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    }
  };

  const openEdit = (product: any) => {
    setFormData({
      id: product.id,
      title: product.title,
      description: product.description || "",
      base_price: product.base_price ? product.base_price.toString() : (product.price ? product.price.toString() : ""),
      cost_price: product.cost_price ? product.cost_price.toString() : "",
      slug: product.slug,
      image_url: product.image_url || "",
      is_active: product.is_active,
      seo_title: product.seo_title || "",
      seo_description: product.seo_description || "",
      tags_json: typeof product.tags_json === 'string' ? product.tags_json : JSON.stringify(product.tags_json || []),
      is_ai_optimized: product.is_ai_optimized || false,
    });
    setVariants(product.product_variants || []);
    setActiveTab("geral");
    setIsDialogOpen(true);
  };

  const openNew = () => {
    setFormData({ 
      id: "", title: "", description: "", base_price: "", cost_price: "", slug: "", image_url: "", is_active: true,
      seo_title: "", seo_description: "", tags_json: "[]", is_ai_optimized: false
    });
    setVariants([]);
    setActiveTab("geral");
    setIsDialogOpen(true);
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("products").update({ is_active: !currentStatus }).eq("id", id);
      if (error) throw error;
      toast({ title: `Produto ${!currentStatus ? 'ativado' : 'pausado'} com sucesso!` });
      fetchProducts();
    } catch (error: any) {
      toast({ title: "Erro ao alterar status", description: error.message, variant: "destructive" });
    }
  };

  const handleCreateCategory = async () => {
    const name = window.prompt("Nome da nova categoria:");
    if (!name) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    try {
      const { error } = await supabase.from("categories").insert([{ name, slug }]);
      if (error) throw error;
      toast({ title: "Categoria criada!" });
      fetchCategories();
    } catch (error: any) {
      toast({ title: "Erro ao criar", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Catálogo de Produtos</h2>
          <p className="text-muted-foreground mt-1">Gerencie produtos, SEO, variantes e estoque.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} size="lg" className="gap-2 shadow-md">
              <Plus size={18} /> Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{formData.id ? "Editar Produto" : "Criar Novo Produto"}</DialogTitle>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="geral" className="gap-2"><Box size={16}/> Geral</TabsTrigger>
                <TabsTrigger value="ai_seo" className="gap-2"><Sparkles size={16}/> SEO e IA</TabsTrigger>
                <TabsTrigger value="variants" className="gap-2"><Layers size={16}/> Variantes</TabsTrigger>
                <TabsTrigger value="categories" className="gap-2"><Tag size={16}/> Categorias</TabsTrigger>
              </TabsList>
              
              <div className="py-6">
                <TabsContent value="geral" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome do Produto</label>
                      <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Ex: Camiseta Básica" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Slug (URL)</label>
                      <Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="camiseta-basica" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição</label>
                    <Textarea className="min-h-[100px]" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Detalhes do produto..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Preço Base (R$)</label>
                      <Input type="number" step="0.01" value={formData.base_price} onChange={(e) => setFormData({...formData, base_price: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Custo (R$)</label>
                      <Input type="number" step="0.01" value={formData.cost_price} onChange={(e) => setFormData({...formData, cost_price: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Imagem Principal</label>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && <p className="text-sm text-muted-foreground">Enviando imagem...</p>}
                    {formData.image_url && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                        <img 
                          src={formData.image_url} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch checked={formData.is_active} onCheckedChange={(c) => setFormData({...formData, is_active: c})} />
                    <label className="text-sm font-medium cursor-pointer" onClick={() => setFormData({...formData, is_active: !formData.is_active})}>Produto Ativo na Loja</label>
                  </div>
                </TabsContent>

                <TabsContent value="ai_seo" className="space-y-4 mt-0">
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex gap-3 mb-4">
                    <Sparkles className="text-blue-500 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium text-blue-900">Otimização Inteligente</h4>
                      <p className="text-sm text-blue-700">Esses campos são usados para SEO e foram/podem ser gerados pelo Robô de IA.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SEO Title</label>
                    <Input value={formData.seo_title} onChange={(e) => setFormData({...formData, seo_title: e.target.value})} placeholder="Título otimizado para buscadores" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SEO Description</label>
                    <Textarea value={formData.seo_description} onChange={(e) => setFormData({...formData, seo_description: e.target.value})} placeholder="Descrição otimizada..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags (JSON Array)</label>
                    <Input value={formData.tags_json} onChange={(e) => setFormData({...formData, tags_json: e.target.value})} placeholder='["tag1", "tag2"]' />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch checked={formData.is_ai_optimized} onCheckedChange={(c) => setFormData({...formData, is_ai_optimized: c})} />
                    <label className="text-sm font-medium">Conteúdo revisado por IA</label>
                  </div>
                </TabsContent>

                <TabsContent value="variants" className="space-y-4 mt-0">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-medium">SKUs & Variantes</h3>
                      <p className="text-sm text-muted-foreground">Gerencie tamanhos, cores e controle de estoque individual.</p>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2"><Plus size={14}/> Adicionar Variante</Button>
                  </div>
                  
                  {variants.length === 0 ? (
                    <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
                      <p className="text-sm text-muted-foreground">Nenhuma variante cadastrada.</p>
                      <p className="text-xs text-muted-foreground mt-1">O produto será vendido como item único caso não possua variantes.</p>
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium">SKU</th>
                            <th className="px-4 py-2 text-left font-medium">Preço Ajuste</th>
                            <th className="px-4 py-2 text-left font-medium">Estoque (Disp.)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {variants.map(v => (
                            <tr key={v.id}>
                              <td className="px-4 py-2 font-mono text-xs">{v.sku}</td>
                              <td className="px-4 py-2">{v.price_override ? `R$ ${v.price_override}` : '-'}</td>
                              <td className="px-4 py-2">{v.inventory?.[0]?.quantity_available || 0} un.</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="categories" className="space-y-4 mt-0">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">Selecione as categorias onde este produto será exibido.</p>
                    <Button type="button" onClick={handleCreateCategory} variant="outline" size="sm" className="gap-2">
                      <Plus size={14} /> Nova Categoria
                    </Button>
                  </div>
                  
                  {categories.length === 0 ? (
                    <p className="text-sm">Nenhuma categoria cadastrada no sistema.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map(cat => (
                        <div key={cat.id} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/30 transition-colors">
                          <Switch id={`cat-${cat.id}`} />
                          <label htmlFor={`cat-${cat.id}`} className="text-sm font-medium cursor-pointer flex-1">{cat.name}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSave} className="px-8 shadow-sm">Salvar Alterações</Button>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-border">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
              <RefreshCw className="animate-spin mb-4" />
              Carregando catálogo...
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground bg-muted/10">
              <Box className="mx-auto mb-4 opacity-50" size={48} />
              <p>Nenhum produto cadastrado ainda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">Produto & Info</th>
                    <th className="px-6 py-4 font-medium">Preço Base</th>
                    <th className="px-6 py-4 font-medium">IA Status</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.title} className="w-12 h-12 rounded-lg object-cover border bg-background" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground border">Img</div>
                          )}
                          <div>
                            <p className="font-semibold text-base group-hover:text-primary transition-colors">{product.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 font-mono bg-muted/50 inline-block px-1.5 py-0.5 rounded">/{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">R$ {product.base_price || product.price}</div>
                        {product.cost_price && (
                          <div className="text-xs text-green-600 mt-1">Margem: R$ {((product.base_price || product.price) - product.cost_price).toFixed(2)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {product.is_ai_optimized ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 font-normal">
                            <Sparkles size={12} /> Otimizado
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Manual</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={product.is_active ? "default" : "secondary"} className={product.is_active ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0" : "bg-zinc-100 text-zinc-500 border-0"}>
                          {product.is_active ? 'Ativo' : 'Pausado'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="outline" size="sm" className="h-8 shadow-sm" onClick={() => openEdit(product)}>
                            <Edit2 size={14} className="mr-1" /> Editar
                          </Button>
                          <Button variant={product.is_active ? "destructive" : "default"} size="sm" className="h-8 shadow-sm w-8 p-0" onClick={() => toggleStatus(product.id, product.is_active)}>
                            {product.is_active ? <X size={14} /> : <Check size={14} />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
