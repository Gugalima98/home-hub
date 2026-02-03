import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import locationsData from '@/data/locations.json';

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

// Helper para normalizar texto (remove acentos)
const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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

    // 1. Local JSON Search (locations.json - Full Brazil Database)
    // Structure: { "UF": { "City": ["Neighborhood", ...] } }
    
    try {
        Object.entries(locationsData).forEach(([uf, cities]) => {
            Object.entries(cities).forEach(([city, neighborhoods]) => {
                // Check City Match
                if (normalize(city).includes(normalizedQuery)) {
                     // Check context if present (optional filtering)
                     if (!cleanContext || normalize(city).includes(cleanContext)) {
                         results.push({
                            name: city,
                            type: "Cidade",
                            city: city,
                            state: uf,
                            display_name: `${city} - ${uf}`,
                            raw_state: uf
                         });
                     }
                }

                // Check Neighborhoods
                // Casting neighborhoods as string[] because the JSON structure guarantees it
                (neighborhoods as string[]).forEach(neigh => {
                    if (normalize(neigh).includes(normalizedQuery)) {
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
        });
    } catch (err) {
        console.error("Error parsing local locations data:", err);
    }

    // 2. Nominatim API Search (Broad coverage fallback)
    try {
      const cleanContext = priorityContext ? normalize(priorityContext.split("-")[0].trim()) : "";
      
      // Nominatim Logic: combine query + context into 'q' parameter for best results
      let searchQuery = query;
      // if (cleanContext) {
      //    searchQuery = `${query}, ${cleanContext}`;
      // }

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=br&addressdetails=1&limit=50&dedupe=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'HomeHub-RealEstate/1.0'
        }
      });

      const data = await response.json();

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
          // Rule 1: For Cities, query must match the name directly
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