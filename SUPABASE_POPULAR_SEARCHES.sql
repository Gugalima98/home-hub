insert into public.seo_cities (city, operation, links) values
('Popular Searches', 'rent', '[
  {"label": "Apartamento à venda Diadema", "url": "/imoveis?city=Diadema&operation=buy&type=Apartamento"},
  {"label": "Apartamento para alugar em Curitiba", "url": "/imoveis?city=Curitiba&operation=rent&type=Apartamento"},
  {"label": "Apartamento para alugar Florianópolis", "url": "/imoveis?city=Florianópolis&operation=rent&type=Apartamento"},
  {"label": "Casas à venda em Barueri", "url": "/imoveis?city=Barueri&operation=buy&type=Casa"},
  {"label": "Apartamento à venda Taboão da Serra", "url": "/imoveis?city=Taboão da Serra&operation=buy&type=Apartamento"},
  {"label": "Apartamento para alugar em Goiânia", "url": "/imoveis?city=Goiânia&operation=rent&type=Apartamento"},
  {"label": "Apartamento para alugar Niterói", "url": "/imoveis?city=Niterói&operation=rent&type=Apartamento"},
  {"label": "Casas à venda em Jundiaí", "url": "/imoveis?city=Jundiaí&operation=buy&type=Casa"},
  {"label": "Apartamento barato em São Paulo", "url": "/imoveis?city=São Paulo&priceMax=3000"},
  {"label": "Apartamento para alugar em Salvador", "url": "/imoveis?city=Salvador&operation=rent&type=Apartamento"},
  {"label": "Casas para alugar em Cotia", "url": "/imoveis?city=Cotia&operation=rent&type=Casa"},
  {"label": "Apartamento barato no Rio de Janeiro", "url": "/imoveis?city=Rio de Janeiro&priceMax=3000"},
  {"label": "Apartamento para alugar em Santos", "url": "/imoveis?city=Santos&operation=rent&type=Apartamento"},
  {"label": "Casas para alugar em São Gonçalo", "url": "/imoveis?city=São Gonçalo&operation=rent&type=Casa"}
]')
on conflict (city, operation) do nothing;
