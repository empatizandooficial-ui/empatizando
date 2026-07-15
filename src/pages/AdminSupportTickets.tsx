import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminSupportTickets() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Chat State
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAdminUser(data.user);
    });
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select(`
          *,
          auth_users:user_id (email)
        `)
        .order("status", { ascending: true }) // open first
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from("support_ticket_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket || !adminUser) return;

    setSendingReply(true);
    try {
      const { error } = await supabase
        .from("support_ticket_messages")
        .insert({
          ticket_id: selectedTicket.id,
          user_id: adminUser.id,
          message: replyMessage.trim(),
          is_admin_reply: true
        });

      if (error) throw error;
      
      // Update status to in_progress if it was open
      if (selectedTicket.status === 'open') {
        await supabase.from("support_tickets").update({ status: 'in_progress' }).eq('id', selectedTicket.id);
        fetchTickets(); // refresh list
      }

      setReplyMessage("");
      fetchMessages(selectedTicket.id);
    } catch (err: any) {
      toast({ title: "Erro ao enviar mensagem", description: err.message, variant: "destructive" });
    } finally {
      setSendingReply(false);
    }
  };

  const updateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status: newStatus })
        .eq('id', ticketId);
      
      if (error) throw error;
      
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
      fetchTickets();
      toast({ title: "Status atualizado!" });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    }
  };

  const openChat = (ticket: any) => {
    setSelectedTicket(ticket);
    fetchMessages(ticket.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Chamados de Suporte</h1>
        <p className="text-slate-500">Gerencie o atendimento aos clientes (Helpdesk).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Chamados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8 text-slate-500">Nenhum chamado aberto.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Assunto</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(ticket => (
                    <tr key={ticket.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium">{ticket.auth_users?.email}</td>
                      <td className="px-4 py-3">{ticket.subject}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          ticket.status === 'open' ? 'bg-amber-100 text-amber-700' :
                          ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {ticket.status === 'open' ? 'Aberto' : ticket.status === 'in_progress' ? 'Em Andamento' : 'Resolvido'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{new Date(ticket.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="outline" size="sm" onClick={() => openChat(ticket)}>Atender</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-2xl h-[85vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b border-slate-100 bg-slate-50 flex flex-row justify-between items-center">
            <div>
              <DialogTitle>{selectedTicket?.subject}</DialogTitle>
              <p className="text-xs text-slate-500 mt-1">Cliente: {selectedTicket?.auth_users?.email}</p>
            </div>
            {selectedTicket?.status !== 'resolved' && (
              <Button variant="destructive" size="sm" onClick={() => updateStatus(selectedTicket.id, 'resolved')}>
                Marcar como Resolvido
              </Button>
            )}
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.is_admin_reply ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.is_admin_reply 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                  <span className={`text-[10px] mt-1 block ${msg.is_admin_reply ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            {selectedTicket?.status === 'resolved' ? (
              <div className="text-center text-sm text-slate-500 bg-slate-50 py-2 rounded-lg flex flex-col items-center gap-2">
                Este chamado foi encerrado.
                <Button variant="outline" size="sm" onClick={() => updateStatus(selectedTicket.id, 'in_progress')}>
                  Reabrir Chamado
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSendReply} className="flex gap-2">
                <Input 
                  placeholder="Digite sua resposta para o cliente..." 
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={sendingReply || !replyMessage.trim()}>
                  {sendingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
