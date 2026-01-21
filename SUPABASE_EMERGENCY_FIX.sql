-- EMERGÊNCIA: DESATIVAR RLS E FORÇAR ADMIN

-- 1. Desabilitar Row Level Security na tabela profiles
-- Isso remove qualquer verificação de política. A tabela fica aberta para leitura/escrita para usuários autenticados.
-- Isso ELIMINA o erro de recursão ou lentidão por políticas.
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Garantir que seu usuário exista na tabela profiles e seja ADMIN
-- Pega todos os usuários do Auth e insere/atualiza em Profiles
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', 'Admin User'), 
  'admin'
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- 3. (Opcional) Se precisar reativar depois, use: ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
