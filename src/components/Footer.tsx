import { Instagram, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer id="sobre" className="border-t border-border py-12 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <a href="#" className="font-heading text-xl font-bold gradient-text">
            Empatizando
          </a>
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://chat.whatsapp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <p className="text-muted-foreground text-xs text-center leading-relaxed max-w-2xl mx-auto mb-4">
            ⚠️ Aviso: O conteúdo apresentado neste site tem caráter educacional e
            informativo. Não substitui orientação médica, nutricional ou
            psicológica profissional. Consulte sempre um profissional qualificado.
          </p>
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
