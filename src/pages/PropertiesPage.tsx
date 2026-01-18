import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map, List, Search, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import PropertyCard from "@/components/PropertyCard";
import MapComponent from "@/components/Map";
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
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  const handlePropertyHover = (id: string | null) => {
    setHoveredPropertyId(id);
  };

  const handlePropertyClick = (id: string) => {
    navigate(`/imovel/${id}`);
  };

  const handleMarkerClick = (id: string) => {
    const element = document.getElementById(`property-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHoveredPropertyId(id);
    }
  };

  // Filter properties based on map bounds
  const handleAreaSearch = (bounds: { north: number; south: number; east: number; west: number }) => {
    const visibleProperties = mockProperties.filter(property => {
      const lat = property.coordinates[0];
      const lng = property.coordinates[1];
      
      const isInsideLat = lat <= bounds.north && lat >= bounds.south;
      const isInsideLng = lng <= bounds.east && lng >= bounds.west;
      
      return isInsideLat && isInsideLng;
    });

    setFilteredProperties(visibleProperties);
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
          className={`w-full lg:w-[60%] flex flex-col ${
            showMap ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Results Count */}
          <div className="px-6 py-4 border-b bg-background flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#1f2022]">
                {filteredProperties.length} imóveis
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                à venda na área visível
              </p>
            </div>
            {/* Sort Button Placeholder - match print style */}
             <Button variant="ghost" className="text-sm font-semibold text-[#1f2022]">
                Mais relevantes
                <ChevronRight className="ml-1 h-4 w-4 rotate-90" />
             </Button>
          </div>

          {/* Property Grid */}
          <ScrollArea className="flex-1 bg-gray-50/50">
            <div className="p-4">
              {/* Property Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10 mb-8">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <div key={property.id} id={`property-${property.id}`}>
                      <PropertyCard
                        property={property}
                        isHighlighted={hoveredPropertyId === property.id}
                        onHover={handlePropertyHover}
                        onClick={handlePropertyClick}
                        variant="grid"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-gray-500">
                    <p className="text-lg font-semibold">Nenhum imóvel encontrado nesta área.</p>
                    <p className="text-sm">Mova o mapa para ver mais opções.</p>
                  </div>
                )}
              </div>

              {/* Neighborhoods Section */}
              <div className="mb-10">
                <h2 className="text-lg font-bold text-[#1f2022] mb-4">
                  Bairros recomendados em São Paulo
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {neighborhoods.map((neighborhood) => (
                    <button
                      key={neighborhood.name}
                      className="group flex flex-col items-start text-left p-5 rounded-xl bg-[#f5f5f7] hover:bg-[#ebebeb] transition-colors h-48 relative"
                    >
                      <div className="flex justify-between items-start w-full mb-1">
                        <h3 className="text-lg font-bold text-[#1f2022]">{neighborhood.name}</h3>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                      </div>
                      
                      <p className="text-sm text-gray-500 font-normal leading-relaxed mb-4">
                        {neighborhood.count} imóveis para<br/>comprar.
                      </p>
                      
                      <div className="mt-auto">
                        <p className="text-xs text-gray-500 font-medium mb-0.5">Valor médio</p>
                        <p className="text-sm font-bold text-[#1f2022]">R$ 636.500</p>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex justify-end gap-3 mt-4">
                  <button className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center hover:bg-[#ebebeb] transition-colors text-gray-400 hover:text-gray-600 disabled:opacity-50">
                     <ChevronRight className="h-5 w-5 rotate-180" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors text-[#1f2022]">
                     <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* More Properties (Unified Grid removed as filtered list is dynamic) */}

              {/* Load more */}
              <div className="w-full mb-16">
                <Button variant="default" className="w-full rounded-md h-12 bg-[#3b44c6] hover:bg-[#2a308c] font-bold text-base">
                  Ver mais
                </Button>
              </div>

              {/* SEO Links Sections */}
              <div className="space-y-12 mb-16">
                {/* Neighborhood Links */}
                <div>
                  <h3 className="text-lg font-bold text-[#1f2022] mb-6">
                    Procure pelos principais bairros em São Paulo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
                    {[
                      "Aluguel em Bela Vista", "Aluguel em Vila Andrade", "Aluguel em Jardim Paulista", "Aluguel em Vila Clementino",
                      "Aluguel em Perdizes", "Aluguel em Consolação", "Aluguel em Santana",
                      "Aluguel em Indianópolis", "Aluguel em Vila Olímpia", "Aluguel em Santo Amaro"
                    ].map((link, i) => (
                      <a key={i} href="#" className="text-sm text-gray-800 underline hover:text-blue-600 decoration-1 underline-offset-2 font-medium block">
                        {link}
                      </a>
                    ))}
                  </div>
                </div>

                {/* City Links */}
                <div>
                  <h3 className="text-lg font-bold text-[#1f2022] mb-6">
                    Amplie as chances de encontrar o lar ideal nas principais cidades
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
                    {[
                      "Aluguel em São Caetano do Sul", "Aluguel em Santo André", "Aluguel em Taboão da Serra", "Aluguel em Embu das Artes",
                      "Aluguel em Diadema", "Aluguel em São Bernardo do Campo", "Aluguel em Carapicuíba",
                      "Aluguel em Guarulhos", "Aluguel em Osasco", "Aluguel em Mauá"
                    ].map((link, i) => (
                      <a key={i} href="#" className="text-sm text-gray-800 underline hover:text-blue-600 decoration-1 underline-offset-2 font-medium block">
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="flex flex-col md:flex-row gap-8 pb-16">
                <div className="w-full md:w-1/3">
                  <h3 className="text-xl font-bold text-[#1f2022] leading-tight">
                    Perguntas frequentes sobre comprar imóvel em São Paulo
                  </h3>
                </div>
                <div className="w-full md:w-2/3">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-sm text-left hover:no-underline font-normal text-gray-800">
                        Quais são os documentos necessários para comprar imóvel em São Paulo?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        Para comprar um imóvel, geralmente são necessários documentos como RG, CPF, comprovante de residência, comprovante de renda e certidões negativas. O QuintoAndar auxilia em toda essa documentação.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-sm text-left hover:no-underline font-normal text-gray-800">
                        Quais os benefícios de comprar imóvel em São Paulo pelo QuintoAndar?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        Oferecemos fotos profissionais, tour virtual, negociação online transparente, assessoria jurídica completa e as melhores taxas de financiamento do mercado.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-sm text-left hover:no-underline font-normal text-gray-800">
                        Posso comprar imóvel em São Paulo pelo QuintoAndar utilizando o FGTS?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        Sim, é possível utilizar o saldo do FGTS para a compra do seu imóvel, desde que você e o imóvel se enquadrem nas regras do SFH (Sistema Financeiro de Habitação).
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
            <Footer />
          </ScrollArea>
        </div>

        {/* Map */}
        <div
          className={`w-full lg:w-[40%] lg:sticky lg:top-[7.5rem] lg:h-[calc(100vh-7.5rem)] ${
            showMap ? "block" : "hidden lg:block"
          }`}
        >
           <MapComponent 
            properties={mockProperties} 
            hoveredPropertyId={hoveredPropertyId} 
            onMarkerClick={handleMarkerClick}
            onSearchArea={handleAreaSearch}
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
