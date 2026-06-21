import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Library, Upload, Search, BookOpen, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([]);

  useEffect(() => {
    fetchKnowledgeBase();
  }, []);

  const fetchKnowledgeBase = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setKnowledgeBase(data.map(item => ({
          id: item.id,
          excerpt: item.content.substring(0, 100) + "...",
          source: item.metadata?.source || "Input Manual",
          date: new Date(item.created_at).toLocaleDateString()
        })));
      }
    } catch (error: any) {
      console.error("Erro ao buscar base de conhecimento:", error);
    }
  };

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      toast({ title: "Erro", description: "O conteúdo não pode estar vazio.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Chamada real para a Edge Function de Ingestão
      const { data, error } = await supabase.functions.invoke('librarian-ingest', {
        body: { content, source: sourceName }
      });

      if (error) throw error;

      setContent("");
      setSourceName("");
      
      toast({
        title: "Conhecimento Absorvido! 📚",
        description: data.message || "O Bibliotecário processou o texto e guardou no banco vetorial.",
      });

      // Atualiza a lista
      fetchKnowledgeBase();
    } catch (err: any) {
      console.error("Erro na ingestão:", err);
      toast({ 
        title: "Erro na Ingestão", 
        description: err.message || "Verifique se sua chave da OpenAI está configurada.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('knowledge_base').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Removido", description: "Conhecimento apagado da memória." });
      fetchKnowledgeBase();
    } catch (err: any) {
      toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" });
    }
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
                {knowledgeBase.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-10">O acervo está vazio. O Bibliotecário precisa de leitura.</p>
                ) : (
                  knowledgeBase.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-cyan-500/30 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md">
                          {item.source}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        "{item.excerpt}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLibrarian;
