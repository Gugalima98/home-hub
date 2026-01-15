import { useState, useEffect } from "react";
import { User, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  {
    label: "Alugar",
    items: ["Apartamentos", "Casas", "Studios", "Quitinetes"],
  },
  {
    label: "Comprar",
    items: ["Apartamentos à venda", "Casas à venda", "Lançamentos", "Usados"],
  },
  {
    label: "Anunciar",
    items: ["Anunciar imóvel", "Planos para proprietários", "Imobiliárias"],
  },
  {
    label: "QPreço",
    items: ["Consultar preço", "Análise de mercado"],
  },
  {
    label: "Consórcio",
    items: ["Simular consórcio", "Como funciona", "Vantagens"],
  },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-background transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">Q</span>
          </div>
          <span className="text-xl font-bold text-primary">QuintoAndar</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <DropdownMenu key={item.label}>
              <DropdownMenuTrigger asChild>
                <button className="nav-link flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover z-50">
                {item.items.map((subItem) => (
                  <DropdownMenuItem key={subItem} className="cursor-pointer">
                    {subItem}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="nav-link flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                Links úteis
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-popover z-50">
              <DropdownMenuItem>Blog</DropdownMenuItem>
              <DropdownMenuItem>Guia de bairros</DropdownMenuItem>
              <DropdownMenuItem>Índice de aluguel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="nav-link px-3 py-2 rounded-lg hover:bg-muted transition-colors">
            Ajuda
          </button>
        </nav>

        {/* Login Button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden sm:flex items-center gap-2 rounded-xl">
            <User className="h-4 w-4" />
            Entrar
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.label} className="py-2">
                <span className="font-medium text-foreground">{item.label}</span>
                <div className="mt-2 pl-4 space-y-1">
                  {item.items.map((subItem) => (
                    <a
                      key={subItem}
                      href="#"
                      className="block py-1 text-muted-foreground hover:text-foreground"
                    >
                      {subItem}
                    </a>
                  ))}
                </div>
              </div>
            ))}
            <Button className="w-full mt-4 rounded-xl">
              <User className="h-4 w-4 mr-2" />
              Entrar
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
