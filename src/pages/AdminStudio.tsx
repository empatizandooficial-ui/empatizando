import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Library, Upload, Mic, Film, BookOpen, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminStudio = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState("");
  const [script, setScript] = useState("");
  const [prompts, setPrompts] = useState("");
  
  const [knowledgeTitle, setKnowledgeTitle] = useState("");
  const [knowledgeType, setKnowledgeType] = useState("book");
  const [knowledgeContent, setKnowledgeContent] = useState("");

  const handleGenerateDocumentary = () => {
    if (!theme) {
      toast({ title: "Atenção", description: "Digite o tema do documentário primeiro.", variant: "destructive" });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulação do Thoth AI gerando o roteiro com gatilhos subliminares e imagens épicas
    setTimeout(() => {
      setScript(
        `[Trilha sonora: Drones graves 432Hz]\n` +
        `[Pausa dramática de 2 segundos]\n` +
        `"Você sempre sentiu que havia algo errado com a história que nos contaram..."\n\n` +
        `[Tom misterioso e grave]\n` +
        `"Muito antes do barro e do sopro divino, seres de escamas e ouro desceram nos vales da antiga Suméria. Eles não vieram criar. Eles vieram extrair."\n\n` +
        `[Acelerar o ritmo]\n` +
        `"Bem-vindo à verdade sobre os Anunnakis e o Criador Caído."`
      );
      
      setPrompts(
        `Cena 1 (0:00): Cinematic wide shot of the cosmos shifting, dark deep space with subtle golden nebulae, ultra realistic, 8k, Unreal Engine 5.\n\n` +
        `Cena 2 (0:05): A towering Anunnaki figure made of shadow and gold standing in the ancient Sumerian desert, glowing amber eyes, mysterious, dramatic lighting, volumetric fog, photorealistic.\n\n` +
        `Cena 3 (0:15): Ancient cuneiform tablets glowing with blue ethereal energy inside a dark temple, macro photography, depth of field.`
      );
      
      setIsGenerating(false);
      
      toast({
        title: "Roteiro Épico Criado! 🎬",
        description: "Thoth AI aplicou a Jornada do Herói e separou os prompts visuais.",
      });
    }, 2500);
  };

  const handleSaveKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!knowledgeTitle || !knowledgeContent) {
      toast({ title: "Erro", description: "Preencha o título e o conteúdo do acervo.", variant: "destructive" });
      return;
    }
    
    toast({
      title: "Salvo no Acervo!",
      description: "O Subagente Bibliotecário vai processar esse conteúdo para gerar novos insights.",
    });
    
    setKnowledgeTitle("");
    setKnowledgeContent("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header darkTextOnTop />
      
      <main className="flex-grow pt-32 pb-16 px-6">
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
                <Library className="w-4 h-4" /> Acervo de Dados
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
                      Descreva a ideia central do vídeo, o conceito sumério ou a hierarquia que deseja explorar. A IA aplicará copywriting magnético e arquétipos visuais.
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
                      <><Sparkles className="w-4 h-4 mr-2" /> Gerar Roteiro e Prompts</>
                    )}
                  </Button>

                  <div className="pt-6 border-t border-border/50 space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Mic className="w-4 h-4" /> Integrações (Áudio e Vídeo)
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
                  {script && (
                    <div className="glass-card p-6 rounded-2xl border border-accent/30 bg-accent/5">
                      <h3 className="font-heading font-semibold text-lg mb-4 text-accent flex items-center gap-2">
                        <Mic className="w-5 h-5" /> Roteiro (Narração Magnética)
                      </h3>
                      <div className="bg-background/80 p-4 rounded-xl border border-border">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed">
                          {script}
                        </pre>
                      </div>
                    </div>
                  )}

                  {prompts && (
                    <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/5">
                      <h3 className="font-heading font-semibold text-lg mb-4 text-cyan-400 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" /> Prompts (Bíblia Visual)
                      </h3>
                      <div className="bg-background/80 p-4 rounded-xl border border-border">
                        <p className="text-xs text-muted-foreground mb-3">Copie e cole os prompts no Leonardo.AI, Midjourney ou DALL-E 3.</p>
                        <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed">
                          {prompts}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  {!script && !prompts && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-2xl opacity-50">
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
                      <Label>Título / Referência</Label>
                      <Input 
                        placeholder="Ex: Tábua de Esmeralda, Livro de Enki..."
                        className="bg-background/50"
                        value={knowledgeTitle}
                        onChange={(e) => setKnowledgeTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de Material</Label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        value={knowledgeType}
                        onChange={(e) => setKnowledgeType(e.target.value)}
                      >
                        <option value="book">Livro / Tábua</option>
                        <option value="video">Vídeo (YouTube)</option>
                        <option value="article">Artigo Científico</option>
                        <option value="other">Outro</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Conteúdo Bruto ou Link</Label>
                    <Textarea 
                      placeholder="Cole o texto do livro, transcrição ou o link do vídeo aqui..."
                      className="min-h-[200px] bg-background/50 resize-none"
                      value={knowledgeContent}
                      onChange={(e) => setKnowledgeContent(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Library className="w-4 h-4 mr-2" />
                    Enviar para o Bibliotecário
                  </Button>
                </form>
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminStudio;
