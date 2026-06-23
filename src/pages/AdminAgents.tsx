import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, BrainCircuit, Save, LayoutDashboard, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

type AgentConfig = {
  id: string;
  name: string;
  system_prompt: string;
  model_provider: string;
  model_name: string;
  temperature: number;
};

const MODELS_BY_PROVIDER: Record<string, { value: string; label: string }[]> = {
  openai: [
    { value: "gpt-5.5", label: "GPT-5.5 Flagship (Recomendado)" },
    { value: "gpt-5.5-pro", label: "GPT-5.5 Pro" },
    { value: "gpt-4o", label: "GPT-4o (Omni)" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  ],
  anthropic: [
    { value: "claude-fable-5", label: "Claude Fable 5 (Recomendado)" },
    { value: "claude-3-5-sonnet-20240620", label: "Claude 3.5 Sonnet" },
    { value: "claude-3-5-opus-20240229", label: "Claude 3.5 Opus" },
    { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
  ],
  google: [
    { value: "gemini-3.5-pro", label: "Gemini 3.5 Pro" },
    { value: "gemini-3.5-flash", label: "Gemini 3.5 Flash" },
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
  ],
  groq: [
    { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70B (Flagship)" },
    { value: "llama-3.1-8b-instant", label: "Llama 3.1 8B (Rápido)" },
    { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B" },
    { value: "gemma2-9b-it", label: "Gemma 2 9B" },
  ],
};

const PROVIDER_LABELS: Record<string, string> = {
  openai: "OpenAI",
  google: "Google Gemini",
  anthropic: "Anthropic (Claude)",
  groq: "Groq",
};

export default function AdminAgents() {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AgentConfig>>({});
  const [saving, setSaving] = useState(false);
  const [availableProviders, setAvailableProviders] = useState<string[]>(["openai", "google", "anthropic"]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAgentsAndSettings();
  }, []);

  const fetchAgentsAndSettings = async () => {
    try {
      // 1. Fetch System Settings to get active providers
      const { data: settingsData } = await supabase.from("system_settings").select("key_name, key_value");
      if (settingsData) {
        const active = new Set<string>();
        settingsData.forEach((s) => {
          if (s.key_name === 'openai_api_key' && s.key_value) active.add("openai");
          if (s.key_name === 'anthropic_api_key' && s.key_value) active.add("anthropic");
          if (s.key_name === 'gemini_api_key' && s.key_value) active.add("google");
          if (s.key_name === 'groq_api_key' && s.key_value) active.add("groq");
        });
        if (active.size > 0) {
          setAvailableProviders(Array.from(active));
        }
      }

      // 2. Fetch Agents
      const { data, error } = await supabase
        .from("agent_configurations")
        .select("*")
        .order("name");

      if (error) throw error;
      
      if (!data || data.length === 0) {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;

        const defaultAgents = [
          { id: crypto.randomUUID(), name: "Lumina", system_prompt: "Você é a Lumina, a IA compassiva de triagem inicial.", model_provider: "openai", model_name: "gpt-4o", temperature: 0.7, user_id: userId },
          { id: crypto.randomUUID(), name: "Sálvia", system_prompt: "Você é a Sálvia, a terapeuta experiente e acolhedora.", model_provider: "openai", model_name: "gpt-4o", temperature: 0.7, user_id: userId },
          { id: crypto.randomUUID(), name: "Thoth", system_prompt: "Você é Thoth, a mente orquestradora do sistema.", model_provider: "openai", model_name: "gpt-4o", temperature: 0.5, user_id: userId }
        ];
        
        const { error: insertError } = await supabase.from("agent_configurations").insert(defaultAgents);
        if (insertError) {
          console.error("Erro ao auto-popular agentes:", insertError);
          toast({ title: "Erro ao criar agentes base", description: insertError.message, variant: "destructive" });
        }
        
        const { data: newData } = await supabase.from("agent_configurations").select("*").order("name");
        setAgents(newData || []);
        if (newData && newData.length > 0) handleSelectAgent(newData[0]);
      } else {
        setAgents(data);
        if (!selectedAgentId) handleSelectAgent(data[0]);
      }
    } catch (error: any) {
      toast({ title: "Erro ao carregar", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAgent = (agent: AgentConfig) => {
    setSelectedAgentId(agent.id);
    setFormData(agent);
  };

  const handleSave = async () => {
    if (!selectedAgentId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("agent_configurations")
        .update({
          name: formData.name,
          system_prompt: formData.system_prompt,
          model_provider: formData.model_provider,
          model_name: formData.model_name,
          temperature: formData.temperature,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedAgentId);

      if (error) throw error;

      toast({ title: "Sucesso", description: "Configurações do agente salvas com sucesso!" });
      fetchAgentsAndSettings();
    } catch (error: any) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const currentModels = formData.model_provider && MODELS_BY_PROVIDER[formData.model_provider] 
    ? MODELS_BY_PROVIDER[formData.model_provider] 
    : [];

  return (
    <div className="space-y-6 animate-fade-in text-stone-800">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-stone-800">
          Painel de Agentes IA
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sidebar - Lista de Agentes */}
        <div className="md:col-span-1 bg-white border border-stone-200 rounded-3xl p-4 shadow-sm h-fit">
          <h2 className="font-semibold text-stone-500 mb-4 px-2 uppercase text-xs tracking-wider">Esquadrão Cósmico</h2>
          <div className="space-y-2">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => handleSelectAgent(agent)}
                className={`w-full text-left px-4 py-3 rounded-2xl transition-all flex items-center gap-3 ${
                  selectedAgentId === agent.id
                    ? "bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium shadow-sm"
                    : "hover:bg-stone-50 text-stone-600 border border-transparent"
                }`}
              >
                <Sparkles className={`w-4 h-4 ${selectedAgentId === agent.id ? "text-indigo-500" : "text-stone-400"}`} />
                {agent.name}
              </button>
            ))}
          </div>
        </div>

        {/* Editor Principal */}
        <div className="md:col-span-3 bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm">
          {selectedAgentId && formData ? (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-stone-800">{formData.name}</h2>
                  <p className="text-sm text-stone-500">Configure as coordenadas e a personalidade do agente.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-md shadow-indigo-600/20">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Salvar Coordenadas
                </Button>
              </div>

              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-stone-600">Nome do Agente</label>
                    <Input 
                      value={formData.name || ""} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-xl bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-stone-600">Provedor de IA (Ativos no Lab)</label>
                    <Select 
                      value={formData.model_provider} 
                      onValueChange={(v) => {
                        // Reset the model name when changing providers to avoid invalid states
                        const defaultModel = MODELS_BY_PROVIDER[v]?.[0]?.value || "";
                        setFormData({ ...formData, model_provider: v, model_name: defaultModel });
                      }}
                    >
                      <SelectTrigger className="rounded-xl bg-stone-50">
                        <SelectValue placeholder="Selecione o provedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProviders.map(provider => (
                          <SelectItem key={provider} value={provider}>
                            {PROVIDER_LABELS[provider] || provider}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-stone-600">Modelo Específico</label>
                    <Select 
                      value={formData.model_name || ""} 
                      onValueChange={(v) => setFormData({ ...formData, model_name: v })}
                    >
                      <SelectTrigger className="rounded-xl bg-stone-50">
                        <SelectValue placeholder="Selecione o modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentModels.length > 0 ? (
                          currentModels.map(model => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value={formData.model_name || "custom"} disabled>
                            {formData.model_name || "Selecione um provedor primeiro"}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-stone-600">Temperatura (Criatividade) - {formData.temperature}</label>
                    <input 
                      type="range" 
                      min="0" max="1" step="0.1" 
                      value={formData.temperature || 0}
                      onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-600 mt-2"
                    />
                    <div className="flex justify-between text-xs text-stone-400 mt-1">
                      <span>Mais Lógico (0.0)</span>
                      <span>Mais Criativo (1.0)</span>
                    </div>
                  </div>
                </div>

                {/* System Prompt (Cérebro) */}
                <div className="pt-4 border-t border-stone-100">
                  <label className="block text-sm font-medium mb-2 text-stone-700">
                    System Prompt (Personalidade e Diretrizes)
                  </label>
                  <Textarea 
                    value={formData.system_prompt || ""}
                    onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                    className="min-h-[300px] rounded-2xl bg-stone-50 leading-relaxed font-mono text-sm resize-y"
                    placeholder="Escreva as diretrizes do agente aqui..."
                  />
                  <p className="text-xs text-stone-400 mt-2">
                    Este é o cérebro central. Defina regras, tom de voz, e instruções de como o agente deve agir perante o paciente.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 min-h-[300px]">
              <BrainCircuit className="w-12 h-12 mb-4 opacity-20" />
              <p>Selecione um agente no menu lateral para editar suas coordenadas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
