import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CityLinks {
  city: string;
  links: { label: string; url: string }[];
}

const CitiesSection = () => {
  const [activeTab, setActiveTab] = useState<"alugar" | "comprar">("alugar");
  const [rentCities, setRentCities] = useState<CityLinks[]>([]);
  const [buyCities, setBuyCities] = useState<CityLinks[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('seo_cities')
        .select('*')
        .order('city');

      if (error) {
        console.error("Erro ao buscar cidades SEO:", error);
        return;
      }

      if (data) {
        const rent = data
          .filter(item => item.operation === 'rent' && item.city !== 'Popular Searches')
          .map(item => ({ city: item.city, links: item.links }));
        
        const buy = data
          .filter(item => item.operation === 'buy' && item.city !== 'Popular Searches')
          .map(item => ({ city: item.city, links: item.links }));

        setRentCities(rent);
        setBuyCities(buy);
      }
    }

    fetchData();
  }, []);

  const currentData = activeTab === "alugar" ? rentCities : buyCities;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#1f2022] mb-6">
          Onde você quiser, tem a R7 Consultoria
        </h2>

        {/* Tabs */}
        <div className="flex bg-[#f3f5f6] p-1 rounded-full w-fit mb-12">
          <button
            onClick={() => setActiveTab("alugar")}
            className={`px-8 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "alugar"
                ? "bg-[#3b44c6] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Alugar
          </button>
          <button
            onClick={() => setActiveTab("comprar")}
            className={`px-8 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "comprar"
                ? "bg-[#3b44c6] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Comprar
          </button>
        </div>

        {/* Cities Slider */}
        <div className="relative group">
          {currentData.length === 0 ? (
            <div className="text-gray-500 py-8">Nenhuma cidade cadastrada para esta operação.</div>
          ) : (
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-4 md:gap-8 pb-4 scrollbar-hide snap-x px-4 md:px-0 -mx-4 md:mx-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {currentData.map((cityData, index) => (
                <div key={`${cityData.city}-${index}`} className="min-w-[85vw] md:min-w-[280px] flex-1 snap-center md:snap-start border-r-0 md:border-r border-gray-100 last:border-0 md:pr-8">
                  <h3 className="text-2xl font-bold text-[#3b44c6] mb-6">
                    {cityData.city}
                  </h3>
                  <ul className="space-y-3">
                    {cityData.links.map((link, idx) => (
                      <li key={idx}>
                        <a
                          href={link.url}
                          className="text-sm text-gray-600 hover:text-[#3b44c6] hover:underline transition-colors block leading-relaxed break-words"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Arrows */}
          <div className="flex justify-end gap-2 mt-8">
             <button 
                onClick={scrollLeft}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
                disabled={currentData.length === 0}
             >
               <ChevronLeft className="h-6 w-6" />
             </button>
             <button 
                onClick={scrollRight}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
                disabled={currentData.length === 0}
             >
               <ChevronRight className="h-6 w-6" />
             </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CitiesSection;
