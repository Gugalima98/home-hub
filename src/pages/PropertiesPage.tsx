import { useState } from "react";
import { Map, List, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import { mockProperties } from "@/data/mock-data";

const PropertiesPage = () => {
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  const handlePropertyHover = (id: string | null) => {
    setHoveredPropertyId(id);
  };

  const handlePropertyClick = (id: string) => {
    console.log("Clicked property:", id);
    // Navigate to property detail page
  };

  const handleMarkerClick = (id: string) => {
    console.log("Clicked marker:", id);
    // Scroll to property in list or open detail
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <FilterBar />

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Property List - Desktop */}
        <div
          className={`w-full lg:w-[60%] flex flex-col ${
            showMap ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Results Header */}
          <div className="px-4 py-4 border-b bg-background">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to="/">
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">
                    Imóveis para alugar em São Paulo
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {mockProperties.length} imóveis encontrados
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Grid */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isHighlighted={hoveredPropertyId === property.id}
                    onHover={handlePropertyHover}
                    onClick={handlePropertyClick}
                  />
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Map - Desktop */}
        <div
          className={`w-full lg:w-[40%] lg:sticky lg:top-[8.5rem] lg:h-[calc(100vh-8.5rem)] ${
            showMap ? "block" : "hidden lg:block"
          }`}
        >
          {/* Mobile Back Button */}
          {showMap && (
            <div className="lg:hidden absolute top-4 left-4 z-[1000]">
              <Button
                variant="secondary"
                className="rounded-xl shadow-lg"
                onClick={() => setShowMap(false)}
              >
                <List className="h-4 w-4 mr-2" />
                Ver lista
              </Button>
            </div>
          )}

          <PropertyMap
            properties={mockProperties}
            hoveredPropertyId={hoveredPropertyId}
            onMarkerClick={handleMarkerClick}
            onMarkerHover={handlePropertyHover}
          />
        </div>

        {/* Mobile Map Toggle Button */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Button
            onClick={() => setShowMap(!showMap)}
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
