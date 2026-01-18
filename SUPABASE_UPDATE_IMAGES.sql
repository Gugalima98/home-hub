-- Alterar a coluna images de array de texto para JSONB
-- Isso permite salvar { "sala": ["url1"], "cozinha": ["url2"] }

ALTER TABLE public.properties 
DROP COLUMN images;

ALTER TABLE public.properties 
ADD COLUMN images jsonb DEFAULT '{}'::jsonb;
