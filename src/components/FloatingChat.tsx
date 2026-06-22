import { useState } from "react";
import { Heart, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-primary/10 p-4 border-b border-border flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-primary flex items-center gap-2">
                <Heart size={20} fill="currentColor" />
                Fale com a IA
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Conforto e acolhimento em 1 clique</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-primary/20 hover:text-primary">
              <X size={18} />
            </Button>
          </div>
          
          <div className="p-4 h-64 overflow-y-auto bg-muted/20 flex flex-col gap-3">
            <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-sm w-[90%] text-sm shadow-sm text-foreground">
              Olá! Sou a inteligência artificial do Empatizando. Estou aqui para te ouvir sem julgamentos. Como você está se sentindo hoje?
            </div>
          </div>
          
          <div className="p-3 bg-card border-t border-border">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Digite sua mensagem..." 
                className="w-full bg-muted/50 border border-border rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                disabled
              />
              <Button size="icon" className="absolute right-1 top-1 bottom-1 h-[calc(100%-8px)] w-8 rounded-full gradient-bg hover:opacity-90" onClick={() => window.location.href='/login'}>
                <Send size={14} className="text-white" />
              </Button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-3">
              Faça <a href="/login" className="underline text-primary hover:text-primary/80">login</a> ou crie uma conta para conversar livremente.
            </p>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group text-primary flex items-center justify-center transition-transform hover:scale-110 focus:outline-none"
        >
          <div className="absolute inset-0 flex items-center justify-center animate-heartbeat pointer-events-none">
             <Heart size={72} className="fill-primary/40 blur-md" />
          </div>
          <Heart size={64} fill="currentColor" strokeWidth={1} className="relative z-10 animate-heartbeat text-primary drop-shadow-[0_10px_20px_rgba(0,180,180,0.5)]" />
        </button>
      )}
    </div>
  );
};
