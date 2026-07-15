import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, MessageCircleQuestion, Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminQuestions() {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("product_questions")
        .select(`
          id, question, answer, created_at, answered_at,
          products (title, id),
          auth_users:user_id (email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (questionId: string) => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("product_questions")
        .update({
          answer: replyText.trim(),
          answered_at: new Date().toISOString()
        })
        .eq("id", questionId);

      if (error) throw error;
      
      toast({ title: "Pergunta respondida com sucesso!" });
      setReplyingTo(null);
      setReplyText("");
      fetchQuestions();
    } catch (err: any) {
      toast({ title: "Erro ao responder", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Perguntas de Produtos</h1>
        <p className="text-slate-500">Responda às dúvidas dos clientes para aumentar as vendas.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perguntas Pendentes</CardTitle>
          <CardDescription>Perguntas que ainda não possuem resposta.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
          ) : questions.filter(q => !q.answer).length === 0 ? (
            <div className="text-center py-8 text-slate-500">Nenhuma pergunta pendente!</div>
          ) : (
            <div className="space-y-4">
              {questions.filter(q => !q.answer).map(q => (
                <div key={q.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-indigo-700">{q.products?.title}</span>
                    <span className="text-xs text-slate-400">{new Date(q.created_at).toLocaleString()}</span>
                  </div>
                  <p className="font-medium text-slate-800 mb-1">P: {q.question}</p>
                  <p className="text-xs text-slate-500 mb-4">Por: {q.auth_users?.email}</p>
                  
                  {replyingTo === q.id ? (
                    <div className="space-y-2 mt-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                      <Textarea 
                        placeholder="Escreva sua resposta (ficará visível na página do produto)..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Cancelar</Button>
                        <Button size="sm" onClick={() => handleReply(q.id)} disabled={submitting}>
                          {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                          Publicar Resposta
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => { setReplyingTo(q.id); setReplyText(""); }}>
                      Responder
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Perguntas Respondidas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
          ) : questions.filter(q => q.answer).length === 0 ? (
            <div className="text-center py-8 text-slate-500">Nenhuma pergunta respondida ainda.</div>
          ) : (
            <div className="space-y-4">
              {questions.filter(q => q.answer).map(q => (
                <div key={q.id} className="p-4 border border-slate-200 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-slate-700">{q.products?.title}</span>
                    <span className="text-xs text-slate-400">{new Date(q.answered_at).toLocaleString()}</span>
                  </div>
                  <p className="font-medium text-slate-800 mb-2">P: {q.question}</p>
                  <div className="bg-indigo-50 p-3 rounded-lg text-sm text-slate-700">
                    <span className="font-bold text-indigo-700">R:</span> {q.answer}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
