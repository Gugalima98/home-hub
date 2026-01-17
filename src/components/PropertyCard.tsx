import { useState } from "react";
import { Heart, ChevronLeft, ChevronRight, Bed, Car, Maximize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Property } from "@/data/mock-data";

interface PropertyCardProps {
  property: Property;
  isHighlighted?: boolean;
  onHover?: (id: string | null) => void;
  onClick?: (id: string) => void;
  variant?: "grid" | "horizontal";
}

const PropertyCard = ({ property, isHighlighted, onHover, onClick, variant = "grid" }: PropertyCardProps) => {
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
        return "Baixou";
      case "new":
        return "Novo";
      default:
        return badge;
    }
  };

  if (variant === "horizontal") {
    return (
      <motion.div
        className={`bg-card rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border ${
          isHighlighted ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md border-border"
        }`}
        onMouseEnter={() => onHover?.(property.id)}
        onMouseLeave={() => onHover?.(null)}
        onClick={() => onClick?.(property.id)}
        layout
      >
        <div className="flex">
          {/* Images */}
          <div className="relative w-48 h-36 shrink-0">
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
                  className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 hover:bg-background transition-all shadow-sm"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-background/80 hover:bg-background transition-all shadow-sm"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </>
            )}

            {/* Badges */}
            {property.badges.length > 0 && (
              <div className="absolute top-2 left-2 flex gap-1">
                {property.badges.slice(0, 1).map((badge) => (
                  <Badge
                    key={badge}
                    variant="secondary"
                    className="text-[10px] font-medium bg-background/90 text-foreground"
                  >
                    {getBadgeLabel(badge)}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-lg font-bold text-foreground">
                    {formatPrice(property.totalPrice)}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(property.price)} + Cond. {formatPrice(property.condoFee)}
                  </p>
                </div>
                <button
                  onClick={toggleFavorite}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${
                      isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                <span className="flex items-center gap-1">
                  <Maximize className="h-3 w-3" />
                  {property.area} m²
                </span>
                <span className="flex items-center gap-1">
                  <Bed className="h-3 w-3" />
                  {property.bedrooms} quartos
                </span>
                {property.parkingSpots > 0 && (
                  <span className="flex items-center gap-1">
                    <Car className="h-3 w-3" />
                    {property.parkingSpots} vaga
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {property.address} · {property.neighborhood}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid variant (original)
  return (
    <motion.div
      className="group cursor-pointer flex flex-col gap-3"
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(property.id)}
      layout
    >
      {/* Image Carousel */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>

        {/* Carousel Controls - Visible on Hover */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 hover:bg-white transition-all shadow-sm z-10"
            >
              <ChevronLeft className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 hover:bg-white transition-all shadow-sm z-10"
            >
              <ChevronRight className="h-4 w-4 text-gray-700" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${
                    index === currentImageIndex ? "bg-white scale-125" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white transition-all shadow-sm z-10 opacity-0 group-hover:opacity-100"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Badges */}
        {property.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap z-10">
            {property.badges.map((badge) => (
              <Badge
                key={badge}
                variant="secondary"
                className="text-[10px] font-bold px-2 py-0.5 bg-white text-gray-800 shadow-sm border-0"
              >
                {getBadgeLabel(badge)}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content - No padding, direct text */}
      <div className="flex flex-col gap-0.5">
        {/* Title/Description */}
        <p className="text-xs text-gray-500 line-clamp-1 font-normal mb-0.5">
          {property.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline">
          <span className="text-lg font-bold text-[#1f2022]">
            {formatPrice(property.totalPrice)}
          </span>
        </div>

        {/* Price Breakdown */}
        <p className="text-[11px] text-gray-500 mb-1.5">
          {formatPrice(property.price)} + Cond. {formatPrice(property.condoFee)}
        </p>

        {/* Features */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#3e4245] mb-1">
          <span>{property.area} m²</span>
          <span className="text-gray-300">•</span>
          <span>{property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}</span>
          <span className="text-gray-300">•</span>
          <span>{property.parkingSpots} {property.parkingSpots === 1 ? 'vaga' : 'vagas'}</span>
        </div>

        {/* Address */}
        <p className="text-[11px] text-gray-500 line-clamp-1 font-normal">
          {property.fullAddress}
        </p>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
