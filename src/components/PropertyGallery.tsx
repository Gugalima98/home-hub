import { useState, useMemo } from "react";
import { X, Map as MapIcon, Image as ImageIcon, Heart, Share2, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/components/PropertyCard";
import { IMAGE_CATEGORIES } from "@/schemas/propertySchema";
import Map from "@/components/Map";

interface PropertyGalleryProps {
    property: Property;
    isOpen: boolean;
    onClose: () => void;
}

export function PropertyGallery({ property, isOpen, onClose }: PropertyGalleryProps) {
    const [viewMode, setViewMode] = useState<"photos" | "map">("photos");
    const [activeCategory, setActiveCategory] = useState<string>("Sala");
    const [isFavorite, setIsFavorite] = useState(property.is_favorite);

    if (!isOpen) return null;

    // Extract categories that actually have images
    const availableCategories = useMemo(() => {
        if (!property.images) return [];

        // Sort categories based on the predefined order in schema, but only if they have images
        return IMAGE_CATEGORIES.filter(cat =>
            property.images[cat] && property.images[cat].length > 0
        ).map(cat => ({
            name: cat,
            count: property.images[cat].length,
            images: property.images[cat]
        }));
    }, [property.images]);

    // Set default category
    useMemo(() => {
        if (availableCategories.length > 0 && !availableCategories.find(c => c.name === activeCategory)) {
            setActiveCategory(availableCategories[0].name);
        }
    }, [availableCategories, activeCategory]);

    const currentImages = useMemo(() => {
        const images = availableCategories.find(c => c.name === activeCategory)?.images || [];
        return images;
    }, [activeCategory, availableCategories]);

    // Helper to format price for the header or cards
    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200 font-sans">
            {/* Header Container */}
            <div className="bg-white border-b border-gray-100 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="max-w-[1440px] mx-auto px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                        {/* Left Column: Title & Toggles */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-[#1f2022] leading-tight tracking-tight">
                                    {property.property_type || "Apartamento"} para {property.operation_type === 'rent' ? 'alugar' : 'comprar'} com {property.area}m², {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'} e {property.parking_spots > 0 ? `${property.parking_spots} vaga` : 'sem vaga'}
                                </h1>
                            </div>

                            {/* View Toggles - Pill Shaped, Gray Background */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode("photos")}
                                    className={`
                                flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border border-transparent
                                ${viewMode === 'photos'
                                            ? 'bg-[#eef2ff] text-[#3b44c6]'
                                            : 'bg-[#f3f5f6] text-gray-600 hover:bg-[#e8eaec]'
                                        }
                             `}
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    Fotos
                                </button>
                                <button
                                    onClick={() => setViewMode("map")}
                                    className={`
                                flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border border-transparent
                                ${viewMode === 'map'
                                            ? 'bg-[#eef2ff] text-[#3b44c6]'
                                            : 'bg-[#f3f5f6] text-gray-600 hover:bg-[#e8eaec]'
                                        }
                             `}
                                >
                                    <MapIcon className="w-4 h-4" />
                                    Mapa
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Actions */}
                        <div className="flex items-center gap-3 shrink-0 pt-1">
                            <Button className="hidden md:flex rounded-full bg-[#3b44c6] hover:bg-[#2a308c] text-white font-bold h-10 px-6 text-sm">
                                Fazer proposta
                            </Button>

                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 rounded-full bg-[#f3f5f6] hover:bg-gray-200 flex items-center justify-center transition-colors">
                                    <Share2 className="w-5 h-5 text-gray-700" />
                                </button>
                                <button
                                    className={`w-10 h-10 rounded-full bg-[#f3f5f6] hover:bg-gray-200 flex items-center justify-center transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-700'}`}
                                    onClick={() => setIsFavorite(!isFavorite)}
                                >
                                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                </button>
                                <button
                                    className="w-10 h-10 rounded-full bg-[#f3f5f6] hover:bg-gray-200 flex items-center justify-center transition-colors"
                                    onClick={onClose}
                                >
                                    <X className="w-5 h-5 text-gray-700" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs Bar (Gray Strip) - Only visible in photos mode */}
            {viewMode === "photos" && (
                <div className="bg-[#f8f9fa] border-b border-gray-100 sticky top-0 z-20">
                    <div className="max-w-[1440px] mx-auto px-6">
                        <div className="flex gap-8 overflow-x-auto scrollbar-hide">
                            {availableCategories.map(cat => (
                                <button
                                    key={cat.name}
                                    onClick={() => setActiveCategory(cat.name)}
                                    className={`
                                whitespace-nowrap flex items-center gap-2 text-sm pt-4 pb-3 border-b-[3px] transition-all relative top-[1px]
                                ${activeCategory === cat.name
                                            ? 'text-[#1f2022] font-extrabold border-[#1f2022]'
                                            : 'text-gray-500 font-medium border-transparent hover:text-gray-800'
                                        }
                            `}
                                >
                                    {cat.name}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-bold border border-gray-200 ${activeCategory === cat.name ? 'bg-white text-gray-800' : 'bg-white text-gray-500'
                                        }`}>
                                        {cat.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-white">
                {viewMode === "map" ? (
                    <div className="w-full h-full relative">
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            {property.latitude && property.longitude ? (
                                <Map
                                    properties={[{
                                        ...property,
                                        // @ts-ignore - Adapter for Map component which expects coordinates array
                                        coordinates: [property.latitude, property.longitude]
                                    }]}
                                    // @ts-ignore
                                    centerCoordinates={[property.latitude, property.longitude]}
                                />
                            ) : (
                                <div className="text-gray-400 font-medium">Mapa indisponível</div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-[1440px] mx-auto px-6 py-8">
                        <h2 className="text-xl font-bold text-[#1f2022] mb-6 tracking-tight">{activeCategory}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentImages.map((img, idx) => {
                                // Inject map at 3rd position (index 2) automatically if strictly following the visual rhythm
                                const isFirstCategory = activeCategory === "Sala" || activeCategory === availableCategories[0]?.name;

                                return (
                                    <>
                                        {/* Standard Image Card */}
                                        <div key={idx} className="relative group rounded-md overflow-hidden cursor-pointer bg-gray-100 aspect-[4/3] shadow-sm hover:shadow-md transition-shadow">
                                            <img
                                                src={img}
                                                alt={`${activeCategory} ${idx + 1}`}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Map Card Injection (After 2nd image) */}
                                        {isFirstCategory && idx === 1 && (
                                            <div key="map-card" className="relative rounded-md overflow-hidden bg-white shadow-sm border border-gray-100 group cursor-pointer aspect-[4/3] hover:shadow-md transition-shadow group/card" onClick={() => setViewMode("map")}>
                                                <div className="absolute inset-0 bg-[#f8f9fa] flex items-center justify-center">
                                                    {/* Stylized Map Background */}
                                                    <div className="w-full h-full opacity-100 bg-[url('https://maps.wikimedia.org/img/osm-intl,13,a,a,270x200.png')] bg-cover bg-center grayscale-[0.2] contrast-[1.1] scale-[1.3]"></div>
                                                    {/* Overlay Gradient */}
                                                    <div className="absolute inset-0 bg-white/20"></div>
                                                </div>

                                                {/* Floating White Card */}
                                                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg z-10 flex items-center justify-between border border-gray-100 transition-transform duration-300 group-hover/card:-translate-y-1">
                                                    <div className="flex-1 min-w-0 pr-2">
                                                        <p className="font-bold text-[#1f2022] text-sm truncate">{property.address?.split(',')[0] || "Endereço"}</p>
                                                        <p className="text-[11px] text-gray-500 mt-0.5 font-medium truncate">{property.neighborhood}, {property.city}</p>
                                                    </div>
                                                    <div className="text-[10px] font-bold text-[#1f2022] flex flex-col items-end shrink-0 leading-tight">
                                                        <span className="flex items-center gap-1">
                                                            Ver Rua <ArrowRight className="w-3 h-3 stroke-[3]" />
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Custom Pin */}
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full transform -mt-4 transition-transform duration-300 group-hover/card:scale-110">
                                                    <div className="w-10 h-10 bg-[#3b44c6] rounded-full flex items-center justify-center shadow-xl border-[3px] border-white">
                                                        <MapIcon className="w-4 h-4 text-white fill-white" />
                                                    </div>
                                                    {/* Pin Arrow Tip (CSS) */}
                                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#3b44c6] mx-auto mt-[-2px] relative z-0"></div>
                                                    {/* Shadow */}
                                                    <div className="w-4 h-1.5 bg-black/20 rounded-full blur-[2px] mx-auto mt-0.5"></div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
