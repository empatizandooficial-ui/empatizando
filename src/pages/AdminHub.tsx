import Header from "@/components/Header";
import { Film, Zap, Lock, Settings, Library, Compass, BrainCircuit } from "lucide-react";
import { Link } from "react-router-dom";

const AdminHub = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Header darkTextOnTop={false} />
      
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -z-10" />

      <main className="flex-grow flex items-center justify-center pt-24 pb-16 px-6">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-background/50 border border-white/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-accent" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Comando Central
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Selecione o módulo de operação.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto animate-fade-in" style={{ animationDelay: "100ms" }}>
            
            {/* Card Laboratório OSINT */}
            <Link to="/admin/hermes" className="group">
              <div className="glass-card h-full p-10 rounded-3xl border border-white/10 transition-all duration-300 hover:border-emerald-500/50 hover:bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Compass className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-3">Laboratório OSINT</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Casa de Hermes. Rastreador web profundo para buscar fontes primárias e varrer a internet atrás da sabedoria oculta.
                </p>
              </div>
            </Link>

            {/* Card Bibliotecário */}
            <Link to="/admin/librarian" className="group">
              <div className="glass-card h-full p-10 rounded-3xl border border-white/10 transition-all duration-300 hover:border-cyan-500/50 hover:bg-white/5 relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all" />
                <div className="mb-6 inline-flex p-4 rounded-2xl bg-cyan-500/10 text-cyan-500 group-hover:scale-110 transition-transform">
                  <Library className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-3">O Bibliotecário</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Agente de Pesquisa e Contexto. A mente de Akash para estruturar a base de dados vetorial.
                </p>
              </div>
            </Link>

            {/* Card Estúdio */}
            <Link to="/admin/studio" className="group">
              <div className="glass-card h-full p-10 rounded-3xl border border-white/10 transition-all duration-300 hover:border-accent/50 hover:bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 border border-accent/20 group-hover:scale-110 transition-transform">
                  <Film className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-3">Estúdio de Criação</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Fábrica de Documentários. Utilize o Thoth AI para criar roteiros magnéticos e épicos.
                </p>
              </div>
            </Link>

            {/* Card Automação */}
            <Link to="/admin/automation" className="group lg:col-start-1 lg:col-span-1">
              <div className="glass-card h-full p-10 rounded-3xl border border-white/10 transition-all duration-300 hover:border-cyan-500/50 hover:bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-3">Painel de Automação</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A Máquina de Distribuição. Faça o upload das mídias prontas e coloque na Fila de Transmissão.
                </p>
              </div>
            </Link>

            {/* Card Laboratório Neural */}
            <Link to="/admin/settings" className="group">
              <div className="glass-card h-full p-10 rounded-3xl border border-white/10 transition-all duration-300 hover:border-purple-500/50 hover:bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <Settings className="w-8 h-8 text-purple-400" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-3">Laboratório Neural</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Controle Global da IA. Guarde chaves e ajuste as engrenagens ao vivo.
                </p>
              </div>
            </Link>

            {/* Card Painel de Agentes */}
            <Link to="/admin/agents" className="group lg:col-start-3 lg:col-span-1">
              <div className="glass-card h-full p-10 rounded-3xl border border-white/10 transition-all duration-300 hover:border-indigo-500/50 hover:bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-3">Painel de Agentes</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Gerencie as coordenadas, modelos e personalidades de Sálvia, Lumina e cia.
                </p>
              </div>
            </Link>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHub;
