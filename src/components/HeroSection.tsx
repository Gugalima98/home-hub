import { useState, useEffect, useMemo } from "react";
import { MapPin, Home, Wallet, BedDouble } from "lucide-react";
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
import { supabase } from "@/lib/supabase";

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
                <SelectContent className="bg-popover z-50 max-h-[300px]">
                    {items.map(item => (
                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    </div>
);

type AvailableLocation = {
  city: string;
  state: string;
  neighborhood: string;
};

const HeroSection = () => {
  const [searchType, setSearchType] = useState<"buscar" | "anunciar">("buscar");
  const [rentOrBuy, setRentOrBuy] = useState<"rent" | "buy">("rent");
  const navigate = useNavigate();

  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  
  // Dados brutos vindos do banco
  const [rawLocations, setRawLocations] = useState<AvailableLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Buscar localizações disponíveis no Supabase
  useEffect(() => {
    async function fetchLocations() {
      setLoadingLocations(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('city, state, neighborhood')
          .eq('status', 'active')
          .eq('operation_type', rentOrBuy);

        if (error) throw error;
        
        if (data) {
          // Remover duplicatas exatas de (city, state, neighborhood)
          const uniqueData = data.filter((loc, index, self) => 
            index === self.findIndex((t) => (
              t.city === loc.city && t.state === loc.state && t.neighborhood === loc.neighborhood
            ))
          );
          setRawLocations(uniqueData);
        }
      } catch (err) {
        console.error("Erro ao buscar localizações:", err);
      } finally {
        setLoadingLocations(false);
      }
    }

    fetchLocations();
    
    // Resetar seleções ao mudar o tipo de operação
    setSelectedCity('');
    setSelectedNeighborhood('');
  }, [rentOrBuy]);

  // Processar cidades únicas para o dropdown
  const cityItems = useMemo(() => {
    const citiesSet = new Set<string>();
    rawLocations.forEach(loc => {
      if (loc.city && loc.state) {
        citiesSet.add(`${loc.city}, ${loc.state}`);
      }
    });
    
    return Array.from(citiesSet).sort().map(cityStr => ({
      value: cityStr,
      label: cityStr
    }));
  }, [rawLocations]);

  // Processar bairros baseados na cidade selecionada
  const neighborhoodItems = useMemo(() => {
    if (!selectedCity) return [];
    
    const [city, state] = selectedCity.split(', ');
    
    const neighborhoods = rawLocations
      .filter(loc => loc.city === city && loc.state === state && loc.neighborhood)
      .map(loc => loc.neighborhood);
      
    // Remover duplicatas de bairros e ordenar
    return Array.from(new Set(neighborhoods)).sort().map(n => ({
      value: n,
      label: n
    }));
  }, [selectedCity, rawLocations]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("operation", rentOrBuy);
    
    if (selectedCity) {
      // Como o filtro espera apenas a string de busca ou filtros específicos,
      // vamos passar a localização para o contexto via query param ou state se possível.
      // O FilterContext atual lê de searchLocation?
      // Vamos tentar passar via query params padrão
      params.set("location", selectedCity);
    }
    
    if (selectedNeighborhood) {
       params.set("neighborhood", selectedNeighborhood);
    }

    navigate(`/imoveis?${params.toString()}`);
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
      
      <div className="container relative z-10 mx-auto px-4 md:px-0">
          {/* Search Card */}
        <div className="w-full max-w-[480px] rounded-2xl bg-white p-4 md:p-6 shadow-xl space-y-4 md:space-y-6 mx-auto md:ml-12 lg:ml-20 mt-8 md:mt-12">
          {/* Top Toggle */}
          <div className="flex w-fit bg-gray-100 rounded-full p-1 mx-auto md:mx-0">
            <button
              onClick={() => setSearchType("buscar")}
              className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
                searchType === "buscar" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Buscar Imóveis
            </button>
            <button
              onClick={() => setSearchType("anunciar")}
              className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
                searchType === "anunciar" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Anunciar Imóveis
            </button>
          </div>

          {/* Title */}
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl md:text-[2.75rem] leading-[1.1] font-bold text-[#1f2022] tracking-tight">
              Alugue um lar
              <br className="hidden md:block" />
              {" "}para chamar de seu
            </h1>
          </div>

          {/* Rent/Buy Tabs */}
          <div className="flex justify-center md:justify-start gap-6 border-b border-gray-200">
              <button 
                  onClick={() => setRentOrBuy('rent')}
                  className={`text-sm font-medium pb-3 transition-all relative ${
                    rentOrBuy === 'rent' 
                      ? 'text-primary after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                  Alugar
              </button>
              <button 
                  onClick={() => setRentOrBuy('buy')}
                  className={`text-sm font-medium pb-3 transition-all relative ${
                    rentOrBuy === 'buy' 
                      ? 'text-primary after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                  Comprar
              </button>
          </div>

          {/* Form */}
          <div className="space-y-3">
              <CustomSelect 
                icon={<MapPin size={20}/>} 
                label="Cidade" 
                placeholder={loadingLocations ? "Carregando..." : "Busque por cidade"} 
                items={cityItems} 
                onValueChange={setSelectedCity} 
                value={selectedCity}
                disabled={loadingLocations || cityItems.length === 0}
              />
              <CustomSelect 
                icon={<Home size={20}/>} 
                label="Bairro" 
                placeholder="Busque por bairro" 
                items={neighborhoodItems} 
                onValueChange={setSelectedNeighborhood} 
                value={selectedNeighborhood} 
                disabled={!selectedCity || neighborhoodItems.length === 0} 
              />
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