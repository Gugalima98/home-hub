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

// Filter Pill Component (Reduced font size to text-[13px] and weight to font-medium)
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

// Currency Input Component (Reduced input text to text-sm)
const CurrencyInput = ({ placeholder }: { placeholder?: string }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
    <Input 
      type="text" 
      placeholder={placeholder}
      className="pl-9 h-12 text-sm border-gray-300 focus:border-[#3b44c6] focus:ring-1 focus:ring-[#3b44c6]"
    />
  </div>
);

export default function FilterBar() {
  const [operationType, setOperationType] = useState<'rent' | 'buy'>('rent');
  const [rentPriceType, setRentPriceType] = useState<'total' | 'rent'>('total');
  
  const scrollRef = useRef<HTMLDivElement>(null);

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
      {/* Spacer to prevent content overlap */}
      <div className="h-[98px] w-full bg-transparent" aria-hidden="true" />
      
      <div className="bg-white border-b fixed top-[69px] left-0 right-0 z-30 py-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.08)]">
        <div className="container-fluid px-8 flex items-center gap-6">
        
        {/* Location Input (Left Side) - Reduced font size to text-[13px] */}
        <div className="relative flex-shrink-0 w-[380px] lg:w-[460px]">
          <div className="relative">
            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              defaultValue="Qualquer lugar em São Paulo, SP"
              className="w-full h-[48px] rounded-full border-none bg-[#f3f5f6] pl-14 pr-6 text-[13px] font-normal text-[#1f2022] focus:outline-none focus:ring-2 focus:ring-[#3b44c6]/20 placeholder:text-gray-500 transition-shadow"
            />
          </div>
        </div>

        {/* Scrollable Filters Area */}
        <div className="flex-1 flex items-center gap-3 overflow-hidden relative">
          
          {/* Scroll Arrow Left (Gradient Fade) */}
          <div className="absolute left-0 h-full flex items-center bg-gradient-to-r from-white via-white to-transparent pr-20 z-10">
             <button 
                onClick={scrollLeft}
                className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
             >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
             </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-hide px-20"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Operation Type Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="inline-block">
                  <FilterPill 
                    label={operationType === 'rent' ? "Alugar" : "Comprar"} 
                    active={true} 
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-2 rounded-xl shadow-xl border-gray-100" align="start">
                <div className="flex flex-col">
                  <Button 
                    variant="ghost" 
                    className={`justify-start h-12 text-sm font-normal ${operationType === 'buy' ? 'bg-gray-50 font-semibold' : ''}`}
                    onClick={() => setOperationType('buy')}
                  >
                    Comprar
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`justify-start h-12 text-sm font-normal ${operationType === 'rent' ? 'bg-gray-50 font-semibold' : ''}`}
                    onClick={() => setOperationType('rent')}
                  >
                    Alugar
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Price Filter Dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="inline-block">
                  <FilterPill 
                    label={operationType === 'rent' ? "Aluguel" : "Valor do imóvel"} 
                    active={false}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[380px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                <div className="space-y-6">
                  <h4 className="text-base font-bold text-[#1f2022]">
                    {operationType === 'rent' ? "Valor" : "Valor do imóvel"}
                  </h4>
                  
                  {/* Rent Type Toggle (Only for Rent) */}
                  {operationType === 'rent' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setRentPriceType('total')}
                        className={`flex-1 h-10 rounded-full text-sm font-semibold transition-colors ${
                          rentPriceType === 'total'
                            ? "bg-[#f3f5f6] text-[#1f2022] border border-gray-200"
                            : "bg-white text-[#3b44c6] border border-transparent hover:bg-gray-50"
                        }`}
                      >
                        Valor total
                      </button>
                      <button
                        onClick={() => setRentPriceType('rent')}
                        className={`flex-1 h-10 rounded-full text-sm font-semibold transition-colors ${
                          rentPriceType === 'rent'
                            ? "bg-[#eff2ff] text-[#3b44c6] border border-[#eff2ff]"
                            : "bg-white text-gray-500 border border-transparent hover:bg-gray-50"
                        }`}
                      >
                        Aluguel
                      </button>
                    </div>
                  )}

                  {/* Min/Max Inputs */}
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm text-gray-600 font-normal">Mínimo</Label>
                      <CurrencyInput placeholder="0" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm text-gray-600 font-normal">Máximo</Label>
                      <CurrencyInput placeholder="Sem limite" />
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2">
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto text-[#3b44c6] font-bold text-sm hover:bg-transparent hover:text-[#2a308c]"
                    >
                      Atualizar resultados
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Type */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="inline-block"><FilterPill label="Tipos de imóvel" /></div>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                <div className="space-y-6">
                  <h4 className="text-base font-bold text-[#1f2022]">Tipos de imóvel</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox id="apt" className="w-5 h-5 border-gray-300 data-[state=checked]:bg-[#3b44c6] data-[state=checked]:border-[#3b44c6]" />
                      <Label htmlFor="apt" className="text-sm font-normal text-gray-700 cursor-pointer">Apartamento</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox id="house" className="w-5 h-5 border-gray-300 data-[state=checked]:bg-[#3b44c6] data-[state=checked]:border-[#3b44c6]" />
                      <Label htmlFor="house" className="text-sm font-normal text-gray-700 cursor-pointer">Casa</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox id="condo" className="w-5 h-5 border-gray-300 data-[state=checked]:bg-[#3b44c6] data-[state=checked]:border-[#3b44c6]" />
                      <Label htmlFor="condo" className="text-sm font-normal text-gray-700 cursor-pointer">Casa de Condomínio</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox id="studio" className="w-5 h-5 border-gray-300 data-[state=checked]:bg-[#3b44c6] data-[state=checked]:border-[#3b44c6]" />
                      <Label htmlFor="studio" className="text-sm font-normal text-gray-700 cursor-pointer">Kitnet/Studio</Label>
                    </div>
                  </div>
                  
                   {/* Footer Action */}
                   <div className="pt-2">
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto text-[#3b44c6] font-bold text-sm hover:bg-transparent hover:text-[#2a308c]"
                    >
                      Atualizar resultados
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Bedrooms */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="inline-block"><FilterPill label="1+ quartos" active /></div>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                <div className="space-y-4">
                   <h4 className="text-base font-bold text-[#1f2022]">Quartos</h4>
                   <div className="flex gap-3">
                     {["1+", "2+", "3+", "4+"].map((num, i) => (
                       <button
                         key={num}
                         className={`w-12 h-12 rounded-full text-sm font-semibold flex items-center justify-center transition-all ${
                           i === 0 // Assuming "1+" is active for demo
                             ? "bg-[#eff2ff] text-[#3b44c6] border border-[#3b44c6]"
                             : "bg-white text-[#1f2022] border border-gray-200 hover:border-gray-300"
                         }`}
                       >
                         {num}
                       </button>
                     ))}
                   </div>
                </div>
              </PopoverContent>
            </Popover>

             {/* Parking */}
             <Popover>
              <PopoverTrigger asChild>
                <div className="inline-block"><FilterPill label="Vagas de garagem" /></div>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                <div className="space-y-4">
                   <h4 className="text-base font-bold text-[#1f2022]">Vagas de garagem</h4>
                   <div className="flex gap-3">
                     <button className="px-4 h-12 rounded-full text-sm font-semibold transition-all bg-[#eff2ff] text-[#3b44c6] border border-[#eff2ff]">
                        Tanto faz
                     </button>
                     {["1+", "2+", "3+"].map((num) => (
                       <button
                         key={num}
                         className="w-12 h-12 rounded-full text-sm font-semibold flex items-center justify-center transition-all bg-white text-[#1f2022] border border-gray-200 hover:border-gray-300"
                       >
                         {num}
                       </button>
                     ))}
                   </div>
                </div>
              </PopoverContent>
            </Popover>

             {/* Bathrooms */}
             <Popover>
              <PopoverTrigger asChild>
                <div className="inline-block"><FilterPill label="1+ banheiros" /></div>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                <div className="space-y-4">
                   <h4 className="text-base font-bold text-[#1f2022]">Banheiros</h4>
                   <div className="flex gap-3">
                     {["1+", "2+", "3+", "4+"].map((num, i) => (
                       <button
                         key={num}
                         className={`w-12 h-12 rounded-full text-sm font-semibold flex items-center justify-center transition-all ${
                           i === 0
                             ? "bg-[#eff2ff] text-[#3b44c6] border border-[#3b44c6]"
                             : "bg-white text-[#1f2022] border border-gray-200 hover:border-gray-300"
                         }`}
                       >
                         {num}
                       </button>
                     ))}
                   </div>
                </div>
              </PopoverContent>
            </Popover>

             {/* Area */}
             <Popover>
              <PopoverTrigger asChild>
                <div className="inline-block"><FilterPill label="Área" /></div>
              </PopoverTrigger>
              <PopoverContent className="w-[380px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                <div className="space-y-6">
                  <h4 className="text-base font-bold text-[#1f2022]">Área</h4>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm text-gray-600 font-normal">Mínima</Label>
                      <div className="relative">
                        <Input 
                          type="text" 
                          placeholder="0"
                          className="pr-8 h-12 text-sm border-gray-300 focus:border-[#3b44c6] focus:ring-1 focus:ring-[#3b44c6]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">m²</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label className="text-sm text-gray-600 font-normal">Máxima</Label>
                      <div className="relative">
                        <Input 
                          type="text" 
                          placeholder="Sem limite"
                          className="pr-8 h-12 text-sm border-gray-300 focus:border-[#3b44c6] focus:ring-1 focus:ring-[#3b44c6]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">m²</span>
                      </div>
                    </div>
                  </div>
                  
                   {/* Footer Action */}
                   <div className="pt-2">
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto text-[#3b44c6] font-bold text-sm hover:bg-transparent hover:text-[#2a308c]"
                    >
                      Atualizar resultados
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

             {/* Rent Specific Filters */}
             {operationType === 'rent' && (
               <>
                 {/* Furnished */}
                 <Popover>
                  <PopoverTrigger asChild>
                    <div className="inline-block"><FilterPill label="Mobiliado" /></div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[340px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                    <div className="space-y-4">
                       <h4 className="text-base font-bold text-[#1f2022]">Mobiliado</h4>
                       <div className="flex gap-3">
                         {["Tanto faz", "Sim", "Não"].map((opt, i) => (
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

                 {/* Pets */}
                 <Popover>
                  <PopoverTrigger asChild>
                    <div className="inline-block"><FilterPill label="Aceita pets" /></div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[340px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                    <div className="space-y-4">
                       <h4 className="text-base font-bold text-[#1f2022]">Aceita pets</h4>
                       <div className="flex gap-3">
                         {["Tanto faz", "Sim", "Não"].map((opt, i) => (
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

                 {/* Subway */}
                 <Popover>
                  <PopoverTrigger asChild>
                    <div className="inline-block"><FilterPill label="Próximo ao metrô" /></div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[340px] p-6 rounded-2xl shadow-2xl border-gray-100" align="start">
                    <div className="space-y-4">
                       <h4 className="text-base font-bold text-[#1f2022]">Próximo ao metrô</h4>
                       <div className="flex gap-3">
                         {["Tanto faz", "Sim", "Não"].map((opt, i) => (
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
          
          {/* Scroll Arrow (Gradient Fade) */}
          <div className="absolute right-0 h-full flex items-center bg-gradient-to-l from-white via-white to-transparent pl-20">
             <button 
                onClick={scrollRight}
                className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
             >
                <ChevronRight className="h-5 w-5 text-gray-600" />
             </button>
          </div>
        </div>

        {/* Right Actions (Fixed) */}
        <div className="flex items-center gap-3 flex-shrink-0 pl-4 border-l border-gray-100">
           {/* More Filters Button */}
          <FiltersSidebar>
            <Button variant="ghost" className="rounded-full h-[48px] gap-2 bg-[#f3f5f6] hover:bg-[#e5e7eb] text-[#1f2022] text-[13px] font-bold border-none px-6">
              <SlidersHorizontal className="h-4 w-4" />
              Mais filtros
            </Button>
          </FiltersSidebar>

          {/* Create Alert Button */}
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