import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams, Navigate } from "react-router-dom";
import { Map, List, Search, ChevronRight, Loader2, SlidersHorizontal, Bell, ArrowUpDown, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import { FiltersSidebar } from "@/components/FiltersSidebar";
import PropertyCard, { Property } from "@/components/PropertyCard";
import MapComponent from "@/components/Map";
import { SEO } from "@/components/SEO";
import { supabase } from "@/lib/supabase";
import { useFilters } from "@/contexts/FilterContext";
import { generatePropertyUrl } from "@/lib/utils";

const PAGE_SIZE = 12;

type SortOption = "newest" | "price_asc" | "price_desc" | "area_desc";

const PropertiesPage = () => {
  const { filters, setFilter } = useFilters();
  const [searchParams] = useSearchParams();
  const { operation: routeOperation, locationSlug } = useParams();
  
  // --- DERIVED STATE (Synchronous URL Parsing) ---
  const parseLocationSlug = (slug?: string) => {
    if (!slug) return { city: null, neighborhood: null };
    
    const citySuffixes = [
        { slug: '-rio-de-janeiro-rj-brasil', city: 'Rio de Janeiro' },
        { slug: '-sao-paulo-sp-brasil', city: 'São Paulo' }
    ];

    for (const suffix of citySuffixes) {
        if (slug.endsWith(suffix.slug)) {
            const neighborhoodPart = slug.substring(0, slug.length - suffix.slug.length);
            let neighborhood = null;
            if (neighborhoodPart.length > 0) {
                neighborhood = neighborhoodPart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                neighborhood = neighborhood.replace(/\bDe\b/g, 'de').replace(/\bDa\b/g, 'da').replace(/\bDo\b/g, 'do');
            }
            return { city: suffix.city, neighborhood };
        }
    }
    
    // Fallback: Assume whole slug is city if no suffix matched
    if (slug === 'rio-de-janeiro-rj-brasil') return { city: 'Rio de Janeiro', neighborhood: null };
    if (slug === 'sao-paulo-sp-brasil') return { city: 'São Paulo', neighborhood: null };
    
    // Generic fallback
    let clean = slug.replace(/-[a-z]{2}-brasil$/, '').replace(/-brasil$/, '');
    const city = clean.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return { city, neighborhood: null };
  };

  const { city: slugCity, neighborhood: slugNeighborhood } = parseLocationSlug(locationSlug);
  // -----------------------------------------------

  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [topNeighborhoods, setTopNeighborhoods] = useState<{ neighborhood: string; count: number }[]>([]);
  const [seoLinks, setSeoLinks] = useState<{ label: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  // Removed activeNeighborhood state
  const [loadingMore, setLoadingMore] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  
  // Sorting & Pagination
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  // Sync URL params to Filter Context on mount
  useEffect(() => {
    // 1. Handle Route Params (Priority)
    if (routeOperation) {
      if (routeOperation === 'alugar' && filters.operationType !== 'rent') {
        setFilter("operationType", 'rent');
      } else if (routeOperation === 'comprar' && filters.operationType !== 'buy') {
        setFilter("operationType", 'buy');
      }
    } else {
       // Fallback: Query Params
       const op = searchParams.get("operation");
        if (op && (op === 'rent' || op === 'buy')) {
          if (filters.operationType !== op) setFilter("operationType", op);
        }
    }

    if (locationSlug) {
      // Advanced Slug Parsing (QuintoAndar Style)
      // Pattern: {neighborhood}-{city}-{state}-brasil
      
      const citySuffixes = [
        { slug: '-rio-de-janeiro-rj-brasil', city: 'Rio de Janeiro' },
        { slug: '-sao-paulo-sp-brasil', city: 'São Paulo' }
      ];

      let foundCity = null;
      let foundNeighborhood = null;

      for (const suffix of citySuffixes) {
        if (locationSlug.endsWith(suffix.slug)) {
          foundCity = suffix.city;
          // Extract neighborhood part
          const neighborhoodPart = locationSlug.substring(0, locationSlug.length - suffix.slug.length);
          if (neighborhoodPart.length > 0) {
             foundNeighborhood = neighborhoodPart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
             foundNeighborhood = foundNeighborhood.replace(/\bDe\b/g, 'de').replace(/\bDa\b/g, 'da').replace(/\bDo\b/g, 'do');
          }
          break;
        }
      }

      // If no suffix matched, check if it is just the city slug itself
      if (!foundCity) {
          if (locationSlug === 'rio-de-janeiro-rj-brasil') foundCity = 'Rio de Janeiro';
          else if (locationSlug === 'sao-paulo-sp-brasil') foundCity = 'São Paulo';
          else {
              // Generic fallback parser (assume city only if simpler)
              let clean = locationSlug.replace(/-[a-z]{2}-brasil$/, '').replace(/-brasil$/, '');
              foundCity = clean.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          }
      }

      if (foundCity && filters.searchLocation !== foundCity) {
         setFilter("searchLocation", foundCity);
      }

    } else {
        // LEGACY ROUTE HANDLER (/imoveis)
        if (!routeOperation && !locationSlug) {
             // Redirect to default friendly URL
             navigate("/alugar/imovel/rio-de-janeiro-rj-brasil", { replace: true });
             return;
        }

        // Strict Redirect for Legacy Neighborhood Query Param
        // If we are on a friendly URL BUT have a query param (e.g. /alugar/imovel/rio...?neighborhood=Ipanema)
        // We must redirect to the cleaner /alugar/imovel/ipanema-rio... URL
        const legacyNeigh = searchParams.get("neighborhood");
        if (legacyNeigh) {
            const slugify = (text: string) => text
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
                .replace(/\s+/g, '-');
            
            const nSlug = slugify(legacyNeigh);
            // Assume Rio for now as base context if extracting from query param on top of base URL
            // Or try to reuse existing locationSlug city part if available. 
            // Since we are forcing Rio as default, let's append to Rio base.
            const cityBase = "rio-de-janeiro-rj-brasil"; 
            
            const newSlug = `${nSlug}-${cityBase}`;
            const op = routeOperation || (filters.operationType === 'buy' ? 'comprar' : 'alugar');
            
            // Clean other params to avoid loops, but keep important filters if needed? 
            // User asked to ban query params for neighborhood.
            navigate(`/${op}/imovel/${newSlug}`, { replace: true });
            return;
        }

        // Fallback for query params
        const loc = searchParams.get("location");
        const neigh = searchParams.get("neighborhood");
        const targetLocation = neigh || loc;
        
        if (targetLocation) {
            if (filters.searchLocation !== targetLocation) {
                setFilter("searchLocation", targetLocation);
            }
        }
    }

    // Property Type
    const type = searchParams.get("type");
    if (type) {
      const types = type.split(",");
      if (JSON.stringify(filters.propertyTypes) !== JSON.stringify(types)) {
         setFilter("propertyTypes", types);
      }
    }
    
    // ... (rest of numeric filters remain same via searchParams for now)

  }, [searchParams, routeOperation, locationSlug, slugCity]);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchProperties(0, true);
  }, [filters, sortOrder, locationSlug]);

    const fetchTopNeighborhoods = async () => {
      const { data, error } = await supabase.rpc('get_top_neighborhoods', {
        target_city: filters.searchLocation || 'Rio de Janeiro',
        target_operation: filters.operationType
      });

      if (!error && data) {
        setTopNeighborhoods(data);
      }
    };

    const fetchSeoLinks = async () => {
      const city = filters.searchLocation || 'Rio de Janeiro';
      const op = filters.operationType || 'rent'; 

      const { data, error } = await supabase
        .from('seo_listing_links') // Changed from seo_cities
        .select('links')
        .ilike('city', `%${city}%`)
        .eq('operation', op)
        .maybeSingle();

      if (data && data.links) {
        // @ts-ignore
        setSeoLinks(data.links);
      } else {
        setSeoLinks([]);
      }
    };

    useEffect(() => {
      fetchTopNeighborhoods();
      fetchSeoLinks();
    }, [filters.searchLocation, filters.operationType]);

  const fetchProperties = async (pageIndex: number, isReset: boolean = false) => {
    if (pageIndex === 0) setLoading(true);
    else setLoadingMore(true);
    
    let query = supabase
      .from("properties")
      .select("*")
      .eq("status", "active");

    // Apply Filters
    if (filters.operationType) {
      query = query.eq("operation_type", filters.operationType);
    }

    // Specific Neighborhood Filter (Stricter)
    const urlNeighborhood = searchParams.get("neighborhood");
    
    // 1. From URL Slug (Priority)
    if (slugNeighborhood) {
       query = query.ilike("neighborhood", `%${slugNeighborhood}%`);
       if (slugCity || filters.searchLocation) {
          query = query.ilike("city", `%${slugCity || filters.searchLocation}%`);
       }
    } 
    // 2. From Query Param (Legacy)
    else if (urlNeighborhood) {
         query = query.ilike("neighborhood", `%${urlNeighborhood}%`);
         if (filters.searchLocation && filters.searchLocation !== urlNeighborhood) {
            query = query.ilike("city", `%${filters.searchLocation}%`);
         }
    } 
    // 3. Generic Search Location (Fallback)
    else if (filters.searchLocation) {
      query = query.or(`city.ilike.%${filters.searchLocation}%,neighborhood.ilike.%${filters.searchLocation}%,title.ilike.%${filters.searchLocation}%`);
    }

    if (filters.priceMin) query = query.gte("price", filters.priceMin);
    if (filters.priceMax) query = query.lte("price", filters.priceMax);
    if (filters.bedrooms) query = query.gte("bedrooms", filters.bedrooms);
    if (filters.bathrooms) query = query.gte("bathrooms", filters.bathrooms);
    if (filters.parkingSpots) query = query.gte("parking_spots", filters.parkingSpots);
    if (filters.suites) query = query.gte("suites", filters.suites);
    if (filters.areaMin) query = query.gte("area", filters.areaMin);
    if (filters.areaMax) query = query.lte("area", filters.areaMax);

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

    // Apply Sorting
    switch (sortOrder) {
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "area_desc":
        query = query.order("area", { ascending: false });
        break;
    }

    // Apply Pagination
    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching properties:", error);
    } else {
      const mappedProperties: Property[] = (data || []).map((p) => ({
        ...p,
        coordinates: [p.latitude || -23.5505, p.longitude || -46.6333],
      }));

      if (data && data.length < PAGE_SIZE) {
        setHasMore(false);
      }

      if (isReset) {
        setProperties(mappedProperties);
        setFilteredProperties(mappedProperties);
      } else {
        setProperties(prev => [...prev, ...mappedProperties]);
        setFilteredProperties(prev => [...prev, ...mappedProperties]);
      }
    }
    setLoading(false);
    setLoadingMore(false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProperties(nextPage);
  };

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

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case "newest": return "Mais recentes";
      case "price_asc": return "Menor preço";
      case "price_desc": return "Maior preço";
      case "area_desc": return "Maior área";
      default: return "Ordenar";
    }
  };

  const getSeoTitle = () => {
    const operation = filters.operationType === 'rent' ? 'Alugar' : 'Comprar';
    const type = filters.propertyTypes.length > 0 
      ? filters.propertyTypes.join(', ') + (filters.propertyTypes.length > 1 ? 's' : '')
      : 'Imóveis';
    const location = filters.searchLocation ? `em ${filters.searchLocation}` : 'em São Paulo';
    
    return `${type} para ${operation} ${location} | R7 Consultoria`;
  };

  const getSeoDescription = () => {
     const operation = filters.operationType === 'rent' ? 'alugar' : 'comprar';
     return `Encontre as melhores opções de imóveis para ${operation} em São Paulo. Casas, apartamentos e muito mais na R7 Consultoria.`;
  };

  const togglePropertyType = (type: string) => {
    if (filters.propertyTypes.includes(type)) {
      setFilter("propertyTypes", filters.propertyTypes.filter(t => t !== type));
    } else {
      setFilter("propertyTypes", [...filters.propertyTypes, type]);
    }
  };

  // --- INSTANT REDIRECT CHECK ---
  // Moved to end to prevent Hook order errors
  const legacyNeigh = searchParams.get("neighborhood");
  if (legacyNeigh) {
      const slugify = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
      const nSlug = slugify(legacyNeigh);
      const cityBase = "rio-de-janeiro-rj-brasil"; 
      const newSlug = `${nSlug}-${cityBase}`;
      let op = "alugar";
      if (routeOperation) op = routeOperation;
      else if (filters.operationType === 'buy') op = 'comprar';
      else if (searchParams.get('operation') === 'buy') op = 'comprar';
      
      return <Navigate to={`/${op}/imovel/${newSlug}`} replace />;
  }
  // ------------------------------

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title={getSeoTitle()}
        description={getSeoDescription()}
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
              
              {loading && page === 0 ? (
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
                  Bairros recomendados em {filters.searchLocation || "Rio de Janeiro"}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {topNeighborhoods.map((item) => (
                    <button
                      key={item.neighborhood}
                      onClick={() => {
                        // Generate Slug: neighborhood-city-state-brasil
                        const op = filters.operationType === 'buy' ? 'comprar' : 'alugar';
                        
                        // Basic slugify function
                        const slugify = (text: string) => text
                          .toLowerCase()
                          .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
                          .replace(/\s+/g, '-');
                        
                        const neighborhoodSlug = slugify(item.neighborhood);
                        const citySlug = "rio-de-janeiro-rj-brasil"; // Hardcoded for Rio default for now, or derive from city context
                        
                        const fullSlug = `${neighborhoodSlug}-${citySlug}`;
                        navigate(`/${op}/imovel/${fullSlug}`);
                      }}
                      className="group flex flex-col items-start text-left p-5 rounded-xl bg-[#f5f5f7] hover:bg-[#ebebeb] transition-colors h-48 relative"
                    >
                      <div className="flex justify-between items-start w-full mb-1">
                        <h3 className="text-lg font-bold text-[#1f2022] line-clamp-2">{item.neighborhood}</h3>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
                      </div>
                      
                      <p className="text-sm text-gray-500 font-normal leading-relaxed mb-4">
                        {item.count} imóveis para<br/>
                        {filters.operationType === 'rent' ? 'alugar' : 'comprar'}.
                      </p>
                      
                      <div className="mt-auto w-full">
                        <p className="text-xs text-gray-500 font-medium mb-0.5">Ver ofertas</p>
                      </div>
                    </button>
                  ))}
                  {topNeighborhoods.length === 0 && (
                     <div className="col-span-full py-4 text-gray-500 text-sm">
                        Nenhum bairro encontrado com esses critérios.
                     </div>
                  )}
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

              {seoLinks.length > 0 && (
                <div className="space-y-12 mb-16">
                  <div>
                    <h3 className="text-lg font-bold text-[#1f2022] mb-6">
                      Amplie as chances de encontrar o lar ideal em {filters.searchLocation || "sua região"} e arredores
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
                      {seoLinks.map((link, i) => (
                        <a key={i} href={link.url} className="text-sm text-gray-800 underline hover:text-blue-600 decoration-1 underline-offset-2 font-medium block">
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-8 pb-16">
                <div className="w-full md:w-1/3">
                  <h3 className="text-xl font-bold text-[#1f2022] leading-tight">
                    Perguntas frequentes sobre {filters.operationType === 'rent' ? 'alugar' : 'comprar'} imóvel em {filters.searchLocation || "sua região"}
                  </h3>
                </div>
                <div className="w-full md:w-2/3">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-sm text-left hover:no-underline font-normal text-gray-800">
                        Quais são os documentos necessários para {filters.operationType === 'rent' ? 'alugar' : 'comprar'} imóvel em {filters.searchLocation || "sua região"}?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        Para {filters.operationType === 'rent' ? 'alugar' : 'comprar'} um imóvel, geralmente são necessários documentos como RG, CPF, comprovante de residência, comprovante de renda e certidões negativas. A R7 Consultoria auxilia em toda essa documentação para garantir um processo seguro e ágil.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-sm text-left hover:no-underline font-normal text-gray-800">
                        Quais os benefícios de {filters.operationType === 'rent' ? 'alugar' : 'comprar'} imóvel em {filters.searchLocation || "sua região"} pela R7 Consultoria?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        Oferecemos atendimento personalizado, assessoria jurídica completa, negociação transparente e as melhores oportunidades do mercado, garantindo tranquilidade em cada etapa do processo.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-sm text-left hover:no-underline font-normal text-gray-800">
                        Posso {filters.operationType === 'rent' ? 'alugar' : 'comprar'} imóvel em {filters.searchLocation || "sua região"} pela R7 Consultoria utilizando o FGTS?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        Sim, é possível utilizar o saldo do FGTS para a compra do seu imóvel, desde que você e o imóvel se enquadrem nas regras do SFH (Sistema Financeiro de Habitação). Nossa equipe pode orientar você sobre todos os detalhes.
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
