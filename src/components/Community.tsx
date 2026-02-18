import { MessageCircle, Instagram } from "lucide-react";

const Community = () => {
  return (
    <section id="comunidade" className="py-24 px-6">
      <div className="container mx-auto max-w-4xl text-center">
        <p className="font-heading text-sm font-semibold uppercase tracking-widest gradient-text mb-3">
          Comunidade
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          Faça parte da <span className="gradient-text">jornada</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-12">
          Conecte-se com pessoas que buscam o mesmo despertar. Compartilhe
          experiências, tire dúvidas e cresça junto.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <a
            href="https://chat.whatsapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 hover:shadow-glow transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-[hsl(142,70%,45%)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageCircle className="text-primary-foreground" size={26} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-foreground mb-1">
                WhatsApp
              </h3>
              <p className="text-muted-foreground text-sm">
                Entre na comunidade
              </p>
            </div>
          </a>

          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 hover:shadow-glow transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-[hsl(330,80%,55%)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Instagram className="text-primary-foreground" size={26} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-foreground mb-1">
                Instagram
              </h3>
              <p className="text-muted-foreground text-sm">
                Siga e acompanhe
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Community;
