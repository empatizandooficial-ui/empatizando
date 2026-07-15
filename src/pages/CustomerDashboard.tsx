import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, Package, LogOut, ArrowLeft, Settings } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";
import { CustomerTickets } from "@/components/CustomerTickets";
import { HeadphonesIcon } from "lucide-react";
export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login-cliente");
        return;
      }
      setUser(session.user);
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Você saiu da sua conta." });
    navigate("/loja");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-slate-500 font-medium">Carregando sua conta...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-24 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Olá, {user?.user_metadata?.full_name || 'Cliente'}</h1>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/loja")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Loja
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>

        <Tabs defaultValue="pedidos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mb-8">
            <TabsTrigger value="pedidos"><Package className="w-4 h-4 mr-2" /> Meus Pedidos</TabsTrigger>
            <TabsTrigger value="suporte"><HeadphonesIcon className="w-4 h-4 mr-2" /> Suporte</TabsTrigger>
            <TabsTrigger value="configuracoes"><Settings className="w-4 h-4 mr-2" /> Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pedidos">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pedidos</CardTitle>
                <CardDescription>Acompanhe o status das suas compras recentes.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-16 h-16 text-slate-200 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">Nenhum pedido encontrado</h3>
                <p className="text-slate-500 mt-2 max-w-sm">Você ainda não realizou nenhuma compra em nossa loja.</p>
                <Button className="mt-6" onClick={() => navigate("/loja")}>
                  Explorar Produtos
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suporte">
            <Card>
              <CardContent className="p-6">
                <CustomerTickets userId={user.id} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="configuracoes">
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>Gerencie as informações da sua conta.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-100 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Nome</p>
                    <p className="font-medium">{user?.user_metadata?.full_name || 'Não informado'}</p>
                  </div>
                  <div className="p-4 bg-slate-100 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <Button variant="outline" className="mt-4" disabled>Editar Dados (Em breve)</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
