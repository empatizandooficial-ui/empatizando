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
import { Loader2, DollarSign, Briefcase } from "lucide-react";

export default function AffiliateSignup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pixKey, setPixKey] = useState("");
  
  // Fields for non-authenticated users
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
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
      let currentUserId = user?.id;

      if (!isAuthenticated) {
        // Step 1: Try to create Auth Account
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });

        if (authError) {
          if (authError.message.includes("User already registered") || authError.message.includes("already exists")) {
            toast({
              title: "E-mail já cadastrado",
              description: "Você já possui uma conta de cliente. Faça login para vincular seu perfil de parceiro.",
              variant: "destructive"
            });
            navigate("/login-cliente");
            return;
          }
          throw authError;
        }
        
        currentUserId = authData.user?.id;
        
        if (!currentUserId) {
          throw new Error("Falha ao criar usuário. Tente novamente.");
        }
      }

      // Step 2: Create Affiliate Record
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { error: affiliateError } = await supabase.from("affiliates").insert({
        user_id: currentUserId,
        referral_code: referralCode,
        pix_key: pixKey,
        status: "pending"
      });

      if (affiliateError) throw affiliateError;

      toast({
        title: "Cadastro Concluído!",
        description: "Sua solicitação está em análise. Em breve você terá acesso ao portal B2B.",
      });
      
      // If we just created the account, they need to verify email or we redirect them to login
      if (!isAuthenticated) {
        navigate("/login-cliente");
      }
      
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Não foi possível concluir o cadastro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative flex flex-col overflow-hidden">
      {/* Immersive Background Blurs (Spiritual-Science) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#8A2BE2]/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#40E0D0]/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-24 z-10">
        <Card className="w-full max-w-lg shadow-2xl border-white/10 bg-background/40 backdrop-blur-xl">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-inner">
              <Briefcase className="w-8 h-8 text-[#40E0D0]" />
            </div>
            <CardTitle className="text-2xl font-bold text-white drop-shadow-md">Seja um Parceiro B2B</CardTitle>
            <CardDescription className="text-base mt-2 text-slate-300">
              Ajude a promover um trânsito mais humano e ganhe comissões atrativas por cada venda realizada através do seu link exclusivo.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              {isAuthenticated && (
                <div className="bg-white/5 border border-[#40E0D0]/30 p-4 rounded-lg text-sm text-[#40E0D0] mb-6">
                  <p><strong>Olá, {user?.user_metadata?.full_name || 'Parceiro'}!</strong></p>
                  <p className="text-slate-300 mt-1">Para prosseguirmos com seu cadastro de parceiro, precisamos apenas da sua chave PIX para o pagamento das comissões.</p>
                </div>
              )}

              {!isAuthenticated && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-slate-200">Nome Completo</Label>
                    <Input 
                      id="fullName" 
                      placeholder="Seu nome completo" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-12 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-[#40E0D0]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">E-mail Profissional</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="seu@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-[#40E0D0]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-200">Senha Segura</Label>
                    <Input 
                      id="password" 
                      type="password"
                      placeholder="Crie uma senha forte" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-[#40E0D0]"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="pix" className="text-slate-200">Chave PIX para Comissões</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input 
                    id="pix" 
                    placeholder="CPF, E-mail, Celular ou Aleatória" 
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    required
                    className="h-12 pl-10 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-[#40E0D0]"
                  />
                </div>
                <p className="text-xs text-slate-400">Certifique-se de que a chave está correta para evitar problemas no repasse das comissões.</p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-bold text-white bg-gradient-to-r from-[#8A2BE2] to-[#40E0D0] hover:opacity-90 border-0 transition-all duration-300 shadow-[0_0_20px_rgba(64,224,208,0.3)]" 
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Solicitar Acesso B2B
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center py-5 border-t border-white/10 bg-black/20 rounded-b-xl">
            <p className="text-sm font-bold text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
              ✨ Comissão inicial de R$ 10,00 por adesivo vendido.
            </p>
          </CardFooter>
        </Card>
      </main>
      <div className="relative z-10 bg-background/80 backdrop-blur-md border-t border-white/10">
        <Footer />
      </div>
    </div>
  );
}
