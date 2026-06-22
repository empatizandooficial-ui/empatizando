import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Library, Upload, Mic, Film, BookOpen, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const AdminStudio = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState("");
  const [scriptInstagram, setScriptInstagram] = useState("");
  const [scriptTiktok, setScriptTiktok] = useState("");
  const [scriptYoutube, setScriptYoutube] = useState("");
  
  const [knowledgeTitle, setKnowledgeTitle] = useState("");
  const [knowledgeType, setKnowledgeType] = useState("book");
  const [knowledgeContent, setKnowledgeContent] = useState("");

  const handleGenerateDocumentary = async () => {
    if (!theme) {
      toast({ title: "Atenção", description: "Digite o tema do documentário primeiro.", variant: "destructive" });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('thoth-generate', {
        body: { prompt: theme, platforms: ['instagram', 'tiktok', 'youtube'] }
      });

      if (error) throw error;

      setScriptInstagram(data.instagram || "Sem retorno");
      setScriptTiktok(data.tiktok || "Sem retorno");
      setScriptYoutube(data.youtube || "Sem retorno");
      
      toast({
        title: "Roteiro Épico Criado! 🎬",
        description: `Thoth AI utilizou ${data.used_context_chunks || 0} fragmentos de memória do Bibliotecário.`,
      });
    } catch (err: any) {
      console.error("Erro ao gerar:", err);
      toast({ 
        title: "Erro na Geração", 
        description: err.message || "Erro desconhecido. Verifique as configurações.", 
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!knowledgeTitle || !knowledgeContent) {
      toast({ title: "Erro", description: "Preencha o título e o conteúdo do acervo.", variant: "destructive" });
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('librarian-ingest', {
        body: { content: knowledgeContent, source: knowledgeTitle }
      });

      if (error) throw error;

      toast({
        title: "Salvo no Acervo!",
        description: data.message || "O Subagente Bibliotecário processou esse conteúdo para gerar novos insights.",
      });
      
      setKnowledgeTitle("");
      setKnowledgeContent("");
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-2 flex items-center gap-3">
              <Film className="w-8 h-8 text-accent" /> Estúdio de Criação
            </h1>
            <p className="text-muted-foreground text-lg">
              A Fábrica de Documentários e a Base de Conhecimento do Thoth AI.
            </p>
          </div>

          <Tabs defaultValue="documentary" className="w-full">
            <TabsList className="mb-8 bg-background/50 border border-border">
              <TabsTrigger value="documentary" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Sparkles className="w-4 h-4" /> Fábrica de Documentários
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                <Library className="w-4 h-4" /> Atalho Bibliotecário
              </TabsTrigger>
            </TabsList>

            {/* ABA: Fábrica de Documentários */}
            <TabsContent value="documentary">
              <div className="grid lg:grid-cols-2 gap-8">
                
                {/* Lado Esquerdo: Input */}
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-foreground font-semibold text-lg flex items-center gap-2">
                      <BrainCircuit className="w-5 h-5 text-accent" /> Mente Mestra (Thoth AI)
                    </Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Descreva a ideia central do vídeo, o conceito sumério ou a hierarquia que deseja explorar. A IA aplicará copywriting magnético buscando contexto no Bibliotecário.
                    </p>
                    <Textarea 
                      placeholder="Ex: Quero um vídeo sobre Enki e a alteração genética do Homo Sapiens..."
                      className="min-h-[150px] bg-background/50 border-border resize-none"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleGenerateDocumentary}
                    disabled={isGenerating || !theme}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {isGenerating ? "Canalizando Conhecimento..." : (
                      <><Sparkles className="w-4 h-4 mr-2" /> Gerar Roteiros Múltiplos</>
                    )}
                  </Button>

                  <div className="pt-6 border-t border-border/50 space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Mic className="w-4 h-4" /> Integrações Futuras (Áudio e Vídeo)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      No momento, você pode copiar o roteiro gerado e jogar nos serviços de IA abaixo. Quando desejar centralizar os custos, ativaremos as APIs aqui mesmo.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="border-border hover:bg-accent/10 hover:text-accent w-full text-xs">
                        <Upload className="w-3 h-3 mr-1" /> Sintetizar Voz (ElevenLabs)
                      </Button>
                      <Button variant="outline" className="border-border hover:bg-accent/10 hover:text-accent w-full text-xs">
                        <Film className="w-3 h-3 mr-1" /> Gerar Cenas (Luma AI)
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Lado Direito: Output */}
                <div className="space-y-6">
                  {(scriptInstagram || scriptTiktok || scriptYoutube) ? (
                    <>
                      {scriptInstagram && (
                        <div className="glass-card p-6 rounded-2xl border border-pink-500/30 bg-pink-500/5">
                          <h3 className="font-heading font-semibold text-lg mb-4 text-pink-500 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" /> Roteiro Instagram (Reels)
                          </h3>
                          <div className="bg-background/80 p-4 rounded-xl border border-border">
                            <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed">
                              {scriptInstagram}
                            </pre>
                          </div>
                        </div>
                      )}
                      
                      {scriptTiktok && (
                        <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/5">
                          <h3 className="font-heading font-semibold text-lg mb-4 text-cyan-400 flex items-center gap-2">
                            <Film className="w-5 h-5" /> Roteiro TikTok
                          </h3>
                          <div className="bg-background/80 p-4 rounded-xl border border-border">
                            <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed">
                              {scriptTiktok}
                            </pre>
                          </div>
                        </div>
                      )}

                      {scriptYoutube && (
                        <div className="glass-card p-6 rounded-2xl border border-red-500/30 bg-red-500/5">
                          <h3 className="font-heading font-semibold text-lg mb-4 text-red-400 flex items-center gap-2">
                            <Film className="w-5 h-5" /> Roteiro YouTube
                          </h3>
                          <div className="bg-background/80 p-4 rounded-xl border border-border">
                            <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed">
                              {scriptYoutube}
                            </pre>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-2xl opacity-50 min-h-[300px]">
                      <BrainCircuit className="w-12 h-12 mb-4" />
                      <p>Aguardando ideia central para roteirizar o documentário...</p>
                    </div>
                  )}
                </div>

              </div>
            </TabsContent>

            {/* ABA: Acervo de Dados */}
            <TabsContent value="knowledge">
              <div className="glass-card p-6 rounded-2xl border border-white/10 max-w-3xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-accent" /> Base de Conhecimento
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Alimente o Subagente Bibliotecário. Ele lerá os materiais e criará um repertório profundo para os roteiros do Thoth AI.
                  </p>
                </div>

                <form onSubmit={handleSaveKnowledge} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label>Título / Fonte</Label>
                      <Input 
                        placeholder="Ex: Tábua de Esmeralda" 
                        value={knowledgeTitle}
                        onChange={(e) => setKnowledgeTitle(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo</Label>
                      <select 
                        value={knowledgeType}
                        onChange={(e) => setKnowledgeType(e.target.value)}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="book">Livro / Artigo</option>
                        <option value="video">Transcrição</option>
                        <option value="custom">Conhecimento Oculto</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Conteúdo Bruto</Label>
                    <Textarea 
                      placeholder="Cole aqui o texto..."
                      className="min-h-[200px] bg-background/50 resize-none"
                      value={knowledgeContent}
                      onChange={(e) => setKnowledgeContent(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                    <Library className="w-4 h-4 mr-2" /> Ingerir no Acervo
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
};

export default AdminStudio;
