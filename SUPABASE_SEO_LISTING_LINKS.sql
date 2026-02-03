create table if not exists public.seo_listing_links (
  id uuid default gen_random_uuid() primary key,
  city text not null,
  operation text not null check (operation in ('rent', 'buy')),
  links jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(city, operation)
);

alter table public.seo_listing_links enable row level security;

create policy "Public view" on public.seo_listing_links for select using (true);
create policy "Admin all" on public.seo_listing_links for all using (
  auth.uid() in (select id from public.profiles where role = 'admin')
);

-- Dados iniciais para Rio de Janeiro (já que é o padrão agora)
insert into public.seo_listing_links (city, operation, links) values
('Rio de Janeiro', 'rent', '[
  {"label": "Aluguel em Copacabana", "url": "/alugar/imovel/rio-de-janeiro-rj-brasil?neighborhood=Copacabana"},
  {"label": "Aluguel em Ipanema", "url": "/alugar/imovel/rio-de-janeiro-rj-brasil?neighborhood=Ipanema"},
  {"label": "Aluguel na Barra da Tijuca", "url": "/alugar/imovel/rio-de-janeiro-rj-brasil?neighborhood=Barra da Tijuca"},
  {"label": "Aluguel em Botafogo", "url": "/alugar/imovel/rio-de-janeiro-rj-brasil?neighborhood=Botafogo"}
]'),
('Rio de Janeiro', 'buy', '[
  {"label": "Comprar em Copacabana", "url": "/comprar/imovel/rio-de-janeiro-rj-brasil?neighborhood=Copacabana"},
  {"label": "Comprar na Barra da Tijuca", "url": "/comprar/imovel/rio-de-janeiro-rj-brasil?neighborhood=Barra da Tijuca"}
]')
on conflict (city, operation) do nothing;
