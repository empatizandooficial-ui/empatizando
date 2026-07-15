import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star, Check, ThumbsUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export function ProductReviews({ productId }: { productId: string }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Dialog State
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Login necessário", description: "Você precisa estar logado para avaliar." });
      navigate("/login-cliente");
      return;
    }
    
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("product_reviews").insert({
        product_id: productId,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || "Cliente",
        rating,
        comment: comment.trim(),
      });

      if (error) throw error;

      toast({ title: "Avaliação publicada!", description: "Obrigado pelo seu feedback." });
      setComment("");
      setRating(5);
      setIsOpen(false);
      fetchReviews();
    } catch (err: any) {
      toast({ title: "Erro ao enviar", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="mt-16 bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Avaliações de Clientes</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl font-black text-slate-900">{averageRating}</span>
              <div className="flex flex-col">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-5 h-5 ${star <= parseFloat(averageRating) ? "fill-current" : "text-slate-200"}`} />
                  ))}
                </div>
                <span className="text-sm text-slate-500 font-medium mt-1">Baseado em {reviews.length} avaliações</span>
              </div>
            </div>
            
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-4 border-slate-200" onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    navigate("/login-cliente");
                  }
                }}>
                  Escrever Avaliação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Avalie este produto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Sua Nota</label>
                    <div className="flex gap-2 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-1 hover:scale-110 transition-transform ${star <= rating ? "fill-current" : "text-slate-200"}`}
                        >
                          <Star className={`w-8 h-8 ${star <= rating ? "fill-current" : ""}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">O que você achou?</label>
                    <Textarea 
                      placeholder="Conte para outros clientes a sua experiência com o produto..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting || !comment.trim()}>
                    {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Publicar Avaliação
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-slate-500 border border-slate-100 rounded-xl bg-slate-50">
                Seja o primeiro a avaliar este produto!
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">{review.user_name}</span>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Comprador Verificado
                        </span>
                      </div>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-4 h-4 ${star <= review.rating ? "fill-current" : "text-slate-200"}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-3">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
