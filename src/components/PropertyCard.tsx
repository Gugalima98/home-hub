import { useState } from "react";
import { Heart, ChevronLeft, ChevronRight, Bed, Bath, Car, Maximize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/data/mock-data";

interface PropertyCardProps {
  property: Property;
  isHighlighted?: boolean;
  onHover?: (id: string | null) => void;
  onClick?: (id: string) => void;
}

const PropertyCard = ({ property, isHighlighted, onHover, onClick }: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(property.isFavorite);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const getBadgeLabel = (badge: string) => {
    switch (badge) {
      case "exclusive":
        return "Exclusivo";
      case "priceDropped":
        return "Baixou o preço";
      case "new":
        return "Novo";
      default:
        return badge;
    }
  };

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "exclusive":
        return "default";
      case "priceDropped":
        return "destructive";
      case "new":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <motion.div
      className={`bg-card rounded-2xl overflow-hidden shadow-card cursor-pointer transition-all duration-300 ${
        isHighlighted ? "ring-2 ring-primary shadow-lg scale-[1.02]" : "hover:shadow-lg"
      }`}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(property.id)}
      layout
    >
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>

        {/* Carousel Controls */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-background transition-all shadow-sm"
              style={{ opacity: 1 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-background transition-all shadow-sm"
              style={{ opacity: 1 }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-background" : "bg-background/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all shadow-sm"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-foreground"
            }`}
          />
        </button>

        {/* Badges */}
        {property.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {property.badges.map((badge) => (
              <Badge
                key={badge}
                variant={getBadgeVariant(badge) as any}
                className="text-xs font-medium"
              >
                {getBadgeLabel(badge)}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-foreground">
            {formatPrice(property.totalPrice)}
          </span>
          <span className="text-sm text-muted-foreground">/mês</span>
        </div>

        {/* Price Breakdown */}
        <p className="text-xs text-muted-foreground mb-3">
          Aluguel {formatPrice(property.price)} + Condomínio {formatPrice(property.condoFee)}
        </p>

        {/* Title */}
        <h3 className="font-medium text-foreground mb-1 line-clamp-1">
          {property.title}
        </h3>

        {/* Address */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
          {property.neighborhood}, {property.city}
        </p>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            <span>{property.area} m²</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms}</span>
          </div>
          {property.parkingSpots > 0 && (
            <div className="flex items-center gap-1">
              <Car className="h-4 w-4" />
              <span>{property.parkingSpots}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
