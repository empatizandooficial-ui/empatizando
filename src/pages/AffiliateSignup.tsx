import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, DollarSign, ArrowRight } from "lucide-react";

export default function AffiliateSignup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pixKey, setPixKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUser(session.user);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!isAuthenticated || !user) {
        toast({
          title: "Erro de Autenticação",
          description: "Você precisa estar logado para se tornar um parceiro.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Generate a random 6-char referral code
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { error } = await supabase.from("affiliates").insert({
        user_id: user.id,
        referral_code: referralCode,
        pix_key: pixKey,
        status: "pending"
      });

      if (error) throw error;

      toast({
        title: "Cadastro Concluído!",
        description: "Sua solicitação está em análise. Em breve você terá acesso ao portal.",
      });
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível concluir o cadastro. Tente novamente.",
        variant: "destructive"
      });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-24">
        <Card className="w-full max-w-lg shadow-xl border-primary/10">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Seja um Parceiro B2B</CardTitle>
            <CardDescription className="text-base mt-2">
              Ajude a promover um trânsito mais humano e ganhe comissões atrativas por cada venda realizada através do seu link exclusivo.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!isAuthenticated ? (
              <div className="flex flex-col items-center space-y-6 bg-slate-100 p-8 rounded-xl border border-slate-200">
                <p className="text-center text-slate-600 font-medium">
                  Para se tornar um parceiro e receber seu link de vendas, você precisa ter uma conta na Empatizando.
                </p>
                <div className="flex flex-col w-full gap-3 sm:flex-row">
                  <Button className="flex-1 h-12" onClick={() => navigate("/login-cliente")}>
                    Já tenho conta <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="flex-1 h-12" onClick={() => navigate("/login-cliente")}>
                    Criar nova conta
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg text-sm text-indigo-800 mb-6">
                  <p><strong>Olá, {user?.user_metadata?.full_name || 'Parceiro'}!</strong></p>
                  <p>Para prosseguirmos com seu cadastro de parceiro, precisamos apenas da sua chave PIX para o pagamento das comissões.</p>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="pix" className="text-base">Sua Chave PIX</Label>
                  <Input 
                    id="pix" 
                    placeholder="CPF, E-mail, Celular ou Aleatória" 
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    required
                    className="h-12"
                  />
                  <p className="text-xs text-slate-500">Certifique-se de que a chave está correta para evitar problemas no repasse das comissões.</p>
                </div>
                <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  Solicitar Acesso B2B
                </Button>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center text-sm font-medium text-slate-500 bg-slate-50 py-4 border-t">
            <p>Comissão inicial de R$ 10,00 por adesivo vendido.</p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
