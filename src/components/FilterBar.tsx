import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterBarProps {
  onFiltersChange?: (filters: FilterState) => void;
}

export interface FilterState {
  propertyType: string[];
  priceRange: [number, number];
  bedrooms: number | null;
  parkingSpots: number | null;
  bathrooms: number | null;
  furnished: boolean | null;
}

const FilterBar = ({ onFiltersChange }: FilterBarProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 10000]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);
  const [selectedParking, setSelectedParking] = useState<number | null>(null);
  const [selectedBathrooms, setSelectedBathrooms] = useState<number | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [isFurnished, setIsFurnished] = useState<boolean | null>(null);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const bedroomOptions = [1, 2, 3, 4];
  const parkingOptions = [0, 1, 2, 3];
  const bathroomOptions = [1, 2, 3, 4];
  const propertyTypeOptions = ["Apartamento", "Casa", "Studio", "Cobertura", "Kitnet"];

  return (
    <div className="sticky top-16 z-40 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          {/* Property Type */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-xl gap-2 shrink-0">
                Tipo de imóvel
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 bg-popover z-50" align="start">
              <div className="space-y-3">
                <p className="font-medium text-sm">Tipo de imóvel</p>
                {propertyTypeOptions.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={propertyTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPropertyTypes([...propertyTypes, type]);
                        } else {
                          setPropertyTypes(propertyTypes.filter((t) => t !== type));
                        }
                      }}
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Price */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-xl gap-2 shrink-0">
                Preço
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-popover z-50" align="start">
              <div className="space-y-4">
                <p className="font-medium text-sm">Faixa de preço</p>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    min={500}
                    max={20000}
                    step={500}
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

          {/* Bedrooms */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-xl gap-2 shrink-0">
                Quartos
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 bg-popover z-50" align="start">
              <div className="space-y-3">
                <p className="font-medium text-sm">Quartos</p>
                <div className="flex gap-2 flex-wrap">
                  {bedroomOptions.map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedBedrooms(selectedBedrooms === num ? null : num)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
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

          {/* Parking */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-xl gap-2 shrink-0">
                Vagas
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 bg-popover z-50" align="start">
              <div className="space-y-3">
                <p className="font-medium text-sm">Vagas de garagem</p>
                <div className="flex gap-2 flex-wrap">
                  {parkingOptions.map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedParking(selectedParking === num ? null : num)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
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

          {/* Bathrooms */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-xl gap-2 shrink-0">
                Banheiros
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 bg-popover z-50" align="start">
              <div className="space-y-3">
                <p className="font-medium text-sm">Banheiros</p>
                <div className="flex gap-2 flex-wrap">
                  {bathroomOptions.map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedBathrooms(selectedBathrooms === num ? null : num)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedBathrooms === num
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

          {/* Furnished */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-xl gap-2 shrink-0">
                Mobiliado
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 bg-popover z-50" align="start">
              <div className="space-y-2">
                <button
                  onClick={() => setIsFurnished(isFurnished === true ? null : true)}
                  className={`w-full px-4 py-2 rounded-xl text-sm font-medium text-left transition-colors ${
                    isFurnished === true
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  Mobiliado
                </button>
                <button
                  onClick={() => setIsFurnished(isFurnished === false ? null : false)}
                  className={`w-full px-4 py-2 rounded-xl text-sm font-medium text-left transition-colors ${
                    isFurnished === false
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  Não mobiliado
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* More Filters */}
          <Button variant="outline" className="rounded-xl gap-2 shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
            Mais filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
