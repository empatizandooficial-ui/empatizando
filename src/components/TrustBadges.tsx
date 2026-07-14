import { ShieldCheck, Lock, Award, CheckCircle } from "lucide-react";

export function TrustBadges() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-6 border-t border-b border-slate-100 bg-slate-50/50">
      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-100 grayscale hover:grayscale-0 transition-all cursor-default">
        <ShieldCheck className="w-6 h-6 text-emerald-600" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500 leading-tight">Site Blindado</span>
          <span className="text-xs font-bold text-slate-800 leading-tight">100% Seguro</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-100 grayscale hover:grayscale-0 transition-all cursor-default">
        <Lock className="w-6 h-6 text-blue-600" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500 leading-tight">Certificado SSL</span>
          <span className="text-xs font-bold text-slate-800 leading-tight">Dados Criptografados</span>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-100 grayscale hover:grayscale-0 transition-all cursor-default">
        <Award className="w-6 h-6 text-amber-500" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500 leading-tight">Avaliação E-bit</span>
          <span className="text-xs font-bold text-slate-800 leading-tight">Loja Confiável</span>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-100 grayscale hover:grayscale-0 transition-all cursor-default">
        <CheckCircle className="w-6 h-6 text-indigo-600" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500 leading-tight">Pagamento Asaas</span>
          <span className="text-xs font-bold text-slate-800 leading-tight">Gateway Oficial</span>
        </div>
      </div>
    </div>
  );
}
