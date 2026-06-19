import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, Upload, Instagram, Video, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminAutomation = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [postText, setPostText] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [platforms, setPlatforms] = useState({ instagram: true, tiktok: true });

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
      setPostText("");
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

                {/* Texto/Legenda */}
                <div className="space-y-2">
                  <Label htmlFor="caption" className="text-foreground font-semibold">Legenda da Publicação</Label>
                  <Textarea 
                    id="caption"
                    placeholder="Escreva a mensagem magnética e adicione as hashtags..."
                    className="min-h-[120px] bg-background/50 border-border resize-none"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    required
                  />
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
