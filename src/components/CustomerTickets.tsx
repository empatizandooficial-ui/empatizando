import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, MessageSquare, Send, PlusCircle } from "lucide-react";

export function CustomerTickets({ userId }: { userId: string }) {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Ticket State
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Chat State
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [userId]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", userId)
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

  const handleOpenTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    setSubmitting(true);
    try {
      // 1. Create ticket
      const { data: ticket, error: ticketErr } = await supabase
        .from("support_tickets")
        .insert({
          user_id: userId,
          subject: newSubject.trim(),
          status: 'open'
        })
        .select()
        .single();

      if (ticketErr) throw ticketErr;

      // 2. Create first message
      const { error: msgErr } = await supabase
        .from("support_ticket_messages")
        .insert({
          ticket_id: ticket.id,
          user_id: userId,
          message: newMessage.trim()
        });

      if (msgErr) throw msgErr;

      toast({ title: "Chamado aberto com sucesso!" });
      setIsNewTicketOpen(false);
      setNewSubject("");
      setNewMessage("");
      fetchTickets();
    } catch (err: any) {
      toast({ title: "Erro ao abrir chamado", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    setSendingReply(true);
    try {
      const { error } = await supabase
        .from("support_ticket_messages")
        .insert({
          ticket_id: selectedTicket.id,
          user_id: userId,
          message: replyMessage.trim()
        });

      if (error) throw error;

      setReplyMessage("");
      fetchMessages(selectedTicket.id);
    } catch (err: any) {
      toast({ title: "Erro ao enviar mensagem", description: err.message, variant: "destructive" });
    } finally {
      setSendingReply(false);
    }
  };

  const openChat = (ticket: any) => {
    setSelectedTicket(ticket);
    fetchMessages(ticket.id);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Meus Chamados</h3>
          <p className="text-sm text-slate-500">Histórico de suporte e atendimento</p>
        </div>
        <Button onClick={() => setIsNewTicketOpen(true)}>
          <PlusCircle className="w-4 h-4 mr-2" /> Novo Chamado
        </Button>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 border border-slate-100 rounded-xl">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Você não possui chamados abertos.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center hover:border-indigo-300 transition-colors">
              <div>
                <h4 className="font-semibold text-slate-800">{ticket.subject}</h4>
                <div className="flex items-center gap-3 mt-1 text-sm">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    ticket.status === 'open' ? 'bg-amber-100 text-amber-700' :
                    ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {ticket.status === 'open' ? 'Aberto' : ticket.status === 'in_progress' ? 'Em Andamento' : 'Resolvido'}
                  </span>
                  <span className="text-slate-400">{new Date(ticket.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => openChat(ticket)}>Ver Chat</Button>
            </div>
          ))}
        </div>
      )}

      {/* New Ticket Dialog */}
      <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Abrir Novo Chamado</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleOpenTicket} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Assunto / Motivo</label>
              <Input 
                placeholder="Ex: Dúvida sobre meu pedido #123" 
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Mensagem</label>
              <Textarea 
                placeholder="Descreva com detalhes como podemos te ajudar..." 
                className="min-h-[120px]"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" type="button" onClick={() => setIsNewTicketOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Enviar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b border-slate-100 bg-slate-50">
            <DialogTitle>{selectedTicket?.subject}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.is_admin_reply ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.is_admin_reply 
                    ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none' 
                    : 'bg-indigo-600 text-white rounded-tr-none'
                }`}>
                  <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                  <span className={`text-[10px] mt-1 block ${msg.is_admin_reply ? 'text-slate-400' : 'text-indigo-200'}`}>
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            {selectedTicket?.status === 'resolved' ? (
              <div className="text-center text-sm text-slate-500 bg-slate-50 py-2 rounded-lg">
                Este chamado foi encerrado.
              </div>
            ) : (
              <form onSubmit={handleSendReply} className="flex gap-2">
                <Input 
                  placeholder="Digite sua resposta..." 
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
