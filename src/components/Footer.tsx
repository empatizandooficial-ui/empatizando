import { Instagram, MessageCircle, Facebook, Youtube } from "lucide-react";

import { TrustBadges } from "@/components/TrustBadges";

const Footer = () => {
  return (
    <footer id="sobre" className="border-t border-border py-12 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <a href="#" className="font-heading text-xl font-bold gradient-text">
            Empatizando
          </a>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://chat.whatsapp.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="WhatsApp">
              <MessageCircle size={20} />
            </a>
            <a href="https://www.facebook.com/share/1KW9YBm4bC/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="https://youtube.com/@empatizando?si=UD7uOq0eUylYfdnP" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="YouTube">
              <Youtube size={20} />
            </a>
            <a href="https://www.tiktok.com/@empatizando4?_r=1&_t=ZS-942DTIg0u07" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.2 8.2 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.15z"/></svg>
            </a>
          </div>
        </div>

        <TrustBadges />

        <div className="border-t border-border pt-6 mt-6">
          {/* Aviso médico oculto temporariamente:
          <p className="text-muted-foreground text-xs text-center leading-relaxed max-w-2xl mx-auto mb-4">
            ⚠️ Aviso: O conteúdo apresentado neste site tem caráter educacional e
            informativo. Não substitui orientação médica, nutricional ou
            psicológica profissional. Consulte sempre um profissional qualificado.
          </p>
          */}
          <div className="flex flex-wrap justify-center gap-4 mb-4 mt-2">
            <a href="/privacy-policy" className="text-muted-foreground hover:text-foreground text-xs transition-colors">Política de Privacidade</a>
            <a href="/terms-of-use" className="text-muted-foreground hover:text-foreground text-xs transition-colors">Termos de Uso</a>
          </div>
          <p className="text-muted-foreground text-xs text-center">
            © {new Date().getFullYear()} Empatizando. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
