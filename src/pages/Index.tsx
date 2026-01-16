import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ConsorcioBanner from "@/components/ConsorcioBanner";
import ServiceCards from "@/components/ServiceCards";
import CitiesSection from "@/components/CitiesSection";
import PopularSearches from "@/components/PopularSearches";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Aluguel e Compra de Imóveis" 
        description="A maneira mais fácil de alugar e comprar imóveis. Sem fiador, sem burocracia. Encontre casas e apartamentos em São Paulo."
      />
      <Header />
      <main>
        <HeroSection />
        <ConsorcioBanner />
        <ServiceCards />
        <CitiesSection />
        <PopularSearches />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
