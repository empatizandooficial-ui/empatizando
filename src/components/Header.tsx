import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

const publicNavLinks = [
  { label: "Pilares", href: "/#pilares" },
  { label: "Portal", href: "/portal" },
  { label: "Vídeos", href: "/#videos" },
  { label: "Comunidade", href: "/#comunidade" },
  { label: "Sobre", href: "/#sobre" },
];

const adminNavLinks = [
  { label: "Hub Central", href: "/admin" },
  { label: "Estúdio", href: "/admin/studio" },
  { label: "Automação", href: "/admin/automation" },
];

const Header = ({ darkTextOnTop = false }: { darkTextOnTop?: boolean }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  
  const isPortalPage = location.pathname.includes("portal");
  const isAdminPage = location.pathname.startsWith("/admin");
  const isHomePage = location.pathname === "/";
  const useLightText = isHomePage && !scrolled && !darkTextOnTop;
  
  const currentNavLinks = isAdminPage ? adminNavLinks : publicNavLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isPortalPage
          ? "bg-background/90 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <img src={logo} alt="Empatizando logo" className="h-10 w-10 rounded-full object-cover" />
          <span className={`font-heading text-2xl font-bold ${useLightText ? 'text-primary-foreground drop-shadow-md' : 'gradient-text'}`}>Empatizando</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {currentNavLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-heading text-sm transition-colors ${
                useLightText
                  ? "text-white font-semibold drop-shadow-lg hover:text-white/80"
                  : "text-foreground font-medium hover:text-primary"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#pilares"
            className="bg-accent text-accent-foreground font-heading text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Começar
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className={`md:hidden ${useLightText ? 'text-primary-foreground' : 'text-foreground'}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-background/95 backdrop-blur-md border-t border-border px-6 py-4 animate-fade-in">
          {currentNavLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 font-heading text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#pilares"
            onClick={() => setMobileOpen(false)}
            className="block mt-2 text-center bg-accent text-accent-foreground font-heading text-sm font-semibold px-5 py-2.5 rounded-full"
          >
            Começar
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
