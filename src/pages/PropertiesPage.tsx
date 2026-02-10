import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useParams, Navigate, useLocation } from "react-router-dom";
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
import { parseUrlFilters, generateUrlFilters } from "@/lib/url-filters";

const PAGE_SIZE = 12;

type SortOption = "newest" | "price_asc" | "price_desc" | "area_desc";

const PropertiesPage = () => {
  const { filters, setFilter, setManyFilters } = useFilters();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const location = useLocation();

  const routeOperation = params.operation;
  const locationSlug = params.locationSlug;
  const urlFilters = params["*"];

  // Ref to track if we have synced initial URL state to filters
  const isInitialMount = useRef(true);

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

  // ... (state defs remain) ...
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [topNeighborhoods, setTopNeighborhoods] = useState<{ neighborhood: string; count: number }[]>([]);
  const [seoLinks, setSeoLinks] = useState<{ label: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  // Sorting & Pagination
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  // Ref for filters to avoid dependency cycles in useEffect
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // 1. SYNC URL TO FILTERS (Runs when URL changes)
  useEffect(() => {
    const currentFilters = filtersRef.current;
    const newFilters: any = {};
    let hasChanges = false;

    // Operation based on Route
    if (routeOperation) {
      if (routeOperation === 'alugar' && currentFilters.operationType !== 'rent') {
        newFilters.operationType = 'rent';
        hasChanges = true;
      } else if (routeOperation === 'comprar' && currentFilters.operationType !== 'buy') {
        newFilters.operationType = 'buy';
        hasChanges = true;
      }
    }

    // Operation based on Query Params
    const queryOp = searchParams.get('operation');
    if (queryOp) {
      if (queryOp === 'rent' && currentFilters.operationType !== 'rent') {
        newFilters.operationType = 'rent';
        hasChanges = true;
      } else if (queryOp === 'buy' && currentFilters.operationType !== 'buy') {
        newFilters.operationType = 'buy';
        hasChanges = true;
      }
    }

    // Location Slug
    if (locationSlug) {
      let foundCity = null;
      if (locationSlug.endsWith('-rio-de-janeiro-rj-brasil') || locationSlug === 'rio-de-janeiro-rj-brasil') foundCity = 'Rio de Janeiro';
      else if (locationSlug.endsWith('-sao-paulo-sp-brasil') || locationSlug === 'sao-paulo-sp-brasil') foundCity = 'São Paulo';

      if (foundCity && currentFilters.searchLocation !== foundCity) {
        newFilters.searchLocation = foundCity;
        hasChanges = true;
      }
    }

    // Location Query Param (e.g. from Hero Search)
    const queryLocation = searchParams.get('location');
    if (queryLocation && queryLocation !== currentFilters.searchLocation) {
      newFilters.searchLocation = queryLocation;
      hasChanges = true;
    }

    // Parse Wildcard Filters
    if (urlFilters) {
      const parsed = parseUrlFilters(urlFilters);
      Object.keys(parsed).forEach(key => {
        // @ts-ignore
        if (JSON.stringify(currentFilters[key]) !== JSON.stringify(parsed[key])) {
          // @ts-ignore
          newFilters[key] = parsed[key];
          hasChanges = true;
        }
      });
    }

    if (hasChanges) {
      setManyFilters(newFilters);
      // Keep isInitialMount true until we stabilize
    } else {
      isInitialMount.current = false;
      fetchProperties(0, true);
    }

  }, [routeOperation, locationSlug, urlFilters, searchParams]);

  // 2. SYNC FILTERS TO URL (Canonicalization)
  useEffect(() => {
    if (isInitialMount.current) return;

    const op = filters.operationType === 'buy' ? 'comprar' : 'alugar';
    const currentLocSlug = locationSlug || "rio-de-janeiro-rj-brasil"; // Fallback if lost

    const filterSegment = generateUrlFilters(filters);

    const newPath = `/${op}/imovel/${currentLocSlug}${filterSegment ? '/' + filterSegment : ''}`;
    const currentPath = window.location.pathname;

    // Avoid redirect loop if semantic content is same
    if (currentPath !== newPath && decodeURIComponent(currentPath) !== newPath) {
      navigate(newPath, { replace: true, state: location.state });
    }

  }, [filters, locationSlug]);

  // Reset pagination when filters change
  useEffect(() => {
    if (isInitialMount.current) return;
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
      .from('seo_listing_links')
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

    // Specific Neighborhood Filter (from URL Slug)
    const urlNeighborhood = searchParams.get("neighborhood");

    if (slugNeighborhood) {
      query = query.ilike("neighborhood", `%${slugNeighborhood}%`);
      if (slugCity || filters.searchLocation) {
        query = query.ilike("city", `%${slugCity || filters.searchLocation}%`);
      }
    }
    else if (urlNeighborhood) {
      query = query.ilike("neighborhood", `%${urlNeighborhood}%`);
      if (filters.searchLocation && filters.searchLocation !== urlNeighborhood) {
        query = query.ilike("city", `%${filters.searchLocation}%`);
      }
    }
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

  // Check for Legacy Redirect
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

  // Get search coordinates directly from location state
  const searchCoordinates = location.state?.searchCoordinates as [number, number] | null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title={getSeoTitle()}
        description={getSeoDescription()}
      />
      <Header variant="search" />
      <FilterBar />

      <div className="flex-1 flex relative">
        {/* List Container - Hidden on mobile if map is shown */}
        <div
          className={`w-full lg:w-[60%] flex flex-col ${showMap ? "hidden lg:flex" : "flex"}`}
        >
          {/* Desktop Header */}
          <div className="hidden lg:flex px-6 py-4 border-b bg-background items-center justify-between">
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

          {/* Mobile Header (QuintoAndar Style) */}
          <div className="lg:hidden px-4 pt-6 pb-2 bg-background flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-[22px] font-bold text-[#1f2022] leading-tight">
                {new Intl.NumberFormat('pt-BR').format(filteredProperties.length)} imóveis
              </h1>
              <p className="text-sm text-gray-600">
                para {filters.operationType === 'rent' ? 'alugar' : 'comprar'} {filters.searchLocation ? `em ${filters.searchLocation}` : 'em São Paulo, SP'}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="text-[#1f2022]">
              <SlidersHorizontal className="h-6 w-6 rotate-90" /> {/* Using SlidersHorizontal as a sort-like icon as per reference visual style */}
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
                        const op = filters.operationType === 'buy' ? 'comprar' : 'alugar';
                        const slugify = (text: string) => text
                          .toLowerCase()
                          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                          .replace(/\s+/g, '-');

                        const neighborhoodSlug = slugify(item.neighborhood);
                        const citySlug = "rio-de-janeiro-rj-brasil";
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
                        {item.count} imóveis para<br />
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

        {/* Map Container - Shown on mobile if toggled, always on desktop */}
        <div
          className={`w-full lg:w-[40%] lg:sticky lg:top-[7.5rem] lg:h-[calc(100vh-7.5rem)] ${showMap ? "block h-[calc(100vh-140px)]" : "hidden lg:block"}`}
        >
          <MapComponent
            // @ts-ignore
            properties={filteredProperties}
            hoveredPropertyId={hoveredPropertyId}
            onMarkerClick={handleMarkerClick}
            onSearchArea={handleAreaSearch}
            centerCoordinates={searchCoordinates}
            isOpen={showMap}
          />
        </div>

        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Button
            onClick={() => {
              if (showMap) {
                // Closing map: Reset filtered properties to show all
                setFilteredProperties(properties);
                setShowMap(false);
              } else {
                // Opening map: Just toggle, MapComponent will handle bounds
                setShowMap(true);
              }
            }}
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