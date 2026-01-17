import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Property } from '@/data/mock-data';
import { useEffect } from 'react';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Fix for default Leaflet icons in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom Cluster Icon (Blue Circle with Count)
const createClusterCustomIcon = (cluster: any) => {
  return L.divIcon({
    html: `<div class="flex items-center justify-center w-full h-full bg-[#3b44c6] text-white font-bold rounded-full border-2 border-white shadow-md text-sm">
             ${cluster.getChildCount()}
           </div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(40, 40, true),
  });
};

// Custom Marker component to display price
const createCustomIcon = (price: number, isHovered: boolean) => {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(price);

  const bgColor = isHovered ? 'bg-[#1e2476]' : 'bg-[#3b44c6]';
  const scale = isHovered ? 'scale-110 z-[1000]' : 'scale-100';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="${bgColor} text-white font-bold text-xs px-2 py-1 rounded-md shadow-md border border-white whitespace-nowrap transition-all duration-200 ${scale} cursor-pointer">
            ${formattedPrice}
           </div>`,
    iconSize: [80, 30],
    iconAnchor: [40, 15], // Center anchor
  });
};

// Component to update map center when properties change
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center, map]);
  return null;
}

interface MapComponentProps {
  properties: Property[];
  hoveredPropertyId?: string | null;
  onMarkerClick?: (id: string) => void;
}

export default function MapComponent({ properties, hoveredPropertyId, onMarkerClick }: MapComponentProps) {
  const navigate = useNavigate();
  // Default center (São Paulo) if no properties
  const defaultCenter: [number, number] = [-23.55052, -46.633308];
  const center = properties.length > 0 ? properties[0].coordinates : defaultCenter;

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false} // We can add custom zoom control later
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // Light theme closer to QuintoAndar
        />
        
        <MapUpdater center={center} />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          maxClusterRadius={60}
        >
          {properties.map((property) => (
            <Marker
              key={property.id}
              position={property.coordinates}
              icon={createCustomIcon(property.totalPrice, hoveredPropertyId === property.id)}
              zIndexOffset={hoveredPropertyId === property.id ? 1000 : 0}
              eventHandlers={{
                  click: () => {
                    onMarkerClick?.(property.id);
                  }
              }}
            >
              <Popup className="custom-popup" closeButton={false} minWidth={280} maxWidth={280}>
                 <div className="flex flex-col gap-2 p-1">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-100 mb-1">
                      <img 
                          src={property.images[0]} 
                          alt={property.title} 
                          className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-md text-[10px] font-bold">
                          {property.area} m²
                      </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-0.5 font-normal line-clamp-1">{property.fullAddress}</p>
                        <h3 className="text-sm font-bold text-[#1f2022] mb-0.5">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(property.totalPrice)}
                          <span className="text-xs font-normal text-gray-500 ml-1">/mês</span>
                        </h3>
                        <p className="text-[11px] text-gray-500 mb-2">
                          Aluguel {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(property.price)} + Cond. {property.condoFee}
                        </p>
                        <Button 
                          size="sm" 
                          className="w-full h-8 text-xs bg-[#3b44c6] hover:bg-[#2a308c]"
                          onClick={() => navigate(`/imovel/${property.id}`)}
                        >
                          Ver detalhes <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                    </div>
                 </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
