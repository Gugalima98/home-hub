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
*   **Deploy:** Configurado na Vercel com variáveis de ambiente seguras e regras de rota (`vercel.json`, `.npmrc`).

### 2.2. CMS (Painel Administrativo - `/admin`)
*   **Estrutura:** Layout exclusivo, separado do painel do usuário.
*   **Gestão de Imóveis:** Listagem, Cadastro Completo (com ViaCEP/Nominatim) e Edição.
*   **Gestão de SEO (`/admin/seo-cities`):** Interface para criar e editar links de cidades e seção "Buscas Populares" da Home.
*   **Gestão de Usuários:** Listagem e controle de permissões.

### 2.3. Frontend Público (Home & Navegação)
*   **Home Page (`/`):** Totalmente funcional e responsiva (Mobile-First).
    *   **Hero:** Busca otimizada para mobile com card centralizado.
    *   **Header:** Menu lateral (Sheet) implementado para mobile.
    *   **Serviços:** Cards adaptáveis (ocultam ilustrações no mobile para limpeza visual).
    *   **Cidades:** Slider de cidades com snap e layout fluido (85vw) no mobile.
*   **Listagem (`/imoveis`):**
    *   **Mobile UI (QuintoAndar Style):** Header fixo com busca e chips de filtros horizontais. Botões flutuantes para Mapa e Alertas.
    *   **Filtros:** Sidebar (`FiltersSidebar`) integrada e funcional no mobile.
    *   **Mapa Interativo:** Alternância fluida entre lista e mapa.
*   **Páginas Institucionais:**
    *   `About` (/sobre), `Contact` (/contato), `Blog` (/blog), `BlogPost` (artigos individuais).
    *   **Jurídico:** `Privacy`, `Cookies`, `Terms`, `Sitemap`.
*   **UX:** ScrollToTop implementado.

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
*   [ ] **Validação Completa:** Garantir que todos os filtros do Sidebar (complexos) estejam refletindo na query do Supabase corretamente em todos os cenários.

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
