import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import illustrationRent from "@/assets/illustration-rent.png";
import illustrationBuy from "@/assets/illustration-buy.png";
import illustrationCashback from "@/assets/illustration-cashback.png";

const ServiceCards = () => {
  return (
    <section className="container mx-auto px-4 py-12 space-y-8">
      {/* Row 1: Alugar + Casas para alugar */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Alugar Card */}
        <div className="service-card service-card-purple min-h-[300px] flex flex-col justify-between">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Alugar bem, sem
              <br />
              complicação e fiador
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Aqui você não paga um ano de fiança antecipado e nem precisa de fiador. Sem burocracia, muito mais fácil e simples.
            </p>
          </div>
          <div className="flex items-end justify-between mt-6">
            <Button variant="link" className="text-primary p-0 h-auto font-medium">
              Ver apartamentos para alugar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <img
              src={illustrationRent}
              alt="Ilustração aluguel"
              className="w-32 h-32 object-contain"
            />
          </div>
        </div>

        {/* Casas para alugar Card */}
        <div className="service-card bg-secondary min-h-[300px] flex flex-col justify-between">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Destaque</span>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-2">
              Casas para
              <br />
              alugar
            </h3>
          </div>
          <div className="flex items-center justify-between mt-6">
            <Button variant="link" className="text-primary p-0 h-auto font-medium">
              Ver casas disponíveis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <button className="p-2 rounded-full bg-background shadow-sm hover:shadow-md transition-shadow">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full bg-background shadow-sm hover:shadow-md transition-shadow">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Comprar + Imóvel próprio */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Casas à venda Card */}
        <div className="service-card service-card-yellow min-h-[300px] flex flex-col justify-between">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Novidade</span>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-2">
              Casas à venda
            </h3>
            <p className="text-muted-foreground mt-2">
              Encontre a casa dos seus sonhos com total segurança e transparência.
            </p>
          </div>
          <div className="flex items-end justify-between mt-6">
            <Button variant="link" className="text-primary p-0 h-auto font-medium">
              Procurar casas à venda
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <button className="p-2 rounded-full bg-background shadow-sm hover:shadow-md transition-shadow">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full bg-background shadow-sm hover:shadow-md transition-shadow">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Comprar seu imóvel Card */}
        <div className="service-card bg-accent min-h-[300px] flex flex-col justify-between">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Comprar seu imóvel
              <br />
              e ter um cantinho só seu
            </h3>
            <p className="text-muted-foreground mt-3 max-w-sm">
              O seu sonho de conquistar o imóvel próprio pode ser realizado de forma simples, rápida e segura com a gente.
            </p>
          </div>
          <div className="flex items-end justify-between mt-6">
            <Button variant="link" className="text-primary p-0 h-auto font-medium">
              Ver apartamentos à venda
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <img
              src={illustrationBuy}
              alt="Ilustração compra"
              className="w-28 h-28 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Row 3: Novo lar + Cashback */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Conquistar novo lar Card */}
        <div className="service-card service-card-blue min-h-[300px] flex flex-col justify-between">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              Conquistar um
              <br />
              novo lar pagando
              <br />
              menos
            </h3>
            <p className="text-muted-foreground mt-3 max-w-sm">
              Com o Consórcio QuintoAndar você conquista seu imóvel pagando menos do que no financiamento tradicional.
            </p>
          </div>
          <Button variant="link" className="text-primary p-0 h-auto font-medium w-fit mt-4">
            Conhecer Consórcio QuintoAndar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Cashback Card */}
        <div className="service-card bg-muted min-h-[300px] flex flex-col justify-between">
          <div className="flex justify-between">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                Receba 10% de
                <br />
                cashback
              </h3>
              <p className="text-muted-foreground mt-3 max-w-xs">
                Exclusivo para clientes QuintoAndar que pagam o aluguel em dia.
              </p>
            </div>
            <img
              src={illustrationCashback}
              alt="Ilustração cashback"
              className="w-24 h-24 object-contain"
            />
          </div>
          <Button variant="link" className="text-primary p-0 h-auto font-medium w-fit mt-4">
            Entenda o cashback
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
