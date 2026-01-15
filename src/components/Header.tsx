import { ChevronDown, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Alugar", hasDropdown: true },
  { label: "Comprar", hasDropdown: true },
  { label: "Anunciar", hasDropdown: true },
  { label: "QPreço", hasDropdown: true },
  { label: "Consórcio", hasDropdown: false },
  { label: "Links úteis", hasDropdown: true },
  { label: "Ajuda", hasDropdown: true },
];

interface HeaderProps {
  variant?: "default" | "search";
}

const Header = ({ variant = "default" }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
            <span className="text-sm font-bold text-primary-foreground">Q</span>
          </div>
          <span className="text-lg font-bold text-foreground">QuintoAndar</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            item.hasDropdown ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-popover z-50">
                  <DropdownMenuItem>Opção 1</DropdownMenuItem>
                  <DropdownMenuItem>Opção 2</DropdownMenuItem>
                  <DropdownMenuItem>Opção 3</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                key={item.label}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </button>
            )
          ))}
        </nav>

        {/* Login Button */}
        <Button variant="outline" size="sm" className="rounded-full gap-2 h-9 px-4">
          <User className="h-4 w-4" />
          Entrar
        </Button>
      </div>
    </header>
  );
};

export default Header;
