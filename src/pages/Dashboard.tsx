import { useNavigate } from "react-router-dom";
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
import { Building2, Home, LogOut, Settings, User } from "lucide-react";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <div className="p-4">
              <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-primary text-white text-sm">R7</span>
                Painel
              </h1>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Gerenciamento</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/dashboard">
                        <Home className="h-4 w-4" />
                        <span>Início</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/dashboard/properties">
                        <Building2 className="h-4 w-4" />
                        <span>Meus Imóveis</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Conta</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/dashboard/profile">
                        <User className="h-4 w-4" />
                        <span>Meu Perfil</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/dashboard/settings">
                        <Settings className="h-4 w-4" />
                        <span>Configurações</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-500" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">Usuário</span>
                <span className="text-xs text-gray-500 truncate">{user?.email}</span>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 bg-gray-50 p-8">
          <div className="flex items-center gap-4 mb-8">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-2">Imóveis Cadastrados</h3>
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="text-sm text-gray-500 mt-1">Gerencie seu portfólio</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-2">Visualizações</h3>
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="text-sm text-gray-500 mt-1">Total de visitas este mês</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-2">Mensagens</h3>
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="text-sm text-gray-500 mt-1">Novos contatos</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
            <div className="flex gap-4">
              <Button>Cadastrar Imóvel</Button>
              <Button variant="outline">Ver Mensagens</Button>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
