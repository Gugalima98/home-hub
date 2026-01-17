import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FiltersSidebarProps {
  children: React.ReactNode;
}

// --- Componentes Auxiliares de Estilo ---

const FilterSectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-base font-bold text-[#1f2022] mb-4">{children}</h3>
);

// Botão estilo "Pílula" (usado para sub-filtros como "Valor total")
const FilterPill = ({ 
  label, 
  active = false, 
  onClick,
  className = "" 
}: { 
  label: string; 
  active?: boolean; 
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`
      h-10 px-5 rounded-full text-xs font-bold transition-all border
      flex items-center justify-center whitespace-nowrap
      ${active 
        ? "bg-[#eff2ff] text-[#3b44c6] border-[#eff2ff]" 
        : "bg-white text-[#1f2022] border-gray-200 hover:border-gray-300"
      }
      ${className}
    `}
  >
    {label}
  </button>
);

// Botão Redondo (Quartos, Vagas)
const CounterPill = ({ 
  label, 
  active = false, 
  onClick 
}: { 
  label: string; 
  active?: boolean; 
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`
      w-12 h-12 rounded-full text-sm font-bold transition-all border flex items-center justify-center
      ${active 
        ? "bg-[#eff2ff] text-[#3b44c6] border-[#eff2ff]" 
        : "bg-white text-[#1f2022] border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }
    `}
  >
    {label}
  </button>
);

// Helper para listas de Checkbox
const CheckboxList = ({ options, idPrefix }: { options: string[], idPrefix: string }) => (
  <div className="grid grid-cols-2 gap-y-5 gap-x-8">
    {options.map((option) => (
      <div key={option} className="flex items-center space-x-3 group cursor-pointer">
        <Checkbox
          id={`${idPrefix}-${option}`}
          className="w-6 h-6 rounded-[6px] border-gray-300 data-[state=checked]:bg-[#3b44c6] data-[state=checked]:border-[#3b44c6] transition-all"
        />
        <Label
          htmlFor={`${idPrefix}-${option}`}
          className="text-[15px] font-normal text-[#1f2022] cursor-pointer leading-tight"
        >
          {option}
        </Label>
      </div>
    ))}
  </div>
);

// --- Dados das Listas (Mantidos os que você pediu) ---

const condominioOptions = [
  "Academia", "Área verde", "Brinquedoteca", "Churrasqueira", 
  "Elevador", "Lavanderia", "Piscina", "Playground", 
  "Portaria 24h", "Quadra esportiva", "Salão de festas", 
  "Salão de jogos", "Sauna"
];

const comodidadesOptions = [
  "Apartamento cobertura", "Ar condicionado", "Banheira", "Box", 
  "Churrasqueira", "Chuveiro a gás", "Closet", "Garden/Área privativa", 
  "Novos ou reformados", "Piscina privativa", "Somente uma casa no terreno", 
  "Tanque", "Televisão", "Utensílios de cozinha", "Ventilador de teto"
];

const mobiliasOptions = [
  "Armários na cozinha", "Armários no quarto", "Armários nos banheiros", 
  "Cama de casal", "Cama de solteiro", "Mesas e cadeiras de jantar", "Sofá"
];

const bemEstarOptions = [
  "Janelas grandes", "Rua silenciosa", "Sol da manhã", "Sol da tarde", "Vista livre"
];

const eletrodomesticosOptions = [
  "Fogão", "Fogão cooktop", "Geladeira", "Máquina de lavar", "Microondas"
];

const comodosOptions = [
  "Área de serviço", "Cozinha americana", "Home-office", "Jardim", "Quintal", "Varanda"
];

const acessibilidadeOptions = [
  "Banheiro adaptado", "Corrimão", "Piso tátil", 
  "Quartos e corredores com portas amplas", "Rampas de acesso", "Vaga de garagem acessível"
];

export function FiltersSidebar({ children }: FiltersSidebarProps) {
  const [operationType, setOperationType] = useState<"rent" | "buy">("rent");
  const [priceType, setPriceType] = useState<"total" | "rent">("rent");
  const [priceRange, setPriceRange] = useState([500, 25000]);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      {/* Side="left" e largura ajustada */}
      <SheetContent side="left" className="w-full sm:w-[600px] sm:max-w-[600px] p-0 flex flex-col gap-0 border-r shadow-2xl overflow-hidden bg-white">
        
        {/* Header - Layout Igual ao Print: X na esquerda, Toggle embaixo */}
        <div className="px-6 pt-6 pb-2 flex flex-col items-start gap-6 bg-white z-10">
          <SheetClose className="rounded-full p-1 hover:bg-gray-100 transition-colors">
             <X className="h-6 w-6 text-gray-500" />
          </SheetClose>
          
          {/* Toggle Principal (Alugar/Comprar) - Estilo Sólido */}
           <div className="bg-[#f3f5f6] p-1 rounded-full flex relative w-fit">
              <button
                onClick={() => setOperationType("rent")}
                className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${
                  operationType === "rent"
                    ? "bg-[#3b44c6] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Alugar
              </button>
              <button
                onClick={() => setOperationType("buy")}
                className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${
                  operationType === "buy"
                    ? "bg-[#3b44c6] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Comprar
              </button>
            </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 bg-white">
          <div className="px-6 py-6 space-y-10 pb-32">
            
            {/* Valor */}
            <div>
              <FilterSectionTitle>Valor</FilterSectionTitle>
              {operationType === "rent" && (
                <div className="flex gap-3 mb-6">
                  <FilterPill label="Valor total" active={priceType === "total"} onClick={() => setPriceType("total")} />
                  <FilterPill label="Aluguel" active={priceType === "rent"} onClick={() => setPriceType("rent")} />
                </div>
              )}
              <div className="flex gap-4 mb-8">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-bold text-[#1f2022]">Mínimo</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1f2022] text-sm">R$</span>
                    <Input 
                      value={priceRange[0]} 
                      onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])} 
                      className="pl-10 h-14 rounded-xl border-gray-300 text-base text-[#1f2022]" 
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-bold text-[#1f2022]">Máximo</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1f2022] text-sm">R$</span>
                    <Input 
                      value={priceRange[1]} 
                      onChange={(e) => setPriceRange([priceRange[0], +e.target.value])} 
                      className="pl-10 h-14 rounded-xl border-gray-300 text-base text-[#1f2022]" 
                    />
                  </div>
                </div>
              </div>
              <div className="px-2">
                <Slider defaultValue={[500, 25000]} max={30000} step={100} value={priceRange} onValueChange={setPriceRange} className="py-2" />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Tipos de imóvel */}
            <div>
              <FilterSectionTitle>Tipos de imóvel</FilterSectionTitle>
              <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                {["Apartamento", "Casa", "Casa de Condomínio", "Kitnet/Studio"].map((type) => (
                  <div key={type} className="flex items-center space-x-3 group cursor-pointer">
                    <Checkbox
                      id={`type-${type}`}
                      className="w-6 h-6 rounded-[6px] border-gray-300 data-[state=checked]:bg-[#3b44c6] data-[state=checked]:border-[#3b44c6] transition-all"
                    />
                    <Label
                      htmlFor={`type-${type}`}
                      className="text-[15px] font-normal text-[#1f2022] cursor-pointer"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Quartos */}
            <div>
              <FilterSectionTitle>Quartos</FilterSectionTitle>
              <div className="flex gap-3">
                {["1+", "2+", "3+", "4+"].map((num, i) => <CounterPill key={num} label={num} active={i === 0} />)}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Vagas de garagem */}
            <div>
              <FilterSectionTitle>Vagas de garagem</FilterSectionTitle>
              <div className="flex gap-3 items-center">
                <FilterPill label="Tanto faz" active={true} className="h-12 px-6" />
                {["1+", "2+", "3+"].map((num) => <CounterPill key={num} label={num} />)}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Banheiros */}
            <div>
              <FilterSectionTitle>Banheiros</FilterSectionTitle>
              <div className="flex gap-3">
                {["1+", "2+", "3+", "4+"].map((num) => <CounterPill key={num} label={num} />)}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

             {/* Área */}
            <div>
              <FilterSectionTitle>Área</FilterSectionTitle>
              <div className="flex gap-4">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-bold text-[#1f2022]">Mínima</Label>
                  <div className="relative">
                    <Input className="h-14 rounded-xl border-gray-300 text-base" placeholder="0" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">m²</span>
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-bold text-[#1f2022]">Máxima</Label>
                  <div className="relative">
                    <Input className="h-14 rounded-xl border-gray-300 text-base" placeholder="Sem limite" />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">m²</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Mobiliado */}
            <div>
              <FilterSectionTitle>Mobiliado</FilterSectionTitle>
              <div className="flex gap-3">
                <FilterPill label="Tanto faz" active={true} className="h-12 px-6" />
                <FilterPill label="Sim" className="h-12 px-6" />
                <FilterPill label="Não" className="h-12 px-6" />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Aceita Pets */}
            <div>
              <FilterSectionTitle>Aceita pets</FilterSectionTitle>
              <div className="flex gap-3">
                 <FilterPill label="Tanto faz" active={true} className="h-12 px-6" />
                 <FilterPill label="Sim" className="h-12 px-6" />
                 <FilterPill label="Não" className="h-12 px-6" />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Próximo ao metrô */}
            <div>
              <FilterSectionTitle>Próximo ao metrô</FilterSectionTitle>
              <div className="flex gap-3">
                 <FilterPill label="Tanto faz" active={true} className="h-12 px-6" />
                 <FilterPill label="Sim" className="h-12 px-6" />
                 <FilterPill label="Não" className="h-12 px-6" />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Disponibilidade */}
            <div>
              <FilterSectionTitle>Disponibilidade</FilterSectionTitle>
              <div className="flex gap-3 flex-wrap">
                 <FilterPill label="Tanto faz" active={true} className="h-12 px-6" />
                 <FilterPill label="Imediata" className="h-12 px-6" />
                 <FilterPill label="Em breve" className="h-12 px-6" />
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Suites */}
            <div>
              <FilterSectionTitle>Suítes</FilterSectionTitle>
              <div className="flex gap-3">
                {["1+", "2+", "3+", "4+"].map((num) => <CounterPill key={num} label={num} />)}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Condomínio */}
            <div>
              <FilterSectionTitle>Condomínio</FilterSectionTitle>
              <CheckboxList options={condominioOptions} idPrefix="condominio" />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Comodidades */}
            <div>
              <FilterSectionTitle>Comodidades</FilterSectionTitle>
              <CheckboxList options={comodidadesOptions} idPrefix="comodidades" />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Mobílias */}
            <div>
              <FilterSectionTitle>Mobílias</FilterSectionTitle>
              <CheckboxList options={mobiliasOptions} idPrefix="mobilias" />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Bem-estar */}
            <div>
              <FilterSectionTitle>Bem-estar</FilterSectionTitle>
              <CheckboxList options={bemEstarOptions} idPrefix="bemestar" />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Eletrodomésticos */}
            <div>
              <FilterSectionTitle>Eletrodomésticos</FilterSectionTitle>
              <CheckboxList options={eletrodomesticosOptions} idPrefix="eletro" />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Cômodos */}
            <div>
              <FilterSectionTitle>Cômodos</FilterSectionTitle>
              <CheckboxList options={comodosOptions} idPrefix="comodos" />
            </div>

            <div className="h-px bg-gray-100" />

            {/* Acessibilidade */}
            <div>
              <FilterSectionTitle>Acessibilidade</FilterSectionTitle>
              <CheckboxList options={acessibilidadeOptions} idPrefix="acessibilidade" />
            </div>

          </div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="border-t p-6 bg-white sm:justify-between flex-row items-center gap-4 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <button className="text-[#3b44c6] text-sm font-bold hover:underline px-2">
            Limpar
          </button>
          <Button className="flex-1 bg-[#3b44c6] hover:bg-[#2a308c] h-12 rounded-lg font-bold text-base shadow-sm">
            Ver 37.776 imóveis
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}