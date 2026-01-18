import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Property } from '@/data/mock-data';
import { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Fix for default Leaflet icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Ícone de Cluster (Bolinha Azul com número) - Mais compacto
const createClusterCustomIcon = (cluster: any) => {
  return L.divIcon({
    html: `<div class="flex items-center justify-center w-full h-full bg-[#3b44c6] text-white font-bold rounded-full border-[3px] border-white shadow-lg text-xs">
             ${cluster.getChildCount()}
           </div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(34, 34, true),
  });
};

// Ícone de Marcador Individual (Bolinha Azul com "1") - Mais compacto
const createCustomIcon = (isHovered: boolean) => {
  const bgColor = isHovered ? 'bg-[#1e2476] scale-110' : 'bg-[#3b44c6]';
  return L.divIcon({
    className: 'custom-marker-single',
    html: `<div class="flex items-center justify-center w-full h-full ${bgColor} text-white font-bold rounded-full border-[2px] border-white shadow-md text-[10px] transition-all duration-200">
             1
           </div>`,
    iconSize: L.point(26, 26, true),
  });
};

// Componente invisível que escuta os movimentos do mapa
function MapController({ onBoundsChange }: { onBoundsChange: (bounds: any) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    },
    // Adicionamos zoomend explicitamente para garantir
    zoomend: () => {
      const bounds = map.getBounds();
      onBoundsChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    }
  });

  // Dispara o filtro inicial ao carregar o mapa
  useEffect(() => {
    map.invalidateSize(); // Força ajuste de layout
    const bounds = map.getBounds();
    onBoundsChange({
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    });
  }, [map]); // Dependência map está correta

  return null;
}

// Component to update map center/bounds only on initial load
function MapUpdater({ properties }: { properties: Property[] }) {
  const map = useMapEvents({});
  const hasInitialFocus = useRef(false);
  
  useEffect(() => {
    if (!hasInitialFocus.current && properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => p.coordinates));
      map.fitBounds(bounds, { 
        padding: [80, 80],
        maxZoom: 15
      });
      hasInitialFocus.current = true;
    }
  }, [properties, map]);
  
  return null;
}

interface MapComponentProps {
  properties: Property[];
  hoveredPropertyId?: string | null;
  onMarkerClick?: (id: string) => void;
  onSearchArea?: (bounds: { north: number; south: number; east: number; west: number }) => void;
}

export default function MapComponent({ properties, hoveredPropertyId, onMarkerClick, onSearchArea }: MapComponentProps) {
  const navigate = useNavigate();

  // Centro inicial (São Paulo)
  const defaultCenter: [number, number] = [-23.55052, -46.633308];
  const initialCenter = properties.length > 0 ? properties[0].coordinates : defaultCenter;

  return (
    <div className="h-full w-full relative z-0 group">
      <MapContainer
        center={initialCenter}
        zoom={13}
        minZoom={13} // Travado ainda mais perto (Bairro)
        maxZoom={18}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapUpdater properties={properties} />
        
        {/* Controlador de Eventos: Conecta o Mapa à Lista */}
        {onSearchArea && (
          <MapController onBoundsChange={onSearchArea} />
        )}

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          maxClusterRadius={300} // Aumentado para 300px (Extremo)
        >
          {properties.map((property) => (
            <Marker
              key={property.id}
              position={property.coordinates}
              icon={createCustomIcon(hoveredPropertyId === property.id)}
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