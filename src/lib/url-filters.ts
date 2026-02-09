import { FilterState } from "@/contexts/FilterContext";

// Master map of all possible amenities/features to URL slugs
// Keys match exactly the strings used in FiltersSidebar.tsx
const AMENITY_MAP: Record<string, string> = {
  // Condomínio
  "Academia": "academia",
  "Área verde": "area-verde",
  "Brinquedoteca": "brinquedoteca",
  "Churrasqueira": "churrasqueira",
  "Elevador": "elevador",
  "Lavanderia": "lavanderia",
  "Piscina": "piscina",
  "Playground": "playground",
  "Portaria 24h": "portaria-24h",
  "Quadra esportiva": "quadra-esportiva",
  "Salão de festas": "salao-de-festas",
  "Salão de jogos": "salao-de-jogos",
  "Sauna": "sauna",

  // Comodidades
  "Apartamento cobertura": "cobertura",
  "Ar condicionado": "ar-condicionado",
  "Banheira": "banheira",
  "Box": "box",
  "Chuveiro a gás": "chuveiro-gas",
  "Closet": "closet",
  "Garden/Área privativa": "garden",
  "Novos ou reformados": "novo-reformado",
  "Piscina privativa": "piscina-privativa",
  "Somente uma casa no terreno": "casa-unica",
  "Tanque": "tanque",
  "Televisão": "televisao",
  "Utensílios de cozinha": "utensilios-cozinha",
  "Ventilador de teto": "ventilador-teto",

  // Mobílias
  "Armários na cozinha": "armarios-cozinha",
  "Armários no quarto": "armarios-quarto",
  "Armários nos banheiros": "armarios-banheiro",
  "Cama de casal": "cama-casal",
  "Cama de solteiro": "cama-solteiro",
  "Mesas e cadeiras de jantar": "mesa-jantar",
  "Sofá": "sofa",

  // Bem-estar
  "Janelas grandes": "janelas-grandes",
  "Rua silenciosa": "rua-silenciosa",
  "Sol da manhã": "sol-manha",
  "Sol da tarde": "sol-tarde",
  "Vista livre": "vista-livre",

  // Eletrodomésticos
  "Fogão": "fogao",
  "Fogão cooktop": "cooktop",
  "Geladeira": "geladeira",
  "Máquina de lavar": "maquina-lavar",
  "Microondas": "microondas",

  // Cômodos
  "Área de serviço": "area-servico",
  "Cozinha americana": "cozinha-americana",
  "Home-office": "home-office",
  "Jardim": "jardim",
  "Quintal": "quintal",
  "Varanda": "varanda",

  // Acessibilidade
  "Banheiro adaptado": "banheiro-adaptado",
  "Corrimão": "corrimao",
  "Piso tátil": "piso-tatil",
  "Quartos e corredores com portas amplas": "portas-amplas",
  "Rampas de acesso": "rampas-acesso",
  "Vaga de garagem acessível": "vaga-acessivel"
};

// Reverse map for parsing
const SLUG_TO_AMENITY: Record<string, string> = Object.entries(AMENITY_MAP).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);

const PROPERTY_TYPE_MAP: Record<string, string> = {
  "Apartamento": "apartamento",
  "Casa": "casa",
  "Kitnet/Studio": "studio",
  "Casa de Condomínio": "casa-de-condominio"
};

const SLUG_TO_PROPERTY_TYPE: Record<string, string> = Object.entries(PROPERTY_TYPE_MAP).reduce((acc, [key, value]) => {
  acc[value] = key;
  // Handle alias
  if (value === "studio") acc["kitnet"] = key;
  return acc;
}, {} as Record<string, string>);


export function parseUrlFilters(urlSegment?: string): Partial<FilterState> {
  if (!urlSegment) return {};

  const filters: Partial<FilterState> = {
    amenities: [],
    propertyTypes: []
  };

  const segments = urlSegment.split("/").filter(Boolean);

  segments.forEach((seg) => {
    // Quartos
    let match = seg.match(/^(\d+)-quartos$/) || seg.match(/^(\d+)-ou-mais-quartos$/);
    if (match) { filters.bedrooms = parseInt(match[1]); return; }

    // Suítes
    match = seg.match(/^(\d+)-suites$/) || seg.match(/^(\d+)-ou-mais-suites$/);
    if (match) { filters.suites = parseInt(match[1]); return; }

    // Vagas
    match = seg.match(/^(\d+)-vagas$/) || seg.match(/^(\d+)-ou-mais-vagas$/);
    if (match) { filters.parkingSpots = parseInt(match[1]); return; }

    // Banheiros
    match = seg.match(/^(\d+)-banheiros$/) || seg.match(/^(\d+)-ou-mais-banheiros$/);
    if (match) { filters.bathrooms = parseInt(match[1]); return; }

    // Área
    match = seg.match(/^de-(\d+)-a-(\d+)-m2$/);
    if (match) {
      filters.areaMin = parseInt(match[1]);
      filters.areaMax = parseInt(match[2]);
      return;
    }
    match = seg.match(/^a-partir-de-(\d+)-m2$/);
    if (match) { filters.areaMin = parseInt(match[1]); return; }
    match = seg.match(/^ate-(\d+)-m2$/);
    if (match) { filters.areaMax = parseInt(match[1]); return; }

    // Preço (R$)
    match = seg.match(/^de-(\d+)-a-(\d+)-reais$/);
    if (match) {
      filters.priceMin = parseInt(match[1]);
      filters.priceMax = parseInt(match[2]);
      return;
    }
    match = seg.match(/^a-partir-de-(\d+)-reais$/);
    if (match) { filters.priceMin = parseInt(match[1]); return; }
    match = seg.match(/^ate-(\d+)-reais$/);
    if (match) { filters.priceMax = parseInt(match[1]); return; }

    // Booleans
    if (seg === "mobiliado") { filters.furnished = "yes"; return; }
    if (seg === "sem-mobilia") { filters.furnished = "no"; return; }
    if (seg === "aceita-pets") { filters.petFriendly = "yes"; return; }
    if (seg === "proximo-metro") { filters.nearSubway = "yes"; return; }

    // Disponibilidade
    if (seg === "disponibilidade-imediata") { filters.availability = "immediate"; return; }
    if (seg === "disponibilidade-em-breve") { filters.availability = "soon"; return; }

    // Tipos de Imóvel
    if (SLUG_TO_PROPERTY_TYPE[seg]) {
      filters.propertyTypes?.push(SLUG_TO_PROPERTY_TYPE[seg]);
      return;
    }

    // Amenities (General)
    if (SLUG_TO_AMENITY[seg]) {
      filters.amenities?.push(SLUG_TO_AMENITY[seg]);
      return;
    }
  });

  return filters;
}

export function generateUrlFilters(filters: FilterState): string {
  const segments: string[] = [];

  // Tipos
  filters.propertyTypes.forEach(type => {
    const slug = PROPERTY_TYPE_MAP[type];
    if (slug) segments.push(slug);
  });

  // Quartos
  if (filters.bedrooms) {
    segments.push(`${filters.bedrooms}-ou-mais-quartos`);
  }

  // Suítes
  if (filters.suites) {
    segments.push(`${filters.suites}-ou-mais-suites`);
  }

  // Vagas
  if (filters.parkingSpots) {
    segments.push(`${filters.parkingSpots}-ou-mais-vagas`);
  }

  // Banheiros
  if (filters.bathrooms) {
    segments.push(`${filters.bathrooms}-ou-mais-banheiros`);
  }

  // Área
  if (filters.areaMin && filters.areaMax) {
    segments.push(`de-${filters.areaMin}-a-${filters.areaMax}-m2`);
  } else if (filters.areaMin) {
    segments.push(`a-partir-de-${filters.areaMin}-m2`);
  } else if (filters.areaMax) {
    segments.push(`ate-${filters.areaMax}-m2`);
  }

  // Preço
  if (filters.priceMin && filters.priceMax) {
    segments.push(`de-${filters.priceMin}-a-${filters.priceMax}-reais`);
  } else if (filters.priceMin) {
    segments.push(`a-partir-de-${filters.priceMin}-reais`);
  } else if (filters.priceMax) {
    segments.push(`ate-${filters.priceMax}-reais`);
  }

  // Booleans
  if (filters.furnished === "yes") segments.push("mobiliado");
  else if (filters.furnished === "no") segments.push("sem-mobilia");

  if (filters.petFriendly === "yes") segments.push("aceita-pets");
  if (filters.nearSubway === "yes") segments.push("proximo-metro");

  // Disponibilidade
  if (filters.availability === "immediate") segments.push("disponibilidade-imediata");
  if (filters.availability === "soon") segments.push("disponibilidade-em-breve");

  // Amenities
  filters.amenities.forEach(amenity => {
    const slug = AMENITY_MAP[amenity];
    if (slug) segments.push(slug);
  });

  return segments.join("/");
}
