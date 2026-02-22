import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const VideoSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="videos" className="py-24 px-6 gradient-subtle-bg">
      <div className="container mx-auto max-w-4xl" ref={ref}>
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="font-heading text-sm font-semibold uppercase tracking-widest gradient-text mb-3">
            Conteúdo em Vídeo
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Aprofunde seu <span className="gradient-text">conhecimento</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Acompanhe vídeos com reflexões sobre bio-equilíbrio, empatia e a
            mitologia universal que conecta tudo.
          </p>
        </div>

        <div
          className={`relative rounded-2xl overflow-hidden shadow-glow aspect-video bg-foreground/5 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/?listType=user_uploads&list=empatizando"
            title="Empatizando - Vídeo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <p
          className={`text-center text-muted-foreground text-sm mt-6 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <a
            href="https://youtube.com/@empatizando?si=UD7uOq0eUylYfdnP"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            Inscreva-se no canal
          </a>{" "}
          para não perder nenhum conteúdo novo.
        </p>
      </div>
    </section>
  );
};

export default VideoSection;
