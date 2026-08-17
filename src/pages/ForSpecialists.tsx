import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  BrainCircuit, CalendarCheck, ShieldCheck, Target, HeartPulse, 
  ChevronRight, Stethoscope, CheckCircle2, XCircle, Sparkles, 
  HelpCircle, Send, Award, Lock, Loader2
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ForSpecialists() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    councilId: "", // CRP / CRM
    specialty: "Psicologia Clínica",
  });

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        email: formData.email.trim().toLowerCase(),
      });

      if (error && !error.message.includes('unique')) {
        console.warn("Lead registration note:", error);
      }

      toast({
        title: "🎉 Candidatura de Pioneiro Recebida!",
        description: `Obrigado, Dr(a). ${formData.name}. Nossa equipe entrará em contato via WhatsApp (${formData.phone}) com seus acessos prioritários.`,
      });

      setModalOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        councilId: "",
        specialty: "Psicologia Clínica",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao enviar",
        description: err.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <Target className="w-6 h-6 text-rose-500" />,
      title: "Match Perfeito (Captação)",
      description: "Nosso algoritmo cruza a sua especialidade com a dor exata do paciente e a localização, trazendo consultas altamente qualificadas direto para a sua agenda."
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-indigo-500" />,
      title: "Pré-Anamnese com IA",
      description: "Antes do seu primeiro 'Olá', nossa inteligência artificial conversa com o paciente e entrega um dossiê clínico estruturado para você economizar tempo."
    },
    {
      icon: <CalendarCheck className="w-6 h-6 text-teal-500" />,
      title: "Agenda Inteligente & Lembretes",
      description: "Acabe com o 'no-show'. Sistema de agendamento próprio com disparos automáticos de lembretes via WhatsApp para os pacientes confirmarem presença."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      title: "Telemedicina Nativa Segura",
      description: "Sala de vídeo integrada, criptografada (padrão LGPD) e sem limite de tempo. Chega de pagar licenças de ferramentas externas caras."
    }
  ];

  const comparison = [
    { feature: "Taxa de Adesão / Setup", empatizando: "R$ 0 (Pioneiros)", others: "R$ 500 - R$ 1.200" },
    { feature: "Pré-Anamnese com IA", empatizando: "Sim (Incluso)", others: "Não existe" },
    { feature: "Sala de Telemedicina Criptografada", empatizando: "Nativa e Ilimitada", others: "Exige Zoom/Google Meet" },
    { feature: "Disparos WhatsApp Anti No-Show", empatizando: "Automático", others: "Manual ou Pago à parte" },
    { feature: "Perfil Verificado no Ecossistema", empatizando: "Selo de Especialista", others: "Listagem genérica" },
  ];

  const faqs = [
    {
      q: "Como funciona o repasse financeiro das consultas?",
      a: "O pagamento do paciente é processado de forma 100% segura através do nosso gateway. O saldo líquido é repassado automaticamente para sua conta bancária cadastrada via PIX ou TED, com extrato detalhado no seu painel."
    },
    {
      q: "A plataforma está em conformidade com as resoluções do CFP, CFM e LGPD?",
      a: "Sim! Todo o fluxo de dados, prontuários eletrônicos e salas de teleconsulta utilizam criptografia de ponta a ponta e estão estritamente alinhados às diretrizes do Conselho Federal de Psicologia (CFP), Conselho Federal de Medicina (CFM) e LGPD."
    },
    {
      q: "Como a Inteligência Artificial auxilia no atendimento?",
      a: "A IA do Empatizando atua exclusivamente como assistente de acolhimento e triagem inicial (pré-anamnese). Ela nunca faz diagnósticos nem substitui o julgamento clínico humano — seu papel é estruturar o histórico de queixas para que o especialista ganhe até 15 minutos em cada sessão."
    },
    {
      q: "O que é o programa de Pioneiros / Fundadores?",
      a: "Os primeiros profissionais credenciados garantem isenção vitalícia de taxas de setup e prioridade no algoritmo de distribuição de pacientes na sua região de atuação."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header darkTextOnTop={true} />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative pt-20 pb-28 overflow-hidden bg-gradient-to-b from-stone-50 via-white to-stone-50 border-b border-stone-200">
          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/80 text-rose-700 font-semibold text-sm mb-6 animate-fade-in shadow-sm">
              <Stethoscope size={16} />
              <span>Para Psicólogos, Terapeutas, Psiquiatras e Clínicas</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-stone-900 tracking-tight max-w-4xl mx-auto mb-6 animate-fade-in leading-[1.15]">
              Evolua sua clínica para o <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-teal-500">futuro da saúde</span>.
            </h1>
            
            <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed">
              O Empatizando não é apenas um diretório de contatos. É o seu novo Sistema Operacional completo: captação qualificada, IA de triagem clínica e telemedicina em um só lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-stone-900 hover:bg-stone-800 text-white shadow-xl shadow-stone-900/20 w-full sm:w-auto group">
                    <Sparkles className="mr-2 w-5 h-5 text-amber-400" />
                    Garantir Acesso Pioneiro Gratuito
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 border-stone-200 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold font-heading text-stone-900 flex items-center gap-2">
                      <Award className="w-6 h-6 text-rose-500" />
                      Credenciamento de Pioneiro
                    </DialogTitle>
                    <DialogDescription className="text-stone-600">
                      Preencha seus dados para receber o convite exclusivo sem taxas de setup e com benefícios vitalícios.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleLeadSubmit} className="space-y-4 pt-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-stone-700 font-semibold text-sm">Nome Completo</Label>
                      <Input 
                        id="name" 
                        required 
                        placeholder="Dr(a). Seu Nome" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="rounded-xl border-stone-300 focus:ring-rose-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-stone-700 font-semibold text-sm">E-mail Profissional</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        required 
                        placeholder="doutor@clinica.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="rounded-xl border-stone-300 focus:ring-rose-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-stone-700 font-semibold text-sm">WhatsApp</Label>
                        <Input 
                          id="phone" 
                          required 
                          placeholder="(11) 99999-9999" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="rounded-xl border-stone-300 focus:ring-rose-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="councilId" className="text-stone-700 font-semibold text-sm">CRP / CRM / Reg.</Label>
                        <Input 
                          id="councilId" 
                          required 
                          placeholder="Ex: CRP 06/123456" 
                          value={formData.councilId}
                          onChange={(e) => setFormData({...formData, councilId: e.target.value})}
                          className="rounded-xl border-stone-300 focus:ring-rose-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="specialty" className="text-stone-700 font-semibold text-sm">Especialidade Principal</Label>
                      <Input 
                        id="specialty" 
                        required 
                        placeholder="Ex: TCC, Ansiedade, Terapia de Casal, Psiquiatria..." 
                        value={formData.specialty}
                        onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                        className="rounded-xl border-stone-300 focus:ring-rose-500"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={submitting} 
                      className="w-full h-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-base shadow-lg shadow-rose-500/20 mt-2"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                      Solicitar Credenciamento
                    </Button>
                    
                    <p className="text-[11px] text-center text-stone-500 flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3 text-green-600" /> Seus dados estão protegidos por sigilo e padrão LGPD.
                    </p>
                  </form>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-lg rounded-full border-stone-300 hover:bg-stone-100 text-stone-800 w-full sm:w-auto"
                onClick={() => navigate('/login')}
              >
                Já sou Credenciado
              </Button>
            </div>
            <p className="text-sm text-stone-500 mt-4 animate-fade-in">
              ⚡ Acesso pioneiro gratuito. Vagas limitadas para o programa de fundadores.
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-stone-900 mb-4">
                Tudo o que você precisa para focar no paciente
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto text-base md:text-lg">
                Deixamos a burocracia, os lembretes e a triagem inicial com a tecnologia, para que você possa dedicar 100% da sua energia à cura e ao acolhimento.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-stone-50 p-8 rounded-3xl border border-stone-100 hover:shadow-xl hover:border-stone-200 transition-all duration-300 group flex flex-col">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">{benefit.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed mt-auto">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20 bg-stone-50 border-y border-stone-200">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-3">
                Comparativo Tático
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-stone-900">
                Por que migrar para o Empatizando?
              </h2>
            </div>

            <div className="bg-white rounded-3xl shadow-md border border-stone-200 overflow-hidden">
              <div className="grid grid-cols-3 p-4 md:p-6 bg-stone-900 text-white font-bold text-sm md:text-base">
                <div>Recurso</div>
                <div className="text-center text-rose-400">Empatizando</div>
                <div className="text-center text-stone-400">Outras Plataformas</div>
              </div>
              <div className="divide-y divide-stone-100">
                {comparison.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-3 p-4 md:p-6 items-center text-xs md:text-sm">
                    <div className="font-semibold text-stone-800">{item.feature}</div>
                    <div className="text-center font-bold text-rose-600 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                      {item.empatizando}
                    </div>
                    <div className="text-center text-stone-500 flex items-center justify-center gap-1">
                      <XCircle className="w-4 h-4 shrink-0 text-stone-400" />
                      {item.others}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-14">
              <HelpCircle className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-stone-900 mb-3">
                Perguntas Frequentes dos Especialistas
              </h2>
              <p className="text-stone-600 text-sm md:text-base">
                Tire suas principais dúvidas sobre credenciamento, repasses e tecnologia.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border border-stone-200 rounded-2xl px-6 bg-stone-50/50">
                  <AccordionTrigger className="text-left font-bold text-stone-900 hover:text-rose-600 text-base py-5 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-600 text-sm leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Call to Action Final */}
        <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          <div className="container mx-auto px-6 relative z-10 text-center">
            <HeartPulse className="w-16 h-16 text-rose-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Junte-se à Revolução da Saúde Mental</h2>
            <p className="text-stone-300 max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
              Profissionais excepcionais merecem tecnologia excepcional. Seja um dos primeiros a adotar a plataforma e garanta benefícios vitalícios de pioneiro.
            </p>
            <Button 
              size="lg" 
              className="h-14 px-10 text-lg rounded-full bg-rose-500 hover:bg-rose-600 text-white border-0 shadow-lg shadow-rose-500/30" 
              onClick={() => setModalOpen(true)}
            >
              Garantir Minha Vaga de Pioneiro
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
