import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface LocationSuggestion {
  name: string;
  type: string;
  city?: string;
  state?: string;
  lat?: string;
  lon?: string;
  display_name?: string;
  raw_state?: string;
}

const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Fallback manual list for major neighborhoods ensuring they always appear
const MAJOR_NEIGHBORHOODS: Record<string, string[]> = {
  "AC": ["Centro", "Bosque", "Estação Experimental", "Ipê"], // Rio Branco
  "AL": ["Ponta Verde", "Pajuçara", "Jatiúca", "Farol"], // Maceió
  "AP": ["Centro", "Trem", "Santa Rita", "Cabralzinho"], // Macapá
  "AM": ["Ponta Negra", "Adrianópolis", "Vieiralves", "Parque 10"], // Manaus
  "BA": ["Barra", "Pituba", "Rio Vermelho", "Ondina", "Graça", "Horto Florestal", "Caminho das Árvores", "Itaigara"], // Salvador
  "CE": ["Meireles", "Aldeota", "Cocó", "Varjota", "Mucuripe", "Praia de Iracema"], // Fortaleza
  "DF": ["Asa Sul", "Asa Norte", "Lago Sul", "Lago Norte", "Sudoeste", "Noroeste", "Águas Claras"], // Brasília
  "ES": ["Praia do Canto", "Jardim da Penha", "Mata da Praia", "Jardim Camburi"], // Vitória
  "GO": ["Setor Bueno", "Setor Marista", "Setor Oeste", "Jardim Goiás"], // Goiânia
  "MA": ["Ponta d'Areia", "Renascença", "Calhau", "São Francisco"], // São Luís
  "MT": ["Goiabeiras", "Popular", "Jardim das Américas", "Duque de Caxias"], // Cuiabá
  "MS": ["Chácara Cachoeira", "Jardim dos Estados", "Santa Fé", "Centro"], // Campo Grande
  "MG": ["Savassi", "Lourdes", "Belvedere", "Funcionários", "Sion", "Anchieta", "Mangabeiras", "Pampulha", "Centro"], // Belo Horizonte
  "PA": ["Umarizal", "Nazaré", "Batista Campos", "Marco"], // Belém
  "PB": ["Manaíra", "Tambaú", "Cabo Branco", "Bessa"], // João Pessoa
  "PR": ["Batel", "Água Verde", "Bigorrilho", "Centro Cívico", "Ecoville", "Santa Felicidade"], // Curitiba
  "PE": ["Boa Viagem", "Pina", "Espinheiro", "Casa Forte", "Jaqueira", "Graças", "Derby"], // Recife
  "PI": ["Jockey", "Fátima", "Ininga", "São Cristóvão"], // Teresina
  "RJ": [
    "Copacabana", "Ipanema", "Leblon", "Barra da Tijuca", "Botafogo", "Tijuca", "Flamengo", 
    "Laranjeiras", "Centro", "Recreio dos Bandeirantes", "Jacarepaguá", "Méier", "Madureira", "Grajaú"
  ],
  "RN": ["Ponta Negra", "Tirol", "Petrópolis", "Capim Macio"], // Natal
  "RS": ["Moinhos de Vento", "Bela Vista", "Menino Deus", "Bom Fim", "Cidade Baixa", "Centro Histórico"], // Porto Alegre
  "RO": ["Olaria", "Embratel", "Nova Porto Velho", "Centro"], // Porto Velho
  "RR": ["Centro", "São Francisco", "Aparecida", "Paraviana"], // Boa Vista
  "SC": ["Centro", "Agronômica", "Trindade", "Coqueiros", "Itacorubi", "Jurerê Internacional", "Campeche"], // Florianópolis
  "SP": [
    "Vila Mariana", "Pinheiros", "Moema", "Perdizes", "Itaim Bibi", "Jardins", "Paulista",
    "Brooklin", "Vila Madalena", "Tatuapé", "Morumbi", "Higienópolis"
  ],
  "SE": ["Atalaia", "Jardins", "Grageru", "13 de Julho"], // Aracaju
  "TO": ["Plano Diretor Sul", "Plano Diretor Norte", "Graciosa"], // Palmas
};

export const useLocations = () => {
  const [activeStates, setActiveStates] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchActiveStates = async () => {
      const { data } = await supabase
        .from('properties')
        .select('state')
        .eq('status', 'active');
      
      if (data) {
        const states = Array.from(new Set(data.map(i => i.state).filter(Boolean)));
        setActiveStates(states as string[]);
      }
    };
    fetchActiveStates();
  }, []);

  const searchLocations = useCallback(async (query: string, priorityContext?: string): Promise<LocationSuggestion[]> => {
    if (!query || query.length < 3) return [];

    const normalizedQuery = normalize(query);
    const cleanContext = priorityContext ? normalize(priorityContext.split("-")[0].trim()) : "";

    let results: LocationSuggestion[] = [];

    // 1. Manual List Search (ALL STATES)
    // We iterate over ALL keys in MAJOR_NEIGHBORHOODS to ensure complete coverage.
    // Capital mapping is manual/implied for simplicity in this fallback list.
    const capitals: Record<string, string> = {
        "AC": "Rio Branco", "AL": "Maceió", "AP": "Macapá", "AM": "Manaus", "BA": "Salvador",
        "CE": "Fortaleza", "DF": "Brasília", "ES": "Vitória", "GO": "Goiânia", "MA": "São Luís",
        "MT": "Cuiabá", "MS": "Campo Grande", "MG": "Belo Horizonte", "PA": "Belém", "PB": "João Pessoa",
        "PR": "Curitiba", "PE": "Recife", "PI": "Teresina", "RJ": "Rio de Janeiro", "RN": "Natal",
        "RS": "Porto Alegre", "RO": "Porto Velho", "RR": "Boa Vista", "SC": "Florianópolis",
        "SP": "São Paulo", "SE": "Aracaju", "TO": "Palmas"
    };

    Object.keys(MAJOR_NEIGHBORHOODS).forEach(uf => {
       const neighborhoods = MAJOR_NEIGHBORHOODS[uf] || [];
       neighborhoods.forEach(neigh => {
          if (normalize(neigh).includes(normalizedQuery)) {
             const city = capitals[uf] || "Capital";
             
             // Context filter logic (optional but good for relevance)
             if (cleanContext && !normalize(city).includes(cleanContext)) return;

             results.push({
                name: neigh,
                type: "Bairro",
                city: city,
                state: uf,
                display_name: `${neigh}, ${city} - ${uf}`,
                raw_state: uf
             });
          }
       });
    });

    // 2. Nominatim API Search (Broad coverage)
    try {
      const cleanContext = priorityContext ? normalize(priorityContext.split("-")[0].trim()) : "";
      
      // Nominatim Logic: combine query + context into 'q' parameter for best results
      let searchQuery = query;
      // if (cleanContext) {
      //    searchQuery = `${query}, ${cleanContext}`;
      // }

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=br&addressdetails=1&limit=50&dedupe=1`;
      
      console.log("Searching Nominatim:", url);
      console.log("Context:", priorityContext, "Cleaned:", cleanContext);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'HomeHub-RealEstate/1.0'
        }
      });

      const data = await response.json();
      console.log("Nominatim Raw Results:", data);

      const stateMap: Record<string, string> = {
        "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM", "Bahia": "BA", "Ceará": "CE",
        "Distrito Federal": "DF", "Espírito Santo": "ES", "Goiás": "GO", "Maranhão": "MA", "Mato Grosso": "MT",
        "Mato Grosso do Sul": "MS", "Minas Gerais": "MG", "Pará": "PA", "Paraíba": "PB", "Paraná": "PR",
        "Pernambuco": "PE", "Piauí": "PI", "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN",
        "Rio Grande do Sul": "RS", "Rondônia": "RO", "Roraima": "RO", "Santa Catarina": "SC",
        "São Paulo": "SP", "Sergipe": "SE", "Tocantins": "TO"
      };

      const apiResults = data.map((item: any) => {
        const addr = item.address || {};
        let type = "Local";
        let name = item.name;
        
        if (item.type === "city" || item.type === "administrative" || item.type === "municipality") {
            type = "Cidade";
            name = addr.city || addr.town || addr.municipality || name;
        } else if (item.type === "suburb" || item.type === "neighbourhood" || item.addresstype === "suburb") {
            type = "Bairro";
            name = addr.suburb || addr.neighbourhood || name;
        } else if (item.type === "residential" || item.type === "living_street" || item.class === "highway") {
            type = "Rua";
            name = addr.road || name;
        } else if (item.type === "state") {
            type = "Estado";
        }

        const city = addr.city || addr.town || addr.municipality || "";
        const stateName = addr.state || "";
        const stateCode = stateMap[stateName] || stateName;

        let display_name = "";
        if (type === "Cidade") {
            display_name = `${name} - ${stateCode}`;
        } else if (type === "Bairro" || type === "Rua") {
            display_name = `${name}, ${city} - ${stateCode}`;
        } else {
            display_name = `${name} - ${stateCode}`;
        }

        return {
          name: name,
          type: type,
          city: city,
          state: stateCode,
          lat: item.lat,
          lon: item.lon,
          display_name: display_name,
          raw_state: stateName
        };
      }).filter((item: any) => item.type !== "Local");

      // Merge results (avoid duplicates if manual list overlaps with API)
      const existingNames = new Set(results.map(r => normalize(r.name + r.city)));
      
      apiResults.forEach((item: LocationSuggestion) => {
         const key = normalize(item.name + item.city);
         // Basic dedupe: if we already have "Tijuca" in "Rio", skip API version if it's less detailed? 
         // Actually, manual list is safer, so keep manual.
         if (!existingNames.has(key)) {
             results.push(item);
         }
      });

    } catch (error) {
      console.error("Nominatim Search Error:", error);
      // Fallback: return just manual list if API fails
    }

    // FINAL FILTERING & SORTING
    const finalResults = results.filter((item: any) => {
          // Rule 1: For Cities, query must match the name directly (e.g. searching "Rio" shows "Rio de Janeiro")
          // If searching "Tijuca", don't show "Rio de Janeiro" just because it's the parent city
          if (item.type === "Cidade") {
              return normalize(item.name).includes(normalizedQuery);
          }
          // Rule 2: For Neighborhoods/Streets, check name or full display text
          const nameMatch = normalize(item.name).includes(normalizedQuery);
          const displayMatch = normalize(item.display_name || "").includes(normalizedQuery);
          return nameMatch || displayMatch;
    }).sort((a: any, b: any) => {
        let scoreA = 0;
        let scoreB = 0;

        // 0. Context Match (City is King)
        if (cleanContext) {
            const aCity = normalize(a.city || "");
            const bCity = normalize(b.city || "");

            if (aCity === cleanContext || aCity.includes(cleanContext)) scoreA += 100;
            if (bCity === cleanContext || bCity.includes(cleanContext)) scoreB += 100;
        }

        // 1. Active State Match
        const aActive = activeStates.includes(a.state) || activeStates.includes(a.raw_state);
        const bActive = activeStates.includes(b.state) || activeStates.includes(b.raw_state);
        
        if (aActive) scoreA += 50;
        if (bActive) scoreB += 50;

        // 2. Starts With Query
        if (normalize(a.name).startsWith(normalizedQuery)) scoreA += 20;
        if (normalize(b.name).startsWith(normalizedQuery)) scoreB += 20;

        // 3. Exact Name Match
        if (normalize(a.name) === normalizedQuery) scoreA += 30;
        if (normalize(b.name) === normalizedQuery) scoreB += 30;

        return scoreB - scoreA;
    });

    return finalResults;

  }, [activeStates]);

  return { searchLocations };
};