import { Button } from "@/components/ui/button";
import consorcioImage from "@/assets/consorcio-banner.jpg";
import { useNavigate } from "react-router-dom";

const ConsorcioBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 py-12 mt-12">
      <div className="gradient-navy rounded-3xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center">
          {/* Content */}
          <div className="flex-1 p-8 md:p-12 lg:p-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Sobre a R7 Consultoria
            </h2>
            <p className="text-white/80 text-lg mb-6">
              Nossa missão é simplificar a jornada de encontrar o imóvel dos seus sonhos, combinando tecnologia de ponta com um atendimento humano e personalizado para oferecer a melhor experiência do mercado.
            </p>
            <Button 
              onClick={() => navigate('/sobre')}
              className="mt-4 bg-white text-primary hover:bg-white/90 rounded-xl"
            >
              Saiba mais
            </Button>
          </div>

          {/* Image */}
          <div className="w-full md:w-2/5 h-64 md:h-auto">
            <img
              src={consorcioImage}
              alt="Escritório da R7 Consultoria"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsorcioBanner;