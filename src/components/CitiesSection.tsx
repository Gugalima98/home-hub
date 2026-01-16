import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CityLinks {
  city: string;
  links: string[];
}

const rentData: CityLinks[] = [
  {
    city: "São Paulo",
    links: [
      "Apartamentos para alugar em São Paulo",
      "Casas para alugar em São Paulo",
      "Studios e kitnets para alugar em São Paulo",
      "Casas em condomínio para alugar em São Paulo",
      "Condomínios em São Paulo",
    ],
  },
  {
    city: "Rio de Janeiro",
    links: [
      "Apartamentos para alugar em Rio de Janeiro",
      "Casas para alugar em Rio de Janeiro",
      "Studios e kitnets para alugar em Rio de Janeiro",
      "Casas em condomínio para alugar em Rio de Janeiro",
      "Condomínios no Rio de Janeiro",
    ],
  },
  {
    city: "Porto Alegre",
    links: [
      "Apartamentos para alugar em Porto Alegre",
      "Casas para alugar em Porto Alegre",
      "Studios e kitnets para alugar em Porto Alegre",
      "Casas em condomínio para alugar em Porto Alegre",
      "Condomínios em Porto Alegre",
    ],
  },
  {
    city: "Belo Horizonte",
    links: [
      "Apartamentos para alugar em Belo Horizonte",
      "Casas para alugar em Belo Horizonte",
      "Studios e kitnets para alugar em Belo Horizonte",
      "Casas em condomínio para alugar em Belo Horizonte",
      "Condomínios em Belo Horizonte",
    ],
  },
  {
    city: "Campinas",
    links: [
      "Apartamentos para alugar em Campinas",
      "Casas para alugar em Campinas",
      "Studios e kitnets para alugar em Campinas",
      "Casas em condomínio para alugar em Campinas",
      "Condomínios em Campinas",
    ],
  },
];

const buyData: CityLinks[] = [
  {
    city: "São Paulo",
    links: [
      "Apartamentos à venda em São Paulo",
      "Casas à venda em São Paulo",
      "Studios e kitnets à venda em São Paulo",
      "Casas em condomínio à venda em São Paulo",
      "Imóveis à venda em São Paulo",
    ],
  },
  {
    city: "Rio de Janeiro",
    links: [
      "Apartamentos à venda em Rio de Janeiro",
      "Casas à venda em Rio de Janeiro",
      "Studios e kitnets à venda em Rio de Janeiro",
      "Casas em condomínio à venda em Rio de Janeiro",
      "Imóveis à venda no Rio de Janeiro",
    ],
  },
  {
    city: "Porto Alegre",
    links: [
      "Apartamentos à venda em Porto Alegre",
      "Casas à venda em Porto Alegre",
      "Studios e kitnets à venda em Porto Alegre",
      "Casas em condomínio à venda em Porto Alegre",
      "Imóveis à venda em Porto Alegre",
    ],
  },
  {
    city: "Belo Horizonte",
    links: [
      "Apartamentos à venda em Belo Horizonte",
      "Casas à venda em Belo Horizonte",
      "Studios e kitnets à venda em Belo Horizonte",
      "Casas em condomínio à venda em Belo Horizonte",
      "Imóveis à venda em Belo Horizonte",
    ],
  },
  {
    city: "Campinas",
    links: [
      "Apartamentos à venda em Campinas",
      "Casas à venda em Campinas",
      "Studios e kitnets à venda em Campinas",
      "Casas em condomínio à venda em Campinas",
      "Imóveis à venda em Campinas",
    ],
  },
];

const CitiesSection = () => {
  const [activeTab, setActiveTab] = useState<"alugar" | "comprar">("alugar");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentData = activeTab === "alugar" ? rentData : buyData;

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
          Onde você quiser, tem um HomeHub
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
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {currentData.map((cityData) => (
              <div key={cityData.city} className="min-w-[200px] flex-1 snap-start">
                <h3 className="text-2xl font-bold text-[#3b44c6] mb-6 whitespace-nowrap">
                  {cityData.city}
                </h3>
                <ul className="space-y-4">
                  {cityData.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-700 hover:text-[#3b44c6] hover:underline transition-colors block leading-relaxed"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-end gap-2 mt-8">
             <button 
                onClick={scrollLeft}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
             >
               <ChevronLeft className="h-6 w-6" />
             </button>
             <button 
                onClick={scrollRight}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
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
