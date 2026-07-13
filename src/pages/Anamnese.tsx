import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Heart, Brain, Sparkles, User, CloudLightning, CloudRain, Wind, Sunrise, Leaf, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function Anamnese() {
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    profession: "",
    body_pain_areas: [] as string[],
    body_pain_description: "",
    mind_state: "",
    mind_tags: [] as string[],
    soul_connection: "",
    main_goal: ""
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, 6));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 0));

  const toggleArrayItem = (key: 'body_pain_areas' | 'mind_tags', value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(i => i !== value)
        : [...prev[key], value]
    }));
  };

  const handleSubmit = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Acolhimento Pausado",
          description: "Para salvar essa jornada de forma segura, precisamos que você faça login.",
        });
        navigate("/login");
        return;
      }

      // No Supabase, salvaremos os dados. Para body_pain_areas e mind_tags, os vetores serão mapeados ou transformados em texto.
      const { error } = await (supabase as any).from("anamnesis_records").insert({
        user_id: userData.user.id,
        age: parseInt(formData.age) || null,
        profession: formData.profession,
        body_energy_level: 3, // placeholder
        body_pain_areas: formData.body_pain_areas,
        mind_state: `${formData.mind_state} - Tags: ${formData.mind_tags.join(", ")}`,
        sleep_quality: "Não avaliado agora",
        soul_connection: formData.soul_connection,
        main_goal: formData.main_goal
      });

      if (error) throw error;

      toast({
        title: "Acolhimento Concluído",
        description: "Seu mapa existencial foi salvo com sucesso. Seja bem-vindo(a).",
      });
      navigate("/portal");

    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: "Por favor, crie as tabelas no Supabase caso ainda não existam.",
        variant: "destructive"
      });
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white border border-stone-100 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-8 relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-stone-100">
          <div 
            className="h-full bg-gradient-to-r from-teal-400 to-purple-500 transition-all duration-700 ease-in-out"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        <div className="min-h-[400px] flex flex-col justify-center">
          
          {/* PASSO 0: Introdução */}
          {step === 0 && (
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <Leaf className="w-16 h-16 text-teal-500 mx-auto mb-6 animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-stone-800">
                Bem-vindo(a) a um espaço seguro.
              </h1>
              <p className="text-stone-500 mb-8 max-w-md mx-auto leading-relaxed">
                Aqui, você não é apenas um sintoma, mas uma história inteira. Respire fundo e permita-nos conhecer um pouco da sua jornada.
              </p>
              <Button onClick={handleNext} className="rounded-full px-8 bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/30">
                Começar Jornada <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}

          {/* PASSO 1: Dados Iniciais */}
          {step === 1 && (
            <div className="animate-in slide-in-from-right duration-500">
              <User className="w-12 h-12 text-teal-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-6">Quem é você no mundo?</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-stone-500">Como você gosta de ser chamado(a)?</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-stone-500">Quantas primaveras você já celebrou?</label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-stone-500">Como você dedica a maior parte da sua energia hoje? (Sua profissão ou ofício)</label>
                  <input 
                    type="text" 
                    value={formData.profession}
                    onChange={(e) => setFormData({...formData, profession: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASSO 2: O Mapa do Corpo */}
          {step === 2 && (
            <div className="animate-in slide-in-from-right duration-500">
              <Heart className="w-12 h-12 text-rose-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">O Mapa do Corpo</h2>
              <p className="text-stone-500 mb-6 text-sm">Nosso corpo é o nosso templo e guarda as nossas histórias. Onde o seu corpo tem pedido mais atenção ultimamente?</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {['Cabeça/Pescoço', 'Ombros/Costas', 'Peito', 'Estômago/Abdômen', 'Articulações/Pernas'].map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleArrayItem('body_pain_areas', area)}
                    className={`p-3 rounded-2xl border text-sm text-left transition-all ${
                      formData.body_pain_areas.includes(area) 
                        ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm' 
                        : 'bg-white border-stone-200 text-stone-600 hover:border-rose-200'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>

              {formData.body_pain_areas.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-4">
                  <p className="text-stone-500 mb-3 text-sm">Como você descreveria essa sensação que mora aí?</p>
                  <div className="flex flex-wrap gap-2">
                    {['Tensão constante', 'Cansaço profundo', 'Dor aguda', 'Peso/Sobrecarga'].map(desc => (
                      <button 
                        key={desc}
                        onClick={() => setFormData({...formData, body_pain_description: desc})}
                        className={`px-4 py-2 rounded-full text-xs transition-all border ${
                          formData.body_pain_description === desc 
                            ? 'bg-rose-100 border-rose-300 text-rose-800'
                            : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
                        }`}
                      >
                        {desc}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASSO 3: O Oceano da Mente */}
          {step === 3 && (
            <div className="animate-in slide-in-from-right duration-500">
              <Brain className="w-12 h-12 text-indigo-400 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">O Oceano da Mente</h2>
              <p className="text-stone-500 mb-6 text-sm">A mente, às vezes, é como o céu. Como tem estado o clima da sua mente nos últimos tempos?</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { id: 'Tempestuoso', icon: CloudLightning, desc: 'Pensamentos acelerados, ansiedade' },
                  { id: 'Nublado', icon: CloudRain, desc: 'Neblina mental, tristeza sutil' },
                  { id: 'Ventos Fortes', icon: Wind, desc: 'Irritabilidade, estresse à flor da pele' },
                  { id: 'Estagnado', icon: Sunrise, desc: 'Apatia, falta de energia' },
                ].map((state) => {
                  const Icon = state.icon;
                  const isSelected = formData.mind_state === state.id;
                  return (
                    <button
                      key={state.id}
                      onClick={() => setFormData({...formData, mind_state: state.id})}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                        isSelected 
                          ? 'bg-indigo-50 border-indigo-300 shadow-sm' 
                          : 'bg-white border-stone-200 hover:border-indigo-200'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mt-1 ${isSelected ? 'text-indigo-600' : 'text-stone-400'}`} />
                      <div>
                        <div className={`font-medium ${isSelected ? 'text-indigo-800' : 'text-stone-700'}`}>{state.id}</div>
                        <div className={`text-xs mt-1 ${isSelected ? 'text-indigo-600/80' : 'text-stone-500'}`}>{state.desc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {formData.mind_state && (
                <div className="animate-in fade-in slide-in-from-top-4">
                  <p className="text-stone-500 mb-3 text-sm">Palavras que têm ecoado nos seus pensamentos:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Medo', 'Sobrecarga', 'Solidão', 'Cobrança', 'Incerteza', 'Exaustão'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => toggleArrayItem('mind_tags', tag)}
                        className={`px-4 py-2 rounded-full text-xs transition-all border ${
                          formData.mind_tags.includes(tag)
                            ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                            : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASSO 4: O Suspiro da Alma */}
          {step === 4 && (
            <div className="animate-in slide-in-from-right duration-500">
              <Sparkles className="w-12 h-12 text-violet-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">O Suspiro da Alma</h2>
              <p className="text-stone-500 mb-6 text-sm">Quando o silêncio chega no final do dia e você fecha os olhos... o que mais faz falta para que você se sinta inteiro(a) e em paz?</p>
              
              <div className="space-y-3">
                {[
                  "Sinto falta de um sentido, do meu verdadeiro propósito.",
                  "Sinto falta de perdoar algo ou alguém do passado.",
                  "Sinto falta de tempo para apenas respirar e ser eu mesmo(a).",
                  "Sinto falta de uma conexão mais profunda com minha intuição."
                ].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFormData({...formData, soul_connection: opt})}
                    className={`w-full p-4 rounded-2xl border text-sm text-left transition-all ${
                      formData.soul_connection === opt 
                        ? 'bg-violet-50 border-violet-300 text-violet-800 shadow-sm' 
                        : 'bg-white border-stone-200 text-stone-600 hover:border-violet-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASSO 5: Fechamento */}
          {step === 5 && (
            <div className="animate-in slide-in-from-right duration-500">
              <Heart className="w-12 h-12 text-teal-600 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">O Ponto de Encontro</h2>
              <p className="text-stone-500 mb-6 text-sm">O que fez seu coração pedir para entrar no Empatizando hoje?</p>
              
              <div className="space-y-3">
                {[
                  "Busco alívio para uma dor que me acompanha há tempos.",
                  "Preciso me reencontrar e resgatar minha paz.",
                  "Quero aprender a cuidar de mim de forma natural e preventiva.",
                  "Apenas senti, no fundo, que eu precisava estar aqui."
                ].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFormData({...formData, main_goal: opt})}
                    className={`w-full p-4 rounded-2xl border text-sm text-left transition-all ${
                      formData.main_goal === opt 
                        ? 'bg-teal-50 border-teal-300 text-teal-800 shadow-sm' 
                        : 'bg-white border-stone-200 text-stone-600 hover:border-teal-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASSO 6: Disclaimer e Submissão */}
          {step === 6 && (
            <div className="text-center animate-in fade-in duration-500">
              <div className="bg-stone-50 border border-stone-200 p-6 rounded-3xl mb-8">
                <CheckCircle2 className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-4 text-stone-800">O Abraço Final</h2>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Agradecemos por abrir seu coração. Estamos aqui para caminhar de mãos dadas com você.
                </p>
                <p className="text-xs text-stone-500 leading-relaxed bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                  <strong>Lembre-se:</strong> todo o nosso acolhimento integrativo e natural é um complemento de amor à sua saúde. Nossas práticas caminham *junto* com o seu acompanhamento médico tradicional, somando forças para o seu bem-estar completo. Logo após entrarmos na plataforma, conversaremos sobre seus cuidados médicos atuais e medicações, para que possamos cuidar de você com total segurança.
                </p>
              </div>
              <Button onClick={handleSubmit} className="w-full rounded-full py-6 text-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-90 text-white shadow-xl shadow-teal-500/20">
                Iniciar minha jornada de cura
              </Button>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {step > 0 && step < 6 && (
          <div className="mt-8 flex justify-between items-center pt-6 border-t border-stone-100">
            <Button variant="ghost" onClick={handlePrev} className="text-stone-500 hover:text-stone-800 hover:bg-stone-100">
              <ChevronLeft className="mr-2 w-4 h-4" /> Voltar
            </Button>
            <Button onClick={handleNext} className="rounded-full px-6 bg-stone-800 text-white hover:bg-stone-700">
              Continuar <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
