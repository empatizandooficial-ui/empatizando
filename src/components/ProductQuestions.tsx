import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageCircleQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProductQuestions({ productId }: { productId: string }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from("public_product_questions")
          .select("*")
          .eq("product_id", productId)
          .order("answered_at", { ascending: false });

        if (error) throw error;
        setQuestions(data || []);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para enviar uma pergunta.",
      });
      navigate("/login");
      return;
    }
    
    if (!newQuestion.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("product_questions").insert({
        product_id: productId,
        user_id: user.id,
        question: newQuestion.trim(),
      });

      if (error) throw error;

      toast({
        title: "Pergunta enviada!",
        description: "Sua pergunta foi enviada e será respondida em breve por nossa equipe.",
      });
      setNewQuestion("");
    } catch (err: any) {
      toast({
        title: "Erro ao enviar",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircleQuestion className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-slate-900">Perguntas e Respostas</h2>
      </div>

      <div className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-3">Tem alguma dúvida sobre este produto?</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea 
            placeholder="Escreva sua pergunta aqui..." 
            className="bg-white min-h-[100px]"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting || !newQuestion.trim()}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Enviar Pergunta
            </Button>
          </div>
        </form>
        {!user && (
          <p className="text-sm text-slate-500 mt-2">
            Você será redirecionado para o login se não estiver autenticado.
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-8 text-slate-500 border-t border-slate-100">
          Nenhuma pergunta respondida ainda. Seja o primeiro a perguntar!
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="mb-3">
                <span className="font-bold text-slate-900 mr-2">P:</span>
                <span className="text-slate-800 font-medium">{q.question}</span>
              </div>
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 relative ml-6">
                <div className="absolute -left-3 top-4 w-3 h-3 bg-indigo-50/50 border-l border-t border-indigo-100 rotate-[-45deg]"></div>
                <span className="font-bold text-indigo-700 mr-2">R:</span>
                <span className="text-slate-700">{q.answer}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
