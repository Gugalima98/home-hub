import { useState } from "react";
import { MapPin, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import heroImage from "@/assets/hero-family.jpg";

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState<"alugar" | "comprar">("alugar");
  const [selectedRooms, setSelectedRooms] = useState<string | null>(null);

  const roomOptions = ["1+", "2+", "3+", "4+"];

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Família feliz em casa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="max-w-2xl">
          {/* Badge */}
          <span className="inline-block mb-4 px-4 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground rounded-full animate-fade-in">
            Conheça o QuintoAndar
          </span>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Alugue um lar
            <br />
            para chamar de seu
          </h1>

          {/* Search Card */}
          <div className="search-card shadow-hero animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
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

            {/* Search Form - Desktop */}
            <div className="hidden md:grid grid-cols-4 gap-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Cidade"
                  className="input-search pl-10"
                />
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Bairro"
                  className="input-search pl-10"
                />
              </div>

              <Select>
                <SelectTrigger className="input-search">
                  <SelectValue placeholder="Valor total até" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="2000">Até R$ 2.000</SelectItem>
                  <SelectItem value="3000">Até R$ 3.000</SelectItem>
                  <SelectItem value="4000">Até R$ 4.000</SelectItem>
                  <SelectItem value="5000">Até R$ 5.000</SelectItem>
                  <SelectItem value="7500">Até R$ 7.500</SelectItem>
                  <SelectItem value="10000">Até R$ 10.000</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-1">
                {roomOptions.map((room) => (
                  <button
                    key={room}
                    onClick={() => setSelectedRooms(room)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedRooms === room
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Form - Mobile */}
            <div className="md:hidden space-y-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Cidade"
                  className="input-search pl-10"
                />
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Bairro"
                  className="input-search pl-10"
                />
              </div>

              <Select>
                <SelectTrigger className="input-search">
                  <SelectValue placeholder="Valor total até" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="2000">Até R$ 2.000</SelectItem>
                  <SelectItem value="3000">Até R$ 3.000</SelectItem>
                  <SelectItem value="5000">Até R$ 5.000</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                {roomOptions.map((room) => (
                  <button
                    key={room}
                    onClick={() => setSelectedRooms(room)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      selectedRooms === room
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Button */}
            <Button className="w-full mt-4 btn-primary h-12 text-base">
              Buscar imóveis
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
