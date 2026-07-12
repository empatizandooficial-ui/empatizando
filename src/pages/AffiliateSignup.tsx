import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AffiliateSignup() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pixKey, setPixKey] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro de Autenticação",
          description: "Você precisa estar logado para se tornar um afiliado.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Generate a random 6-char referral code
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { error } = await supabase.from("affiliates").insert({
        user_id: user.id,
        referral_code: referralCode,
        pix_key: pixKey,
        status: "pending"
      });

      if (error) throw error;

      toast({
        title: "Cadastro Concluído!",
        description: "Sua solicitação está em análise. Em breve você terá acesso ao portal.",
      });
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível concluir o cadastro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Seja um Embaixador Empatizando</CardTitle>
          <CardDescription>
            Ajude a promover um trânsito mais humano e ganhe comissões por cada venda realizada através do seu link exclusivo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pix">Chave PIX (Para recebimento das comissões)</Label>
              <Input 
                id="pix" 
                placeholder="CPF, E-mail ou Celular" 
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cadastrando..." : "Solicitar Acesso"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-slate-500">
          <p>Comissão inicial de R$ 10,00 por adesivo vendido.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
