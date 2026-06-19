import { Dna, Brain, Orbit } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const pillars = [
  {
    icon: Dna,
    title: "Corpo (Bio-Equilíbrio)",
    description:
      "A sua Antena Biológica. Protocolos de desintoxicação, remoção da névoa química (Brain Fog) e a dieta do tipo sanguíneo para otimizar o seu combustível celular.",
  },
  {
    icon: Brain,
    title: "Mente (Empatia na Prática)",
    description:
      "Remoção do parasitismo mental e desenvolvimento da inteligência socioemocional. Cure a interface para recuperar o discernimento e a empatia genuína.",
  },
  {
    icon: Orbit,
    title: "Cosmos (Cosmologia Universal)",
    description:
      "Origens cósmicas, engenharia sideral e os mistérios do 'Criador Caído'. Uma jornada do micro ao macro para compreender a trama cósmica sem dogmas.",
  },
];

const Pillars = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="pilares" className="py-24 px-6">
      <div className="container mx-auto" ref={ref}>
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="font-heading text-sm font-semibold uppercase tracking-widest gradient-text mb-3">
            Os Três Pilares
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Uma jornada integrada de{" "}
            <span className="gradient-text">transformação</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              className={`group relative rounded-2xl border border-border bg-card p-8 hover:shadow-glow transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: isVisible ? `${i * 150}ms` : "0ms" }}
            >
              <div className="gradient-bg w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <pillar.icon className="text-primary-foreground" size={26} />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pillars;
