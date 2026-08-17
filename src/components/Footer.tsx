import { Instagram, MessageCircle, Facebook, Youtube, Stethoscope, Handshake, ShieldCheck, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { TrustBadges } from "@/components/TrustBadges";

const Footer = () => {
  return (
    <footer id="sobre" className="border-t border-border bg-card/40 backdrop-blur-md py-14 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Coluna 1: Marca & Missão */}
          <div className="space-y-4">
            <Link to="/" className="font-heading text-2xl font-bold gradient-text inline-block">
              Empatizando
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Transformando a convivência humana e a segurança no trânsito através de empatia, inteligência e produtos de conscientização.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/60 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://chat.whatsapp.com/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/60 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
              <a href="https://www.facebook.com/share/1KW9YBm4bC/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/60 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://youtube.com/@empatizando?si=UD7uOq0eUylYfdnP" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/60 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
                <Youtube size={18} />
              </a>
              <a href="https://www.tiktok.com/@empatizando4?_r=1&_t=ZS-942DTIg0u07" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/60 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.2 8.2 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.15z"/></svg>
              </a>
            </div>
          </div>

          {/* Coluna 2: Loja & Navegação */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">Loja Oficial</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/loja" className="text-muted-foreground hover:text-primary transition-colors">Catálogo de Produtos</Link>
              </li>
              <li>
                <Link to="/loja" className="text-muted-foreground hover:text-primary transition-colors">Adesivos Veiculares</Link>
              </li>
              <li>
                <Link to="/login-cliente" className="text-muted-foreground hover:text-primary transition-colors">Área do Cliente (Meus Pedidos)</Link>
              </li>
              <li>
                <Link to="/portal" className="text-muted-foreground hover:text-primary transition-colors">Portal da Comunidade</Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Profissionais & Negócios (Diferenciação Clara) */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">Profissionais & B2B</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/especialista" className="text-muted-foreground hover:text-rose-500 transition-colors flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Para Especialistas de Saúde</span>
                </Link>
              </li>
              <li>
                <Link to="/afiliados/cadastro" className="text-muted-foreground hover:text-indigo-500 transition-colors flex items-center gap-1.5">
                  <Handshake className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Parceiros B2B (Autoescolas/Afiliados)</span>
                </Link>
              </li>
              <li>
                <Link to="/afiliados/login" className="text-muted-foreground hover:text-indigo-500 transition-colors text-xs ml-5.5">
                  Acessar Painel do Parceiro
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Segurança & Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">Legal & Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="text-muted-foreground hover:text-primary transition-colors">Termos de Uso</Link>
              </li>
              <li>
                <Link to="/exchange-policy" className="text-muted-foreground hover:text-primary transition-colors">Trocas e Devoluções</Link>
              </li>
            </ul>
          </div>

        </div>

        <TrustBadges />

        <div className="border-t border-border pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Empatizando Oficial. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Ambiente 100% Criptografado e Seguro</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

