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
import { Loader2, DollarSign, Briefcase, ChevronRight, ChevronLeft, ShieldCheck, HeartPulse } from "lucide-react";

export default function AffiliateSignup() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Stepper state
  const [step, setStep] = useState(1);
  
  // Form fields
  const [pixKey, setPixKey] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

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

  const nextStep = () => {
    if (step === 1 && isAuthenticated) {
      setStep(3); // Pula identificação se já logado
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step === 3 && isAuthenticated) {
      setStep(1); // Volta direto pra missão se já logado
    } else {
      setStep(step - 1);
    }
  };

  const handleCreateAccount = async () => {
    setIsSubmitting(true);
    try {
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
            description: "Você já possui uma conta. Faça login para vincular seu perfil de parceiro.",
            variant: "destructive"
          });
          navigate("/login-cliente");
          return;
        }
        throw authError;
      }

      // Se a sessão for nula, significa que a confirmação de e-mail está habilitada no Supabase
      if (!authData.session) {
        setEmailVerificationSent(true);
      } else {
        // Se já logou direto, avança para o passo do PIX
        setIsAuthenticated(true);
        setUser(authData.user);
        setStep(3);
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Interferência",
        description: error.message || "Não foi possível criar a conta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePixKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast({
        title: "Sessão inválida",
        description: "Você precisa estar logado para cadastrar o PIX.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { error: affiliateError } = await supabase.from("affiliates").insert({
        user_id: user.id,
        referral_code: referralCode,
        pix_key: pixKey,
        status: "pending"
      });

      if (affiliateError) throw affiliateError;

      toast({
        title: "Sincronização Concluída!",
        description: "Seu canal está em análise. Em breve você terá acesso ao portal de recompensas.",
      });
      
      navigate("/minha-conta");
      
    } catch (error: any) {
      let errorMessage = error.message || "Não foi possível concluir. Tente novamente.";
      
      if (errorMessage.includes("security purposes") || errorMessage.includes("rate limit") || errorMessage.includes("seconds")) {
        errorMessage = "O nosso escudo de segurança detectou múltiplas tentativas rápidas. Por favor, respire fundo e aguarde cerca de 1 minuto para tentar novamente.";
      }

      console.error(error);
      toast({
        title: "Interferência no processo",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#40E0D0]" />
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
        <Card className="w-full max-w-2xl shadow-2xl border-white/10 bg-background/40 backdrop-blur-xl transition-all duration-500">
          
          {/* Header Progressivo */}
          <CardHeader className="text-center pb-6 border-b border-white/5">
            <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-inner">
              {step === 1 ? <HeartPulse className="w-8 h-8 text-[#8A2BE2]" /> : 
               step === 2 ? <Briefcase className="w-8 h-8 text-[#40E0D0]" /> : 
               <ShieldCheck className="w-8 h-8 text-[#FFD700]" />}
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
              {step === 1 ? "Portal de Sincronia" : 
               step === 2 ? "A Sua Identidade" : 
               "Canal de Recompensas"}
            </CardTitle>
            
            {/* Stepper Dots */}
            <div className="flex justify-center items-center gap-2 mt-4">
              <div className={`h-2 rounded-full transition-all duration-300 ${step >= 1 ? 'w-8 bg-[#8A2BE2]' : 'w-2 bg-white/20'}`} />
              <div className={`h-2 rounded-full transition-all duration-300 ${step >= 2 ? 'w-8 bg-[#40E0D0]' : 'w-2 bg-white/20'}`} />
              <div className={`h-2 rounded-full transition-all duration-300 ${step >= 3 ? 'w-8 bg-[#FFD700]' : 'w-2 bg-white/20'}`} />
            </div>
          </CardHeader>
          
          <CardContent className="pt-8">
            <form onSubmit={step === 3 ? handleSavePixKey : (e) => e.preventDefault()} className="space-y-6">
              
              {/* Email Verification Required Message */}
              {emailVerificationSent && (
                <div className="space-y-6 text-center animate-fade-in py-8">
                  <div className="mx-auto w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-[#40E0D0]/30 shadow-[0_0_30px_rgba(64,224,208,0.2)]">
                    <ShieldCheck className="w-10 h-10 text-[#40E0D0]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Quase lá, Guardião!</h3>
                  <p className="text-slate-300 max-w-md mx-auto">
                    Para protegermos a rede, precisamos que você confirme a sua identidade. 
                    Enviamos um feixe de luz (e-mail) para <strong>{email}</strong>.
                  </p>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg mt-6 text-sm text-slate-400 max-w-md mx-auto">
                    Por favor, clique no link de verificação no seu e-mail. Após fazer isso, faça o login e volte a esta página para cadastrar sua chave PIX e concluir sua jornada.
                  </div>
                  <Button 
                    type="button" 
                    onClick={() => navigate("/login-cliente")}
                    className="w-full max-w-sm h-14 mt-6 text-lg font-bold text-white bg-gradient-to-r from-[#40E0D0] to-[#8A2BE2] hover:opacity-90 border-0"
                  >
                    Ir para Login
                  </Button>
                </div>
              )}

              {/* STEP 1: A Missão (Thoth's Copy) */}
              {step === 1 && !emailVerificationSent && (
                <div className="space-y-6 text-slate-300 leading-relaxed animate-fade-in">
                  <h3 className="text-xl font-bold text-white mb-2">A Nossa Missão: Recalibrando as Vias da Cidade</h3>
                  <p>
                    O trânsito moderno deixou de ser um mero desafio logístico e se tornou um verdadeiro campo de exaustão para a nossa <strong>Antena Biológica</strong>. O estresse constante ao volante, a urgência e a poluição sonora induzem uma espessa <strong>Névoa Química (Brain Fog)</strong> no organismo dos motoristas.
                  </p>
                  <p>
                    Nossa missão é transformar as ruas em redes de <strong>Bio-Empatia</strong>, limpando os <strong>Filtros de Percepção</strong> de quem dirige para que tomem decisões mais conscientes, seguras e humanas.
                  </p>
                  
                  <div className="bg-white/5 border border-[#8A2BE2]/30 p-5 rounded-lg mt-6">
                    <h4 className="text-lg font-bold text-[#8A2BE2] mb-2">O Fluxo de Expansão</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="text-[#40E0D0] font-bold">1.</span>
                        <span><strong>Sinalização:</strong> Você compartilha nossa solução com sua rede.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#40E0D0] font-bold">2.</span>
                        <span><strong>Impacto:</strong> Cada pessoa conectada inicia seu próprio processo de cura do estresse.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#40E0D0] font-bold">3.</span>
                        <span><strong>Ressonância:</strong> A energia emitida retorna. Por cada conexão, você recebe uma fração da abundância.</span>
                      </li>
                    </ul>
                  </div>

                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="w-full h-14 text-lg font-bold text-white bg-gradient-to-r from-[#8A2BE2] to-[#40E0D0] hover:opacity-90 border-0 shadow-[0_0_20px_rgba(138,43,226,0.3)] mt-4"
                  >
                    Quero me tornar um Guardião <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              )}

              {/* STEP 2: Identificação (Nome, Email, Senha) */}
              {step === 2 && !isAuthenticated && !emailVerificationSent && (
                <div className="space-y-5 animate-fade-in">
                  <p className="text-slate-300 text-center mb-6">
                    Para que possamos emitir a sua credencial de parceiro, precisamos firmar sua identidade neste portal.
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-slate-200">Nome Completo</Label>
                    <Input 
                      id="fullName" 
                      placeholder="Seu nome completo" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={step === 2}
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
                      required={step === 2}
                      className="h-12 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-[#40E0D0]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-200">Senha de Acesso Segura</Label>
                    <Input 
                      id="password" 
                      type="password"
                      placeholder="Crie uma senha forte" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={step === 2}
                      className="h-12 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-[#40E0D0]"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={prevStep} className="w-1/3 h-12 border-white/10 bg-transparent text-white hover:bg-white/5">
                      <ChevronLeft className="mr-2 w-4 h-4" /> Voltar
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleCreateAccount}
                      disabled={isSubmitting || !fullName || !email || !password}
                      className="w-2/3 h-12 font-bold text-white bg-gradient-to-r from-[#40E0D0] to-[#8A2BE2] hover:opacity-90 border-0"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Avançar "} 
                      {!isSubmitting && <ChevronRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Chave PIX */}
              {step === 3 && !emailVerificationSent && (
                <div className="space-y-5 animate-fade-in">
                  <div className="bg-black/30 border border-[#FFD700]/30 p-5 rounded-lg text-slate-300 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <ShieldCheck className="w-24 h-24 text-[#FFD700]" />
                    </div>
                    {isAuthenticated && <p className="text-[#40E0D0] font-bold mb-2 text-lg">Olá, {user?.user_metadata?.full_name || 'Guardião'}!</p>}
                    <p className="relative z-10">
                      Na ciência e no cosmos, toda troca de energia exige um canal desobstruído para fluir de forma eficiente.
                    </p>
                    <p className="relative z-10 mt-2">
                      Para que possamos honrar sua contribuição e enviar os frutos financeiros dessa expansão, precisamos estabelecer nossa <strong>ponte material</strong>.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="pix" className="text-slate-200">Seu Canal de Recompensas (Chave PIX)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFD700] w-5 h-5" />
                      <Input 
                        id="pix" 
                        placeholder="CPF, E-mail, Celular ou Aleatória" 
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        required={step === 3}
                        className="h-14 pl-10 text-lg font-medium tracking-wide bg-black/40 border-[#FFD700]/30 text-white placeholder:text-slate-600 focus:border-[#FFD700] shadow-[inset_0_0_10px_rgba(255,215,0,0.05)]"
                      />
                    </div>
                    <p className="text-xs text-slate-400">Ambiente criptografado. Suas informações financeiras estão blindadas.</p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={prevStep} className="w-1/3 h-14 border-white/10 bg-transparent text-white hover:bg-white/5">
                      <ChevronLeft className="mr-2 w-4 h-4" /> Voltar
                    </Button>
                    <Button 
                      type="submit" 
                      className="w-2/3 h-14 text-lg font-bold text-black bg-[#FFD700] hover:bg-[#FFC000] border-0 transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.3)]" 
                      disabled={isSubmitting || !pixKey}
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
                      Finalizar Sincronização
                    </Button>
                  </div>
                </div>
              )}

            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center py-5 border-t border-white/5 bg-black/10 rounded-b-xl">
            <p className="text-sm font-bold text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
              ✨ Comissão inicial de R$ 10,00 por conexão gerada.
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
