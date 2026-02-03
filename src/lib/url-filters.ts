import { FilterState } from "@/contexts/FilterContext";

export function parseUrlFilters(urlSegment?: string): Partial<FilterState> {
  if (!urlSegment) return {};

  const filters: Partial<FilterState> = {};
  const segments = urlSegment.split("/").filter(Boolean);

  segments.forEach((seg) => {
    // Quartos
    if (seg.match(/^(\d+)-quartos$/)) {
      const match = seg.match(/^(\d+)-quartos$/);
      if (match) filters.bedrooms = parseInt(match[1]);
    }
    else if (seg.match(/^(\d+)-ou-mais-quartos$/)) {
        const match = seg.match(/^(\d+)-ou-mais-quartos$/);
        if (match) filters.bedrooms = parseInt(match[1]);
    }

    // Vagas
    if (seg.match(/^(\d+)-vagas$/)) {
      const match = seg.match(/^(\d+)-vagas$/);
      if (match) filters.parkingSpots = parseInt(match[1]);
    }
    else if (seg.match(/^(\d+)-ou-mais-vagas$/)) {
        const match = seg.match(/^(\d+)-ou-mais-vagas$/);
        if (match) filters.parkingSpots = parseInt(match[1]);
    }

    // Banheiros
    if (seg.match(/^(\d+)-banheiros$/)) {
      const match = seg.match(/^(\d+)-banheiros$/);
      if (match) filters.bathrooms = parseInt(match[1]);
    }
    else if (seg.match(/^(\d+)-ou-mais-banheiros$/)) {
        const match = seg.match(/^(\d+)-ou-mais-banheiros$/);
        if (match) filters.bathrooms = parseInt(match[1]);
    }

    // Área
    if (seg.match(/^de-(\d+)-a-(\d+)-m2$/)) {
      const match = seg.match(/^de-(\d+)-a-(\d+)-m2$/);
      if (match) {
        filters.areaMin = parseInt(match[1]);
        filters.areaMax = parseInt(match[2]);
      }
    } else if (seg.match(/^a-partir-de-(\d+)-m2$/)) {
      const match = seg.match(/^a-partir-de-(\d+)-m2$/);
      if (match) filters.areaMin = parseInt(match[1]);
    } else if (seg.match(/^ate-(\d+)-m2$/)) {
      const match = seg.match(/^ate-(\d+)-m2$/);
      if (match) filters.areaMax = parseInt(match[1]);
    }

    // Preço (opcional, se quisermos na URL path ou query)
    // Geralmente preço fica melhor em query param, mas vamos suportar path se precisar.
    // Ex: de-1000-a-2000-reais

    // Booleans
    if (seg === "mobiliado") filters.furnished = "yes";
    if (seg === "sem-mobilia") filters.furnished = "no";
    if (seg === "aceita-pets") filters.petFriendly = "yes";
    if (seg === "proximo-metro") filters.nearSubway = "yes";

    // Tipos (pode ser complexo se for array, vamos assumir um por vez ou combinados)
    // Ex: apartamento-e-casa. Por simplicidade, vamos checar strings exatas.
    if (["apartamento", "casa", "studio", "kitnet", "casa-de-condominio"].includes(seg)) {
        // Map slug back to label
        const map: Record<string, string> = {
            "apartamento": "Apartamento",
            "casa": "Casa",
            "studio": "Kitnet/Studio",
            "kitnet": "Kitnet/Studio",
            "casa-de-condominio": "Casa de Condomínio"
        };
        // Append to array if not exists (complex logic, maybe just replace for now)
        filters.propertyTypes = [map[seg]];
    }
  });

  return filters;
}

export function generateUrlFilters(filters: FilterState): string {
  const segments: string[] = [];

  // Tipos
  if (filters.propertyTypes.length === 1) {
      const map: Record<string, string> = {
          "Apartamento": "apartamento",
          "Casa": "casa",
          "Kitnet/Studio": "studio",
          "Casa de Condomínio": "casa-de-condominio"
      };
      const slug = map[filters.propertyTypes[0]];
      if (slug) segments.push(slug);
  }

  // Quartos
  if (filters.bedrooms) {
      segments.push(`${filters.bedrooms}-ou-mais-quartos`);
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

  // Booleans
  if (filters.furnished === "yes") segments.push("mobiliado");
  if (filters.petFriendly === "yes") segments.push("aceita-pets");
  if (filters.nearSubway === "yes") segments.push("proximo-metro");

  return segments.join("/");
}
