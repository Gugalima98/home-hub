-- 1. Create the properties table (Re-run this entire script. If table exists, it will be recreated)

DROP TABLE IF EXISTS public.properties CASCADE;

create table public.properties (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  owner_id uuid references auth.users(id) default auth.uid(),
  
  -- Basic Info & Operation
  title text not null,
  description text,
  operation_type text check (operation_type in ('rent', 'buy')), -- Alugar ou Comprar
  property_type text, -- Apartamento, Casa, Casa de Condomínio, Kitnet/Studio
  
  -- Address & Location
  address text,
  full_address text,
  neighborhood text,
  city text,
  state text default 'SP',
  latitude numeric,
  longitude numeric,
  near_subway boolean default false, -- Próximo ao metrô
  
  -- Pricing
  price numeric,
  condo_fee numeric default 0,
  iptu numeric default 0,
  fire_insurance numeric default 0,
  service_fee numeric default 0,
  total_price numeric generated always as (price + condo_fee + iptu + fire_insurance + service_fee) stored,
  
  -- Details (Counters)
  bedrooms integer default 0,
  suites integer default 0, -- Suítes
  bathrooms integer default 0,
  parking_spots integer default 0,
  area numeric default 0,
  floor integer default 0,
  
  -- Features (Arrays mapping to Sidebar Filters)
  images text[] default '{}',
  badges text[] default '{}', -- 'exclusive', 'priceDropped', 'new'
  
  -- Checkbox Lists Categories
  condo_amenities text[] default '{}',     -- Condomínio (Academia, Piscina...)
  available_items text[] default '{}',     -- Comodidades (Ar condicionado, Varanda...)
  furniture_items text[] default '{}',     -- Mobílias (Cama, Sofá...)
  wellness_items text[] default '{}',      -- Bem-estar (Sol da manhã, Vista livre...)
  appliances_items text[] default '{}',    -- Eletrodomésticos (Fogão, Geladeira...)
  room_items text[] default '{}',          -- Cômodos (Home-office, Jardim...)
  accessibility_items text[] default '{}', -- Acessibilidade (Rampas, Banheiro adaptado...)
  unavailable_items text[] default '{}',   -- Items marcados como não disponíveis (opcional)

  -- Booleans & Status
  furnished boolean default false,
  pet_friendly boolean default false,
  availability text default 'immediate', -- 'immediate' or 'soon'
  is_favorite boolean default false
);

-- 2. Enable Row Level Security (RLS)
alter table public.properties enable row level security;

-- 3. Create Policies

-- Policy: Everyone can view properties
create policy "Public properties are viewable by everyone"
  on public.properties for select
  using ( true );

-- Policy: Authenticated users can insert their own properties
create policy "Users can insert their own properties"
  on public.properties for insert
  with check ( auth.uid() = owner_id );

-- Policy: Users can update their own properties
create policy "Users can update own properties"
  on public.properties for update
  using ( auth.uid() = owner_id );

-- Policy: Users can delete their own properties
create policy "Users can delete own properties"
  on public.properties for delete
  using ( auth.uid() = owner_id );

-- 4. Create Storage Bucket for Property Images (if not exists)
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

-- 5. Storage Policies (Drop existing to avoid conflicts if re-running)
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Auth Upload" on storage.objects;
drop policy if exists "Owner Update" on storage.objects;
drop policy if exists "Owner Delete" on storage.objects;

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'property-images' );

create policy "Auth Upload"
  on storage.objects for insert
  with check ( bucket_id = 'property-images' and auth.role() = 'authenticated' );

-- CORREÇÃO AQUI: removido '(id)' após owner
create policy "Owner Update"
  on storage.objects for update
  using ( bucket_id = 'property-images' and auth.uid() = owner );

create policy "Owner Delete"
  on storage.objects for delete
  using ( bucket_id = 'property-images' and auth.uid() = owner );
