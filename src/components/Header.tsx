import { ChevronDown, User, LayoutDashboard, LogOut, Menu, Building2, Key } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { label: "Comprar", path: "/imoveis?operation=buy", icon: Key },
  { label: "Alugar", path: "/imoveis?operation=rent", icon: Building2 },
  { label: "Anunciar", path: "/contato", icon: null }, // Fluxo de anunciar ainda não criado, direcionando para contato
  { label: "Blog", path: "/blog", icon: null },
  { label: "Sobre", path: "/sobre", icon: null },
  { label: "Contato", path: "/contato", icon: null },
];

interface HeaderProps {
  variant?: "default" | "search" | "simple";
}

const Header = ({ variant = "default" }: HeaderProps) => {
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "US";
  };

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
                    <SheetClose asChild>
                      <Link
                        to={item.path}
                        className="flex w-full items-center gap-2 py-2 text-base font-medium text-gray-700"
                      >
                        {item.icon && <item.icon className="h-4 w-4 text-gray-500" />}
                        {item.label}
                      </Link>
                    </SheetClose>
                  </div>
                ))}

                <div className="mt-4">
                  {user ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{profile?.full_name || "Usuário"}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">{user.email}</span>
                        </div>
                      </div>

                      <SheetClose asChild>
                        <Link to="/dashboard">
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Meu Painel
                          </Button>
                        </Link>
                      </SheetClose>

                      {profile?.role === 'admin' && (
                        <SheetClose asChild>
                          <Link to="/admin">
                            <Button variant="outline" className="w-full justify-start gap-2">
                              <Key className="h-4 w-4" />
                              Administração
                            </Button>
                          </Link>
                        </SheetClose>
                      )}

                      <Button variant="destructive" className="w-full justify-start gap-2" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4" />
                        Sair
                      </Button>
                    </div>
                  ) : (
                    <SheetClose asChild>
                      <Link to="/login" className="w-full">
                        <Button className="w-full justify-start gap-2">
                          <User className="h-4 w-4" />
                          Entrar
                        </Button>
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Login Button or User Dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name || "Usuário"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer w-full flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Meu Painel
                  </Link>
                </DropdownMenuItem>

                {profile?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer w-full flex items-center">
                      <Key className="mr-2 h-4 w-4" />
                      Administração
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button
                size="sm"
                className="rounded-full gap-2 h-9 px-4 font-semibold shadow-sm"
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
