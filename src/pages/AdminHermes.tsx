import { useState } from "react";
import Header from "@/components/Header";
import { Compass, Search, Loader2, Link2, FileText, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const AdminHermes = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasResults(false);

    // Mock research process
    setTimeout(() => {
      setIsSearching(false);
      setHasResults(true);
      toast({
        title: "Varredura Concluída",
        description: "Golden Data capturado e enviado para a triagem do Bibliotecário.",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <Header darkTextOnTop={false} />
      
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] -z-10" />

      <main className="flex-grow flex flex-col pt-24 pb-16 px-6 max-w-5xl mx-auto w-full">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
              <Compass className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">Laboratório OSINT</h1>
              <p className="text-muted-foreground">Rastreador Web de Fontes Primárias</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Insira o tema oculto (ex: Frequências Solfeggio, Geometria Sagrada)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 bg-white/5 border-white/10 focus:border-emerald-500/50 text-white placeholder:text-muted-foreground/50"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSearching || !query.trim()}
              className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Rastreando...
                </>
              ) : (
                "Iniciar Busca"
              )}
            </Button>
          </form>
        </div>

        {hasResults && (
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
            <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-2 mb-4 text-emerald-400">
                <Database className="w-5 h-5" />
                <h3 className="font-heading font-semibold text-lg">Dados Capturados</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="mt-1"><FileText className="w-4 h-4 text-emerald-400" /></div>
                  <p><strong className="text-foreground">Artigo Científico:</strong> Ressonância e a Água (PDF - 12MB)</p>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="mt-1"><Link2 className="w-4 h-4 text-emerald-400" /></div>
                  <p><strong className="text-foreground">Fonte Primária:</strong> Biblioteca de Escritos Herméticos (URL Extraída)</p>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="mt-1"><FileText className="w-4 h-4 text-emerald-400" /></div>
                  <p><strong className="text-foreground">Resumo AI:</strong> Compilação de 15 páginas extraídas sobre frequências hertzianas.</p>
                </li>
              </ul>
              <Button variant="outline" className="w-full mt-6 border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400">
                Enviar Tudo para Akash (Bibliotecário)
              </Button>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 mb-4 text-white">
                <Search className="w-5 h-5" />
                <h3 className="font-heading font-semibold text-lg">Log de Operações</h3>
              </div>
              <div className="font-mono text-xs text-muted-foreground space-y-2 bg-black/40 p-4 rounded-xl">
                <p className="text-emerald-400">{'>'} Inicializando rotina OSINT...</p>
                <p>{'>'} Varrendo arXiv e PubMed por '{query}'</p>
                <p>{'>'} 43 resultados encontrados.</p>
                <p>{'>'} Filtrando documentos de baixa relevância...</p>
                <p>{'>'} Extraindo textos e metadados...</p>
                <p className="text-emerald-400">{'>'} Pacote Golden Data montado com sucesso.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminHermes;
