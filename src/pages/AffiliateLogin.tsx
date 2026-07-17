import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, ShieldCheck, Lock, Mail } from "lucide-react";

export default function AffiliateLogin() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/afiliados/portal");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Acesso Liberado",
        description: "Bem-vindo de volta ao portal de Guardiões.",
      });
      navigate("/afiliados/portal");
      
    } catch (error: any) {
      toast({
        title: "Interferência",
        description: error.message || "Credenciais inválidas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
        <Card className="w-full max-w-md shadow-2xl border-white/10 bg-background/40 backdrop-blur-xl transition-all duration-500">
          
          <CardHeader className="text-center pb-6 border-b border-white/5">
            <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-[#40E0D0]/30 shadow-[0_0_20px_rgba(64,224,208,0.1)]">
              <ShieldCheck className="w-8 h-8 text-[#40E0D0]" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
              Portal do Guardião
            </CardTitle>
            <CardDescription className="text-slate-300">
              Acesse seu painel B2B para gerenciar sua rede e ganhos.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2 relative">
                <Label htmlFor="email" className="text-slate-200">E-mail Profissional</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-[#40E0D0]/70" />
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="seu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-[#40E0D0]"
                  />
                </div>
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="password" className="text-slate-200">Senha de Acesso</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-[#40E0D0]/70" />
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="Sua senha secreta" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-12 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-[#40E0D0]"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading || !email || !password}
                className="w-full h-12 mt-6 font-bold text-white bg-gradient-to-r from-[#40E0D0] to-[#8A2BE2] hover:opacity-90 border-0 shadow-[0_0_20px_rgba(64,224,208,0.2)]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Sintonizar Acesso"} 
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center py-5 border-t border-white/5 bg-black/10 rounded-b-xl gap-2">
            <p className="text-sm text-slate-400">
              Ainda não é um guardião parceiro?
            </p>
            <Link to="/afiliados/cadastro" className="text-sm font-bold text-[#40E0D0] hover:text-[#8A2BE2] transition-colors">
              Iniciar jornada de Sincronia
            </Link>
          </CardFooter>
        </Card>
      </main>
      <div className="relative z-10 bg-background/80 backdrop-blur-md border-t border-white/10">
        <Footer />
      </div>
    </div>
  );
}
