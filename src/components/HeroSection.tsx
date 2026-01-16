import { useState, useMemo } from "react";
import { MapPin, Home, Wallet, BedDouble, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import heroImage from "@/assets/hero-family.jpg";
import locationsData from "@/data/locations.json";

// Custom Select Component remains the same
const CustomSelect = ({ icon, label, placeholder, items, onValueChange, value, disabled }: { icon: React.ReactNode; label: string; placeholder: string; items: {value: string; label: string}[]; onValueChange?: (value: string) => void; value?: string; disabled?: boolean; }) => (
    <div className={`flex items-center gap-3 rounded-xl border bg-white p-4 h-[72px] ${disabled ? 'bg-gray-50' : ''}`}>
        <div className="text-muted-foreground">{icon}</div>
        <div className="flex flex-col w-full">
            <label className={`text-sm font-bold ${disabled ? 'text-gray-400' : 'text-foreground'}`}>{label}</label>
            <Select onValueChange={onValueChange} value={value} disabled={disabled}>
                <SelectTrigger className="border-0 p-0 h-auto justify-start focus:ring-0 focus:ring-offset-0 bg-transparent disabled:bg-transparent">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                    {items.map(item => (
                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    </div>
);


const HeroSection = () => {
  const [searchType, setSearchType] = useState<"buscar" | "anunciar">("buscar");
  const [rentOrBuy, setRentOrBuy] = useState<"alugar" | "comprar">("alugar");
  const navigate = useNavigate();

  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [neighborhoods, setNeighborhoods] = useState<{value: string, label: string}[]>([]);

  const mainCities = [
    'São Paulo, SP', 'Rio de Janeiro, RJ', 'Belo Horizonte, MG', 'Brasília, DF', 
    'Salvador, BA', 'Fortaleza, CE', 'Curitiba, PR', 'Recife, PE', 
    'Porto Alegre, RS', 'Manaus, AM', 'Goiânia, GO', 'Belém, PA'
  ];
  
  const spNeighborhoods = ["Jardins", "Bela Vista", "Consolação", "Jardim Europa", "Pinheiros", "Vila Madalena", "Moema", "República", "Perdizes", "Itaim Bibi"];

  const normalizeStr = (str: string) => 
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Memoize the city list creation as it's a heavy operation
  const cityItems = useMemo(() => {
    const cities: { value: string; label: string }[] = [];
    for (const state in locationsData) {
      for (const city in locationsData[state as keyof typeof locationsData]) {
        const value = `${city}, ${state}`;
        cities.push({ value: value, label: value });
      }
    }
    
    // Manually add São Paulo if it's not present
    if (!cities.some(c => c.value === 'São Paulo, SP')) {
      cities.push({ value: 'São Paulo, SP', label: 'São Paulo, SP' });
    }
    
    // Normalize main cities for robust comparison
    const normalizedMainCities = mainCities.map(normalizeStr);

    // Filter for main cities and then sort
    return cities
      .filter(city => normalizedMainCities.includes(normalizeStr(city.value)))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const handleCityChange = (cityValue: string) => {
    setSelectedCity(cityValue);
    setSelectedNeighborhood(''); // Reset neighborhood
    
    if (cityValue === 'São Paulo, SP') {
      setNeighborhoods(spNeighborhoods.map(n => ({ value: n, label: n })).sort((a,b) => a.label.localeCompare(b.label)));
    } else if (cityValue) {
      const [cityName, stateAbbr] = cityValue.split(', ');
      const neighborhoodsData = locationsData[stateAbbr as keyof typeof locationsData]?.[cityName] || [];
      setNeighborhoods(neighborhoodsData.map(n => ({ value: n, label: n })).sort((a,b) => a.label.localeCompare(b.label)));
    } else {
      setNeighborhoods([]);
    }
  };

  const handleSearch = () => {
    navigate("/imoveis");
  };

  const valueItems = [
    { value: "2000", label: "Até R$ 2.000" },
    { value: "3000", label: "Até R$ 3.000" },
    { value: "5000", label: "Até R$ 5.000" },
    { value: "10000", label: "Até R$ 10.000" },
  ];

  const roomItems = [
    { value: "1", label: "1+ quartos" },
    { value: "2", label: "2+ quartos" },
    { value: "3", label: "3+ quartos" },
    { value: "4", label: "4+ quartos" },
  ];

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Família feliz em casa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      <div className="container relative z-10 mx-auto">
                  {/* Search Card */}
                <div className="w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl space-y-6 ml-0 md:ml-12 lg:ml-20 mt-12">
                  {/* Top Toggle */}
                  <div className="flex w-fit bg-gray-100 rounded-full p-1">
                    <button
                      onClick={() => setSearchType("buscar")}
                      className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                        searchType === "buscar" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Buscar Imóveis
                    </button>
                    <button
                      onClick={() => setSearchType("anunciar")}
                      className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                        searchType === "anunciar" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Anunciar Imóveis
                    </button>
                  </div>
        
                  {/* Title */}
                  <div className="space-y-2 text-left">
                    <h1 className="text-4xl md:text-[2.75rem] leading-[1.1] font-bold text-[#1f2022] tracking-tight">
                      Alugue um lar
                      <br />
                      para chamar de seu
                    </h1>
                  </div>
        
                  {/* Rent/Buy Tabs */}
                  <div className="flex justify-start gap-6 border-b border-gray-200">
                      <button 
                          onClick={() => setRentOrBuy('alugar')}
                          className={`text-sm font-medium pb-3 transition-all relative ${
                            rentOrBuy === 'alugar' 
                              ? 'text-primary after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary' 
                              : 'text-gray-500 hover:text-gray-800'
                          }`}
                      >
                          Alugar
                      </button>
                      <button 
                          onClick={() => setRentOrBuy('comprar')}
                          className={`text-sm font-medium pb-3 transition-all relative ${
                            rentOrBuy === 'comprar' 
                              ? 'text-primary after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary' 
                              : 'text-gray-500 hover:text-gray-800'
                          }`}
                      >
                          Comprar
                      </button>
                  </div>
        
                  {/* Form */}
                  <div className="space-y-3">
                      <CustomSelect icon={<MapPin size={20}/>} label="Cidade" placeholder="Busque por cidade" items={cityItems} onValueChange={handleCityChange} value={selectedCity}/>
                      <CustomSelect icon={<Home size={20}/>} label="Bairro" placeholder="Busque por bairro" items={neighborhoods} onValueChange={setSelectedNeighborhood} value={selectedNeighborhood} disabled={!selectedCity} />
                      <div className="grid grid-cols-2 gap-3">
                          <CustomSelect icon={<Wallet size={20}/>} label="Valor total até" placeholder="Escolha o valor" items={valueItems} />
                          <CustomSelect icon={<BedDouble size={20}/>} label="Quartos" placeholder="Nº de quartos" items={roomItems} />
                      </div>
                  </div>
        
                  {/* Search Button */}
                  <Button onClick={handleSearch} className="w-full h-12 text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 shadow-md">
                    Buscar imóveis
                  </Button>
                </div>
              </div>
            </section>
          );
        };
export default HeroSection;