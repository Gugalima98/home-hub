import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import illustrationRent from "@/assets/illustration-rent.png";
import illustrationBuy from "@/assets/illustration-buy.png";
// Importing property images for backgrounds
import bgImage1 from "@/assets/hero-family.jpg";
import bgImage2 from "@/assets/property-1.jpg";
import bgImage3 from "@/assets/property-2.jpg";
import bgImage4 from "@/assets/property-3.jpg";
import bgImage5 from "@/assets/property-4.jpg";
import bgImage6 from "@/assets/property-5.jpg";

// --- Components ---

const CarouselHalf = ({ 
  slides 
}: { 
  slides: { title: string; desc: string; linkText: string; image: string }[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const currentSlide = slides[currentIndex];

  return (
    <div className="relative h-full min-h-[400px] group overflow-hidden bg-gray-100">
      {/* Background Image - Full Cover - Dynamic per slide */}
      <div 
        key={currentIndex} // Force re-render for animation if needed, or rely on style update
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out group-hover:scale-105"
        style={{ backgroundImage: `url(${currentSlide.image})` }}
      />
      <div className="absolute inset-0 bg-black/10" />

      {/* Floating White Card - Compact & Square-ish */}
      <div className="absolute top-0 left-0 sm:top-8 sm:left-8 bg-white p-6 sm:p-8 w-full sm:w-[320px] shadow-sm z-20">
        <h3 className="text-2xl font-bold text-[#1f2022] mb-3 leading-tight tracking-tight">
          {currentSlide.title}
        </h3>
        <p className="text-[#1f2022] text-sm mb-6 leading-relaxed font-normal">
          {currentSlide.desc}
        </p>
        <button className="group flex items-center text-sm font-bold text-[#1f2022] hover:opacity-70 transition-opacity">
          {currentSlide.linkText}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Navigation Buttons (Floating on image - Bottom Right) */}
      <div className="absolute bottom-12 right-8 flex gap-3 z-20">
        <button 
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center shadow-md transition-transform active:scale-95 text-[#1f2022]"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center shadow-md transition-transform active:scale-95 text-[#1f2022]"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Segmented Progress Bar - Bottom Full Width */}
      <div className="absolute bottom-6 left-8 right-8 flex gap-2 z-20">
        {slides.map((_, index) => (
          <div 
            key={index}
            className={`h-[3px] rounded-full flex-1 transition-colors duration-300 ${
              index === currentIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const ColorHalf = ({
  colorClass,
  title,
  desc,
  buttonText,
  illustration,
  linkText
}: {
  colorClass: string;
  title: React.ReactNode;
  desc: string;
  buttonText?: string;
  illustration: string;
  linkText?: string;
}) => {
  return (
    <div className={`relative h-full min-h-[400px] p-8 sm:p-12 flex flex-col justify-between ${colorClass}`}>
      <div className="relative z-10 max-w-[400px]">
        <h3 className="text-3xl sm:text-[2.5rem] leading-[1.1] font-bold text-[#1f2022] mb-4 tracking-tight">
          {title}
        </h3>
        <p className="text-[#1f2022] text-base leading-relaxed mb-8 max-w-[90%]">
          {desc}
        </p>
        
        {buttonText && (
          <Button className="bg-white text-primary hover:bg-gray-50 hover:text-primary font-bold rounded-full px-8 h-12 text-sm shadow-sm transition-transform hover:scale-105 w-fit">
            {buttonText}
          </Button>
        )}

        {linkText && (
           <button className="group flex items-center text-sm font-bold text-[#1f2022] hover:opacity-70 transition-opacity mt-6 w-fit">
           {linkText}
           <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
         </button>
        )}
      </div>

      {/* Illustration */}
      <img
        src={illustration}
        alt="Ilustração"
        className="absolute bottom-0 right-0 sm:right-8 w-[240px] sm:w-[320px] object-contain pointer-events-none"
      />
    </div>
  );
};

const ServiceCards = () => {
  const rentSlides = [
    {
      title: "Casas para alugar",
      desc: "Aluguel de casas para morar bem com o HomeHub.",
      linkText: "Ver casas para alugar",
      image: bgImage1
    },
    {
      title: "Kitnets para alugar",
      desc: "Praticidade e economia em espaços compactos.",
      linkText: "Ver kitnets para alugar",
      image: bgImage2
    },
    {
      title: "Apartamentos com 2 quartos",
      desc: "Apartamentos com mais quartos para você e sua família.",
      linkText: "Ver apartamentos com 2 quartos",
      image: bgImage3
    },
    {
      title: "Apartamentos mobiliados",
      desc: "Mude-se sem preocupações. Imóveis prontos para morar.",
      linkText: "Ver imóveis mobiliados",
      image: bgImage4
    }
  ];

  const buySlides = [
    {
      title: "Casas à venda",
      desc: "Encontre casas para comprar e tenha um cantinho só seu.",
      linkText: "Ver casas à venda",
      image: bgImage5
    },
    {
      title: "Apartamentos na planta",
      desc: "Invista no futuro. Lançamentos com condições especiais.",
      linkText: "Ver lançamentos",
      image: bgImage6
    },
     {
      title: "Coberturas à venda",
      desc: "Mais espaço e privacidade no topo do prédio.",
      linkText: "Ver coberturas",
      image: bgImage2 // Reusing one for variation
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16 space-y-12">
      
      {/* 
        BLOCK 1: Alugar (Roxo Esq 8 cols + Foto Dir 4 cols)
      */}
      <div className="rounded-[2.5rem] overflow-hidden grid lg:grid-cols-12 min-h-[480px]">
        {/* Left Side: Solid Color (WIDER) */}
        <div className="lg:col-span-8 h-full">
          <ColorHalf 
              colorClass="bg-[#E1D6E6]" 
              title={<>Alugar bem, sem <br/>complicação e <br/>fiador</>}
              desc="Agende visitas online, negocie sem intermediários e assine o contrato digitalmente. Sem fiador. Sem depósito caução. Sem filas."
              buttonText="Ver apartamentos para alugar"
              linkText="Como alugar no HomeHub"
              illustration={illustrationRent}
          />
        </div>
        
        {/* Right Side: Image with Floating Card (NARROWER) */}
        <div className="lg:col-span-4 h-full">
          <CarouselHalf 
              slides={rentSlides}
          />
        </div>
      </div>

      {/* 
        BLOCK 2: Comprar (Foto Esq 4 cols + Verde Dir 8 cols)
      */}
      <div className="rounded-[2.5rem] overflow-hidden grid lg:grid-cols-12 min-h-[480px]">
        <div className="lg:col-span-4 h-full">
          <CarouselHalf 
              slides={buySlides}
          />
        </div>
        <div className="lg:col-span-8 h-full">
          <ColorHalf 
              colorClass="bg-[#D3DCC8]" 
              title={<>Comprar seu <br/>imóvel e ter um <br/>cantinho só seu</>}
              desc="Conte com nossos consultores para conseguir as melhores taxas de financiamento, tirar todas as suas dúvidas e para qualquer suporte durante todo o processo."
              buttonText="Ver apartamentos à venda"
              linkText="Como comprar no HomeHub"
              illustration={illustrationBuy}
          />
        </div>
      </div>

    </section>
  );
};

export default ServiceCards;