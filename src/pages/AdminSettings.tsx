import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Settings, Key, BrainCircuit, Eye, EyeOff, Save, ShieldAlert, Sparkles, Library, Truck } from "lucide-react";

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
    tavily_api_key: "",
    asaas_api_key: "",
    asaas_webhook_token: "",
    melhorenvio_api_token: "",
  });
  
  const [models, setModels] = useState({
    openai_model: "gpt-5.5",
    anthropic_model: "claude-fable-5",
    gemini_model: "gemini-3.5-flash",
    groq_model: "openai/gpt-oss-120b",
  });

  const [routing, setRouting] = useState({
    thoth_model: "gpt-5.5",
    librarian_model: "gemini-3.5-flash",
  });

  const [logistics, setLogistics] = useState({
    origin_cep: "",
  });

  const [showKeys, setShowKeys] = useState({
    openai_api_key: false,
    anthropic_api_key: false,
    gemini_api_key: false,
    groq_api_key: false,
    tavily_api_key: false,
    asaas_api_key: false,
    asaas_webhook_token: false,
    melhorenvio_api_token: false,
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
        const newRouting = { ...routing };
        let foundPrompt = "";
        
        data.forEach((setting: SystemSetting) => {
          if (setting.key_name === 'thoth_system_prompt') {
            foundPrompt = setting.key_value || "";
          } else if (setting.key_name in newKeys) {
            newKeys[setting.key_name as keyof typeof keys] = setting.key_value || "";
          } else if (setting.key_name in newModels) {
            newModels[setting.key_name as keyof typeof models] = setting.key_value || "";
          } else if (setting.key_name in newRouting) {
            newRouting[setting.key_name as keyof typeof routing] = setting.key_value || "";
          } else if (setting.key_name === 'origin_cep') {
            setLogistics(prev => ({ ...prev, origin_cep: setting.key_value || "" }));
          }
        });
        
        setKeys(newKeys);
        setModels(newModels);
        setRouting(newRouting);
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

  const handleRoutingChange = (routeName: keyof typeof routing, value: string) => {
    setRouting(prev => ({
      ...prev,
      [routeName]: value
    }));
  };

  const handleLogisticsChange = (keyName: keyof typeof logistics, value: string) => {
    setLogistics(prev => ({
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
          key_name: 'tavily_api_key',
          key_value: keys.tavily_api_key,
          is_secret: true,
          description: "Chave de API do Tavily (OSINT/Hermes)"
        },
        {
          user_id: userData.user.id,
          key_name: 'asaas_api_key',
          key_value: keys.asaas_api_key,
          is_secret: true,
          description: "Chave de API do Asaas (Produção ou Sandbox)"
        },
        {
          user_id: userData.user.id,
          key_name: 'asaas_webhook_token',
          key_value: keys.asaas_webhook_token,
          is_secret: true,
          description: "Token Webhook do Asaas"
        },
        {
          user_id: userData.user.id,
          key_name: 'thoth_system_prompt',
          key_value: systemPrompt,
          is_secret: false,
          description: "Engenharia de Roteiro Subliminar (O Cérebro de Thoth)"
        },
        {
          user_id: userData.user.id,
          key_name: 'thoth_model',
          key_value: routing.thoth_model,
          is_secret: false,
          description: "Modelo selecionado para o Agente Thoth"
        },
        {
          user_id: userData.user.id,
          key_name: 'melhorenvio_api_token',
          key_value: keys.melhorenvio_api_token,
          is_secret: true,
          description: "Token de API do MelhorEnvio"
        },
        {
          user_id: userData.user.id,
          key_name: 'librarian_model',
          key_value: routing.librarian_model,
          is_secret: false,
          description: "Modelo selecionado para o Agente Bibliotecário"
        },
        {
          user_id: userData.user.id,
          key_name: 'origin_cep',
          key_value: logistics.origin_cep,
          is_secret: false,
          description: "CEP do Remetente (Origem) para cálculo de frete"
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
        tavily_api_key: false,
        asaas_api_key: false,
        asaas_webhook_token: false,
        melhorenvio_api_token: false,
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
    <div className="space-y-6 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-heading font-bold text-foreground mb-2 flex items-center gap-3">
                <Settings className="w-8 h-8 text-accent" /> Laboratório Neural
              </h1>
              <p className="text-muted-foreground text-lg">
                Gerencie as APIs de Inteligência Artificial e o Roteamento de Agentes.
              </p>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-10" />

              <div className="mb-12">
                <h2 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-accent" />
                  Roteamento de Agentes (Separação de Mentes)
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Thoth */}
                  <div className="space-y-3 p-5 rounded-xl bg-accent/5 border border-accent/20">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-pink-500" />
                        Mente Criativa (Thoth)
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Agente responsável por escrever os roteiros e legendas persuasivas.
                      </p>
                    </div>
                    <Select value={routing.thoth_model} onValueChange={(val) => handleRoutingChange('thoth_model', val)}>
                      <SelectTrigger className="bg-background/80 border-accent/30 focus:ring-accent">
                        <SelectValue placeholder="Selecione o modelo do Thoth" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>OpenAI</SelectLabel>
                          <SelectItem value="gpt-5.5">GPT-5.5 Flagship ⭐ (Recomendado)</SelectItem>
                          <SelectItem value="gpt-5.5-pro">GPT-5.5 Pro</SelectItem>
                          <SelectItem value="gpt-5.4-mini">GPT-5.4 Mini</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o (Omni)</SelectItem>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                          <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Anthropic</SelectLabel>
                          <SelectItem value="claude-fable-5">Claude Fable 5 ⭐ (Recomendado)</SelectItem>
                          <SelectItem value="claude-opus-4.8">Claude Opus 4.8</SelectItem>
                          <SelectItem value="claude-sonnet-4.6">Claude Sonnet 4.6</SelectItem>
                          <SelectItem value="claude-3-5-opus-20240229">Claude 3.5 Opus</SelectItem>
                          <SelectItem value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet ⭐ (Bom p/ Leitura)</SelectItem>
                          <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Google Gemini</SelectLabel>
                          <SelectItem value="gemini-3.5-pro">Gemini 3.5 Pro</SelectItem>
                          <SelectItem value="gemini-3.5-flash">Gemini 3.5 Flash ⭐ (1M Tokens)</SelectItem>
                          <SelectItem value="gemini-3.1-pro">Gemini 3.1 Pro</SelectItem>
                          <SelectItem value="gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Groq</SelectLabel>
                          <SelectItem value="openai/gpt-oss-120b">GPT-OSS 120B Flagship</SelectItem>
                          <SelectItem value="openai/gpt-oss-20b">GPT-OSS 20B Fast</SelectItem>
                          <SelectItem value="groq/compound">Groq Compound</SelectItem>
                          <SelectItem value="llama-3.3-70b-versatile">Llama 3.3 70B ⭐ (Flagship)</SelectItem>
                          <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B ⭐ (Rápido)</SelectItem>
                          <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B</SelectItem>
                          <SelectItem value="gemma2-9b-it">Gemma 2 9B</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bibliotecário */}
                  <div className="space-y-3 p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                        <Library className="w-4 h-4 text-cyan-500" />
                        Mente Analítica (Bibliotecário)
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Agente responsável por ler grandes arquivos, PDFs e buscar contexto exato.
                      </p>
                    </div>
                    <Select value={routing.librarian_model} onValueChange={(val) => handleRoutingChange('librarian_model', val)}>
                      <SelectTrigger className="bg-background/80 border-cyan-500/30 focus:ring-cyan-500">
                        <SelectValue placeholder="Selecione o modelo do Bibliotecário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Google Gemini</SelectLabel>
                          <SelectItem value="gemini-3.5-pro">Gemini 3.5 Pro</SelectItem>
                          <SelectItem value="gemini-3.5-flash">Gemini 3.5 Flash ⭐ (1M Tokens)</SelectItem>
                          <SelectItem value="gemini-3.1-pro">Gemini 3.1 Pro</SelectItem>
                          <SelectItem value="gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Anthropic</SelectLabel>
                          <SelectItem value="claude-fable-5">Claude Fable 5 ⭐ (Recomendado)</SelectItem>
                          <SelectItem value="claude-opus-4.8">Claude Opus 4.8</SelectItem>
                          <SelectItem value="claude-sonnet-4.6">Claude Sonnet 4.6</SelectItem>
                          <SelectItem value="claude-3-5-opus-20240229">Claude 3.5 Opus</SelectItem>
                          <SelectItem value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet ⭐ (Bom p/ Leitura)</SelectItem>
                          <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>OpenAI</SelectLabel>
                          <SelectItem value="gpt-5.5">GPT-5.5 Flagship ⭐ (Recomendado)</SelectItem>
                          <SelectItem value="gpt-5.5-pro">GPT-5.5 Pro</SelectItem>
                          <SelectItem value="gpt-5.4-mini">GPT-5.4 Mini</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o (Omni)</SelectItem>
                          <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                          <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Groq</SelectLabel>
                          <SelectItem value="openai/gpt-oss-120b">GPT-OSS 120B Flagship</SelectItem>
                          <SelectItem value="openai/gpt-oss-20b">GPT-OSS 20B Fast</SelectItem>
                          <SelectItem value="groq/compound">Groq Compound</SelectItem>
                          <SelectItem value="llama-3.3-70b-versatile">Llama 3.3 70B ⭐ (Flagship)</SelectItem>
                          <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B ⭐ (Rápido)</SelectItem>
                          <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B</SelectItem>
                          <SelectItem value="gemma2-9b-it">Gemma 2 9B</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-accent" />
                  Cofre de Chaves e Modelos Padrão
                </h2>
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
                          <SelectItem value="gpt-5.5">GPT-5.5 Flagship ⭐ (Recomendado)</SelectItem>
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
                          <SelectItem value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet ⭐ (Bom p/ Leitura)</SelectItem>
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
                          <SelectItem value="gemini-3.5-pro">Gemini 3.5 Pro (Flagship)</SelectItem>
                          <SelectItem value="gemini-3.5-flash">Gemini 3.5 Flash ⭐ (1M Tokens)</SelectItem>
                          <SelectItem value="gemini-3.1-pro">Gemini 3.1 Pro</SelectItem>
                          <SelectItem value="gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite</SelectItem>
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
                          <SelectItem value="llama-3.3-70b-versatile">Llama 3.3 70B ⭐ (Flagship)</SelectItem>
                          <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B ⭐ (Rápido)</SelectItem>
                          <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B</SelectItem>
                          <SelectItem value="gemma2-9b-it">Gemma 2 9B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Tavily */}
                <div className="space-y-4 p-4 border border-emerald-500/10 rounded-xl bg-emerald-500/5">
                  <h3 className="text-lg font-heading font-semibold text-emerald-400">Tavily Search API (Hermes OSINT)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">API Key</Label>
                      <div className="relative">
                        <Input 
                          type={showKeys.tavily_api_key ? "text" : "password"}
                          value={keys.tavily_api_key}
                          onChange={(e) => handleKeyChange('tavily_api_key', e.target.value)}
                          placeholder="tvly-..."
                          className="bg-background/50 border-emerald-500/20 focus:border-emerald-500/50 pr-10 font-mono text-sm"
                        />
                        <button 
                          type="button"
                          onClick={() => toggleKeyVisibility('tavily_api_key')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showKeys.tavily_api_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 flex flex-col justify-center">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Esta chave será enviada diretamente para a Edge Function de OSINT e usada pelas aranhas web do Hermes para obter contexto inteligente.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Asaas */}
                <div className="space-y-4 p-4 border border-blue-500/10 rounded-xl bg-blue-500/5">
                  <h3 className="text-lg font-heading font-semibold text-blue-400 flex items-center gap-2">
                    Asaas (Financeiro & Checkout)
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">API Key</Label>
                      <div className="relative">
                        <Input 
                          type={showKeys.asaas_api_key ? "text" : "password"}
                          value={keys.asaas_api_key}
                          onChange={(e) => handleKeyChange('asaas_api_key', e.target.value)}
                          placeholder="$aact_..."
                          className="bg-background/50 border-blue-500/20 focus:border-blue-500/50 pr-10 font-mono text-sm"
                        />
                        <button 
                          type="button"
                          onClick={() => toggleKeyVisibility('asaas_api_key')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showKeys.asaas_api_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Webhook Token</Label>
                      <div className="relative">
                        <Input 
                          type={showKeys.asaas_webhook_token ? "text" : "password"}
                          value={keys.asaas_webhook_token}
                          onChange={(e) => handleKeyChange('asaas_webhook_token', e.target.value)}
                          placeholder="Token Webhook"
                          className="bg-background/50 border-blue-500/20 focus:border-blue-500/50 pr-10 font-mono text-sm"
                        />
                        <button 
                          type="button"
                          onClick={() => toggleKeyVisibility('asaas_webhook_token')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showKeys.asaas_webhook_token ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logística & Envios */}
            <div className="glass-card p-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-heading font-bold text-foreground">Logística & Envios</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Configure os dados do remetente (CD/Estoque) para que o sistema de fretes e a API do MelhorEnvio calculem os envios baseados na sua origem.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">CEP de Origem (Remetente)</Label>
                  <Input 
                    type="text"
                    value={logistics.origin_cep}
                    onChange={(e) => handleLogisticsChange('origin_cep', e.target.value)}
                    placeholder="00000-000"
                    maxLength={9}
                    className="bg-background/80 border-indigo-500/20 focus:border-indigo-500/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-foreground">Token API (MelhorEnvio)</Label>
                  <div className="relative">
                    <Input 
                      type={showKeys.melhorenvio_api_token ? "text" : "password"}
                      value={keys.melhorenvio_api_token}
                      onChange={(e) => handleKeyChange('melhorenvio_api_token', e.target.value)}
                      placeholder="eyJ0eXAiOiJKV1QiLC..."
                      className="bg-background/80 border-indigo-500/20 focus:border-indigo-500/50 pr-10 font-mono text-sm"
                    />
                    <button 
                      type="button"
                      onClick={() => toggleKeyVisibility('melhorenvio_api_token')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showKeys.melhorenvio_api_token ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
      </div>
  );
};

export default AdminSettings;
