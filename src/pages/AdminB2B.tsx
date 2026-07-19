import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Handshake, Search, CreditCard, ChevronRight, CheckCircle, Ban, ArrowRightLeft, DollarSign, Clock, Users, ShieldAlert } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminB2B() {
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("affiliates").select("*").order("created_at", { ascending: false });
    if (data) setAffiliates(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("affiliates").update({ status: newStatus }).eq("id", id);
    if (error) {
      toast({ title: "Interferência", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status Atualizado", description: "O parceiro foi atualizado com sucesso." });
      setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    }
  };

  const filteredAffiliates = affiliates.filter(a => 
    (a.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     a.pix_key?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pending = filteredAffiliates.filter(a => a.status === 'pending');
  const approved = filteredAffiliates.filter(a => a.status === 'approved');
  const activeSellers = filteredAffiliates.filter(a => a.status === 'active_seller' || (a.status === 'approved' && a.balance > 0));
  const inactive = filteredAffiliates.filter(a => a.status === 'inactive' || a.status === 'rejected');

  const KanbanColumn = ({ title, icon: Icon, items, colorClass }: any) => (
    <div className="flex-1 flex flex-col bg-white/40 backdrop-blur-sm border border-stone-200 rounded-xl overflow-hidden">
      <div className={`p-4 border-b border-stone-200 bg-white/60 flex items-center justify-between`}>
        <h3 className="font-bold text-stone-800 flex items-center gap-2">
          <Icon className={`w-5 h-5 ${colorClass}`} />
          {title}
        </h3>
        <Badge variant="secondary" className="bg-stone-200 text-stone-700">{items.length}</Badge>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.length === 0 ? (
          <div className="text-center p-4 text-stone-400 text-sm">Nenhum parceiro aqui.</div>
        ) : (
          items.map((item: any) => (
            <Card key={item.id} className="bg-white hover:shadow-md transition-shadow cursor-default border-stone-200">
              <CardContent className="p-4 space-y-3">
                <div>
                  <div className="font-bold text-stone-800 text-sm">{item.full_name || 'Usuário Desconhecido'}</div>
                  <div className="text-xs text-stone-500">{item.email}</div>
                </div>
                
                <div className="flex justify-between items-center text-xs border-t border-stone-100 pt-3">
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <DollarSign className="w-3 h-3"/> {Number(item.balance || 0).toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-stone-400 font-mono">{item.referral_code}</span>
                </div>

                <Select 
                  value={item.status} 
                  onValueChange={(val) => updateStatus(item.id, val)}
                >
                  <SelectTrigger className="w-full h-8 text-xs bg-stone-50">
                    <SelectValue placeholder="Mover para..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Em Análise</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="active_seller">Vendas Realizadas</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800 flex items-center gap-3">
            <Handshake className="w-8 h-8 text-indigo-500" />
            Parceiros B2B
          </h1>
          <p className="text-stone-500 mt-1">Gestão de Autoescolas, Instrutores e Embaixadores.</p>
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-sm border border-stone-200 p-4 rounded-xl mb-6 flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, email ou chave PIX..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
          />
        </div>
      </div>

      <Tabs defaultValue="kanban" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-[400px] grid-cols-2 mb-6">
          <TabsTrigger value="kanban">Visão Kanban</TabsTrigger>
          <TabsTrigger value="lista">Visão Lista</TabsTrigger>
        </TabsList>
        
        <TabsContent value="kanban" className="flex-1 overflow-hidden m-0">
          <div className="flex h-full gap-6 pb-6">
            <KanbanColumn title="Em Análise" icon={Clock} items={pending} colorClass="text-amber-500" />
            <KanbanColumn title="Aprovados" icon={CheckCircle} items={approved} colorClass="text-indigo-500" />
            <KanbanColumn title="Vendas Realizadas" icon={Users} items={activeSellers} colorClass="text-emerald-500" />
            <KanbanColumn title="Inativos" icon={ShieldAlert} items={inactive} colorClass="text-red-500" />
          </div>
        </TabsContent>
        
        <TabsContent value="lista" className="flex-1 overflow-y-auto m-0">
          <Card className="bg-white/50 backdrop-blur-sm border-stone-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Código (Ref)</TableHead>
                  <TableHead>Chave PIX</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAffiliates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-stone-500 h-32">Nenhum parceiro encontrado.</TableCell>
                  </TableRow>
                ) : (
                  filteredAffiliates.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium text-stone-800">{item.full_name || 'N/A'}</div>
                        <div className="text-sm text-stone-500">{item.email || 'N/A'}</div>
                      </TableCell>
                      <TableCell className="font-mono text-stone-600">{item.referral_code}</TableCell>
                      <TableCell className="text-stone-600">{item.pix_key}</TableCell>
                      <TableCell className="font-medium text-emerald-600">
                        R$ {Number(item.balance || 0).toFixed(2).replace('.', ',')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          item.status === 'pending' ? "border-amber-500 text-amber-600 bg-amber-50" :
                          item.status === 'approved' ? "border-indigo-500 text-indigo-600 bg-indigo-50" :
                          item.status === 'active_seller' ? "border-emerald-500 text-emerald-600 bg-emerald-50" :
                          "border-red-500 text-red-600 bg-red-50"
                        }>
                          {item.status === 'pending' ? "Em Análise" :
                           item.status === 'approved' ? "Aprovado" :
                           item.status === 'active_seller' ? "Vendedor" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select 
                          value={item.status} 
                          onValueChange={(val) => updateStatus(item.id, val)}
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs inline-flex">
                            <SelectValue placeholder="Alterar Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Em Análise</SelectItem>
                            <SelectItem value="approved">Aprovar</SelectItem>
                            <SelectItem value="active_seller">Forçar Vendedor</SelectItem>
                            <SelectItem value="inactive">Bloquear</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
