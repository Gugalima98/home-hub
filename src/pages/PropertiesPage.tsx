import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Map, List, Search, ChevronRight, Loader2 } from "lucide-react";
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
import PropertyCard, { Property } from "@/components/PropertyCard";
import MapComponent from "@/components/Map";
import { SEO } from "@/components/SEO";
import { supabase } from "@/lib/supabase";
import { useFilters } from "@/contexts/FilterContext";
import { generatePropertyUrl } from "@/lib/utils";

// Neighborhoods data (Static for now)
const neighborhoods = [
  { name: "Mooca", count: "3.798", type: "apartamentos" },
  { name: "Tatuapé", count: "3.654", type: "apartamentos" },
  { name: "Santana", count: "3.060", type: "apartamentos" },
  { name: "Vila Mariana", count: "3.014", type: "apartamentos" },
  { name: "Paraíso", count: "1.974", type: "apartamentos" },
];

const PropertiesPage = () => {
  const { filters, setFilter } = useFilters();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  // Sync URL params to Filter Context on mount
  useEffect(() => {
    // Operation
    const op = searchParams.get("operation");
    if (op && (op === 'rent' || op === 'buy')) {
      if (filters.operationType !== op) setFilter("operationType", op);
    }

    // Location
    const loc = searchParams.get("location");
    const neigh = searchParams.get("neighborhood");
    const targetLocation = neigh || loc;
    if (targetLocation && filters.searchLocation !== targetLocation) {
        setFilter("searchLocation", targetLocation);
    }

    // Property Type
    const type = searchParams.get("type");
    if (type) {
      // Assuming single type for now, or check if it's already in the array
      // If the URL has type=Apartamento, we want filters.propertyTypes to be ["Apartamento"]
      const types = type.split(","); // Support comma separated
      if (JSON.stringify(filters.propertyTypes) !== JSON.stringify(types)) {
         setFilter("propertyTypes", types);
      }
    }

    // Numeric Filters
    const priceMin = searchParams.get("priceMin");
    if (priceMin) setFilter("priceMin", Number(priceMin));

    const priceMax = searchParams.get("priceMax");
    if (priceMax) setFilter("priceMax", Number(priceMax));

    const bedrooms = searchParams.get("bedrooms");
    if (bedrooms) setFilter("bedrooms", Number(bedrooms));
    
    const bathrooms = searchParams.get("bathrooms");
    if (bathrooms) setFilter("bathrooms", Number(bathrooms));

    const parkingSpots = searchParams.get("parkingSpots");
    if (parkingSpots) setFilter("parkingSpots", Number(parkingSpots));

    // Boolean/String Filters
    const furnished = searchParams.get("furnished");
    if (furnished) setFilter("furnished", furnished);

    const petFriendly = searchParams.get("petFriendly");
    if (petFriendly) setFilter("petFriendly", petFriendly);

    const nearSubway = searchParams.get("nearSubway");
    if (nearSubway) setFilter("nearSubway", nearSubway);

  }, [searchParams]); // Run when URL params change

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (filters.operationType) {
        query = query.eq("operation_type", filters.operationType);
      }

      if (filters.searchLocation) {
        query = query.or(`city.ilike.%${filters.searchLocation}%,neighborhood.ilike.%${filters.searchLocation}%,title.ilike.%${filters.searchLocation}%`);
      }

      if (filters.priceMin) {
        query = query.gte("price", filters.priceMin);
      }

      if (filters.priceMax) {
        query = query.lte("price", filters.priceMax);
      }

      if (filters.bedrooms) {
        query = query.gte("bedrooms", filters.bedrooms);
      }

      if (filters.bathrooms) {
        query = query.gte("bathrooms", filters.bathrooms);
      }

      if (filters.parkingSpots) {
        query = query.gte("parking_spots", filters.parkingSpots);
      }

      if (filters.suites) {
        query = query.gte("suites", filters.suites);
      }

      if (filters.areaMin) {
        query = query.gte("area", filters.areaMin);
      }

      if (filters.areaMax) {
        query = query.lte("area", filters.areaMax);
      }

      // Availability logic (assuming status or specific field)
      if (filters.availability === "immediate") {
        // Example logic: status is active and available_from is null or past
        // For now, assuming standard active status covers immediate availability unless specified otherwise
      }

      if (filters.propertyTypes.length > 0) {
        query = query.in("property_type", filters.propertyTypes);
      }

      if (filters.furnished === "yes") query = query.eq("furnished", true);
      if (filters.furnished === "no") query = query.eq("furnished", false);

      if (filters.petFriendly === "yes") query = query.eq("pet_friendly", true);
      if (filters.petFriendly === "no") query = query.eq("pet_friendly", false);

      if (filters.nearSubway === "yes") query = query.eq("near_subway", true);
      if (filters.nearSubway === "no") query = query.eq("near_subway", false);

      if (filters.amenities.length > 0) {
        query = query.contains("condo_amenities", filters.amenities);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        const mappedProperties: Property[] = (data || []).map((p) => ({
          ...p,
          coordinates: [p.latitude || -23.5505, p.longitude || -46.6333],
        }));
        setProperties(mappedProperties);
        setFilteredProperties(mappedProperties);
      }
      setLoading(false);
    };

    fetchProperties();
  }, [filters]);

  const handlePropertyHover = (id: string | null) => {
    setHoveredPropertyId(id);
  };

  // NAVEGAÇÃO ATUALIZADA AQUI
  const handlePropertyClick = (id: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      // @ts-ignore
      navigate(generatePropertyUrl(property));
    }
  };

  const handleMarkerClick = (id: string) => {
    const element = document.getElementById(`property-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHoveredPropertyId(id);
    }
  };

  const handleAreaSearch = (bounds: { north: number; south: number; east: number; west: number }) => {
    const visibleProperties = properties.filter(property => {
      // @ts-ignore
      const lat = property.coordinates[0];
       // @ts-ignore
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

      <div className="flex-1 flex relative">
        <div
          className={`w-full lg:w-[60%] flex flex-col ${
            showMap ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="px-6 py-4 border-b bg-background flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#1f2022]">
                {filteredProperties.length} imóveis
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                à venda na área visível
              </p>
            </div>
             <Button variant="ghost" className="text-sm font-semibold text-[#1f2022]">
                Mais relevantes
                <ChevronRight className="ml-1 h-4 w-4 rotate-90" />
             </Button>
          </div>

          <ScrollArea className="flex-1 bg-gray-50/50">
            <div className="p-4">
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-gray-500">Carregando imóveis...</p>
                </div>
              ) : (
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
                      <p className="text-lg font-semibold">Nenhum imóvel encontrado.</p>
                      <p className="text-sm">Tente ajustar os filtros ou o mapa.</p>
                    </div>
                  )}
                </div>
              )}

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
                
                <div className="flex justify-end gap-3 mt-4">
                  <button className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center hover:bg-[#ebebeb] transition-colors text-gray-400 hover:text-gray-600 disabled:opacity-50">
                     <ChevronRight className="h-5 w-5 rotate-180" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors text-[#1f2022]">
                     <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="w-full mb-16">
                <Button variant="default" className="w-full rounded-md h-12 bg-[#3b44c6] hover:bg-[#2a308c] font-bold text-base">
                  Ver mais
                </Button>
              </div>

              <div className="space-y-12 mb-16">
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

        <div
          className={`w-full lg:w-[40%] lg:sticky lg:top-[7.5rem] lg:h-[calc(100vh-7.5rem)] ${
            showMap ? "block" : "hidden lg:block"
          }`}
        >
           <MapComponent 
            // @ts-ignore
            properties={filteredProperties} 
            hoveredPropertyId={hoveredPropertyId} 
            onMarkerClick={handleMarkerClick}
            onSearchArea={handleAreaSearch}
           />
        </div>

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