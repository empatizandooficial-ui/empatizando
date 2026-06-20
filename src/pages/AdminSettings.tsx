import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Settings, Key, BrainCircuit, Eye, EyeOff, Save, ShieldAlert } from "lucide-react";

interface SystemSetting {
  id?: string;
  key_name: string;
  key_value: string;
  is_secret: boolean;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [keys, setKeys] = useState({
    openai_api_key: "",
    gemini_api_key: "",
    groq_api_key: "",
  });
  
  const [showKeys, setShowKeys] = useState({
    openai_api_key: false,
    gemini_api_key: false,
    groq_api_key: false,
  });

  const [systemPrompt, setSystemPrompt] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('user_id', userData.user.id);

      if (error) throw error;

      if (data) {
        const newKeys = { ...keys };
        let foundPrompt = "";
        
        data.forEach((setting: SystemSetting) => {
          if (setting.key_name === 'thoth_system_prompt') {
            foundPrompt = setting.key_value || "";
          } else if (setting.key_name in newKeys) {
            newKeys[setting.key_name as keyof typeof keys] = setting.key_value || "";
          }
        });
        
        setKeys(newKeys);
        setSystemPrompt(foundPrompt);
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Erro ao carregar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFetching(false);
    }
  };

  const toggleKeyVisibility = (keyName: keyof typeof showKeys) => {
    setShowKeys(prev => ({
      ...prev,
      [keyName]: !prev[keyName]
    }));
  };

  const handleKeyChange = (keyName: keyof typeof keys, value: string) => {
    setKeys(prev => ({
      ...prev,
      [keyName]: value
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Usuário não autenticado");

      const updates = [
        {
          user_id: userData.user.id,
          key_name: 'openai_api_key',
          key_value: keys.openai_api_key,
          is_secret: true,
          description: "Chave de API da OpenAI (GPT-4)"
        },
        {
          user_id: userData.user.id,
          key_name: 'gemini_api_key',
          key_value: keys.gemini_api_key,
          is_secret: true,
          description: "Chave de API do Google Gemini"
        },
        {
          user_id: userData.user.id,
          key_name: 'groq_api_key',
          key_value: keys.groq_api_key,
          is_secret: true,
          description: "Chave de API da Groq (Llama 3)"
        },
        {
          user_id: userData.user.id,
          key_name: 'thoth_system_prompt',
          key_value: systemPrompt,
          is_secret: false,
          description: "Engenharia de Roteiro Subliminar (O Cérebro de Thoth)"
        }
      ];

      const { error } = await supabase
        .from('system_settings')
        .upsert(updates, { onConflict: 'key_name' });

      if (error) throw error;

      toast({
        title: "Laboratório Atualizado! 🧠",
        description: "As chaves e o Sistema Neural foram salvos com segurança.",
      });

      // Esconde as chaves novamente após salvar
      setShowKeys({
        openai_api_key: false,
        gemini_api_key: false,
        groq_api_key: false,
      });

    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header darkTextOnTop />
      
      <main className="flex-grow pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-heading font-bold text-foreground mb-2 flex items-center gap-3">
                <Settings className="w-8 h-8 text-accent" /> Laboratório Neural
              </h1>
              <p className="text-muted-foreground text-lg">
                Gerencie as APIs de Inteligência Artificial e a Engenharia do Roteiro.
              </p>
            </div>
            <Button 
              onClick={saveSettings} 
              disabled={loading}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {loading ? "Salvando..." : <><Save className="w-4 h-4 mr-2" /> Salvar Configurações</>}
            </Button>
          </div>

          <div className="grid gap-8">
            
            {/* Cofre de Chaves (API Keys) */}
            <div className="glass-card p-8 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 mb-6">
                <Key className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-heading font-bold text-foreground">O Cofre (API Keys)</h2>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-200/80 leading-relaxed">
                  <strong>Segurança Máxima:</strong> Estas chaves são protegidas por criptografia e Row Level Security (RLS). 
                  Elas nunca são exibidas a menos que você clique no ícone para revelar. O Thoth as utilizará em background.
                </p>
              </div>

              <div className="space-y-6">
                {/* OpenAI */}
                <div className="space-y-2">
                  <Label className="text-foreground">OpenAI API Key</Label>
                  <div className="relative">
                    <Input 
                      type={showKeys.openai_api_key ? "text" : "password"}
                      value={keys.openai_api_key}
                      onChange={(e) => handleKeyChange('openai_api_key', e.target.value)}
                      placeholder="sk-proj-..."
                      className="bg-background/50 border-border pr-10 font-mono text-sm"
                    />
                    <button 
                      type="button"
                      onClick={() => toggleKeyVisibility('openai_api_key')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showKeys.openai_api_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Gemini */}
                <div className="space-y-2">
                  <Label className="text-foreground">Google Gemini API Key</Label>
                  <div className="relative">
                    <Input 
                      type={showKeys.gemini_api_key ? "text" : "password"}
                      value={keys.gemini_api_key}
                      onChange={(e) => handleKeyChange('gemini_api_key', e.target.value)}
                      placeholder="AIzaSy..."
                      className="bg-background/50 border-border pr-10 font-mono text-sm"
                    />
                    <button 
                      type="button"
                      onClick={() => toggleKeyVisibility('gemini_api_key')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showKeys.gemini_api_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Groq */}
                <div className="space-y-2">
                  <Label className="text-foreground">Groq API Key (Llama 3)</Label>
                  <div className="relative">
                    <Input 
                      type={showKeys.groq_api_key ? "text" : "password"}
                      value={keys.groq_api_key}
                      onChange={(e) => handleKeyChange('groq_api_key', e.target.value)}
                      placeholder="gsk_..."
                      className="bg-background/50 border-border pr-10 font-mono text-sm"
                    />
                    <button 
                      type="button"
                      onClick={() => toggleKeyVisibility('groq_api_key')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showKeys.groq_api_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* System Prompt */}
            <div className="glass-card p-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5">
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-heading font-bold text-foreground">A Mente de Thoth (System Prompt)</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Este é o "Cérebro" base do agente. Instrua a IA sobre como ela deve se comportar, qual arquétipo usar (ex: Sábio Cósmico) e como deve formatar o roteiro subliminar usando a Jornada do Herói. Tudo que for escrito aqui ditará a essência do canal.
              </p>
              
              <Textarea 
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Você é Thoth, o escriba dos deuses..."
                className="min-h-[300px] bg-background/80 border-border font-mono text-sm leading-relaxed resize-y"
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
