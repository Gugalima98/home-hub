import { useState } from "react";
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
  X as XIcon,
  ChevronLeft,
  ChevronRight,
  Camera,
  Play,
  Map as MapIcon,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { mockProperties } from "@/data/mock-data";
import { SEO } from "@/components/SEO";

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const property = mockProperties.find((p) => p.id === id);
  const similarProperties = mockProperties.filter((p) => p.id !== id).slice(0, 4);

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

  const totalMonthly = property.price + property.condoFee + property.iptu + property.fireInsurance + property.serviceFee;

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);

  // Full screen gallery modal
  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <SEO title={`Fotos - ${property.title}`} />
        <div className="flex items-center justify-between p-4 text-white">
          <button onClick={() => setShowAllPhotos(false)} className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
          <span className="text-sm">{currentImageIndex + 1} / {property.images.length}</span>
        </div>
        <div className="flex-1 flex items-center justify-center relative">
          <button onClick={prevImage} className="absolute left-4 p-2 bg-white/20 rounded-full hover:bg-white/30">
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <img
            src={property.images[currentImageIndex]}
            alt={`Foto ${currentImageIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />
          <button onClick={nextImage} className="absolute right-4 p-2 bg-white/20 rounded-full hover:bg-white/30">
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className="p-4 flex gap-2 overflow-x-auto">
          {property.images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`shrink-0 w-20 h-14 rounded overflow-hidden ${index === currentImageIndex ? 'ring-2 ring-white' : 'opacity-60'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title={property.title} 
        description={`${property.description.substring(0, 150)}...`}
        image={property.images[0]}
      />
      <Header />

      {/* Hero Gallery Section - New 3-Column Layout */}
      <div className="bg-white border-b border-gray-100">
        <div className="h-[550px] lg:h-[600px] flex flex-col lg:flex-row gap-6 bg-white overflow-hidden">
          
          {/* Column 1: Info (Left) - Fixed 36% width */}
          <div className="lg:w-[36%] shrink-0 bg-[#f8f9fa] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto relative z-10">
            <div>
              <h1 className="text-3xl lg:text-[2.5rem] font-bold text-[#1f2022] leading-tight mb-8">
                Apartamento para alugar com {property.area}m², {property.bedrooms} quartos e {property.parkingSpots} vagas
              </h1>
            </div>

            <div className="space-y-8 mb-4">
              <div>
                <p className="text-3xl font-bold text-[#1f2022] mb-1">
                  Aluguel {formatPrice(property.price)}
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

          {/* Column 2: Image 1 (Center) */}
          <div className="flex-1 relative bg-gray-100 hidden lg:block overflow-hidden group">
            <img
              src={property.images[0]}
              alt="Foto Principal"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Floating Actions (Top Left) */}
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

            {/* Floating Actions (Bottom) */}
            <div className="absolute bottom-6 left-6 flex gap-3">
              <Button 
                variant="secondary" 
                className="rounded-full bg-white shadow-sm hover:bg-gray-50 text-[#1f2022] font-bold h-10 px-5 gap-2 text-xs"
                onClick={() => setShowAllPhotos(true)}
              >
                <Camera className="h-4 w-4" />
                {property.images.length} Fotos
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

          {/* Column 3: Image 2 (Right) */}
          <div className="flex-1 relative bg-gray-100 hidden lg:block overflow-hidden group">
            <img
              src={property.images[1] || property.images[0]}
              alt="Foto Secundária"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Navigation Arrows (Bottom Right) */}
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

          {/* Mobile Gallery (Carousel style) replaces col 2 & 3 on small screens */}
          <div className="lg:hidden relative h-[300px] w-full bg-gray-100">
             <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            {/* Mobile Nav */}
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 rounded-full text-white">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 rounded-full text-white">
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
              {currentImageIndex + 1}/{property.images.length}
            </div>
          </div>

        </div>
      </div>

      {/* Content Below Hero */}
      <div className="bg-white flex-1">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Main Details (Left) */}
            <div className="flex-1 min-w-0">
              
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-normal overflow-x-auto whitespace-nowrap">
                <Link to="/" className="hover:underline">Início</Link>
                <ChevronRight className="h-3 w-3" />
                <Link to="/imoveis" className="hover:underline">São Paulo</Link>
                <ChevronRight className="h-3 w-3" />
                <Link to="/imoveis" className="hover:underline">{property.neighborhood}</Link>
                <ChevronRight className="h-3 w-3" />
                <span>{property.address}</span>
                <ChevronRight className="h-3 w-3" />
                <span>Imóvel {property.id}</span>
              </div>

              {/* Map Banner Card */}
              <div className="relative h-24 bg-gray-100 rounded-xl overflow-hidden mb-8 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow group">
                {/* Fake Map Background Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://maps.wikimedia.org/img/osm-intl,13,a,a,270x100.png')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-white/60" />
                
                <div className="relative h-full flex items-center justify-between px-6 z-10">
                  <div>
                    <h2 className="text-lg font-bold text-[#1f2022]">{property.address}</h2>
                    <p className="text-sm text-gray-600">{property.neighborhood}, São Paulo</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-[#1f2022] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Icons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4 mb-8">
                <div className="flex items-center gap-3">
                  <Maximize className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                  <span className="text-sm text-[#1f2022]">{property.area} m²</span>
                </div>
                <div className="flex items-center gap-3">
                  <Bed className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                  <div className="flex flex-col">
                    <span className="text-sm text-[#1f2022]">{property.bedrooms} quartos</span>
                    <span className="text-xs text-gray-500">(1 suíte)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                  <span className="text-sm text-[#1f2022]">{property.bathrooms} banheiros</span>
                </div>
                <div className="flex items-center gap-3">
                  <Car className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                  <span className="text-sm text-[#1f2022]">{property.parkingSpots} vaga</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                  <span className="text-sm text-[#1f2022]">Até 3º andar</span>
                </div>
                <div className="flex items-center gap-3">
                  <Dog className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                  <span className="text-sm text-[#1f2022]">{property.petFriendly ? 'Aceita pet' : 'Não aceita pet'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sofa className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                  <span className="text-sm text-[#1f2022]">{property.furnished ? 'Mobiliado' : 'Sem mobília'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-[#1f2022] stroke-[1.5]" />
                  <span className="text-sm text-[#1f2022]">Não próx. metrô</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-3 mb-8">
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Imóvel {property.id}</span>
                <span className="flex items-center gap-1 text-gray-500 text-xs">
                  <div className="w-3 h-3 rounded-full border border-gray-400 flex items-center justify-center text-[8px]">L</div>
                  Publicado há 3 dias
                </span>
              </div>

              {/* Description */}
              <div className="mb-10">
                <p className={`text-gray-700 leading-relaxed text-[15px] ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                  {property.description} Imóvel aconchegante para alugar com {property.bedrooms} quartos e {property.bathrooms} banheiros no total. Este imóvel está bem equipado. O condomínio é bem equipado com diversas instalações e fica localizado em {property.address} no bairro {property.neighborhood} em São Paulo.
                </p>
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-[#3b44c6] text-sm font-bold mt-2 hover:underline flex items-center gap-1"
                >
                  {showFullDescription ? 'Ver menos' : 'Ver mais'}
                  <ChevronRight className={`h-3 w-3 transition-transform ${showFullDescription ? '-rotate-90' : 'rotate-90'}`} />
                </button>
              </div>

              {/* Amenities Grid */}
              <div className="mb-8">
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Available */}
                  <div>
                    <h3 className="text-lg font-bold text-[#1f2022] mb-4">Itens disponíveis</h3>
                    <div className="space-y-3">
                      {property.availableItems.map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-[#1f2022] shrink-0 mt-0.5" />
                          <span className="text-sm text-[#1f2022]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Unavailable */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-400 mb-4">Itens indisponíveis</h3>
                    <div className="space-y-3">
                      {property.unavailableItems.slice(0, 8).map((item) => (
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
                </div>
              </div>

              {/* Similar Properties in Left Column */}
              <div className="mt-16 border-t pt-10">
                <h2 className="text-xl font-bold text-[#1f2022] mb-6">Similares na mesma região</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {similarProperties.slice(0, 3).map((prop) => (
                    <div key={prop.id} className="w-full">
                       <PropertyCard
                        property={prop}
                        onClick={() => navigate(`/imovel/${prop.id}`)}
                        variant="grid"
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons (Bottom Right) */}
                <div className="flex justify-end gap-3">
                   <button className="w-12 h-12 rounded-full bg-[#f3f5f6] hover:bg-[#e5e7eb] flex items-center justify-center transition-colors">
                      <ChevronLeft className="h-6 w-6 text-gray-400" />
                   </button>
                   <button className="w-12 h-12 rounded-full bg-[#f3f5f6] hover:bg-[#e5e7eb] flex items-center justify-center transition-colors">
                      <ChevronRight className="h-6 w-6 text-[#1f2022]" />
                   </button>
                </div>
              </div>

            </div>

            {/* Right Sidebar - Sticky Price Calculator */}
            <div className="lg:w-[340px] shrink-0">
               <div className="sticky top-24">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    {/* Cost breakdown */}
                    <div className="space-y-3 text-sm mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Aluguel</span>
                        <span className="text-gray-600">{formatPrice(property.price)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          Condomínio <span className="w-3.5 h-3.5 rounded-full border border-gray-400 text-gray-400 text-[9px] flex items-center justify-center">i</span>
                        </span>
                        <span className="text-gray-600">{formatPrice(property.condoFee)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          IPTU <span className="w-3.5 h-3.5 rounded-full border border-gray-400 text-gray-400 text-[9px] flex items-center justify-center">i</span>
                        </span>
                        <span className="text-gray-600">{formatPrice(property.iptu)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          Seguro incêndio <span className="w-3.5 h-3.5 rounded-full border border-gray-400 text-gray-400 text-[9px] flex items-center justify-center">i</span>
                        </span>
                        <span className="text-gray-600">{formatPrice(property.fireInsurance)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          Taxa de serviço <span className="w-3.5 h-3.5 rounded-full border border-gray-400 text-gray-400 text-[9px] flex items-center justify-center">i</span>
                        </span>
                        <span className="text-gray-600">{formatPrice(property.serviceFee)}</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="font-bold text-lg text-[#1f2022]">Total</span>
                      <span className="font-bold text-xl text-[#1f2022]">{formatPrice(totalMonthly)}</span>
                    </div>
                    
                    <a href="#" className="text-xs text-gray-500 hover:underline flex items-center gap-1 mb-6">
                      Entenda se é um bom negócio <ChevronRight className="h-3 w-3" />
                    </a>

                    {/* CTA Buttons */}
                    <div className="space-y-3 mb-6">
                      <Button className="w-full rounded-full h-12 bg-[#3b44c6] hover:bg-[#2a308c] text-white font-bold text-base shadow-sm">
                        Agendar visita
                      </Button>
                      <Button className="w-full rounded-full h-12 bg-[#f3f5f6] hover:bg-[#e5e7eb] text-[#1f2022] font-bold text-base border-none shadow-none">
                        Fazer proposta
                      </Button>
                    </div>

                    {/* Evaluation Link */}
                    <div className="mb-6">
                      <a href="#" className="text-xs font-bold text-[#1f2022] hover:underline flex items-center gap-1 mb-1">
                        Faça sua avaliação <ChevronRight className="h-3 w-3" />
                      </a>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        E descubra em dois minutos se você está pré-aprovado para alugar esse imóvel.
                      </p>
                    </div>

                    {/* Footer Actions */}
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

          {/* SEO Links Section */}
          <div className="mt-16 border-t border-gray-100 pt-10 space-y-10 pb-10">
            
            {/* Group 1 */}
            <div>
              <h3 className="font-bold text-[#1f2022] mb-3">Veja outros:</h3>
              <div className="flex flex-wrap gap-x-1 gap-y-2 text-sm text-gray-600 leading-relaxed">
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamento para alugar em São Paulo</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamento para alugar em {property.neighborhood}</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamento com 2 quartos para alugar em {property.neighborhood}</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamento com 3 quartos para alugar em {property.neighborhood}</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamento barato para alugar em {property.neighborhood}</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamento moderno para alugar</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamento pequeno para alugar</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamento decorado para alugar</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamento com varanda gourmet para alugar</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamento com garagem para alugar</a>
              </div>
            </div>

            {/* Group 2 */}
            <div>
              <h3 className="font-bold text-[#1f2022] mb-3">Outros tipos de imóveis em Bairro {property.neighborhood}:</h3>
              <div className="flex flex-wrap gap-x-1 gap-y-2 text-sm text-gray-600 leading-relaxed">
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Casas para alugar em {property.neighborhood}</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Studios e kitnets para alugar em {property.neighborhood}</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Casas em condomínio para alugar em {property.neighborhood}</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Imóveis para alugar em {property.neighborhood}</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamento à venda em {property.neighborhood}</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Casa à venda em {property.neighborhood}</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Casa em condomínio à venda em {property.neighborhood}</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Imóvel à venda em {property.neighborhood}</a>
              </div>
            </div>

            {/* Group 3 */}
            <div>
              <h3 className="font-bold text-[#1f2022] mb-3">Bairros próximos:</h3>
              <div className="flex flex-wrap gap-x-1 gap-y-2 text-sm text-gray-600 leading-relaxed">
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamentos para alugar em Vila Dalva</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamentos para alugar em Cidade São Francisco</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamentos para alugar em Jardim Ester Yolanda</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamentos para alugar em Adalgisa</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamentos para alugar em Parque dos Principes</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamentos para alugar em Vila Yara</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamentos para alugar em Umuarama</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamentos para alugar em Jaguaré</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamentos para alugar em Jardim D'abril</a>
                <span>•</span>
                <a href="#" className="hover:underline hover:text-[#3b44c6]">Apartamentos para alugar em Jardim Raposo Tavares</a>
              </div>
            </div>

          </div>

        </div>
      </div>

      <Footer />

    </div>
  );
};

export default PropertyDetailPage;