import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de envio
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
      });
      // Reset form seria aqui
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Fale Conosco | R7 Consultoria" 
        description="Entre em contato com a R7 Consultoria. Estamos prontos para ajudar você a alugar, comprar ou vender seu imóvel."
      />
      <Header />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-[#1f2022] mb-4">Fale com a gente</h1>
            <p className="text-gray-600 text-lg">
              Tem alguma dúvida ou precisa de ajuda? Nossa equipe está à disposição para atender você.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Info Cards */}
            <div className="md:col-span-1 space-y-6">
              <Card className="border-none shadow-md bg-[#3b44c6] text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Phone className="h-5 w-5" />
                    Atendimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-lg">(11) 99999-9999</p>
                  <p className="text-white/80 text-sm mt-1">Seg. a Sex. das 9h às 18h</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1f2022] mb-1">E-mail</h3>
                    <p className="text-gray-600">contato@r7consultoria.com.br</p>
                    <p className="text-gray-600">suporte@r7consultoria.com.br</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1f2022] mb-1">Escritório</h3>
                    <p className="text-gray-600">Av. Paulista, 1000 - Bela Vista</p>
                    <p className="text-gray-600">São Paulo - SP</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <Card className="md:col-span-2 border shadow-lg">
              <CardHeader>
                <CardTitle>Envie uma mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                      <Input required placeholder="Seu nome" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
                      <Input required placeholder="(11) 99999-9999" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">E-mail</label>
                    <Input required type="email" placeholder="seu@email.com" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Assunto</label>
                    <Input required placeholder="Sobre o que você quer falar?" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Mensagem</label>
                    <Textarea required placeholder="Digite sua mensagem aqui..." className="min-h-[150px]" />
                  </div>

                  <Button type="submit" className="w-full h-12 text-base font-bold bg-[#3b44c6] hover:bg-[#2a308c]" disabled={loading}>
                    {loading ? "Enviando..." : (
                      <>
                        Enviar Mensagem <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
