-- CORREÇÃO DE ERRO 500 (RECURSÃO INFINITA EM RLS)

-- 1. Remover as políticas problemáticas que causam o loop
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- 2. Criar uma função segura para verificar se é admin
-- O segredo é "SECURITY DEFINER": ela roda com permissões totais, ignorando o RLS,
-- permitindo ler a role sem causar o loop infinito.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recriar as políticas usando a função segura
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING ( public.is_admin() );

CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING ( public.is_admin() );

-- 4. Garantir que você (usuário atual) seja admin (caso tenha perdido acesso)
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = auth.uid();
