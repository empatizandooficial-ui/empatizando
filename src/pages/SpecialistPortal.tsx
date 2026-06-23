import { ShieldAlert, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export default function SpecialistPortal() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 animate-fade-in">
      <Card className="max-w-md w-full shadow-lg border-stone-200">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-heading font-bold text-stone-800">Cadastro Pendente</CardTitle>
          <CardDescription className="text-stone-500 mt-2">
            Seu perfil está sob análise da nossa curadoria.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-sm text-stone-600">
            Para garantir a máxima qualidade e segurança aos nossos pacientes, o Empatizando realiza uma verificação rigorosa de credenciais (CRM/CRP). Você receberá um aviso assim que o seu "Cockpit" for liberado.
          </p>
          <div className="bg-white border border-stone-200 p-4 rounded-xl flex items-center justify-center gap-3 text-stone-700 shadow-sm">
             <HeartPulse className="w-5 h-5 text-rose-500" />
             <span className="font-medium">Obrigado por se juntar à missão!</span>
          </div>
          <Button variant="outline" className="w-full border-stone-300 text-stone-700 hover:bg-stone-100" onClick={handleLogout}>
            Sair da Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
