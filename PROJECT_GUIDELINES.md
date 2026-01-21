# Diretrizes do Projeto - HomeHub (Clone QuintoAndar)

## 1. Visão Geral
O objetivo é construir uma plataforma imobiliária de alta fidelidade visual e funcional baseada no QuintoAndar (98% de similaridade). O foco principal é a experiência do usuário (UX), performance e **SEO robusto** para posicionamento no Google.

### Tecnologias Principais
*   **Frontend:** React, Vite, Tailwind CSS, Shadcn/UI.
*   **Backend:** Supabase (Database, Auth, Storage, Edge Functions).
*   **Mapas:** Leaflet (OpenStreetMap) + Nominatim (Geocoding).
*   **Deploy:** Vercel.
*   **SEO:** React Helmet Async (SPA) + URLs Amigáveis.

---

## 2. Status Atual (Concluído)

### 2.1. Backend & Autenticação (Supabase)
*   **Autenticação:** Login e Cadastro funcionais (`AuthProvider`). Proteção de rotas (`ProtectedRoute`) implementada.
*   **Banco de Dados:**
    *   Tabela `properties` criada com schema robusto (incluindo JSONB para imagens categorizadas e campos de geolocalização).
    *   Campo `code` adicionado para IDs curtos e amigáveis (ex: 100, 101).
*   **Storage:** Bucket `property-images` configurado para upload de fotos.

### 2.2. CMS (Painel Administrativo - `/admin`)
*   **Estrutura:** Layout exclusivo para admin, separado do painel do usuário.
*   **Listagem:** Tabela de imóveis com busca e ações de Excluir/Editar.
*   **Workflow de Imóveis:** Suporte a status (`draft`, `active`, `inactive`, `rented`, `sold`) para controle de rascunhos e publicação.
*   **Cadastro/Edição de Imóveis:** Formulário avançado com `react-hook-form` e `zod`.
    *   **Upload Inteligente:** Upload de fotos separado por cômodo (Sala, Cozinha, Fachada, etc.).
    *   **Localização Automática:** Integração com **ViaCEP** (preenchimento de endereço) e **IBGE** (dropdowns de Estado/Cidade).
    *   **Geocodificação:** Busca automática de Latitude/Longitude via API Nominatim ao preencher o endereço.
    *   **Destaques:** Funcionalidade de marcar imóveis como `featured` (Destaque).

### 2.3. Gestão de Usuários & Permissões (RBAC)
*   **Sistema de Roles:** Implementado suporte para perfis: `admin`, `realtor` (corretor), `owner` e `user`.
*   **Painel de Usuários (`/admin/users`):** Interface para listagem, edição e exclusão de usuários.
*   **Criação Administrativa:** Admins podem criar novos usuários (ex: corretores) via interface, acionando uma **Edge Function** (`create-user`) segura.
*   **Segurança:** Implementação de políticas RLS com funções `SECURITY DEFINER` para evitar recursão infinita na verificação de permissões.

### 2.4. Frontend Público (Integração Real)
*   **Home & Listagem (`/imoveis`):**
    *   Conectada ao Supabase. Exibe imóveis reais cadastrados no CMS.
    *   **Filtros Funcionais:** Barra de filtros (`FilterBar`) conectada a um **Contexto Global (`FilterContext`)**. Filtros de Preço, Quartos, Vagas, Operação (Alugar/Comprar) e Busca Textual funcionam em tempo real.
    *   **Mapa Interativo:** Exibe marcadores nas coordenadas reais dos imóveis. Popups com foto, preço e link funcional.
*   **Detalhes do Imóvel (`/imovel/:code/:operation/:slug`):**
    *   **URLs Amigáveis:** Implementadas para SEO (ex: `/imovel/123/alugar/apartamento-moema-sp`).
    *   **Dados Reais:** Exibe carrossel de fotos categorizadas, preço calculado, descrição e características vindas do banco.
*   **Painel do Usuário (`/dashboard`):** Estrutura visual implementada com Sidebar responsiva (shadcn/ui), aguardando conexão com dados reais.

---

## 3. Próximos Passos (Pendências)

### 3.1. Refinamento de Filtros e Busca
*   [ ] **Sidebar "Mais Filtros":** Conectar o componente `FiltersSidebar.tsx` (que abre o menu lateral) ao `FilterContext`. O componente visual está pronto, mas o contexto precisa ser expandido para suportar arrays específicos (amenities, furniture, etc.).
*   [ ] **Filtros Avançados no Backend:** Garantir que a query do Supabase suporte todos os filtros específicos da Sidebar.

### 3.2. Funcionalidades de Usuário
*   [ ] **Favoritos Reais:**
    *   Criar tabela `favorites` (relação `user_id` <-> `property_id`).
    *   Atualizar o botão de coração no Card e na Página de Detalhes para salvar no banco.
    *   Criar página "Meus Favoritos" no Dashboard do Usuário.
*   [ ] **Agendamento/Leads:**
    *   Criar tabela `leads` ou `visitas`.
    *   Fazer o botão "Agendar Visita" salvar um registro no banco para o proprietário/admin ver.

### 3.3. Painel do Usuário (`/dashboard`)
*   [ ] Conectar a listagem "Meus Imóveis" (Visual pronto, falta lógica).
*   [ ] Implementar edição restrita (apenas dos próprios imóveis).

---

## 4. Estrutura de Dados (Referência)

### Tabela `properties`
*   `id` (UUID) / `code` (Int - ID Amigável, Unique Index)
*   `owner_id` (UUID - FK auth.users)
*   `status` (Enum: draft, active, inactive, rented, sold)
*   `featured` (Boolean)
*   `views_count` (Integer)
*   `title`, `description`
*   `operation_type` (rent/buy), `property_type` (Apartamento/Casa...)
*   `price`, `condo_fee`, `iptu`, `total_price`
*   `address`, `address_number`, `address_complement`, `neighborhood`, `city`, `state`, `cep`, `latitude`, `longitude`
*   `bedrooms`, `suites`, `bathrooms`, `parking_spots`, `area`
*   `images` (JSONB: `{ "Sala": ["url1"], "Cozinha": ["url2"] }`)
*   Arrays de features: `condo_amenities`, `available_items`, `furniture_items`, `wellness_items`, `appliances_items`, `room_items`, `accessibility_items`.

### Tabela `profiles`
*   `id` (UUID - PK, FK auth.users)
*   `email`, `full_name`, `phone`, `creci`
*   `role` (Enum: admin, realtor, owner, user)

---

## 5. Ordem de Execução Sugerida
1.  **Sidebar de Filtros:** Atualizar `FilterContext` e conectar `FiltersSidebar` para habilitar busca avançada.
2.  **Favoritos:** Implementar tabela e lógica de favoritar imóveis.
3.  **Leads:** Implementar fluxo de "Agendar Visita".
4.  **Refinamento do Dashboard:** Conectar dados reais ao layout existente.