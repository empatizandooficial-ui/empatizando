import Header from "@/components/Header";
import Footer from "@/components/Footer";

const contents = [
  {
    id: 1,
    pillar: "Corpo",
    type: "YouTube Short",
    title: "Limpando a Lente",
    description: "Descubra como o corpo age como uma Antena Biológica e como a 'Frequência de Prato' certa elimina a Névoa Química (Brain Fog).",
    icon: "🧘‍♂️",
    link: "#"
  },
  {
    id: 2,
    pillar: "Mente",
    type: "Instagram Carrossel",
    title: "O Verdadeiro Significado da Empatia",
    description: "Aprenda a diferença entre Bio-Empatia verdadeira e Parasitismo Mental. Proteja sua energia vital.",
    icon: "🧠",
    link: "#"
  },
  {
    id: 3,
    pillar: "Cosmos",
    type: "Newsletter",
    title: "A Sintonia do Todo",
    description: "Entenda como os Filtros de Percepção humanos distorcem as Leis Universais quando estamos intoxicados por dogmas.",
    icon: "🌌",
    link: "#"
  }
];

const Portal = () => {
  return (
    <div className="min-h-screen bg-background gradient-subtle-bg flex flex-col">
      <Header />
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-up">
            <h1 className="font-heading text-4xl md:text-5xl font-bold gradient-text mb-4">
              Portal Empatizando
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sua jornada contínua pelo Autoconhecimento. Explore nossos conteúdos divididos pelos três pilares fundamentais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contents.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-glow transition-all animate-fade-up flex flex-col h-full"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                    {item.pillar}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.type}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground mb-6 flex-grow">
                  {item.description}
                </p>
                <a href={item.link} className="inline-block text-sm font-semibold text-accent hover:text-accent/80 transition-colors mt-auto">
                  Acessar Conteúdo &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Portal;
