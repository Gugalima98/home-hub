import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const footerLinks = {
  sobreNos: {
    title: "Sobre nós",
    links: [
      "Conheça o R7 Consultoria",
      "Blog do R7 Consultoria",
      "Responsabilidade Social",
      "Contato",
      "Central de Ajuda",
      "Seja um Corretor Parceiro",
      "Trabalhe na R7 Consultoria",
      "Segurança",
      "Investidores",
      "R7 Consultoria Empresas",
    ],
  },
  produtos: {
    title: "Produtos",
    links: [
      "Alugar pelo R7 Consultoria",
      "Administração de aluguéis",
      "Comprar com a R7 Consultoria",
      "Consórcio",
      "Financiamento",
      "QPreço",
      "Seguros",
      "Parceria com Imobiliárias",
    ],
  },
  trabalheConosco: {
    title: "Trabalhe com a gente",
    links: [
      "Carreiras",
      "Seja um corretor parceiro",
      "Vagas de TI",
      "Programa de estágio",
    ],
  },
};

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Sobre nós */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {footerLinks.sobreNos.title}
            </h4>
            <ul className="space-y-2">
              {footerLinks.sobreNos.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
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
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trabalhe com a gente */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              {footerLinks.trabalheConosco.title}
            </h4>
            <ul className="space-y-2">
              {footerLinks.trabalheConosco.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
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
            <a
              href="#"
              className="text-sm font-medium underline hover:no-underline"
            >
              Ver imóveis →
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Aviso de privacidade
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Política de cookies
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Termos de uso
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Mapa do site
              </a>
            </div>

            {/* Social + App Stores */}
            <div className="flex items-center gap-6">
              {/* Social Icons */}
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

              {/* App Store Badges */}
              <div className="flex gap-2">
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 bg-foreground text-background rounded-lg text-xs hover:opacity-90 transition-opacity"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5 12.5c0-1.58-.79-2.98-2-3.82V7a.5.5 0 00-1 0v1.18c-.76-.31-1.58-.48-2.5-.48-.92 0-1.74.17-2.5.48V7a.5.5 0 00-1 0v1.68c-1.21.84-2 2.24-2 3.82 0 2.49 2.01 4.5 4.5 4.5h2c2.49 0 4.5-2.01 4.5-4.5z" />
                  </svg>
                  <div>
                    <div className="text-[10px] opacity-80">Baixe na</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 bg-foreground text-background rounded-lg text-xs hover:opacity-90 transition-opacity"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 20.5V3.5a.5.5 0 01.77-.42l16.5 8.5a.5.5 0 010 .84l-16.5 8.5a.5.5 0 01-.77-.42z" />
                  </svg>
                  <div>
                    <div className="text-[10px] opacity-80">Disponível no</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
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
