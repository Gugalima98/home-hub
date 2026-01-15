import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Property } from "@/data/mock-data";

interface PropertyMapProps {
  properties: Property[];
  hoveredPropertyId: string | null;
  onMarkerClick?: (id: string) => void;
  onMarkerHover?: (id: string | null) => void;
}

// Custom price marker component
const createPriceIcon = (price: number, isHighlighted: boolean) => {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);

  return L.divIcon({
    className: "custom-price-marker",
    html: `
      <div class="price-bubble ${isHighlighted ? "highlighted" : ""}">
        ${formattedPrice}
      </div>
    `,
    iconSize: [80, 32],
    iconAnchor: [40, 16],
  });
};

// Component to handle map bounds
const MapBoundsHandler = ({ properties }: { properties: Property[] }) => {
  const map = useMap();

  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(
        properties.map((p) => p.coordinates as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [properties, map]);

  return null;
};

// Individual marker component
const PropertyMarker = ({
  property,
  isHighlighted,
  onMarkerClick,
  onMarkerHover,
}: {
  property: Property;
  isHighlighted: boolean;
  onMarkerClick?: (id: string) => void;
  onMarkerHover?: (id: string | null) => void;
}) => {
  const markerRef = useRef<L.Marker>(null);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Marker
      ref={markerRef}
      position={property.coordinates}
      icon={createPriceIcon(property.totalPrice, isHighlighted)}
      eventHandlers={{
        click: () => onMarkerClick?.(property.id),
        mouseover: () => onMarkerHover?.(property.id),
        mouseout: () => onMarkerHover?.(null),
      }}
    >
      <Popup className="property-popup">
        <div className="w-48">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-28 object-cover rounded-lg mb-2"
          />
          <h4 className="font-medium text-sm text-foreground line-clamp-1">
            {property.title}
          </h4>
          <p className="text-xs text-muted-foreground mb-1">
            {property.neighborhood}
          </p>
          <p className="font-bold text-primary">
            {formatPrice(property.totalPrice)}/mês
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

const PropertyMap = ({
  properties,
  hoveredPropertyId,
  onMarkerClick,
  onMarkerHover,
}: PropertyMapProps) => {
  // Center of São Paulo
  const defaultCenter: [number, number] = [-23.5505, -46.6333];

  return (
    <div className="h-full w-full relative">
      <style>{`
        .custom-price-marker {
          background: transparent;
          border: none;
        }
        
        .price-bubble {
          background: white;
          border: 1px solid hsl(220, 13%, 91%);
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 600;
          color: hsl(0, 0%, 27%);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          white-space: nowrap;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .price-bubble:hover,
        .price-bubble.highlighted {
          background: hsl(226, 60%, 44%);
          color: white;
          border-color: hsl(226, 60%, 44%);
          transform: scale(1.1);
          z-index: 1000 !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
        }
        
        .leaflet-popup-content {
          margin: 0;
          padding: 12px;
        }
        
        .leaflet-popup-tip {
          background: white;
        }
        
        .property-popup .leaflet-popup-content-wrapper {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
      `}</style>
      
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapBoundsHandler properties={properties} />
        
        {properties.map((property) => (
          <PropertyMarker
            key={property.id}
            property={property}
            isHighlighted={hoveredPropertyId === property.id}
            onMarkerClick={onMarkerClick}
            onMarkerHover={onMarkerHover}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
