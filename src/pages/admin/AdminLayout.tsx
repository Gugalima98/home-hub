import { useNavigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings, 
  LogOut, 
  ShieldCheck 
} from "lucide-react";

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#f8f9fa]">
        <Sidebar>
          <SidebarContent className="bg-[#1a1b26] text-white">
            <div className="p-6">
              <h1 className="text-xl font-bold flex items-center gap-2 text-white">
                <ShieldCheck className="h-6 w-6 text-indigo-400" />
                <span>Admin CMS</span>
              </h1>
              <p className="text-xs text-gray-400 mt-1">Gerenciamento R7</p>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-400">Sistema</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="hover:bg-white/10 text-gray-300 hover:text-white">
                      <Link to="/admin">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Visão Geral</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-400">Conteúdo</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="hover:bg-white/10 text-gray-300 hover:text-white">
                      <Link to="/admin/properties">
                        <Building2 className="h-4 w-4" />
                        <span>Imóveis</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="hover:bg-white/10 text-gray-300 hover:text-white">
                      <Link to="/admin/users">
                        <Users className="h-4 w-4" />
                        <span>Usuários</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-400">Configurações</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="hover:bg-white/10 text-gray-300 hover:text-white">
                      <Link to="/admin/settings">
                        <Settings className="h-4 w-4" />
                        <span>Geral</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="bg-[#1a1b26] p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-white truncate">Administrador</span>
                <span className="text-xs text-gray-400 truncate">{user?.email}</span>
              </div>
            </div>
            <Button 
              variant="destructive" 
              className="w-full justify-start gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none" 
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sair do Sistema
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 border-b bg-white flex items-center px-6 gap-4 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="flex-1" />
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              Ver Site
            </Button>
          </header>
          
          <div className="flex-1 overflow-auto p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
