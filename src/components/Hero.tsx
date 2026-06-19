import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-foreground/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-32 text-center">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6 opacity-0 animate-fade-up">
          O despertar começa
          <br />
          <span className="text-accent">pelo corpo.</span>
        </h1>

        <p
          className="max-w-2xl mx-auto text-primary-foreground/80 text-lg md:text-xl leading-relaxed mb-10 opacity-0 animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          Descomplicando a jornada do DNA às estrelas através do Bio-Equilíbrio,
          da Mente e da Cosmologia Universal.
        </p>

        <a
          href="#pilares"
          className="inline-block gradient-bg text-primary-foreground font-heading font-semibold text-lg px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-glow opacity-0 animate-fade-up"
          style={{ animationDelay: "400ms" }}
        >
          Começar Jornada
        </a>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
