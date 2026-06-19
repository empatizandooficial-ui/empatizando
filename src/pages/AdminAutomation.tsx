import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, Upload, Instagram, Video, Save, Sparkles, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminAutomation = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [baseContent, setBaseContent] = useState("");
  const [instagramCaption, setInstagramCaption] = useState("");
  const [tiktokCaption, setTiktokCaption] = useState("");
  
  const [activeTab, setActiveTab] = useState<"base" | "instagram" | "tiktok">("base");
  
  const [scheduleDate, setScheduleDate] = useState("");
  const [platforms, setPlatforms] = useState({ instagram: true, tiktok: true });

  const handleAIGeneration = async () => {
    if (!baseContent) {
      toast({ title: "Atenção", description: "Escreva o conteúdo base primeiro.", variant: "destructive" });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulação da chamada ao Agente Thoth (IA)
    setTimeout(() => {
      setInstagramCaption(baseContent + "\n\n✨ Assista completo no portal!\n\n#Espiritualidade #Ciencia #Despertar #BioEquilibrio #Frequencia #Empatia #Cosmos");
      setTiktokCaption(baseContent.substring(0, 100) + "... 🌌 Vem descobrir o segredo! Link na bio! #despertar #energia #matrix #frequencia");
      
      setIsGenerating(false);
      setActiveTab("instagram");
      
      toast({
        title: "Magia Concluída! 🧙‍♂️",
        description: "O Agente Thoth gerou as legendas otimizadas para cada rede social.",
      });
    }, 2000);
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação da chamada para a Edge Function que faremos no futuro
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Post Agendado com Sucesso!",
        description: `Agendado para ${new Date(scheduleDate).toLocaleString()} nas plataformas selecionadas.`,
      });
      setBaseContent("");
      setInstagramCaption("");
      setTiktokCaption("");
      setScheduleDate("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header darkTextOnTop />
      
      <main className="flex-grow pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Painel de Automação</h1>
            <p className="text-muted-foreground text-lg">
              Agende e publique conteúdos para o Instagram e TikTok através da arquitetura de integração direta.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Coluna do Formulário */}
            <div className="md:col-span-2 glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -z-10" />
              
              <form onSubmit={handleSchedule} className="space-y-6">
                
                {/* Upload de Mídia */}
                <div className="space-y-2">
                  <Label className="text-foreground font-semibold">Mídia (Vídeo/Imagem)</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                    <p className="text-sm text-foreground font-medium">Clique para fazer upload ou arraste o arquivo</p>
                    <p className="text-xs text-muted-foreground mt-1">MP4, MOV, JPG ou PNG (Max 50MB)</p>
                  </div>
                </div>

                {/* Editor Inteligente com Abas */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground font-semibold">Laboratório de Texto (Thoth AI)</Label>
                    <Button 
                      type="button" 
                      onClick={handleAIGeneration}
                      disabled={isGenerating || !baseContent}
                      variant="outline" 
                      className="border-accent text-accent hover:bg-accent hover:text-white transition-all h-8 px-3 text-xs"
                    >
                      {isGenerating ? "Processando..." : <><Sparkles className="w-3 h-3 mr-1" /> Gerar Variações</>}
                    </Button>
                  </div>

                  <div className="flex border-b border-border/50">
                    <button type="button" onClick={() => setActiveTab("base")} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "base" ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                      Texto Base
                    </button>
                    <button type="button" onClick={() => setActiveTab("instagram")} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1 ${activeTab === "instagram" ? "border-pink-500 text-pink-500" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                      <Instagram className="w-3 h-3" /> Instagram
                    </button>
                    <button type="button" onClick={() => setActiveTab("tiktok")} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1 ${activeTab === "tiktok" ? "border-cyan-400 text-cyan-400" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                      <Video className="w-3 h-3" /> TikTok
                    </button>
                  </div>

                  {activeTab === "base" && (
                    <Textarea 
                      placeholder="Escreva a ideia central do vídeo ou cole o roteiro bruto. A IA fará o resto..."
                      className="min-h-[120px] bg-background/50 border-border resize-none"
                      value={baseContent}
                      onChange={(e) => setBaseContent(e.target.value)}
                    />
                  )}
                  {activeTab === "instagram" && (
                    <Textarea 
                      placeholder="Legenda pronta para o Instagram (textão permitido, até 30 hashtags)..."
                      className="min-h-[120px] bg-background/50 border-pink-500/30 focus-visible:ring-pink-500 resize-none"
                      value={instagramCaption}
                      onChange={(e) => setInstagramCaption(e.target.value)}
                    />
                  )}
                  {activeTab === "tiktok" && (
                    <Textarea 
                      placeholder="Legenda rápida para o TikTok (curta, alto impacto, hashtags virais)..."
                      className="min-h-[120px] bg-background/50 border-cyan-400/30 focus-visible:ring-cyan-400 resize-none"
                      value={tiktokCaption}
                      onChange={(e) => setTiktokCaption(e.target.value)}
                    />
                  )}
                </div>

                {/* Data e Hora */}
                <div className="space-y-2">
                  <Label htmlFor="datetime" className="text-foreground font-semibold">Data e Hora de Publicação</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="datetime"
                        type="datetime-local" 
                        className="pl-10 bg-background/50 border-border"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Plataformas */}
                <div className="space-y-4 pt-2 border-t border-border/50">
                  <Label className="text-foreground font-semibold">Plataformas de Distribuição</Label>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="instagram" 
                        checked={platforms.instagram}
                        onCheckedChange={(checked) => setPlatforms({...platforms, instagram: checked})}
                      />
                      <Label htmlFor="instagram" className="flex items-center gap-1 cursor-pointer">
                        <Instagram className="w-4 h-4 text-pink-500" /> Instagram
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="tiktok" 
                        checked={platforms.tiktok}
                        onCheckedChange={(checked) => setPlatforms({...platforms, tiktok: checked})}
                      />
                      <Label htmlFor="tiktok" className="flex items-center gap-1 cursor-pointer">
                        <Video className="w-4 h-4 text-cyan-400" /> TikTok
                      </Label>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-4"
                  disabled={loading}
                >
                  {loading ? "Agendando..." : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Programar Publicação
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Coluna de Status/Infos */}
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Status da API (Otto)
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-2"><Instagram className="w-4 h-4"/> Instagram Graph API</span>
                    <span className="text-yellow-500 font-medium text-xs bg-yellow-500/10 px-2 py-1 rounded-full">Aguardando App</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-2"><Video className="w-4 h-4"/> TikTok API</span>
                    <span className="text-yellow-500 font-medium text-xs bg-yellow-500/10 px-2 py-1 rounded-full">Aguardando App</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Supabase Storage</span>
                    <span className="text-green-500 font-medium text-xs bg-green-500/10 px-2 py-1 rounded-full">Operante</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-6 italic">
                  *A integração nativa (Edge Functions) será conectada assim que os aplicativos forem aprovados nas respectivas plataformas.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAutomation;
