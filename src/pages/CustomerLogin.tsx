import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, Mail, Lock, User } from "lucide-react";

export default function CustomerLogin() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showLinkAccount, setShowLinkAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login-cliente`,
            data: { full_name: name, role: 'customer' }
          }
        });
        if (error) {
          if (error.message.includes("User already registered") || error.message.includes("already exists")) {
            toast({
              title: "E-mail já cadastrado",
              description: "Você já possui uma conta (possivelmente como parceiro). Confirme sua senha para habilitar o painel de cliente.",
            });
            setShowLinkAccount(true);
            return;
          }
          throw error;
        }
        
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar o cadastro.",
        });
        setIsEmailSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        });
        navigate("/minha-conta");
      }
    } catch (error: any) {
      toast({
        title: "Erro na autenticação",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccount = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      await supabase.auth.updateUser({
        data: { is_customer: true, role: 'customer' }
      });
      
      toast({
        title: "Contas Vinculadas!",
        description: "Seu perfil de cliente foi ativado com sucesso.",
      });
      navigate("/minha-conta");
    } catch (error: any) {
      toast({
        title: "Erro ao vincular",
        description: error.message || "Senha incorreta ou erro no servidor.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

        <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl z-10 text-white rounded-3xl overflow-hidden">
          {isEmailSent ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                <Mail className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Verifique seu e-mail!</h2>
              <p className="text-indigo-200">
                Enviamos um link de confirmação para <br/>
                <strong className="text-white">{email}</strong>
              </p>
              <p className="text-sm text-indigo-200/60 mt-4">
                Clique no link do e-mail para ativar sua conta e depois retorne aqui para fazer o login.
              </p>
              <Button 
                variant="outline" 
                onClick={() => { setIsEmailSent(false); setIsSignUp(false); }}
                className="mt-6 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/20 hover:text-white"
              >
                Voltar para o Login
              </Button>
            </div>
          ) : (
            <>
              {showLinkAccount ? (
                <>
                  <CardHeader className="space-y-3 pb-6 text-center">
                    <CardTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">
                      Conta Localizada!
                    </CardTitle>
                    <CardDescription className="text-indigo-200/80 text-base">
                      O e-mail <strong>{email}</strong> já existe no sistema. Insira sua senha para vincular o painel de Cliente à sua conta.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2 relative">
                        <Label htmlFor="link_password" className="text-indigo-200">Senha de Acesso</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                          <Input 
                            id="link_password" 
                            type="password"
                            placeholder="Sua senha de login" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 rounded-xl h-12"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={() => setShowLinkAccount(false)} className="w-1/3 h-12 border-white/10 bg-transparent text-white hover:bg-white/5">
                          Voltar
                        </Button>
                        <Button 
                          type="button" 
                          onClick={handleLinkAccount}
                          disabled={loading || !password}
                          className="w-2/3 h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                        >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Vincular e Entrar"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardHeader className="space-y-3 pb-6 text-center">
                <CardTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">
                  {isSignUp ? "Crie sua conta" : "Bem-vindo de volta"}
                </CardTitle>
            <CardDescription className="text-indigo-200/80 text-base">
              {isSignUp 
                ? "Junte-se à nossa comunidade por um trânsito mais empático." 
                : "Acesse sua conta para gerenciar seus pedidos e dados."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2 relative">
                  <Label htmlFor="name" className="text-indigo-200">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="João da Silva" 
                      required={isSignUp}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 rounded-xl h-12"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2 relative">
                <Label htmlFor="email" className="text-indigo-200">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="voce@exemplo.com.br" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 rounded-xl h-12"
                  />
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="password" className="text-indigo-200">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 rounded-xl h-12"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 mt-6"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? "Criar Conta" : "Entrar")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2 pb-8">
            <div className="text-center text-sm text-indigo-200/60">
              {isSignUp ? "Já tem uma conta? " : "Ainda não tem conta? "}
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)} 
                className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
              >
                {isSignUp ? "Faça login" : "Cadastre-se"}
              </button>
            </div>
            
            {!isSignUp && (
              <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                Esqueci minha senha
              </button>
            )}
          </CardFooter>
                </>
              )}
            </>
          )}
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
