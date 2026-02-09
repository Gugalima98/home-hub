import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Maximize,
  Bed,
  Bath,
  Car,
  Building,
  Dog,
  Sofa,
  Check,
  ChevronLeft,
  ChevronRight,
  Camera,
  Map as MapIcon,
  Loader2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard, { Property } from "@/components/PropertyCard";
import { SEO } from "@/components/SEO";
import { supabase } from "@/lib/supabase";
import { PropertyGallery } from "@/components/PropertyGallery";

const PropertyDetailPage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState<'available' | 'unavailable'>('available');

  // Fetch Property
  useEffect(() => {
    const fetchProperty = async () => {
      if (!code) return;
      setLoading(true);

      let query = supabase.from("properties").select("*");

      // UUID Regex Check
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code);

      if (isUuid) {
        query = query.eq("id", code);
      } else {
        query = query.eq("code", code);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error("Error fetching property:", error);
      } else if (data && data.status !== 'active') {
        // Se não for ativo, trata como não encontrado
        setProperty(null);
      } else {
        setProperty(data);
      }
      setLoading(false);
    };

    fetchProperty();
  }, [code]);

  // Flatten Images Helper
  const imageList = useMemo(() => {
    if (!property?.images) return ["/placeholder.svg"];
    const allImages: string[] = [];
    const categories = ["Fachada", "Sala", "Cozinha", "Quartos", "Banheiros", "Varanda", "Garagem", "Quintal", "Vista", "Área de Serviço", "Planta", "Outros"];

    categories.forEach(cat => {
      if (property.images[cat]) {
        allImages.push(...property.images[cat]);
      }
    });

    Object.keys(property.images).forEach(cat => {
      if (!categories.includes(cat)) {
        allImages.push(...(property.images[cat] || []));
      }
    });

    return allImages.length > 0 ? allImages : ["/placeholder.svg"];
  }, [property]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SEO title="Imóvel não encontrado" />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Imóvel não encontrado</h1>
          <Button onClick={() => navigate("/imoveis")}>Voltar para busca</Button>
        </div>
      </div>
    );
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalMonthly = (property.total_price) || (property.price + (property.condo_fee || 0) + (property.iptu || 0) + (property.fire_insurance || 0) + (property.service_fee || 0));

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);

  const availableItems = property.available_items || [];
  const unavailableItems = property.unavailable_items || [];
  const condoAmenities = property.condo_amenities || [];

  // JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": property.title,
    "description": property.description,
    "image": imageList,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BRL",
      "price": property.price,
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "url": window.location.href
    },
    "brand": {
      "@type": "Brand",
      "name": "R7 Consultoria"
    }
  };

  if (showAllPhotos) {
    return (
      <PropertyGallery
        property={property}
        isOpen={showAllPhotos}
        onClose={() => setShowAllPhotos(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title={property.title}
        description={property.description ? `${property.description.substring(0, 150)}...` : property.title}
        image={imageList[0]}
        schema={schema}
      />
      <Header />

      <div className="bg-white border-b border-gray-100 pb-20 lg:pb-0"> {/* Added padding bottom for mobile sticky footer */}
        <div className="h-auto lg:h-[600px] flex flex-col lg:flex-row gap-6 bg-white overflow-hidden">

          {/* Desktop Sidebar - Hidden on Mobile */}
          <div className="hidden lg:flex lg:w-[36%] shrink-0 bg-[#f8f9fa] p-6 lg:p-8 flex-col justify-between overflow-y-auto relative z-10">
            <div>
              <h1 className="text-3xl lg:text-[2.5rem] font-bold text-[#1f2022] leading-tight mb-8">
                {property.property_type} para {property.operation_type === 'rent' ? 'alugar' : 'comprar'} com {property.area}m², {property.bedrooms} quartos
              </h1>
            </div>

            <div className="space-y-8 mb-4">
              <div>
                <p className="text-3xl font-bold text-[#1f2022] mb-1">
                  {property.operation_type === 'rent' ? 'Aluguel' : 'Venda'} {formatPrice(property.price)}
                </p>
                <p className="text-lg text-gray-500 font-medium">
                  Total {formatPrice(totalMonthly)}
                </p>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1 h-12 rounded-full bg-[#3b44c6] hover:bg-[#2a308c] text-white font-bold text-sm px-6">
                  Agendar visita
                </Button>
                <Button variant="outline" className="flex-1 h-12 rounded-full border-gray-200 text-[#1f2022] font-bold text-sm hover:bg-gray-50 px-6">
                  Fazer proposta
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop Image Grid - Hidden on Mobile */}
          <div className="flex-1 relative bg-gray-100 hidden lg:block overflow-hidden group">
            <img
              src={imageList[0]}
              alt="Foto Principal"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute top-6 left-6 flex gap-3">
              <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Share2 className="h-5 w-5 text-gray-700" />
              </button>
              <button
                className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-700'}`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="absolute bottom-6 left-6 flex gap-3">
              <Button
                variant="secondary"
                className="rounded-full bg-white shadow-sm hover:bg-gray-50 text-[#1f2022] font-bold h-10 px-5 gap-2 text-xs"
                onClick={() => setShowAllPhotos(true)}
              >
                <Camera className="h-4 w-4" />
                {imageList.length} Fotos
              </Button>
              <Button
                variant="secondary"
                className="rounded-full bg-white shadow-sm hover:bg-gray-50 text-[#1f2022] font-bold h-10 px-5 gap-2 text-xs"
              >
                <MapIcon className="h-4 w-4" />
                Mapa
              </Button>
            </div>
          </div>

          <div className="flex-1 relative bg-gray-100 hidden lg:block overflow-hidden group">
            <img
              src={imageList[1] || imageList[0]}
              alt="Foto Secundária"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute bottom-6 right-6 flex gap-3">
              <button
                onClick={prevImage}
                className="w-10 h-10 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="w-10 h-10 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Mobile Layout Redesign */}
          <div className="lg:hidden relative w-full bg-gray-100">
            {/* Image Carousel */}
            <div className="relative h-[65vh] w-full"> {/* Increased heavily based on user feedback */}
              <img
                src={imageList[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />

              {/* Gradient Overlay for Text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointers-events-none" />

              {/* Top Overlays */}
              <div className="absolute top-4 left-4 z-20">
                <button
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 rounded-full bg-white/90 shadow-sm flex items-center justify-center backdrop-blur-sm"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-700" />
                </button>
              </div>

              <div className="absolute top-4 right-4 z-20 flex gap-3">
                <button className="w-10 h-10 rounded-full bg-white/90 shadow-sm flex items-center justify-center backdrop-blur-sm">
                  <Share2 className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  className="w-10 h-10 rounded-full bg-white/90 shadow-sm flex items-center justify-center backdrop-blur-sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/90 shadow-sm flex items-center justify-center backdrop-blur-sm">
                  <div className="flex flex-col gap-[3px] items-center justify-center h-full w-full">
                    <div className="w-1 h-1 rounded-full bg-gray-700" />
                    <div className="w-1 h-1 rounded-full bg-gray-700" />
                    <div className="w-1 h-1 rounded-full bg-gray-700" />
                  </div>
                </button>
              </div>


              {/* Overlay Text - Title over Image */}
              <div className="absolute top-20 left-4 right-4 z-20">
                <h1 className="text-white text-2xl font-bold leading-tight drop-shadow-md">
                  {property.property_type} para {property.operation_type === 'rent' ? 'alugar' : 'comprar'} com {property.area}m², {property.bedrooms} quartos e {property.parking_spots} vagas
                </h1>
              </div>

              {/* Bottom Pills */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 w-max">
                <button
                  onClick={() => setShowAllPhotos(true)}
                  className="h-9 px-5 bg-white rounded-full flex items-center gap-2 text-xs font-bold text-[#1f2022] shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  {imageList.length} Fotos
                </button>
                <button className="h-9 px-5 bg-white rounded-full flex items-center gap-2 text-xs font-bold text-[#1f2022] shadow-md hover:bg-gray-50 transition-colors">
                  <Building className="h-4 w-4" />
                  Vídeo
                </button>
                <button className="h-9 px-5 bg-white rounded-full flex items-center gap-2 text-xs font-bold text-[#1f2022] shadow-md hover:bg-gray-50 transition-colors">
                  <MapPin className="h-4 w-4" />
                  Mapa
                </button>
              </div>
            </div>

            {/* Mobile Property Info (Restored) */}
            <div className="px-5 pt-6 pb-2 bg-white">
              <div className="mb-6">
                <span className="inline-block bg-[#1f2022] text-white text-[11px] font-bold px-2.5 py-1 rounded-[4px] mb-3">
                  Exclusivo
                </span>

                <div className="flex flex-col gap-1">
                  <p className="text-3xl font-bold text-[#1f2022] tracking-tight">
                    {property.operation_type === 'rent' ? 'Aluguel' : 'Venda'} {formatPrice(property.price)}
                  </p>

                  <p className="text-gray-500 text-lg mt-1">
                    Total {formatPrice(totalMonthly)}
                  </p>

                  <Button
                    className="w-full rounded-full h-12 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-base shadow-sm gap-2 mt-4"
                    onClick={() => {
                      const message = `Olá, gostaria de saber mais sobre o imóvel: ${property.title} (Cód. ${property.code})\nLink: ${window.location.href}`;
                      window.open(`https://wa.me/5511978519899?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-5 h-5 filter brightness-0 invert" alt="WhatsApp" />
                    Chamar no WhatsApp
                  </Button>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="font-bold text-[#1f2022] mb-3 text-sm">Ou deixe seu contato:</p>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const data = {
                        name: formData.get('name') as string,
                        email: formData.get('email') as string,
                        phone: formData.get('phone') as string,
                        property_id: property.id,
                      };

                      try {
                        const { error } = await supabase.from('leads').insert(data);
                        if (error) throw error;

                        toast({
                          title: "Sucesso!",
                          description: "Contato enviado com sucesso! Entraremos em contato em breve.",
                          variant: "default",
                        });

                        (e.target as HTMLFormElement).reset();
                      } catch (error) {
                        console.error(error);
                        toast({
                          title: "Erro",
                          description: "Erro ao enviar contato. Tente novamente.",
                          variant: "destructive",
                        });
                      }
                    }} className="space-y-3">
                      <input
                        name="name"
                        placeholder="Seu nome"
                        required
                        className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-[#3b44c6] bg-gray-50"
                      />
                      <input
                        name="email"
                        type="email"
                        placeholder="Seu e-mail"
                        required
                        className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-[#3b44c6] bg-gray-50"
                      />
                      <input
                        name="phone"
                        placeholder="Seu telefone"
                        required
                        className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-[#3b44c6] bg-gray-50"
                      />
                      <Button type="submit" className="w-full rounded-full h-10 bg-white border border-[#3b44c6] text-[#3b44c6] hover:bg-gray-50 font-bold text-sm shadow-sm">
                        Enviar contato
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Info Section (QuintoAndar Style) */}
            <div className="mt-0 bg-white pb-4">

              {/* Map Card (QuintoAndar Style - Exact Visual Match) */}
              <div className="relative w-full h-[180px] bg-[#eef2f5] mb-6 shadow-sm border-b border-gray-100 overflow-hidden">
                {/* Reliable Map Background (Local SVG from QuintoAndar) */}
                <div className="absolute inset-0">
                  <img
                    src="/map-pattern.svg"
                    className="w-full h-full object-cover"
                    alt="Map Background"
                  />
                </div>

                {/* Floating White Card - Centered & Rounded */}
                <div className="absolute top-1/2 left-5 right-5 -translate-y-1/2 bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between border border-gray-100">
                  <div className="flex-1 min-w-0 pr-3">
                    <h3 className="text-[17px] font-bold text-[#1f2022] leading-snug truncate mb-0.5">{property.address}</h3>
                    <p className="text-[14px] text-gray-500 font-normal truncate">{property.neighborhood}, {property.city}</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-[#1f2022] stroke-[1.5] shrink-0" />
                </div>
              </div>


              {/* Content Container (with padding) */}
              <div className="px-5">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-4 font-normal overflow-x-auto whitespace-nowrap">
                  <span>Início</span>
                  <ChevronRight className="h-3 w-3" />
                  <span>...</span>
                  <ChevronRight className="h-3 w-3" />
                  <span>Imóvel {property.code}</span>
                </div>

                {/* Publish Date */}
                <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-6">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Publicado há 9 horas</span>
                </div>

                {/* Large Title */}
                <h1 className="text-3xl font-bold text-[#1f2022] leading-tight mb-8">
                  {property.property_type} para {property.operation_type === 'rent' ? 'alugar' : 'comprar'} com {property.area}m², {property.bedrooms} quartos e {property.parking_spots} vagas
                </h1>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 text-sm text-[#1f2022]">
                  <div className="flex justify-between">
                    <span>{property.operation_type === 'rent' ? 'Aluguel' : 'Valor de venda'}</span>
                    <span className="font-medium text-gray-600">{formatPrice(property.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">Condomínio <span className="text-gray-400 text-[10px] border border-gray-400 rounded-full w-3 h-3 flex items-center justify-center">i</span></span>
                    <span className="font-medium text-gray-600">{property.condo_fee ? formatPrice(property.condo_fee) : 'Incluso'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">IPTU <span className="text-gray-400 text-[10px] border border-gray-400 rounded-full w-3 h-3 flex items-center justify-center">i</span></span>
                    <span className="font-medium text-gray-600">{property.iptu ? formatPrice(property.iptu) : formatPrice(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">Seguro incêndio <span className="text-gray-400 text-[10px] border border-gray-400 rounded-full w-3 h-3 flex items-center justify-center">i</span></span>
                    <span className="font-medium text-gray-600">{formatPrice(property.fire_insurance || 199)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">Taxa de serviço <span className="text-gray-400 text-[10px] border border-gray-400 rounded-full w-3 h-3 flex items-center justify-center">i</span></span>
                    <span className="font-medium text-gray-600">{formatPrice(property.service_fee || 310)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-8">
                  <span className="text-lg font-bold text-[#1f2022]">Total</span>
                  <span className="text-xl font-bold text-[#1f2022]">{formatPrice(totalMonthly)}</span>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Maximize className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                    <span className="text-sm text-[#1f2022] font-medium">{property.area} m²</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bed className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                    <div className="flex flex-col">
                      <span className="text-sm text-[#1f2022] font-medium">{property.bedrooms} quartos</span>
                      {property.suites > 0 && <span className="text-xs text-gray-500">({property.suites} suíte)</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                    <span className="text-sm text-[#1f2022] font-medium">{property.bathrooms} banheiros</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Car className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                    <span className="text-sm text-[#1f2022] font-medium">{property.parking_spots} vagas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sofa className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                    <span className="text-sm text-[#1f2022] font-medium">{property.furnished ? 'Mobiliado' : 'Sem mobília'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Dog className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                    <span className="text-sm text-[#1f2022] font-medium">{property.pet_friendly ? 'Aceita pet' : 'Não aceita pet'}</span>
                  </div>
                </div>

                {/* Mobile Description & Amenities Section (QuintoAndar Style) */}
                <div className="mb-10">
                  <div className="mb-8 border-t border-gray-100 pt-6">
                    <p className={`text-[#1f2022] leading-relaxed text-[15px] ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                      {property.description}
                    </p>
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-[#3b44c6] text-sm font-bold mt-2 hover:underline flex items-center gap-1"
                    >
                      <ChevronRight className={`h-3 w-3 transition-transform ${showFullDescription ? '-rotate-90' : 'rotate-90'}`} />
                      {showFullDescription ? 'Ver menos' : 'Ver mais'}
                    </button>
                  </div>

                  <div className="mb-8">
                    <div className="flex gap-6 border-b border-gray-200 mb-6">
                      <button
                        className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'available' ? 'text-[#1f2022]' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('available')}
                      >
                        Itens disponíveis
                        {activeTab === 'available' && (
                          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1f2022]" />
                        )}
                      </button>
                      <button
                        className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'unavailable' ? 'text-[#1f2022]' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('unavailable')}
                      >
                        Itens indisponíveis
                        {activeTab === 'unavailable' && (
                          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1f2022]" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {activeTab === 'available' ? (
                        [...availableItems, ...condoAmenities].map((item, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-[#1f2022] shrink-0 mt-0.5" />
                            <span className="text-sm text-[#1f2022]">{item}</span>
                          </div>
                        ))
                      ) : (
                        unavailableItems.length > 0 ? (
                          unavailableItems.map((item: string) => (
                            <div key={item} className="flex items-start gap-3">
                              <div className="relative w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                                <div className="w-4 h-4 rounded-full border border-gray-300" />
                                <div className="absolute w-[1px] h-5 bg-gray-300 rotate-45" />
                              </div>
                              <span className="text-sm text-gray-400 line-through decoration-gray-300">{item}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-400 italic">Nenhum item indisponível listado.</p>
                        )
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white flex-1 lg:pb-0"> {/* Adjusted padding */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">

          <div className="flex flex-col lg:flex-row gap-12 items-start">

            <div className="flex-1 min-w-0">

              <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 mb-6 font-normal overflow-x-auto whitespace-nowrap">
                <Link to="/" className="hover:underline">Início</Link>
                <ChevronRight className="h-3 w-3" />
                <Link to="/imoveis" className="hover:underline">{property.city}</Link>
                <ChevronRight className="h-3 w-3" />
                <Link to="/imoveis" className="hover:underline">{property.neighborhood}</Link>
                <ChevronRight className="h-3 w-3" />
                <span>{property.address}</span>
                <ChevronRight className="h-3 w-3" />
                <span>Cód. {property.code}</span>
              </div>

              {/* Title Section (Desktop Only - Mobile handles it above) */}
              <div className="hidden lg:block mb-8">
                <h1 className="text-3xl font-bold text-[#1f2022]">
                  {property.title}
                </h1>
              </div>

              <div className="hidden lg:block relative h-24 bg-gray-100 rounded-xl overflow-hidden mb-8 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow group">
                <div className="absolute inset-0 opacity-20 bg-[url('https://maps.wikimedia.org/img/osm-intl,13,a,a,270x100.png')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-white/60" />

                <div className="relative h-full flex items-center justify-between px-6 z-10">
                  <div>
                    <h2 className="text-lg font-bold text-[#1f2022]">{property.address}</h2>
                    <p className="text-sm text-gray-600">{property.neighborhood}, {property.city}</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-[#1f2022] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="hidden lg:grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4 mb-8">
                <div className="flex items-center gap-3">
                  <Maximize className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                  <span className="text-sm text-[#1f2022]">{property.area} m²</span>
                </div>
                <div className="flex items-center gap-3">
                  <Bed className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                  <div className="flex flex-col">
                    <span className="text-sm text-[#1f2022]">{property.bedrooms} quartos</span>
                    {property.suites > 0 && <span className="text-xs text-gray-500">({property.suites} suíte)</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                  <span className="text-sm text-[#1f2022]">{property.bathrooms} banheiros</span>
                </div>
                <div className="flex items-center gap-3">
                  <Car className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                  <span className="text-sm text-[#1f2022]">{property.parking_spots} vaga</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sofa className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                  <span className="text-sm text-[#1f2022]">{property.furnished ? 'Mobiliado' : 'Sem mobília'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Dog className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                  <span className="text-sm text-[#1f2022]">{property.pet_friendly ? 'Aceita pet' : 'Não aceita pet'}</span>
                </div>
              </div>

              <div className="hidden lg:flex gap-3 mb-8">
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Cód. {property.code}</span>
                <span className="flex items-center gap-1 text-gray-500 text-xs">
                  <div className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center text-[8px]">L</div>
                  Publicado há 3 dias
                </span>
              </div>

              <div className="hidden lg:block mb-10">
                <p className={`text-gray-700 leading-relaxed text-[15px] ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                  {property.description}
                </p>
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-[#3b44c6] text-sm font-bold mt-2 hover:underline flex items-center gap-1"
                >
                  {showFullDescription ? 'Ver menos' : 'Ver mais'}
                  <ChevronRight className={`h-3 w-3 transition-transform ${showFullDescription ? '-rotate-90' : 'rotate-90'}`} />
                </button>
              </div>

              <div className="hidden lg:block mb-8">
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-lg font-bold text-[#1f2022] mb-4">Comodidades</h3>
                    <div className="space-y-3">
                      {[...availableItems, ...condoAmenities].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-[#1f2022] shrink-0 mt-0.5" />
                          <span className="text-sm text-[#1f2022]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {unavailableItems.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-400 mb-4">Itens indisponíveis</h3>
                      <div className="space-y-3">
                        {unavailableItems.slice(0, 8).map((item: string) => (
                          <div key={item} className="flex items-start gap-3">
                            <div className="relative w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                              <div className="w-4 h-4 rounded-full border border-gray-300" />
                              <div className="absolute w-[1px] h-5 bg-gray-300 rotate-45" />
                            </div>
                            <span className="text-sm text-gray-400 line-through decoration-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Desktop Sidebar (Price Card) - Hidden on mobile because we use Sticky Footer */}
            <div className="hidden lg:block lg:w-[340px] shrink-0">
              <div className="sticky top-24">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{property.operation_type === 'rent' ? 'Aluguel' : 'Valor'}</span>
                      <span className="text-gray-600">{formatPrice(property.price)}</span>
                    </div>
                    {property.condo_fee > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">Condomínio</span>
                        <span className="text-gray-600">{formatPrice(property.condo_fee)}</span>
                      </div>
                    )}
                    {property.iptu > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">IPTU</span>
                        <span className="text-gray-600">{formatPrice(property.iptu)}</span>
                      </div>
                    )}
                    {property.fire_insurance > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">Seguro Incêndio</span>
                        <span className="text-gray-600">{formatPrice(property.fire_insurance)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-bold text-lg text-[#1f2022]">Total</span>
                    <span className="font-bold text-xl text-[#1f2022]">{formatPrice(totalMonthly)}</span>
                  </div>

                  <div className="space-y-4 mb-6 mt-6">
                    <Button
                      className="w-full rounded-full h-12 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-base shadow-sm gap-2"
                      onClick={() => {
                        const message = `Olá, gostaria de saber mais sobre o imóvel: ${property.title} (Cód. ${property.code})\nLink: ${window.location.href}`;
                        window.open(`https://wa.me/5511978519899?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-5 h-5 filter brightness-0 invert" alt="WhatsApp" />
                      Conversar no WhatsApp
                    </Button>

                    <div className="pt-4 border-t border-gray-100">
                      <p className="font-bold text-[#1f2022] mb-3 text-sm">Ou deixe seu contato:</p>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const data = {
                          name: formData.get('name') as string,
                          email: formData.get('email') as string,
                          phone: formData.get('phone') as string,
                          property_id: property.id,
                        };

                        try {
                          const { error } = await supabase.from('leads').insert(data);
                          if (error) throw error;

                          toast({
                            title: "Sucesso!",
                            description: "Contato enviado com sucesso! Entraremos em contato em breve.",
                            variant: "default",
                          });

                          (e.target as HTMLFormElement).reset();
                        } catch (error) {
                          console.error(error);
                          toast({
                            title: "Erro",
                            description: "Erro ao enviar contato. Tente novamente.",
                            variant: "destructive",
                          });
                        }
                      }} className="space-y-3">
                        <input
                          name="name"
                          placeholder="Seu nome"
                          id="desktop-name"
                          required
                          className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-[#3b44c6]"
                        />
                        <input
                          name="email"
                          type="email"
                          placeholder="Seu e-mail"
                          id="desktop-email"
                          required
                          className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-[#3b44c6]"
                        />
                        <input
                          name="phone"
                          placeholder="Seu telefone"
                          id="desktop-phone"
                          required
                          className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-[#3b44c6]"
                        />
                        <Button type="submit" className="w-full rounded-full h-12 bg-[#3b44c6] hover:bg-[#2a308c] text-white font-bold text-base shadow-sm">
                          Tenho interesse
                        </Button>
                      </form>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      className="flex-1 h-10 rounded-full bg-[#f3f5f6] hover:bg-[#e5e7eb] flex items-center justify-center gap-2 text-xs font-bold text-[#1f2022] transition-colors"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      Favoritar
                    </button>
                    <button className="flex-1 h-10 rounded-full bg-[#f3f5f6] hover:bg-[#e5e7eb] flex items-center justify-center gap-2 text-xs font-bold text-[#1f2022] transition-colors">
                      <Share2 className="h-4 w-4" />
                      Compartilhar
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer Removed as requested */}



      <Footer />
    </div >
  );
};

export default PropertyDetailPage;
