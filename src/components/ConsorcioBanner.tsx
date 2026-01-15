import { Button } from "@/components/ui/button";
import consorcioImage from "@/assets/consorcio-banner.jpg";

const ConsorcioBanner = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="gradient-navy rounded-3xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center">
          {/* Content */}
          <div className="flex-1 p-8 md:p-12 lg:p-16">
            <span className="inline-block mb-4 px-3 py-1 text-xs font-medium bg-white/10 text-white/90 rounded-full">
              Consórcio QuintoAndar
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Um consórcio inteligente pra
              <br />
              conquistar seu novo lar
              <br />
              pagando menos
            </h2>
            <Button className="mt-4 bg-white text-primary hover:bg-white/90 rounded-xl">
              Saiba mais
            </Button>
          </div>

          {/* Image */}
          <div className="w-full md:w-2/5 h-64 md:h-auto">
            <img
              src={consorcioImage}
              alt="Consórcio QuintoAndar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsorcioBanner;
