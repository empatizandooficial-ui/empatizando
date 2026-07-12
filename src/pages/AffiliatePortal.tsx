import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Wallet, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AffiliatePortal() {
  const { toast } = useToast();
  const [affiliate, setAffiliate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAffiliate = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("affiliates")
        .select("*")
        .eq("user_id", user.id)
        .single();
        
      setAffiliate(data);
      setLoading(false);
    };

    fetchAffiliate();
  }, []);

  const handleCopyLink = () => {
    if (!affiliate?.referral_code) return;
    const link = `${window.location.origin}/loja?ref=${affiliate.referral_code}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado!",
      description: "Envie este link para seus alunos e clientes.",
    });
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  if (!affiliate) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Você ainda não é um afiliado</h2>
        <Button onClick={() => window.location.href = "/afiliados/cadastro"}>
          Quero me cadastrar
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Portal do Embaixador</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${affiliate.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {affiliate.status === 'approved' ? 'Ativo' : 'Em Análise'}
        </span>
      </div>

      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-lg font-medium opacity-90">Seu Link de Vendas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="bg-primary-foreground/10 px-4 py-3 rounded-lg flex-1 text-center sm:text-left break-all font-mono">
            {window.location.origin}/loja?ref={affiliate.referral_code}
          </div>
          <Button variant="secondary" onClick={handleCopyLink} className="w-full sm:w-auto flex gap-2">
            <Copy className="w-4 h-4" /> Copiar Link
          </Button>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Saldo Disponível</CardTitle>
            <Wallet className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              R$ {Number(affiliate.balance).toFixed(2).replace('.', ',')}
            </div>
            <p className="text-xs text-slate-500 mt-1">Via PIX cadastrado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Vendas Confirmadas</CardTitle>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Cliques no Link</CardTitle>
            <Users className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
