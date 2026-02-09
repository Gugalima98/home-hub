import { createContext, useContext, useState, ReactNode } from "react";

interface FilterState {
  // Filtros Básicos
  operationType: "rent" | "buy";
  searchLocation: string; // Busca textual (Cidade, Bairro)

  // Filtros de Preço
  priceMin: number | null;
  priceMax: number | null;

  // Detalhes
  propertyTypes: string[]; // ["Apartamento", "Casa"]
  bedrooms: number | null; // 1, 2, 3, 4 (onde 4 significa 4+)
  suites: number | null;
  bathrooms: number | null;
  parkingSpots: number | null;
  areaMin: number | null;
  areaMax: number | null;

  // Características Específicas (Booleanos ou Arrays)
  furnished: string; // "yes", "no", "any"
  petFriendly: string; // "yes", "no", "any"
  nearSubway: string; // "yes", "no", "any"
  availability: string; // "any", "immediate", "soon"

  // Arrays de Checkboxes
  amenities: string[]; // Academia, Piscina, etc.
}

interface FilterContextType {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: any) => void;
  setManyFilters: (newFilters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  operationType: "buy",
  searchLocation: "",
  priceMin: null,
  priceMax: null,
  propertyTypes: [],
  bedrooms: null,
  suites: null,
  bathrooms: null,
  parkingSpots: null,
  areaMin: null,
  areaMax: null,
  furnished: "any",
  petFriendly: "any",
  nearSubway: "any",
  availability: "any",
  amenities: [],
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const setManyFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FilterContext.Provider value={{ filters, setFilter, setManyFilters, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};
