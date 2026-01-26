create table if not exists public.seo_cities (
  id uuid default gen_random_uuid() primary key,
  city text not null,
  operation text not null check (operation in ('rent', 'buy')),
  links jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(city, operation)
);

alter table public.seo_cities enable row level security;

drop policy if exists "Public can view seo_cities" on public.seo_cities;
create policy "Public can view seo_cities" on public.seo_cities for select using (true);

drop policy if exists "Admins can insert seo_cities" on public.seo_cities;
create policy "Admins can insert seo_cities" on public.seo_cities for insert with check (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

drop policy if exists "Admins can update seo_cities" on public.seo_cities;
create policy "Admins can update seo_cities" on public.seo_cities for update using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

drop policy if exists "Admins can delete seo_cities" on public.seo_cities;
create policy "Admins can delete seo_cities" on public.seo_cities for delete using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

-- Inserir dados iniciais (baseado no componente atual)
insert into public.seo_cities (city, operation, links) values
('São Paulo', 'rent', '[
  {"label": "Apartamentos para alugar em São Paulo", "url": "/imoveis?city=São Paulo, SP&operation=rent&type=Apartamento"},
  {"label": "Casas para alugar em São Paulo", "url": "/imoveis?city=São Paulo, SP&operation=rent&type=Casa"},
  {"label": "Studios e kitnets para alugar em São Paulo", "url": "/imoveis?city=São Paulo, SP&operation=rent&type=Kitnet/Studio"},
  {"label": "Casas em condomínio para alugar em São Paulo", "url": "/imoveis?city=São Paulo, SP&operation=rent&type=Casa de Condomínio"}
]'),
('Rio de Janeiro', 'rent', '[
  {"label": "Apartamentos para alugar em Rio de Janeiro", "url": "/imoveis?city=Rio de Janeiro, RJ&operation=rent&type=Apartamento"}
]'),
('São Paulo', 'buy', '[
  {"label": "Apartamentos à venda em São Paulo", "url": "/imoveis?city=São Paulo, SP&operation=buy&type=Apartamento"},
  {"label": "Casas à venda em São Paulo", "url": "/imoveis?city=São Paulo, SP&operation=buy&type=Casa"}
]')
on conflict (city, operation) do nothing;
