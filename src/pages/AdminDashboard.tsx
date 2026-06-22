import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, PhoneForwarded, BrainCircuit } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeConversations: 0,
    criticalCases: 0,
    forwarded: 0
  });

  useEffect(() => {
    async function fetchStats() {
      // In a real scenario, this would query chat_sessions and group by status.
      // Since the table is fresh, we will just simulate reading from it.
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("status", { count: 'exact' });
      
      if (data && !error) {
        const total = data.length;
        const active = data.filter(d => d.status === 'Em Acompanhamento').length;
        const critical = data.filter(d => d.status === 'Crítico').length;
        const forwarded = data.filter(d => d.status === 'Encaminhado').length;
        
        setStats({
          totalLeads: total,
          activeConversations: active,
          criticalCases: critical,
          forwarded: forwarded
        });
      }
    }
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-stone-800">
          Dashboard Estratégico
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-sm border-stone-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">
              Total de Leads (Lumina)
            </CardTitle>
            <Users className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">{stats.totalLeads}</div>
            <p className="text-xs text-stone-500 mt-1">Registros na base</p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-stone-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">
              Atendimentos Ativos (Sálvia)
            </CardTitle>
            <BrainCircuit className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">{stats.activeConversations}</div>
            <p className="text-xs text-stone-500 mt-1">Conversas em andamento</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50/50 backdrop-blur-sm border-red-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-600">
              Casos Críticos (Atenção)
            </CardTitle>
            <Activity className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.criticalCases}</div>
            <p className="text-xs text-red-500/70 mt-1">Necessitam análise manual</p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-stone-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-600">
              Encaminhados
            </CardTitle>
            <PhoneForwarded className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">{stats.forwarded}</div>
            <p className="text-xs text-stone-500 mt-1">Prontos para especialistas</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-xl border border-stone-200 p-6">
        <h2 className="text-lg font-heading font-semibold text-stone-800 mb-4">Visão Geral do Sistema</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-stone-200 rounded-lg">
          <p className="text-stone-500">Gráfico de Crescimento (Em breve com a chegada dos especialistas)</p>
        </div>
      </div>
    </div>
  );
}
