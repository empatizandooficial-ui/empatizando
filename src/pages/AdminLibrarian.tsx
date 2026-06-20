import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Library, Upload, Search, BookOpen, Trash2 } from "lucide-react";

interface KnowledgeItem {
  id: string;
  excerpt: string;
  source: string;
  date: string;
}

const AdminLibrarian = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [sourceName, setSourceName] = useState("");

  // Dados simulados para visualização antes da integração com o BD vetorial
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([
    {
      id: "1",
      excerpt: "A frequência de 432Hz é conhecida por suas propriedades curativas e alinhamento com a natureza...",
      source: "Manual de Frequências.txt",
      date: new Date().toLocaleDateString()
    },
    {
      id: "2",
      excerpt: "O arquétipo do Mago representa a transformação, a alquimia interior e a manifestação da realidade desejada...",
      source: "Estudo de Arquétipos (Input Manual)",
      date: new Date().toLocaleDateString()
    }
  ]);

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      toast({ title: "Erro", description: "O conteúdo não pode estar vazio.", variant: "destructive" });
      return;
    }

    setLoading(true);
    // Aqui faremos a chamada para a Edge Function de Ingestão no futuro
    setTimeout(() => {
      const newItem: KnowledgeItem = {
        id: Math.random().toString(36).substr(2, 9),
        excerpt: content.substring(0, 100) + "...",
        source: sourceName || "Input Manual",
        date: new Date().toLocaleDateString()
      };
      setKnowledgeBase([newItem, ...knowledgeBase]);
      setContent("");
      setSourceName("");
      setLoading(false);
      toast({
        title: "Conhecimento Absorvido! 📚",
        description: "O Bibliotecário processou o texto e guardou no banco vetorial.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header darkTextOnTop />
      
      <main className="flex-grow pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-2 flex items-center gap-3">
              <Library className="w-8 h-8 text-cyan-500" /> O Bibliotecário
            </h1>
            <p className="text-muted-foreground text-lg">
              Alimente o Agente de Contexto. Tudo que for inserido aqui formará o conhecimento base para a geração dos roteiros do Thoth.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload/Ingestão */}
            <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden h-fit">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
              
              <h2 className="text-xl font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-500" /> Inserir Novo Conhecimento
              </h2>

              <form onSubmit={handleIngest} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Fonte do Conhecimento (Opcional)</label>
                  <input 
                    type="text"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    placeholder="Ex: Livro 'O Caibalion' Cap. 1, Link do Artigo..."
                    className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Texto Bruto / Conteúdo</label>
                  <Textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Cole aqui o texto, transcrição de vídeo ou artigo que deseja que o Bibliotecário memorize..."
                    className="min-h-[250px] bg-background/50 border-border resize-none focus-visible:ring-cyan-500"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading || !content}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  {loading ? "Vetorizando e Armazenando..." : "Absorver Conhecimento"}
                </Button>
              </form>
            </div>

            {/* Lista de Conhecimento */}
            <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col h-full min-h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-500" /> Acervo Neural
                </h2>
                <div className="relative">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    placeholder="Buscar no acervo..."
                    className="bg-background/50 border border-border rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                {knowledgeBase.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-cyan-500/30 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md">
                        {item.source}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                        <button className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      "{item.excerpt}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLibrarian;
