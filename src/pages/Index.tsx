import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ConsorcioBanner from "@/components/ConsorcioBanner";
import ServiceCards from "@/components/ServiceCards";
import CitiesSection from "@/components/CitiesSection";
import PopularSearches from "@/components/PopularSearches";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
