import { useState, useRef } from "react";
import { 
  SlidersHorizontal, 
  MapPin, 
  ChevronDown, 
  Bell,
  ChevronRight,
  ChevronLeft
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

export default function FilterBar() {
  const { filters, setFilter } = useFilters();
  const [localSearch, setLocalSearch] = useState(filters.searchLocation);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    setFilter("searchLocation", e.target.value);
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

  return (
    <>
      <div className="h-[98px] w-full bg-transparent" aria-hidden="true" />
      
      <div className="bg-white border-b fixed top-[69px] left-0 right-0 z-30 py-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.08)]">
        <div className="container-fluid px-8 flex items-center gap-6">
        
          {/* Location Input */}
          <div className="relative flex-shrink-0 w-[380px] lg:w-[460px]">
            <div className="relative">
              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Qualquer lugar em São Paulo, SP"
                className="w-full h-[48px] rounded-full border-none bg-[#f3f5f6] pl-14 pr-6 text-[13px] font-normal text-[#1f2022] focus:outline-none focus:ring-2 focus:ring-[#3b44c6]/20 placeholder:text-gray-500 transition-shadow"
                value={localSearch}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Scrollable Filters Area */}
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
