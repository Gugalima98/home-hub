import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFilters } from "@/contexts/FilterContext";
import { useNavigate } from "react-router-dom";

interface FiltersSidebarProps {
  children: React.ReactNode;
}

// --- Componentes Auxiliares de Estilo ---

const FilterSectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-base font-bold text-[#1f2022] mb-4">{children}</h3>
);

// Botão estilo "Pílula"
const FilterPill = ({ 
  label, 
  active = false, 
  onClick,
  className = "" 
}: { 
  label: string; 
  active?: boolean; 
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`
      h-10 px-5 rounded-full text-xs font-bold transition-all border
      flex items-center justify-center whitespace-nowrap
      ${active 
        ? "bg-[#eff2ff] text-[#3b44c6] border-[#eff2ff]" 
        : "bg-white text-[#1f2022] border-gray-200 hover:border-gray-300"
      }
      ${className}
    `}
  >
    {label}
  </button>
);

// Botão Redondo (Quartos, Vagas)
const CounterPill = ({ 
  label, 
  active = false, 
  onClick 
}: { 
  label: string; 
  active?: boolean; 
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      w-12 h-12 rounded-full text-sm font-bold transition-all border flex items-center justify-center
      ${active 
        ? "bg-[#eff2ff] text-[#3b44c6] border-[#eff2ff]" 
        : "bg-white text-[#1f2022] border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }
    `}
  >
    {label}
  </button>
);

// Helper para listas de Checkbox
const CheckboxList = ({ 
  options, 
  idPrefix,
  selectedOptions,
  onChange
}: { 
  options: string[], 
  idPrefix: string,
  selectedOptions: string[],
  onChange: (option: string, checked: boolean) => void
}) => (
  <div className="grid grid-cols-2 gap-y-5 gap-x-8">
    {options.map((option) => (
      <div key={option} className="flex items-center space-x-3 group cursor-pointer">
        <Checkbox
          id={`${idPrefix}-${option}`}
          checked={selectedOptions.includes(option)}
          onCheckedChange={(checked) => onChange(option, checked as boolean)}
          className="w-6 h-6 rounded-[6px] border-gray-300 data-[state=checked]:bg-[#3b44c6] data-[state=checked]:border-[#3b44c6] transition-all"
        />
        <Label
          htmlFor={`${idPrefix}-${option}`}
          className="text-[15px] font-normal text-[#1f2022] cursor-pointer leading-tight"
        >
          {option}
        </Label>
      </div>
    ))}
  </div>
);

// --- Dados das Listas ---

const condominioOptions = [
  "Academia", "Área verde", "Brinquedoteca", "Churrasqueira", 
  "Elevador", "Lavanderia", "Piscina", "Playground", 
  "Portaria 24h", "Quadra esportiva", "Salão de festas", 
  "Salão de jogos", "Sauna"
];

const comodidadesOptions = [
  "Apartamento cobertura", "Ar condicionado", "Banheira", "Box", 
  "Churrasqueira", "Chuveiro a gás", "Closet", "Garden/Área privativa", 
  "Novos ou reformados", "Piscina privativa", "Somente uma casa no terreno", 
  "Tanque", "Televisão", "Utensílios de cozinha", "Ventilador de teto"
];

const mobiliasOptions = [
  "Armários na cozinha", "Armários no quarto", "Armários nos banheiros", 
  "Cama de casal", "Cama de solteiro", "Mesas e cadeiras de jantar", "Sofá"
];

const bemEstarOptions = [
  "Janelas grandes", "Rua silenciosa", "Sol da manhã", "Sol da tarde", "Vista livre"
];

const eletrodomesticosOptions = [
  "Fogão", "Fogão cooktop", "Geladeira", "Máquina de lavar", "Microondas"
];

const comodosOptions = [
  "Área de serviço", "Cozinha americana", "Home-office", "Jardim", "Quintal", "Varanda"
];

const acessibilidadeOptions = [
  "Banheiro adaptado", "Corrimão", "Piso tátil", 
  "Quartos e corredores com portas amplas", "Rampas de acesso", "Vaga de garagem acessível"
];

export function FiltersSidebar({ children }: FiltersSidebarProps) {
  const { filters, setFilter, resetFilters } = useFilters();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Preço inicial para o Slider se não houver filtro definido
  const defaultMin = 500;
  const defaultMax = 30000;

  const handleOperationChange = (op: "rent" | "buy") => {
    setFilter("operationType", op);
    // Sync URL
    const params = new URLSearchParams(window.location.search);
    params.set("operation", op);
    navigate({ search: params.toString() }, { replace: true });
  };

  const handlePropertyTypeToggle = (type: string, checked: boolean) => {
    const currentTypes = filters.propertyTypes || [];
    const newTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter((t) => t !== type);
    setFilter("propertyTypes", newTypes);
  };

  const handleAmenityToggle = (amenity: string, checked: boolean) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = checked
      ? [...currentAmenities, amenity]
      : currentAmenities.filter((a) => a !== amenity);
    setFilter("amenities", newAmenities);
  };

  const handleApplyFilters = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      {/* Side="left" e largura ajustada */}
      <SheetContent side="left" className="w-full sm:w-[600px] sm:max-w-[600px] p-0 flex flex-col gap-0 border-r shadow-2xl overflow-hidden bg-white">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex flex-col items-start gap-6 bg-white z-10">
          <SheetClose className="rounded-full p-1 hover:bg-gray-100 transition-colors">
             <X className="h-6 w-6 text-gray-500" />
          </SheetClose>
          
          {/* Toggle Principal (Alugar/Comprar) */}
           <div className="bg-[#f3f5f6] p-1 rounded-full flex relative w-fit">
              <button
                onClick={() => handleOperationChange("rent")}
                className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${
                  filters.operationType === "rent"
                    ? "bg-[#3b44c6] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Alugar
              </button>
              <button
                onClick={() => handleOperationChange("buy")}
                className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${
                  filters.operationType === "buy"
                    ? "bg-[#3b44c6] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Comprar
              </button>
            </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 bg-white">
          <div className="px-6 py-6 space-y-10 pb-32">
            
            {/* Valor */}
            <div>
              <FilterSectionTitle>Valor {filters.operationType === "rent" ? "(Mensal)" : "(Venda)"}</FilterSectionTitle>
              
              <div className="flex gap-4 mb-8">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-bold text-[#1f2022]">Mínimo</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1f2022] text-sm">R$</span>
                    <Input 
                      type="number"
                      value={filters.priceMin || ""} 
                      onChange={(e) => setFilter("priceMin", e.target.value ? Number(e.target.value) : null)} 
                      className="pl-10 h-14 rounded-xl border-gray-300 text-base text-[#1f2022]" 
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-bold text-[#1f2022]">Máximo</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1f2022] text-sm">R$</span>
                    <Input 
                      type="number"
                      value={filters.priceMax || ""} 
                      onChange={(e) => setFilter("priceMax", e.target.value ? Number(e.target.value) : null)} 
                      className="pl-10 h-14 rounded-xl border-gray-300 text-base text-[#1f2022]" 
                      placeholder="Ilimitado"
                    />
                  </div>
                </div>
              </div>
              <div className="px-2">
                <Slider 
                  defaultValue={[defaultMin, defaultMax]} 
                  max={30000} 
                  step={100} 
                  value={[filters.priceMin || defaultMin, filters.priceMax || defaultMax]} 
                  onValueChange={(val) => {
                    setFilter("priceMin", val[0]);
                    setFilter("priceMax", val[1]);
                  }} 
                  className="py-2" 
                />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Tipos de imóvel */}
            <div>
              <FilterSectionTitle>Tipos de imóvel</FilterSectionTitle>
              <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                {["Apartamento", "Casa", "Casa de Condomínio", "Kitnet/Studio"].map((type) => (
                  <div key={type} className="flex items-center space-x-3 group cursor-pointer">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.propertyTypes.includes(type)}
                      onCheckedChange={(checked) => handlePropertyTypeToggle(type, checked as boolean)}
                      className="w-6 h-6 rounded-[6px] border-gray-300 data-[state=checked]:bg-[#3b44c6] data-[state=checked]:border-[#3b44c6] transition-all"
                    />
                    <Label
                      htmlFor={`type-${type}`}
                      className="text-[15px] font-normal text-[#1f2022] cursor-pointer"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Quartos */}
            <div>
              <FilterSectionTitle>Quartos</FilterSectionTitle>
              <div className="flex gap-3">
                {["1+", "2+", "3+", "4+"].map((num, i) => (
                    <CounterPill 
                        key={num} 
                        label={num} 
                        active={filters.bedrooms === (i + 1)} 
                        onClick={() => setFilter("bedrooms", filters.bedrooms === (i + 1) ? null : (i + 1))} 
                    />
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Vagas de garagem */}
            <div>
              <FilterSectionTitle>Vagas de garagem</FilterSectionTitle>
              <div className="flex gap-3 items-center">
                <FilterPill label="Tanto faz" active={filters.parkingSpots === null} onClick={() => setFilter("parkingSpots", null)} className="h-12 px-6" />
                {["1+", "2+", "3+"].map((num, i) => (
                    <CounterPill 
                        key={num} 
                        label={num} 
                        active={filters.parkingSpots === (i + 1)} 
                        onClick={() => setFilter("parkingSpots", i + 1)} 
                    />
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Banheiros */}
            <div>
              <FilterSectionTitle>Banheiros</FilterSectionTitle>
              <div className="flex gap-3">
                <FilterPill label="Tanto faz" active={filters.bathrooms === null} onClick={() => setFilter("bathrooms", null)} className="h-12 px-6" />
                {["1+", "2+", "3+"].map((num, i) => (
                    <CounterPill 
                        key={num} 
                        label={num} 
                        active={filters.bathrooms === (i + 1)} 
                        onClick={() => setFilter("bathrooms", i + 1)} 
                    />
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

             {/* Área */}
            <div>
              <FilterSectionTitle>Área</FilterSectionTitle>
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-bold text-[#1f2022]">Mínima</Label>
                  <div className="relative">
                    <Input 
                        type="number"
                        className="h-14 rounded-xl border-gray-300 text-base" 
                        placeholder="0" 
                        value={filters.areaMin || ""}
                        onChange={(e) => setFilter("areaMin", e.target.value ? Number(e.target.value) : null)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">m²</span>
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-bold text-[#1f2022]">Máxima</Label>
                  <div className="relative">
                    <Input 
                        type="number"
                        className="h-14 rounded-xl border-gray-300 text-base" 
                        placeholder="Sem limite" 
                        value={filters.areaMax || ""}
                        onChange={(e) => setFilter("areaMax", e.target.value ? Number(e.target.value) : null)}
                    />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">m²</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Mobiliado */}
            <div>
              <FilterSectionTitle>Mobiliado</FilterSectionTitle>
              <div className="flex gap-3">
                <FilterPill label="Tanto faz" active={filters.furnished === "any"} onClick={() => setFilter("furnished", "any")} className="h-12 px-6" />
                <FilterPill label="Sim" active={filters.furnished === "yes"} onClick={() => setFilter("furnished", "yes")} className="h-12 px-6" />
                <FilterPill label="Não" active={filters.furnished === "no"} onClick={() => setFilter("furnished", "no")} className="h-12 px-6" />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Aceita Pets */}
            <div>
              <FilterSectionTitle>Aceita pets</FilterSectionTitle>
              <div className="flex gap-3">
                 <FilterPill label="Tanto faz" active={filters.petFriendly === "any"} onClick={() => setFilter("petFriendly", "any")} className="h-12 px-6" />
                 <FilterPill label="Sim" active={filters.petFriendly === "yes"} onClick={() => setFilter("petFriendly", "yes")} className="h-12 px-6" />
                 <FilterPill label="Não" active={filters.petFriendly === "no"} onClick={() => setFilter("petFriendly", "no")} className="h-12 px-6" />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Próximo ao metrô */}
            <div>
              <FilterSectionTitle>Próximo ao metrô</FilterSectionTitle>
              <div className="flex gap-3">
                 <FilterPill label="Tanto faz" active={filters.nearSubway === "any"} onClick={() => setFilter("nearSubway", "any")} className="h-12 px-6" />
                 <FilterPill label="Sim" active={filters.nearSubway === "yes"} onClick={() => setFilter("nearSubway", "yes")} className="h-12 px-6" />
                 <FilterPill label="Não" active={filters.nearSubway === "no"} onClick={() => setFilter("nearSubway", "no")} className="h-12 px-6" />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Disponibilidade */}
            <div>
              <FilterSectionTitle>Disponibilidade</FilterSectionTitle>
              <div className="flex gap-3 flex-wrap">
                 <FilterPill label="Tanto faz" active={filters.availability === "any"} onClick={() => setFilter("availability", "any")} className="h-12 px-6" />
                 <FilterPill label="Imediata" active={filters.availability === "immediate"} onClick={() => setFilter("availability", "immediate")} className="h-12 px-6" />
                 <FilterPill label="Em breve" active={filters.availability === "soon"} onClick={() => setFilter("availability", "soon")} className="h-12 px-6" />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Suites */}
            <div>
              <FilterSectionTitle>Suítes</FilterSectionTitle>
              <div className="flex gap-3">
                {["1+", "2+", "3+", "4+"].map((num, i) => (
                    <CounterPill 
                        key={num} 
                        label={num} 
                        active={filters.suites === (i + 1)} 
                        onClick={() => setFilter("suites", i + 1)} 
                    />
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Condomínio */}
            <div>
              <FilterSectionTitle>Condomínio</FilterSectionTitle>
              <CheckboxList options={condominioOptions} idPrefix="condominio" selectedOptions={filters.amenities} onChange={handleAmenityToggle} />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Comodidades */}
            <div>
              <FilterSectionTitle>Comodidades</FilterSectionTitle>
              <CheckboxList options={comodidadesOptions} idPrefix="comodidades" selectedOptions={filters.amenities} onChange={handleAmenityToggle} />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Mobílias */}
            <div>
              <FilterSectionTitle>Mobílias</FilterSectionTitle>
              <CheckboxList options={mobiliasOptions} idPrefix="mobilias" selectedOptions={filters.amenities} onChange={handleAmenityToggle} />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Bem-estar */}
            <div>
              <FilterSectionTitle>Bem-estar</FilterSectionTitle>
              <CheckboxList options={bemEstarOptions} idPrefix="bemestar" selectedOptions={filters.amenities} onChange={handleAmenityToggle} />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Eletrodomésticos */}
            <div>
              <FilterSectionTitle>Eletrodomésticos</FilterSectionTitle>
              <CheckboxList options={eletrodomesticosOptions} idPrefix="eletro" selectedOptions={filters.amenities} onChange={handleAmenityToggle} />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Cômodos */}
            <div>
              <FilterSectionTitle>Cômodos</FilterSectionTitle>
              <CheckboxList options={comodosOptions} idPrefix="comodos" selectedOptions={filters.amenities} onChange={handleAmenityToggle} />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Acessibilidade */}
            <div>
              <FilterSectionTitle>Acessibilidade</FilterSectionTitle>
              <CheckboxList options={acessibilidadeOptions} idPrefix="acessibilidade" selectedOptions={filters.amenities} onChange={handleAmenityToggle} />
            </div>

          </div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="border-t p-6 bg-white sm:justify-between flex-row items-center gap-4 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <button onClick={resetFilters} className="text-[#3b44c6] text-sm font-bold hover:underline px-2">
            Limpar filtros
          </button>
          <Button onClick={handleApplyFilters} className="flex-1 bg-[#3b44c6] hover:bg-[#2a308c] h-12 rounded-lg font-bold text-base shadow-sm">
            Ver imóveis
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}