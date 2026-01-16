import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map, List, Search, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import PropertyCard from "@/components/PropertyCard";
import { mockProperties } from "@/data/mock-data";
import { SEO } from "@/components/SEO";

// Neighborhoods data
const neighborhoods = [
  { name: "Mooca", count: "3.798", type: "apartamentos" },
  { name: "Tatuapé", count: "3.654", type: "apartamentos" },
  { name: "Santana", count: "3.060", type: "apartamentos" },
  { name: "Vila Mariana", count: "3.014", type: "apartamentos" },
  { name: "Paraíso", count: "1.974", type: "apartamentos" },
];

// Placeholder map component
const MapPlaceholder = ({ 
  properties, 
  hoveredPropertyId 
}: { 
  properties: typeof mockProperties; 
  hoveredPropertyId: string | null;
}) => {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="h-full w-full bg-[#e5e3df] relative overflow-hidden">
      {/* Simulated map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e8e6e2] to-[#d9d7d3]">
        {/* Grid lines to simulate streets */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <defs>
            <pattern id="streets" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#ccc" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#streets)" />
        </svg>
        
        {/* Main roads */}
        <div className="absolute top-1/4 left-0 right-0 h-1 bg-white/60" />
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-[#f5deb3]/60" />
        <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-white/60" />
        <div className="absolute left-2/3 top-0 bottom-0 w-2 bg-[#f5deb3]/60" />
      </div>
      
      {/* Property markers */}
      <div className="absolute inset-4">
        {properties.slice(0, 8).map((property, index) => {
          const isHighlighted = hoveredPropertyId === property.id;
          const positions = [
            { top: "15%", left: "20%" },
            { top: "25%", left: "55%" },
            { top: "35%", left: "75%" },
            { top: "45%", left: "30%" },
            { top: "55%", left: "60%" },
            { top: "65%", left: "15%" },
            { top: "70%", left: "45%" },
            { top: "80%", left: "70%" },
          ];
          
          return (
            <div
              key={property.id}
              className={`absolute transition-all duration-200 cursor-pointer ${
                isHighlighted ? "z-20 scale-110" : "z-10"
              }`}
              style={positions[index]}
            >
              <div
                className={`px-2 py-1 rounded-md text-xs font-bold shadow-md border transition-all ${
                  isHighlighted
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
                }`}
              >
                {formatPrice(property.totalPrice)}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-1">
        <button className="w-8 h-8 bg-background rounded shadow-sm flex items-center justify-center text-foreground hover:bg-muted text-lg font-light">
          +
        </button>
        <button className="w-8 h-8 bg-background rounded shadow-sm flex items-center justify-center text-foreground hover:bg-muted text-lg font-light">
          −
        </button>
      </div>
      
      {/* Search in area button */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <Button className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-sm h-9">
          <Search className="h-4 w-4 mr-2" />
          Buscar nesta área
        </Button>
      </div>
    </div>
  );
};

const PropertiesPage = () => {
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const handlePropertyHover = (id: string | null) => {
    setHoveredPropertyId(id);
  };

  const handlePropertyClick = (id: string) => {
    navigate(`/imovel/${id}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Imóveis para Alugar e Comprar em São Paulo" 
        description="Confira milhares de imóveis para alugar e comprar em São Paulo. Apartamentos, casas, studios e muito mais."
      />
      <Header variant="search" />
      <FilterBar />

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Property List */}
        <div
          className={`w-full lg:w-[55%] flex flex-col ${
            showMap ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Results Count */}
          <div className="px-4 py-3 border-b bg-background">
            <h1 className="text-lg font-bold text-foreground">
              61.122 apartamentos
            </h1>
            <p className="text-sm text-muted-foreground">
              Anúncios em São Paulo, SP
            </p>
          </div>

          {/* Property Grid */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              {/* Property Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {mockProperties.slice(0, 6).map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isHighlighted={hoveredPropertyId === property.id}
                    onHover={handlePropertyHover}
                    onClick={handlePropertyClick}
                    variant="grid"
                  />
                ))}
              </div>

              {/* Neighborhoods Section */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Bairros recomendados em São Paulo
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {neighborhoods.map((neighborhood) => (
                    <button
                      key={neighborhood.name}
                      className="text-left p-3 rounded-xl border bg-card hover:border-primary hover:shadow-sm transition-all"
                    >
                      <h3 className="font-semibold text-foreground text-sm">{neighborhood.name}</h3>
                      <p className="text-xs text-muted-foreground">{neighborhood.count} {neighborhood.type}</p>
                      <p className="text-xs text-muted-foreground">para comprar</p>
                      <p className="text-xs text-primary mt-2 flex items-center gap-1">
                        Mais imóveis
                        <ChevronRight className="h-3 w-3" />
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* More Properties */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {mockProperties.slice(6).map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isHighlighted={hoveredPropertyId === property.id}
                    onHover={handlePropertyHover}
                    onClick={handlePropertyClick}
                    variant="horizontal"
                  />
                ))}
              </div>

              {/* CTA Section */}
              <div className="bg-secondary rounded-2xl p-6 mb-8 text-center">
                <div className="flex justify-center mb-4">
                  <Search className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Não encontrou o imóvel que procura?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Crie um alerta e receba notificações sobre novos imóveis.
                </p>
                <Button className="rounded-full">
                  Criar alerta de imóveis
                </Button>
              </div>

              {/* Load more */}
              <div className="text-center pb-8">
                <Button variant="outline" className="rounded-full px-8">
                  Ver mais
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Map */}
        <div
          className={`w-full lg:w-[45%] lg:sticky lg:top-[7.5rem] lg:h-[calc(100vh-7.5rem)] ${
            showMap ? "block" : "hidden lg:block"
          }`}
        >
          {/* Mobile Back Button */}
          {showMap && (
            <div className="lg:hidden absolute top-4 left-4 z-[1000]">
              <Button
                variant="secondary"
                className="rounded-full shadow-lg"
                onClick={() => setShowMap(false)}
              >
                <List className="h-4 w-4 mr-2" />
                Ver lista
              </Button>
            </div>
          )}

          <MapPlaceholder
            properties={mockProperties}
            hoveredPropertyId={hoveredPropertyId}
          />
        </div>

        {/* Mobile Map Toggle Button */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Button
            onClick={() => setShowMap(!showMap)}
            className="rounded-full shadow-xl px-6 py-6 bg-primary hover:bg-primary/90"
          >
            {showMap ? (
              <>
                <List className="h-5 w-5 mr-2" />
                Ver lista
              </>
            ) : (
              <>
                <Map className="h-5 w-5 mr-2" />
                Ver mapa
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
