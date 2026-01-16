# Diretrizes do Projeto - HomeHub (Clone QuintoAndar)

## 1. Visão Geral
O objetivo é construir uma plataforma imobiliária de alta fidelidade visual e funcional baseada no QuintoAndar (98% de similaridade). O foco principal é a experiência do usuário (UX), performance e **SEO robusto** para posicionamento no Google.

### Tecnologias Principais
*   **Frontend:** React, Vite, Tailwind CSS, Shadcn/UI.
*   **Backend:** Supabase (Database, Auth, Storage).
*   **Deploy:** Vercel.
*   **SEO:** React Helmet Async (SPA) ou migração futura para SSR se necessário.

---

## 2. Status Atual (Frontend)
*   **Home Page:** 95% concluída. Hero section, Service Cards (com carrosséis e vídeos de fundo), Slider de Cidades e Buscas Populares implementados com alta fidelidade.
*   **Barra de Filtros:** Visual implementado ("chunky pills"), fixa no topo e responsiva. **Pendente:** Conteúdo interno dos dropdowns e sidebar.
*   **Listagem de Imóveis:** Layout base implementado (Lista + Mapa). Falta refinar o cabeçalho da lista e integrar mapa real.
*   **SEO:** Estrutura base com `react-helmet-async` configurada.

---

## 3. Próximos Passos: Frontend (Faltante)

### 3.1. Refinamento da Página de Listagem e Filtros
*   [ ] **Menus dos Filtros (Dropdowns Individuais):**
    *   Ajustar o design interno de cada dropdown (Preço, Tipo, Quartos, etc.) para ser fiel ao original. Atualmente são placeholders ou Shadcn genéricos.
    *   Implementar lógica real de seleção (Slider de preço duplo, Seleção múltipla de tipos).
*   [ ] **Sidebar "Mais Filtros":**
    *   Criar o componente de Menu Lateral Esquerdo (Drawer/Sheet) que abre ao clicar em "Mais filtros".
    *   Incluir todos os filtros avançados neste menu (Andar, Sol, Mobília, etc.).
*   [ ] **Cabeçalho da Lista:** Implementar contador de imóveis ("X imóveis em SP") e botão de ordenação estilo dropdown limpo.
*   [ ] **Card de Imóvel:** Ajustar layout final (Carrossel de imagens no card, informações claras de preço e endereço).
*   [ ] **Mapa:** Substituir o placeholder por **Leaflet** (OpenStreetMap) ou Google Maps API. Fazer os pins serem clicáveis e sincronizados com a lista.

### 3.2. Página de Detalhes do Imóvel
*   [ ] Refinar a galeria de fotos (Grid bento ou carrossel full-screen).
*   [ ] Ajustar a calculadora de preços flutuante (Sticky Sidebar).
*   [ ] Formulário de agendamento de visita funcional (apenas visual por enquanto).

### 3.3. Sistema de Login & Autenticação
*   [ ] **Página de Login/Cadastro:** Criar telas para Login e Registro.
*   [ ] **Tipos de Usuário:** Diferenciar visualmente ou no fluxo:
    *   **Usuário Comum:** Busca e favorita imóveis.
    *   **Anunciante (Proprietário):** Cadastra imóveis.
    *   **Admin:** Gerencia todo o sistema (CMS).

### 3.4. Fluxo de Anúncio (User/Proprietário)
*   [ ] Criar wizard (passo a passo) para cadastro de imóvel:
    *   Dados básicos (Endereço, Tipo).
    *   Detalhes (Quartos, Área, Vagas).
    *   Upload de Fotos.
    *   Definição de Valores.

---

## 4. Backend (Supabase)

### 4.1. Banco de Dados (PostgreSQL)
Criar as tabelas principais:
*   `profiles`: Dados estendidos dos usuários.
*   `properties`: Tabela principal de imóveis (título, descrição, preço, endereço, coordenadas lat/long, features JSONB).
*   `property_images`: URLs das imagens vinculadas aos imóveis.
*   `favorites`: Relação usuário-imóvel.

### 4.2. Autenticação
*   Configurar Supabase Auth (Email/Senha e Social Login se desejar).
*   Implementar RLS (Row Level Security) para proteger dados (apenas admin edita tudo, proprietário edita seus imóveis).

### 4.3. Storage
*   Configurar buckets para upload de imagens dos imóveis.
*   Otimização de imagens (se possível via Edge Functions ou no upload).

---

## 5. CMS (Painel Administrativo)
O "CMS" será uma área restrita do próprio frontend (`/admin`) acessível apenas para usuários com role `admin`.

### Funcionalidades do CMS:
*   [ ] **Dashboard:** Visão geral de métricas (imóveis cadastrados, acessos).
*   [ ] **Gestão de Imóveis:** Tabela com busca e filtros para Editar, Excluir ou Aprovar/Reprovar anúncios de usuários.
*   [ ] **Gestão de Destaques:** Selecionar quais imóveis aparecem na Home ou no topo das listas.
*   [ ] **Gestão de SEO:** (Opcional) Editar meta tags de páginas específicas via banco de dados.

---

## 6. SEO & Performance (Finalização)
*   [ ] Gerar Sitemap.xml dinâmico.
*   [ ] Configurar Robots.txt.
*   [ ] Garantir tags OpenGraph (OG) corretas para compartilhamento em redes sociais.
*   [ ] Lazy loading de imagens e componentes pesados.

---

## Ordem de Execução Sugerida
1.  **Frontend:** Refinar Filtros (Dropdowns e Sidebar) e Mapa.
2.  **Frontend:** Finalizar Página de Detalhes.
3.  **Frontend:** Telas de Login e Cadastro.
4.  **Backend:** Configurar Supabase e conectar o Login.
5.  **Frontend + Backend:** Criar o fluxo de "Anunciar Imóvel" já salvando no banco.
6.  **Frontend:** Conectar a Home e Busca aos dados reais do banco.
7.  **CMS:** Criar o painel administrativo.