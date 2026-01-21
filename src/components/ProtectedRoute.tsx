import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [isTimeout, setIsTimeout] = useState(false);

  // Válvula de segurança: Se o AuthContext demorar mais de 3s, libera o acesso para teste
  useEffect(() => {
    const timer = setTimeout(() => {
      if (authLoading) {
        console.warn("ProtectedRoute: Tempo limite de carregamento excedido. Forçando renderização.");
        setIsTimeout(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [authLoading]);

  // Mostra loading apenas se estiver carregando E não tiver dado timeout
  if (authLoading && !isTimeout) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-2 bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-sm text-gray-500">Verificando permissões...</p>
      </div>
    );
  }

  // Se não tem usuário logado (mesmo após timeout), manda pro login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
