import { useState } from "react";
import { Search, ChevronDown, SlidersHorizontal, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterBarProps {
  onFiltersChange?: (filters: any) => void;
}

const FilterBar = ({ onFiltersChange }: FilterBarProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([100000, 1000000]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);
  const [selectedParking, setSelectedParking] = useState<number | null>(null);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const bedroomOptions = [1, 2, 3, 4];
  const parkingOptions = [1, 2, 3, 4];
  const propertyTypeOptions = ["Apartamento", "Casa", "Studio", "Cobertura", "Kitnet"];

  return (
    <div className="sticky top-14 z-40 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 py-3">
          {/* Search Input */}
          <div className="relative flex-shrink-0 w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Qualquer lugar em São Paulo, SP"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted rounded-full border-0 focus:ring-2 focus:ring-primary/20 focus:outline-none"
              defaultValue="Qualquer lugar em São Paulo, SP"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
            {/* Comprar - Active */}
            <Button className="rounded-full h-9 px-4 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
              Comprar
              <ChevronDown className="h-3.5 w-3.5 ml-1" />
            </Button>

            {/* Valor do imóvel */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-full h-9 px-4 text-sm font-medium shrink-0">
                  Valor do imóvel
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-popover z-50" align="start">
                <div className="space-y-4">
                  <p className="font-medium text-sm">Valor do imóvel</p>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      min={50000}
                      max={5000000}
                      step={50000}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Condomínio + IPTU */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-full h-9 px-4 text-sm font-medium shrink-0">
                  Condomínio + IPTU
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 bg-popover z-50" align="start">
                <div className="space-y-3">
                  <p className="font-medium text-sm">Valor máximo</p>
                  <div className="flex gap-2 flex-wrap">
                    {["Até R$ 500", "Até R$ 1.000", "Até R$ 1.500", "Até R$ 2.000"].map((option) => (
                      <button
                        key={option}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Apartamento */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-full h-9 px-4 text-sm font-medium shrink-0">
                  Apartamento
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-popover z-50" align="start">
                <div className="space-y-3">
                  <p className="font-medium text-sm">Tipo de imóvel</p>
                  {propertyTypeOptions.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox defaultChecked={type === "Apartamento"} />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Quartos */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-full h-9 px-4 text-sm font-medium shrink-0">
                  1+ quartos
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-popover z-50" align="start">
                <div className="space-y-3">
                  <p className="font-medium text-sm">Quartos</p>
                  <div className="flex gap-2">
                    {bedroomOptions.map((num) => (
                      <button
                        key={num}
                        onClick={() => setSelectedBedrooms(selectedBedrooms === num ? null : num)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedBedrooms === num
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {num}+
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Vagas */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-full h-9 px-4 text-sm font-medium shrink-0">
                  Vagas de garagem
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-popover z-50" align="start">
                <div className="space-y-3">
                  <p className="font-medium text-sm">Vagas de garagem</p>
                  <div className="flex gap-2">
                    {parkingOptions.map((num) => (
                      <button
                        key={num}
                        onClick={() => setSelectedParking(selectedParking === num ? null : num)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedParking === num
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {num}+
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Banheiros */}
            <Button variant="outline" className="rounded-full h-9 px-4 text-sm font-medium shrink-0">
              1+
              <ChevronDown className="h-3.5 w-3.5 ml-1" />
            </Button>

            {/* Mais filtros */}
            <Button variant="outline" className="rounded-full h-9 px-4 text-sm font-medium shrink-0 gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Mais filtros
            </Button>
          </div>

          {/* Create Alert Button */}
          <Button variant="ghost" className="rounded-full h-9 px-4 text-sm font-medium shrink-0 gap-2 text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
            Criar alerta de imóvel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
