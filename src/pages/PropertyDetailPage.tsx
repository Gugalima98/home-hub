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
  Map
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
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
    <div className="min-h-screen bg-background">
      <SEO 
        title={property.title} 
        description={`${property.description.substring(0, 150)}...`}
        image={property.images[0]}
      />
      <Header />

      {/* Hero Gallery Section */}
      <div className="relative bg-foreground">
        {/* Desktop Gallery Grid */}
        <div className="hidden md:block container mx-auto px-4 py-4">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] rounded-xl overflow-hidden">
            {/* Main large image */}
            <div className="col-span-2 row-span-2 relative">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
                <p className="text-3xl font-bold">{formatPrice(property.totalPrice)}</p>
              </div>
              {/* Action buttons */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Button variant="secondary" size="icon" className="rounded-full bg-white/90 hover:bg-white" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className={`rounded-full ${isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/90 hover:bg-white'}`}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
            
            {/* Small images */}
            {property.images.slice(1, 5).map((img, index) => (
              <div key={index} className="relative overflow-hidden">
                <img src={img} alt={`Foto ${index + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Gallery action buttons */}
          <div className="flex gap-2 mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full bg-background"
              onClick={() => setShowAllPhotos(true)}
            >
              <Camera className="h-4 w-4 mr-2" />
              Ver {property.images.length} Fotos
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-background">
              <Play className="h-4 w-4 mr-2" />
              Vídeo
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-background">
              <Map className="h-4 w-4 mr-2" />
              Mapa
            </Button>
          </div>
        </div>

        {/* Mobile Gallery Carousel */}
        <div className="md:hidden relative h-72">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation */}
          <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 rounded-full">
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 rounded-full">
            <ChevronRight className="h-5 w-5 text-white" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 rounded-full text-white text-sm">
            {currentImageIndex + 1}/{property.images.length}
          </div>

          {/* Back button */}
          <button onClick={() => navigate(-1)} className="absolute top-4 left-4 p-2 bg-black/30 rounded-full">
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <div className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Início</Link>
              {" > "}
              <Link to="/imoveis" className="hover:text-foreground">São Paulo</Link>
              {" > "}
              <span>{property.neighborhood}</span>
            </div>

            {/* Property Header - Mobile */}
            <div className="md:hidden mb-6">
              <h1 className="text-xl font-bold mb-2">{property.title}</h1>
              <p className="text-2xl font-bold text-primary mb-2">{formatPrice(property.totalPrice)}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{property.fullAddress}</span>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block mb-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{property.fullAddress}</span>
              </div>
            </div>

            {/* Quick Info Icons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-8 p-4 bg-muted rounded-xl">
              <div className="flex flex-col items-center gap-1 text-center">
                <Maximize className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{property.area} m²</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <Bed className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{property.bedrooms} quartos</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <Bath className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{property.bathrooms} banheiro</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <Car className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{property.parkingSpots} vaga</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{property.floor}º andar</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <Dog className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{property.petFriendly ? 'Aceita pets' : 'Não aceita'}</span>
              </div>
            </div>

            {/* Furnished Badge */}
            <div className="flex gap-2 mb-6">
              {property.furnished && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                  <Sofa className="h-4 w-4" />
                  Mobiliado
                </span>
              )}
              {property.petFriendly && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  <Dog className="h-4 w-4" />
                  Aceita Pets
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-3">Sobre o imóvel</h2>
              <p className={`text-muted-foreground ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                {property.description}
              </p>
              <button 
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-primary text-sm font-medium mt-2"
              >
                {showFullDescription ? 'Ver menos' : 'Ver mais'}
              </button>
            </div>

            {/* Available/Unavailable Items */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Itens do imóvel</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Available */}
                <div>
                  <h3 className="font-medium text-green-700 mb-3">Itens disponíveis</h3>
                  <div className="space-y-2">
                    {property.availableItems.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Unavailable */}
                <div>
                  <h3 className="font-medium text-muted-foreground mb-3">Itens indisponíveis</h3>
                  <div className="space-y-2">
                    {property.unavailableItems.slice(0, 8).map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <XIcon className="h-4 w-4" />
                        <span className="line-through">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Condominium Amenities */}
            {property.condoAmenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4">Condomínio</h2>
                <div className="flex flex-wrap gap-2">
                  {property.condoAmenities.map((amenity) => (
                    <span key={amenity} className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Map Section Placeholder */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Localização</h2>
              <div className="h-64 bg-muted rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">{property.fullAddress}</p>
                </div>
              </div>
            </div>

            {/* Similar Properties */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Similares na mesma região</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {similarProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    onClick={() => navigate(`/imovel/${prop.id}`)}
                    variant="grid"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Sticky Price Calculator */}
          <div className="lg:w-[360px] shrink-0">
            <div className="lg:sticky lg:top-20">
              <div className="bg-card border rounded-2xl p-6 shadow-card">
                {/* Price header */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Valor estimado</p>
                  <p className="text-3xl font-bold text-foreground">{formatPrice(property.totalPrice)}</p>
                  <p className="text-sm text-muted-foreground">
                    Parcelas a partir de <span className="font-medium">{formatPrice(property.totalPrice / 360)}</span>/mês
                  </p>
                </div>

                <div className="border-t pt-4 mb-4">
                  {/* Cost breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aluguel</span>
                      <span className="font-medium">{formatPrice(property.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Condomínio</span>
                      <span className="font-medium">{formatPrice(property.condoFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IPTU</span>
                      <span className="font-medium">{formatPrice(property.iptu)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seguro incêndio</span>
                      <span className="font-medium">{formatPrice(property.fireInsurance)}</span>
                    </div>
                    {property.serviceFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxa de serviço</span>
                        <span className="font-medium">{formatPrice(property.serviceFee)}</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between pt-3 mt-3 border-t">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-lg">{formatPrice(totalMonthly)}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button className="w-full rounded-xl h-12 text-base">
                    Agendar visita
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl h-12 text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Conversar no WhatsApp
                  </Button>
                </div>

                {/* Share & Favorite */}
                <div className="flex justify-center gap-4 mt-4 pt-4 border-t">
                  <button 
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    Favoritar
                  </button>
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
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
  );
};

export default PropertyDetailPage;
