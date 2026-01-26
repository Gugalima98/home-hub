import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";

const Sitemap = () => {
  const sections = [
    {
      title: "Principal",
      links: [
        { label: "Início", href: "/" },
        { label: "Buscar Imóveis", href: "/imoveis" },
        { label: "Alugar", href: "/imoveis?operation=rent" },
        { label: "Comprar", href: "/imoveis?operation=buy" },
      ]
    },
    {
      title: "Institucional",
      links: [
        { label: "Sobre Nós", href: "/sobre" },
        { label: "Blog", href: "/blog" },
        { label: "Contato", href: "/contato" },
      ]
    },
    {
      title: "Conta",
      links: [
        { label: "Entrar", href: "/login" },
        { label: "Cadastrar", href: "/register" },
        { label: "Minha Conta", href: "/dashboard" },
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Aviso de Privacidade", href: "/privacidade" },
        { label: "Política de Cookies", href: "/cookies" },
        { label: "Termos de Uso", href: "/termos" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Mapa do Site | R7 Consultoria" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-10 text-[#1f2022]">Mapa do Site</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-bold mb-4 text-primary border-b pb-2">{section.title}</h2>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href} 
                      className="text-gray-600 hover:text-primary hover:underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sitemap;
