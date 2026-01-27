import { ChevronDown, User, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  variant?: "default" | "search" | "simple";
}

const Header = ({ variant = "default" }: HeaderProps) => {
  const { user } = useAuth();

  if (variant === "simple") {
    return (
      <header className="sticky top-0 z-50 w-full bg-background border-b border-gray-200 shadow-sm">
        <div className="w-full max-w-[1728px] mx-auto flex items-center justify-center px-4 py-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
              <span className="text-sm font-bold text-primary-foreground">R7</span>
            </div>
            <span className="text-lg font-bold text-foreground">R7 Consultoria</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-gray-200 shadow-sm">
      <div className="w-full max-w-[1728px] mx-auto flex items-center justify-between px-4 md:px-20 py-4 md:py-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
            <span className="text-sm font-bold text-primary-foreground">R7</span>
          </div>
          <span className="text-lg font-bold text-foreground">R7 Consultoria</span>
        </Link>

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left flex items-center gap-2">
                   <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
                    <span className="text-sm font-bold text-primary-foreground">R7</span>
                  </div>
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <div key={item.label} className="border-b border-gray-100 pb-2">
                    <button className="flex w-full items-center justify-between py-2 text-base font-medium text-gray-700">
                      {item.label}
                      {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
                
                <div className="mt-4">
                  {user ? (
                    <Link to="/dashboard" className="w-full">
                      <Button className="w-full justify-start gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Meu Painel
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/login" className="w-full">
                      <Button className="w-full justify-start gap-2">
                        <User className="h-4 w-4" />
                        Entrar
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            {navItems.map((item) =>
              item.hasDropdown ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-sm text-black hover:text-gray-700 transition-colors">
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
                  className="text-sm text-black hover:text-gray-700 transition-colors"
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          {/* Login Button or Dashboard Link */}
          {user ? (
            <Link to="/dashboard">
              <Button
                size="sm"
                className="rounded-full gap-2 h-9 px-4 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                <LayoutDashboard className="h-4 w-4" />
                Meu Painel
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button
                size="sm"
                className="rounded-full gap-2 h-9 px-4 bg-gray-100 hover:bg-gray-200 text-foreground shadow-sm"
              >
                <User className="h-4 w-4" />
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
