import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Wallet, TrendingUp, Users, LogOut, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AffiliatePortal() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [affiliate, setAffiliate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  
  // Profile form state
  const [fullName, setFullName] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const fetchAffiliate = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("affiliates")
        .select("*")
        .eq("user_id", user.id)
        .single();
        
      if (data) {
        setAffiliate(data);
        setFullName(data.full_name || "");
        setPixKey(data.pix_key || "");
        
        if (!data.terms_accepted) {
          setShowTerms(true);
        }
      }
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
      description: "Envie este link para os clientes.",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Você saiu da sua conta." });
    navigate("/loja");
  };

  const handleAcceptTerms = async () => {
    if (!affiliate) return;
    
    const { error } = await supabase
      .from("affiliates")
      .update({ terms_accepted: true })
      .eq("id", affiliate.id);

    if (error) {
      toast({ title: "Erro", description: "Não foi possível aceitar os termos.", variant: "destructive" });
      return;
    }
    
    setAffiliate({ ...affiliate, terms_accepted: true });
    setShowTerms(false);
    toast({ title: "Termos Aceitos", description: "Bem-vindo ao Portal do Parceiro!" });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliate) return;
    setSavingProfile(true);

    const { error } = await supabase
      .from("affiliates")
      .update({ full_name: fullName, pix_key: pixKey })
      .eq("id", affiliate.id);

    setSavingProfile(false);

    if (error) {
      toast({ title: "Erro ao salvar", description: "Tente novamente mais tarde.", variant: "destructive" });
    } else {
      toast({ title: "Perfil atualizado", description: "Seus dados foram salvos com sucesso." });
      setAffiliate({ ...affiliate, full_name: fullName, pix_key: pixKey });
    }
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
      
      <Dialog open={showTerms} onOpenChange={() => {}}> 
        <DialogContent className="sm:max-w-[500px]" hideClose>
          <DialogHeader>
            <DialogTitle>Termos de Adesão B2B</DialogTitle>
            <DialogDescription className="pt-4 text-sm space-y-3">
              <p>
                Bem-vindo ao programa de parceiros! Antes de continuar, por favor, leia e aceite nossos termos.
              </p>
              <div className="bg-muted p-4 rounded-md">
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  Regras de Liberação de Comissão
                </p>
                <p>
                  A comissão só será validada caso a compra final seja efetivada <strong>exclusivamente</strong> através do seu link de parceiro.
                </p>
                <p className="mt-2">
                  As comissões são liberadas em <strong>8 dias</strong> após a entrega do produto ao cliente. Esse prazo existe devido ao direito de arrependimento (7 dias) previsto no Código de Defesa do Consumidor (CDC), sabendo que adesivos não podem ser devolvidos após o uso.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button onClick={handleAcceptTerms} className="w-full">
              Li e Aceito os Termos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Portal do Parceiro</h1>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${affiliate.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {affiliate.status === 'approved' ? 'Ativo' : 'Em Análise'}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Regras de Ouro
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-900 text-sm">
              Sua comissão será validada <strong>somente</strong> se a compra for efetivada utilizando o seu link exclusivo abaixo. Vendas fora do link não pontuam. O saldo é liberado 8 dias após a entrega do produto ao cliente.
            </CardContent>
          </Card>

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
                  R$ {Number(affiliate.balance || 0).toFixed(2).replace('.', ',')}
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
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input 
                    id="fullName" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    placeholder="Seu nome completo" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pixKey">Chave PIX</Label>
                  <Input 
                    id="pixKey" 
                    value={pixKey} 
                    onChange={(e) => setPixKey(e.target.value)} 
                    placeholder="Sua chave PIX para pagamentos" 
                  />
                </div>
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
