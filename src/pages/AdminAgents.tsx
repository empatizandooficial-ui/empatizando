import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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

export default function AdminAgents() {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AgentConfig>>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from("agent_configurations")
        .select("*")
        .order("name");

      if (error) throw error;
      setAgents(data || []);
      if (data && data.length > 0 && !selectedAgentId) {
        handleSelectAgent(data[0]);
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
      fetchAgents();
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

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Painel de Agentes IA
          </h1>
        </div>
        <Link to="/portal">
          <Button variant="outline" className="gap-2">
            <LayoutDashboard className="w-4 h-4" /> Voltar ao Portal
          </Button>
        </Link>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        
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
                    <label className="block text-sm font-medium mb-1 text-stone-600">Provedor de IA</label>
                    <Select 
                      value={formData.model_provider} 
                      onValueChange={(v) => setFormData({ ...formData, model_provider: v })}
                    >
                      <SelectTrigger className="rounded-xl bg-stone-50">
                        <SelectValue placeholder="Selecione o provedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="google">Google Gemini</SelectItem>
                        <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-stone-600">Modelo Específico</label>
                    <Input 
                      value={formData.model_name || ""} 
                      onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                      className="rounded-xl bg-stone-50"
                      placeholder="Ex: gpt-4o, gemini-1.5-pro"
                    />
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
      </main>
    </div>
  );
}
