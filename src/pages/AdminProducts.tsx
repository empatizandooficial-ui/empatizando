import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    price: "",
    cost_price: "",
    slug: "",
    image_url: "",
    is_active: true,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
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
        price: parseFloat(formData.price),
        cost_price: parseFloat(formData.cost_price),
        slug: formData.slug,
        image_url: formData.image_url,
        is_active: formData.is_active,
      };

      if (formData.id) {
        // Update
        const { error } = await supabase.from("products").update(payload).eq("id", formData.id);
        if (error) throw error;
        toast({ title: "Produto atualizado com sucesso!" });
      } else {
        // Insert
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
      price: product.price.toString(),
      cost_price: product.cost_price.toString(),
      slug: product.slug,
      image_url: product.image_url || "",
      is_active: product.is_active,
    });
    setIsDialogOpen(true);
  };

  const openNew = () => {
    setFormData({ id: "", title: "", description: "", price: "", cost_price: "", slug: "", image_url: "", is_active: true });
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-heading">Produtos (Loja)</h2>
          <p className="text-muted-foreground">Gerencie o catálogo de produtos e adesivos.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gap-2"><Plus size={16} /> Novo Produto</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{formData.id ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Adesivo Autismo" />
              </div>
              <div>
                <label className="text-sm font-medium">Slug (URL amigável)</label>
                <Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="adesivo-autismo" />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Detalhes do produto..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Preço de Custo (R$)</label>
                  <Input type="number" step="0.01" value={formData.cost_price} onChange={(e) => setFormData({...formData, cost_price: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-medium">Preço de Venda (R$)</label>
                  <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">URL da Imagem</label>
                <Input value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
              </div>
              <Button onClick={handleSave} className="w-full mt-4">Salvar Produto</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando catálogo...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Nenhum produto cadastrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Produto</th>
                    <th className="px-4 py-3 font-medium">Preço</th>
                    <th className="px-4 py-3 font-medium">Margem</th>
                    <th className="px-4 py-3 font-medium text-center">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.title} className="w-10 h-10 rounded-md object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-xs">Sem img</div>
                          )}
                          <div>
                            <p className="font-semibold">{product.title}</p>
                            <p className="text-xs text-muted-foreground">/{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">R$ {product.price}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">
                        R$ {(product.price - product.cost_price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.is_active ? 'Ativo' : 'Pausado'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(product)}>
                          <Edit2 size={14} className="mr-1" /> Editar
                        </Button>
                        <Button variant={product.is_active ? "destructive" : "default"} size="sm" onClick={() => toggleStatus(product.id, product.is_active)}>
                          {product.is_active ? <X size={14} /> : <Check size={14} />}
                        </Button>
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
