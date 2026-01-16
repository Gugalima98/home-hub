import { useState, useRef } from "react";
import { 
  SlidersHorizontal, 
  MapPin, 
  ChevronDown, 
  Bell,
  ChevronRight
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

// Filter Pill Component
const FilterPill = ({ label, active = false, onClick, hasDropdown = true }: { label: string; active?: boolean; onClick?: () => void; hasDropdown?: boolean }) => (
  <Button
    variant="ghost"
    className={`rounded-full h-[48px] px-6 text-[12px] font-bold border-none transition-all tracking-wide ${
      active 
        ? "bg-[#eff2ff] text-[#3b44c6] hover:bg-[#dfe6ff]" 
        : "bg-[#f3f5f6] text-[#1f2022] hover:bg-[#e5e7eb]"
    }`}
    onClick={onClick}
  >
    {label}
    {hasDropdown && (
      <ChevronDown 
        className={`ml-2 h-3 w-3 stroke-[3px] transition-transform ${active ? "text-[#3b44c6]" : "text-[#1f2022]"}`} 
      />
    )}
  </Button>
);

export default function FilterBar() {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Spacer to prevent content overlap */}
      <div className="h-[98px] w-full bg-transparent" aria-hidden="true" />
      
      <div className="bg-white border-b fixed top-[69px] left-0 right-0 z-30 py-6 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.08)]">
        <div className="container-fluid px-8 flex items-center gap-6">
        
        {/* Location Input (Left Side) */}
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
          <div 
            ref={scrollRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-hide pr-20"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Operation Type */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="inline-block"><FilterPill label="Alugar" active /></div>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2" align="start">
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" className="justify-start h-10 text-sm">Comprar</Button>
                  <Button variant="ghost" className="justify-start h-10 text-sm">Alugar</Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Price Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="inline-block"><FilterPill label="Aluguel" /></div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none">Faixa de Preço</h4>
                  <div className="pt-4">
                    <Slider
                      defaultValue={[0, 10000]}
                      max={20000}
                      step={100}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>R$ 0</span>
                      <span>R$ 20.000+</span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Type */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="inline-block"><FilterPill label="Tipos de imóvel" /></div>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4" align="start">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="apt" defaultChecked />
                    <Label htmlFor="apt">Apartamento</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="house" />
                    <Label htmlFor="house">Casa</Label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Bedrooms */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="inline-block"><FilterPill label="1+ quartos" active /></div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                   <p>Opções de quartos</p>
                </div>
              </PopoverContent>
            </Popover>

             {/* Parking */}
             <FilterPill label="Vagas de garagem" />

             {/* Bathrooms */}
             <FilterPill label="1+ banheiros" active />

             {/* Area */}
             <FilterPill label="Área" />

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
          <Button variant="ghost" className="rounded-full h-[48px] gap-2 bg-[#f3f5f6] hover:bg-[#e5e7eb] text-[#1f2022] text-[12px] font-bold border-none px-6">
            <SlidersHorizontal className="h-4 w-4" />
            Mais filtros
          </Button>

          {/* Create Alert Button */}
          <Button variant="ghost" className="rounded-full h-[48px] gap-2 bg-[#f3f5f6] hover:bg-[#e5e7eb] text-[#1f2022] text-[12px] font-bold border-none px-6 hidden xl:inline-flex">
             <Bell className="h-4 w-4" />
             Criar alerta de imóvel
          </Button>
        </div>

      </div>
    </div>
    </>
  );
}
