-- Atualização da tabela properties para suportar CMS completo

-- 1. Tentar criar o tipo enum se não existir (Postgres não tem IF NOT EXISTS para CREATE TYPE direto, então usamos um bloco DO)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status') THEN
        CREATE TYPE property_status AS ENUM ('draft', 'active', 'inactive', 'rented', 'sold');
    END IF;
END$$;

-- 2. Adicionar novas colunas na tabela properties
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS status property_status DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS address_number TEXT,
ADD COLUMN IF NOT EXISTS address_complement TEXT,
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);

-- 4. Comentários para documentação
COMMENT ON COLUMN properties.status IS 'Estado do anúncio: draft (rascunho), active (publicado), inactive (pausado), etc.';
COMMENT ON COLUMN properties.featured IS 'Se o imóvel deve aparecer em destaque na home';
COMMENT ON COLUMN properties.address_number IS 'Número do endereço';
