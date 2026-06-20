import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    anthropic_api_key: "",
    gemini_api_key: "",
    groq_api_key: "",
  });
  
  const [models, setModels] = useState({
    openai_model: "gpt-5.5",
    anthropic_model: "claude-fable-5",
    gemini_model: "gemini-3.5-flash",
    groq_model: "openai/gpt-oss-120b",
  });

  const [showKeys, setShowKeys] = useState({
    openai_api_key: false,
    anthropic_api_key: false,
    gemini_api_key: false,
    groq_api_key: false,
  });

  const [systemPrompt, setSystemPrompt] = useState("");

  useEffect(() => {
    fetchSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const newModels = { ...models };
        let foundPrompt = "";
        
        data.forEach((setting: SystemSetting) => {
          if (setting.key_name === 'thoth_system_prompt') {
            foundPrompt = setting.key_value || "";
          } else if (setting.key_name in newKeys) {
            newKeys[setting.key_name as keyof typeof keys] = setting.key_value || "";
          } else if (setting.key_name in newModels) {
            newModels[setting.key_name as keyof typeof models] = setting.key_value || "";
          }
        });
        
        setKeys(newKeys);
        setModels(newModels);
        setSystemPrompt(foundPrompt);
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error fetching settings:', err);
      toast({
        title: "Erro ao carregar",
        description: err.message,
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

  const handleModelChange = (modelName: keyof typeof models, value: string) => {
    setModels(prev => ({
      ...prev,
      [modelName]: value
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
          description: "Chave de API da OpenAI"
        },
        {
          user_id: userData.user.id,
          key_name: 'openai_model',
          key_value: models.openai_model,
          is_secret: false,
          description: "Modelo da OpenAI"
        },
        {
          user_id: userData.user.id,
          key_name: 'anthropic_api_key',
          key_value: keys.anthropic_api_key,
          is_secret: true,
          description: "Chave de API da Anthropic"
        },
        {
          user_id: userData.user.id,
          key_name: 'anthropic_model',
          key_value: models.anthropic_model,
          is_secret: false,
          description: "Modelo da Anthropic"
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
          key_name: 'gemini_model',
          key_value: models.gemini_model,
          is_secret: false,
          description: "Modelo do Google Gemini"
        },
        {
          user_id: userData.user.id,
          key_name: 'groq_api_key',
          key_value: keys.groq_api_key,
          is_secret: true,
          description: "Chave de API da Groq"
        },
        {
          user_id: userData.user.id,
          key_name: 'groq_model',
          key_value: models.groq_model,
          is_secret: false,
          description: "Modelo da Groq"
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
        anthropic_api_key: false,
        gemini_api_key: false,
        groq_api_key: false,
      });

    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error saving settings:', err);
      toast({
        title: "Erro ao salvar",
        description: err.message,
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

              <div className="space-y-8">
                {/* OpenAI */}
                <div className="space-y-4 p-4 border border-white/5 rounded-xl bg-white/5">
                  <h3 className="text-lg font-heading font-semibold text-foreground">OpenAI</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">API Key</Label>
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
                    <div className="space-y-2">
                      <Label className="text-foreground">Modelo</Label>
                      <Select value={models.openai_model} onValueChange={(val) => handleModelChange('openai_model', val)}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Selecione o modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-5.5">GPT-5.5 Flagship</SelectItem>
                          <SelectItem value="gpt-5.5-pro">GPT-5.5 Pro</SelectItem>
                          <SelectItem value="gpt-5.4-mini">GPT-5.4 Mini</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o (Omni)</SelectItem>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                          <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Anthropic */}
                <div className="space-y-4 p-4 border border-white/5 rounded-xl bg-white/5">
                  <h3 className="text-lg font-heading font-semibold text-foreground">Anthropic</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">API Key</Label>
                      <div className="relative">
                        <Input 
                          type={showKeys.anthropic_api_key ? "text" : "password"}
                          value={keys.anthropic_api_key}
                          onChange={(e) => handleKeyChange('anthropic_api_key', e.target.value)}
                          placeholder="sk-ant-..."
                          className="bg-background/50 border-border pr-10 font-mono text-sm"
                        />
                        <button 
                          type="button"
                          onClick={() => toggleKeyVisibility('anthropic_api_key')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showKeys.anthropic_api_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Modelo</Label>
                      <Select value={models.anthropic_model} onValueChange={(val) => handleModelChange('anthropic_model', val)}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Selecione o modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="claude-fable-5">Claude Fable 5 (Mythos Class)</SelectItem>
                          <SelectItem value="claude-opus-4.8">Claude Opus 4.8</SelectItem>
                          <SelectItem value="claude-sonnet-4.6">Claude Sonnet 4.6</SelectItem>
                          <SelectItem value="claude-3-5-opus-20240229">Claude 3.5 Opus</SelectItem>
                          <SelectItem value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</SelectItem>
                          <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Gemini */}
                <div className="space-y-4 p-4 border border-white/5 rounded-xl bg-white/5">
                  <h3 className="text-lg font-heading font-semibold text-foreground">Google Gemini</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">API Key</Label>
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
                    <div className="space-y-2">
                      <Label className="text-foreground">Modelo</Label>
                      <Select value={models.gemini_model} onValueChange={(val) => handleModelChange('gemini_model', val)}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Selecione o modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gemini-3.5-flash">Gemini 3.5 Flash</SelectItem>
                          <SelectItem value="gemini-3.5-pro">Gemini 3.5 Pro</SelectItem>
                          <SelectItem value="gemini-3.1-pro">Gemini 3.1 Pro</SelectItem>
                          <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                          <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                          <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Groq */}
                <div className="space-y-4 p-4 border border-white/5 rounded-xl bg-white/5">
                  <h3 className="text-lg font-heading font-semibold text-foreground">Groq (LPU)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">API Key</Label>
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
                    <div className="space-y-2">
                      <Label className="text-foreground">Modelo</Label>
                      <Select value={models.groq_model} onValueChange={(val) => handleModelChange('groq_model', val)}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Selecione o modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai/gpt-oss-120b">GPT-OSS 120B Flagship</SelectItem>
                          <SelectItem value="openai/gpt-oss-20b">GPT-OSS 20B Fast</SelectItem>
                          <SelectItem value="groq/compound">Groq Compound</SelectItem>
                          <SelectItem value="llama-3.1-70b-versatile">Llama 3.1 70B Versatile</SelectItem>
                          <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B Instant</SelectItem>
                          <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B</SelectItem>
                          <SelectItem value="gemma2-9b-it">Gemma 2 9B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
