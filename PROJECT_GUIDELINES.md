# Diretrizes do Projeto - HomeHub (Clone QuintoAndar / R7 Consultoria)

## 1. Visão Geral
O objetivo é construir uma plataforma imobiliária de alta fidelidade visual e funcional baseada no QuintoAndar (98% de similaridade). O foco principal é a experiência do usuário (UX), performance e **SEO robusto** para posicionamento no Google.

### Tecnologias Principais
*   **Frontend:** React, Vite, Tailwind CSS, Shadcn/UI.
*   **Backend:** Supabase (Database, Auth, Storage, Edge Functions).
*   **Mapas:** Leaflet (OpenStreetMap) + Nominatim (Geocoding).
*   **Deploy:** Vercel.
*   **SEO:** React Helmet Async (SPA) + URLs Amigáveis + JSON-LD Schema.

---

## 2. Status Atual (Concluído)

### 2.1. Backend & Autenticação (Supabase)
*   **Autenticação:** Login e Cadastro funcionais (`AuthProvider`). Proteção de rotas (`ProtectedRoute`) implementada.
*   **Banco de Dados:**
    *   Tabela `properties`: Schema robusto (JSONB para imagens, geolocalização).
    *   Tabela `seo_cities`: Gerenciamento dinâmico de links de cidades e rodapé para SEO.
*   **Storage:** Bucket `property-images` configurado.

### 2.2. CMS (Painel Administrativo - `/admin`)
*   **Estrutura:** Layout exclusivo, separado do painel do usuário.
*   **Gestão de Imóveis:** Listagem, Cadastro Completo (com ViaCEP/Nominatim) e Edição.
*   **Gestão de SEO (`/admin/seo-cities`):** Interface para criar e editar links de cidades e seção "Buscas Populares" da Home.
*   **Gestão de Usuários:** Listagem e controle de permissões.

### 2.3. Frontend Público (Home & Navegação)
*   **Home Page (`/`):** Totalmente funcional e conectada.
    *   **Hero:** Busca real de cidades/bairros com imóveis disponíveis.
    *   **Sobre:** Link para página institucional.
    *   **Serviços:** Carrossel e cards levando para filtros específicos (ex: "Apartamentos 2 quartos").
    *   **Cidades & Rodapé:** Conteúdo dinâmico vindo do banco (`seo_cities`).
*   **Páginas Institucionais:**
    *   `About` (/sobre), `Contact` (/contato), `Blog` (/blog), `BlogPost` (artigos individuais).
    *   **Jurídico:** `Privacy`, `Cookies`, `Terms`, `Sitemap`.
*   **Listagem (`/imoveis`):** Filtros, Mapa Interativo e Cards conectados ao Supabase.
*   **Detalhes (`/imovel/...`):** Galeria de fotos, mapa estático, e **Schema.org Product** para SEO.
*   **UX:** ScrollToTop implementado (rola para o topo ao navegar).

---

## 3. Próximos Passos (Pendências)

### 3.1. Funcionalidades de Usuário & Leads
*   [ ] **Favoritos:**
    *   Criar tabela `favorites` (relação `user_id` <-> `property_id`).
    *   Conectar botão de coração na UI para salvar no banco.
    *   Criar página "Meus Favoritos" no Dashboard.
*   [ ] **Agendamento/Leads:**
    *   Criar tabela `leads` ou `visitas`.
    *   Fazer o botão "Agendar Visita" e formulário de contato do imóvel salvarem no banco.
*   [ ] **Anunciar Imóvel (Fluxo do Usuário):**
    *   Criar Landing Page `/anunciar`.
    *   Permitir que usuários cadastrem imóveis (versão simplificada do form do admin).

### 3.2. Painel do Usuário (`/dashboard`)
*   [ ] Conectar a listagem "Meus Imóveis" (Visual pronto, falta lógica real).
*   [ ] Exibir estatísticas reais (visualizações, mensagens).

### 3.3. Refinamento de Filtros
*   [ ] **Sidebar "Mais Filtros":** Conectar totalmente o `FiltersSidebar` ao `FilterContext`. Atualmente os checkboxes visuais não alteram a query.

---

## 4. Estrutura de Dados (Referência)

### Tabela `properties`
*   `id`, `code`, `owner_id`, `status`
*   `title`, `description`, `price`, `condo_fee`, `iptu`
*   `address` (completo), `latitude`, `longitude`
*   `bedrooms`, `suites`, `bathrooms`, `parking_spots`, `area`
*   `images` (JSONB), Arrays de features (`condo_amenities`, etc.)

### Tabela `seo_cities`
*   `id`, `city`, `operation` (rent/buy), `links` (JSONB array de {label, url})
*   Usado para popular os carrosséis de cidades e o rodapé da Home.

### Tabela `profiles`
*   `id`, `email`, `full_name`, `role` (admin, realtor, owner, user)

---

## 5. Ordem de Execução Sugerida
1.  **Favoritos:** Implementar tabela e lógica de favoritar.
2.  **Anunciar Imóvel:** Criar fluxo de captação de leads/imóveis.
3.  **Leads:** Conectar formulários de contato das páginas de imóvel.
4.  **Refinamento do Dashboard:** Conectar dados do usuário.
