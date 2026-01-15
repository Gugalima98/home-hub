import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface ActiveFilter {
  type: string;
  label: string;
  color: "blue" | "pink" | "gray";
}

interface FilterBarProps {
  onFiltersChange?: (filters: any) => void;
}

const FilterBar = ({ onFiltersChange }: FilterBarProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 10000]);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([
    { type: "transaction", label: "Comprar", color: "blue" },
  ]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const removeFilter = (filterToRemove: ActiveFilter) => {
    setActiveFilters(activeFilters.filter(f => f.label !== filterToRemove.label));
  };

  const addFilter = (filter: ActiveFilter) => {
    if (!activeFilters.find(f => f.label === filter.label)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const getFilterColor = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-primary text-primary-foreground";
      case "pink":
        return "bg-pink-100 text-pink-700 border-pink-200";
      default:
        return "bg-muted text-foreground border-border";
    }
  };

  const bedroomOptions = [1, 2, 3, 4, 5];
  const propertyTypeOptions = ["Apartamento", "Casa", "Studio", "Cobertura", "Kitnet"];

  return (
    <div className="sticky top-16 z-40 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          {/* Active Filters Pills */}
          {activeFilters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => removeFilter(filter)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors shrink-0 ${getFilterColor(filter.color)}`}
            >
              {filter.label}
              <X className="h-3.5 w-3.5" />
            </button>
          ))}

          {/* Property Type */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full gap-1.5 shrink-0 h-8">
                Apartamentos
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 bg-popover z-50" align="start">
              <div className="space-y-3">
                <p className="font-medium text-sm">Tipo de imóvel</p>
                {propertyTypeOptions.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      onCheckedChange={(checked) => {
                        if (checked) {
                          addFilter({ type: "propertyType", label: type, color: "gray" });
                        }
                      }}
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Bedrooms */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full gap-1.5 shrink-0 h-8">
                Quartos
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-popover z-50" align="start">
              <div className="space-y-3">
                <p className="font-medium text-sm">Quartos</p>
                <div className="flex gap-2 flex-wrap">
                  {bedroomOptions.map((num) => (
                    <button
                      key={num}
                      onClick={() => addFilter({ type: "bedrooms", label: `+${num} quartos`, color: "pink" })}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Price */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full gap-1.5 shrink-0 h-8">
                Preço
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-popover z-50" align="start">
              <div className="space-y-4">
                <p className="font-medium text-sm">Faixa de preço</p>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    min={100000}
                    max={2000000}
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

          {/* Scheduling */}
          <Button variant="outline" size="sm" className="rounded-full gap-1.5 shrink-0 h-8">
            Agendamento
          </Button>

          {/* More Filters */}
          <Button variant="outline" size="sm" className="rounded-full gap-1.5 shrink-0 h-8">
            + Filtros
          </Button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Order button */}
          <Button variant="ghost" size="sm" className="rounded-full gap-1.5 shrink-0 h-8 text-primary">
            Ordenar: Destaques
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
