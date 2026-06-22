import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-500">
      <div className="container mx-auto max-w-4xl bg-card border border-border rounded-lg shadow-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-card-foreground">
          <p className="mb-1 font-semibold">Sua Privacidade é Importante</p>
          <p className="text-muted-foreground">
            Utilizamos cookies essenciais para o funcionamento da plataforma e para melhorar a sua experiência. 
            Ao continuar navegando, você concorda com a nossa <a href="/privacy-policy" className="underline hover:text-primary">Política de Privacidade</a>.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button onClick={accept} className="whitespace-nowrap">
            Concordar e Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};
