import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  sobreNos: {
    title: "Sobre nós",
    links: [
      { label: "Conheça o R7 Consultoria", href: "/sobre" },
      { label: "Blog do R7 Consultoria", href: "/blog" },
      { label: "Contato", href: "/contato" },
    ],
  },
  produtos: {
    title: "Produtos",
    links: [
      { label: "Alugar pelo R7 Consultoria", href: "/imoveis?operation=rent" },
      { label: "Comprar com a R7 Consultoria", href: "/imoveis?operation=buy" },
      { label: "Consórcio", href: "/blog/como-funciona-consorcio-imobiliario" },
      { label: "Financiamento", href: "/blog/guia-financiamento-imobiliario" },
    ],
  },
};

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Sobre nós */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {footerLinks.sobreNos.title}
            </h4>
            <ul className="space-y-2">
              {footerLinks.sobreNos.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Produtos */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {footerLinks.produtos.title}
            </h4>
            <ul className="space-y-2">
              {footerLinks.produtos.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Card Destaque */}
          <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <span className="text-lg font-bold">R7</span>
              </div>
              <span className="text-xl font-bold">R7 Consultoria</span>
            </div>
            <p className="text-sm text-primary-foreground/80 mb-4">
              A sua próxima casa está aqui. Alugue ou compre de forma simples, rápida e segura.
            </p>
            <Link
              to="/imoveis"
              className="text-sm font-medium underline hover:no-underline"
            >
              Ver imóveis →
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <Link to="/privacidade" className="hover:text-foreground transition-colors">
                Aviso de privacidade
              </Link>
              <Link to="/cookies" className="hover:text-foreground transition-colors">
                Política de cookies
              </Link>
              <Link to="/termos" className="hover:text-foreground transition-colors">
                Termos de uso
              </Link>
              <Link to="/mapa-do-site" className="hover:text-foreground transition-colors">
                Mapa do site
              </Link>
            </div>

            {/* Social Icons Only */}
            <div className="flex items-center gap-6">
              <div className="flex gap-3">
                <a
                  href="#"
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Facebook className="h-5 w-5 text-muted-foreground" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Instagram className="h-5 w-5 text-muted-foreground" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-muted-foreground" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Youtube className="h-5 w-5 text-muted-foreground" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>
              © 2025 R7 Consultoria. Todos os direitos reservados. CRECI-SP: 034547-J
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
