import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BrainCircuit, CalendarCheck, ShieldCheck, Target, HeartPulse, ChevronRight, Stethoscope } from "lucide-react";

export default function ForSpecialists() {
  const benefits = [
    {
      icon: <Target className="w-6 h-6 text-rose-500" />,
      title: "Match Perfeito (Captação)",
      description: "Nosso algoritmo cruza a sua especialidade com a dor exata do paciente e a localização, trazendo leads altamente qualificados direto para a sua agenda."
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-indigo-500" />,
      title: "Pré-Anamnese com IA",
      description: "Antes do seu primeiro 'Olá', nossa inteligência artificial conversa com o paciente e entrega um dossiê clínico estruturado para você."
    },
    {
      icon: <CalendarCheck className="w-6 h-6 text-teal-500" />,
      title: "Agenda Inteligente & Lembretes",
      description: "Acabe com o 'no-show'. Sistema de agendamento próprio com disparos automáticos de lembretes via WhatsApp para os pacientes."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      title: "Telemedicina Nativa Segura",
      description: "Sala de vídeo integrada, criptografada (padrão LGPD) e sem limite de tempo. Chega de pagar licenças de ferramentas externas."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header darkTextOnTop={true} />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden bg-stone-50 border-b border-stone-200">
          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-700 font-semibold text-sm mb-6 animate-fade-in">
              <Stethoscope size={16} />
              <span>Para Psicólogos, Terapeutas e Psiquiatras</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-stone-800 tracking-tight max-w-4xl mx-auto mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Evolua sua clínica para o <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-teal-500">futuro da saúde</span>.
            </h1>
            
            <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
              O Empatizando não é apenas uma ponte até o paciente. É o seu novo Sistema Operacional: captação inteligente, IA clínica e gestão completa em um só lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-stone-800 hover:bg-stone-900 text-white shadow-xl shadow-stone-900/20 w-full sm:w-auto group" onClick={() => window.location.href='/login'}>
                Criar Conta Gratuita
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-sm text-stone-500 sm:hidden">Período de fundadores 100% gratuito</p>
            </div>
            <p className="hidden sm:block text-sm text-stone-500 mt-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
              Acesso pioneiro gratuito. Sem taxas de setup.
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-stone-800 mb-4">
                Tudo o que você precisa para focar no paciente
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto">
                Deixamos a burocracia e a captação com a inteligência artificial, para que você possa dedicar 100% da sua energia à cura e ao acolhimento.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-stone-50 p-8 rounded-3xl border border-stone-100 hover:shadow-xl hover:border-stone-200 transition-all duration-300 group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-stone-800 mb-3">{benefit.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          <div className="container mx-auto px-6 relative z-10 text-center">
            <HeartPulse className="w-16 h-16 text-rose-500 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Junte-se à Revolução da Saúde Mental</h2>
            <p className="text-stone-300 max-w-2xl mx-auto text-lg mb-10">
              Profissionais excepcionais merecem tecnologia excepcional. Seja um dos primeiros a adotar a plataforma e garanta benefícios vitalícios de pioneiro.
            </p>
            <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-rose-500 hover:bg-rose-600 text-white border-0 shadow-lg shadow-rose-500/30" onClick={() => window.location.href='/login'}>
              Iniciar Cadastro Profissional
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
