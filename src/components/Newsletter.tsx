import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Send } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const { error } = await supabase
        .from("leads_newsletter")
        .insert([{ email }]);

      if (error) {
        console.error("Supabase error:", error);
        setStatus("error");
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setStatus("error");
    }
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto max-w-4xl relative z-10 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 gradient-text">
          Sintonize a sua Antena Biológica
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Inscreva-se na nossa newsletter para receber reflexões exclusivas sobre Corpo, Mente e Cosmos, e descubra como dissipar a Névoa Química da sua rotina.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu melhor e-mail"
            required
            disabled={status === "loading" || status === "success"}
            className="w-full px-6 py-4 rounded-full bg-secondary/30 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-muted-foreground/70"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {status === "loading" ? "Enviando..." : status === "success" ? "Conectado!" : "Sintonizar"}
            {status !== "success" && status !== "loading" && <Send size={18} />}
          </button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-green-500 font-medium animate-fade-in">
            Bem-vindo ao ecossistema! Sua inscrição foi confirmada.
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 text-red-500 font-medium animate-fade-in">
            Houve um erro de conexão. Tente novamente mais tarde.
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
