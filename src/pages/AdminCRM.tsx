import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, MessageSquare, AlertTriangle, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminCRM() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // Fetch sessions
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });
        
      if (data) setSessions(data);
    };

    fetchSessions();

    // Subscribe to realtime updates for sessions
    const sessionSubscription = supabase
      .channel('public:chat_sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions' }, payload => {
        fetchSessions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sessionSubscription);
    };
  }, []);

  useEffect(() => {
    if (!selectedSession) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', selectedSession.id)
        .order('created_at', { ascending: true });
        
      if (data) setMessages(data);
    };

    fetchMessages();

    // Realtime for messages of the selected session
    const msgSubscription = supabase
      .channel(`public:chat_messages:${selectedSession.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${selectedSession.id}` }, payload => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(msgSubscription);
    };
  }, [selectedSession]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Novo': return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Novo</Badge>;
      case 'Em Acompanhamento': return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">Ativo</Badge>;
      case 'Crítico': return <Badge className="bg-red-500 hover:bg-red-600 text-white flex gap-1 items-center"><AlertTriangle className="w-3 h-3"/> Crítico</Badge>;
      case 'Encaminhado': return <Badge className="bg-amber-500 hover:bg-amber-600 text-white flex gap-1 items-center"><UserCheck className="w-3 h-3"/> Encaminhado</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-stone-800">
            Painel de Monitoramento (CRM)
          </h1>
          <p className="text-stone-500 mt-1">Gestão de leads e acompanhamento de conversas em tempo real.</p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left List */}
        <Card className="w-1/3 flex flex-col bg-white/50 backdrop-blur-sm border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-200 flex flex-col gap-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="critical" className="text-red-600 data-[state=active]:text-red-700">Críticos</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Buscar paciente..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {sessions.length === 0 ? (
              <div className="text-center p-8 text-stone-500 text-sm">
                Nenhum lead encontrado.
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map(session => (
                  <div 
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                      selectedSession?.id === session.id 
                        ? 'bg-indigo-50 border-indigo-200' 
                        : 'bg-white border-transparent hover:border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-stone-800 text-sm">{session.lead_name || 'Usuário Anônimo'}</span>
                      {getStatusBadge(session.status)}
                    </div>
                    <div className="text-xs text-stone-500 flex justify-between items-center mt-2">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        Agente: {session.agent_id}
                      </span>
                      <span>{new Date(session.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Right Chat View */}
        <Card className="flex-1 flex flex-col bg-white/50 backdrop-blur-sm border-stone-200 overflow-hidden">
          {selectedSession ? (
            <>
              <div className="p-4 border-b border-stone-200 bg-white/80 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-lg text-stone-800">{selectedSession.lead_name || 'Usuário Anônimo'}</h2>
                  <p className="text-sm text-stone-500">Contato: {selectedSession.lead_contact || 'Não fornecido'}</p>
                </div>
                <div className="flex gap-2">
                  <select 
                    className="text-sm border border-stone-200 rounded-md px-3 py-1.5 bg-white"
                    value={selectedSession.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value as "Novo" | "Em Acompanhamento" | "Crítico" | "Encaminhado" | "Inativo";
                      await supabase.from('chat_sessions').update({ status: newStatus }).eq('id', selectedSession.id);
                      setSelectedSession({...selectedSession, status: newStatus});
                    }}
                  >
                    <option value="Novo">Novo</option>
                    <option value="Em Acompanhamento">Em Acompanhamento</option>
                    <option value="Crítico">Crítico</option>
                    <option value="Encaminhado">Encaminhado</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center p-8 text-stone-400">
                    Nenhuma mensagem registrada nesta sessão.
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user' 
                          ? 'bg-indigo-500 text-white rounded-br-none' 
                          : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <span className={`text-[10px] mt-2 block ${msg.role === 'user' ? 'text-indigo-200' : 'text-stone-400'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
              <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
              <p>Selecione um lead à esquerda para monitorar a conversa.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
