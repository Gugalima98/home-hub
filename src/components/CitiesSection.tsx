import { useState } from "react";

interface CityLinks {
  city: string;
  links: string[];
}

const citiesData: CityLinks[] = [
  {
    city: "São Paulo",
    links: [
      "Apartamentos para alugar em SP",
      "Casas para alugar em São Paulo",
      "Apartamentos para comprar em SP",
      "Casas à venda em São Paulo",
      "Imóveis no centro de SP",
      "Condomínios em São Paulo",
    ],
  },
  {
    city: "Rio de Janeiro",
    links: [
      "Apartamentos para alugar no RJ",
      "Casas para alugar no Rio",
      "Apartamentos à venda no RJ",
      "Casas à venda no Rio",
      "Imóveis na Zona Sul",
      "Condomínios no Rio",
    ],
  },
  {
    city: "Porto Alegre",
    links: [
      "Apartamentos para alugar em POA",
      "Casas para alugar em Porto Alegre",
      "Apartamentos à venda em POA",
      "Casas à venda em Porto Alegre",
      "Imóveis no centro de POA",
    ],
  },
  {
    city: "Belo Horizonte",
    links: [
      "Apartamentos para alugar em BH",
      "Casas para alugar em BH",
      "Apartamentos à venda em BH",
      "Casas à venda em Belo Horizonte",
      "Imóveis na Savassi",
    ],
  },
  {
    city: "Campinas",
    links: [
      "Apartamentos para alugar em Campinas",
      "Casas para alugar em Campinas",
      "Apartamentos à venda em Campinas",
      "Casas à venda em Campinas",
      "Imóveis no Cambuí",
    ],
  },
];

const CitiesSection = () => {
  const [activeTab, setActiveTab] = useState<"alugar" | "comprar">("alugar");

  return (
    <section className="bg-surface py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Onde você quiser, tem um QuintoAndar
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mt-6 mb-8">
          <button
            onClick={() => setActiveTab("alugar")}
            className={`pill-tab ${
              activeTab === "alugar" ? "pill-tab-active" : "pill-tab-inactive"
            }`}
          >
            Alugar
          </button>
          <button
            onClick={() => setActiveTab("comprar")}
            className={`pill-tab ${
              activeTab === "comprar" ? "pill-tab-active" : "pill-tab-inactive"
            }`}
          >
            Comprar
          </button>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {citiesData.map((cityData) => (
            <div key={cityData.city}>
              <h3 className="font-semibold text-primary mb-3">{cityData.city}</h3>
              <ul className="space-y-2">
                {cityData.links.slice(0, 5).map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CitiesSection;
