import { createContext, useContext, useEffect, useState, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'realtor' | 'owner' | 'user';
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Ref para evitar chamadas duplicadas
  const lastFetchedUserId = useRef<string | null>(null);
  const isFetching = useRef(false);

  const fetchProfile = async (userId: string) => {
    // Se já estamos buscando este usuário ou acabamos de buscar, ignora
    if (isFetching.current || lastFetchedUserId.current === userId) {
      console.log("AuthContext: Busca de perfil ignorada (cache/dedup).");
      return;
    }

    try {
      isFetching.current = true;
      lastFetchedUserId.current = userId;
      console.log("AuthContext: Buscando perfil para user:", userId);
      
      // Cria uma promessa que rejeita após 5 segundos
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout ao buscar perfil")), 5000)
      );

      // Busca o perfil no Supabase
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Competição: Quem terminar primeiro ganha
      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;
      
      if (error) {
        console.warn('AuthContext: Erro/Timeout ao buscar perfil:', error);
        // Se der erro, permitimos tentar de novo depois
        lastFetchedUserId.current = null;
      } else {
        console.log("AuthContext: Perfil carregado:", data);
        setProfile(data);
      }
    } catch (error) {
      console.warn('AuthContext: Falha na conexão com perfil (Acesso liberado via Timeout):', error);
      lastFetchedUserId.current = null;
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        // CRÍTICO: Libera o app IMEDIATAMENTE.
        setLoading(false);
        
        if (session?.user) {
          // Busca perfil em background
          fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Erro fatal na autenticação:", error);
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        setSession(session);
        setUser(session?.user ?? null);
        
        // CRÍTICO: Libera o app IMEDIATAMENTE. Não espera o perfil.
        setLoading(false);

        if (session?.user) {
          // Busca perfil em background (sem travar a UI)
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Erro no listener de auth:", error);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, isAdmin, signOut }}>
      {!loading ? children : <div className="h-screen w-screen flex items-center justify-center">Carregando...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);