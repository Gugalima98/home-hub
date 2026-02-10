import { useState, useEffect } from "react";
import { X, MapPin, Search } from "lucide-react";
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
  const { filters, setManyFilters, resetFilters: globalReset } = useFilters();
  const [isOpen, setIsOpen] = useState(false);

  // Local state for deferred application
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync local state when sidebar opens or global filters change (if needed)
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const updateLocalFilter = (key: keyof typeof filters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  // Preço inicial para o Slider se não houver filtro definido
  const defaultMin = 500;
  const defaultMax = 30000;

  const handleOperationChange = (op: "rent" | "buy") => {
    updateLocalFilter("operationType", op);
  };

  const handlePropertyTypeToggle = (type: string, checked: boolean) => {
    const currentTypes = localFilters.propertyTypes || [];
    const newTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter((t) => t !== type);
    updateLocalFilter("propertyTypes", newTypes);
  };

  const handleAmenityToggle = (amenity: string, checked: boolean) => {
    const currentAmenities = localFilters.amenities || [];
    const newAmenities = checked
      ? [...currentAmenities, amenity]
      : currentAmenities.filter((a) => a !== amenity);
    updateLocalFilter("amenities", newAmenities);
  };

  const handleApplyFilters = () => {
    setManyFilters(localFilters);
    setIsOpen(false);
  };

  const handleResetLocal = () => {
    // Create a clean state based on global defaults or just empty
    // Using globalReset logic but locally
    const defaultFiltersState = {
      ...filters, // Keep searchLocation if any? Or reset all? 
      // Ideally explicitly reset to defaults defined in Context, 
      // but we don't have access to 'defaultFilters' export unless we export it.
      // For now, let's just use the global reset to get the defaults then sync back?
      // No, global reset would update context immediately.
      // Let's manually reset known fields to defaults relative to this sidebar
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
    } as any;

    setLocalFilters(prev => ({ ...prev, ...defaultFiltersState }));
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
              onClick={() => handleOperationChange("buy")}
              className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${localFilters.operationType === "buy"
                ? "bg-[#3b44c6] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900"
                }`}
            >
              Comprar
            </button>
            <button
              onClick={() => handleOperationChange("rent")}
              className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${localFilters.operationType === "rent"
                ? "bg-[#3b44c6] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900"
                }`}
            >
              Alugar
            </button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 bg-white">
          <div className="px-6 py-6 space-y-10 pb-32">

            {/* Localização - Added inside Filters Sidebar */}
            <div>
              <FilterSectionTitle>Localização</FilterSectionTitle>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={filters.searchLocation?.toLowerCase().includes("rio de janeiro") ? "Qualquer lugar no Rio de Janeiro, RJ" : "Qualquer lugar em São Paulo, SP"}
                  className="w-full h-14 rounded-xl border border-gray-300 bg-white pl-12 pr-4 text-base font-normal text-[#1f2022] focus:outline-none focus:border-[#3b44c6] focus:ring-1 focus:ring-[#3b44c6] transition-all"
                  value={localFilters.searchLocation}
                  onChange={(e) => updateLocalFilter("searchLocation", e.target.value)}
                />
              </div>
            </div>

            {/* Valor */}
            <div>
              <FilterSectionTitle>Valor {localFilters.operationType === "rent" ? "(Mensal)" : "(Venda)"}</FilterSectionTitle>

              <div className="flex gap-4 mb-8">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-bold text-[#1f2022]">Mínimo</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1f2022] text-sm">R$</span>
                    <Input
                      type="number"
                      value={localFilters.priceMin || ""}
                      onChange={(e) => updateLocalFilter("priceMin", e.target.value ? Number(e.target.value) : null)}
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
                      value={localFilters.priceMax || ""}
                      onChange={(e) => updateLocalFilter("priceMax", e.target.value ? Number(e.target.value) : null)}
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
                  value={[localFilters.priceMin || defaultMin, localFilters.priceMax || defaultMax]}
                  onValueChange={(val) => {
                    updateLocalFilter("priceMin", val[0]);
                    updateLocalFilter("priceMax", val[1]);
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
                      checked={localFilters.propertyTypes.includes(type)}
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
                    active={localFilters.bedrooms === (i + 1)}
                    onClick={() => updateLocalFilter("bedrooms", localFilters.bedrooms === (i + 1) ? null : (i + 1))}
                  />
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Vagas de garagem */}
            <div>
              <FilterSectionTitle>Vagas de garagem</FilterSectionTitle>
              <div className="flex gap-3 items-center">
                <FilterPill label="Tanto faz" active={localFilters.parkingSpots === null} onClick={() => updateLocalFilter("parkingSpots", null)} className="h-12 px-6" />
                {["1+", "2+", "3+"].map((num, i) => (
                  <CounterPill
                    key={num}
                    label={num}
                    active={localFilters.parkingSpots === (i + 1)}
                    onClick={() => updateLocalFilter("parkingSpots", i + 1)}
                  />
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Banheiros */}
            <div>
              <FilterSectionTitle>Banheiros</FilterSectionTitle>
              <div className="flex gap-3">
                <FilterPill label="Tanto faz" active={localFilters.bathrooms === null} onClick={() => updateLocalFilter("bathrooms", null)} className="h-12 px-6" />
                {["1+", "2+", "3+"].map((num, i) => (
                  <CounterPill
                    key={num}
                    label={num}
                    active={localFilters.bathrooms === (i + 1)}
                    onClick={() => updateLocalFilter("bathrooms", i + 1)}
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
                      value={localFilters.areaMin || ""}
                      onChange={(e) => updateLocalFilter("areaMin", e.target.value ? Number(e.target.value) : null)}
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
                      value={localFilters.areaMax || ""}
                      onChange={(e) => updateLocalFilter("areaMax", e.target.value ? Number(e.target.value) : null)}
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
                <FilterPill label="Tanto faz" active={localFilters.furnished === "any"} onClick={() => updateLocalFilter("furnished", "any")} className="h-12 px-6" />
                <FilterPill label="Sim" active={localFilters.furnished === "yes"} onClick={() => updateLocalFilter("furnished", "yes")} className="h-12 px-6" />
                <FilterPill label="Não" active={localFilters.furnished === "no"} onClick={() => updateLocalFilter("furnished", "no")} className="h-12 px-6" />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Aceita Pets */}
            <div>
              <FilterSectionTitle>Aceita pets</FilterSectionTitle>
              <div className="flex gap-3">
                <FilterPill label="Tanto faz" active={localFilters.petFriendly === "any"} onClick={() => updateLocalFilter("petFriendly", "any")} className="h-12 px-6" />
                <FilterPill label="Sim" active={localFilters.petFriendly === "yes"} onClick={() => updateLocalFilter("petFriendly", "yes")} className="h-12 px-6" />
                <FilterPill label="Não" active={localFilters.petFriendly === "no"} onClick={() => updateLocalFilter("petFriendly", "no")} className="h-12 px-6" />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Próximo ao metrô */}
            <div>
              <FilterSectionTitle>Próximo ao metrô</FilterSectionTitle>
              <div className="flex gap-3">
                <FilterPill label="Tanto faz" active={localFilters.nearSubway === "any"} onClick={() => updateLocalFilter("nearSubway", "any")} className="h-12 px-6" />
                <FilterPill label="Sim" active={localFilters.nearSubway === "yes"} onClick={() => updateLocalFilter("nearSubway", "yes")} className="h-12 px-6" />
                <FilterPill label="Não" active={localFilters.nearSubway === "no"} onClick={() => updateLocalFilter("nearSubway", "no")} className="h-12 px-6" />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Disponibilidade */}
            <div>
              <FilterSectionTitle>Disponibilidade</FilterSectionTitle>
              <div className="flex gap-3 flex-wrap">
                <FilterPill label="Tanto faz" active={localFilters.availability === "any"} onClick={() => updateLocalFilter("availability", "any")} className="h-12 px-6" />
                <FilterPill label="Imediata" active={localFilters.availability === "immediate"} onClick={() => updateLocalFilter("availability", "immediate")} className="h-12 px-6" />
                <FilterPill label="Em breve" active={localFilters.availability === "soon"} onClick={() => updateLocalFilter("availability", "soon")} className="h-12 px-6" />
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
                    active={localFilters.suites === (i + 1)}
                    onClick={() => updateLocalFilter("suites", i + 1)}
                  />
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Condomínio */}
            <div>
              <FilterSectionTitle>Condomínio</FilterSectionTitle>
              <CheckboxList options={condominioOptions} idPrefix="condominio" selectedOptions={localFilters.amenities} onChange={handleAmenityToggle} />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Comodidades */}
            <div>
              <FilterSectionTitle>Comodidades</FilterSectionTitle>
              <CheckboxList options={comodidadesOptions} idPrefix="comodidades" selectedOptions={localFilters.amenities} onChange={handleAmenityToggle} />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Mobílias */}
            <div>
              <FilterSectionTitle>Mobílias</FilterSectionTitle>
              <CheckboxList options={mobiliasOptions} idPrefix="mobilias" selectedOptions={localFilters.amenities} onChange={handleAmenityToggle} />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Bem-estar */}
            <div>
              <FilterSectionTitle>Bem-estar</FilterSectionTitle>
              <CheckboxList options={bemEstarOptions} idPrefix="bemestar" selectedOptions={localFilters.amenities} onChange={handleAmenityToggle} />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Eletrodomésticos */}
            <div>
              <FilterSectionTitle>Eletrodomésticos</FilterSectionTitle>
              <CheckboxList options={eletrodomesticosOptions} idPrefix="eletro" selectedOptions={localFilters.amenities} onChange={handleAmenityToggle} />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Cômodos */}
            <div>
              <FilterSectionTitle>Cômodos</FilterSectionTitle>
              <CheckboxList options={comodosOptions} idPrefix="comodos" selectedOptions={localFilters.amenities} onChange={handleAmenityToggle} />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Acessibilidade */}
            <div>
              <FilterSectionTitle>Acessibilidade</FilterSectionTitle>
              <CheckboxList options={acessibilidadeOptions} idPrefix="acessibilidade" selectedOptions={localFilters.amenities} onChange={handleAmenityToggle} />
            </div>

          </div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="border-t p-6 bg-white sm:justify-between flex-row items-center gap-4 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <button onClick={handleResetLocal} className="text-[#3b44c6] text-sm font-bold hover:underline px-2">
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