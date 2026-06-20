import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import Header from "@/components/Header";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || "/admin";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Acesso Negado",
        description: "Credenciais inválidas. Tente novamente.",
        variant: "destructive",
      });
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      <Header />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] -z-10" />
      
      <div className="w-full max-w-md p-8 glass-card rounded-2xl border border-white/10 animate-fade-in relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-background/50 border border-white/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-accent" />
          </div>
        </div>
        
        <h2 className="text-2xl font-heading font-bold text-center text-foreground mb-2">Comando Central</h2>
        <p className="text-muted-foreground text-center mb-8 text-sm">Insira suas credenciais para acessar o painel de automação.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input 
              type="email" 
              placeholder="E-mail de Administrador" 
              className="bg-background/50 border-border"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input 
              type="password" 
              placeholder="Senha de Acesso" 
              className="bg-background/50 border-border"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={loading}
          >
            {loading ? "Autenticando..." : "Entrar no Sistema"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
