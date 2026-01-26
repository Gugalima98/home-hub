import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Building2, Users, Trophy } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Sobre a R7 Consultoria | Quem Somos" 
        description="Conheça a história da R7 Consultoria, nossa missão de simplificar o mercado imobiliário e os valores que nos guiam."
      />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-[#f3f5f6] py-20 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-4 bg-white text-primary border-primary/20 px-4 py-1 text-sm font-semibold uppercase tracking-wider">
                Nossa História
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-[#1f2022] mb-6 tracking-tight leading-tight">
                Transformando a forma de viver e investir.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Nascemos com o propósito de descomplicar o mercado imobiliário. Unimos tecnologia e atendimento humanizado para conectar pessoas aos seus sonhos.
              </p>
            </div>
          </div>
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-200/50 to-transparent transform skew-x-12 translate-x-1/4" />
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10+", label: "Anos de Mercado", icon: Building2 },
                { number: "5k+", label: "Imóveis Negociados", icon: Trophy },
                { number: "15k+", label: "Clientes Felizes", icon: Users },
                { number: "98%", label: "Satisfação", icon: CheckCircle2 },
              ].map((stat, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4">
                  <div className="bg-primary/10 p-3 rounded-full mb-4 text-primary">
                    <stat.icon size={24} />
                  </div>
                  <h3 className="text-3xl font-bold text-[#1f2022] mb-1">{stat.number}</h3>
                  <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-[#1f2022] mb-4">Por que escolher a R7?</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Acreditamos que encontrar um imóvel não deve ser uma experiência estressante. Por isso, investimos em tecnologia para agilizar processos, eliminamos burocracias desnecessárias e treinamos nosso time para oferecer um suporte que realmente entende o que você precisa.
                  </p>
                </div>
                
                <div className="grid gap-6">
                  {[
                    { title: "Transparência Total", desc: "Sem letras miúdas. Você sabe exatamente o que está contratando." },
                    { title: "Agilidade Digital", desc: "Assinatura de contrato online e processos 100% digitais." },
                    { title: "Suporte Especializado", desc: "Assessoria jurídica e financeira do início ao fim." }
                  ].map((item, i) => (
                    <Card key={i} className="border-none shadow-sm bg-gray-50">
                      <CardContent className="p-6 flex gap-4">
                        <div className="mt-1 bg-white p-2 rounded-lg shadow-sm h-fit">
                          <CheckCircle2 className="text-green-600 w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1f2022] mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/5 rounded-3xl transform rotate-3" />
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Equipe R7 Consultoria" 
                  className="relative rounded-2xl shadow-2xl w-full h-[600px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-[#1f2022] text-white text-center">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl font-bold mb-6">Pronto para encontrar seu novo lar?</h2>
            <p className="text-gray-400 mb-8 text-lg">
              Explore milhares de opções em nosso catálogo e agende uma visita hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#1f2022] hover:bg-gray-100 font-bold px-8 h-14 text-base" asChild>
                <a href="/imoveis">Ver Imóveis</a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold px-8 h-14 text-base">
                Fale Conosco
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
