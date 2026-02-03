import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  SlidersHorizontal, 
  MapPin, 
  ChevronDown, 
  Bell,
  ChevronRight,
  ChevronLeft,
  History,
  MousePointer2,
  Crosshair,
  X,
  Search
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FiltersSidebar } from "@/components/FiltersSidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFilters } from "@/contexts/FilterContext";
import { useLocations, LocationSuggestion } from "@/hooks/useLocations";

// Filter Pill Component
const FilterPill = ({ label, active = false, onClick, hasDropdown = true }: { label: string; active?: boolean; onClick?: () => void; hasDropdown?: boolean }) => (
  <Button
    variant="ghost"
    className={`rounded-full h-[48px] px-6 text-[13px] font-medium border-none transition-all tracking-wide ${
      active 
        ? "bg-[#eff2ff] text-[#3b44c6] hover:bg-[#dfe6ff]" 
        : "bg-[#f3f5f6] text-[#1f2022] hover:bg-[#e5e7eb]"
    }`}
    onClick={onClick}
  >
    {label}
    {hasDropdown && (
      <ChevronDown 
        className={`ml-2 h-4 w-4 stroke-[3px] transition-transform ${active ? "text-[#3b44c6]" : "text-[#1f2022]"}`} 
      />
    )}
  </Button>
);

// Currency Input Component
const CurrencyInput = ({ 
  value, 
  onChange, 
  placeholder 
}: { 
  value?: number | null; 
  onChange: (val: number | null) => void; 
  placeholder?: string 
}) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
    <Input 
      type="number" 
      placeholder={placeholder}
      className="pl-9 h-12 text-sm border-gray-300 focus:border-[#3b44c6] focus:ring-1 focus:ring-[#3b44c6]"
      value={value || ""}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
    />
  </div>
);

// Helper para Debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function FilterBar() {
  const { filters, setFilter, setManyFilters } = useFilters();
  const [localSearch, setLocalSearch] = useState(filters.searchLocation || "");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const navigate = useNavigate();
  
  const { searchLocations } = useLocations();
  const debouncedSearchTerm = useDebounce(localSearch, 500);

  // Persistent history state
  const [recentSearches, setRecentSearches] = useState<{ location: string, details: string, slug: string }[]>(() => {
    try {
        const saved = localStorage.getItem("recentSearches");
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });
  
  const addToHistory = (location: string, slug: string) => {
    const newItem = { 
      location, 
      details: "Busca recente", 
      slug 
    };
    
    setRecentSearches(prev => {
      // Remove duplicates based on slug
      const filtered = prev.filter(item => item.slug !== slug);
      // Add to top, limit to 5
      const updated = [newItem, ...filtered].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromHistory = (index: number) => {
    setRecentSearches(prev => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length >= 3) {
        setIsLoadingSuggestions(true);
        const results = await searchLocations(debouncedSearchTerm, filters.searchLocation);
        setSuggestions(results);
        setIsLoadingSuggestions(false);
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm, searchLocations, filters.searchLocation]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  const handleSuggestionClick = async (suggestion: LocationSuggestion) => {
    // Slugify logic
    const slugify = (text: string) => text
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-');

    const nameSlug = slugify(suggestion.name);
    let fullSlug = "";

    const stateMap: Record<string, string> = { "Rio de Janeiro": "rj", "São Paulo": "sp", "Minas Gerais": "mg" }; 
    const stateCode = suggestion.state?.length === 2 ? suggestion.state.toLowerCase() : (stateMap[suggestion.state || ""] || "br");

    if (suggestion.type === "Cidade") {
      fullSlug = `${nameSlug}-${stateCode}-brasil`;
    } else {
      const citySlug = slugify(suggestion.city || "");
      fullSlug = `${nameSlug}-${citySlug}-${stateCode}-brasil`;
    }

    const op = filters.operationType === 'buy' ? 'comprar' : 'alugar';
    
    // FETCH COORDINATES IF MISSING (Manual List Fallback)
    let lat = suggestion.lat;
    let lon = suggestion.lon;

    if (!lat || !lon) {
       try {
         // Construct specific query for geocoding
         const query = `${suggestion.name}, ${suggestion.city || ""}, ${suggestion.state || "Brasil"}`;
         const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
         const res = await fetch(url, { headers: { 'User-Agent': 'HomeHub-RealEstate/1.0' } });
         const data = await res.json();
         if (data && data.length > 0) {
            lat = data[0].lat;
            lon = data[0].lon;
         }
       } catch (err) {
         console.error("Failed to fetch coordinates for manual item", err);
       }
    }

    // Update filters and coordinates
    const coords = lat && lon ? [parseFloat(lat), parseFloat(lon)] : null;
    
    setManyFilters({
      searchLocation: suggestion.name,
      searchCoordinates: coords
    });

    // Add to history
    addToHistory(suggestion.name, fullSlug);

    setLocalSearch(suggestion.name);
    setIsSearchFocused(false);
    
    // Pass coordinates in navigation state so PropertiesPage can pick them up
    navigate(`/${op}/imovel/${fullSlug}`, { state: { searchCoordinates: coords } });
  };

  const handleRecentClick = (search: typeof recentSearches[0]) => {
    const op = filters.operationType === 'buy' ? 'comprar' : 'alugar';
    setLocalSearch(search.location.split(",")[0]);
    setIsSearchFocused(false);
    navigate(`/${op}/imovel/${search.slug}`);
  };

  const handleRemoveRecent = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    removeFromHistory(index);
  };

  const handleNearMe = () => {
    alert("Funcionalidade em breve!");
    setIsSearchFocused(false);
  };

  const handleDrawMap = () => {
    alert("Funcionalidade 'Desenhar no mapa' em desenvolvimento!");
    setIsSearchFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsSearchFocused(false);
      if (localSearch) {
         setFilter("searchLocation", localSearch);
      }
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const showSuggestions = localSearch.length > 0;

  return (
    <>
      <div className="h-[98px] w-full bg-transparent" aria-hidden="true" />
      
      <div className="bg-white border-b fixed top-[69px] left-0 right-0 z-30 py-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.08)]">
        <div className="container-fluid px-8 flex items-center gap-6">
        
          {/* Location Input & Dropdown */}
          <div className="relative flex-shrink-0 w-[380px] lg:w-[460px]" ref={searchContainerRef}>
            <div className="relative z-20">
              {isSearchFocused ? (
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#3b44c6]" />
              ) : (
                 <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              )}
              
              <input
                type="text"
                placeholder="Qualquer lugar em São Paulo, SP"
                className={`w-full h-[48px] rounded-full border bg-[#f3f5f6] pl-14 pr-10 text-[13px] font-normal text-[#1f2022] focus:outline-none transition-all ${
                  isSearchFocused 
                    ? "bg-white border-[#3b44c6] ring-1 ring-[#3b44c6]" 
                    : "border-transparent hover:bg-[#e5e7eb]"
                }`}
                value={localSearch}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleKeyDown}
              />
              
              {isSearchFocused && (
                <button 
                  onClick={() => {
                    setLocalSearch("");
                    setSuggestions([]);
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-[56px] left-0 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-4 animate-in fade-in zoom-in-95 duration-200 origin-top z-50 max-h-[400px] overflow-y-auto">
                
                {/* SUGGESTIONS MODE */}
                {showSuggestions ? (
                   <div className="px-2 py-2">
                      {isLoadingSuggestions ? (
                        <div className="p-4 text-center text-sm text-gray-500">Buscando...</div>
                      ) : suggestions.length > 0 ? (
                        suggestions.map((item, index) => (
                          <button
                            key={index}
                            className="flex items-center gap-3 w-full text-left p-3 hover:bg-gray-50 rounded-lg group transition-colors"
                            onClick={() => handleSuggestionClick(item)}
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-white border border-transparent group-hover:border-gray-200 transition-colors">
                              <MapPin className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-sm font-medium text-[#1f2022] truncate">{item.name}</span>
                              <span className="text-xs text-gray-500 truncate">{item.type} • {item.display_name}</span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                          {debouncedSearchTerm.length < 3 ? "Digite mais para buscar..." : "Nenhum local encontrado."}
                        </div>
                      )}
                   </div>
                ) : (
                  /* DEFAULT MODE (History + Extras) */
                  <>
                    {recentSearches.length > 0 && (
                      <>
                        <div className="px-6 pb-2 pt-2">
                          <h3 className="text-sm font-bold text-[#1f2022] mb-4">Últimas buscas</h3>
                          <div className="space-y-4">
                            {recentSearches.map((search, i) => (
                              <div 
                                key={i} 
                                className="flex items-start gap-3 group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors"
                                onClick={() => handleRecentClick(search)}
                              >
                                <History className="h-5 w-5 text-[#1f2022] mt-0.5" />
                                <div className="flex-1 border-b border-gray-100 pb-4 group-last:border-0 group-last:pb-0">
                                  <p className="text-sm font-normal text-[#1f2022] leading-tight">{search.location}</p>
                                  <p className="text-xs text-gray-500 mt-1">{search.details}</p>
                                </div>
                                <button 
                                  className="text-gray-400 hover:text-[#1f2022] p-1 rounded-full hover:bg-gray-200"
                                  onClick={(e) => handleRemoveRecent(e, i)}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="h-px bg-gray-100 my-2" />
                      </>
                    )}

                    <div className="px-6 pt-2 pb-4">
                      <h3 className="text-sm font-bold text-[#1f2022] mb-4">Mais jeitos de buscar</h3>
                      <div className="space-y-4">
                        <button 
                          className="flex items-center gap-3 w-full text-left hover:opacity-70 transition-opacity p-2 -mx-2 rounded-lg hover:bg-gray-50"
                          onClick={handleDrawMap}
                        >
                          <MousePointer2 className="h-5 w-5 text-[#1f2022]" />
                          <span className="text-sm font-normal text-[#1f2022]">Desenhe a área no mapa</span>
                        </button>
                        <button 
                          className="flex items-center gap-3 w-full text-left hover:opacity-70 transition-opacity p-2 -mx-2 rounded-lg hover:bg-gray-50"
                          onClick={handleNearMe}
                        >
                          <Crosshair className="h-5 w-5 text-[#1f2022]" />
                          <span className="text-sm font-normal text-[#1f2022]">Perto de você</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Filters (Scrollable) */}
          <div className="flex-1 flex items-center gap-3 overflow-hidden relative">
            
            {/* Scroll Arrow Left (Gradient Fade) */}
          <div className="absolute left-0 h-full flex items-center bg-gradient-to-r from-white via-white to-transparent pr-20 z-10">
             <button 
                onClick={scrollLeft}
                className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors pointer-events-auto"
             >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
             </button>
          </div>

          <div 
            ref={scrollRef}
              className="flex items-center gap-3 overflow-x-auto scrollbar-hide px-20"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Operation Type */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="inline-block">
                    <FilterPill 
                      label={filters.operationType === 'rent' ? "Alugar" : "Comprar"} 
                      active={true} 
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-2 rounded-xl shadow-xl border-gray-100" align="start">
                  <div className="flex flex-col">
                    <Button 
                      variant="ghost" 
                      className={`justify-start h-12 text-sm font-normal ${filters.operationType === 'buy' ? 'bg-gray-50 font-semibold' : ''}`}
                      onClick={() => setFilter("operationType", 'buy')}
                    >
                      Comprar
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={`justify-start h-12 text-sm font-normal ${filters.operationType === 'rent' ? 'bg-gray-50 font-semibold' : ''}`}
                      onClick={() => setFilter("operationType", 'rent')}
                    >
                      Alugar
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Price */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="inline-block">
                    <FilterPill 
                      label={filters.priceMin || filters.priceMax ? `R$ ${filters.priceMin || 0} - ${filters.priceMax || '...'}` : (filters.operationType === 'rent' ? "Aluguel" : "Valor do imóvel")} 
                      active={!!(filters.priceMin || filters.priceMax)}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[380px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                  <div className="space-y-6">
                    <h4 className="text-base font-bold text-[#1f2022]">
                      {filters.operationType === 'rent' ? "Valor" : "Valor do imóvel"}
                    </h4>
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <Label className="text-sm text-gray-600 font-normal">Mínimo</Label>
                        <CurrencyInput 
                          value={filters.priceMin} 
                          onChange={(val) => setFilter("priceMin", val)} 
                          placeholder="0" 
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label className="text-sm text-gray-600 font-normal">Máximo</Label>
                        <CurrencyInput 
                          value={filters.priceMax} 
                          onChange={(val) => setFilter("priceMax", val)} 
                          placeholder="Sem limite" 
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Type */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="inline-block">
                    <FilterPill 
                      label={filters.propertyTypes.length > 0 ? `${filters.propertyTypes.length} tipos` : "Tipos de imóvel"} 
                      active={filters.propertyTypes.length > 0}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                  <div className="space-y-6">
                    <h4 className="text-base font-bold text-[#1f2022]">Tipos de imóvel</h4>
                    <div className="space-y-4">
                      {["Apartamento", "Casa", "Casa de Condomínio", "Kitnet/Studio"].map((type) => (
                        <div key={type} className="flex items-center space-x-3">
                          <Checkbox 
                            id={type} 
                            checked={filters.propertyTypes.includes(type)}
                            onCheckedChange={(checked) => {
                              const newTypes = checked 
                                ? [...filters.propertyTypes, type]
                                : filters.propertyTypes.filter(t => t !== type);
                              setFilter("propertyTypes", newTypes);
                            }}
                            className="w-5 h-5 border-gray-300 data-[state=checked]:bg-[#3b44c6]" 
                          />
                          <Label htmlFor={type} className="text-sm font-normal text-gray-700 cursor-pointer">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Bedrooms */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="inline-block">
                    <FilterPill 
                      label={filters.bedrooms ? `${filters.bedrooms}+ quartos` : "Quartos"} 
                      active={!!filters.bedrooms} 
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[320px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                  <div className="space-y-4">
                     <h4 className="text-base font-bold text-[#1f2022]">Quartos</h4>
                     <div className="flex gap-3">
                       {[1, 2, 3, 4].map((num) => (
                         <button
                           key={num}
                           onClick={() => setFilter("bedrooms", filters.bedrooms === num ? null : num)}
                           className={`w-12 h-12 rounded-full text-sm font-semibold flex items-center justify-center transition-all ${
                             filters.bedrooms === num
                               ? "bg-[#eff2ff] text-[#3b44c6] border border-[#3b44c6]"
                               : "bg-white text-[#1f2022] border border-gray-200 hover:border-gray-300"
                           }`}
                         >
                           {num}+
                         </button>
                       ))}
                     </div>
                  </div>
                </PopoverContent>
              </Popover>

               {/* Parking */}
               <Popover>
                <PopoverTrigger asChild>
                  <div className="inline-block">
                    <FilterPill 
                      label={filters.parkingSpots ? `${filters.parkingSpots}+ vagas` : "Vagas de garagem"} 
                      active={!!filters.parkingSpots} 
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[320px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                  <div className="space-y-4">
                     <h4 className="text-base font-bold text-[#1f2022]">Vagas de garagem</h4>
                     <div className="flex gap-3">
                       <button 
                         onClick={() => setFilter("parkingSpots", null)}
                         className={`px-4 h-12 rounded-full text-sm font-semibold transition-all border ${!filters.parkingSpots ? "bg-[#eff2ff] text-[#3b44c6] border-[#eff2ff]" : "bg-white text-[#1f2022] border-gray-200"}`}
                       >
                          Tanto faz
                       </button>
                       {[1, 2, 3].map((num) => (
                         <button
                           key={num}
                           onClick={() => setFilter("parkingSpots", filters.parkingSpots === num ? null : num)}
                           className={`w-12 h-12 rounded-full text-sm font-semibold flex items-center justify-center transition-all ${
                             filters.parkingSpots === num
                               ? "bg-[#eff2ff] text-[#3b44c6] border border-[#3b44c6]"
                               : "bg-white text-[#1f2022] border border-gray-200 hover:border-gray-300"
                           }`}
                         >
                           {num}+
                         </button>
                       ))}
                     </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Bathrooms */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="inline-block">
                    <FilterPill 
                      label={filters.bathrooms ? `${filters.bathrooms}+ banheiros` : "Banheiros"} 
                      active={!!filters.bathrooms} 
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[320px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                  <div className="space-y-4">
                     <h4 className="text-base font-bold text-[#1f2022]">Banheiros</h4>
                     <div className="flex gap-3">
                       {[1, 2, 3, 4].map((num) => (
                         <button
                           key={num}
                           onClick={() => setFilter("bathrooms", filters.bathrooms === num ? null : num)}
                           className={`w-12 h-12 rounded-full text-sm font-semibold flex items-center justify-center transition-all ${
                             filters.bathrooms === num
                               ? "bg-[#eff2ff] text-[#3b44c6] border border-[#3b44c6]"
                               : "bg-white text-[#1f2022] border border-gray-200 hover:border-gray-300"
                           }`}
                         >
                           {num}+
                         </button>
                       ))}
                     </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Area */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="inline-block">
                    <FilterPill 
                      label={filters.areaMin || filters.areaMax ? `Área: ${filters.areaMin || 0}-${filters.areaMax || '...'} m²` : "Área"} 
                      active={!!(filters.areaMin || filters.areaMax)}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[380px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                  <div className="space-y-6">
                    <h4 className="text-base font-bold text-[#1f2022]">Área (m²)</h4>
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <Label className="text-sm text-gray-600 font-normal">Mínima</Label>
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="0"
                            className="pr-8 h-12 text-sm border-gray-300 focus:border-[#3b44c6] focus:ring-1 focus:ring-[#3b44c6]"
                            value={filters.areaMin || ""}
                            onChange={(e) => setFilter("areaMin", e.target.value ? Number(e.target.value) : null)}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">m²</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label className="text-sm text-gray-600 font-normal">Máxima</Label>
                        <div className="relative">
                          <Input 
                            type="number" 
                            placeholder="Sem limite"
                            className="pr-8 h-12 text-sm border-gray-300 focus:border-[#3b44c6] focus:ring-1 focus:ring-[#3b44c6]"
                            value={filters.areaMax || ""}
                            onChange={(e) => setFilter("areaMax", e.target.value ? Number(e.target.value) : null)}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">m²</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Rent Specific Filters */}
              {filters.operationType === 'rent' && (
                 <>
                   {/* Furnished */}
                   <Popover>
                    <PopoverTrigger asChild>
                      <div className="inline-block">
                        <FilterPill 
                          label="Mobiliado" 
                          active={filters.furnished !== "any"}
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[340px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                      <div className="space-y-4">
                         <h4 className="text-base font-bold text-[#1f2022]">Mobiliado</h4>
                         <div className="flex gap-3">
                           {[
                             { label: "Tanto faz", val: "any" }, 
                             { label: "Sim", val: "yes" }, 
                             { label: "Não", val: "no" }
                           ].map((opt) => (
                             <button
                               key={opt.val}
                               onClick={() => setFilter("furnished", opt.val)}
                               className={`px-6 h-12 rounded-full text-sm font-semibold transition-all border ${
                                 filters.furnished === opt.val
                                   ? "bg-[#eff2ff] text-[#3b44c6] border-[#eff2ff]"
                                   : "bg-white text-[#1f2022] border-gray-200 hover:border-gray-300"
                               }`}
                             >
                               {opt.label}
                             </button>
                           ))}
                         </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                   {/* Pets */}
                   <Popover>
                    <PopoverTrigger asChild>
                      <div className="inline-block">
                        <FilterPill 
                          label="Aceita pets" 
                          active={filters.petFriendly !== "any"}
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[340px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                      <div className="space-y-4">
                         <h4 className="text-base font-bold text-[#1f2022]">Aceita pets</h4>
                         <div className="flex gap-3">
                           {[
                             { label: "Tanto faz", val: "any" }, 
                             { label: "Sim", val: "yes" }, 
                             { label: "Não", val: "no" }
                           ].map((opt) => (
                             <button
                               key={opt.val}
                               onClick={() => setFilter("petFriendly", opt.val)}
                               className={`px-6 h-12 rounded-full text-sm font-semibold transition-all border ${
                                 filters.petFriendly === opt.val
                                   ? "bg-[#eff2ff] text-[#3b44c6] border-[#eff2ff]"
                                   : "bg-white text-[#1f2022] border-gray-200 hover:border-gray-300"
                               }`}
                             >
                               {opt.label}
                             </button>
                           ))}
                         </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                   {/* Subway */}
                   <Popover>
                    <PopoverTrigger asChild>
                      <div className="inline-block">
                        <FilterPill 
                          label="Próximo ao metrô" 
                          active={filters.nearSubway !== "any"}
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[340px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                      <div className="space-y-4">
                         <h4 className="text-base font-bold text-[#1f2022]">Próximo ao metrô</h4>
                         <div className="flex gap-3">
                           {[
                             { label: "Tanto faz", val: "any" }, 
                             { label: "Sim", val: "yes" }, 
                             { label: "Não", val: "no" }
                           ].map((opt) => (
                             <button
                               key={opt.val}
                               onClick={() => setFilter("nearSubway", opt.val)}
                               className={`px-6 h-12 rounded-full text-sm font-semibold transition-all border ${
                                 filters.nearSubway === opt.val
                                   ? "bg-[#eff2ff] text-[#3b44c6] border-[#eff2ff]"
                                   : "bg-white text-[#1f2022] border-gray-200 hover:border-gray-300"
                               }`}
                             >
                               {opt.label}
                             </button>
                           ))}
                         </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                   {/* Availability */}
                   <Popover>
                    <PopoverTrigger asChild>
                      <div className="inline-block"><FilterPill label="Disponibilidade" /></div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                      <div className="space-y-4">
                         <h4 className="text-base font-bold text-[#1f2022]">Disponibilidade</h4>
                         <div className="flex gap-3">
                           {["Tanto faz", "Imediata", "Em breve"].map((opt, i) => (
                             <button
                               key={opt}
                               className={`px-6 h-12 rounded-full text-sm font-semibold transition-all border ${
                                 i === 0
                                   ? "bg-[#eff2ff] text-[#3b44c6] border-[#eff2ff]"
                                   : "bg-white text-[#1f2022] border-gray-200 hover:border-gray-300"
                               }`}
                             >
                               {opt}
                             </button>
                           ))}
                         </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                 </>
               )}

            </div>
            
            {/* Scroll Arrow (Right) */}
            <div className="absolute right-0 h-full flex items-center bg-gradient-to-l from-white via-white to-transparent pl-20 pointer-events-none">
               <button 
                  onClick={scrollRight}
                  className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors z-10 pointer-events-auto"
               >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
               </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 flex-shrink-0 pl-4 border-l border-gray-100">
            <FiltersSidebar>
              <Button variant="ghost" className="rounded-full h-[48px] gap-2 bg-[#f3f5f6] hover:bg-[#e5e7eb] text-[#1f2022] text-[13px] font-bold border-none px-6">
                <SlidersHorizontal className="h-4 w-4" />
                Mais filtros
              </Button>
            </FiltersSidebar>

            <Button variant="ghost" className="rounded-full h-[48px] gap-2 bg-[#f3f5f6] hover:bg-[#e5e7eb] text-[#1f2022] text-[13px] font-bold border-none px-6 hidden xl:inline-flex">
               <Bell className="h-4 w-4" />
               Criar alerta de imóvel
            </Button>
          </div>

        </div>
      </div>
    </>
  );
}