import { MessageCircle, Instagram, Facebook } from "lucide-react";

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
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
              <h3 className="font-heading font-bold text-foreground mb-1">WhatsApp</h3>
              <p className="text-muted-foreground text-sm">Entre na comunidade</p>
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
              <h3 className="font-heading font-bold text-foreground mb-1">Instagram</h3>
              <p className="text-muted-foreground text-sm">Siga e acompanhe</p>
            </div>
          </a>

          <a
            href="https://www.facebook.com/share/1KW9YBm4bC/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 hover:shadow-glow transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-[hsl(220,70%,50%)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Facebook className="text-primary-foreground" size={26} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-foreground mb-1">Facebook</h3>
              <p className="text-muted-foreground text-sm">Curta a página</p>
            </div>
          </a>

          <a
            href="https://www.tiktok.com/@empatizando4?_r=1&_t=ZS-942DTIg0u07"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 hover:shadow-glow transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="text-primary-foreground" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.2 8.2 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.15z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-heading font-bold text-foreground mb-1">TikTok</h3>
              <p className="text-muted-foreground text-sm">Vídeos curtos</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Community;
