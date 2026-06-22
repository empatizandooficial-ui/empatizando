import { HeartPulse, Users, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminProfessionals() {
  return (
    <div className="space-y-6 animate-fade-in text-stone-800">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
          <HeartPulse className="w-8 h-8 text-rose-500" />
          Hub de Especialistas
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-rose-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-stone-500 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-400" />
              Total Cadastrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-stone-800">0</div>
          </CardContent>
        </Card>

        <Card className="border-amber-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-stone-500 uppercase tracking-wider flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              Especialidades Únicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-stone-800">0</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center mt-8">
        <div className="w-16 h-16 bg-rose-50 flex items-center justify-center rounded-full mx-auto mb-4">
          <HeartPulse className="w-8 h-8 text-rose-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Nenhum profissional cadastrado</h2>
        <p className="text-stone-500 max-w-md mx-auto">
          Este hub será o centro de controle onde você poderá gerenciar a rede de terapeutas, médicos e especialistas para os quais os Leads "Encaminhados" serão direcionados.
        </p>
      </div>
    </div>
  );
}
